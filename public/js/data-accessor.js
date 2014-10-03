(function() {
  var DataAccessor = function() {
    var _cache = new SimpleLRU(24);

    /**
     * Returns the data for a given timestamp. Executes the callback as
     * callback(data).
     */
    var get_data_for_timestamp = function(timestamp, callback) {
      if (_cache.has(timestamp)) {
        callback(_cache.get(timestamp));
      } else {
        $.get("/data/at/"+timestamp, function(data) {
          _cache.set(timestamp, data);
          callback(data);
        });
      }
    };

    var that = {};
    that.get_data_for_timestamp = get_data_for_timestamp;
    return that;
  };

  Global.DataAccessor = DataAccessor;
})();
