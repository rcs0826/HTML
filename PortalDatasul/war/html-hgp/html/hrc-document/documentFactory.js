define(['index', 
        '/dts/hgp/html/hvp-beneficiary/beneficiaryAssembler.js',
        '/dts/hgp/html/hrc-movement/movementAssembler.js'
       ], function(index) {

	// *************************************************************************************
	// *** FACTORIES
	// *************************************************************************************
	documentFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function documentFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrc/fchsaudocuments/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.getDocumentsByFilter = function (
            simpleFilterValue, pageOffset, limit, 
            loadNumRegisters, disclaimers, orders, callback, headers) {
            factory.parseHeaders(headers);
            factory.TOTVSPost({method: 'getDocumentsByFilter',
                    simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                    limit: limit, loadNumRegisters: loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers),
                     tmpOrderFields: dtsUtils.mountTmpOrderFields(orders)},
                function(result){
                    if(!result || !result.tmpDocrecon)
                        callback(result);

                    //result.tmpDocrecon = movementAssembler.assembleDocument(result);
                    assembledResult = movementAssembler.assembleDocument(result);
                    result.tmpDocrecon = assembledResult.tmpDocrecon;
                    result.tmpMovementProcedure = assembledResult.tmpMovementProcedure;
                    result.tmpMovementInput = assembledResult.tmpMovementInput;
                    result.tmpMovementPackage = assembledResult.tmpMovementPackage;
                    callback(result);
                }, headers);
        };
                
        factory.getInvoice = function (cdUnidadePrestadora, cdPrestador, aaFatura, cdSerieNf, codFaturAp, 
                                        callback) {
            factory.TOTVSQuery({method: 'getInvoice',
                              cdUnidadePrestadora: cdUnidadePrestadora, 
                              cdPrestador: cdPrestador, 
                              aaFatura: aaFatura, 
                              cdSerieNf: cdSerieNf,
                              codFaturAp: codFaturAp},
                                callback);
        };

        factory.getDocumentValues = function (filterValue, tmpUnselectedDocuments, callback) {
            factory.postWithArray({method: 'getDocumentValues'},
                            {tmpFilterValue: dtsUtils.mountTmpFilterValue(filterValue),
                             tmpUnselectedDocuments: tmpUnselectedDocuments}, callback);
        };
                
        factory.applyManualRestriction = function (documentFilters, cdTipoCob, cdTipoPagamento, lgValidacaoPosterior, restriction, 
                                                   tmpUnselectedDocuments, callback) {
            factory.TOTVSPost({method: 'applyManualRestriction', cdTipoCob: cdTipoCob, cdTipoPagamento: cdTipoPagamento, 
                               lgValidacaoPosterior: lgValidacaoPosterior},
                           {tmpFilterValue: dtsUtils.mountTmpFilterValue(documentFilters), tmpRestriction: restriction,
                            tmpUnselectedDocuments: tmpUnselectedDocuments}, callback);
        };
                
        factory.removeDocuments = function (documentList, tmpUnselectedDocuments, callback) {
            factory.TOTVSPost({method: 'removeDocuments'},
                           {tmpFilterValue: dtsUtils.mountTmpFilterValue(documentList), 
                            tmpUnselectedDocuments: tmpUnselectedDocuments}, callback);
        };
                
        factory.releaseDocuments = function (documentList, parametersList, tmpUnselectedDocuments, callback) {
            factory.TOTVSPost({method: 'releaseDocuments'},
                           {tmpFilterValue: dtsUtils.mountTmpFilterValue(documentList), 
                            tmpFilterValueAux: dtsUtils.mountTmpFilterValue(parametersList),
                            tmpUnselectedDocuments: tmpUnselectedDocuments}, callback); 
        };
        
        factory.batchReleaseDocuments = function (documentList, parametersList, tmpUnselectedDocuments, callback) {
            factory.TOTVSPost({method: 'batchReleaseDocuments'},
                           {tmpFilterValue: dtsUtils.mountTmpFilterValue(documentList), 
                            tmpFilterValueAux: dtsUtils.mountTmpFilterValue(parametersList),
                            tmpUnselectedDocuments: tmpUnselectedDocuments}, callback); 
        };

        factory.unreleaseDocuments = function (documentList, parametersList, tmpUnselectedDocuments, callback) {
            factory.TOTVSPost({method: 'unreleaseDocuments'},
                           {tmpFilterValue: dtsUtils.mountTmpFilterValue(documentList), 
                            tmpFilterValueAux: dtsUtils.mountTmpFilterValue(parametersList),
                            tmpUnselectedDocuments: tmpUnselectedDocuments}, callback); 
        };
        
        factory.batchUnreleaseDocuments = function (documentList, parametersList, tmpUnselectedDocuments, callback) {
            factory.TOTVSPost({method: 'batchUnreleaseDocuments'},
                           {tmpFilterValue: dtsUtils.mountTmpFilterValue(documentList), 
                            tmpFilterValueAux: dtsUtils.mountTmpFilterValue(parametersList),
                            tmpUnselectedDocuments: tmpUnselectedDocuments}, callback); 
        };
                
        factory.saveDocument = function (document, controller, callback) {
            var progressTables = { tmpDocumentoRestaurado: {},
                                   tmpDocrecon: [],
                                   tmpMovement: [],
                                   tmpMovementProvider: [],
                                   tmpMovementKey: document.prestRemovidos};
            
            progressTables.tmpDocrecon.push(document);
            
            var registerIdAux = 0;
            angular.forEach(document.procedimentos, function(movto){
                registerIdAux++;
                movto.idRegistro = registerIdAux;
                progressTables.tmpMovement.push(movto);
                
                angular.forEach(movto.providers,function(prest){
                    prest.idRegistroMovto = movto.idRegistro;
                    progressTables.tmpMovementProvider.push(prest);
                });
            });
            
            angular.forEach(document.insumos, function(movto){
                registerIdAux++;
                movto.idRegistro = registerIdAux;
                progressTables.tmpMovement.push(movto);
                
                angular.forEach(movto.providers,function(prest){
                    prest.idRegistroMovto = movto.idRegistro;
                    progressTables.tmpMovementProvider.push(prest);
                });
            });
            
            angular.forEach(document.pacotes, function(movto){
                registerIdAux++;
                movto.idRegistro = registerIdAux;
                progressTables.tmpMovement.push(movto);
                
                angular.forEach(movto.packageProcedures, function(packageMovto){
                    registerIdAux++;
                    packageMovto.idRegistro       = registerIdAux;
                    packageMovto.idRegistroPacote = movto.idRegistro;
                    progressTables.tmpMovement.push(packageMovto);

                    angular.forEach(packageMovto.providers,function(prest){
                        prest.idRegistroMovto = packageMovto.idRegistro;
                        progressTables.tmpMovementProvider.push(prest);
                    });
                    
                });

                angular.forEach(movto.packageInputs, function(packageMovto){
                    registerIdAux++;
                    packageMovto.idRegistro       = registerIdAux;
                    packageMovto.idRegistroPacote = movto.idRegistro;
                    progressTables.tmpMovement.push(packageMovto);

                    angular.forEach(packageMovto.providers,function(prest){
                        prest.idRegistroMovto = packageMovto.idRegistro;
                        progressTables.tmpMovementProvider.push(prest);
                    });
                });
            });

            progressTables.jsonDocrecon = JSON.stringify(controller);
            
            factory.TOTVSPost({method: 'saveDocument'}, progressTables, callback);
        };
                
        factory.batchApplyReturnVisitTolerance = function (documentList, parametersList, callback) {
             factory.TOTVSPost({method: 'batchApplyReturnVisitTolerance'},
                           {tmpFilterValue: dtsUtils.mountTmpFilterValue(documentList), 
                            tmpFilterValueAux: dtsUtils.mountTmpFilterValue(parametersList)}, callback);
        };     
                
        factory.prepareDataToDocumentWindow = function (cdUnidade,
                        cdUnidadePrestadora, 
                        cdTransacao,
                        nrSerieDocOriginal,
                        nrDocOriginal,
                        nrDocSistema, callback) {
            factory.TOTVSGet({method: 'prepareDataToDocumentWindow',
                                cdUnidade: cdUnidade,
                                cdUnidadePrestadora: cdUnidadePrestadora, 
                                cdTransacao: cdTransacao,
                                nrSerieDocOriginal: nrSerieDocOriginal,
                                nrDocOriginal: nrDocOriginal,
                                nrDocSistema: nrDocSistema},
                function(result){
                    if(!result || !result.tmpDocrecon)
                        callback(result);
                    
                    result.tmpDocrecon[0].procedimentos = result.tmpMovementProcedure;
                    result.tmpDocrecon[0].insumos       = result.tmpMovementInput;
                    result.tmpDocrecon[0].pacotes       = result.tmpMovementPackage;
                    
                    movementAssembler.assembleTmpMovementProcedure(result);
                    movementAssembler.assembleTmpMovementInput(result);
                    movementAssembler.assembleTmpMovementPackage(result);
                    
                    beneficiaryAssembler.assembleTmpUsuario(result);
                    
                    callback(result);
                });
        };


        factory.prepareDataToDocumentNoticeEventsWindow = function (cdSeqHistor,cdSeqNotice, callback) {
                factory.TOTVSGet({method: 'prepareDataToDocumentNoticeEventsWindow',
                    cdSeqHistor: cdSeqHistor,cdSeqNotice:cdSeqNotice},
                    function(result){
                        if(!result || !result.tmpDocrecon)
                            callback(result);
                        
                        result.tmpDocrecon[0].procedimentos = result.tmpMovementProcedure;
                        result.tmpDocrecon[0].insumos       = result.tmpMovementInput;
                        result.tmpDocrecon[0].pacotes       = result.tmpMovementPackage;
                        
                        movementAssembler.assembleTmpMovementProcedure(result);
                        movementAssembler.assembleTmpMovementInput(result);
                        movementAssembler.assembleTmpMovementPackage(result);
                        
                        beneficiaryAssembler.assembleTmpUsuario(result);
                        
                        callback(result);
                    });
                };


        factory.applyRestrictionValidationMultiple = function (disclaimers, lgConsideraOutrasGlosas, lgRevalidacao, 
                            cdTipoCob, cdTipoPagamento, tmpCodiglos, tmpUnselectedDocuments, callback) {
            factory.TOTVSPost({method: 'applyRestrictionValidationMultiple', lgConsideraOutrasGlosas: lgConsideraOutrasGlosas, 
                               lgRevalidacao: lgRevalidacao, cdTipoCob: cdTipoCob, cdTipoPagamento: cdTipoPagamento} ,
                            {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers), tmpCodiglos : tmpCodiglos,
                             tmpUnselectedDocuments: tmpUnselectedDocuments}, callback);
        };
        
        factory.verifyDocumentEditPermissions = function (cdUnidade, cdUnidadePrestadora, 
                cdTransacao, nrSerieDocOriginal,nrDocOriginal, nrDocSistema,
                                        callback) {

            factory.TOTVSGet({method: 'verifyDocumentEditPermissions',
                              cdUnidade: cdUnidade, 
                              cdUnidadePrestadora: cdUnidadePrestadora, 
                              cdTransacao: cdTransacao, 
                              nrSerieDocOriginal: nrSerieDocOriginal,
                              nrDocOriginal: nrDocOriginal,
                              nrDocSistema: nrDocSistema},
                                callback);
        };
        
        factory.cancelaPedidoRpw = function (cdUnidade,
                                             cdUnidadePrestadora, 
                                             cdTransacao,
                                             nrSerieDocOriginal,
                                             nrDocOriginal,
                                             nrDocSistema, callback) {

            factory.TOTVSGet({method: 'cancelaPedidoRpw',
                              cdUnidade: cdUnidade,
                              cdUnidadePrestadora: cdUnidadePrestadora, 
                              cdTransacao: cdTransacao,
                              nrSerieDocOriginal: nrSerieDocOriginal,
                              nrDocOriginal: nrDocOriginal,
                              nrDocSistema: nrDocSistema}, callback);
        };

        factory.buscaQuantidadeMoedas = function (cdUnidadeBenefPar, cdModalidadePar, 
                nrPropostaPar, cdUnidadePresPar,cdPrestadorPar, cdProcedimentoPar,
                                        callback) {
            factory.TOTVSGet({method: 'buscaQuantidadeMoedas',
                              cdUnidadeBenefPar: cdUnidadeBenefPar, 
                              cdModalidadePar: cdModalidadePar, 
                              nrPropostaPar: nrPropostaPar, 
                              cdUnidadePresPar: cdUnidadePresPar,
                              cdPrestadorPar: cdPrestadorPar,
                              cdProcedimentoPar: cdProcedimentoPar},
                                callback);
        };

        factory.getDocumentsToLink = function (cdUnidade, cdUnidadePrestadora, cdTransacao, 
                nrSerieDocOriginal, nrDocOriginal, nrDocSistema, callback) {
            factory.postWithArray({method: 'getDocumentsToLink',
                                   cdUnidade: cdUnidade, 
                                   cdUnidadePrestadora: cdUnidadePrestadora, 
                                   cdTransacao: cdTransacao, 
                                   nrSerieDocOriginal: nrSerieDocOriginal,
                                   nrDocOriginal: nrDocOriginal,
                                   nrDocSistema: nrDocSistema}, {},
                                    callback);
        };

        factory.linkDocumentsToHospitalization = function (cdUnidade, cdUnidadePrestadora, cdTransacao, 
                nrSerieDocOriginal, nrDocOriginal, nrDocSistema, tmpDocreconResults, callback) {

            factory.postWithArray({method: 'linkDocumentsToHospitalization', cdUnidade: cdUnidade, 
                                   cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao, 
                                   nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal, 
                                   nrDocSistema: nrDocSistema},
                                  {tmpDocreconResults: tmpDocreconResults}, callback);
        };

        factory.linkAllDocuments = function (tmpDocumentKey, tmpDocreconResults, callback) {
            factory.postWithArray({method: 'linkAllDocuments'},
                                  {tmpDocumentKey: tmpDocumentKey, tmpDocreconResults: tmpDocreconResults}, callback);
        };

        factory.batchLinkAllDocuments = function (tmpDocumentKey, tmpDocreconResults, callback) {
            factory.TOTVSPost({method: 'batchLinkAllDocuments'},
                              {tmpDocumentKey: tmpDocumentKey, tmpDocreconResults: tmpDocreconResults}, callback); 
        };

        factory.getLinkedDocuments = function (cdUnidade, cdUnidadePrestadora, cdTransacao, 
                nrSerieDocOriginal, nrDocOriginal, nrDocSistema, callback) {
            factory.postWithArray({method: 'getLinkedDocuments',
                                   cdUnidade: cdUnidade, 
                                   cdUnidadePrestadora: cdUnidadePrestadora, 
                                   cdTransacao: cdTransacao, 
                                   nrSerieDocOriginal: nrSerieDocOriginal,
                                   nrDocOriginal: nrDocOriginal,
                                   nrDocSistema: nrDocSistema}, {},
                                    callback);
        };
                
        factory.undoManualRestriction = function (lgValidacaoPosterior, cdTipoCob, cdTipoPagamento, disclaimers,
                tmpCodiglos, tmpUnselectedDocuments, callback) {
            factory.TOTVSPost({method: 'undoManualRestriction', lgValidacaoPosterior: lgValidacaoPosterior,
                               cdTipoCob: cdTipoCob, cdTipoPagamento: cdTipoPagamento},
                            {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers), tmpCodiglos: tmpCodiglos,
                             tmpUnselectedDocuments: tmpUnselectedDocuments}, callback);
        };

        factory.getDocumentsRestrictions = function(disclaimers, tmpUnselectedDocuments, callback) {
            factory.TOTVSPost({method: 'getDocumentsRestrictions'},
                              {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers),
                               tmpUnselectedDocuments: tmpUnselectedDocuments},
                function(result){

                    if(!result || !result.tmpCodiglos){
                        callback(result);
                    }
                    
                    angular.forEach(result.tmpCodiglos, function(glosa){

                        angular.forEach(result.tmpMovrcglo, function(movrcglo){

                            if(glosa.cdClasseErro == movrcglo.cdClasseErro
                            && glosa.cdCodGlo     == movrcglo.cdCodGlo){

                                if (glosa.documentos == undefined){
                                    glosa.documentos = [];
                                }
                                
                                var docreconAux = undefined;
    
                                for (var i = glosa.documentos.length - 1; i >= 0; i--) {
                                    if(glosa.documentos[i].cdUnidade           == movrcglo.cdUnidade
                                    && glosa.documentos[i].cdUnidadePrestadora == movrcglo.cdUnidadePrestadora 
                                    && glosa.documentos[i].cdTransacao         == movrcglo.cdTransacao
                                    && glosa.documentos[i].nrSerieDocOriginal  == movrcglo.nrSerieDocOriginal
                                    && glosa.documentos[i].nrDocOriginal       == movrcglo.nrDocOriginal   
                                    && glosa.documentos[i].nrDocSistema        == movrcglo.nrDocSistema){
                                        docreconAux = glosa.documentos[i];
                                        break;
                                    }
                                }
    
                                if (docreconAux == undefined){
                                    for (var i = result.tmpDocrecon.length - 1; i >= 0; i--) {
                                        if(result.tmpDocrecon[i].cdUnidade           == movrcglo.cdUnidade
                                        && result.tmpDocrecon[i].cdUnidadePrestadora == movrcglo.cdUnidadePrestadora 
                                        && result.tmpDocrecon[i].cdTransacao         == movrcglo.cdTransacao
                                        && result.tmpDocrecon[i].nrSerieDocOriginal  == movrcglo.nrSerieDocOriginal
                                        && result.tmpDocrecon[i].nrDocOriginal       == movrcglo.nrDocOriginal   
                                        && result.tmpDocrecon[i].nrDocSistema        == movrcglo.nrDocSistema){
                                            docreconAux = angular.copy(result.tmpDocrecon[i]);
                                            glosa.documentos.push(docreconAux);
                                            docreconAux.movimentos = [];
    
                                        }
                                    };
                                }
    
                                var movementAux = undefined;
                                for (var i = docreconAux.movimentos.length - 1; i >= 0; i--) {
                                    if(docreconAux.movimentos[i].cdUnidade           == movrcglo.cdUnidade
                                    && docreconAux.movimentos[i].cdUnidadePrestadora == movrcglo.cdUnidadePrestadora 
                                    && docreconAux.movimentos[i].cdTransacao         == movrcglo.cdTransacao
                                    && docreconAux.movimentos[i].nrSerieDocOriginal  == movrcglo.nrSerieDocOriginal
                                    && docreconAux.movimentos[i].nrDocOriginal       == movrcglo.nrDocOriginal   
                                    && docreconAux.movimentos[i].nrDocSistema        == movrcglo.nrDocSistema
                                    && docreconAux.movimentos[i].nrProcesso          == movrcglo.nrProcesso
                                    && docreconAux.movimentos[i].nrSeqDigitacao      == movrcglo.nrSeqDigitacao){
                                        movementAux = docreconAux.movimentos[i];
                                        break;
                                    }
                                }
    
                                if (movementAux == undefined){
                                    angular.forEach(result.tmpMovementResult, function(movement){
                                        if(movement.cdUnidade           == movrcglo.cdUnidade
                                        && movement.cdUnidadePrestadora == movrcglo.cdUnidadePrestadora 
                                        && movement.cdTransacao         == movrcglo.cdTransacao
                                        && movement.nrSerieDocOriginal  == movrcglo.nrSerieDocOriginal
                                        && movement.nrDocOriginal       == movrcglo.nrDocOriginal   
                                        && movement.nrDocSistema        == movrcglo.nrDocSistema
                                        && movement.nrProcesso          == movrcglo.nrProcesso
                                        && movement.nrSeqDigitacao      == movrcglo.nrSeqDigitacao){
                                            docreconAux.movimentos.push(movement);    
                                        }
                                    });
                                }
                            }
                        });  
                        
                    });
                    
                    callback(result.tmpCodiglos);
                });
        };
        
        factory.simulMovementValorization = function (changedProperty, document, movement, providers, callback) {
            factory.TOTVSPost({method: 'simulMovementValorization', 
                               nmPropriedadeAlterada: changedProperty},
                            {tmpDocrecon: document, 
                             tmpMovement: movement,
                             tmpMovementProvider: providers}, callback);
        };

        factory.informAuditors = function (nmMedicoAuditor, cdCrmMedicoAuditor, cdUfMedicoAuditor,
                                           nmEnfermAuditor, cdCorenEnfermAuditor, cdUfEnfermAuditor,
                                           documentList, parametersList, tmpUnselectedDocuments, callback) {
            factory.TOTVSPost({method: 'informAuditors', nmMedicoAuditor: nmMedicoAuditor, cdCrmMedicoAuditor: cdCrmMedicoAuditor, 
                              cdUfMedicoAuditor: cdUfMedicoAuditor, nmEnfermAuditor: nmEnfermAuditor, 
                              cdCorenEnfermAuditor: cdCorenEnfermAuditor, cdUfEnfermAuditor: cdUfEnfermAuditor},
                           {tmpFilterValue: dtsUtils.mountTmpFilterValue(documentList), 
                            tmpFilterValueAux: dtsUtils.mountTmpFilterValue(parametersList),
                            tmpUnselectedDocuments: tmpUnselectedDocuments}, callback); 
        };

        factory.batchInformAuditors = function (nmMedicoAuditor, cdCrmMedicoAuditor, cdUfMedicoAuditor,
                                                nmEnfermAuditor, cdCorenEnfermAuditor, cdUfEnfermAuditor,
                                                documentList, parametersList, tmpUnselectedDocuments, callback) {
            factory.TOTVSPost({method: 'batchInformAuditors', nmMedicoAuditor: nmMedicoAuditor, cdCrmMedicoAuditor: cdCrmMedicoAuditor, 
                              cdUfMedicoAuditor: cdUfMedicoAuditor, nmEnfermAuditor: nmEnfermAuditor, 
                              cdCorenEnfermAuditor: cdCorenEnfermAuditor, cdUfEnfermAuditor: cdUfEnfermAuditor},
                           {tmpFilterValue: dtsUtils.mountTmpFilterValue(documentList), 
                            tmpFilterValueAux: dtsUtils.mountTmpFilterValue(parametersList),
                            tmpUnselectedDocuments: tmpUnselectedDocuments}, callback); 
        };

        factory.getAllDocumentsToLink = function (pageOffset, limit, loadNumRegisters, disclaimers, tmpUnselectedDocuments, callback) {
            factory.TOTVSPost({method: 'getAllDocumentsToLink', pageOffset: pageOffset, limit: limit,
                                   loadNumRegisters: loadNumRegisters},
                                  {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers), 
                                   tmpUnselectedDocuments: tmpUnselectedDocuments}, callback); 
        };

        factory.hasDocumentWithInvoice = function (disclaimers, callback) {
            factory.TOTVSPost({method: 'hasDocumentWithInvoice'},
                              {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)}, callback);
        };
                
        factory.copyDocument = function (document, copyParameters, 
                                         callback) {
            var progressTables = { tmpDocrecon: [],
                                   tmpParametrosCopiaDocto: [] };
            
            progressTables.tmpDocrecon.push(document);
            progressTables.tmpParametrosCopiaDocto.push(copyParameters);

            factory.TOTVSPost({method: 'copyDocument'}, progressTables, callback);
        };

        factory.printCSV = function (
            simpleFilterValue, pageOffset, limit, 
            loadNumRegisters, disclaimers, orders,columns, callback, headers) {
            factory.parseHeaders(headers);
            factory.TOTVSPost({method: 'printCSV',
                    simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                    limit: limit, loadNumRegisters: loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers),
                     tmpOrderFields: dtsUtils.mountTmpOrderFields(orders),
                     tmpColumnsConfiguration:columns},
                function(result){
                    if(!result || !result.tmpDocrecon)
                        callback(result);
                    
                    callback(result);
                }, headers);
        };
  
        factory.getAllCSVColumns = function (columns,callback) {
            factory.TOTVSPost({method: 'getAllCSVColumns'},{tmpColumnsConfiguration:columns},callback);
        };

        factory.getRpwExecutionErrors = function (document, callback) {
            factory.postWithArray({ method: 'getRpwExecutionErrors',cdUnidade: document.cdUnidade, cdUnidadePrestadora: document.cdUnidadePrestadora, cdTransacao: document.cdTransacao,
            nrSerieDocOriginal: document.nrSerieDocOriginal, nrDocOriginal: document.nrDocOriginal, nrDocSistema: document.nrDocSistema }, {}, function (result) {
                callback(result);
            });
        }

        factory.verificaDocBloqueado = function (document, callback) {
            factory.TOTVSPost({ method: 'verificaDocBloqueado', cdUnidade: document.cdUnidade, cdUnidadePrestadora: document.cdUnidadePrestadora, cdTransacao: document.cdTransacao,
            nrSerieDocOriginal: document.nrSerieDocOriginal, nrDocOriginal: document.nrDocOriginal, nrDocSistema: document.nrDocSistema}, {}, callback);
        };

        factory.releaseDocumentRpw = function (document, callback) {
            factory.TOTVSPost(
                { method: 'releaseDocumentRpw', cdUnidade: document.cdUnidade, cdUnidadePrestadora: document.cdUnidadePrestadora, cdTransacao: document.cdTransacao,
                nrSerieDocOriginal: document.nrSerieDocOriginal, nrDocOriginal: document.nrDocOriginal, nrDocSistema: document.nrDocSistema }, {}, function (result) {
                    callback(result);
                });
        }

        factory.recoverDataRpw = function (cdUnidade,
            cdUnidadePrestadora,
            cdTransacao,
            nrSerieDocOriginal,
            nrDocOriginal,
            nrDocSistema,
            callback) {
            factory.TOTVSGet(
                {
                    method: 'recoverDataRpw',
                    cdUnidade: cdUnidade,
                    cdUnidadePrestadora: cdUnidadePrestadora,
                    cdTransacao: cdTransacao,
                    nrSerieDocOriginal: nrSerieDocOriginal,
                    nrDocOriginal: nrDocOriginal,
                    nrDocSistema: nrDocSistema
                }, function (result) {
                    callback(result);
                });
        }

        return factory;
    }

    index.register.factory('hrc.document.Factory', documentFactory);
});
