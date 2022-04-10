const helpersUser = {};

helpersUser.isAuthUser = (req, res, next) =>{
    if(req.isAuthenticated() && req.user.rol == 2){
        return next();
    }
    req.flash('danger_msg', 'Acceso no autorizado');
    res.redirect('/login');
};

module.exports = helpersUser;