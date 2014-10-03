var mongoose = require("mongoose");

var AccessDataSchema = mongoose.Schema({
  Timestamp: {type: Number, index: true},
  NumConnected: Number,
  ID: Number,
  Longitude: Number,
  Latitude: Number
});

var AccessData = mongoose.model('AccessData', AccessDataSchema, 'access_data');
module.exports.AccessData = AccessData;
