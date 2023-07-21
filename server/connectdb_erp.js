const { Pool } = require('pg')
const poolERP = new Pool({
    host: '45.154.26.37',
    user: 'postgres',
    port: 5432,
    password: 'Ai123456@TCS',
    database: 'erpdb'
});

module.exports = poolERP;