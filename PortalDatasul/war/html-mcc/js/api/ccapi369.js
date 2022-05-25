define([
	'index'
], function(index) {
	
	// ########################################################
	// ### Factories
	// ########################################################
	factoryListQuotations.$inject = ['$totvsresource'];
	function factoryListQuotations($totvsresource) {        
		var specificResources = {
			/*
				Objetivo: Cria ou atualiza um pedido de compra
			*/
			'createUpdatePurchaseOrder': {
				method: 'POST',
				isArray: false,
				params: {},
				url: '/dts/datasul-rest/resources/api/ccp/ccapi369/createUpdatePurchaseOrder/'
			},
			 /*
                Objetivo: Apagar um pedido de compras.
                Parametros: numPedido - N�mero do pedido.
            */
            'deletePurchaseOrder': {
                method: 'POST',
                isArray: false,
                params: {},
				url: '/dts/datasul-rest/resources/api/ccp/ccapi369/deletePurchaseOrder/'
			},
			/*
                Objetivo: Vincula as ordens de compra ao pedido de compra.
            */
			'linkRequisitionToOrder': {
				method: 'POST',
				isArray: false,
				params: {},
				url: '/dts/datasul-rest/resources/api/ccp/ccapi369/linkRequisitionToOrder/'
			},
			'unlinkRequisitions': {
				method: 'POST',
				isArray: false,
				params: {},
				url: '/dts/datasul-rest/resources/api/ccp/ccapi369/unlinkRequisitions/'
			}
		}

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/ccp/ccapi369', {}, specificResources);
		return factory;
	};

	// ########################################################
	// ### Registers
	// ########################################################	
	index.register.factory('mcc.ccapi369.Factory', factoryListQuotations);
});
