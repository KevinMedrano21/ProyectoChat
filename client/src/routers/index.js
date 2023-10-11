const express = require('express'); // referencia a framework express
const router = express.Router();
const net = require('net');
const model = require('../model/Usuarios.js')();
const Usuarios = require('../model/Usuarios');
const Message = require('../model/Message');
const { Console, error } = require('console');
const $ = require('jquery');
const jwt = require('jsonwebtoken');
const { decode } = require('punycode');
const secretKey = 'tu-clave-valida';
const servidor ={
    port:3000,
    host:'localhost'
};

let mensaje = "";

router.get('/index', verificarToken, async (req, res) => {
  const nombreUsuario = req.usuario.nombre;
  console.log(`Usuario logeado: ${nombreUsuario}`);
  const token = req.query.token;

  try {
    const mensajes = await Message.find();

    res.render('index', { token, nombreUsuario, mensaje, mensajes });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el mensaje');
  }
  
});

router.get('/', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});


function verificarToken(req, res, next){
  const token = req.query.token;

  if(!token){
    return res.status(403).json({mensaje: 'token no proporcionado'});
  }

  jwt.verify(token,secretKey,(err, decoded)=>{
    if (err)  {
      console.error(err);
      return res.status(401).json({mensaje: 'token invalido'});
    }

    req.usuario = decoded;
    next();
  });

};


//ruta para registro
router.post('/add', async(req, res)=>{
    const info = new Usuarios(req.body);
    console.log(req.body);
    await info.save();
    res.redirect('/');
});

 //ruta para inicio de sesion
router.get('/', async (req, res) => {
    try {
       // Busca un usuario con el correo electrónico proporcionado
    const users = await Usuarios.find();
       // Si las credenciales son válidas, puedes redirigir al usuario a la página de chat o realizar otras acciones
    res.render('index', {
      users
    });
    } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener usuario');
    }
});

router.post('/login', async (req, res) => {
  const { nombre, psw } = req.body;

  try {
    const user = await Usuarios.findOne({ nombre });

    if (!user || user.psw !== psw) {
      return res.status(401).send('Nombre o contrasena incorrectos');
    } else {
      
    }

    const usuario = { id:1, nombre: `${nombre}` };
    const token = jwt.sign(usuario, secretKey, {expiresIn: '1h' });


    res.redirect('/index?token=' + token);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error de incio de sesion');
  }
})

const client = net.createConnection(servidor);
client.on('connect', () => {
  console.log('Conexión satisfactoria');
})

client.on('data', (data) => {
  mensaje = data.toString('utf-8');
  console.log('Mensaje del servidor: ' + mensaje);
});



// Manejo de conexiones de eventos servidor-sentido (SSE)
const sseClients = [];

router.get("/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  sseClients.push(res);

  req.on("close", () => {
    const index = sseClients.indexOf(res);
    if (index !== -1) {
      sseClients.splice(index, 1);
    }
  });
});

router.post('/enviar', async (req, res) => {
  const { usuario, mensaje } = req.body;

  if (mensaje && typeof mensaje === 'string') {
    try {
      const newMessage = new Message({ usuario, mensaje });
      await newMessage.save();
      const mensajeCompleto = `${usuario}: ${mensaje}`; // Agrega '\n' al final
      console.log('Mensaje de: ' + mensajeCompleto);
      client.write(mensajeCompleto);
      const token = req.query.token;

      sseClients.forEach((client) => {
        client.write(`data: ${JSON.stringify({ usuario: usuario, mensaje })}\n\n`);
      });

      res.redirect(303, '/index?token=' + token);

    } catch (error) {
      console.error(error);
      res.status(500).send('Error al guardar el mensaje');
    }
    
  } else {
    console.error("Error: 'mensaje' no es una cadena válida");
  }
});

module.exports = router;