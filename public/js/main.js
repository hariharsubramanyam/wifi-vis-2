(function() {

  var draw_circles_for_data = function(access_data) {
    var wifi_point;
    var lat;
    var lon;
    var num_connected;
    for (var k in access_data) {
      wifi_point = k.split(",");
      lat = parseFloat(wifi_point[0]); 
      lon = parseFloat(wifi_point[1]);
      num_connected = access_data[k];
      if (!circle_for_lat_lon.hasOwnProperty([lat, lon])) {
        circle_for_lat_lon[[lat, lon]] = L.circle([lat, lon], 100).addTo(map);
      }
      circle_for_lat_lon[[lat, lon]].setRadius(num_connected / 2);
    }
  }; 

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
    callback(null);
  };

  var go_to_time_handler = function() {
    var timestamp = extract_timestamp();
    if (timestamp === null) {
      alert("You must pick a date and a time");
    } else {
      current_index = timestamp_manager.nearby_index(timestamp);
      set_for_date_from_current_index();
    }
  };

  var forward_handler = function() {
    current_index = timestamp_manager.next_index(current_index);
    set_for_date_from_current_index();
  };

  var backward_handler = function() {
    current_index = timestamp_manager.prev_index(current_index);
    set_for_date_from_current_index();
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


  $(document).ready(function() {
    async.series([
      setup_map,
      setup_variables,
      setup_handlers
    ]);
    return;

    am_pm = $("#am-pm");
    time_hr = $("#time-hr");
    time_min = $("#time-min");
    go_to_time_button = $("#go-to-time");
    animate_button = $("#animate");

    am_pm.click(am_pm_handler);
    go_to_time_button.click(go_to_time_handler);
    animate_button.click(animate_handler);

    $.get("util/data.csv", function(data) {
      data_accessor = Global.DataAccessor(data);
    });

    map = L.map('map').setView([42.360183,-71.090469], 17);

    // add an OpenStreetMap tile layer
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  });
})();
