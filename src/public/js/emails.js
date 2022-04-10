function enviarEmail(){

  var boton = document.getElementById('botonEmail').value;

  console.log(boton);
}


/*
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'apoderoso97@gmail.com', // generated ethereal user
      pass: 'klifabhvodqifawi', // generated ethereal password
    },
  });

  transporter.verify().then(() => {
    console.log('Listo para enviar emails');
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: '"EYAS - Contacto 🤞🏻" <apoderoso97@gmail.com>', // sender address
    to: email_remitente, // list of receivers
    subject: "EYAS - Contacto 🤞🏻", // Subject line
    html:
    `
    <h2>Hey, nos entreamos de que trataste de contactanos</h2>
    <p>Responde a este correo y cuentanos qué sucede.</p>
    `
  });
  */