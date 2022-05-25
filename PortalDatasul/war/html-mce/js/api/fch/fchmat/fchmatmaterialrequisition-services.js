define(['index'], function(index) {
    
	fchmatMaterialRequisitionFactory.$inject = ['$totvsresource'];
	function fchmatMaterialRequisitionFactory($totvsresource) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmat/fchmatmaterialrequisitionhtml/:method/:id', {}, {
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
        
        factory.setDefaultsRequisition = function (params, object, callback) {    
            params.method = 'setDefaultsRequisition';            
            return this.TOTVSPost(params, object, callback);  
		}    
        
        factory.createRequisition = function (params, object, callback) {   
             params.method = 'createRequisition';  
             return this.TOTVSPost(params, object, callback); 
		}    
                
        factory.initializeInterface = function(callback){        
             return this.TOTVSGet({method: 'initializeInterface'}, callback);          
        }     
        
        factory.validateLot =  function (params, object, callback) {     
            params.method = 'validateLot';  
            return this.TOTVSPost(params, object, callback);          
        } 

        factory.returnDataFromDashboard = function (params, object, callback) {    
            params.method = 'returnDataFromDashboard';
            return this.TOTVSPost(params, object, callback);  
        }
	
        return factory;
	}
	
	index.register.factory('mce.fchmatMaterialRequisitionFactory.factory', fchmatMaterialRequisitionFactory);	

});