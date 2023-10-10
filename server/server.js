const net = require('net');
const server = net.createServer();

const clientes = {};

server.on('connection', (socket) => {
  console.log('Nueva conexión establecida.');

  socket.setEncoding('utf-8');

  let nombreUsuario;

  socket.on('data', (data) => {
    const mensaje = data.toString().trim();

    if (!nombreUsuario) {
      // El primer mensaje enviado se considera como el nombre de usuario
      nombreUsuario = mensaje;
      clientes[nombreUsuario] = socket;
      console.log(`Usuario conectado: ${nombreUsuario}`);
      socket.write('¡Bienvenido al chat!\n');
      return;
    }

    // Envía el mensaje a todos los clientes (incluido el remitente)
    const mensajeCompleto = `${nombreUsuario}: ${mensaje}`;
    for (const cliente in clientes) {
      clientes[cliente].write(mensajeCompleto + '\n');
    }
  });

  socket.on('close', () => {
    if (nombreUsuario) {
      console.log(`Usuario desconectado: ${nombreUsuario}`);
      delete clientes[nombreUsuario];
    } else {
      console.log('Conexión cerrada antes de establecer un nombre de usuario.');
    }
  });

  socket.on('error', (err) => {
    console.error('Error en la conexión:', err.message);
  });
});

server.listen(3000, () => {
  console.log('Servidor funcionando en el puerto', server.address().port);
});