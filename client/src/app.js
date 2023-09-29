const express = require('express'); // referencia a framework express
const app = express();  //se crea la aplicacion de express
const log = require('morgan'); // para saber los clientes conectados
const bodyParse = require('body-parser');
const path = require('path');
const WebSocket = require('ws');
const http = require('http')
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const IndexRoutes = require('./routers/index.js');

app.set('port', process.env.PORT || 4000); // asignacion de puerto
app.set('view engine', 'ejs');

//MiddleWare utiliza morgan
app.use(log('dev'));
app.use(bodyParse.urlencoded({extended: false}));
//Rutas
app.use('/',IndexRoutes);

app.listen(app.get('port'), () => {
    console.log('El servidor esta funcionando en el puerto ', app.get('port'));
});

// establecer sistema de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

wss.on('connection', (ws) =>{
    console.log('conexion a websocket');

    ws.on('message', (message)=>{
        console.log(`Mensaje recibido: ${message}`);

        wss.clients.forEach((client)=>{
            if(client !== ws && client.readyState === WebSocket.OPEN){
                client.send(message);
            }
        });
    });

    ws.on('close', ()=>{
        console.log('usuario desconectado de websocket');
    });
});