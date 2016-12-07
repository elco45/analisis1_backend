var mongoose = require('mongoose');

var RoomTypeSchema = new mongoose.Schema({
	description: String
});

module.exports = mongoose.model('RoomType', RoomTypeSchema);
