var SHA3 = require("crypto-js/sha3");
var boom = require('boom');
var room = require('../schemas/room');

//set timer to restart the asigned rooms at 5 AM

var date = new Date();
var current_hour = date.getHours();
var current_minutes = date.getMinutes();
var current_seconds = date.getSeconds();

var ms_in_day = 24*60*60*1000
var ms_in_hour_to_reset = 19*60*60*1000 + 57*60*1000
current_hour = current_hour* 60 * 60 *1000
current_minutes = current_minutes * 60 * 1000
current_seconds = current_seconds * 1000
var current_time = current_hour+current_minutes+current_seconds
var ms_till_reset 
console.log(current_time)
console.log(ms_in_hour_to_reset)
if(current_time <= ms_in_hour_to_reset){
  ms_till_reset = ms_in_hour_to_reset - current_time
}else{
  ms_till_reset = ms_in_day - current_time +  ms_in_hour_to_reset
}
console.log(ms_till_reset)
setInterval(function() {
     ms_till_reset = ms_in_day;
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
        answer.save();
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

     console.log(request.payload)  
     var habitacion = room.findOne({room_id:request.payload.room_id},function(err,room){
        room.status = room.status
        for(var i = 0; i < room.idUser.length; i++) {
          if(room.idUser[i].username === request.payload.previous_user){
            room.idUser.splice(i,1)
            break;
          }
        }
        room.idUser.push(request.payload.next_user)
        room.priority=room.priority
        room.observation=room.observation 
        room.time_reserved =room.time_reserved 
        room.save();
        return reply(room);
      });
  }
}
exports.updateDistributedRooms = {
  handler: function(request,reply){/*
     console.log(request.payload)*/
     var habitacion = room.findOne({room_id:request.payload.room_id},function(err,room){
        room.status = room.status,
        room.idUser.push(request.payload.employee),
        room.priority=room.priority
        room.observation=room.observation ,
        room.time_reserved =room.time_reserved 
        room.save();
        return reply(room);
      });
    /*for (var i = 0; i < request.payload.length; i++) {
      for (var i = 0; i < request.payload[i].habitacion.length; i++) {
        request.payload[i].habitacion[i]
      }
    }
      console.log(request.payload[0].habitacion.length )
      var habitacion = room.find({},function(err,array){
        console.log(array.length)
        console.log("=====")
          for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < request.payload.length; j++) {
                console.log(request.payload[j].length)
                console.log(request.payload[j].habitacion.length)
                for (var k = 0; k < request.payload[j].habitacion.length; k++) {
                  if(request.payload[j].habitacion[k].room_id === 
                    array[i].room_id){
                      array[i].idUser.push(request.payload[j].empleado)
                      console.log(array[i])
                     // array[i].save();
                      break;
                  }
                }
            }
          }
      })*/
      /*segundo enfoque
      console.log(request.payload.habitacion)
      console.log(request.payload.habitacion.length)
      for (var i = 0; i < request.payload.habitacion.length; i++) {
        console.log(i + " --")
        var habitacion = room.findOne({room_id:request.payload.habitacion[i].room_id},function(err,answer){
          console.log(answer)
            answer.status = request.payload.habitacion[i].status
            answer.room_id = request.payload.habitacion[i].room_id
            var entro = false;
            for (var i = 0; i < answer.idUser.length; i++) {
              if(answer.idUser[i].username == request.payload.empleados.username){
                entro = true;
                break;
              }
            }
            if (!entro) {
              answer.idUser.push(request.payload.empleados)
            }

            answer.priority= request.payload.habitacion[i].priority
            answer.observation= request.payload.habitacion[i].observation
            answer.time_reserved = request.payload.habitacion[i].time_resserved
            //answer.save();
            return reply(answer);
          });
      }*/
  }
}

exports.getemproom={
 
   handler: function(request, reply){
    var habitacion = room.find({},function(err,data){
      console.log()
      return reply(data)
    });
  }
}