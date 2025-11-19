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

function cerrarSesion(req, res, next) {

    console.log("cerrarSesion ejecutado. User:", req.session?.user);

    if(!req.session.user) {

        return next();

    }

    req.session.destroy(err => {

        if(err) {

            console.log("erro destruyendo la sesion: ", err);

        }

        res.clearCookie("connect.sid");
        return next();

    });

}

module.exports = { isAuthenticated, isRole, cerrarSesion };
