/**
 * 
 * RECIBIENDO WEBSOCKETS
 * 
 */
/* Importando el Schema del chat */
const Chat = require('./models/chat');

module.exports = function (io) {

	/* Usuarios Conectados */
	let users = {};

	io.on('connection', async socket => {
		console.log("Nuevo usuario conectado");

		/* Buscando los mensajes anteriores en la DB */
		let messages = await Chat.find({});
		socket.emit('load old msgs', messages);

		socket.on('new user', (data, callb) => {
			if (data in users) {
				/* El usuario ya existe */
				callb(false);
			}else{
				callb(true);
				/* Guardando el nickname en la conexion de socket */
				socket.nickname = data;
				users[socket.nickname] = socket;

				updateusers();
			}
		});

		/* Escuchando el evento de la conexion de socket para enviar los mensajes del cliente */
		socket.on('send message', async (data, cb) => {

			var msg = data.trim();

			/** 
			 * Validando el tipo de mensaje que se esta enviando 
			 * substr(0, 3) evalua el mensaje desde el espacio 0 hasta el 3
			 * "/w joe asdhfhhda"
			*/
			if (msg.substr(0, 3) === '/w ') {
				msg = msg.substr(3);
				const index = msg.indexOf(' ');

				if (index !== -1) {
					var name = msg.substring(0, index);
					var msg = msg.substring(index + 1);

					/* Validando si el nombre esta dentro de los usuarios conectados */
					if (name in users) {
						/* Emitiendo un evento al usuario destino del mensaje para que reciba el mensaje */
						users[name].emit('whisper', {
							msg: msg,
							nick: socket.nickname
						});
					}else{
						cb('Error! Por favor introduzca un usuario valido');
					}
				}else{
					cb('Error! Por favor ingresa tu mensaje')
				}
			} else {
				/* Rellenando el Schema con los datos del usuario y el mensaje */
				var newMsg = new Chat({
					msg: msg,
					nick: socket.nickname
				});

				/** 
				 * Guardando en la base de datos
				 * Await es para que la funcion se ejecute de manera async 
				*/
				await newMsg.save();

				io.sockets.emit('new message', {
					msg: data,
					nick: socket.nickname
				});
			}			

			/* Enviando el mensaje a todos los usuarios conectados */
			updateusers();
		});

		/* Escuchando cuando se desconecta un usuario */
		socket.on('disconnect', data => {
			if (!socket.nickname) return;

			/* Borrando a usuario del arreglo */
			delete users[socket.nickname];
			updateusers();
		});

		/* FUncion para actualizar nombre de usuario */
		function updateusers() {
			io.sockets.emit('usernames', Object.keys(users));
		}

	});
}