var mongoose = require('mongoose');

var RoomSchema = new mongoose.Schema({
	available: Number,
	idUser: String,
	priority: Number
});

module.exports = mongoose.model('Room', RoomSchema);