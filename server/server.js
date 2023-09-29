const net = require('net');
const server = net.createServer();

server.on('connection', (socket)=>{
    socket.on('data',(data)=>{
        console.log('Mensaje recibido desde el cliente:'+ data)
        socket.write('Mensaje resibido\n')
    })
    socket.on('close',()=>{
        console.log('Comunicacion finalizada')
    })
    socket.on('error',(err)=>{
        console.log(err.message)
    })
})

server.listen(3000, ()=>{
    console.log('servidor funcionando en el puerto:', server.address().port)
})