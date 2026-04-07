const mysql = require('mysql2');

const db = mysql.createConnection({
    host : 'localhost',
    user: 'root',
    password:'123',
    database: 'carwash'
});

db.connect( err => {
    if(err) {
        console.error('error connecting to mysql', err.message);
        return;
    }
    console.log("Connection established.")
});

module.exports = db;