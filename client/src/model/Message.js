const { default: mongoose } = require('mongoose');
const momgoose = require('mongoose');
const Squema = momgoose.Schema;

const Mensaje = new Squema({
    usuario: String,
    mensaje: String
});

module.exports = mongoose.model('Mensaje', Mensaje);