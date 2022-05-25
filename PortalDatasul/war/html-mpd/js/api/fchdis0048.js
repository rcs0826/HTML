define(['index',
        'less!/dts/mpd/assets/css/customersummary.less'
       ], function(index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
    customerApdFactory.$inject = ['$totvsresource'];
    function customerApdFactory($totvsresource) {
         
        var specificResources = {
            'findByCustomerCode': {
                method: 'GET',
                isArray: true,                                
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0048/findByCustomerCode/:codEmitente',
                params: {codEmitente: '@codEmitente'}
            },
            'returnCustomerSumaryOrderAdder': {
                method: 'PUT',
                isArray: true,                                
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0048/returnCustomerSumaryOrderAdder',
                params: {},
                headers: {noCountRequest: true }
            },            
            'getInternalCustomers': {
                method: 'PUT',
                isArray: true,
                params: {},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0048/internalCustomers'
            },
            'getTotalCustomersActivesAndInactives': {
                method: 'GET',
                isArray: true,
                params: {},
                headers: {noCountRequest: true },
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0048/returnInternalActivesInactivesCustomers'
            },
            'getCustomerDetails': {
                method: 'GET',
                isArray: true,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0048/getCustomerDetails/:codEmitente',
                params: {codEmitente: '@codEmitente'}
            },
            'ordersCustomerSummaryInternal': {
                method: 'GET',
                isArray: true,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0048/ordersCustomerSummaryInternal/',
                params: {}
            },
            'getCustomerDeliveryPlaces': {
                method: 'GET',
                isArray: true,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0048/getCustomerDeliveryPlaces/',
                params: {}
            },
            'getCustomerItens': {
                method: 'GET',
                isArray: true,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0048/getCustomerItens/',
                params: {}
            },
            'getCustomerInformers': {
                method: 'GET',
                isArray: true,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0048/getCustomerInformers/',
                params: {}
            },
            'getCustomerSites': {
                method: 'GET',
                isArray: true,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0048/getCustomerSites/',
                params: {}
            },
            'getCustomerContacts': {
                method: 'GET',
                isArray: true,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0048/getCustomerContacts/',
                params: {}
            },
            'getSupplierParam': {
                method: 'GET',
                isArray: true,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0048/supplierParam/',
                params: {}
            },
            'getSupplierMaisNegociosCustomerCredit': {
                method: 'GET',
                isArray: false,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0048/supplierMaisNegociosCustomerCredit/',
                params: {customerCode: '@customerCode', refreshOnline: '@refreshOnline'}
            },
            'postSupplierMaisNegociosRequestCredit': {
                method: 'PUT',
                isArray: false,                                
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0048/supplierMaisNegociosRequestCredit/:customerCode/:newCreditLimit',
                params: {customerCode: '@customerCode', newCreditLimit: '@newCreditLimit'}
            }
        }
       
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0048', {}, specificResources);
         
        return factory;
    }
         
    index.register.factory('mpd.customerapd.Factory', customerApdFactory);
   
    
});