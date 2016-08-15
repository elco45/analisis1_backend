var mongoose = require('mongoose');

var RoomSchema = new mongoose.Schema({
	availability: Number,
	idUser: String,
	priority: Number
});

module.exports = mongoose.model('Room', RoomSchema);