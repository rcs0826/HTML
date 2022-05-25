define(['index'], function(index) {

	logFactory.$inject = ['$totvsresource'];
	function logFactory($totvsresource) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmip/fchmiplog/:method/:id', {}, {
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
		
	    factory.buscaDadosLog = function (params, callback) {
	    	return this.TOTVSPost({method:"buscaDadosLog"}, params, callback);
		}
		
		factory.removerLog = function (params, callback) {
	    	return this.TOTVSPost({method:"removerLog"}, params, callback);
		}
		
		factory.buscaErrosLog = function (params, callback) {
	    	return this.TOTVSPostArray({method:"buscaErrosLog"}, params, callback);
		}
		
		factory.reprocessar = function (params, callback) {
	    	return this.TOTVSPost({method:"reprocessar"}, params, callback);
	    }
	
		factory.buscaAnexos = function (params, callback) {
	    	return this.TOTVSPostArray({method:"buscaAnexos"}, params, callback);
		}
		return factory;
	}

	index.register.factory('fchmip.log.Factory', logFactory);
});