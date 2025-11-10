const express = require('express');
const connection = require('../db');
const router = express.Router();

router.get('/api/usuario', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No has iniciado sesión' });
    }
    res.json(req.session.user);
});

router.get('/rutina_dia', (req, res) => {

    const dia = req.query.dia;
    const rol = req.session.user.rol
    let codigoUsuario = null

    if (rol === "entrenador") {
        codigoUsuario = req.query.codigo 
    } else {
        codigoUsuario = req.session.user.code;
    }

    console.log("dia: ",dia);
    console.log("codigo usuario: ",codigoUsuario);
    console.log("rol: ", rol);

    const query = `SELECT 

        ejercicios.url_formateada,
        ejercicios.nombre,
        rutina_ejercicio.peso,
        rutina_ejercicio.repeticiones,
        rutina_ejercicio.series,
        rutina_ejercicio.descanso

        FROM rutina_ejercicio
        JOIN ejercicios ON rutina_ejercicio.id_ejercicio = ejercicios.id_ejercicio
        JOIN rutina ON rutina.id_ruitna = rutina_ejercicio.id_ruitna AND rutina.id_deportista = ?
        WHERE rutina.dia = ?`

        connection.query(query, [codigoUsuario, dia], (err, results) => {

            if (err) { 

                console.log("error al obtener rutina: ", err);
                res.status(500).json({ error: 'Error al obtener la rutina de este dia'});
                return;

            }

            res.json(results)

        });

});

module.exports = router;
