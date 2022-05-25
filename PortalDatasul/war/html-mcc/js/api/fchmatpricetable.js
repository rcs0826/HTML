define([
	'index'
], function(index) {
	
	// ########################################################
	// ### Factories
	// ########################################################
    factoryFchmatpricetable.$inject = ['$totvsresource'];
    function factoryFchmatpricetable($totvsresource) {        
        var specificResources = {
            'getPriceTableList': { // Retorna a lista de tabelas de preço
                method: 'GET',
                isArray: true,
                params: {}, // 
                url: '/dts/datasul-rest/resources/api/fch/fchmat/fchmatpricetable/getPriceTableList/'
            }
        }

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmat/fchmatpricetable', {}, specificResources);
        return factory;
    };

	// ########################################################
	// ### Registers
	// ########################################################	
    index.register.factory('mcc.fchmatpricetable.Factory', factoryFchmatpricetable);
});

