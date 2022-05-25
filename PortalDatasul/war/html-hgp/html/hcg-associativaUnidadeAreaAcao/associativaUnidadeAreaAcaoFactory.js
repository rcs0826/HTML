define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

    associativaUnidadeAreaAcaoFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function associativaUnidadeAreaAcaoFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/thf/hcg/fchsauassociativaunidadeareaacao/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
		});	


        factory.getAssociativaUnidadeAreaAcaoByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getAssociativaUnidadeAreaAcaoByFilter',
                               simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                               limit: limit, loadNumRegisters: loadNumRegisters},
                              {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                              callback);
        };

        factory.getInfoCity = function (cdnCidade, callback) {  
            factory.TOTVSPost({method: 'getInfoCity'},
                              {cdnCidade: cdnCidade},
                               callback);
        };

        factory.saveAssociativaUnidadeAreaAcao = function (novoRegistro, tmpAssociativaUnidadeAreaAcao,callback) {   
            factory.TOTVSPost({method: 'saveAssociativaUnidadeAreaAcao'},
                              {novoRegistro: novoRegistro,
                               tmpAssociativaUnidadeAreaAcao: tmpAssociativaUnidadeAreaAcao},
            function(result){ 
                if(result && result.tmpAssociativaUnidadeAreaAcao){
                    result.tmpAssociativaUnidadeAreaAcao.$hasError = result.$hasError;
                    callback(result.tmpAssociativaUnidadeAreaAcao);
                    return;
                }
                
                callback(result);
            });
        };


        factory.removeAssociativaUnidadeAreaAcao = function (tmpAssociativaUnidadeAreaAcao,callback) {   

            factory.TOTVSPost({method: 'removeAssociativaUnidadeAreaAcao'},
                              {tmpAssociativaUnidadeAreaAcao: tmpAssociativaUnidadeAreaAcao},
                               callback);
        };

        factory.prepareDataToMaintenanceWindow = function (cdnUnid, cdnCidade, callback) {   
            factory.postWithArray({method: 'prepareDataToMaintenanceWindow'},
                                  {cdnUnid: cdnUnid,
                                   cdnCidade: cdnCidade},
                                   callback);
        };

        return factory;
    }

    index.register.factory('hcg.associativaUnidadeAreaAcao.Factory', associativaUnidadeAreaAcaoFactory);	
});


