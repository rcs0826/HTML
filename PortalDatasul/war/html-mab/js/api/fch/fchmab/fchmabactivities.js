define(['index'], function(index) {

	// *************************************************************************************
	// *** FACTORIES
	// *************************************************************************************
	fchmabactivitiesFactory.$inject = ['$totvsresource'];	
	function fchmabactivitiesFactory($totvsresource) {


		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmab/fchmabactivities/:method/:id', {}, {			
			postArray: { 
				method: 'POST',
				isArray: false
			}			
		});

		factory.atividadeAgricola = undefined;

	    factory.TOTVSPostArray = function (parameters, model, callback, headers) {
	        this.parseHeaders(headers);
	        var call = this.post(parameters, model);
	        return this.processPromise(call, callback);
	    };

		factory.integraAtividadeAgricola = function (callback) {
			
			var params = {};
			
			params.method = "integraAtividadeAgricola";
			
            return this.TOTVSGet(params, callback);

		};

		factory.verificaAgro = function(callback){
	        // verifica o parametros agroindustria (cd0101)
	        if (factory.atividadeAgricola == undefined) {
		        factory.integraAtividadeAgricola(function(result){
		        	factory.atividadeAgricola = (result['p-agro'] === true);
	    			callback(factory.atividadeAgricola);
		        });
	    	} else {
	    		callback(factory.atividadeAgricola);
	    	}
		}

		
		return factory;
	}
	
	index.register.factory('mab.fchmabactivities.Factory', fchmabactivitiesFactory);

});