define(['index'], function (index) {
    fchdisdboFactory.$inject = ['$totvsresource'];

    function fchdisdboFactory($totvsresource) {
        var specificResources = {
            'bodi00705_ReturnCustomerDefault': {
                method: 'GET',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdisdbo/bodi00705_ReturnCustomerDefault'
            },
			'boad039_ReturnActiveMaisNegocios': {
                method: 'GET',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdisdbo/boad039_ReturnActiveMaisNegocios'
            }
        }

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdisdbo', {}, specificResources);
        return factory;
    }
    index.register.factory('mpd.fchdisdbo.Factory', fchdisdboFactory);
});