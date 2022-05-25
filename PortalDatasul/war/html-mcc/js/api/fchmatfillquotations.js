define([
	'index',
	'/dts/mcc/js/mcc-utils.js'
], function(index) {
	
	// ########################################################
	// ### Factories
	// ########################################################
    factoryFchmatfillquotations.$inject = ['$totvsresource'];
    function factoryFchmatfillquotations($totvsresource) {        
        var specificResources = {
            'getCurrencies': { // Retorna as informações da ordem de compra
                method: 'GET',
                isArray: true,
                params: {}, // 
                url: '/dts/datasul-rest/resources/api/fch/fchmat/fchmatfillquotations/getCurrencies/'
            }
        }

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmat/fchmatfillquotations', {}, specificResources);
        return factory;
    };

	// ########################################################
	// ### Registers
	// ########################################################	
    index.register.factory('mcc.fchmatfillquotations.Factory', factoryFchmatfillquotations);
});

