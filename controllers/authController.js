var joi = require('joi');
var boom = require('boom');
var docente = require('../schemas/docente');
var estudiante = require('../schemas/estudiante');
var SHA3 = require("crypto-js/sha3");

exports.login = {
  auth: false,
  validate: {
    payload: {
      email: joi.string().required(),
      password: joi.string().min(1).max(200).required()
    }
  },
  handler: function(request, reply) {
      var entro = false;
      docente.find({email: request.payload.email, password: String(SHA3(request.payload.password))}, function(err, user){
        if(!err){
          if(user.length > 0){
            //request.auth.session.set(user[0]);
            return reply({email: user[0].email, IdUser:user[0].Id_docente,CurrentCurso:"0",Id_universidad: user[0].Id_universidad,IdTarea:null});
            entro = true;
          }
        }
      }).then(function(query){
        if(query.length > 0)// comprobando si la query de docente trajo algo
          entro = true;
        estudiante.find({email: request.payload.email, password: String(SHA3(request.payload.password))}, function(err, user){
          if (!err) {
            	if(user.length > 0){
              //request.auth.session.set(user[0]);
              	return reply({email: user[0].email, IdUser:user[0].Id_estudiante,CurrentCurso:"0",Id_universidad: user[0].Id_universidad,IdTarea:null});
            	}else{
                if(!entro){
                  var erro=boom.unauthorized('error')
                  return reply(erro.message);
                }
              }
          }else{
            var erro=boom.unauthorized('error')
            return reply(erro.message);
          }
       	})//fin query a estudiante


      })//fin then

  }
}

exports.logout = {
  handler: function(request, reply) {
    request.auth.session.clear();
    return reply('Logout Successful!');
  }
}
