const { Pool } = require('pg');
const poolFile = new Pool({
    host: '45.154.26.35',
    user: 'postgres',
    port: 5432,
    password: 'Ai123456@TCS@ATT',
    database: 'attachfile_erpdb'
});

module.exports = poolFile;