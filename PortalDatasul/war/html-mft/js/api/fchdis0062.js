define(['index',
       ], function(index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
    anticipatedBillingFactory.$inject = ['$totvsresource'];
    function anticipatedBillingFactory($totvsresource) {
         
        var specificResources = {
            'getAnticipatedBalance': {
                method: 'GET',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/prg/ftp/v1/anticipatedbilling'
            },
            'getAnticipatedMovement': {
                method: 'GET',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/prg/ftp/v1/anticipatedbilling/searchAnticipatedMovements'
             }
        }
       
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0062', {}, specificResources);
         
        return factory;
    }
         
    index.register.factory('mpd.anticipatedbilling.Factory', anticipatedBillingFactory);
   
    
});