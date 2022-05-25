define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {
    
    geracSenhaLoteFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
    function geracSenhaLoteFactory($totvsresource, dtsUtils) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hac/fchsaugeracsenhalote/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}, headers: {enctype:'multipart/form-data'}}            
        });

        factory.getParametros = function (callback) {
            factory.postWithArray({method: 'getParametros'},
                                {},
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

        factory.generatePasscode = function (parametros, rpw, callback) {
            factory.TOTVSPost({method: 'generatePasscode'},
                                {tmpParametros: parametros, tmpPedidosRpw: rpw},
                                callback);
        };
        

        /*factory.getParametrosHtmlExportacao = function (callback) {
            factory.postWithArray({method: 'getParametrosHtmlExportacao'},
                                {},
                                callback);
        };

        factory.executaExportacao = function (parametros, callback) {
            factory.TOTVSPost({method: 'exportarRegistrosESocial'},
                                {tmpParametrosHtmlExportacao: parametros},
                                callback);
        };
        
        factory.executaExclusao = function (parametros, enviosSelecionados, callback) {
            factory.TOTVSPost({method: 'exportarRegistrosESocial'},
                                {tmpParametrosHtmlExportacao: parametros,
                                 tmpEnvioESocial: enviosSelecionados},
                                callback);
        };
        
        factory.getEventosESocial = function (callback) {
            factory.postWithArray({method: 'getEventosESocial'},
                                {},
                                callback);
        };
        
        factory.getEnvioEsocialByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getEnvioEsocialByFilter',
                               simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                               limit: limit, loadNumRegisters: loadNumRegisters},
                              {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                              callback);
        };*/

        
        return factory;
}

index.register.factory('hac.geracSenhaLote.Factory', geracSenhaLoteFactory);	
});


