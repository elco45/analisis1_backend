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


exports.deleteProblem={
  //auth: {
  //  mode:'required',
  //  strategy:'session'
  //},
  handler: function(request, reply){
    problema.findOneAndRemove({ problem_id:request.payload.problem_id }, function(err) {
      if (err) {
        throw err;
      }
      return reply('Eliminado exitosamente');
    });
  }
};


exports.modifProblem = {
  handler: function(request, reply) {

    var problema = problem.findOne({problem_id:request.payload.problem_id},function(err,answer){
      answer.problem_description= request.payload.problem_description
      answer.problem_type= request.payload.problem_type
      answer.save();
      return reply(answer);
    });
  }
};
