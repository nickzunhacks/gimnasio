const express = require('express');
const connection = require('../db');
const router = express.Router();

router.get('/buscar_usuario', (req, res) => {

    const codigo = req.query.codigo;

    const patron = `%${codigo}%`;

    const query = "SELECT name, code FROM users WHERE CAST(code AS CHAR) LIKE ? AND rol = 'deportista' ";

    connection.query(query, [patron], (err, results) => {
    if (err) { 

        console.log("error al obtener rutina: ", err);
        res.status(500).json({ error: 'Error al obtener la rutina de este dia'});
        return;

    }
    res.json(results)
    }); 

});

router.get('/id_ejercicio', (req, res) => {

    const nombre = req.query.nombre;
    console.log(nombre);
    const query = `SELECT id_ejercicio FROM ejercicios WHERE nombre = ?`;

    connection.query(query, [nombre], (err, results) => {

        if (err) { 

            console.log("error al obtener rutina: ", err);
            res.status(500).json({ error: 'Error al obtener la rutina de este dia'});
            return;

        }

        res.json({id_ejercicio: results[0].id_ejercicio });

    }); 

});

router.get('/id_rutina', (req, res) => {

    const codigo = req.query.codigo;
    const dia = req.query.dia;

    const query = "SELECT id_rutina FROM rutina WHERE id_deportista = ? AND dia = ?";

    connection.query(query, [codigo, dia], (err,results) => {

        if (err) { 
            console.log("error al obtener rutina: ", err);
            res.status(500).json({ error: 'Error al obtener la rutina de este dia'});
            return;
        }

        res.json({id_rutina: results[0].id_rutina});

    });

});

router.post('/editar', (req, res) => {

    const {peso, reps, series, descanso, ejercicio, rutina} = req.body;
    
    const query = `UPDATE rutina_ejercicio 
    SET peso = ?, repeticiones = ?, series = ?, descanso = ? 
    WHERE id_rutina = ? AND id_ejercicio = ?`
    
    connection.query(query, [peso, reps, series, descanso, rutina, ejercicio], (err, results) => {

        if(err) {

            console.log("error al actualizar rutina");
            res.status(500).json({ error: 'Error al actualizar el ejercicio'});
            return;

        }

        return res.json({ message: "Ejercicio actualizado correctamente" });

    });

});

module.exports = router;