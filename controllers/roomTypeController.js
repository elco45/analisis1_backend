var SHA3 = require("crypto-js/sha3");
var boom = require('boom');
var type = require('../schemas/roomType');


exports.getAllRoomType = {
  handler: function(request, reply){
    var types = type.find({},function(err,data){
      return reply(data)
    });
  }
}

exports.createRoomType = {
	handler: function(request, reply) {
    var type1 = new type({
    	description: request.payload.description,
   	});
		type1.save(function (err) {
			if(err){
			  	return reply(err);
			}
		});
	}
}

exports.getRoomType = {
  handler: function(request, reply){
    var reporte = type.findOne({_id: request.payload.idRoomType},function(err,data){
      return reply(data)
    });
  }
}


