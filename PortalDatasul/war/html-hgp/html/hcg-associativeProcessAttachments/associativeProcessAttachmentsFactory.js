define(['index',
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	associativeProcessAttachmentsFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function associativeProcessAttachmentsFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hcg/fchsauassociativeprocessattachments/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.getAssociativeProcessAttachmentsByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getAssociativeProcessAttachmentsByFilter',
                    simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                    limit: limit, loadNumRegisters: loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                callback);
        };
		
		factory.saveAssociativeProcessAttachments = function (tmpGerenciaProcesAnexo, tmpTipAnexo,  callback) {            
            factory.TOTVSPost({method: 'saveAssociativeProcessAttachments'},{tmpGerenciaProcesAnexo: tmpGerenciaProcesAnexo, tmpTipAnexo: tmpTipAnexo}, 
                function(result){
                    if(result && result.tmpGerenciaProcesAnexo){
                        result.tmpGerenciaProcesAnexo.$hasError = result.$hasError;
                        callback(result.tmpGerenciaProcesAnexo);
                        return;
                    }
                    callback(result);
                });
        };

        factory.removeAssociativeProcessAttachments = function (tmpGerenciaProcesAnexo,  callback) {            
            factory.TOTVSPost({method: 'removeAssociativeProcessAttachments'},{tmpGerenciaProcesAnexo: tmpGerenciaProcesAnexo}, 
                function(result){
                    if(result && result.tmpGerenciaProcesAnexo){
                        result.tmpGerenciaProcesAnexo.$hasError = result.$hasError;
                        callback(result.tmpGerenciaProcesAnexo);
                        return;
                    }
                    callback(result);
                });
        }; 

        factory.tipAnexoAssociativeProcessAttachments = function (tmpTipAnexo,  callback) {            
            factory.TOTVSPost({method: 'tipAnexoAssociativeProcessAttachments'},{tmpTipAnexo: tmpTipAnexo}, 
                function(result){
                    if(result && result.tmpTipAnexo){
                        result.tmpTipAnexo.$hasError = result.$hasError;
                        callback(result.tmpTipAnexo);
                        return;
                    }
                    callback(result);
                });
        };
                
        return factory;
    }

    index.register.factory('hcg.associativeProcessAttachments.Factory', associativeProcessAttachmentsFactory);	
});


