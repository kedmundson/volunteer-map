// Based on public data from the City of New York:
// https://data.cityofnewyork.us/Social-Services/NYC-Wi-Fi-Hotspot-Locations/a9we-mtpn

(function () {

  var model = {

    wifiURL: 'https://nycopendata.socrata.com/api/views/jd4g-ks2z/rows.json',

    init: function() {
      if (!localStorage.wifiData) {
        this.getWifiJSON();
      } else {
        console.log('localStorage.wifiData is ready.');
      }
    },

    getWifiJSON: function() {
      $.ajax({ url: this.wifiURL })
            .done(function(result) {
              // Save result to local storage
              localStorage.wifiData = JSON.stringify(result.data);
              console.log('Saved wifiData to localStorage.');
            });
    },

    getPoints: function() {
      return JSON.parse(localStorage.wifiData);

      // Spot name: result.data[i][12] 
      // Lat: result.data[i][14]
      // Long: result.data[i][15]
    }


  };
  
  var controller = {

    init: function() {
      model.init();
      view.init();
    },

    getGeolocation: function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(controller.useGeo);
      } else {
        view.error("Geolocation is not supported by your browser");
      }
    },

    useGeo: function(position) {
      view.recenterMap(position.coords.latitude, position.coords.longitude);
      controller.getClosestPoints(position);
    },

    getClosestPoints: function (position) {
      // pull in points from model.getPoints

      // First convert position lat + long from degrees to radians

      // Next loop through array of points. 
      // For each point's lat + long, convert degrees to radians,
      // then plug all four values into Haversine formula to get
      // distance from me to point.
      // Add point to an array.

      // After the loop completes, sort the array in ascending order
      // of the new distance value.

      // Return the first three items. 
    
    },

    showResults: function() {}

  };

  var view = {

    init: function() {
      this.$results = $('#results');
      this.$error = $('#error');
      this.$findBtn = $('#find');
      this.$map = $('#map');
      this.googleMap;
      this.myLatLng;

      this.newGoogleMap(40.7127, -74.0059); // default to NYC

      this.$findBtn.click(function() {
        controller.getGeolocation();
      });
    },

    error: function(message) {
      this.$error.html(message);
    },

    showLatLong: function(position) {
      this.$results.html('Latitude: ' + position.coords.latitude +
                    '<br /> Longitude: ' + position.coords.longitude);
    },

    newGoogleMap: function(lat, lng) {
      var mapOptions = {
        zoom: 11,
        center: new google.maps.LatLng(lat, lng)
      };
      this.googleMap = new google.maps.Map(this.$map[0], mapOptions);
    },

    recenterMap: function(lat, lng) {
      this.myLatLng = new google.maps.LatLng(lat, lng);
      this.googleMap.setCenter(this.myLatLng);
      this.googleMap.setZoom(16);
      new google.maps.Marker({  
        map: this.googleMap,
        position: this.myLatLng,
        icon: this.customMarker
      });
    },

    customMarker: {
      path: 'M-7,0a7,7 0 1,0 14,0a7,7 0 1,0 -14,0',
      fillColor: 'blue',
      fillOpacity: 0.6,
      scale: 1,
      strokeColor: 'white',
      strokeWeight: 3
    }

  };

  controller.init();

})();
