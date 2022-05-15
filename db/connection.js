// require('dotenv').config();

const mysql = require('mysql2');

// connect app to MySQL database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username, 'root' is default user
        user: 'root',
        // MySQL password
        password: 'password',
        database: 'employee_db'
    }
);
// export for use in server.js
module.exports = db;
