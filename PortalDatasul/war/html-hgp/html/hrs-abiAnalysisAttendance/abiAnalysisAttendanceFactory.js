define(['index', 
        '/dts/hgp/html/util/dts-utils.js',
		'ng-load!ui-file-upload'
       ], function(index) {

	abiAnalysisAttendanceFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service', 'Upload'];
	function abiAnalysisAttendanceFactory($totvsresource, dtsUtils, Upload) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrs/fchsauabianalysisattendance/:method/:id', {},{             
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}, headers: {enctype:'multipart/form-data'}},
            'post':{method: 'POST',params: {method:'@method'}},
            'get': {method: 'GET',params: {method:'@method'}}  

        });
        factory.getRessusAbiAtendimByFilter = function (cddRessusAbiDados, simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
          factory.postWithArray(
            {
                method: 'getRessusAbiAtendimByFilter',
                cddRessusAbiDados:cddRessusAbiDados,
                simpleFilterValue: simpleFilterValue,
                pageOffset: pageOffset,
                limit: limit,
                loadNumRegisters: loadNumRegisters
              },
              {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
              callback);
        };

        factory.getRessusAbiSituations = function(callback){
            factory.TOTVSQuery({method: 'getRessusAbiSituations'},
                               callback);
        };
        
        factory.getRessusAbiAtendimData = function(cddRessusAbiAtendim,callback){
            factory.TOTVSPost({method: 'getRessusAbiAtendimData',
                               cddRessusAbiAtendim:cddRessusAbiAtendim},
                               {}, 
                               callback);
        };

        factory.updateAbiAtendimSubStatus = function(cddRessusAbiAtendim,idiSubStatus,callback){
            factory.TOTVSPost({method: 'updateAbiAtendimSubStatus',
                               cddRessusAbiAtendim:cddRessusAbiAtendim,
                               idiSubStatus:idiSubStatus},
                              {},
                              callback);
        };
        
        factory.updateAbiAtendimSituacao = function(cddRessusAbiDados, idSituacao, disclaimers, tmpUnselectedAttendance, callback){
            factory.TOTVSPost({method: 'updateAbiAtendimSituacao',
                               cddRessusAbiDados: cddRessusAbiDados, idSituacao: idSituacao},
                              {tmpUnselectedAttendance: tmpUnselectedAttendance,
                               tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)}, 
                              callback);
        };

        factory.updateAbiAtendimGRU = function(cddRessusAbiDados, cddGRU, disclaimers, tmpUnselectedAttendance, callback){
            factory.TOTVSPost({method: 'updateAbiAtendimGRU',
                               cddRessusAbiDados: cddRessusAbiDados, cddGRU: cddGRU},
                              {tmpUnselectedAttendance: tmpUnselectedAttendance,
                               tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)}, 
                              callback);
        };

        factory.getMovementRestriction = function(cddRessusAbiProced,callback){
            factory.postWithArray({method: 'getMovementRestriction',
                                   cddRessusAbiProced:cddRessusAbiProced},   
                                   {},                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                                   callback);
        };

        factory.getErrors = function(cddRessusAbiAtendim,cddRessusAbiProced,callback){

            factory.postWithArray({method: 'getErrors',
                                   cddRessusAbiAtendim : cddRessusAbiAtendim,
                                   cddRessusAbiProced : cddRessusAbiProced},   
                                   {},                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                                   callback);
        };

        factory.getMovementImpugnationMotive = function(cddRessusAbiProced,callback){
            factory.postWithArray({method: 'getMovementImpugnationMotive',
                                   cddRessusAbiProced:cddRessusAbiProced},   
                                   {},                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                                   callback);
        };
		
		    factory.uploadDocumento = function(file, nmDocto, extDocto, idDocto, cdRessusAbiAtendim, idImpugdocs, callback, callbackProgress, callbackError){
            var v_url = "/dts/datasul-rest/resources/api/fch/fchsau/hrs/fchsauabianalysisattendance/uploadfile?"+
                        "idDocto=" + idDocto +
                        "&cdRessusAbiAtendim=" + cdRessusAbiAtendim +
                        "&idImpugdocs=" + idImpugdocs +
                        "&tpDocto=" + file.rawFile.type +
                        "&nmDocto=" + nmDocto +
                        "&extDocto=" + extDocto;
            return Upload.upload({
                url: v_url,
                headers: {'noCountRequest': 'true'},
                file: file.rawFile

            }).success(function (result, status, headers, config) {
               
                if (callback) {
                    callback(result);
                }

            }).progress(function (evt) {

                if (callbackProgress) {
                    callbackProgress(parseInt(100.0 * evt.loaded / evt.total, 10), evt);
                }
            }).error(function (result, status, headers, config) {

                if (callbackError) {
                    callbackError(result, status, headers, config);
                }

            });
        };
		
        factory.downloadDocumento = function(idDocument,callback){
            factory.TOTVSGet({method: 'downloadDocComprobatorio',
            idDocument:idDocument},
            callback);
        };

        factory.getAbiAnalysisAttendanceProcedures = function (cdProtocoloAbi, cdProtocoloAih,callback) { 
            factory.postWithArray({method: 'getAbiAnalysisAttendanceProcedures'},
                              {cdProtocoloAbi: cdProtocoloAbi,
                              cdProtocoloAih: cdProtocoloAih},
                              callback);
        }
        
        factory.saveAbiAnalysisAttendanceProcedures = function(cdProtocoloAbi, cdProtocoloAih, tmpAbiAnalysisProcedures) { 
            factory.postWithArray({method: 'saveAbiAnalysisAttendanceProcedures'},
                                  {cdProtocoloAbi: cdProtocoloAbi,
                                   cdProtocoloAih: cdProtocoloAih,
                                   tmpAbiAnalysisProcedures: tmpAbiAnalysisProcedures});
        }
        
        factory.saveAttendanceData = function (novoRegistro, tmpAbiAtendimentoRegistro, callback) {   
            factory.TOTVSPost({method: 'saveAttendanceData',
                               novoRegistro: novoRegistro},
                               {tmpAbiAtendimentoRegistro: tmpAbiAtendimentoRegistro},
                                callback);
        };
        
        
        factory.updateDocCompVinculado = function (cdRessusAbiAtendim, callback) {   
            factory.TOTVSPost({method: 'updateDocCompVinculado'},
                               {cdRessusAbiAtendim: cdRessusAbiAtendim},
                                callback);
        };
        
        factory.searchDocument = function(cdRessusAbiAtendim,callback){
            factory.TOTVSPost({method: 'searchDocument'},
                                  {cdRessusAbiAtendim: cdRessusAbiAtendim},
                                   callback);
        };
        factory.addDocument = function(tmpDoctoAnexo,callback){
            factory.TOTVSPost({method: 'addDocument'},
                               {tmpDoctoAnexo: tmpDoctoAnexo},
                                   callback);
        }
        
        factory.saveAttendenceDocuments = function(cdRessusAbiAtendim, tmpDoctoAnexo,callback){
            factory.TOTVSPost({method: 'saveAttendenceDocuments'},
                            {cdRessusAbiAtendim: cdRessusAbiAtendim, 
                                tmpDoctoAnexo: tmpDoctoAnexo},
                                callback);
        }

        factory.removeDocument = function(tmpDoctoAnexo,callback){
            factory.TOTVSPost({method: 'removeDocument'},
                                   {tmpDoctoAnexo: tmpDoctoAnexo},
                                   callback);
        }

        factory.downloadDocComprobatorio = function(cdRessusAbiAtendim,idDocument,callback){
            factory.postWithArray({method: 'downloadDocComprobatorio'},
                                {cdRessusAbiAtendim: cdRessusAbiAtendim,
                                idDocument:idDocument},
                                callback);
        };

        factory.removerDocComprobatorio = function(idDocument,callback){
            factory.postWithArray({method: 'removerDocComprobatorio'},
                               {idDocument:idDocument},
                              callback);
        };        

        factory.getAbiAnalisysAttendanceReasons = function(cdProtocoloAbi, cdProtocoloAih, callback){
            factory.postWithArray({method: 'getAbiAnalisysAttendanceReasons'},
                                  {cdProtocoloAbi: cdProtocoloAbi,
                                   cdProtocoloAih: cdProtocoloAih},
                                   callback);
        };

        factory.getAbiAnalysisAttendanceJustifications = function(cddRessusAbiAtendimPar,callback) {

            factory.TOTVSPost({method: 'getAbiAnalysisAttendanceJustifications'},
                                  {cddRessusAbiAtendim: cddRessusAbiAtendimPar},
                                   callback);
        };

        factory.saveAttendanceJustifications = function(cdProtocoloAbi, cdProtocoloAih, ttPrincProcMotivo, callback){
            factory.TOTVSPost({method: 'saveAttendanceJustifications'},
                                  {cdProtocoloAbi: cdProtocoloAbi,
                                   cdProtocoloAih: cdProtocoloAih,
                               ttPrincProcMotivo: ttPrincProcMotivo},
                               callback);
        };

        factory.getAbiAnalysisAttendanceSuspHist = function(idBeneficiario, callback) {
            factory.postWithArray({method: 'getAbiAnalysisAttendanceSuspHist'},
                                  {idBeneficiario: idBeneficiario},
                                   callback);
        };

        factory.getAbiAnalysisAttendanceImpugHist = function(nrAih, cdProtocoloAbi, callback) {
            factory.postWithArray({method: 'getAbiAnalysisAttendanceImpugHist'},
                                  {nrAih: nrAih,
                                   cdProtocoloAbi: cdProtocoloAbi},
                                   callback);
        };

		    factory.getAbiAnalysisAttendanceRefundHist = function(idBeneficiario, callback) {
            factory.postWithArray({method: 'getAbiAnalysisAttendanceRefundHist'},
                                  {idBeneficiario: idBeneficiario},
                                   callback);
        };

        

		    factory.syncDocumentReasons = function(idDocument,tmpDoctoMotivoAnexo,callback){
			      factory.TOTVSPost({method: 'syncDocumentReasons'},
                              {idDocument:idDocument,
							                tmpDoctoMotivoAnexo: tmpDoctoMotivoAnexo},
                              callback);
        };
        
        factory.generateImpugApeal = function(idDocument,  cddRessusAbiAtendim, callback) {

            factory.TOTVSPost({method: 'generateImpugApeal',
                              idDocument : idDocument,
                               cddRessusAbiAtendim : cddRessusAbiAtendim},
                               {},
                               callback);

        };

        factory.getInforDeclaration = function(cdProtocoloAbi,cdProtocoloAih, callback) {
            factory.TOTVSPost({method: 'getInforDeclaration'},                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                               {cdProtocoloAih:cdProtocoloAih,
                                cdProtocoloAbi:cdProtocoloAbi},
                                callback);
        };

        factory.getImpugnationsInfo = function(callback){
            factory.postWithArray({method: 'getImpugnationsInfo'},                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
                                   callback);
        };

        factory.getBeneficiaryByAIH = function(cddRessusAbiAtendimPar, callback) {  
            factory.postWithArray({method: 'getBeneficiaryByAIH'},
                                  {cddRessusAbiAtendim: cddRessusAbiAtendimPar},
                                  callback);
        };

        factory.getDeclarantInfo = function(callback) {
            factory.postWithArray({method: 'getDeclarantInfo'},
                                  callback);
        };

        factory.generateAttendanceDeclaration = function(cddRessusAbiAtendim, attandenceDeclaration, callback) {
            factory.TOTVSPost({method: 'generateAttendanceDeclaration',
                              cddRessusAbiAtendim: cddRessusAbiAtendim},
                              {tmpRessusAttandenceReport: attandenceDeclaration},
                              callback);
        }

        factory.editMovement = function(tmpRessusAbiProced, callback) {
            factory.TOTVSPost({method: 'editMovement'},
                              {tmpRessusAbiProced: tmpRessusAbiProced},
                              callback);
        }

        factory.getAttendanceImpugnationMotive = function(cddRessusAbiAtendim,callback){
            factory.TOTVSPost({method: 'getAttendanceImpugnationMotive',
                               cddRessusAbiAtendim: cddRessusAbiAtendim},   
                              {},                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                              callback);
        }

        factory.getServiceImpugnationMotive = function(cddRessusAbiAtendim, cddRessusAbiProced, callback){
            factory.postWithArray({method: 'getServiceImpugnationMotive',
                                   cddRessusAbiAtendim: cddRessusAbiAtendim,
                                   cddRessusAbiProced: cddRessusAbiProced},   
                                  {},                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                                  callback);
        }        

        factory.getRessusAbiAtendimServices = function(cddRessusAbiAtendim,callback){
            factory.TOTVSPost({method: 'getRessusAbiAtendimServices',
                               cddRessusAbiAtendim: cddRessusAbiAtendim},
                              {}, 
                              callback);
        }

        factory.saveAttendanceImpugnationMotive = function(cddRessusAbiAtendim, idTipoPedido, desMemoCalculo, tmpAbiMotivo, tmpRessusAbiProced, tmpAbiJustif, logConclude, callback) {
            factory.TOTVSPost({method: 'saveAttendanceImpugnationMotive', 
                                   cddRessusAbiAtendim: cddRessusAbiAtendim, idTipoPedido: idTipoPedido, desMemoCalculo: desMemoCalculo, logFinalizaAnalise:logConclude},
                                  {tmpAbiMotivo: tmpAbiMotivo, 
                                   tmpRessusAbiProced: tmpRessusAbiProced,
                                   tmpAbiJustif: tmpAbiJustif},
                                  callback);
        }

         factory.reprocessarAtendimento = function(cddRessusAbiAtendim, callback){

          factory.TOTVSPost({method: 'reprocessarAtendimento',
                             cddRessusAbiAtendim: cddRessusAbiAtendim},
                            {}, 
                            callback);
        }

		    factory.getJustificationImpugnationMotive = function(cddRessusAbiAtendim, cddRessusAbiMotivImpug, cdnNatur, cdnMotiv, callback){
            factory.postWithArray({method: 'getJustificationImpugnationMotive',
                                   cddRessusAbiAtendim: cddRessusAbiAtendim,
                                   cddRessusAbiMotivImpug: cddRessusAbiMotivImpug,
                                   cdnNatur: cdnNatur,
                                   cdnMotiv: cdnMotiv},
                                  {},
                                  callback);
        }

        factory.getAttendanceHistoric = function (cddRessusAbiAtendim,
                                        callback) {
            factory.TOTVSGet({method: 'getAttendanceHistoric',
              cddRessusAbiAtendim: cddRessusAbiAtendim},
                callback);
        };

        factory.generateCSV = function(cddRessusAbiDados, tmpUnselectedAttendance, disclaimers, callback){

            factory.TOTVSPost({method: 'generateCSV',
                                   cddRessusAbiDados:cddRessusAbiDados},
                                  {tmpUnselectedAttendance:tmpUnselectedAttendance,
                                    tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)}, 
                                   callback);
        };

        factory.generateImpugApealBatch = function(cddRessusAbiDados, tmpUnselectedAttendance, disclaimers, callback){

            factory.TOTVSPost({method: 'generateImpugApealBatch',
                                   cddRessusAbiDados:cddRessusAbiDados},
                                  {tmpUnselectedAttendance:tmpUnselectedAttendance,
                                   tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)}, 
                                   callback);
        };
        
        factory.saveImpugnationResult = function(cddRessusAbiAtendim, idiResultImpug, callback){

            factory.TOTVSPost({method: 'saveImpugnationResult',
                               cddRessusAbiAtendim:cddRessusAbiAtendim,
                               idiResultImpug:idiResultImpug},
                              {},
                              callback);
        };

        factory.generateRessusBondDeclaration  = function (cddRessusAbiDados, tmpUnselectedAttendance, disclaimers, callback) {
            factory.TOTVSPost(
              {
                  method: 'generateRessusBondDeclaration',
                  cddRessusAbiDados:cddRessusAbiDados,
                },
                {tmpUnselectedAttendance:tmpUnselectedAttendance,
                 tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                callback);
          };

        return factory;
    }

    index.register.factory('hrs.abiAnalysisAttendance.Factory', abiAnalysisAttendanceFactory);	
});


