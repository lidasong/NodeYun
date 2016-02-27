var mysql = require('mysql');

exports.connection = mysql.createConnection({
    host: 'localhost',
    user: 'lds',
    password: 'lds',
    port: 3306,
    database: 'webo'
});
