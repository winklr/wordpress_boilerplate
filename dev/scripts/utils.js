const sh = require('shelljs');
const yaml = require('js-yaml');
const fs = require('fs');

const halt = message => {
    console.error(`\x1b[1m\x1b[41m[WP_Boilerplate]\x1b[0m ⚠️  ${message}`);
    process.exit(1)
};

const echo = message => {
    console.log(`\x1b[7m[WP_Boilerplate]\x1b[27m 🏭  ${message}`);
};

const getDockerCmd = () => {

    try {
        const settings = yaml.safeLoad(fs.readFileSync(`${process.cwd()}/config/setup.yml`));
        const containerName = `${settings.slug}_wp`;

        let dockerCmd = 'docker-compose exec -T -u www-data wp wp';

        // check, if wp container is running
        if(sh.exec(`docker inspect -f {{.State.Running}} ${containerName}`, { silent: true}).code !== 0) {
            dockerCmd = `docker-compose run --rm wp wp --allow-root`
        }

        return dockerCmd;
    } catch (e) {
        halt(e)
    }
};

const wp = command => {
    const dockerCmd = getDockerCmd();

    if (sh.exec(`${dockerCmd} ${command}`).code !== 0) {
        halt(`Failed to execute: '${dockerCmd} ${command}'`);
    }
};

module.exports = {
    echo,
    getDockerCmd,
    halt,
    wp
};