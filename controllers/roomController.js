var SHA3 = require("crypto-js/sha3");
var boom = require('boom');
var room = require('../schemas/room');
var control = require('../schemas/control');
var settings = require('../schemas/settings')
var report = require('../schemas/reports');
var plantillas = require('../schemas/plantilla');

var date = new Date();
var current_hour = date.getHours();
var current_minutes = date.getMinutes();
var current_seconds = date.getSeconds();

var ms_in_day = 24*60*60*1000
var ms_in_hour_to_reset = 11*60*60*1000 + 57*60*1000
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
console.log(current_time, ms_till_reset)
var reset = function() {
   ms_till_reset = ms_in_day;

   console.log(ms_till_reset)
   var habitacion = room.find({},function(err,data){
      for (var i = 0; i < data.length; i++) {
         var habitacion = room.findOne({room_id:data[i].room_id},function(err,answer){
          if(answer.status === 1 || answer.status === 5){    
            var employees_didnt_clean = "";
            for (var j = 0; j < answer.idUser.length; j++) {
                employees_didnt_clean +=answer.idUser[j].username
                if(j < answer.id.length -1)
                  employees_didnt_clean += ","
            }        
            var today = new Date()
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();

            if(dd<10) {
                dd='0'+dd
            }

            if(mm<10) {
                mm='0'+mm
            }

            today = mm+'/'+dd+'/'+yyyy;
            var reporte = new report({
              employee_username: employees_didnt_clean,
              room_number: answer.room_id,
              problem_id: 0,
              room_state: 6,
              date_reported: today,
              resolved: true,
              seen:false

            });
            //Guardando
            reporte.save();
          }
            
          answer.status = 0//fue atendida asi que se resetea


          answer.idUser = [],
          answer.priority= -1,
          answer.observation="",
          answer.time_reserved =answer.time_reserved
          answer.save();
        });

      }
    });
  setTimeout(reset, ms_till_reset);
}

setTimeout(reset, ms_till_reset);
//-----

exports.requestTime = {
  handler: function(request,reply){
    var today = new Date();
    return reply(today);
  }
}
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
     idRoomType: request.payload.idRoomType,
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
        var usuario = [];
        for (var i = 0; i < answer.idUser.length; i++) {
          var new_user = {
              username: answer.idUser[i].username,   
              name: answer.idUser[i].name,
              employee_type: answer.idUser[i].employee_type,
              status: answer.idUser[i].status,
              role: answer.idUser[i].role,
              id: answer.idUser[i].id,
              cel: answer.idUser[i].cel,
              tel: answer.idUser[i].tel,
              direction: answer.idUser[i].direction,
              birth_date: answer.idUser[i].birth_date,// dia/mes/año
              civil_status: answer.idUser[i].civil_status,
              children: answer.idUser[i].children,
              observation: answer.idUser[i].observation,
              pin: answer.idUser[i].pin 
            } 
            usuario.push(new_user);
        };
        answer.room_id = request.payload.room.room_id,
        answer.status = request.payload.room.status,
        answer.idUser = usuario,
        answer.priority= request.payload.room.priority,
        answer.observation= request.payload.room.observation,
        answer.idRoomType = request.payload.room.idRoomType,
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
          idRoomType: data[0].idRoomType,
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
        /*var new_user = {
              username: request.payload.next_user.username,   
              name: request.payload.next_user.name,
              employee_type: request.payload.next_user.employee_type,
              status: request.payload.next_user.status,
              role: request.payload.next_user.role,
              id: request.payload.next_user.id,
              cel: request.payload.next_user.cel,
              tel: request.payload.next_user.tel,
              direction: request.payload.next_user.direction,
              birth_date: request.payload.next_user.birth_date,// dia/mes/año
              civil_status: request.payload.next_user.civil_status,
              children: request.payload.next_user.children,
              observation: request.payload.next_user.observation,
              pin: request.payload.next_user.pin 
        }*/ 
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
        /*var usuario = [];
        for (var i = 0; i < response.idUser.length; i++) {
          var new_user = {
              username: response.idUser[i].username,   
              name: response.idUser[i].name,
              employee_type: response.idUser[i].employee_type,
              status: response.idUser[i].status,
              role: response.idUser[i].role,
              id: response.idUser[i].id,
              cel: response.idUser[i].cel,
              tel: response.idUser[i].tel,
              direction: response.idUser[i].direction,
              birth_date: response.idUser[i].birth_date,// dia/mes/año
              civil_status: response.idUser[i].civil_status,
              children: response.idUser[i].children,
              observation: response.idUser[i].observation,
              pin: response.idUser[i].pin 
            } 
          usuario.push(new_user);
        };*/
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

exports.getPlantillas = {
  handler : function(request,reply){

    var plantilla =  plantillas.find({}, {plantilla_nombre:1,plantilla_descripcion:1, _id:0},function(err,response){
        return reply(response)
    })
  }
}

exports.cargarPlantillas = {
  handler : function(request,reply){

    var habitaciones =  room.remove({},function(err,response1){
        var plantilla =  plantillas.findOne({plantilla_nombre:request.payload.plantilla_nombre},function(err,response){
              for (var i = 0; i < response.rooms_in_JSON.length; i++) {
                var habitacion = new room({
                 status: response.rooms_in_JSON[i].status,
                 room_id: response.rooms_in_JSON[i].room_id,
                 idUser: response.rooms_in_JSON[i].idUser,
                 priority: response.rooms_in_JSON[i].priority,
                 observation: response.rooms_in_JSON[i].observation,
                 time_reserved: response.rooms_in_JSON[i].time_reserved
                });
                //Guardando
                habitacion.save();
            }
            return reply("ok")
        })
    })
  }
}

exports.createPlantillas = {
  handler: function(request, reply) {
    var request_info  = request.payload;
    var habitaciones = room.find({},function(err,data){
      var array = [];
      var room_obj ;
      for (var i = 0; i < data.length; i++) {
         room_obj =  {
          status: data[i].status,
          room_id: data[i].room_id,
          idUser: data[i].idUser,
          priority: data[i].priority,
          time_reserved: data[i].time_reserved,
          observation: data[i].observation
        }
        array.push(room_obj)
      }
      
      var plantilla = new plantillas({
         plantilla_nombre: request.payload.plantilla_nombre,
         plantilla_descripcion: request.payload.plantilla_descripcion,
         rooms_in_JSON: array
      });
      //Guardando
     plantilla.save(function (err) {
        if(err){
          return reply('el nombre debe ser unico ' + err);
        }else{
          return reply('Agregado exitosamente ');
        }//fin else
      });
    });
  }
}