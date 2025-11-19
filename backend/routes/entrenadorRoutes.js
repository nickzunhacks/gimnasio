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

router.get('/existe_rutina', (req, res) => {

    const codigo = req.query.codigo;
    const dia = req.query.dia;

    const query = `SELECT id_rutina FROM rutina WHERE id_deportista = ? AND dia = ?`;

    connection.query(query ,[codigo, dia], (err,results) => {

        if(err) {
            
            console.log(err.message);
            res.status(500).json({ error: 'error al verificar la existencia de la rutina' })

        }

        if(results.length === 0) {

            console.log("rutina inexistente");
            res.json({idRutina: 0, estado: false});

        } else {

            console.log("rutina existente");
            res.json({idRutina: results[0].id_rutina, estado: true});

        }

    });

});

router.post('/crear', (req, res) => {

    const {codigo, dia, nombre} = req.body;

    const query = 'INSERT INTO rutina (dia, id_deportista, nombre_rutina) VALUES (?,?,?)';

    connection.query(query, [dia, codigo, nombre], (err,results) => {

        if(err) {

            console.log(err.message);
            res.status(500).json({message: "error"})

        } else {

            console.log("exito en creacion de rutina");
            res.json({message: "exito en creacion de rutina"});

        }

    });

});

router.post('/agregar', (req, res) => {

    const {idRutina, idEjercicio, peso, reps, series, descanso} = req.body;

    const query = 'INSERT INTO rutina_ejercicio VALUES (?, ?, ?, ?, ?, ?)';

    connection.query(query, [idRutina, idEjercicio, peso, reps, series, descanso], (err, results) => {

        if(err) {

            console.log("error en agregar el ejercicio: ",err.message);
            res.status(500).json({message: "error al agregar ejercicio"});

        } else {
        
            console.log("rotundo exito en asignacion de ejercicio :D:D:D:D:D");
            res.json({message: "exito en asignacion de ejercicio"});

        }

    });

});

router.get('/ejercicios', (req, res) => {

    const grupoMuscular = req.query.grupoMuscular;

    console.log(grupoMuscular);

    const query = 'SELECT id_ejercicio, nombre FROM ejercicios WHERE grupo_muscular = ? ';

    connection.query(query, [grupoMuscular], (err, results) => {

        if(err) {

            res.status(500).json({message: "error al obtener ejercicios"});

        } else {

            res.json({message: "exito", results});

        }

    });

});

router.delete('/eliminar', (req, res) => {

    const idRutina = req.query.rutina;
    const idEjercicio = req.query.ejercicio;

    const query = 'DELETE FROM rutina_ejercicio WHERE id_rutina = ? AND id_ejercicio = ?';

    connection.query(query, [idRutina, idEjercicio], (err, results) => {

        if(err) {

            console.log(err.message);
            res.status(500).json({message: "error en la eliminacion de ejercicio"});

        }

        res.json({message: "eliminacion exitosa"});

    });

});

module.exports = router;