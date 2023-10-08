const { default: mongoose } = require('mongoose');
const momgoose = require('mongoose');
const Squema = momgoose.Schema;

const Usuario = new Squema({
    nombre: String,
    mail: String,
    psw: String
});


//esta metodo no funciona
Usuario.methods.IsCorrectPsw = function(psw, callback){
    compare(psw, this.psw, function(err, same){
        if(err){
            callback(err);
        }else{
            callback(err, same);
        }
    });
}

module.exports = mongoose.model('datos', Usuario);