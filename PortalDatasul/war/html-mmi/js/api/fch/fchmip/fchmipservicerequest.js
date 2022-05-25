define(['index'], function(index) {

	fchmipservicerequestFactory.$inject = ['$totvsresource'];
	function fchmipservicerequestFactory($totvsresource) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmip/fchmipservicerequest/:method/:id', {}, {
			postArray: {
				method: 'POST',
				isArray: true
			},            
            postGet: {
				method: 'GET',
				isArray: true
			}
		});

	    factory.TOTVSPostArray = function (parameters, model, callback, headers) {
	        this.parseHeaders(headers);
	        var call = this.postArray(parameters, model);
	        return this.processPromise(call, callback);
		};
		
		factory.TOTVSPostGet = function(parameters, model, callback, headers) {
            this.parseHeaders(headers);
            var call = this.postGet(parameters, model);
            return this.processPromise(call, callback);
        };

	    factory.getListServiceRequest = function (params, callback) {
	    	return this.TOTVSPost({method:"getListServiceRequest"}, params, callback);
	    }

        factory.createServiceRequest = function (param, callback) {
    		return this.TOTVSPostArray({method:"createServiceRequest"}, param, callback);
    	};

    	factory.getParamMiPermEquip = function (callback) {
    		return this.TOTVSGet({method:"getParamMiPermEquip"}, callback);
    	};
    	
    	factory.updateServiceRequest = function (param, callback) {
    		return this.TOTVSPostArray({method:"updateServiceRequest"}, param, callback);
		};
		
		factory.calculaOrcamento = function (param, callback) {
			return this.TOTVSPostGet({method:"calculaOrcamento", 
				cdManut: param.cdManut,
				cdTag: param.cdTag,
				cdEquipto: param.cdEquipto}, callback);
		}

		factory.getPriority = function (param, callback) {
    		return this.TOTVSPostArray({method:"getPriority"}, param, callback);
		};
		
		factory.cancelaSolicitacoesServico = function (params, callback) {
	    	return this.TOTVSPost({method:"cancelaSolicitacoesServico"}, params, callback);
		}
	
		factory.gerarOM = function (param, callback) {
			return this.TOTVSPostArray({method:"gerarOM"}, param, callback);
		}

		factory.buscarAnexos = function (params, callback) {
	    	return this.TOTVSPostArray({method:"buscarAnexos"}, params, callback);
		}
		
		factory.salvarAnexos = function (params, callback) {
	    	return this.TOTVSPostArray({method:"salvarAnexos"}, params, callback);
		}
		
		factory.removerAnexo = function (params, callback) {
	    	return this.TOTVSPost({method:"removerAnexo"}, params, callback);
	    }

		return factory;
	}

	index.register.factory('fchmip.fchmipservicerequest.Factory', fchmipservicerequestFactory);
});
