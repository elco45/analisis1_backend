var SHA3 = require("crypto-js/sha3");
var boom = require('boom');
var problem = require('../schemas/problem');
var control = require('../schemas/control');


exports.getProblemas = {
  handler: function(request, reply){
    var problema = problem.find({},function(err,data){
      return reply(data)
    });

  }
}

exports.createProblem = {
  	handler: function(request, reply) {
	    var problema = new problem({
	     	problem_description: request.payload.descripcion,
	    	problem_type: request.payload.tipo
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
    var problema = problem.findOneAndRemove({ _id:request.payload.id }, function(err) {
      if (err) {
        throw err;
      }
      return reply('Eliminado exitosamente');
    });
  }
};


exports.modifProblem = {
  handler: function(request, reply) {

    var problema = problem.findOne({_id:request.payload.id},function(err,answer){
      answer.problem_description= request.payload.problem_description
      answer.problem_type= request.payload.problem_type
      answer.save();
      return reply(answer);
    });
  }
};

exports.lastElement = {
  handler: function(request, reply) {

    var problema = problem.findOne({problem_id:request.payload.problem_id},function(err,answer){
      answer.problem_description= request.payload.problem_description
      answer.problem_type= request.payload.problem_type
      answer.save();
      return reply(answer);
    });
  }
};



  exports.getProble_by_room = {
    handler: function(request, reply){
      var problema = problem.find({_id:request.payload.id},function(err,data){
        return reply(data)
      });

    }
  }