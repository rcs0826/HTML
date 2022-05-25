define(['index'], function (index) {
    appFactory.$inject = ['$totvsresource'];

    function appFactory($totvsresource) {         
        var specificResources = {
            'putRecord': {
                method: 'POST', // Não pode ser PUT. Com o PUT as mensagens de erro não são apresentadas.
                isArray: true,
                params: {},
                url: '/dts/datasul-rest/resources/prg/cdp/v1/relatcustomerchannelestab/update'
            },
            'postRecord': {
                method: 'POST',
                isArray: true,
                params: {},
                url: '/dts/datasul-rest/resources/prg/cdp/v1/relatcustomerchannelestab'
            },
            'deleteRecord': {
                method: 'DELETE',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/prg/cdp/v1/relatcustomerchannelestab/:estabel/:canal/:emitente/:data'
            },
            'getRecord': {
                method: 'GET',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/prg/cdp/v1/relatcustomerchannelestab/:estabel/:canal/:emitente/:data'
            },
            'getRecords': {
                method: 'GET',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/prg/cdp/v1/relatcustomerchannelestab'
            },            
            'returnCustomerDefault': {
                method: 'GET',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/prg/cdp/v1/relatcustomerchannelestab/default/:canal/:cliente'
            }            
        }        
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/prg/cdp/v1/relatcustomerchannelestab', {}, specificResources);                 
        return factory;    
    }         
    index.register.factory('dts-utils.relatcustomerchannelestab.Factory', appFactory);
});