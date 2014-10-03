var fs = require("fs");
var timestamps = JSON.parse(fs.readFileSync("timestamps.json").toString("utf-8")).result;
timestamps.sort();
fs.writeFileSync("sorted_timestamps.json", JSON.stringify(timestamps));
