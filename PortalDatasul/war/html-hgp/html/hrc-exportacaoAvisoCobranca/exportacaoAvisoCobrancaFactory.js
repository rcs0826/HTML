define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {
    
    exportacaoAvisoCobrancaFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
    function exportacaoAvisoCobrancaFactory($totvsresource, dtsUtils) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/thf/hrc/fchsau-dtvw-aviso-cobranca/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}, headers: {enctype:'multipart/form-data'}}            
        });

        factory.getInitialTemps = function (callback) {
            factory.TOTVSPost({method: 'getInitialTemps'},
                                {},
                                callback);
        };        

        factory.getQuery = function (cMethod, callback) {
            factory.TOTVSQuery({method: cMethod},
                                callback);
        };        

        factory.generatePasscode = function (parametros, rpw, tmpUnidade, tmpTransacao, callback) {
            factory.TOTVSPost({method: 'generatePasscode'},
                                {
                                    tmpParametros: parametros, 
                                    tmpPedidosRpw: rpw,
                                    tmpUnidade: tmpUnidade,
                                    tmpTransacao: tmpTransacao
                                },
                                callback);
        };
        
        return factory;
    }

    index.register.factory('hrc.exportacaoAvisoCobranca.Factory', exportacaoAvisoCobrancaFactory);	
});


