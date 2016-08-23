var usersController = require('./controllers/usersController');
var roomController = require('./controllers/roomController');

exports.endpoints = [{method: 'GET', path: '/', config: {handler: function(request, reply){reply('API v1, productos')}}},
					 {method: 'POST', path: '/v1/register', config: usersController.createUser},
					 {method: 'POST', path: '/v1/updateUser', config: usersController.modifUser},
					 {method: 'DELETE', path: '/v1/deleteUser', config: usersController.deleteUser},
					 {method: 'POST', path: '/v1/getUser', config: usersController.getUser},
					 {method: 'POST', path: '/v1/registerRoom', config: roomController.createRoom},
					 {method: 'POST', path: '/v1/updateRoom', config: roomController.modifRoom},
					 {method: 'DELETE', path: '/v1/deleteRoom', config: roomController.deleteRoom},
					 {method: 'POST', path: '/v1/getRoom', config: roomController.getRoom}

				];
