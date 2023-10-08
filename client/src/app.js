const express = require('express'); // referencia a framework express
const app = express();  //se crea la aplicacion de express
const log = require('morgan'); // para saber los clientes conectados
const bodyParse = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const auth = require('../src/helpers/auth.js'); // Importa el middleware
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');

// Configura express-session
app.use(session({
    secret: 'acceso', // Cambia esto a una cadena secreta segura
    resave: false,
    saveUninitialized: false,
  }));

// Configura la estrategia de autenticación local
passport.use(new LocalStrategy(
    (nombre, psw, done) => {
      Usuarios.findOne({ nombre: nombre }, (err, nombre) => {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.validPassword(psw)) { return done(null, false); }
        return done(null, nombre);
      });
    }
  ));  

// Inicializa Passport y establece las sesiones
app.use(passport.initialize());
app.use(passport.session());

// Middleware de autenticación
/*function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        // Si el usuario está autenticado, permite que continúe
        return next();
    }
    // Si el usuario no está autenticado, redirige a la página de inicio de sesión
    res.redirect('/');
}*/

const IndexRoutes = require('./routers/index.js');
const { default: mongoose } = require('mongoose');

app.set('port', process.env.PORT || 4000); // asignacion de puerto
app.set('view engine', 'ejs');

//MiddleWare utiliza morgan
app.use(log('dev'));
app.use(bodyParse.urlencoded({extended: false}));

app.use((req, res, next)=>{
    res.locals.mensajes = '';
    next();
});

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

/*app.get('/login', (req, res) => {
    res.render('login');
});*/

app.get('/index', auth.isAuthenticated, (req, res) => {
    res.render('index');
});
//Rutas
app.use('/',IndexRoutes);




mongoose.connect("mongodb+srv://node:Node2002@cluster0.3gbtj9u.mongodb.net/ProyectoChat?retryWrites=true&w=majority")
.then(db=>console.log('BD conectada'))
.catch(err=>console.log('autenticacion fallida'));


app.listen(app.get('port'), () => {
    console.log('El servidor esta funcionando en el puerto ', app.get('port'));
});

// establecer sistema de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

