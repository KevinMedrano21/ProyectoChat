const { default: mongoose } = require('mongoose');
const momgoose = require('mongoose');
const Squema = momgoose.Schema;

const Usuario = new Squema({
    nombre: String,
    mail: String,
    psw: String
});

module.exports = mongoose.model('datos', Usuario);