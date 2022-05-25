define(['index'], function (index) {

	factoryUserPreference.$inject = ['$totvsresource', '$resource'];

	function factoryUserPreference($totvsresource, $resource) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0035/preference/:prefId', {prefId: '@prefId'}, {});

		factory.getPreference = function(prefId){
			return factory.TOTVSGet({prefId: prefId}, function(data){} , {noCountRequest: true });
		}

		factory.setPreference = function(prefId, value){
			return factory.TOTVSUpdate({prefId: prefId, prefValue: value});
		}

		return factory;
	}// function factoryUserPreference ($totvsresource)

	index.register.factory('userPreference', factoryUserPreference);
});