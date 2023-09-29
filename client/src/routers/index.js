const express = require('express'); // referencia a framework express
const router = express.Router();
// const app = express();  //se crea la aplicacion de express
// const log = require('morgan'); // para saber los clientes conectados
// const bodyParse = require('body-parser');
// const path = require('path');

router.get('/', async (req, res)=>{
    //console.log();
    res.render('index.ejs', {
    });
}); //el get obtiene datos

module.exports = router;