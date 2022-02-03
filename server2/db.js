import pkg from 'pg';
const { Pool } = pkg;
//const Pool = require("pg").Pool;

export const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password: "123123",
    port: 5432,
    database: "gms"
});

//module.exports = pool;