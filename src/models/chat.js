const mongoose = require('mongoose');
/* Importando una propiedad de la biblioteca mongoose */
const { Schema } = mongoose;

/* La forma en la que se van a guardar los datos en la DB */
const ChatSchema = new Schema({
	nick: String,
	msg: String,
	created_at: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Chat', ChatSchema);

