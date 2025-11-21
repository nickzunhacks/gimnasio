const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'basededatosgym.mysql.database.azure.com',
    user: 'NicoAdmin',
    password: 'Lori0203',
    database: 'basededatosgym',
    port: 3306,

    ssl: {
        rejectUnauthorized: true
    }
});

connection.connect((err) => {
    if (err) {
        console.log('Error al conectar a MySQL en azure:', err.message);
    } else {
        console.log('Conexión exitosa a MySQL azure.');
    }
});

module.exports = connection;