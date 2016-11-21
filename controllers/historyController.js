var SHA3 = require("crypto-js/sha3");
var boom = require('boom');
var report = require('../schemas/reports');
var control = require('../schemas/control');
exports.getReports = {
  handler: function(request, reply){
    var reporte = report.find({},function(err,data){
      return reply(data)
    });

  }
}