var docente = require('../schemas/docente');/*objetos q se van a volver tablas, ayuda a crud el bd*/
var estudiante = require('../schemas/estudiante');/*objetos q se van a volver tablas, ayuda a crud el bd*/
var control_id = require('../schemas/control_id');
var university = require('../schemas/universidad');
var comments = require('../schemas/comentario');
var SHA3 = require("crypto-js/sha3");
var boom = require('boom');

exports.createUser = {
  handler: function(request, reply) {
    if(request.payload.user.especialidad){//docente
       var newDocente = new docente({
         Id_docente: request.payload.control_id.Id_docente + 1,
         nombre: request.payload.user.nombre,
         apellido: request.payload.user.apellido,
         especialidad: request.payload.user.especialidad,
         Id_universidad: request.payload.control_id.Id_universidad+1,
         password: SHA3(request.payload.user.password),
         email: request.payload.user.email,
         cursos:[]
       });
       newDocente.save(function (err) {
         if(err){
           return reply(boom.notAcceptable('Username must be unique: ' + err));
         }else{
           control_id.findById('56d7308a3e79d4780263b696',function(err,ctrl){
              ctrl.Id_docente = request.payload.control_id.Id_docente + 1;
              ctrl.save(function(err){
                if(err) throw err;
                return reply('ok');
              })
            })
         }//fin else
       });
      //fin if
    }else{
      var newEstudiante = new estudiante({
        Id_estudiante:request.payload.control_id.Id_estudiante + 1,
        nombre: request.payload.user.nombre,
        apellido: request.payload.user.apellido,
        Id_universidad: request.payload.control_id.Id_universidad+1,
        password: SHA3(request.payload.user.password),
        email: request.payload.user.email,
        cursos:[]

      });
      newEstudiante.save(function (err) {
        if(err){
          return reply(boom.notAcceptable('Username must be unique: ' + err));
        }else{
          control_id.findById('56d7308a3e79d4780263b696',function(err,ctrl){
             ctrl.Id_estudiante= request.payload.control_id.Id_estudiante + 1;
             ctrl.save(function(err){
               if(err) throw err;
                return reply('ok');
             })
           })
        }//fin else
      });
    }//fin else
  }//fin handler
};//fin create user

exports.createUserWithU = {
  handler: function(request, reply) {
    if(request.payload.user.especialidad){//docente
       var newDocente = new docente({
         Id_docente: request.payload.control_id.Id_docente + 1,
         nombre: request.payload.user.nombre,
         apellido: request.payload.user.apellido,
         especialidad: request.payload.user.especialidad,
         Id_universidad: request.payload.universidad.Id_universidad,
         password: SHA3(request.payload.user.password),
         email: request.payload.user.email,
         cursos:[]
       });
       newDocente.save(function (err) {
         if(err){
           return reply(boom.notAcceptable('error'));
         }else{
           control_id.findById('56d7308a3e79d4780263b696',function(err,ctrl){
              ctrl.Id_docente = request.payload.control_id.Id_docente + 1;
              ctrl.save(function(err){
                if(err) throw err;
                return reply('ok');
              })
            })
         }//fin else
       });
       
      //fin if
    }else{
      var newEstudiante = new estudiante({
        Id_estudiante:request.payload.control_id.Id_estudiante + 1,
        nombre: request.payload.user.nombre,
        apellido: request.payload.user.apellido,
        Id_universidad: request.payload.universidad.Id_universidad,
        password: SHA3(request.payload.user.password),
        email: request.payload.user.email,
        cursos:[]

      });
      newEstudiante.save(function (err) {
        if(err){
          return reply(boom.notAcceptable('error'));
        }else{
          control_id.findById('56d7308a3e79d4780263b696',function(err,ctrl){
            ctrl.Id_estudiante= request.payload.control_id.Id_estudiante + 1;
            ctrl.save(function(err){
              if(err){ 
                throw err;
              }else{
               return reply('ok');
              }
            })
          })
        }//fin else
      });
      

    }//fin else
  }//fin handler
};//fin create user

exports.getCtrl = {
  handler: function(request, reply){
    control_id.findOne({_id:'56d7308a3e79d4780263b696'},function(err,control){
      if (err) {
        throw err;
      }else{ 
        reply(control);
      }
    })
  }
}

