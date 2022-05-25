define(['index'], function(index) {

	fchmanpendingappointmentFactory.$inject = ['$totvsresource'];	
	function fchmanpendingappointmentFactory($totvsresource) {
		
		var factory = $totvsresource.REST('/api/cpp/v1/pendingAppointment/:method/:id', {}, {
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

		factory.verificaAtualizacaoMenu = function (parameters, callback) {
    		return this.TOTVSPostObject({method:"verificaAtualizacaoMenu"}, parameters, callback);
    	};

		return factory;
	}
	
	index.register.factory('fchman.fchmanpendingappointment.Factory', fchmanpendingappointmentFactory);
});