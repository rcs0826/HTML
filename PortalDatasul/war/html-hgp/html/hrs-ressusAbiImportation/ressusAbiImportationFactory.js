define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	ressusAbiImportationFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function ressusAbiImportationFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrs/fchsauressus/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.getRessusAbiDadosByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getRessusAbiDadosByFilter',
                    simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                    limit: limit, loadNumRegisters: loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                callback);
        };

        factory.saveRessusAbiDados = function (tmpRessusAbiDados,callback) {   

            factory.TOTVSPost({method: 'saveRessusAbiDados'},
                                  {tmpRessusAbiDados: tmpRessusAbiDados},
            function(result){ 

                if(result && result.tmpRessusAbiDados){
                    result.tmpRessusAbiDados.$hasError = result.$hasError;
                    callback(result.tmpRessusAbiDados);
                    return;
                }
                
                callback(result);
            });
        }

        factory.removeRessusAbiDados = function (tmpRessusAbiDados,callback) {   

            factory.TOTVSPost({method: 'removeRessusAbiDados'},
                              {tmpRessusAbiDados: tmpRessusAbiDados},
                               callback);
        }

        factory.getRessusAbiDadosByKey = function (cddRessusAbiDados,callback) {   
            factory.postWithArray({method: 'getRessusAbiDadosByKey',
                              cddRessusAbiDados: cddRessusAbiDados},
                              {},
                               callback);
                              
        }

        factory.validateXMLfile = function(nomeArquivoImportacao,callback){
            factory.postWithArray({method: 'validateXMLfile',nomeArquivo:nomeArquivoImportacao},
                                  {}, 
                                  callback);
        }
                
        factory.createAbiData = function(tmpRessusAbiDados, nomeArquivoTemp, nomeArquivo, dtAnoNrPerRef, callback){
            factory.TOTVSPost({method: 'criaLoteAbi',
                                nomeArquivoTemp: nomeArquivoTemp,
                                nomeArquivo: nomeArquivo,
                                competencia: dtAnoNrPerRef},
                              {tmpRessusAbiDados:tmpRessusAbiDados}, 
                              callback);
        }
          
        factory.getRessusAbiAtendim = function(cddRessusAbiDados,pageOffset,limit,callback){
          factory.postWithArray({method: 'getRessusAbiAtendim',
                                 cddRessusAbiDados:cddRessusAbiDados,
                                 pageOffset: pageOffset, 
                                 limit: limit},
                                 {}, 
                                 callback);
        }

        factory.reprocess = function(cddRessusAbiDados, callback){

          factory.TOTVSPost({method: 'reprocessarLote',
                             cddRessusAbiDados: cddRessusAbiDados},
                            {}, 
                            callback);
        }

        return factory;
    }

    index.register.factory('hrs.ressusAbiImportation.Factory', ressusAbiImportationFactory);	
});


