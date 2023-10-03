const express = require('express'); // referencia a framework express
const router = express.Router();
const net = require('net');
const servidor ={
    port:3000,
    host:'localhost'
}

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
    if (datos && typeof datos.mensaje === 'string') {
        console.log("Mensaje de: " + datos.mensaje);
        client.write(datos.mensaje);
        res.locals.mensaje = datos.mensaje;
    } else {
        console.error("Error: 'mensaje' no es una cadena válida");
    }
    res.redirect('/');
});

module.exports = router;