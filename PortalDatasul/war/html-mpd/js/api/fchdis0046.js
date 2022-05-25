define(['index'], function(index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
    orderSummaryApdFactory.$inject = ['$totvsresource'];
    function orderSummaryApdFactory($totvsresource) {

        var specificResources = {
            'ordersSummaryOrderAdder': {
                method: 'GET',
                isArray: true,
                params: {},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0046/ordersSummaryOrderAdder',
                headers: {noCountRequest: true }
            },
            'getPortalOrderSummary': {
                method: 'GET',
                isArray: true,
                params: {emitente: '@emitente',
                repres: '@repres',
                iniDate: '@iniDate',                
                diasSemMov: '@diasSemMov'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0046/getPortalOrderSummary/:emitente/:repres/:iniDate/:diasSemMov'
            },
            'getInternalSalesOrders': {
                method: 'GET',
                isArray: true,
                params: {},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0046/internalSalesOrder'
            },
            'getInternalSalesOrderItems': {
                method: 'GET',
                isArray: true,
                params: {},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0046/items'
            },
            'getInternalOrderHistory': {
                method: 'GET',
                isArray: true,
                params: {nrPedido: '@nrPedido'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0046/getInternalOrderHistory/:nrPedido'
            },
            'getOrderByOrderAdder': {
                method: 'GET',
                isArray: false,
                params: {nrPedido: '@nrPedido'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0046/getOrderByOrderAdder/:nrPedido'
            },
            'getOrderRepresentatives': {
                method: 'GET',
                isArray: true,
                params: {nrPedido: '@nrPedido'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0046/getOrderRepresentatives/:nrPedido'
            },
            'getOrderSpecialPaymentConditions': {
                method: 'GET',
                isArray: true,
                params: {nrPedido: '@nrPedido'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0046/getOrderSpecialPaymentConditions/:nrPedido'
            },
            'getPrepayments': {
                method: 'GET',
                isArray: true,
                params: {nrPedido: '@nrPedido'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0046/getPrepayments/:nrPedido'
            },
            'getSimpleDelivery': {
                method: 'GET',
                isArray: true,
                params: {nrPedido: '@nrPedido', nrSequencia: '@nrSequencia', itCodigo: '@itCodigo', codRefer: '@codRefer'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0046/getSimpleDelivery/:nrPedido/:nrSequencia/:itCodigo/:codRefer'
            },
            'getItemInvoices': {
                method: 'GET',
                isArray: true,
                params: {nrPedido: '@nrPedido', nrSequencia: '@nrSequencia', itCodigo: '@itCodigo', codRefer: '@codRefer'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0046/getItemInvoices/:nrPedido/:nrSequencia/:itCodigo/:codRefer'
            },
            'getInvoices': {
                method: 'GET',
                isArray: true,
                params: {nrPedido: '@nrPedido'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0046/getInvoices/:nrPedido'
            },
            'getShipments': {
                method: 'GET',
                isArray: true,
                params: {nrPedido: '@nrPedido'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0046/getShipments/:nrPedido'
            },
            'getItemCommission': {
                method: 'GET',
                isArray: false,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0046/getItemCommission'
            },
            'getOrderSupplierTickets': {
                method: 'GET',
                isArray: true,
                params: {nrPedido: '@nrPedido'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0046/getOrderSupplierTickets/:nrPedido'
            },
            'getPaymentEcommerce': {
                method: 'GET',
                isArray: true,
                params: {nrPedido: '@nrPedido'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0046/getPaymentEcommerce/:nrPedido'
            },
            'cancelOrderSupplierTickets': {
                method: 'DELETE',
                isArray: false,
                params: {nrPedido: '@nrPedido'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0046/cancelOrderSupplierTickets/:nrPedido'
            }
        };

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0046',{}, specificResources);

        return factory;
    }

    index.register.factory('mpd.fchdis0046.Factory', orderSummaryApdFactory);
});
