define(['index'], function(index) {

	fchmip094Factory.$inject = ['$totvsresource'];	
	function fchmip094Factory($totvsresource) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmip/fchmip0094/:method/:id', {}, {
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

        factory.getListLaborReport = function (param, callback) {
    		return this.TOTVSPostArray({method:"getListLaborReport"}, param, callback);
    	};
    	    	
		return factory;
	}
	
	index.register.factory('fchmip.fchmip094.Factory', fchmip094Factory);
});
