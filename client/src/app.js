const express = require('express'); // referencia a framework express
const app = express();  //se crea la aplicacion de express
const log = require('morgan'); // para saber los clientes conectados
const bodyParse = require('body-parser');
const path = require('path');


const IndexRoutes = require('./routers/index.js');

app.set('port', process.env.PORT || 4000); // asignacion de puerto
app.set('view engine', 'ejs');

//MiddleWare utiliza morgan
app.use(log('dev'));
app.use(bodyParse.urlencoded({extended: false}));

app.use((req, res, next)=>{
    res.locals.mensajes = '';
    next();
});

//Rutas
app.use('/',IndexRoutes);

// establecer sistema de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});



app.listen(app.get('port'), () => {
    console.log('El servidor esta funcionando en el puerto ', app.get('port'));
});

