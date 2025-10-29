const express = require('express');
const bcrypt = require('bcrypt');
const connection = require('../db');
const router = express.Router();

router.post('/registrar', async (req, res) => {
    const { nombre, correo, codigo, contrasena } = req.body;

    try {
        const hash = await bcrypt.hash(contrasena, 10);
        const query = 'INSERT INTO users (name, email, code, password) VALUES (?, ?, ?, ?)';

        connection.query(query, [nombre, correo, codigo, hash], (err) => {
            if (err) {
                console.log('Error al insertar usuario:', err);
                return res.status(500).json({ message: 'Error al registrar el usuario' });
            }
            res.json({ message: 'Usuario registrado con éxito' });
        });
    } catch (err) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.post('/login', async (req, res) => {
    const { codigo, contrasena } = req.body;
    const query = 'SELECT * FROM users WHERE code = ?';

    connection.query(query, [codigo], async (err, result) => {
        if (err) return res.status(500).json({ message: 'Error en el servidor' });
        if (result.length === 0) return res.status(401).json({ message: 'Usuario no registrado' });

        const user = result[0];
        const esValido = await bcrypt.compare(contrasena, user.password);

        if (!esValido) return res.status(401).json({ message: 'Contraseña incorrecta' });

        req.session.user = {
            nombre: user.name,
            code: user.code,
            email: user.email,
            rol: user.rol
        };

        res.json({message: 'Inicio de sesión exitoso', usuario: req.session.user });
    });
});

module.exports = router;
