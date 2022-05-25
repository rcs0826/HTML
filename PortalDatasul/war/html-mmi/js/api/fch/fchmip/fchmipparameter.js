define(['index'], function(index)  {

	fchmipparameterFactory.$inject = ['$totvsresource'];
	function fchmipparameterFactory($totvsresource) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmip/fchmipparameter/:method/:field', {}, {
			postArray: {
				method: 'POST',
				isArray: true
			}
		});

	    factory.TOTVSPostArray = function (parameters, model, callback, headers) {
	        this.parseHeaders(headers);
	        var call = this.postArray(parameters, model);
	        return this.processPromise(call, callback);
	    };

	    factory.getIntParam = function (pFieldName, callback) {
    		return this.TOTVSGet({method:"getIntParam", field:pFieldName}, callback);
    	};
    	
    	factory.getCharParam = function (pFieldName, callback) {
    		return this.TOTVSGet({method:"getCharParam", field:pFieldName}, callback);
    	};
    	
    	factory.getDateParam = function (pFieldName, callback) {
    		return this.TOTVSGet({method:"getDateParam", field:pFieldName}, callback);
    	};
    	
    	factory.getDecParam = function (pFieldName, callback) {
    		return this.TOTVSGet({method:"getDecParam", field:pFieldName}, callback);
    	};
    	
    	factory.getLogParam = function (pFieldName, callback) {
    		return this.TOTVSGet({method:"getLogParam", field:pFieldName}, callback);
    	};

		return factory;
	}

	index.register.factory('fchmip.fchmipparameter.Factory', fchmipparameterFactory);
});
