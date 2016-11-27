var mongoose = require('mongoose');

var SettingsSchema = new mongoose.Schema({
	pin_login: Boolean
});

module.exports = mongoose.model('Settings', SettingsSchema);
