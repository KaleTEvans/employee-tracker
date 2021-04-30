const mysql = require('mysql2');
require('dotenv').config();
const dotenv = require('dotenv');

const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.database
    },
    console.log('Connected to the employee database')
);

const result = dotenv.config();

if (result.error) {
    throw result.error
}

console.log(result.parsed);

module.exports = db;