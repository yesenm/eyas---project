const express = require("express");
const req = require("express/lib/request");
const { sendfile, render } = require("express/lib/response");
const task = require("../models/task");
const router = express.Router();
const { isAuthAdmin } = require('../helpers/sessionAdmin');
const { isAuthUser } = require('../helpers/sessionUser');
const {body, validationResult} = require('express-validator');


//librería de autenticación de usuarios
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Requerición de modelos
const Task = require('../models/task');
const User = require('../models/user');
const flash = require("connect-flash/lib/flash");

router.get('/', (req, res) =>{
  res.render('index');
})
router.get('/email', (req, res) =>{
  res.render('emailcontacto');
})

//Acciones de contactanos
//Insertar en mensajeria
router.post('/addm', [
  body('remitente')
  .notEmpty()
  .withMessage('El campo de "remitente" no puede ir vacío.')
  .isLength({min:8})
  .withMessage('Ingrese su nombre completo.'),
  body('email_remitente')
  .notEmpty()
  .withMessage('El campo de "email" no puede ir vacío.')
  .isEmail()
  .withMessage('Ingrese un email válido.')
  .normalizeEmail(),
  body('mensaje')        
  .notEmpty()
  .withMessage('El campo de "mensaje" no puede ir vacío.')
  .isLength({min:8, max: 300})
  .withMessage('El mensaje no debe llevar menos de 10 carácteres ni más de 300.')
], async (req, res, next) =>{
  
  //Validación de los campos
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(req.body);
    const valores = req.body;
    const validaciones = errors.array();
    res.render('index', {validaciones:validaciones, valores: valores});
    next();
  }else{
    //res.send('¡Validación Exitosa!')
    
    const task = new Task(req.body);
    await task.save();
    req.flash('success_msg', 'Mensaje enviado correctamente.')
    res.redirect('/');
  }
  
});

//Eliminar mensaje de contactanos
router.get('/deletem/:id', isAuthAdmin, async (req, res) =>{
  const { id } = req.params;
  await Task.remove({ _id: id });
  req.flash('success_msg', 'Mensaje eliminado correctamente.')
  res.redirect('/b_entrada');
});

//Declaración de ruta buzón de entrada y funcionamiento de cosultas;
router.get("/b_entrada", isAuthAdmin, async (req, res) =>{
  const tasks = await Task.find();
  (res.render("b_entrada",{
    tasks
  }));
})

//Declaración de ruta usuarios registrados y funcionamiento de cosultas;
router.get("/u_registrados", isAuthAdmin, async (req, res) =>{
  const users = await User.find();
  (res.render("u_registrados",{
    users
  }));
});

//Eliminar usuarios registrados
router.get('/deleteusers/:id', isAuthAdmin, async (req, res) =>{
  const { id } = req.params;
  await User.remove({ _id: id });
  req.flash('success_msg', 'Usuario eliminado correctamente.')
  res.redirect('/u_registrados');
});

//Actualizar usuarios registrados
router.get('/actualizar_u/:id', isAuthAdmin, async (req, res) =>{
  const { id } = req.params;
  const user = await User.findById(id);
  res.render('actualizar_u', {
    user
  });
  console.log(user);
});

router.post('/editar/:id', isAuthAdmin, async (req, res) =>{
  const { id } = req.params;
  console.log({_id:id});
  const {email, rol} = req.body;
  
  emailRestricciones = /^(.+\@.+\..+)$/;
  rolRestricciones = /^[1-2]{1}$/ ;
  
  if(email.length < 1 && rol.length < 1){
    req.flash('danger_msg', 'Escribe un email.');
    res.redirect('/actualizar_u/'+ id);
  }else if(! emailRestricciones.test(email)){
    req.flash('danger_msg', 'Inserta un email válido.');
    res.redirect('/actualizar_u/'+ id);
  }else if(rol.length < 1){
    req.flash('danger_msg', 'Digita el rol del usuario.');
    res.redirect('/actualizar_u/'+ id);
  }else if(! rolRestricciones.test(rol)){
    req.flash('danger_msg', 'Solo se aceptan los valores 1 y 2, sin excepciones');
    res.redirect('/actualizar_u/'+ id);
  }else{
    await User.update({ _id: id }, req.body);
    req.flash('success_msg', 'Usuario actualizado correctamente.')
    res.redirect('/u_registrados');
  }
});


