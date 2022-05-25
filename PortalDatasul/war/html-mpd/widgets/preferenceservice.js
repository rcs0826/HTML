define(['index'], function(index) {
	factoryUserPreference.$inject = ['$http'];

	function factoryUserPreference($http) {

		var factory = this;

		factory.get = function(prefId){
			return $http.get('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0035/preference/' + prefId);
		}

		factory.set = function(prefId, value){
			return $http.put('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0035/preference/' + prefId + '?prefValue=' + value);
		}

		return factory;
	}// function factoryUserPreference ($resource)

	index.register.factory('userPreference', factoryUserPreference);

});