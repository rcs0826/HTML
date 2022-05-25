define (['index'], function(index){    

    dataFactory.$inject = ['$window'];

    function dataFactory($window){
         var factory = {};

         factory.set = function(key,value){
             $window.localStorage.setItem(key, value);
         }

         factory.get = function(key){
             return $window.localStorage.getItem(key);
         }

         factory.delete = function(key){
             $window.localStorage.removeItem(key);
         }

         return factory;
    };

    index.register.factory('mce.data.Factory', dataFactory);

});