function isAuthenticated(req, res, next) {
    if (!req.session.user) {
        return res.status(401).send('Debes iniciar sesión');
    }
    next();
}

function isRole(role) {
    return (req, res, next) => {
        if (req.session.user.rol !== role) {
            return res.status(403).send('No tienes permiso de estar aquí');
        }
        next();
    };
}

module.exports = { isAuthenticated, isRole };
