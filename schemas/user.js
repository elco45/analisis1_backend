var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var UserSchema = new mongoose.Schema({
  username : {type: String, unique: true, required: true},
  password : String,
  name: String,
  employee_type: Number,
  status: Boolean
});

UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', UserSchema);
