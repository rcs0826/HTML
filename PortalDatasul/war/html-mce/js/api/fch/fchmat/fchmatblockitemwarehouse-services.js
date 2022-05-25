define(['index'], function(index) {
    
	fchmatBlockItemWarehouse.$inject = ['$totvsresource'];
	function fchmatBlockItemWarehouse($totvsresource) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmat/fchmatblockitemwarehousehtml/:method/:id', {}, {
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
        
        factory.deleteAll = function (params, object, callback) {    
            params.method = 'deleteAll';            
            return this.TOTVSPost(params, object, callback);  
		};
        
        factory.deleteSelected = function (params, object, callback) {    
            params.method = 'deleteSelected';            
            return this.TOTVSPost(params, object, callback);  
		}         
        
        
        
        return factory;
	}
	
	index.register.factory('mce.fchmatblockitemwarwhouse.factory', fchmatBlockItemWarehouse);	

});