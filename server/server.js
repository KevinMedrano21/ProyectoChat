const net = require('net');
const server = net.createServer();

const mensajes = [];

server.on('connection', (socket)=>{
    socket.on('data',(data)=>{
        const mensaje = data.toString('utf-8')
        console.log('Mensaje recibido desde el cliente:'+ mensaje)
        mensajes.push(mensaje)
        socket.write(mensajes.join('\n') + '\n')
    });

    socket.on('close',()=>{
        console.log('Comunicacion finalizada')
    });

    socket.on('error',(err)=>{
        console.log(err.message)
    });
})

server.listen(3000, ()=>{
    console.log('servidor funcionando en el puerto:', server.address().port)
})