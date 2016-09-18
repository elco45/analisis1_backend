var mongoose = require('mongoose');

var ControlSchema = new mongoose.Schema({
	username: String,
	last_change_seen: Boolean
});

module.exports = mongoose.model('Control', ControlSchema);
