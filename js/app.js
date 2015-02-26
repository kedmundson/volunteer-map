(function () {

  var model = {
    wifiURL: 'https://nycopendata.socrata.com/api/views/jd4g-ks2z/rows.json',
    usernameToken: ''
  };
  
  var controller = {
    init: function() {
      view.init();
    },

    getData: function() {
      $.ajax({
          url: model.wifiURL
        })
        .done(function(data) {
          console.log(data);
        });
    },

    showResults: function() {}

  };

  var view = {
    init: function() {
      var $results = $('#results');
      controller.getData();
    }

  };

  controller.init();

})();
