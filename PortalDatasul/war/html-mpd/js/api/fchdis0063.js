define(['index'], function(index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
	fchdis0063Factory.$inject = ['$totvsresource', 'ReportService'];
    function fchdis0063Factory($totvsresource, ReportService) {
         
		var specificResources = {
			'searchproducts': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0063/searchproducts/:nrPedido',
			},
			'startAddItem': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0063/startAddItem/:nrPedido',
				headers: {noCountRequest: true }
			},
			'startAddItemCountRequest': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0063/startAddItem/:nrPedido',
				headers: {noCountRequest: false }
			},
			'leaveOrderItem': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0063/changeitem/:nrPedido/:nrSeq',
				headers: {noCountRequest: true }
			},
			'validateOrderItem': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0063/validateitem',
				params: {nrPedido: '@nrPedido'}
			},
			'addOrderItem': {
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0063/item/:nrPedido',
				params: {nrPedido: '@nrPedido'}
			},
			'saveOrderItem': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0063/saveitem/:nrPedido/:nrSeq',
			},
			'saveOrderItems': {
				method: 'PUT',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0063/saveitems/:nrPedido',
			},
			'deleteOrderItems' :{
				method: 'POST',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0063/deleteitems/:nrPedido'
			},
			'cancelOrderItems': {
				method: 'PUT',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0063/cancelorderitems/:nrPedido'
			},
			'addOrderItemConfigured': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0063/addOrderItemConfigured/:nrEstrut',
				params: {nrEstrut: '@nrEstrut'}
			},
			'cancelOrderItemDeliveries': {
				method: 'PUT',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0063/cancelitemdeliveries/:nrPedido'
			},
			'getRelatedPrice': {
				method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0063/pricesrelated/:nrPedido/:itemCode/:itemReference',
				params: {nrPedido: '@nrPedido', itemCode: '@itemCode', itemReference: '@itemReference'}
			},
			'getRelatedPriceWithNoCountRequest': {
				method: 'GET',
				isArray: true,
				headers: { noCountRequest: true },
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0063/pricesrelated/:nrPedido/:itemCode/:itemReference',
				params: {nrPedido: '@nrPedido', itemCode: '@itemCode', itemReference: '@itemReference'}
			},
			'getItemBalance' : {
				method: 'PUT',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0063/balance/:pStart/:nrPedido',
				params: {pStart: '@pStart', nrPedido: '@nrPedido'},
				headers: {noCountRequest: true}
			},
			'getModelItens': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0063/modelitems/:idModel',
				params: {idModel: '@idModel'}
			},
			'loadOrderItem': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0063/loaditem/:nrPedido/:nrSeq',
			},
			'getNewOrderItem': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0063/newitem/:nrPedido',
			},
			'getEstabAtend': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0063/getEstabAtend/:nrPedido/:nomeAbrev',
			},
			'loadOrderItemDiscounts': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0063/loaditemdiscounts/:nrPedido/:nrSeq',
			},
			'leaveEstabAtend': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0063/leaveEstabAtend/:nomeAbrev/:nrPedcli/:codEntrega/:estabAtendItem/:itCodigo',
			},
			'leaveItCodigo': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0063/leaveitcodigo/:nrPedido',
			},
			'itemstock': {
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0063/itemstock'
			},
			'searchproductsfromzoom': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0063/searchproductsfromzoom/:nrPedido',
			}
		};

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0063',{}, specificResources);
         
        return factory;
    }    
         
	index.register.factory('mpd.fchdis0063.Factory', fchdis0063Factory); 
});

