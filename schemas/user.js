var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var UserSchema = new mongoose.Schema({
  username : {type: String, unique: true, required: true},
  password : {type: String, required: true},
  name: String,
  employee_type: Number, // 0:empleado, 1 : administrador
  status: Boolean,
  role: Number,
  id: String,
  cel: Number,
  tel: Number,
  direction: String,
  birth_date: String,// dia/mes/año
  civil_status: String,
  children: Number,
//  schedule : [],
  observation: String,
  photo: String
});

UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', UserSchema);

