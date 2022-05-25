// Factory para os serviços utilizados na interface cabeçalho do pedido do portal, novo fluxo.
define(['index'], function (index) {
    fchdis0064.$inject = ['$totvsresource', 'ReportService'];

    function fchdis0064($totvsresource, ReportService) {     
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
			},
			'getRejectionReason':			{
				method: 'GET',
				isArray: false,
				params: {nrPedido: '@nrPedido'},
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0064/rejectionReason/:nrPedido'
            },
        }
                
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0064', {}, specificResources);                 
		
		factory.getPrintUrl = function (params, callback) {

			ReportService.run('mpd/rel_salesorder', {
				format: 'PDF',
				program: '/report/mpd/mpd0002',
				resultFileName: "Pedido " + params,
				orderId: params,
				printFullDescription: "false",
				detailDeliveries: "false",
				detailItemComposition: "false",
				measureUnit: "0",
				validatePrintOrder: "false"
			}, {});
		};
		
		
		return factory;    
    }         
    index.register.factory('mpd.fchdis0064.Factory', fchdis0064);
});


