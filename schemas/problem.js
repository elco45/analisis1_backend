var mongoose = require('mongoose');
//var uniqueValidator = require('mongoose-unique-validator');

var ProblemSchema = new mongoose.Schema({
  problem_id: Number,
  problem_description: String,
  problem_type: Number //0 = limpio con problemas  1 = no limpiada

});

//ReportSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Problem', ProblemSchema);
