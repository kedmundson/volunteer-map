// Based on public data from the City of New York:
// https://data.cityofnewyork.us/Social-Services/NYC-Wi-Fi-Hotspot-Locations/a9we-mtpn

(function () {

  var model = {

    wifiURL: 'https://nycopendata.socrata.com/api/views/jd4g-ks2z/rows.json',

    init: function() {
      // check for local storage availability
      if(typeof(Storage) !== "undefined") {
        if (!localStorage.wifiData) {
          this.getWifiJSON();
        } else {
          console.log('localStorage.wifiData is ready.');
        }
      } else {
        // TODO: support no localStorage case
      }
    },

    getWifiJSON: function() {
      $.ajax({ url: this.wifiURL })
            .done(function(result) {
              model.saveUsefulData(result.data);
            });
    },

    saveUsefulData: function(data) { 
      // save only the useful fields in a new array of objects
      var wifiData = [],
          point;

      for (var i = 0; i < data.length; i++) {
        point = {
          name: data[i][12],
          summary: data[i][13],
          lat: data[i][14],
          lng: data[i][15],
          type: data[i][18],
          remarks: data[i][19],
          ssid: data[i][21],
          distanceFromMe: 0
        };
        wifiData.push(point);
      }

      // Save result to local storage
      localStorage.wifiData = JSON.stringify(wifiData);
      console.log('Saved wifiData to localStorage.');
    },

    getAllPoints: function() {
      return JSON.parse(localStorage.wifiData);
    },

    closestPoints: []

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

    useGeo: function(mypos) {
      view.recenterMap(mypos.coords.latitude, mypos.coords.longitude);
      controller.getClosestPoints(mypos);
    },

    getClosestPoints: function (mypos) {
      // Use the Haversine formula to determine the three closest
      // wifi points to the user's location. Steps commented below.

      var pi = Math.PI,
          radius = 3959, // Earth's radius in miles
          // Convert mypos lat + long from degrees to radians
          posLatRdn = mypos.coords.latitude * (pi / 180),
          posLngRdn = mypos.coords.longitude * (pi / 180),
          points = model.getAllPoints(),
          pointLatRdn,
          pointLngRdn,
          dLat,
          dLng;

      for (var i = 0; i < points.length; i++) {
        // For each point's lat + long, convert degrees to radians
        pointLatRdn = points[i].lat * (pi / 180);
        pointLngRdn = points[i].lng * (pi / 180);

        // Get the difference between the two latitudes and longitudes
        dLat = pointLatRdn - posLatRdn;
        dLng = pointLngRdn - posLngRdn;

        // Plug the values in
        a = Math.sin(dLat / 2) * Math.sin(dLat /2) + Math.sin(dLng / 2) *
            Math.sin(dLng /2) * Math.cos(posLatRdn) * Math.cos(pointLatRdn);
        c = 2 * Math.asin(Math.sqrt(a));

        // Update each point's distanceFromMe key with the final distance value 
        points[i].distanceFromMe = radius * c;
      }

      // Now that all the point distances are updated, sort the points array 
      // in ascending order by the new distance value
      points.sort(function(a, b) {
        return a.distanceFromMe - b.distanceFromMe;
      });

      // Save the first five items, i.e. the closest points to me
      model.closestPoints = points.slice(0, 5);

      // Send them to the marker factory
      for (var i = 0; i < model.closestPoints.length; i++) {
        view.wifiMarker(model.closestPoints[i]);
      }
    },

    showResults: function() {
      // list results info below map
    }

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

    showLatLong: function(mypos) {
      this.$results.html('Latitude: ' + mypos.coords.latitude +
                    '<br /> Longitude: ' + mypos.coords.longitude);
    },

    newGoogleMap: function(lat, lng) {
      var mapOptions = {
        zoom: 10,
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
    },

    wifiMarker: function(point) {
      new google.maps.Marker({  
        map: this.googleMap,
        position: new google.maps.LatLng(point.lat, point.lng)
      });
    }

  };

  controller.init();

})();
