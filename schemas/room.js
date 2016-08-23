var mongoose = require('mongoose');

var RoomSchema = new mongoose.Schema({
	status: Number,
	room_id: {type: Number, unique: true, required: true},
	idUser: String,
	priority: Number,
	observation: String
});

module.exports = mongoose.model('Room', RoomSchema);