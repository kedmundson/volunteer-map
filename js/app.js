// Based on info from: https://data.cityofnewyork.us/Social-Services/NYC-Wi-Fi-Hotspot-Locations/a9we-mtpn

(function () {

  var model = {

    wifiURL: 'https://nycopendata.socrata.com/api/views/jd4g-ks2z/rows.json'

  };
  
  var controller = {

    init: function() {
      view.init();
      this.getWifiData();
    },

    getWifiData: function() {
      $.getJSON(model.wifiURL, function(result) {
        for (var i = 0; i < result.data.length; i++) {
          // Spot name: result.data[i][12] 
          // Lat: result.data[i][14]
          // Long: result.data[i][15]
        }
      });

    },

    showResults: function() {},

    getGeolocation: function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(view.showLatLong);
      } else {
        view.error("Geolocation is not supported by your browser");
      }

    }

  };

  var view = {

    init: function() {
      this.$results = $('#results');
      this.$error = $('#error');
      this.$findBtn = $('#find');
      this.$map = $('#map');

      this.$findBtn.click(function() {
        controller.getGeolocation();
      });
    },

    error: function(message) {
      this.$error.html(message);
    },

    showLatLong: function(position) {
      view.$results.html('Latitude: ' + position.coords.latitude +
                    '<br /> Longitude: ' + position.coords.longitude);
    }

  };

  controller.init();

})();
