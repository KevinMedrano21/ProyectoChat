const express = require('express'); // referencia a framework express
const router = express.Router();
const net = require('net');
const model = require('../model/Usuarios.js')();
const Usuarios = require('../model/Usuarios');
const { Console, error } = require('console');
const servidor ={
    port:3000,
    host:'localhost'
};



//ruta para registro
router.post('/add', async(req, res)=>{
    const info = new Usuarios(req.body);
    console.log(req.body);
    await info.save();
    res.redirect('/');
});

 //ruta para inicio de sesion
router.post('/login', async (req, res) => {
    const { nombre, psw } = req.body;
    
    try {
       // Busca un usuario con el correo electrónico proporcionado
    const user = await Usuarios.findOne({ nombre: nombre });

      // Si no se encuentra el usuario, redirige de nuevo al formulario de inicio de sesión
    if (!user) {
        return res.status(500).send("error de autenticacion");
    }

       // Verifica la contraseña
    if (user.psw !== psw) {
        return res.status(500).send("error de autenticacion");
    }

       // Si las credenciales son válidas, puedes redirigir al usuario a la página de chat o realizar otras acciones
    res.redirect('/index');
    } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
    }
});

// router.post('/login', async(req,res)=>{
//     const {nombre, psw} = req.body;
//     Usuarios.findOne({nombre, psw});
//     console.log(req.body);
//     res.redirect('/index')
// })

const client = net.createConnection(servidor);
    client.on('connect', ()=>{
        console.log('conexion satisfactiria')
        
    })

    let mensaje ='';

    client.on('data', (data)=>{
        mensaje = data.toString('utf-8');
        console.log('mensajes del servidor:' + mensaje)
    });

router.get('/index', async (req, res)=>{
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