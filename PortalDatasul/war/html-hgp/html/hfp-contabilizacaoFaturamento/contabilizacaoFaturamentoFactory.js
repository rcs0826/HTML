define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {
    
    contabilizacaoFaturamentoFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
    function contabilizacaoFaturamentoFactory($totvsresource, dtsUtils) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/thf/hfp/fchsaucontabilizacaofaturamento/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}, headers: {enctype:'multipart/form-data'}}            
        });

        factory.getParametros = function (callback) {
            factory.TOTVSQuery({method: 'carregaParametros'},
                                callback);
        };

        factory.getQuery = function (cMethod, callback) {
            factory.TOTVSQuery({method: cMethod},
                                callback);
        };

        factory.getAllMotivesByGroup = function (group, callback) {
            factory.TOTVSQuery({method: 'getAllMotivesByGroup',
            grupo: group}, callback);
        };

        factory.generate = function (parametros, rpw, callback) {
            factory.postWithArray({method: 'generate'},
                                  {tmpParamContabFatur: parametros, tmpPedidosRpw: rpw},
                                  callback);
        };

        return factory;
}

index.register.factory('hfp.contabilizacaoFaturamento.Factory', contabilizacaoFaturamentoFactory);

});
