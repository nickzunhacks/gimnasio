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
app.use(express.static(path.join(__dirname, '../frontend/public')));

app.use(session({
    secret: 'Lori0203',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Usar las rutas
app.use('/', pageRoutes);
app.use('/', authRoutes);
app.use('/', deportistaRoutes);
app.use('/', entrenadorRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
