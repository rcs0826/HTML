define([
	'index'
], function(index) {
	
	// ########################################################
	// ### Factories
	// ########################################################
    factoryFchmatmultipleunitsmeasure.$inject = ['$totvsresource'];
    function factoryFchmatmultipleunitsmeasure($totvsresource) {        
        var specificResources = {
            'getItemVendorUnits': { // Retorna a lista de tabelas de preço
                method: 'POST',
                isArray: true,
                params: {}, // 
                url: '/dts/datasul-rest/resources/api/fch/fchmat/fchmatmultipleunitsmeasure/getItemVendorUnits/'
            }
        }

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmat/fchmatmultipleunitsmeasure', {}, specificResources);
        return factory;
    };

	// ########################################################
	// ### Registers
	// ########################################################	
    index.register.factory('mcc.fchmatmultipleunitsmeasure.Factory', factoryFchmatmultipleunitsmeasure);
});

