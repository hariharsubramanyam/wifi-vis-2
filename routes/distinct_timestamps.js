var express = require("express");
var async = require("async");
var route_helper = require("./route_helper");
var AccessData = require("../models/AccessData").AccessData;
var send_error = route_helper.send_error;
var send_response = route_helper.send_response;
var router = express.Router();
var mongoose;

router.get("/timestamps", function(req, res) {
  AccessData.distinct("Timestamp", function(err, results) {
    if (err) send_error(res, err);
    send_response(res, results);
  });
});

module.exports.initialize = function(_mongoose) {
  mongoose = _mongoose;
  return router;
}
