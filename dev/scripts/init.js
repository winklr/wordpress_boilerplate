const utils = require('./utils');
const sh = require('shelljs');
const spawn = require('child_process').spawnSync;

const baseDir = __dirname;

let packageManager = '';
dependencies = ['yarn', 'npm'];
for (let dependency of dependencies) {
    if (sh.exec(`hash ${dependency} 2>/dev/null`, {silent: true}).code === 0) {
        packageManager = dependency;
        break;
    }
}
if (packageManager === '') {
    utils.halt('Could not find any Node package manager (\'yarn\' or \'npm\').');
}

// install build dependencies (Gulp + extensions)
const installDependencies = () => {
    utils.echo('Installing build dependencies...');
    spawn(`${packageManager}`, ['install'], { stdio: 'inherit' });

    // install initial front-end dependencies
    utils.echo('Installing front-end dependencies...');
    sh.cd('src');
    spawn(`${packageManager}`, ['install'], { stdio: 'inherit' });
    sh.cd('..');
    sh.exec('docker-compose run -u www-data composer');
};

const updateCompose = () => {
    sh.cd(baseDir);
    utils.echo('Updating docker-compose with current user id and group ...');
    spawn('npm', ['run', 'compose'], { stdio: 'inherit' });
};

installDependencies();
updateCompose();