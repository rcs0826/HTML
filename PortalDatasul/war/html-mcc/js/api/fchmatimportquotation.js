define([
	'index',
	'/dts/mcc/js/mcc-utils.js'
], function(index) {
	
	// ########################################################
	// ### Factories
	// ########################################################
	factoryFchmatimportquotation.$inject = ['$totvsresource'];
	function factoryFchmatimportquotation($totvsresource) {        
		var specificResources = {
			'getQuotationImport': { //Busca as informações de importação da cotação
				method: 'POST',
				isArray: false,
				params: {	ttQuotations: "@ttQuotations",
							pAction: "@pAction",
							pAliquotaAntiga: "pAliquotaAntiga",
							cCodEstabel: "@cCodEstabel"},
				url: '/dts/datasul-rest/resources/api/fch/fchmat/fchmatimportquotation/getQuotationImport/'
			},
			'setDefaultsQuotation': { //Busca as informações padrões da cotação de importação
				method: 'POST',
				isArray: false,
				params: {	ttQuotations: "@ttQuotations",
							pAction: "@pAction",
							pFieldName: "@pFieldName",
							pAliquotaAntiga: "pAliquotaAntiga",
							cCodEstabel: "@cCodEstabel"},
				url: '/dts/datasul-rest/resources/api/fch/fchmat/fchmatimportquotation/setDefaultsQuotation/'
			},
		}

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmat/fchmatimportquotation', {}, specificResources);
		return factory;
	};

	// ########################################################
	// ### Registers
	// ########################################################	
	index.register.factory('mcc.fchmatimportquotation.Factory', factoryFchmatimportquotation);
});

