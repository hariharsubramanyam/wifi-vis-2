var express = require("express");
var async = require("async");
var route_helper = require("./route_helper");
var send_error = route_helper.send_error;
var send_response = route_helper.send_response;
var router = express.Router();
var mongoose;

module.exports.initialize = function(_mongoose) {
  mongoose = _mongoose;
  return router;
}
