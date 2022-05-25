define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

    descalcPagPrestFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function descalcPagPrestFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hpp/fchsaudescalcpagprest/:method/:id', {},{             
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}, headers: {enctype:'multipart/form-data'}},
            'post':{method: 'POST',params: {method:'@method'}},
            'get': {method: 'GET',params: {method:'@method'}}  

        });

        var providerFactory = $totvsresource.REST('/dts/datasul-rest/resources/prg/hcg/v1/healthProviders/:method/', {},{                         
            'get': {method: 'GET', isArray: true, params: {method:'@method'}}  
        });

        factory.getDefaultFilters = function (callback) {
            factory.TOTVSQuery({method: 'getDefaultFilters'},
                               callback);
        };

        factory.generate = function (parametros, rpw, callback) {
            factory.TOTVSPost({method: 'generate'},
                              {tmpParametros: parametros, tmpPedidosRpw: rpw},
                              callback);
        };

        factory.getCSVHealthProviders = function (file, callback) {            
            providerFactory.get({method: 'csv',
                                file: file},
                                callback);            
        };

        return factory;
    }

    index.register.factory('hpp.descalcPagPrest.Factory', descalcPagPrestFactory);
});