define(['index'], function(index)  {

	fchmabemployeeFactory.$inject = ['$totvsresource'];
	function fchmabemployeeFactory($totvsresource) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmab/fchmabemployee/:method/:id', {}, {
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
	    
	    factory.buscaEspecialidadesFuncionario = function (params, callback) {
    		return this.TOTVSPostArray({method:"buscaEspecialidadesFuncionario"}, params, callback);
    	};

	    factory.buscaEspecialidades = function (params, callback) {
    		return this.TOTVSPostArray({method:"buscaEspecialidades"}, params, callback);
    	};
    	
    	factory.salvaEspecialidades = function (params, callback) {
    		return this.TOTVSPost({method:"salvaEspecialidades"}, params, callback);
		};
		
		factory.buscaCentroCustoSetor = function (params, callback) {
    		return this.TOTVSPost({method:"buscaCentroCustoSetor"}, params, callback);
    	};
		
	    factory.buscaTreinamentosFuncionario = function (params, callback) {
    		return this.TOTVSPostArray({method:"buscaTreinamentosFuncionario"}, params, callback);
    	};

	    factory.buscaTreinamentos = function (params, callback) {
    		return this.TOTVSPostArray({method:"buscaTreinamentos"}, params, callback);
    	};

    	factory.salvaTreinamentos = function (params, callback) {
    		return this.TOTVSPost({method:"salvaTreinamentos"}, params, callback);
		};

		factory.buscaTurnosFuncionario = function (params, callback) {
    		return this.TOTVSPostArray({method:"buscaTurnosFuncionario"}, params, callback);
    	};

    	factory.salvaTurnoFuncionario = function (params, callback) {
    		return this.TOTVSPost({method:"salvaTurnoFuncionario"}, params, callback);
		};
		
		factory.deletaTurnoFuncionario = function (params, callback) {
    		return this.TOTVSPost({method:"deletaTurnoFuncionario"}, params, callback);
		};
		return factory;
	}

	index.register.factory('fchmab.fchmabemployee.Factory', fchmabemployeeFactory);
});
