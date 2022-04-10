const helpersAdmin = {};

helpersAdmin.isAuthAdmin = (req, res, next) =>{
    if(req.isAuthenticated() && req.user.rol == 1){
        return next();
    }
    req.flash('danger_msg', 'Acceso no autorizado');
    res.redirect('/login');
};

module.exports = helpersAdmin;