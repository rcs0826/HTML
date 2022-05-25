// Factory para os serviços utilizados na interface cabeçalho do pedido do portal, novo fluxo.
define(['index'], function (index) {
    fchdis0066.$inject = ['$totvsresource'];

    function fchdis0066($totvsresource, ReportService) {     
        var specificResources = {
            'saveOrderHeader': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0066/header/:nrPedido',
				params: {nrPedido: '@nrPedido'}
            },
            'getNewOrder': {
                method: 'PUT',
                isArray: false,
                params: {nrPedido: '@nrPedido', codEmit: '@codEmit', idiModel: '@idiModel', nrPedcli: '@nrPedcli', isLead: '@isLead'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0066/neworder/:nrPedido'
            },
            'getOrderParam': {
				method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0066/getOrderParam'
            },
            'changeCustomer': {
				method: 'PUT',
				isArray: false,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0066/changeCustomer/:nrPedido/:codEmitente'
			},
            'validQuotation': {
				method: 'GET',
				isArray: false,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0066/validQuotation/:nrPedido'
			},
            'process': {
				method: 'PUT',
				isArray: false,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0066/process/:nrCotac/:nrPedido',
                params: {nrCotac: '@nrCotac', nrPedido: '@nrPedido', nrPedidoCliente: '@nrPedidoCliente', nrInvoiceExport: '@nrInvoiceExport', validExport: '@validExport'}
            },
			'getQuotationHistory': {
				method: 'GET',
				isArray: true,
				params: {nrPedido: '@nrPedido'},
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0066/history/:nrPedido'
            },
            'cancelQuotation': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0066/cancelQuotation/:nrPedido'
			},
            'reopenQuotation': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0066/reopenQuotation/:nrPedido'
			},
			'getModelForCreatedQuotation': {
                method: 'PUT',
                isArray: false,
                params: { idiModel: '@idiModel', nrPedido: '@nrPedido'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0066/modelforcreatedquotation/:nrPedido'
            },  
        }

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0066', {}, specificResources);
		return factory;    
    }         
    index.register.factory('mpd.fchdis0066.Factory', fchdis0066);
});


