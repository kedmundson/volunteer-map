(function () {

  var model = {
    baseURL: 'http://www.volunteermatch.org/api/call?action=helloWorld&query="{\"name\":\"Kate\"}"',

    usernameToken: ''
  };
  
  var controller = {
    init: function() {
      view.init();
    },

    getData: function() {
      $.ajax({
          type: 'GET',
          url: model.baseURL,
          headers: {
            'Authorization': 'WSSE profile="UsernameToken"',
            'X-WSSE': model.usernameToken
          }
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
      // controller.getData();
    }

  };

  controller.init();

})();
