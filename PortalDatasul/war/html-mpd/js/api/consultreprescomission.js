define(['index'], function (index) {
    appFactory.$inject = ['$totvsresource'];

    function appFactory($totvsresource) {         
        var specificResources = {
            'getRecords': {
                method: 'GET',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/prg/cdp/v1/consultreprescomission'
            },
            'getDetailRecords': {
                method: 'GET',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/prg/cdp/v1/consultreprescomission/detail'
            }            
        }        
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/prg/cdp/v1/consultreprescomission', {}, specificResources);                 
        return factory;    
    }         
    index.register.factory('dts-utils.consultreprescomission.Factory', appFactory);
});