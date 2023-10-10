const express = require('express'); // referencia a framework express
const app = express();  //se crea la aplicacion de express
const log = require('morgan'); // para saber los clientes conectados
const bodyParse = require('body-parser');
const path = require('path');
const IndexRoutes = require('./routers/index.js');
const { default: mongoose } = require('mongoose');


app.set('port', process.env.PORT || 4000); // asignacion de puerto
app.set('view engine', 'ejs');

//MiddleWare utiliza morgan
app.use(log('dev'));
app.use(bodyParse.urlencoded({extended: false}));

app.use('/',IndexRoutes);


// establecer sistema de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware de autenticación
/*function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        // Si el usuario está autenticado, permite que continúe
        return next();
    }
    // Si el usuario no está autenticado, redirige a la página de inicio de sesión
    res.redirect('/');
}*/


app.listen(app.get('port'), () => {
    console.log('El servidor esta funcionando en el puerto ', app.get('port'));
});


mongoose.connect("mongodb+srv://node:Node2002@cluster0.3gbtj9u.mongodb.net/ProyectoChat?retryWrites=true&w=majority")
.then(db=>console.log('BD conectada'))
.catch(err=>console.log('autenticacion fallida'));








// app.use((req, res, next)=>{
//     res.locals.mensajes = '';
//     next();
// });


/*app.get('/login', (req, res) => {
    res.render('login');
});*/

// app.get('/index', (req, res) => {
//     res.render('index');
// });


//Rutas









