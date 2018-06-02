const http = require('http');
const path = require('path');

const express = require('express');
const socketio = require('socket.io');

const mongoose = require('mongoose');

const app = express();

/* --Funcion de tiempo real-- */
const server = http.createServer(app);
const io = socketio.listen(server);

/** 
 * 
 * CONECTANDO A LA DB
 * 
*/
mongoose.connect('mongodb://localhost/chat-database')
	.then(db => console.log("DB is connected"))
	.catch(err => console.log(err));

/**
 * 
 * SETTINGS DEL PORT
 * 
 */
app.set('port', process.env.PORT || 3000);

/* Ejecutando la funcion en el archivo sockets.js */
require('./sockets')(io);

/**
 * Enviandole la interfaz al navegador mediante el servidor
 * path.join es un modulo que une directorios
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Haciendo que el servidor se quede escuchando en algun puerto del computador
 * 3000 es igual al puerto que se le asigno. 
*/
server.listen(app.get('port'), () => {
	console.log("Server on port", app.get('port'));
});