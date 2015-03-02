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
        console.log(result.data.length);
        for (var i = 0; i < result.data.length; i++) {
          console.log('name of spot is: ' + result.data[i][12]);
        }
      });

    },

    showResults: function() {}

  };

  var view = {
    init: function() {
      var $results = $('#results');
    }

  };

  controller.init();

})();
