var express = require("express");
var async = require("async");
var route_helper = require("./route_helper");
var AccessData = require("../models/AccessData").AccessData;
var send_error = route_helper.send_error;
var send_response = route_helper.send_response;
var router = express.Router();
var mongoose;

router.get("/at/:timestamp", function(req, res) {
  async.waterfall([
    // Step 1: Get the timestamp.
    function(callback) {
      try {
        var timestamp = parseInt(req.params.timestamp, 10);
        callback(null, timestamp);
      } catch(err) {
        send_error(res, "Could not parse timestamp");
      }
    },
    // Step 2: Look up the accesses for that timestamp.
    function(timestamp, callback) {
      AccessData.find({"Timestamp": timestamp}, function(err, results) {
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
