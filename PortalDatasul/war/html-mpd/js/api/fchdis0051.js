define(['index'], function(index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
    fchdis0051Factory.$inject = ['$totvsresource', 'ReportService'];
    function fchdis0051Factory($totvsresource, ReportService) {
         
		var specificResources = {
			'getOrder':	{
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/order/:nrPedido'
			},/*
			'getOrder_01':	{
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/order_01/:nrPedido',
				params: {canQuotationToLead: '@canQuotationToLead'}
			},*/
			'getParameters': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/parameters'
			},
			'getParametersAux': {
				method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/parametersAux'
			},
			'saveParameters': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/parameters'
			},
			'getOrderRentability':	{
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/rentability/:nrPedido'
			},
			'calculateOrder':	{
				method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/calculate/:nrPedido'
			},
			'commitOrder':	{
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/commit/:nrPedido'
			},
			'printOrder': {
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/birt/:reportname',
			},
			'deleteOrder': {
				method: 'DELETE',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/order/:nrPedido'
			},
			'cancelOrder': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/cancelorder/:nrPedido'
			},
			'suspendReactivateOrder': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/suspendreactivateorder/:nrPedido'
			},
			'cancelOrderItems': {
				method: 'PUT',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/cancelorderitems/:nrPedido'
			},
			'cancelOrderItemDeliveries': {
				method: 'PUT',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/cancelitemdeliveries/:nrPedido'
			},
			'deleteOrderItems' :{
				method: 'POST',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/deleteitems/:nrPedido'
			},
			'getNewOrderItem': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/newitem/:nrPedido',
			},
			'leaveOrderItem': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/changeitem/:nrPedido/:nrSeq',
				headers: {noCountRequest: true }
			},
			'leaveItCodigo': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/leaveitcodigo/:nrPedido',
			},
			'saveOrderItem': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/saveitem/:nrPedido/:nrSeq',
			},
			'saveOrderItems': {
				method: 'PUT',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/saveitems/:nrPedido',
			},
			'loadOrderItem': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/loaditem/:nrPedido/:nrSeq',
			},
			'loadOrderItemDiscounts': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/loaditemdiscounts/:nrPedido/:nrSeq',
			},
			'getEstabAtend': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/getEstabAtend/:nrPedido/:nomeAbrev',
			},
			'leaveEstabAtend': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/leaveEstabAtend/:nomeAbrev/:nrPedcli/:codEntrega/:estabAtendItem/:itCodigo',
			},
			'newOrderNumber': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/newOrderNumber',
			},
			'getModels': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/models',
			},
			'favoriteModel': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/favoritemodel/:modelId',
			},
			'getNewOrder': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/neworder/:nrPedido',
			},
			'saveOrderHeader': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/header/:nrPedido',
			},
			'getOrderHeader': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/header/:nrPedido',
			},
			'leaveOrderHeader': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/changeorder/:nrPedido',
			},
			'changeOrderPaymentTerm': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/changeorderpayterm/:nrPedido',
			},
			'saveOrderPaymentTerm': {
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/saveorderpayterm/:nrPedido',
			},
			'changeOrderNrTabFinan': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/changenrtabfinan/:nrPedido',
			},
			'changeOrderNrIndFinan': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/changenrindfinan/:nrPedido',
			},
			'savePrePayment' : {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/saveprepayment/:nrPedido',
			},
			'deletePrePayment' : {
				method: 'DELETE',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/prepayment/:nrPedido',
			},
			'saveOrderDelivery':{
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/saveorderdelivery/:nrPedido',
			},
			'searchproducts': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/searchproducts/:nrPedido',
			},
			'searchproductsfromzoom': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/searchproductsfromzoom/:nrPedido',
			},
			'startAddItem': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/startAddItem/:nrPedido',
				headers: {noCountRequest: true }
			},
			'validateOrderItem': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/validateitem',
				params: {nrPedido: '@nrPedido'}
			},
			'addOrderItem': {
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/item/:nrPedido',
				params: {nrPedido: '@nrPedido'}
			},
			'getDefaultExportExpenses': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/defaultExportExpenses/:nrPedido',
				params: {nrPedido: '@nrPedido'}
			},
			'getDefaultExportExpensesData': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/defaultExportExpensesData/:nrPedido',
				params: {nrPedido: '@nrPedido'}
			},
			'validateExportExpense': {
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/validateExportExpense/:sequencia',
				params: {sequencia: '@sequencia'}
			},
			'leaveExportExpense': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/leaveExportExpense'
			},
			'saveExportOrder': {
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/saveExportOrder/:nrPedido',
				params: {nrPedido: '@nrPedido'}
			},
			'changeNoAbReppri': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/changeNoAbReppri/:nrPedido',
				params: {nrPedido: '@nrPedido'}
			},
			'saveorderrepresentative': {
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/saveorderrepresentative/:nrPedido',
				params: {nrPedido: '@nrPedido'}
			},
			'saveorderitemrepresentative': {
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/saveorderitemrepresentative/:nrPedido/:sequence/:itemCode/:reference',
				params: {
					nrPedido: '@nrPedido',
					sequence: '@sequence',
					itemCode: '@itemCode',
					reference: '@reference'
				}
			},
			'orderitemalocationrefresh': {
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/orderitemalocationrefresh/:nrPedido',
				params: {nrPedido: '@nrPedido'}
			},
			'saveorderitemalocation': {
				method: 'POST',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/saveorderitemalocation/:nrPedido',
				params: {nrPedido: '@nrPedido'}
			},
			'approvedBudget': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/approvedBudget/:nrPedido',
				params: {nrPedido: '@nrPedido'}
			},
			'convertQuotationToOrder': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/convertQuotationToOrder/:nrPedido',
				params: {nrPedido: '@nrPedido'}
			},
			'cancopyorder': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/cancopyorder/:nrPedido',
				params: {nrPedido: '@nrPedido'}
			},
			'newcopyorder': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/newcopyorder/:nrPedido',
				params: {nrPedido: '@nrPedido'}
			},
			'changeemitentecopyorder': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/changeemitentecopyorder/:nrPedido',
				params: {nrPedido: '@nrPedido'}
			},
			'itemcopyorder': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/itemcopyorder/:nrPedido',
				params: {nrPedido: '@nrPedido'}
			},
			'copyorder': {
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/copyorder/:nrPedido',
				params: {nrPedido: '@nrPedido'}
			},
			'itemstock': {
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051a/itemstock'
			},
			'itemstocksimulation': {
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051a/itemstocksimulation'
			},
			'itemstocksimulationsalesorder': {
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051a/itemstocksimulationsalesorder'
			},
			'itemstocksimulationprodorder': {
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051a/itemstocksimulationprodorder'
			},
			'itemstocksimulationpurchorder': {
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051a/itemstocksimulationpurchorder'
			},
			'itemstocksimulationreserve': {
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051a/itemstocksimulationreserve'
			},
			'addOrderItemConfigured': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/addOrderItemConfigured/:nrEstrut',
				params: {nrEstrut: '@nrEstrut'}
			},
			'valNewOrderNo': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/validate',
				params: {customerId: '@customerId', newCustOrderNo: '@newCustOrderNo'}
			},
			'getOrderItemsFaturAntecip':{
				method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/getOrderItemsFaturAntecip/:nrPedido'
			},
			'freightSimulation':{
				method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/freightSimulation',
				params: {vehicleType: '@vehicleType', freightClass: '@freightClass', operationType: '@operationType', considNegoc: '@considNegoc', nrPedido: '@nrPedido'}
			},
			'saveFreightSimulation':{
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/saveFreightSimulation/:nrPedido',
			}
		};

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051',{}, specificResources);
         

		factory.getPrintUrl = function (params, callback) {

			ReportService.run('mpd/rel_salesorder', {
				format: 'PDF',
				program: '/report/mpd/mpd0002',
				resultFileName: "Pedido " + params.orderId,
				orderId: params.orderId,
				printFullDescription: params.printFullDescription ? params.printFullDescription : "false",
				detailDeliveries: params.detailDeliveries ? params.detailDeliveries : "false",
				detailItemComposition: params.detailItemComposition ? params.detailItemComposition : "false",
				measureUnit: params.measureUnit ? params.measureUnit : "0",
				validatePrintOrder: "false"
			}, {});

			/*factory.printOrder(
				{reportname: 'SalesOrderReport.xml'},
				[
					[
						{"id": "printFullDescription",		"value": params.printFullDescription  ? params.printFullDescription  : "false"},
						{"id": "detailDeliveries",			"value": params.detailDeliveries      ? params.detailDeliveries      : "false"},
						{"id": "detailItemComposition",		"value": params.detailItemComposition ? params.detailItemComposition : "false"},
						{"id": "measureUnit",				"value": params.measureUnit           ? params.measureUnit           : "0"},
						{"id": "validatePrintOrder",		"value": "false"}
					],
					[
						{"id": "order" + params.orderId,"value": params.orderId}
					]
				],
				function (result) {
					callback("/dts/datasul-rest/resources/birt/" + result.reportName);
				}
			);*/
		};

        return factory;
    }    
         
	index.register.factory('mpd.fchdis0051.Factory', fchdis0051Factory); 
});

