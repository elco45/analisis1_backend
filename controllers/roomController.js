var SHA3 = require("crypto-js/sha3");
var boom = require('boom');
var room = require('../schemas/room');
var control = require('../schemas/control');
var settings = require('../schemas/settings')

//set timer to restart the asigned rooms at 5 AM

var date = new Date();
var current_hour = date.getHours();
var current_minutes = date.getMinutes();
var current_seconds = date.getSeconds();

var ms_in_day = 24*60*60*1000
var ms_in_hour_to_reset = 14*60*60*1000 + 12*60*1000
current_hour = current_hour* 60 * 60 *1000
current_minutes = current_minutes * 60 * 1000
current_seconds = current_seconds * 1000
var current_time = current_hour+current_minutes+current_seconds
var ms_till_reset
if(current_time <= ms_in_hour_to_reset){
  ms_till_reset = ms_in_hour_to_reset - current_time
}else{
  ms_till_reset = ms_in_day - current_time +  ms_in_hour_to_reset
}
console.log(ms_till_reset)
/* NO BORRAR AUN
setInterval(function() {
     ms_till_reset = ms_in_day;
     console.log(ms_till_reset)
     console.log("entreee")
     var habitacion = room.find({},function(err,data){
        for (var i = 0; i < data.length; i++) {
           var habitacion = room.findOne({room_id:data[i].room_id},function(err,answer){
            answer.status = 0,
            answer.idUser = [],
            answer.priority= answer.priority,
            answer.observation=answer.observation,
            answer.time_reserved =answer.time_reserved
            answer.save();
          });

        }
    });


}, ms_till_reset);
*/
//-----

exports.createRoom = {
  /*auth: {
    mode:'required',
    strategy:'session'
  },*/
  handler: function(request, reply) {

    var habitacion = new room({
     status: request.payload.status,
     room_id: request.payload.room_id,
     idUser: request.payload.idUser,
     priority: request.payload.priority,
     observation: request.payload.observation,

     time_reserved: "0hr"
   });
      //Guardando
      habitacion.save(function (err) {
        if(err){
          return reply(boom.notAcceptable('La habitacion debe ser unica ' + err));
        }else{
          return reply('Agregado exitosamente ');
        }//fin else
      });
    }
  };
  // Modificar las habitaciones
  exports.modifRoom = {
    /*auth: {
      mode:'required',
      strategy:'session'
    },*/
    handler: function(request, reply) {
      var habitacion = room.findOne({room_id:request.payload.room.room_id},function(err,answer){
        answer.room_id = request.payload.room.room_id,
        answer.status = request.payload.room.status,
        answer.idUser = request.payload.room.idUser,
        answer.priority= request.payload.room.priority,
        answer.observation= request.payload.room.observation,
        answer.time_reserved = request.payload.room.time_reserved
        answer.save(function(error1){
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
//Eliminar  Room
exports.deleteRoom={
  auth: {
    mode:'required',
    strategy:'session'
  },
  handler: function(request, reply){
   room.findOneAndRemove({ room_id:request.payload.room_id }, function(err) {
    if (err) {
      throw err;
    }
    return reply('Eliminado exitosamente');
  });
 }
};
//GET DE HABITACIONES
exports.getRoom = {
  auth: {
    mode:'required',
    strategy:'session'
  },
  handler: function(request, reply){
    var habitacion = room.find({room_id: request.payload.room_id},function(err,data){
      if(!err){
        var new_room = {
          status: data[0].status,
          idUser: data[0].idUser,
          priority: data[0].priority,
          observation: data[0].observation,
          time_reserved: data[0].time_reserved

        }
        return reply(new_room);

      }else{
        return reply(err);
      }
    });


  }
}

//get all rooms
exports.getAllRooms = {
  /*: {
    mode:'required',
    strategy:'session'
  },*/
  handler: function(request, reply){
    var habitacion = room.find({},function(err,data){
      return reply(data)
    });


  }
}

exports.updateReDistributedRooms = {
  handler:function(request,reply){

     var habitacion = room.findOne({room_id:request.payload.room.room_id},function(err,room){
        room.status = room.status
        for(var i = 0; i < room.idUser.length; i++) {
          if(room.idUser[i].username === request.payload.previous_user){
            room.idUser.splice(i,1)
            break;
          }
        }
        room.idUser.push(request.payload.next_user)
        room.priority=request.payload.room.priority
        room.observation=room.observation
        room.time_reserved =room.time_reserved
        room.save(function(error1){
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
        return reply(room);
      });
  }
}

exports.updateDistributedRooms = {
  handler: function(request,reply){
     var habitacion = room.findOne({room_id:request.payload.room.room_id},function(err,response){
        response.idUser = request.payload.room.idUser
        response.priority=request.payload.room.priority
        response.save(function(error1){
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
        return reply(response);
      });
  }
}

exports.getemproom={

   handler: function(request, reply){
    var habitacion = room.find({},function(err,data){
      return reply(data)
    });
  }
}
exports.checkForChanges ={
  handler: function(request,reply){
    var ctrl = control.findOne({username: request.payload.username},function(err,data){
        return reply (data);
    })
  }
}
exports.updateControl = {
  handler: function(request,reply){
    var ctrl = control.findOne({username: request.payload.username},function(err,data){
      data.last_change_seen = true
      data.save()
      return reply(data);
    })
  }
}
exports.saveSettings = {
  handler: function(request,reply){
    var setting = settings.find({},function(err,data){
      if(data.length == 0){//no hay settings
        var new_settings = new settings({
          pin_login: request.payload.pin_login
        })
        new_settings.save();
        return reply(new_settings)
      }else{
        data[0].pin_login = request.payload.pin_login;
        data[0].save();
        return reply(data[0]);
      }
    })
  }
}
exports.getSettings = {
  handler: function(request,reply){
    var setting = settings.find({},function(err,data){
      return reply(data[0]);
    })
  }
}

exports.updatePriorityAfterSplice = {
  handler: function(request,reply){
    var habitacion = room.findOne({room_id:request.payload.room.room_id},function(err,response){
      response.priority=request.payload.room.priority
      response.save();
    });
    return reply('ok');
  }
}
