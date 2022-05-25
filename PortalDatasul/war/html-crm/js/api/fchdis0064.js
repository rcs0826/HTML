// Factory para os serviços utilizados na interface cabeçalho do pedido do portal, novo fluxo.
define(['index'], function (index) {

	'use strict';

    var fchdis0064Factory;

    fchdis0064Factory = function ($totvsresource) {     
        var specificResources = {
            'getNewOrder': {
                method: 'PUT',
                isArray: false,
                params: {nrPedido: '@nrPedido', codEmit: '@codEmit', idiModel: '@idiModel', nrPedcli: '@nrPedcli', isLead: '@isLead'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0064/neworder/:nrPedido'
            },
            'newCopy':			{
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0064/newcopy'
			},
			'saveOrderHeader': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0064/header/:nrPedido',
				params: {nrPedido: '@nrPedido'}
            },
            'getDefaultHeader': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0064/defaultheader/:nrPedido',
				params: {nrPedido: '@nrPedido'}
            },
            'leaveOrder': {
				method: 'PUT',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0064/change/:nrPedido',
				params: {nrPedido: '@nrPedido'}
            },  
			'getOrder':			{
				method: 'GET',
				isArray: false,
				params: {nrPedido: '@nrPedido'},
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0064/order/:nrPedido'
            },
            'getModelForCreatedOrder': {
                method: 'PUT',
                isArray: false,
                params: { idiModel: '@idiModel', nrPedido: '@nrPedido'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0064/modelforcreatedorder/:nrPedido'
            },    
            'getOrderParam': {
				method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0064/getOrderParam'
			},
			'cancelOrder': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0064/cancelorder/:nrPedido'
			},
			'recalculateOrder': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0064/recalculate/:nrPedido',
				params: {nrPedido: '@nrPedido'}
			},  
			'processOrder': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0064/process/:nrPedido',
				params: {nrPedido: '@nrPedido'}
			}, 
			'getParametersAux': {
				method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0064/parametersAux'
			},
			'freightSimulation':{
				method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0064/freightSimulation',
				params: {vehicleType: '@vehicleType', freightClass: '@freightClass', operationType: '@operationType', considNegoc: '@considNegoc', nrPedido: '@nrPedido'}
			},
			'saveFreightSimulation':{
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0064/saveFreightSimulation/:nrPedido',
			}
        }
                
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0064', {}, specificResources);                 
		
		return factory;    
	}         
	fchdis0064Factory.$inject = ['$totvsresource'];	

    index.register.factory('crm.mpd_fchdis0064.Factory', fchdis0064Factory);
});


