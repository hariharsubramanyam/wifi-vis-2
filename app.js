var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/wifi");

var data_for_timestamp_route = require("./routes/for_timestamp").initialize(mongoose);

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/data", data_for_timestamp_route);

console.log("Listening on port 8080");
app.listen(8080);
module.exports = app;
