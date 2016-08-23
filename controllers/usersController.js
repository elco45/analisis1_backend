var SHA3 = require("crypto-js/sha3");
var boom = require('boom');
var user = require('../schemas/user');

exports.createUser = {
	/*auth: {
		mode:'required',
		strategy:'session'
	},*/
	handler: function(request, reply) {
		console.log(request.payload);
		var usuario = new user({
			username: request.payload.username,
			password:SHA3(request.payload.password),
			name: request.payload.name,
			employee_type: request.payload.employee_type,
			status: false,
			role: request.payload.role

		});
  	  //Guardando
  	  usuario.save(function (err) {
  	  	if(err){
  	  		return reply(boom.notAcceptable('El usuario debe ser unico ' + err));
  	  	}else{
  	  		return reply('Agregado exitosamente ');
        }//fin else
    });
  	}
  };
  //Metodo para Modificar  usuario
  exports.modifUser = {
  	auth: {
  		mode:'required',
  		strategy:'session'
  	},
  	handler: function(request, reply) {
  		var usuario = user.findOne({username:request.payload.username},function(err,answer){
  			answer.password = SHA3(request.payload.password),
  			answer.name= request.payload.nombre,
  			answer.employee_type= request.payload.employee_type,
  			answer.status= request.payload.status,
  			answer.role= request.payload.role
  			answer.save();
  			return reply(answer);
  		});
  	}
  };

  exports.deleteUser={
  	auth: {
  		mode:'required',
  		strategy:'session'
  	},
  	handler: function(request, reply){
  		console.log(request.payload.username)
  		user.findOneAndRemove({ username:request.payload.username }, function(err) {
  			if (err) {
  				throw err;
  			} 
  			return reply('Eliminado exitosamente');
  		});
  	}
  };

  exports.getUser = {
  	auth: {
  		mode:'required',
  		strategy:'session'
  	},
  	handler: function(request, reply){
  		var usuario = user.find({username: request.payload.username},function(err,data){
  			if(!err){
  				var new_user = {
  					username: data[0].username, 	
  					name: data[0].name,
  					employee_type: data[0].employee_type,
  					status: data[0].status,
  					role: data[0].role 
  				}			
  				console.log(new_user);
  				return reply(new_user);

  			}else{
  				return reply(err);
  			}
  		});
   // console.log(usuario);

}
}

