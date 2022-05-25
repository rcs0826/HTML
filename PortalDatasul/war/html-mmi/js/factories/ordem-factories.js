
define(['index'], function(index) {
  
  dataFactory.$inject = ['$window'];
  function dataFactory($window) {
      var factory = {};

      factory.set = function(key, value) {
          $window.localStorage.setItem(key, value);
      };

      factory.get = function(key) {
          return $window.localStorage.getItem(key);
      };

      return factory;
  };

  index.register.factory('mmi.data.OrderFactory', dataFactory);
});