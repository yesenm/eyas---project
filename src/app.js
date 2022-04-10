const express = require('express');
const res = require("express/lib/response");
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();
var path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const {body, validationResult} = require('express-validator');
require('./config/passport');

//connecting db
mongoose.connect('mongodb://localhost/eyas')
  .then(db => logger.info('La base de datos ha sido conectada.'))
  .catch(err => logger.error(err));

//importing routes
const indexRoutes = require('./routes/index');
const req = require('express/lib/request');
const logger = require('./logger');

//settings
app.set('port', process.env.PORT || 4000);
  // obtiene la ruta del directorio publico donde se encuentran los elementos estaticos (css, js).
  var publicPath = path.resolve(__dirname, 'public'); //path.join(__dirname, 'public'); también puede ser una opción
  // Para que los archivos estaticos queden disponibles.
  app.use(express.static(publicPath));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname +"/views"));

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(session({
  secret: 'mySecretWord_Eyas',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())

//variables globales
app.use((req, res, next) =>{
  res.locals.user = req.user || null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.danger_msg = req.flash('danger_msg');
  res.locals.error = req.flash('error');
  next(); 
});

//routes
app.use('/', indexRoutes);
app.use((req, res, next) => {
  res.status(404).sendFile(__dirname + '/public/404.html');
})



//starting the server
app.listen(app.get('port'), () => {
  logger.info(`App corriendo en el puerto: ${app.get('port')}`);
})


