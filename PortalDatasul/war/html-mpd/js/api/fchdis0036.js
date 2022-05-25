define(['index',
        'less!/dts/mpd/assets/css/customersummary.less'
       ], function(index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
    customerApdFactory.$inject = ['$totvsresource'];
    function customerApdFactory($totvsresource) {
         
        var specificResources = {
            'statusActiveCustomer': {
                method: 'GET',
                isArray: false,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0036/statusActiveCustomer/',
                params: {}
            }
        };

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0036', {}, specificResources);
        return factory;
    }
         
    index.register.factory('mpd.customer.Factory', customerApdFactory);


});
