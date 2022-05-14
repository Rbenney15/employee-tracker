const mysql = require("mysql2")

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: 'root',
    password: 'u7q3*7bHZVmpuQZc@baP6bJmG',
    database: 'employee_db'
})

// Connection ID
connection.connect(function(err) {
    if (err) throw err;
});

module.exports = db;