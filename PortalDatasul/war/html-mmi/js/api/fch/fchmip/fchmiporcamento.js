define(['index'], function(index) {

	orcamentoMiFactory.$inject = ['$totvsresource'];
	function orcamentoMiFactory($totvsresource) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmip/fchmiporcamento/:method/:id', {}, {
			postArray: {
				method: 'POST',
				isArray: true
			},
			getArray: {
                method: 'GET',
                isArray: true
            }
		});

	    factory.TOTVSPostArray = function (parameters, model, callback, headers) {
	        this.parseHeaders(headers);
	        var call = this.postArray(parameters, model);
	        return this.processPromise(call, callback);
		};

		factory.TOTVSGetArray = function (parameters, model, callback, headers) {
            this.parseHeaders(headers);
            var call = this.getArray(parameters, model);
            return this.processPromise(call, callback);
        };

		factory.buscaMoedas = function (callback) {
			return this.TOTVSGetArray({method:"buscaMoedas"}, callback);
		};

		factory.parametrosRpwOrcamento = function (params, callback) {
           	 	return this.TOTVSPost({method: 'parametrosRpwOrcamento'}, params, callback);
		};
	
		return factory;
	}

	index.register.factory('fchmip.orcamento.Factory', orcamentoMiFactory);
});