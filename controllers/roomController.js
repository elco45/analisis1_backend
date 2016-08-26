var SHA3 = require("crypto-js/sha3");
var boom = require('boom');
var room = require('../schemas/room');

//habitaciones

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
     observation: request.payload.observation
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
        answer.observation= request.payload.observation
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
          
        }     
        console.log(new_room);
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

