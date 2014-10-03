(function() {
  /**
   * Manages accessing the array of timestamps.
   */
  var TimestampManager = function() {
    var timestamps;

    /**
     * Gives the index of largest timestamp which is <= value.
     * If value is smaller than all the timestamps, the function returns 0.
     * If initialization is NOT done, then it returns undefined.
     */
    var nearby_index = function(value) {
      if (timestamps === undefined) {
        return undefined;
      }
      var lo = -1;
      var hi = timestamps.length;
      var mid;
      while (hi - lo > 1) {
        mid = Math.round((lo + hi)/2);
        if (timestamps[mid] <= value) {
          lo = mid;
        } else {
          hi = mid;
        }
      }
      lo = Math.max(lo, 0);
      return lo; 
    }

    /**
     * Given an index into the array, returns the next index in the array.
     * If initialization is NOT done, then it returns undefined.
     */
    var next_index = function(index) {
      if (timestamps === undefined) {
        return undefined;
      }
      return Math.min(index + 1, timestamps.length - 1);
    }

    /**
     * Returns a timestamp for the given index.
     * If initialization is NOT done, then it returns undefined.
     */
    var get_timestamp = function(index) {
      if (timestamps === undefined) {
        return undefined;
      }
      return timestamps[index];
    }

    /**
     * Downloads the timestamp data. The callback function is executed after 
     * the data is downloaded.
     */
    var initialize = function(callback) {
      $.get("/client_data/timestamps.json", function(data) {
        timestamps = data.timestamps;
        callback();
      });
    }

    var timestamp_to_date = function(timestamp) {
      return new Date(timestamp * 1000);
    };

    var date_to_timestamp = function(date) {
      return Math.round(date.getTime() / 1000);
    };

    var that = {};
    that.initialize = initialize;
    that.nearby_index = nearby_index;
    that.next_index = next_index;
    that.get_timestamp = get_timestamp;
    that.timestamp_to_date = timestamp_to_date;
    that.date_to_timestamp = date_to_timestamp;
    return that;
  };

  Global.TimestampManager = TimestampManager;
})();
