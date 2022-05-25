define([
	'index',
	'/dts/mcc/js/mcc-utils.js'
], function(index) {
	
	// ########################################################
	// ### Factories
	// ########################################################
    factoryFchmatdetailquotations.$inject = ['$totvsresource'];
    function factoryFchmatdetailquotations($totvsresource) {        
        var specificResources = {
            'useImportModule': { //verifica se o módulo de importação está ativo
                method: 'GET',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/api/fch/fchmat/fchmatdetailquotations/useImportModule/'
            }
        }

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmat/fchmatdetailquotations', {}, specificResources);
        return factory;
    };

	// ########################################################
	// ### Registers
	// ########################################################	
    index.register.factory('mcc.fchmatdetailquotations.Factory', factoryFchmatdetailquotations);
});

