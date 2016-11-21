var mongoose = require('mongoose');
//var uniqueValidator = require('mongoose-unique-validator');

var ReportSchema = new mongoose.Schema({
  employee_username: String,
  room_number: Number,
  problem_id: Number,
  room_state: String,
  date_reported: Date
});

//ReportSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Report', ReportSchema);
