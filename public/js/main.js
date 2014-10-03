(function() {


  var map;
  var timestamp_manager;
  var data_accessor;
  var date_picker;
  var date_selector;
  var time_picker;
  var time_selector;
  var btn_go_to_time;
  var btn_forward;
  var btn_backward;
  var current_index;
  var circle_for_lat_lon = {};

  $(document).ready(function() {
    async.series([
      setup_map,
      setup_variables,
      setup_handlers
    ]);
  });

  var setup_map = function(callback) {
    map = L.map('map').setView([42.360183,-71.090469], 17);
    // add an OpenStreetMap tile layer
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    callback(null);
  };

  var setup_variables = function(callback) {
    data_accessor = Global.DataAccessor();
    timestamp_manager = Global.TimestampManager();
    date_picker = $("#date_picker").pickadate();
    time_picker = $("#time_picker").pickatime({"interval": 1});
    date_selector = date_picker.pickadate("picker");
    time_selector = time_picker.pickatime("picker");
    btn_backward = $("#btn_backward");
    btn_go_to_time = $("#btn_go_to_time");
    btn_forward = $("#btn_forward");
    timestamp_manager.initialize(callback);
  };

  var setup_handlers = function(callback) {
    btn_go_to_time.click(go_to_time_handler);
    btn_forward.click(forward_handler);
    btn_backward.click(backward_handler);
    current_index = 0;
    set_for_date_from_current_index();
    draw_map_for_current_index();
    callback(null);
  };

  var go_to_time_handler = function() {
    var timestamp = extract_timestamp();
    if (timestamp === null) {
      alert("You must pick a date and a time");
    } else {
      current_index = timestamp_manager.nearby_index(timestamp);
      set_for_date_from_current_index();
      draw_map_for_current_index();
    }
  };

  var disable_all = function() {
    btn_go_to_time.addClass("disabled");
    btn_forward.addClass("disabled");
    btn_backward.addClass("disabled");
    btn_go_to_time.prop("disabled", true);
    btn_forward.prop("disabled", true);
    btn_backward.prop("disabled", true);
  };

  var enable_all = function() {
    btn_go_to_time.removeClass("disabled");
    btn_forward.removeClass("disabled");
    btn_backward.removeClass("disabled");
    btn_go_to_time.prop("disabled", false);
    btn_forward.prop("disabled", false);
    btn_backward.prop("disabled", false);
  };

  var forward_handler = function() {
    current_index = timestamp_manager.next_index(current_index);
    set_for_date_from_current_index();
    draw_map_for_current_index();
  };

  var backward_handler = function() {
    current_index = timestamp_manager.prev_index(current_index);
    set_for_date_from_current_index();
    draw_map_for_current_index();
  };

  var set_for_date = function(date) {
    date_selector.set("select", [date.getFullYear(), date.getMonth(), date.getDate()]);
    time_selector.set("select", [date.getHours(), date.getMinutes()]);
  };

  var set_for_date_from_current_index = function() {
    var timestamp = timestamp_manager.get_timestamp(current_index);
    var date = timestamp_manager.timestamp_to_date(timestamp);
    set_for_date(date);
  };

  var draw_map_for_current_index = function() {
    var timestamp = timestamp_manager.get_timestamp(current_index);
    disable_all();
    var date = data_accessor.get_data_for_timestamp(timestamp, function(data) {
      data = JSON.parse(data);
      var result = data.result;
      var lat;
      var lon;
      var num_connected;
      for (var i = 0; i < result.length; i++) {
        lat = result[i].Latitude;
        lon = result[i].Longitude;
        num_connected = result[i].NumConnected;
        if (!circle_for_lat_lon.hasOwnProperty([lat, lon])) {
          circle_for_lat_lon[[lat, lon]] = L.circle([lat, lon], 100).addTo(map);
        }
        circle_for_lat_lon[[lat, lon]].setRadius(num_connected / 2);
      }
      enable_all();
    });
  };

  var extract_timestamp = function() {
    var date_select = date_selector.get("select");
    var time_select = time_selector.get("select");
    if (date_select === null || time_select === null) {
      return null;
    }
    var date = new Date(date_select.year,
        date_select.month,
        date_select.date,
        time_select.hour,
        time_select.mins,
        0,
        0);
    return date.getTime() / 1000;
  };
})();
