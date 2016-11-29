var SHA3 = require("crypto-js/sha3");
var boom = require('boom');
var problem = require('../schemas/problem');
var control = require('../schemas/control');


exports.getProblem = {
  handler: function(request, reply){
    var problema = problem.find({},function(err,data){
      return reply(data)
    });

  }
}

exports.createProblem = {
  	handler: function(request, reply) {
	    var problema = new problem({
	    	problem_id: request.payload.problem_id,
	    	problem_description: request.payload.problem_description,
	    	problem_type: request.payload.problem_type
	    	});
		//Guardando
		problema.save(function (err) {
			if(err){
			  	return reply(err);
			}else{
				return reply('Agregado exitosamente ');
			}
		});
  	}
}
