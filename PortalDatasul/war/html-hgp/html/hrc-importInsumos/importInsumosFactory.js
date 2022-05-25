define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

    importInsumosFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function importInsumosFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrc/fchsauimportinsumos/:method/:id', {},{             
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}, headers: {enctype:'multipart/form-data'}},
            'post':{method: 'POST',params: {method:'@method'}},
            'get': {method: 'GET',params: {method:'@method'}}  

        });

        factory.carregaDadosPadrao = function (callback) {
            factory.TOTVSQuery({method: 'carregaDadosPadrao'},
                                callback);
        };

        factory.criaPedidoExec = function (parametros, rpw, callback) {
            factory.TOTVSPost({method: 'criaPedidoExec'},
                              {tmpParametros: parametros, tmpPedidosRpw: rpw},
                               callback);
        };

        return factory;
    }

    index.register.factory('hrc.importInsumos.Factory', importInsumosFactory);
});