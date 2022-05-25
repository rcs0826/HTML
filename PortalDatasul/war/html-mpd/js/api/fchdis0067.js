define(['index'], function(index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
	fchdis0067Factory.$inject = ['$totvsresource', 'ReportService'];
    function fchdis0067Factory($totvsresource, ReportService) {
         
		var specificResources = {
			'searchproducts': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0067/searchproducts/:nrPedido',
			},
			'startAddItem': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0067/startAddItem/:nrPedido',
				headers: {noCountRequest: true }
			},
			'startAddItemCountRequest': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0067/startAddItem/:nrPedido',
				headers: {noCountRequest: true }
			},
			'leaveOrderItem': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0067/changeitem/:nrPedido/:nrSeq',
				headers: {noCountRequest: true }
			},
			'validateOrderItem': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0067/validateitem',
				params: {nrPedido: '@nrPedido'}
			},
			'addOrderItem': {
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0067/item/:nrPedido',
				params: {nrPedido: '@nrPedido'}
			},
			'saveOrderItem': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0067/saveitem/:nrPedido/:nrSeq',
			},
			'saveOrderItems': {
				method: 'PUT',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0067/saveitems/:nrPedido',
			},
			'deleteOrderItems': {
				method: 'POST',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0067/deleteitems/:nrPedido'
			},
			'cancelQuotationItems': {
				method: 'PUT',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0067/cancelQuotationItems/:nrPedido'
			},
			'reopenQuotationItems': {
				method: 'PUT',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0067/reopenQuotationItems/:nrPedido'
			},
			'addOrderItemConfigured': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0067/addOrderItemConfigured/:nrEstrut',
				params: {nrEstrut: '@nrEstrut'}
			},
			'cancelQuotationItemDeliveries': {
				method: 'PUT',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0067/cancelitemdeliveries/:nrPedido'
			},
			'getRelatedPrice': {
				method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0067/pricesrelated/:nrPedido/:itemCode/:itemReference',
				params: {nrPedido: '@nrPedido', itemCode: '@itemCode', itemReference: '@itemReference'}
			},
			'getRelatedPriceWithNoCountRequest': {
				method: 'GET',
				isArray: true,
				headers: { noCountRequest: true },
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0067/pricesrelated/:nrPedido/:itemCode/:itemReference',
				params: {nrPedido: '@nrPedido', itemCode: '@itemCode', itemReference: '@itemReference'}
			},
			'getItemBalance' : {
				method: 'PUT',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0067/balance/:pStart/:nrPedido',
				params: {pStart: '@pStart', nrPedido: '@nrPedido'},
				headers: {noCountRequest: true}
			},
			'getModelItens': {
				method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0067/modelitems/:idModel',
				params: {idModel: '@idModel'}
			},
			'loadOrderItem': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0067/loaditem/:nrPedido/:nrSeq',
			},
			'getNewOrderItem': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0067/newitem/:nrPedido',
			},
			'getEstabAtend': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0067/getEstabAtend/:nrPedido/:nomeAbrev',
			},
			'loadOrderItemDiscounts': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0067/loaditemdiscounts/:nrPedido/:nrSeq',
			},
			'leaveEstabAtend': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0067/leaveEstabAtend/:nomeAbrev/:nrPedcli/:codEntrega/:estabAtendItem/:itCodigo',
			},
			'leaveItCodigo': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0067/leaveitcodigo/:nrPedido',
			},
			'itemstock': {
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0067/itemstock'
			},
			'searchproductsfromzoom': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0067/searchproductsfromzoom/:nrPedido',
			}
		};

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0067',{}, specificResources);
         
        return factory;
    }    
         
	index.register.factory('mpd.fchdis0067.Factory', fchdis0067Factory); 
});