router.get("/logs", isAuthAdmin, async (req, res) =>{
  (res.render("logs"));
})

router.get("/registro_u", (req, res) =>{
  (res.render("registro_u"));
})

router.get("/registro_a", isAuthAdmin, async (req, res) =>{
  (res.render("registro_a"));
})

router.get("/main", isAuthUser, async (req, res) =>{
  (res.render("main"));
})

//Login y registro

//registrar usuario
router.post("/register_u",[
  body('username')
  .notEmpty()
  .withMessage('El campo de "nombre de usuario" no puede ir vacío.')
  .isLength({min:5})
  .withMessage('El nombre de usuario debe tener más de 5 carácteres'),
  body('email')
  .notEmpty()
  .withMessage('El campo de "email" no puede ir vacío.')
  .isEmail()
  .withMessage('Ingrese un email válido.')
  .normalizeEmail(),
  body('password')        
  .notEmpty()
  .withMessage('Escriba una contraseña.')
  .isLength({min:8, max: 25})
  .withMessage('La contraseña no debe tener menos de 8 carácteres ni más de 25.')
  .matches(/\d/)
  .withMessage('La contraseña debe contener al menos un número.'),
], async (req, res, next) =>{
  //Validación de los campos
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(req.body);
    const valores = req.body;
    const validaciones = errors.array();
    res.render('registro_u', {validaciones:validaciones, valores: valores});
    next();
  }else{
    const { username, email, password, rol } = req.body;
    const user = new User({ username, email, password, rol});
    
    await user.save(err => {
      if(err){
        req.flash('danger_msg', 'Este usuario ya está registrado, crea uno diferente');
        res.redirect('/registro_u');
      }else{
        req.flash('success_msg', 'Usuario registrado correctamente.')
        res.redirect('/login');
      }
    });
  }
});

//registrar administrador
router.post("/register_a",[
  body('username')
  .notEmpty()
  .withMessage('El campo de "nombre de usuario" no puede ir vacío.')
  .isLength({min:5})
  .withMessage('El nombre de usuario debe tener más de 5 carácteres'),
  body('email')
  .notEmpty()
  .withMessage('El campo de "email" no puede ir vacío.')
  .isEmail()
  .withMessage('Ingrese un email válido.')
  .normalizeEmail(),
  body('password')        
  .notEmpty()
  .withMessage('Escriba una contraseña.')
  .isLength({min:8, max: 25})
  .withMessage('La contraseña no debe llevar menos de 8 carácteres ni más de 25.')
  .matches(/\d/)
  .withMessage('La contraseña debe contener al menos un número.'),
], async (req, res, next) =>{
  //Validación de los campos
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(req.body);
    const valores = req.body;
    const validaciones = errors.array();
    res.render('registro_a', {validaciones:validaciones, valores: valores});
    next();
  }else{
    const { username, email, password, rol } = req.body;
    const user = new User({ username, email, password, rol});
    
    await user.save(err => {
      if(err){
        req.flash('danger_msg', 'Este usuario ya está registrado, crea uno diferente.');
        res.redirect('/registro_a');
      }else{
        req.flash('success_msg', 'Usuario registrado correctamente.')
        res.redirect('/registro_a');
      }
    });
  }
});

//Autenticar en el login
router.post('/authenticate', passport.authenticate('local', {
  failureRedirect: '/login', 
  failureFlash: true
}), (req, res) =>{
  if(req.user.rol == 1){
    res.redirect('/b_entrada');
  }else if(req.user.rol == 2){
    res.redirect('/main');
  }
}
);

router.get('/login', (req, res) =>{
  const success_msg = req.flash('success_msg')[0];
  (res.render('login'), {
    success_msg
  });
})

//Destruir sesión
router.get('/logout', async (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = router;