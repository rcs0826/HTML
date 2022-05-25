define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	contaProvisReceitaFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function contaProvisReceitaFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/thf/hfp/fchsau-conta-provis-receita/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
		});

        factory.getContaProvisReceitaByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getContaProvisReceitaByFilter',
                                   simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                   limit: limit, loadNumRegisters: loadNumRegisters},
                                  {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                                   callback);
        };

        factory.saveContaProvisReceita = function (novoRegistro, tmpContaProvisReceita, callback) {   
            factory.TOTVSPost({method: 'saveContaProvisReceita'},
                              {novoRegistro: novoRegistro,
                               tmpContaProvisReceita: tmpContaProvisReceita},
            function(result){ 
                if(result && result.tmpRegraInclExc){
                    result.tmpRegraInclExc.$hasError = result.$hasError;
                    callback(result.tmpRegraInclExc);
                    return;
                }
                
                callback(result);
            });
        };

        factory.removeContaProvisReceita = function (tmpContaProvisReceita, callback) {   
            factory.TOTVSPost({method: 'removeContaProvisReceita'},
                              {tmpContaProvisReceita: tmpContaProvisReceita},
                               callback);
        };

        factory.prepareDataToMaintenanceWindow = function (tmpContaProvisReceita, callback) {   
            factory.TOTVSPost({method: 'prepareDataToMaintenanceWindow'},
                              {tmpContaProvisReceita:tmpContaProvisReceita},
                               callback);
        };

        factory.exportContaProvisReceita = function (disclaimers, callback) {
            factory.TOTVSPost({method: 'exportContaProvisReceita'},
                              {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                               callback);
        }; 

        return factory;
    }

    index.register.factory('hfp.contaProvisReceita.Factory', contaProvisReceitaFactory);	
});


