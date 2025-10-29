const express = require('express');
const path = require('path');
const { isAuthenticated, isRole } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public', 'login.html'));
});

router.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public', 'registro.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public', 'login.html'));
});

router.get('/entrenador', isAuthenticated, isRole('entrenador'), (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/paginasHTML', 'entrenador.html'));
});

router.get('/deportista', isAuthenticated, isRole('deportista'), (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/paginasHTML', 'deportista.html'));
});

router.get('/rutina_semanal', isAuthenticated, isRole('deportista'), (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/paginasHTML', 'rutinaSemanal.html'));
});

module.exports = router;
