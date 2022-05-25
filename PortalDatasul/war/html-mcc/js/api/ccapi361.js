define([
	'index',
	'/dts/mcc/js/mcc-utils.js'
], function(index) {
	
	// ########################################################
	// ### Factories
	// ########################################################
	factoryFollowUp.$inject = ['$totvsresource'];
	function factoryFollowUp($totvsresource) {        
		var specificResources = {
			/*
				Objetivo: Retorna as informações iniciais da tela cc0325
			*/
			'getDefaultInformation': {
				method: 'GET',
				isArray: false,
				params: {},
				url: '/dts/datasul-rest/resources/api/ccp/ccapi361/getDefaultInformation/'
			},
			/*
				Objetivo: Validar se o comprador é válido
				Parâmetros: pBuyer: código do comprador
			*/
			'checkBuyer': {
				method: 'GET',
				isArray: false,
				params: {pBuyer: '@pBuyer'},
				url: '/dts/datasul-rest/resources/api/ccp/ccapi361/checkBuyer/'
			},
			/*
				Objetivo: Atender a solicitação
				Parâmetros: usuario: código do usuário logado
							icms: tipo icms (industrialização; consumo)
							generateOrders: natureza da ordem (conforme item; material; serviço; beneficiamento)
							divideOrders: dividir ordens entre fornecedores
							generateOrdersRelation: relacionar ordens geradas a: grupo de compra / comprador do item / comprador específico
							buyer: comprador específico
			*/
			'processRequest': {
				method: 'POST',
				isArray: false,
				params: {	usuario: '@usuario', 
							icms: '@icms',
							generateOrders: '@generateOrders',
							groupItems: '@groupItems',
							divideOrders: '@divideOrders',
							generateOrdersRelation: '@generateOrdersRelation',
							buyer: '@buyer'
						},
				url: '/dts/datasul-rest/resources/api/ccp/ccapi361/processRequest/'
			}
		}

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/ccp/ccapi361', {}, specificResources);
		return factory;
	};

	// ########################################################
	// ### Registers
	// ########################################################	
	index.register.factory('mcc.ccapi361.Factory', factoryFollowUp);
});
