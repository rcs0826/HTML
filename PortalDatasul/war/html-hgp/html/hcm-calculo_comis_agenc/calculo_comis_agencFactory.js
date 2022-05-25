define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {
    
    calculo_comis_agencFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
    function calculo_comis_agencFactory($totvsresource, dtsUtils) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/thf/hcm/fchsaucalculo_comis_agenc/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}, headers: {enctype:'multipart/form-data'}}            
        });

        factory.getParametros = function (callback) {
            factory.postWithArray({method: 'getParametros'},
                                {},
                                callback);
        };

        factory.geraCalculoComissAgenc = function (parametros, tmpModalidade, callback) {
            factory.TOTVSPost({method: 'geraCalculoComissAgenc'},
                                {
                                    tmpCalculo_comis_agenc: parametros,
                                    tmpModalidade : tmpModalidade
                                },
                                callback);
        };

        factory.getLayouts = function (callback) {
            factory.TOTVSQuery({method: 'getLayouts'},                            
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

index.register.factory('hcm.calculo_comis_agenc.Factory', calculo_comis_agencFactory);	
});


