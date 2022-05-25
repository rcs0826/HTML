// Factory para os serviços utilizados pela tela Gerenciamentos de Orçamentos do APP
define(['index'], function (index) {
    budgetManagementApp.$inject = ['$totvsresource'];

    function budgetManagementApp($totvsresource) {     
        var specificResources = {
            'getBudgetList': {
                method: 'GET',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0061/getBudgetList'
            },
            'getBudgetItems': {
                method: 'GET',
                isArray: true,
                params: {nrPedido: '@nrPedido'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0061/getBudgetItems/:nrPedido'
            },            
			'getParameters': {
				method: 'GET',
				isArray: false,
				params: {},
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0061/getParameters'
			},
            'getBudgetCommunication': {
                method: 'GET',
                isArray: false,
                params: {budgetId: '@budgetId'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0061/getBudgetCommunication/:budgetId'
            },
            'getBudgetSituation': {
                method: 'GET',
                isArray: false,
                params: {budgetId: '@budgetId'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0061/getBudgetSituation/:budgetId'
            },
            'postNewCommunication': {
                method: 'POST',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0061/createBudgetCommunication/:budgetId'
            },
            'putUpdateCommunication': {
                method: 'PUT',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0061/updateBudgetCommunication/:budgetId'
            },            
			'putCancelOrder': {
				method: 'PUT',
				isArray: false,
				params: {codOrcto: '@codOrcto', nrPedido: '@nrPedido', nomeAbrev: '@nomeAbrev', motivo: '@motivo'},
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0061/cancelOrcto/:codOrcto/:nrPedido/:nomeAbrev/:motivo'
            },                       
			'createOrderAndItems': {
				method: 'PUT',
				isArray: false,
				params: {nrPedido: '@nrPedido', nomeAbrev: '@nomeAbrev', codOrcto: '@codOrcto'},
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0061/createOrderAndItems/:nrPedido/:nomeAbrev/:codOrcto'
			},                       
			'getDescCancel': {
				method: 'GET',
				isArray: false,
				params: {nrPedido: '@nrPedido', codOrcto: '@codOrcto'},
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0061/getDescCancel/:nrPedido/:codOrcto'
			},            
			'putLiberateBudget': {
				method: 'PUT',
				isArray: false,
				params: {budgetId: '@budgetId'},
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0061/liberateBudget/:budgetId'
            },
            'getBudgetProblem': {
				method: 'GET',
				isArray: false,
				params: {},
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0061/getBudgetProblem'
            },            
			'putCompleteReviewError': {
				method: 'PUT',
				isArray: false,
				params: {codOrcto: '@codOrcto'},
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0061/completeReviewError/:codOrcto'
            },
            'updateBudgetExpiredDate': {
                method: 'POST',
                isArray: false,
                params: {budgetId: '@budgetId', expiredDate: '@expiredDate'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0061/updateBudgetExpiredDate/:budgetId/:expiredDate'
            }           
        }
                
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0061', {}, specificResources);                 
        return factory;    
    }         
    index.register.factory('mpd.budgetManagementApp.Factory', budgetManagementApp);
});


