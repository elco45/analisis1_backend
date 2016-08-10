var homeController = require('./controllers/homeController');

exports.endpoints = [{method: 'GET', path: '/', config: {handler: function(request, reply){reply('API v1, productos')}}},
					
				];
