/**
 * 
 * RECIBIENDO WEBSOCKETS
 * 
 */
module.exports = function (io) {
	io.on('connection', socket => {
		console.log("Nuevo usuario conectado");

		/* Escuchando el evento de la conexion de socket para enviar los mensajes del cliente */
		socket.on('send message', function (data) {

			/* Enviando el mensaje a todos los usuarios conectados */
			io.sockets.emit('new message', data);
		});

	});
}