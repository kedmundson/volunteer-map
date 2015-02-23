(function () {

  var model = {
    baseURL: 'http://www.volunteermatch.org/api/call?action=helloWorld'
  };
  
  var controller = {
    init: function() {
      view.init();
    },

    getData: function() {
      // add &query parameter to concatenate to baseURL
      // build api call:
      // use $.ajax headers to add auth info
      $.getJSON(model.baseURL, function(data) {
      });
    },

    showResults: function() {}

  };

  var view = {
    init: function() {
      var $results = $('#results');
      // controller.getData();
    }

  };

  controller.init();

})();
