define(['index'], function(index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
	rulesOperationsFactory.$inject = ['$totvsresource'];
	function rulesOperationsFactory($totvsresource) {
         
		var specificResources = {

			/*Serviço para retornar uma lista de regras para sugestão de natureza de operação*/
			'getRegraSugesNat': {
				method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0055/regraSugesNat',
				params: {},
			},

			/*Serviço para incluir uma regra de sugestão de natureza de operação*/
			'putRegraSugesNat': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0055/regraSugesNat',
				params: {}
			},

			/*Serviço para editar uma regra de sugestão de natureza de operação*/
			'postRegraSugesNat': {
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0055/regraSugesNat',
				params: {}
			},


			/*Serviço para incluir uma regra de sugestão de natureza de operação*/
			'putRegraSugesNatCopy': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0055/regraSugesNatCopy',
				params: {}
			},

			/*Serviço para retornar dados baseados em leaves de campos*/
			'leaveRegraSugesNat': {
				method: 'PUT',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0055/leaveRegraSugesNat',
				params: {leaveName: '@leaveName', fieldCode: '@fieldCode'}
			},

			/*Serviço para excluir uma lista de regras de natureza de operação - deve ser do tipo POST para permitir exclusão multipla*/
			'deleteRegraSugesNat': {
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0055/removeRegraSugesNat',
				params: {}
			},

			/*Serviço para simulação de uma lista de regra de sugestão de natureza de operação - deve ser do tipo POST para permitir a simulação de diversas regras*/
			'postSimulacaoRegraSugesNat': {
				method: 'POST',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0055/simulateRegraSugesNat',
				params: {}
			},

			/*Serviço para retornar naturezas de operação sugerida um pedido de venda*/
			'getSugesNatOperPedVda': {
				method: 'GET',
				isArray: false,
				params: {},
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0055/sugesNatOperPedVda'
			},

			/*Serviço para retornar uma lista de campos disponiveis para regras de sugestão de natureza de operação*/
			'getCampSugesNat': {
				method: 'GET',
				isArray: true,
				params: {},
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0055/campSugesNat'
			},
            
            /*Serviço para retornar o histórico da regra de sugestão de natureza de operação*/
			'getHistorSugestNat': {
				method: 'GET',
				isArray: true,
				params: {rulesId: '@rulesId'},
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0055/historSugestNat/:rulesId'
			},

			/*Serviço para retornar os campo da regra de sugestão de natureza de operação para a tela de histórico */
			'getHistorFieldSugestNat': {
				method: 'GET',
				isArray: true,
				params: {},
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0055/historFieldSugestNat/'
			},

			/*Serviço para exportacao full em online */
			'exportGrid': {
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0055/exportGrid',
				params: {}
			},			

			/*Serviço para exportacao full rpw */
			'postExportSugestNat': {
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0055/postExportSugestNat',
				params: {}
			},			

			/*Serviço para exportacao full em online */
			'exportSugestNatOnline': {
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0055/exportSugestNatOnline',
				params: {}
			},

		}

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0055', {}, specificResources);
         
        return factory;
    }
         
	index.register.factory('mpd.fchdis0055.Factory', rulesOperationsFactory);


});
