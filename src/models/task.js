const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchemaM = new Schema({
    remitente: String,
    email_remitente: String,
    mensaje: String
})

module.exports = mongoose.model('mensajes', taskSchemaM);