yaml = require('js-yaml');
fs = require('fs');
objectPath = require('object-path');
sh = require('shelljs');

const update = () => {
    try {
        const composer = yaml.safeLoad(fs.readFileSync(`${process.cwd()}/docker-compose.yml`));

        const uid = parseInt(sh.exec('id -u $(whoami)', {silent: true}).stdout.trim());
        const gid = parseInt(sh.exec('id -g $(whoami)', {silent: true}).stdout.trim());

        objectPath.set(composer, 'services.wp.build.args.UID', uid);
        objectPath.set(composer, 'services.wp.build.args.GID', gid);

        const composerYaml = yaml.safeDump(composer);
        sh.ShellString(composerYaml).to(`${process.cwd()}/docker-compose.yml`);
    } catch (e) {
        console.log(e);
    }

};

update();