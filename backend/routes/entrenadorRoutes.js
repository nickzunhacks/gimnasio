const express = require('express');
const connection = require('../db');
const router = express.Router();

router.get('/buscar_usuario', (req, res) => {

    const codigo = req.query.codigo;

    const patron = `%${codigo}%`;

    const query = 'SELECT name, code FROM users WHERE CAST(code AS CHAR) LIKE ?';

    connection.query(query, [patron], (err, results) => {
    if (err) { 

        console.log("error al obtener rutina: ", err);
        res.status(500).json({ error: 'Error al obtener la rutina de este dia'});
        return;

    }
    res.json(results)
    }); 

});

module.exports = router;