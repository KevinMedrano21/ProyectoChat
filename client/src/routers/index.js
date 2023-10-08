const express = require('express'); // referencia a framework express
const router = express.Router();
const net = require('net');
const model = require('../model/Usuarios.js')();
const Usuarios = require('../model/Usuarios');
const auth = require('../helpers/auth.js'); // Importa el middleware
const { Console, error } = require('console');
//const mensaje = "";
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
client.on('connect', () => {
  console.log('Conexión satisfactoria');
})

let mensaje = "";

client.on('data', (data) => {
  mensaje = data.toString('utf-8');
  console.log('Mensaje del servidor: ' + mensaje);
});

router.get('/', auth.isAuthenticated, async (req, res) => {
  res.render('index', { mensaje }); 
});

router.post('/enviar', async (req, res) => {
  const datos = req.body;
  if (datos && typeof datos.mensaje === 'string') {
      console.log("Mensaje de: " + datos.mensaje);
      client.write(datos.mensaje);
  } else {
      console.error("Error: 'mensaje' no es una cadena válida");
  }
  res.redirect('/');
});

module.exports = router;