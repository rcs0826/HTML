define(['index', 
        '/dts/hgp/html/util/dts-utils.js',
        'ng-load!ui-file-upload'
       ], function(index) {
    
    eSocialExportaXMLFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service', 'Upload'];
    function eSocialExportaXMLFactory($totvsresource, dtsUtils, Upload) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hcg/fchsauexportaesocial/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}, headers: {enctype:'multipart/form-data'}},
            'post': { method: 'POST', params: {method:'@method'}, headers: {enctype:'multipart/form-data', 'noCountRequest': 'true'}}
        });


        factory.getParametrosHtmlExportacao = function (callback) {
            factory.postWithArray({method: 'getParametrosHtmlExportacao'},
                                {},
                                callback);
        };

        factory.executaExportacao = function (parametros, callback) {
            factory.TOTVSPost({method: 'exportarRegistrosESocial'},
                                {tmpParametrosHtmlExportacao: parametros},
                                callback);
        };

        factory.executaRetificacaoESocial = function (parametros, enviosSelecionados, callback) {
            factory.TOTVSPost({method: 'exportarRegistrosESocial'},
                                {tmpParametrosHtmlExportacao: parametros,
                                 tmpEnvioESocial: enviosSelecionados},
                                 callback);
        }; 

        factory.executaExclusao = function (parametros, enviosSelecionados, callback) {
            factory.TOTVSPost({method: 'exportarRegistrosESocial'},
                                {tmpParametrosHtmlExportacao: parametros,
                                 tmpEnvioESocial: enviosSelecionados},
                                callback);
        };
        
        factory.getEventosESocial = function (periodicos, callback) {
            factory.postWithArray({method: 'getEventosESocial',
                                 periodicos: periodicos},                                   
                                {},
                                callback);
        };
        
        factory.getEnvioEsocialByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.TOTVSPost({method: 'getEnvioEsocialByFilter',
                               simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                               limit: limit, loadNumRegisters: loadNumRegisters},
                              {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                              callback);
        };

        
        return factory;
}

index.register.factory('hcg.eSocialExportaXML.Factory', eSocialExportaXMLFactory);	
});


