const express = require('express'); // referencia a framework express
const router = express.Router();
const net = require('net');
const model = require('../model/Usuarios.js')();
const Usuarios = require('../model/Usuarios');
const { Console, error } = require('console');
const jwt = require('jsonwebtoken');
const { decode } = require('punycode');
const secretKey = 'secretKey';
//const mensaje = "";
const servidor ={
    port:3000,
    host:'localhost'
};

router.get('/chat', verificarToken, async (req, res)=>{
  res.render('chat.ejs');
});


router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});


function verificarToken(req,res, next){
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

}



//ruta para registro
router.post('/add', async(req, res)=>{
    const info = new Usuarios(req.body);
    console.log(req.body);
    await info.save();
    res.redirect('/');
});

 //ruta para inicio de sesion
router.get('/login', async (req, res) => {
    try {
       // Busca un usuario con el correo electrónico proporcionado
    const users = await Usuarios.find();
       // Si las credenciales son válidas, puedes redirigir al usuario a la página de chat o realizar otras acciones
    res.redirect('login.ejs', {
      users
    });
    } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener usuario');
    }
});

router.post('/escucha', async (req, res) => {
  const { nombre, psw } = req.body;

  try {
    const user = await Usuarios.findOne({ nombre });

    if (!user || user.psw !== psw) {
      return res.status(401).send('Nombre o contrasena incorrectos');
    } else {
      
    }

    const usuario = { id:1, nombre: 'Ejemplo' };
    const token = jwt.sign(usuario, secretKey, {expiresIn: '1h' });


    res.redirect('/chat?token=' + token);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error de incio de sesion');
  }
})

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

router.get('/', async (req, res) => {
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