define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {
     
    avisoCobrancaFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
    function avisoCobrancaFactory($totvsresource, dtsUtils) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrc/fchsauimportaavisocobranca/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}, headers: {enctype:'multipart/form-data'}}            
        });

        factory.getInitialTemps = function (callback) {
            factory.postWithArray({method: 'getInitialTemps'},
                                {},
                                callback);
        };  

        factory.criaPedidoExec = function  (parametros, rpw, tmpUnidadeOrigem, tmpUnidadeDestino, callback) {
            factory.TOTVSPost({method: 'criaPedidoExec'},
                                {
                                 tmpParametros: parametros, 
                                 tmpPedidosRpw: rpw,
                                 tmpUnidadeOrigem: tmpUnidadeOrigem,
                                 tmpUnidadeDestino: tmpUnidadeDestino,
                                },
                                callback);
        };
        
        return factory;
}

index.register.factory('hrc.avisoCobranca.Factory', avisoCobrancaFactory);	
});
 