const utils = require('./utils');

const exportDatabase = () => {
    utils.echo('Exporting database ...');

    utils.wp(`db export /dbDump/db_dump_${(new Date()).toISOString()}.sql`);
};

exportDatabase();