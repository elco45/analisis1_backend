var mongoose = require('mongoose');

var PlantillaSchema = new mongoose.Schema({
	plantilla_nombre: {type: String, unique: true, required: true},
	plantilla_descripcion: String,
	rooms_in_JSON: []
});

module.exports = mongoose.model('Plantilla', PlantillaSchema);