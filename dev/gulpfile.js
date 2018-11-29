var gulp = require('gulp'),
	autoprefixer = require('autoprefixer'),
	browserSync = require('browser-sync').create(),
	concat = require('gulp-concat'),
	changed = require('gulp-changed'),
	cssnano = require('gulp-cssnano'),
	del = require('del'),
	exec = require('child_process').execSync,
	mergeStream = require('merge-stream'),
	fs = require('fs'),
	imagemin = require('gulp-imagemin'),
	jshint = require('gulp-jshint'),
	log = require('fancy-log'),
	rename = require('gulp-rename'),
	sourcemaps = require('gulp-sourcemaps'),
	path = require('path'),
	postcss = require('gulp-postcss'),
	postcssImport = require('postcss-import'),
	postcssFontpath = require('postcss-fontpath'),
	postcssEach = require('postcss-each'),
	postcssMixins = require('postcss-mixins'),
	postcssNested = require('postcss-nested'),
	postcssNestedProps = require('postcss-nested-props'),
	postcssReporter = require('postcss-reporter'),
	postcssSimpleVars = require('postcss-simple-vars'),
	posthtml = require('gulp-posthtml'),
    sass = require('gulp-sass'),
	tap = require('gulp-tap'),
	uglify = require('gulp-uglify'),
	webpackStream = require('webpack-stream'),
	webpack = require('webpack'),
	yaml = require('js-yaml');

var argv = require('yargs').argv;

// Load project settings
var packageData;
try {
	packageData = require('./src/package.json');
} catch (ex) {
	console.error('Error loading source `package.json` file.', ex);
	return;
}
var settings = {
	slug: packageData.name,
	title: packageData.description,
	author: packageData.author
};
try {
	settings.webPort = exec('docker-compose port web 80').toString().replace(/^.*:(\d+)\n$/g, '$1');
	settings.dbPort = exec('docker-compose port db 3306').toString().replace(/^.*:(\d+)\n$/g, '$1');
} catch (ex) {
	console.error('Error obtaining containers access ports.', ex);
	return;
}

// Load optional imports file
try {
	settings.imports = yaml.safeLoad(fs.readFileSync('./config/imports.yml', 'utf8'));
} catch (ex) {
	settings.imports = {}; // ignore
}
settings.imports.plugins = settings.imports.plugins || [];
settings.imports.plugins = settings.imports.plugins.map(function(pluginOrPath) {
	var plugin = (pluginOrPath instanceof Object) ? pluginOrPath : { path: pluginOrPath };

	plugin.path = path.resolve(plugin.path.replace(/^~/, require('os').homedir()));
	plugin.watch = plugin.watch || '**/*.{php,css,js}';
	plugin.watchPath = path.join(plugin.path, plugin.watch);
	plugin.include = plugin.include || '**';
	plugin.src = [path.join(plugin.path, plugin.include)];
	if (plugin.exclude) {
		plugin.src.push('!' + path.join(plugin.path, plugin.exclude));
	}

	return plugin;
});

// Paths for remapping
var base = {
	dev: './',
	src: './src/',
	acfRelativeSrc: '../../../../src/',
	theme: './www/wp-content/themes/' + settings.slug + '/',
	plugins: './www/wp-content/plugins/'
};

// Globs for each file type
var glob = {
	functions: base.src + 'includes/*.php',
	includes: base.src + 'includes/**/*',
	controllers: base.src + 'templates/controllers/**/*.php',
	views: base.src + 'templates/views/**/*.twig',
	styles: base.src + 'assets/css/**/*.{css,pcss}',
	scripts: base.src + 'assets/js/**/*.js',
	images: base.src + 'assets/img/**/*',
	fonts: base.src + 'assets/fonts/**/*',
	styleMain: base.src + 'assets/css/main.scss',
	scriptMain: base.src + 'assets/js/main.js',
};

// Build folder slugs
var dest = {
	acf: 'acf-json',
	includes: 'inc',
	controllers: '', // Templates go in the theme's root folder
	views: 'views',
	styles: 'css',
	scripts: 'js',
	images: 'img',
	fonts: 'fonts'
};

// Plugin options
var options = {
	uglify: { mangle: false },
	imagemin: { optimizationLevel: 7, progressive: true, interlaced: true, multipass: true },
	postcss: [
		postcssImport,
		postcssMixins,
		postcssEach,
		postcssSimpleVars({
			unknown: function (node, name, result) {
				node.warn(result, 'Unknown variable ' + name);
			}
		}),
		postcssNestedProps,
		postcssNested,
		postcssFontpath,
		postcssReporter({clearMessages: true}),
		autoprefixer({browsers: ['last 3 versions']})
	]
};

