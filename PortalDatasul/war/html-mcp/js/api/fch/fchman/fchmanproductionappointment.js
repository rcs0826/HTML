define(['index'], function(index) {

	fchmanproductionappointmentFactory.$inject = ['$totvsresource'];	
	function fchmanproductionappointmentFactory($totvsresource) {
		
		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchman/fchmanproductionappointment/:method/:id', {}, {
			postArray: { 
				method: 'POST',
				isArray: true
			},
			postObject: { 
				method: 'POST',
				isArray: false
			}
		});
	    
		factory.TOTVSPostArray = function (parameters, model, callback, headers) {
			this.parseHeaders(headers);
			var call = this.postArray(parameters, model);
			return this.processPromise(call, callback);
		}; 
		
		factory.TOTVSPostObject = function (parameters, model, callback, headers) {
			this.parseHeaders(headers);
			var call = this.postObject(parameters, model);
			return this.processPromise(call, callback);
		};	

		factory.getListOrdProd = function (parameters, callback) {
            	return this.TOTVSPostObject({method:"getListOrdProd"}, parameters, callback);
		};

		factory.buscaCtrab = function (parameters, callback) {
            	return this.TOTVSPostArray({method:"buscaCtrab"}, parameters, callback);
		};
		
		factory.aptoPcp = function (parameters, callback) {
            	return this.TOTVSPostArray({method:"aptoPcp"}, parameters, callback);
		};
				
		factory.carregaDadosApontPcp = function (parameters, callback) {
			return this.TOTVSPostArray({method:"carregaDadosApontPcp"}, parameters, callback);
		};
		
		factory.aptoSfc = function (parameters, callback) {
			return this.TOTVSPostArray({method:"aptoSfc"}, parameters, callback);
		};

		factory.carregaDadosApontSfc = function (parameters, callback) {
            	return this.TOTVSPostObject({method:"carregaDadosApontSfc"}, parameters, callback);
		};		

		factory.ptrProd = function (parameters, callback) {
            	return this.TOTVSPostObject({method:"ptrProd"}, parameters, callback);
		};

		return factory;
	}
	
	index.register.factory('fchman.fchmanproductionappointment.Factory', fchmanproductionappointmentFactory);
});