function isAuthenticated(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

function isRole(role) {
    return (req, res, next) => {
        if (req.session.user.rol !== role) {
            return res.redirect('/login');
        }
        next();
    };
}

module.exports = { isAuthenticated, isRole };
