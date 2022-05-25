define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	reasonFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function reasonFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrs/fchsaureason/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.getReasonByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getReasonByFilter',
                    simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                    limit: limit, loadNumRegisters: loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                callback);
        };

        factory.saveReason = function (novoRegistro, tmpAbiMotivo, tmpMotivoClasseErro, callback) {   
            
            factory.TOTVSPost({method: 'saveReason'},
                              {novoRegistro: novoRegistro,
                               tmpAbiMotivo: tmpAbiMotivo,
                               tmpMotivoClasseErro: tmpMotivoClasseErro},
            function(result){ 
                if(result && result.tmpAbiMotivo){
                    result.tmpAbiMotivo.$hasError = result.$hasError;
                    callback(result.tmpAbiMotivo);
                    return;
                }
                
                callback(result);
            });
        }

        factory.removeReason = function (tmpAbiMotivo,callback) {   

            factory.TOTVSPost({method: 'removeReason'},
                              {tmpAbiMotivo: tmpAbiMotivo},
                               callback);
        }

        factory.prepareDataToMaintenanceWindow = function (idMotivo, idNatureza, callback) { 
              
            factory.TOTVSPost({method: 'prepareDataToMaintenanceWindow'},
                              {idMotivo: idMotivo, 
                               idNatureza: idNatureza},
                              callback);
        }
                
        return factory;
    }

    index.register.factory('hrs.reason.Factory', reasonFactory); 
});


