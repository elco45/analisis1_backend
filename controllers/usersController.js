var SHA3 = require("crypto-js/sha3");
var boom = require('boom');
var user = require('../schemas/user');

exports.createUser = {
	/*auth: {
		mode:'required',
		strategy:'session'
	},*/
	handler: function(request, reply) {
		//console.log("Es esto:   "+request.payload);

		var usuario = new user({
			username: request.payload.username,
			password:SHA3(request.payload.password),
			name: request.payload.name,
			employee_type: request.payload.employee_type,
			status: false,
			role: request.payload.role,
      id: request.payload.id,
      cel: request.payload.cel,
      tel: request.payload.tel,
      direction: request.payload.direction,
      birth_date: request.payload.birth_date,// dia/mes/año
      civil_status: request.payload.civil_status,
      children: request.payload.children,
    //  schedule : [],
      observation: request.payload.observation,
      photo: request.payload.photo

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
  	handler: function(request, reply) {
      
  		var usuario = user.findOne({username:request.payload.username},function(err,answer){
        
        if(request.payload.password){          
           answer.password = SHA3(request.payload.password)
        }
  			answer.name= request.payload.nombre
  			answer.employee_type= request.payload.employee_type
  			answer.status= request.payload.status
  			answer.role= request.payload.role
        answer.cel = request.payload.cel
        answer.tel = request.payload.tel
        answer.direction = request.payload.direction
        answer.civil_status = request.payload.civil_status
        answer.children = request.payload.children
      //  schedule : [],
        answer.observation = request.payload.observation
        answer.photo = request.payload.photo
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
  	
  	handler: function(request, reply){
  		var usuario = user.find({},function(err,data){
        console.log(data)
  			if(!err){
          var array = [];
          for (var i = 0; i < data.length; i++) {
            var new_user = {
              username: data[i].username,   
              name: data[i].name,
              employee_type: data[i].employee_type,
              status: data[i].status,
              role: data[i].role,
              id: data[i].id,
              cel: data[i].cel,
              tel: data[i].tel,
              direction: data[i].direction,
              birth_date: data[i].birth_date,// dia/mes/año
              civil_status: data[i].civil_status,
              children: data[i].children,
            //  schedule : [],
              observation: data[i].observation,
              photo: data[i].photo 
            } 
            array.push(new_user);
          };
				 
  				return reply(array);

  			}else{
  				return reply(err);
  			}
  		});
   // console.log(usuario);

}
}

exports.getEmployee = {
    handler:function(request,reply){
      var usuario = user.find({role: 1},function(err,data){
        console.log(data)
        if(!err){
          var array = [];
          for (var i = 0; i < data.length; i++) {
            var new_user = {
              username: data[i].username,   
              name: data[i].name,
              employee_type: data[i].employee_type,
              status: data[i].status,
              role: data[i].role,
              id: data[i].id,
              cel: data[i].cel,
              tel: data[i].tel,
              direction: data[i].direction,
              birth_date: data[i].birth_date,// dia/mes/año
              civil_status: data[i].civil_status,
              children: data[i].children,
            //  schedule : [],
              observation: data[i].observation,
              photo: data[i].photo 
            } 
            array.push(new_user);
          };
         
          return reply(array);

        }else{
          return reply(err);
        }
      });
    }

}

