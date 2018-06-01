/**
 * 
 * RECIBIENDO WEBSOCKETS
 * 
 */
module.exports = function (io) {

	/* Usuarios Conectados */
	let nickNames = [];

	io.on('connection', socket => {
		console.log("Nuevo usuario conectado");

		socket.on('new user', (data, callb) => {
			if (nickNames.indexOf(data) != -1) {
				/* El usuario ya existe */
				callb(false);
			}else{
				callb(true);
				/* Guardando el nickname en la conexion de socket */
				socket.nickname = data;
				nickNames.push(socket.nickname);

				io.sockets.emit('usernames', nickNames);
			}
		});

		/* Escuchando el evento de la conexion de socket para enviar los mensajes del cliente */
		socket.on('send message', function (data) {
			io.sockets.emit('new message', {
				msg: data,
				nick: socket.nickname
			});

			/* Enviando el mensaje a todos los usuarios conectados */
			updateNicknames();
		});

		/* Escuchando cuando se desconecta un usuario */
		socket.on('disconnect', data => {
			if (!socket.nickname) return;

			/* Borrando a usuario del arreglo */
			nickNames.splice(nickNames.indexOf(socket.nickname), 1);
			updateNicknames();
		});

		/* FUncion para actualizar nombre de usuario */
		function updateNicknames() {
			io.sockets.emit('usernames', nickNames);
		}

	});
}