define(['index',
        'less!/dts/mpd/assets/css/paymentmethodsecommerce.less'
       ], function(index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
    paymentMethodsApdFactory.$inject = ['$totvsresource'];
    function paymentMethodsApdFactory($totvsresource) {
         
        var specificResources = {
            'getRelationShipPaymentMethods': {
                method: 'GET',
                isArray: true,
                params: {},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0053/relationshipPaymentMethod'
            },            
            'getPaymentMethods': {
                method: 'GET',
                isArray: true,                                
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0053/paymentMethod',
                params: {}
            },
            'putPaymentMethods': {
                method: 'PUT',
                isArray: false,                                
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0053/updatePaymentMethod',
                params: {}                
            },
            'deleteRelationShipPaymentMethods': {
                method: 'POST',
                isArray: false,                
                params: {},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0053/delRelationShipPaymentMethods'
            },
            'validRelationShipPaymentMethods': {
                method: 'PUT',
                isArray: false,
                params: {validationId: '@validationId', paymentMethod: '@paymentMethod', siteId: '@siteId', paymentType: '@paymentType'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0053/validateRelationShipPaymentMethod/:validationId/:paymentMethod/:siteId/:paymentType'
            },
            'isMethodAlreadyUsed': {
                method: 'PUT',
                isArray: false,
                params: {codRelationship: '@codRelationship'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0053/validateUpdateMethod/:codRelationship'
            },
            'saveRelationShipPaymentMethods': {
                method: 'POST',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0053/saveRelationshipPaymentMethod'
            },
            'saveEditedRelationshipPaymentMethod': {
                method: 'PUT',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0053/saveEditedRelationshipPaymentMethod'
            }
        }
       
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0053', {}, specificResources);
         
        return factory;
    }
         
    index.register.factory('mpd.paymentmethodsapd.Factory', paymentMethodsApdFactory);
   
    
});