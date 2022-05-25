define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	justificationFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function justificationFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrs/fchsaujustification/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.getJustificationByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getJustificationByFilter',
                    simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                    limit: limit, loadNumRegisters: loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                callback);
        };

        factory.savejustification = function (novoRegistro, tmpAbiJustif, callback) {   
            factory.TOTVSPost({method: 'saveJustification'},
                                  {novoRegistro: novoRegistro,
                                   tmpAbiJustif: tmpAbiJustif},
            function(result){ 
                if(result && result.tmpAbiJustif){
                    result.tmpAbiJustif.$hasError = result.$hasError;
                    callback(result.tmpAbiJustif);
                    return;
                }
                
                callback(result);
            });
        }

        factory.removejustification = function (tmpAbiJustif,callback) {   

            factory.TOTVSPost({method: 'removeJustification'},
                              {tmpAbiJustif: tmpAbiJustif},
                               callback);
        }

        factory.prepareDataToMaintenanceWindow = function (idJustificativa, callback) {   

            factory.postWithArray({method: 'prepareDataToMaintenanceWindow'},
                              {idJustificativa: idJustificativa},
                               callback);
        }
                
        return factory;
    }

    index.register.factory('hrs.justification.Factory', justificationFactory); 
});


