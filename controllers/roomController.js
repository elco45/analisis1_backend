var SHA3 = require("crypto-js/sha3");
var boom = require('boom');
var room = require('../schemas/room');

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
      var habitacion = room.findOne({room_id:request.payload.room_id},function(err,answer){
        answer.status = request.payload.status,
        answer.idUser = request.payload.idUser,
        answer.priority= request.payload.priority,
        answer.observation= request.payload.observation,
        answer.time_reserved = request.payload.time_reserved
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

exports.updateDistributedRooms = {
  handler: function(request,reply){
     console.log(request.payload)
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
