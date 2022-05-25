define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	documentsFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function documentsFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrs/fchsaudocuments/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.getDocumentsByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getDocumentsByFilter',
                    simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                    limit: limit, loadNumRegisters: loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                callback);
        };

        factory.saveDocuments = function (novoRegistro, tmpAbiImpugdocs, tmpDocumentoMotivo, tmpDocumentoContratante, callback) {   
            factory.TOTVSPost({method: 'saveDocuments'},
                                  {novoRegistro: novoRegistro,
                                   tmpAbiImpugdocs: tmpAbiImpugdocs,
                                   tmpDocumentoMotivo: tmpDocumentoMotivo,
                                   tmpDocumentoContratante: tmpDocumentoContratante},
            function(result){ 
                if(result && result.tmpAbiImpugdocs){
                    result.tmpAbiImpugdocs.$hasError = result.$hasError;
                    callback(result.tmpAbiImpugdocs);
                    return;
                }
                
                callback(result);
            });
        }

        factory.removeDocuments = function (tmpAbiImpugdocs,callback) {   

            factory.TOTVSPost({method: 'removeDocuments'},
                              {tmpAbiImpugdocs: tmpAbiImpugdocs},
                               callback);
        }

        factory.removeuploadedfile = function (tmpListaArquivosUpload,callback) {   

            factory.TOTVSPost({method: 'removeuploadedfile'},
                              {tmpListaArquivosUpload: tmpListaArquivosUpload},
                               callback);
        }

        factory.prepareDataToMaintenanceWindow = function (idImpugdocs,callback) { 
            factory.TOTVSPost({method: 'prepareDataToMaintenanceWindow'},
                              {idImpugdocs: idImpugdocs},
                              callback);
        }
                
        return factory;
    }

    index.register.factory('hrs.documents.Factory', documentsFactory);	
});


