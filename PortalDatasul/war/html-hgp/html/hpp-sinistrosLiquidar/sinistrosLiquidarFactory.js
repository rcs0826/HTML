define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

    sinistrosLiquidarFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function sinistrosLiquidarFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hpp/fchsausinistrosliquidar/:method/:id', {},{             
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}, headers: {enctype:'multipart/form-data'}},
            'post':{method: 'POST',params: {method:'@method'}},
            'get': {method: 'GET',params: {method:'@method'}}  

        });

        factory.generate = function (parametros, rpw, callback) {
            factory.TOTVSPost({method: 'generate'},
                              {tmpParametros: parametros, tmpPedidosRpw: rpw},
                              callback);
        };

        return factory;
    }

    index.register.factory('hpp.sinistrosLiquidar.Factory', sinistrosLiquidarFactory);
});