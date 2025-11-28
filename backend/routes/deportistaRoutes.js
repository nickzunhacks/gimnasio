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
        JOIN rutina ON rutina.id_rutina = rutina_ejercicio.id_rutina AND rutina.id_deportista = ?
        WHERE rutina.dia = ?`

        connection.query(query, [codigoUsuario, dia], (err, results) => {

            if (err) { 

                console.log("error al obtener rutina: ", err.message);
                res.status(500).json({ error: 'Error al obtener la rutina de este dia'});
                return;

            }

            console.log(results);
            res.json(results)

        });

});

router.post('/registrar_ejercicio', (req, res) => {

    const {peso, reps, series, descanso, fecha, comentario, idEjercicio} = req.body;
    const codigoUsuario = req.session.user.code;
    
    const query = "INSERT INTO rutina_registro VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)";

    connection.query(query, [idEjercicio, codigoUsuario, peso, reps, series, descanso, fecha, comentario], (err, results) => {

        if (err) { 

            console.log("error al insertar desempeno de ejercicio: ", err.message);
            res.status(500).json({ message: 'Error al registrar entrenamiento'});
            return;
        }

        console.log(results);
        res.json({message: "exito al registrar entrenamiento"})

    });

});

router.get('/mostrar_progreso', (req,res) => {

    const idEjercicio= req.query.idEjercicio;
    const rol = req.session.user.rol;
    let codigo = null;
    if (rol === "entrenador") {
        codigo = req.query.codigo 
    } else {
        codigo = req.session.user.code;
    }
    
    console.log(idEjercicio, codigo);

    const query = 'SELECT * FROM `rutina_registro` WHERE id_ejercicio = ? AND id_deportista = ?';

    connection.query(query, [idEjercicio, codigo], (err, results) => {

        if (err) { 
            console.log("error al obtener desempeno de ejercicio: ", err.message);
            res.status(500).json({ message: 'Error al obtener entrenamiento'});
            return;
        }
        console.log(results);
        res.json(results);

    });

})

module.exports = router;
