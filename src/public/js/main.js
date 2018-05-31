$(document).ready(function(){
	/**
	 * Ejecutando codigo de socket.io
	 * nuevo usuario conectado cuando se carga el navegador
	*/
	const socket = io();

	/* Obteniendo los elementos del DOM de la interfaz */
	const messageForm = $("#message-form");
	const messageBox = $("#message");
	const chat = $("#chat");

	/* ----- */

	/* Eventos */
	messageForm.submit(function (e) {
		e.preventDefault();
		
		/* Creando el evento send message para el servidor */
		socket.emit('send message', messageBox.val());
		messageBox.val("");
	});

	/* Escuchando los eventos del servidor */
	socket.on('new message', function (data) {		
		chat.append(data) + '<br/>';
	});


});