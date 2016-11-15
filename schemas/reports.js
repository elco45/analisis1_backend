var mongoose = require('mongoose');
//var uniqueValidator = require('mongoose-unique-validator');

var ReportSchema = new mongoose.Schema({
  employee_id: String,
  employee_name: String,
  room_number: Number,
  observation: String,
  room_state: String,
  date: Date
});

//ReportSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Report', ReportSchema);
