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
	    	date_reported: request.payload.date_reported,
        resolved: request.payload.resolved,
        seen:false

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

exports.getResolved = {
  handler: function(request, reply){
    var reporte = report.find({resolved: false},function(err,data){
      return reply(data)
    });

  }
}

  exports.modifResolved = {
    //Funcion para actualizar el estado de problema
 		 handler: function(request, reply) {

      var reporte = report.findOne({room_number:request.payload.room_number},function(err,answer){
        answer.employee_username =request.payload.employee_username,
        answer.room_number = request.payload.room_number,
        answer.problem_id = request.payload.problem_id,
        answer.room_state= request.payload.room_state,
        answer.date_reported= request.payload.date_reported,
        answer.resolved = request.payload.resolved,
        answer.seen = request.payload.seen,
        answer.save(function(error1){//Actualizar estado de problemas
          var ctrl= control.find({},function(error2,respuesta){
            for (var i = 0; i < respuesta.length; i++) {
              if(respuesta[i].username == request.payload.employee)
                respuesta[i].last_change_seen = true;
              else
                respuesta[i].last_change_seen =false;
              respuesta[i].save();
            }
          })
        });
        return reply(answer);
      });
    }
  };



  exports.getSeenReports = {
    handler: function(request, reply){
      var reporte = report.find({resolved: false,seen: false},function(err,data){
        return reply(data)
      });

    }
  }

  exports.reportModifySeen = {
    handler: function(request, reply){
      var reporte = report.findOne({ _id:request.payload.reporte._id},function(err,data){
        data.seen=true;
        data.save();
        return reply(data)
      });

    }
  }
