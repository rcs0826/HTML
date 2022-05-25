// *********************************************************************************
// *** FCHMATMCETOOLS
//     Descrição.: Funções comuns do módulo de estoque para busca de informações
// *********************************************************************************

define(['index'], function(index) {
    
	mceToolsFactory.$inject = ['$totvsresource'];
	function mceToolsFactory($totvsresource) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmat/fchmatmcetools/:method/:id', {}, {
			postArray: { 
				method: 'POST',
				isArray: true
			},
			getArray: { 
				method: 'GET',
				isArray: true
			}
        });        
        
        factory.getDefaultSite = function (params, object, callback) {    
            params.method = 'getDefaultSite';            
            return this.getArray(params, object, callback);  
	    }     
                
        return factory;
	}
	
	index.register.factory('mce.fchmatmcetools.factory', mceToolsFactory);	

});