exports.getUniversityByName = {
  handler: function(request, reply){
    university.findOne({Nombre:request.payload.Nombre},function(err,control){
        reply(control);
    })
  }
}

exports.createUniversity={
  handler: function(request, reply){
     newUniversidad = new university({
        Id_universidad:request.payload.control_id.Id_universidad+1,
        Nombre: request.payload.nombre
      });
      newUniversidad.save(function(err){
        if (err) {
          return reply(boom.notAcceptable('error'));
        }else{
          control_id.findById('56d7308a3e79d4780263b696',function(error,ctrl){
            ctrl.Id_universidad = request.payload.control_id.Id_universidad + 1;
            ctrl.save(function(error){
              if(error) throw error;

            })
          })
          return reply('ok');
        }
      })
  }
}

exports.getUniversidades={
  handler:function(request,reply){
    var universidades = university.find({});
    reply(universidades);
  }
}

exports.getUniversityById = {
  handler: function(request, reply){
    university.findOne({Id_universidad:request.payload.Id_universidad},function(err,control){
        reply(control);
    })
  }
}

exports.AddParentComment = {
  handler:function(request,reply){
    var idUser = {
      idEst: 0,
      idDoc: 0,
    };
    if(request.payload.scope.currentUser.IdUser < 10000000){
       idUser.idEst = null;
       idUser.idDoc = request.payload.scope.currentUser.IdUser;
    }else{
      idUser.idEst = request.payload.scope.currentUser.IdUser;
      idUser.idDoc = null;
    }

    var newComment = new comments({
      Id_comentario:request.payload.Id_comentario,
      descripción: request.payload.text,
    	Id_comentario_padre: -1,
    	Id_estudiante: idUser.idEst,
    	Id_docente: idUser.idDoc,
      Id_curso: request.payload.scope.CurrentCurso

    });
    newComment.save(function (err) {
      if(err){
        return reply(err);
      }else{
        control_id.findById('56d7308a3e79d4780263b696',function(err,ctrl){
           ctrl.Id_comentario= request.payload.Id_comentario + 1;
           ctrl.save(function(err){
             if(err) throw err;
             else
              return reply({id: ctrl.Id_comentario -1});
           })
         })
      }//fin else
    });
  }
}


exports.AddComment = {
  handler:function(request,reply){
    var idUser = {
      idEst: 0,
      idDoc: 0,
    };
    if(request.payload.scope.currentUser.IdUser < 10000000){
       idUser.idEst = null;
       idUser.idDoc = request.payload.scope.currentUser.IdUser;
    }else{
      idUser.idEst = request.payload.scope.currentUser.IdUser;
      idUser.idDoc = null;
    }
    var newComment = new comments({
      Id_comentario: request.payload.Id_comentario,
      descripción: request.payload.text,
    	Id_comentario_padre: request.payload.Id_parentComment,
    	Id_estudiante: idUser.idEst,
    	Id_docente: idUser.idDoc,
      Id_curso: request.payload.scope.CurrentCurso

    });
    newComment.save(function (err) {
      if(err){
        return reply(err);
      }else{
        control_id.findById('56d7308a3e79d4780263b696',function(err,ctrl){
           ctrl.Id_comentario= request.payload.Id_comentario + 1;
           ctrl.save(function(err){
             if(err) throw err;
             else
              return reply({id: ctrl.Id_comentario -1});
           })
         })
      }//fin else
    });
  }
}
exports.GetPoster = {
  handler: function(request,reply){
    if(request.payload.id >9999999){
      estudiante.findOne({Id_estudiante:request.payload.id},function(err,user){
        if(!err){
            reply({email:user.email})
        }
      })
    }else{
      docente.findOne({Id_docente:request.payload.id},function(err,user){

        if(!err)
            reply({email:user.email})

      })
    }

  }
}




/*  var newUser = new user({
username : request.payload.username,
password : SHA3(request.payload.password),
ID: request.payload.ID,
nombre: request.payload.nombre,
scope: request.payload.scope
});
newUser.save(function (err) {
if(err){
return reply(boom.notAcceptable('Username must be unique: ' + err));
}else{
return reply('ok');
};
});*/
