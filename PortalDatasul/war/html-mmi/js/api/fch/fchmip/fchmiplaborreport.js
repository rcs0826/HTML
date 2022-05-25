define(['index'], function(index) {

	fchmiplaborreportFactory.$inject = ['$totvsresource'];	
	function fchmiplaborreportFactory($totvsresource) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmip/fchmiplaborreport/:method/:id', {}, {
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

        factory.getTechnicianByUser = function (param, callback) {
    		return this.TOTVSPostArray({method:"getTechnicianByUser"},param , callback);
    	};
    	    	
		return factory;
	}
	
	index.register.factory('fchmip.fchmiplaborreport.Factory', fchmiplaborreportFactory);
});