// Erase build and theme folders before each compile
function clean() {
	return del([base.theme], {force: true})
		.then(function() {
			fs.mkdirSync(base.theme);
		});
}

// Header: auto-create style.css using project info we already have
function header(cb) {
	var data = '/*\r\n'
		+ 'Theme Name: ' + settings.title + '\r\n'
		+ 'Author: ' + settings.author['name'] + '\r\n'
		+ (settings.author['url'] ? 'Author URI: ' + settings.author['url'] + '\r\n' : '')
		+ '*/';
	fs.writeFileSync(base.theme + 'style.css', data);
	cb();
}

// Acf: create a symlink to ACF JSON in theme folder so that the source and theme are always in sync
function acf(cb) {
	// Symlink to absolute path in VM (it must be synced on the guest but not necessarily on the host)
	fs.symlinkSync(base.acfRelativeSrc + dest.acf, base.theme + dest.acf);
	cb();
}

// Functions: auto-create functions.php with root level PHP includes
function functions(cb) {
	fs.writeFileSync(base.theme + 'functions.php', '<?php\r\n');
	return gulp.src(glob.functions)
		.pipe(tap(function(file) {
			fs.appendFileSync(base.theme + 'functions.php', "require_once(get_stylesheet_directory() . '/" + dest.includes + '/' + file.path.replace(file.base, '') + "');\r\n");
		}));
	cb();
}

// Includes: copy all project and vendor includes
function includes() {
	return gulp.src(glob.includes)
		.pipe(changed(base.theme + dest.includes))
		.pipe(gulp.dest(base.theme + dest.includes))
		.pipe(browserSync.stream());
}

// Controllers: copy PHP files
function controllers() {
	return gulp.src(glob.controllers)
		.pipe(changed(base.theme + dest.controllers))
		.pipe(gulp.dest(base.theme + dest.controllers))
		.pipe(browserSync.stream());
}

// Views: copy Twig files
function views() {
	return gulp.src(glob.views)
		.pipe(changed(base.theme + dest.views))
		.pipe(posthtml())
		.pipe(gulp.dest(base.theme + dest.views))
		.pipe(browserSync.stream());
}

// Styles (CSS): lint, concatenate into one file, write source map, preprocess, save full and minified versions, then copy
function styles() {
	return gulp.src(glob.styleMain)
		.pipe(sass().on('error', function(err) {
			log.error(err.message)
		}))
		.pipe(postcss(options.postcss)
			.on('error', function(error) {
				console.error(error.message);
				this.emit('end');
			})
		)
		.pipe(concat('main.css'))
		.pipe(sourcemaps.init())
		.pipe(gulp.dest(base.theme + dest.styles))
		.pipe(browserSync.stream({match: '**/*.css'}))
		.pipe(cssnano())
		.pipe(rename('main.min.css'))
		.pipe(sourcemaps.write('.'))
		.pipe(changed(base.theme + dest.styles))
		.pipe(gulp.dest(base.theme + dest.styles))
		.pipe(browserSync.stream({match: '**/*.css'}));
}

// Scripts (JS): get third-party dependencies, concatenate all scripts into one file, save full and minified versions, then copy
function scripts(done) {
    const environment = (argv.production === undefined) ? 'development':'production';

    return gulp.src(glob.scriptMain)
        .pipe(jshint({ esversion: 6 }))
        .pipe(jshint.reporter())
        .pipe(webpackStream(require('./webpack.config')(environment), webpack)
            .on('error', function(error) { this.emit('end'); })
        )
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(gulp.dest(base.theme + dest.scripts))
        .pipe(browserSync.stream())
        // .pipe(uglify(options.uglify))
        // .pipe(rename('main.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(changed(base.theme + dest.scripts))
        .pipe(gulp.dest(base.theme + dest.scripts))
        .pipe(browserSync.stream());
}

// Images: optimise and copy, maintaining tree
function images() {
	return gulp.src(glob.images)
		.pipe(changed(base.theme + dest.images))
		.pipe(imagemin(options.imagemin))
		.pipe(gulp.dest(base.theme + dest.images))
		.pipe(browserSync.stream());
}

// Fonts: just copy, maintaining tree
function fonts() {
	return gulp.src(glob.fonts)
		.pipe(changed(base.theme + dest.fonts))
		.pipe(gulp.dest(base.theme + dest.fonts))
		.pipe(browserSync.stream());
}

