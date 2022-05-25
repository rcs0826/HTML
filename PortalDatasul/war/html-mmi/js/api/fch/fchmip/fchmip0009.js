define(['index',
		'components',
		'totvs-custom',
		'ng-load!totvs-resource'
		], function(index) {

	fchmip0009Factory.$inject = ['$totvsresource'];	
	function fchmip0009Factory($totvsresource) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fchmip0009/:method/:id', {}, {
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

        factory.geraOM = function (param, callback) {
    		return this.TOTVSPost({method:"geraOm"},param , callback);
    	};
    	    	
		return factory;
	}
	
	index.register.factory('fchmip.fchmip0009.Factory', fchmip0009Factory);
});
