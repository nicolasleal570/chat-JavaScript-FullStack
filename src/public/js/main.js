$(document).ready(function(){
	/**
	 * Ejecutando codigo de socket.io
	 * nuevo usuario conectado cuando se carga el navegador
	*/
	const socket = io();

	/* Obteniendo los elementos del DOM de la interfaz de chat */
	const messageForm = $("#message-form");
	const messageBox = $("#message");
	const chat = $("#chat");

	/* Obtiendo los elementos del DOM para iniciar sesion */
	const nickForm = $("#nickForm");
	const nickName = $("#nickName");
	const nickError = $("#nickError");

	/* Obteniendo los elementos del DOM para imprimir la lista de usuarios conectados al chat */
	const users = $("#usernames");

	/* ----- */

	nickForm.submit(e => {
		e.preventDefault();

		/* Enviando los datos del usuario al servidor */
		socket.emit('new user', nickName.val(), function (data) {
			if (data) {
				$("#nickWrap").hide();
				$('#contentWrap').show();
			}else{
				nickError.html(`
					<div class="alert alert-danger mt-2">
						That username already exits.
					</div>
				`);
			}
			nickName.val('');
		});
	});

	/* Eventos */
	messageForm.submit(function (e) {
		e.preventDefault();
		
		/* Creando el evento send message para el servidor */
		socket.emit('send message', messageBox.val());
		messageBox.val("");
	});

	/* Escuchando los eventos del servidor */
	socket.on('new message', function (data) {	
		chat.append('<b>' + data.nick + ': </b>' + data.msg + '<br/>')
	});

	socket.on('usernames', data => {
		let html = '';

		for (let i = 0; i < data.length; i++) {
			html += `<p><i class="fas fa-user"></i> ${data[i]} </p>`
			
		}
		users.html(html);
	});


});