const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const logger = require('../logger');

passport.use(new LocalStrategy({
  usernameField: 'username'
}, async (username, password, done) =>{
  const user = await User.findOne({
    username: username
  });
  if(!user){
    logger.error(`El usuario: ${username}, no existe en la base de datos.`);
    return done(null, false, {message: 'El usuario no existe'});
  }else{
    const match = await user.isCorrectPassword(password);
    if(match){
      return done(null, user);
    }else{
      logger.error(`La contraseña que ingresó el usuario: '${username}', ha sido incorrecta.`);
      return done(null, false, {message: 'Usuario y/o contraseña incorrecta'});
    }
  }
}
));

passport.serializeUser((user, done) =>{
  done(null, user.id);
});

passport.deserializeUser((id, done) =>{
  User.findById(id, (err, user) =>{
    done(err, user);
  }).lean();
});