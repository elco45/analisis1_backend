var mongoose = require('mongoose');

var RoomSchema = new mongoose.Schema({
	status: Number,//este es el estado de si esta siendo usada o no// 0 = neutral  1 = por limpiar, 2 = limpia, 3 = no limpiada(observaciones), 5 = prioridad!
	room_id: {type: Number, unique: true, required: true},
	idUser: [],
	priority: Number,
	time_reserved: String,
	observation: String
});

module.exports = mongoose.model('Room', RoomSchema);
