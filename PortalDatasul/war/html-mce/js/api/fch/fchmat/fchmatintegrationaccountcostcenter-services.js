define(['index'], function(index) {
    
	fchmatIntegrationAccountCostCenterFactory.$inject = ['$totvsresource'];
	function fchmatIntegrationAccountCostCenterFactory($totvsresource) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmat/fchmatintegrationaccountcostcenterhtml/:method/:id', {}, {
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
        
        factory.enableCostCenter = function (params, object, callback) {    
            params.method = 'enableCostCenter';            
            return this.TOTVSPost(params, object, callback);  
		}   
        
        factory.getIntegrationAccountCostCenterFilter = function (object, callback) {             
            return this.TOTVSPostArray({method:'getIntegrationAccountCostCenterFilter'}, object, callback)  ;  
		}      
        
        return factory;
	}
	
	index.register.factory('mce.fchmatIntegrationAccountCostCenterFactory.factory', fchmatIntegrationAccountCostCenterFactory);	

});