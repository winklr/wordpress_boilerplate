const utils = require('./utils');
const yargs = require('yargs');
const fs = require('fs');
const reduce = require('lodash/reduce');
const maxBy = require('lodash/maxBy');

yargs
    .command('default', 'import default dump (initialDump.sql) from /dbDump', () => {}, () => {
        utils.echo('importing default database (/dbDump/initialDump.sql) ...');

        utils.wp(`db import /dbDump/initialDump.sql`);
    })
    .command('latest', 'import latest database dump from /dbDump', () => {}, () => {
        const files = fs.readdirSync(process.cwd() + '/dbDump/');
        const regex = /^.*(\d{4}-[01]\d-[0-3]\dT[0-2]\d[:_][0-5]\d[:_][0-5]\d\.\d+([+-][0-2]\d[:_][0-5]\d|Z)).sql$/;

        const dateFiles = reduce(files, (accu, filename) => {
            const dateString = regex.exec(filename);
            if (!!dateString) accu.push({
                date: dateString[1],
                fileName: dateString[0]
            });

            return accu;
        }, []);

        const latestFile = maxBy(dateFiles, ({ date }) => new Date(date));
        utils.echo(`importing latest database (dbDump/${latestFile.fileName}) ...`);

        utils.wp(`db import /dbDump/${latestFile.fileName}`);
    })
    .help()
    .argv;
