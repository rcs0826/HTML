define(['index',         
       ], function(index) {

	// *************************************************************************************
	// *** FACTORIES
	// *************************************************************************************
	documentosExportAvisosCobFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function documentosExportAvisosCobFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrc/fchsaudocumentosavisocob/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.getTodosDocumentosAvisos = function (start,limit,loadNumRegisters,disclaimers, callback) {            
            factory.TOTVSPost({method: 'getTodosDocumentosAvisos', start:start,limit:limit,loadNumRegisters:loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                callback);
        };

        factory.getBuscaHistSitDoc = function (idSeqAvisoCob,callback ){
            factory.TOTVSGet({method: 'getBuscaHistSitDoc',idSeqAvisoCob:idSeqAvisoCob},callback);
        }

        factory.postDeletarAvisosCobrancas = function(tmpDoctoAvisoCob,disclaimers,isBatch,tmpNaoSelecDoctoAvisoCob,callback){
            factory.TOTVSPost({method: 'postDeletarAvisosCobrancas', isBatch:isBatch},
                    {tmpDoctoAvisoCob: tmpDoctoAvisoCob, tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers), tmpNaoSelecDoctoAvisoCob:tmpNaoSelecDoctoAvisoCob},
                callback);   
        }

        factory.comunicarAvisoComErro = function(tmpDoctoAvisoCob,disclaimers,isBatch,tmpNaoSelecDoctoAvisoCob,callback){
            factory.TOTVSPost({method: 'comunicarAvisoComErro', isBatch:isBatch},
                    {tmpDoctoAvisoCob: tmpDoctoAvisoCob, tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers), tmpNaoSelecDoctoAvisoCob:tmpNaoSelecDoctoAvisoCob},
                callback);   
        }

        factory.getErrorMessages = function (cddSeq,callback ){
            factory.TOTVSGet({method: 'getErrorMessages',cddSeq:cddSeq},callback);
        }

        return factory;
    }

    index.register.factory('hrc.documentosExportAvisosCob.Factory', documentosExportAvisosCobFactory);	
});
