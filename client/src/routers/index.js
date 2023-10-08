const express = require('express'); // referencia a framework express
const router = express.Router();
const net = require('net');
const model = require('../model/Usuarios.js')();
const Usuarios = require('../model/Usuarios');
const servidor ={
    port:3000,
    host:'localhost'
};




router.post('/add', async(req, res)=>{
    const info = new Usuarios(req.body);
    console.log(req.body);
    await info.save();
    res.redirect('/');
})


const client = net.createConnection(servidor);
    client.on('connect', ()=>{
        console.log('conexion satisfactiria')
        
    })

    let mensaje ='';

    client.on('data', (data)=>{
        mensaje = data.toString('utf-8');
        console.log('mensajes del servidor:' + mensaje)
    });

router.get('/', async (req, res)=>{
    res.render('index.ejs', {mensaje});
});


router.post('/enviar', async(req, res)=>{
    const datos = req.body;
        console.log("Mensaje de: " + datos.mensaje);
        client.write(datos.mensaje);
        res.locals.mensaje = datos.mensaje;
    res.redirect('/');
});

module.exports = router;