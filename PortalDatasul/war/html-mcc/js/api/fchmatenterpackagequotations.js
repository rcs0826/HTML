define([
	'index',
	'/dts/mcc/js/mcc-utils.js'
], function(index) {
	
	// ########################################################
	// ### Factories
	// ########################################################
    factoryFchmatenterpackagequotations.$inject = ['$totvsresource'];
    function factoryFchmatenterpackagequotations($totvsresource) {        
        var specificResources = {
            'getQuotationsReadjustment': { //busca os ajustes da cotação
                method: 'GET',
                isArray: true,
                params: {pItCodigo: '@pItCodigo', pCodEmitente: '@pCodEmitente', pNumOrder: '@pNumOrder'},
                url: '/dts/datasul-rest/resources/api/fch/fchmat/fchmatenterpackagequotations/getQuotationsReadjustment/'
            }
        }

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmat/fchmatenterpackagequotations', {}, specificResources);
        return factory;
    };

	// ########################################################
	// ### Registers
	// ########################################################	
    index.register.factory('mcc.fchmatenterpackagequotations.Factory', factoryFchmatenterpackagequotations);
});

