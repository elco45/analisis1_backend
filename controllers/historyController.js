var SHA3 = require("crypto-js/sha3");
var boom = require('boom');
var report = require('../schemas/reports');
var control = require('../schemas/control');


exports.getReports = {
  handler: function(request, reply){
    var reporte = report.find({},function(err,data){
      return reply(data)
    });

  }
}

exports.createRegister = {
  	handler: function(request, reply) {
	    var reporte = new report({
	    	employee_username: request.payload.employee_id,
	    	room_number: request.payload.room_number,
	    	problem_id: request.payload.problem_id,
	    	room_state: request.payload.room_state,
	    	date_reported: request.payload.date_reported
	   	});
		//Guardando
		reporte.save(function (err) {
			if(err){
			  	return reply(err);
			}else{
				return reply('Agregado exitosamente ');
			}
		});
  	}
}