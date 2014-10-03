var express = require("express");
var async = require("async");
var AccessData = require("../models/AccessData").AccessData;
var route_helper = require("./route_helper");
var send_error = route_helper.send_error;
var send_response = route_helper.send_response;
var router = express.Router();
var mongoose;

router.get("/from/:start/to/:end", function(req, res) {
  async.waterfall([
    // Step 1: Get the timestamp.
    function(callback) {
      try {
        var start = parseInt(req.params.start, 10);
        var end = parseInt(req.params.end, 10);
        callback(null, start, end);
      } catch(err) {
        send_error(res, "Could not parse timestamp");
      }
    },
    // Step 2: Look up the accesses for that timestamp.
    function(start, end, callback) {
      AccessData.find({"Timestamp": {"$gte": start, "$lte": end}}, function(err, results) {
        if (err) send_error(res, err);
        send_response(res, results);
      });
    }
  ]);
});

module.exports.initialize = function(_mongoose) {
  mongoose = _mongoose;
  return router;
}