// Imports: extra folders to be copied
function imports(cb) {
	var importsPipes = [];
	settings.imports.plugins.forEach(function(plugin) {
		importsPipes.push(
			gulp.src(plugin.src, { base: path.dirname(plugin.path) })
				.pipe(changed(base.plugins))
				.pipe(gulp.dest(base.plugins))
				.pipe(browserSync.stream())
		)
	});
	if (importsPipes.length > 0) {
		return mergeStream(importsPipes);
	}
	cb();
}

// Wordmove Docker: add full container Wordpress path to the final Movefile with the almost complete template
function wordmove(cb) {
    // Load Wordmove settings file
    try {
        var wordmove = yaml.safeLoad(fs.readFileSync('./config/wordmove.yml', 'utf8')) || {};
        wordmove.local = wordmove.local || {};
        wordmove.local.vhost = `localhost:${settings.webPort}`;
        wordmove.local.wordpress_path = '/var/www/html';
        wordmove.local.database = wordmove.local.database || {};
        wordmove.local.database.name = 'wordpress';
        wordmove.local.database.user = 'wordpress';
        wordmove.local.database.password = 'wordpress';
        wordmove.local.database.host = 'db';
        wordmove.local.database.port = '3306';
        fs.writeFileSync(path.resolve(`${__dirname}/www/Movefile.yml`), yaml.safeDump(wordmove));
    } catch (ex) {
        console.error('Error generating Movefile:', ex);
    }
    cb();
}
// Update WP config URLs with access port dynamically assigned by Docker to expose Web container port 80
function wpconfig(cb) {
	// Get current port in WordPress to check if it matches the current Web container port
	var dockerCmd = 'docker-compose exec -u www-data -T wp',
		wpPort = exec(dockerCmd + ' wp option get siteurl').toString().replace(/^.*:(\d+)\n$/g, '$1');
	if (wpPort != settings.webPort) {
		// Ports needs to be updated
		console.log('Updating WordPress port from ' + wpPort + ' to ' + settings.webPort + '...');
		exec(dockerCmd + ' wp search-replace --quiet "localhost:' + wpPort + '" "localhost:' + settings.webPort + '"');
		exec(dockerCmd + ' bash -c \'wp option update home "http://localhost:' + settings.webPort + '" && wp option update siteurl "http://localhost:' + settings.webPort + '"\'');
	}
	outputSeparator = ' \x1b[36m' + '-'.repeat(37 + settings.webPort.toString().length) + '\x1b[0m';
	console.log('\x1b[1m' + settings.title + ' (' + settings.slug + ') access URLs:\x1b[22m');
	console.log(outputSeparator);
	console.log(' 🌍  WordPress: \x1b[35mhttp://localhost:' + settings.webPort + '/\x1b[0m');
	console.log(' 🔧  Admin: \x1b[35mhttp://localhost:' + settings.webPort + '/wp-admin/\x1b[0m');
	console.log(' 🗃  Database: \x1b[35mlocalhost:' + settings.dbPort + '\x1b[0m');
	console.log(outputSeparator);
	cb();
}

function watch() {
	// Initialise BrowserSync
	console.log('Starting BrowserSync...');
	browserSync.init({
		proxy: 'localhost:' + settings.webPort,
		open: false,
		logPrefix: settings.slug + ' http://localhost:' + settings.webPort
	});
	gulp.watch(glob.functions, gulp.series(functions));
	gulp.watch(glob.includes, gulp.series(includes));
	gulp.watch(glob.controllers, gulp.series(controllers));
	gulp.watch(glob.views, gulp.series(views));
	gulp.watch(glob.styles, gulp.series(styles));
	gulp.watch(glob.scripts, gulp.series(scripts));
	gulp.watch(glob.images, gulp.series(images));
	gulp.watch(glob.fonts, gulp.series(fonts));
	settings.imports.plugins.forEach(function(plugin) {
		gulp.watch(plugin.watchPath, gulp.series(imports));
	});
}

// Build: sequences all the other tasks
gulp.task('build', gulp.series(clean, gulp.parallel(header, acf, functions, includes, controllers, views, styles, scripts, images, fonts, imports, wordmove)));

// Wpconfig: update Docker dynamic ports in Wordpress config
gulp.task('wpconfig', wpconfig);

// Watch: fire build, then watch for changes
gulp.task('default', gulp.series('build', 'wpconfig', watch));
