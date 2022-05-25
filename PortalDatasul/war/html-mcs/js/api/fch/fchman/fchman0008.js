define(['index'], function(index) {

	fchman0008Factory.$inject = ['$totvsresource'];	
	function fchman0008Factory($totvsresource) {
		
		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchman/fchman0008html/:method/:id', {}, {
			
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
	        
		factory.getMultiLevelItemCosts = function (ttItemCostsScenaryVO, callback) {

            	return this.TOTVSPostObject({method:"getMultiLevelItemCosts"}, ttItemCostsScenaryVO, callback);
		};		
		
		factory.TempTableToCSV = function (ttMultiLevelItemCostsVO, callback) {

            	return this.TOTVSPostObject({method:"TempTableToCSV"}, ttMultiLevelItemCostsVO, callback);
		};
		
		return factory;
	}
	
	index.register.factory('fchman.fchman0008.Factory', fchman0008Factory);
});