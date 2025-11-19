const express = require('express');
const path = require('path');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const pageRoutes = require('./routes/pageRoutes');
const deportistaRoutes = require('./routes/deportistaRoutes');
const entrenadorRoutes = require('./routes/entrenadorRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(session({
    secret: 'Lori0203',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

// Usar las rutas
app.use('/', pageRoutes);
app.use('/', authRoutes);
app.use('/', deportistaRoutes);
app.use('/', entrenadorRoutes);

app.use(express.static(path.join(__dirname, '../frontend/public')));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
