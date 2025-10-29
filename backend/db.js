const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'basededatosgym'
});

connection.connect((err) => {
    if (err) {
        console.log('Error al conectar a MySQL:', err);
    } else {
        console.log('Conexión exitosa a MySQL.');
        console.log('http://localhost/phpmyadmin/index.php');
    }
});

module.exports = connection;