define(['index', 
        '/dts/hgp/html/util/dts-utils.js',
        '/dts/hgp/html/hrc-movement/movementAssembler.js'
       ], function(index) {

	// *************************************************************************************
	// *** FACTORIES
	// *************************************************************************************
	movementFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function movementFactory($totvsresource, dtsUtils) {
    
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrc/fchsaumovements/:method', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.getMovementByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.TOTVSPost({method: 'getMovementByFilter', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                               limit: limit, loadNumRegisters: loadNumRegisters},
                              {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                function(result){
                    if(!result && !result.tmpMovement) {
                        callback(result);
                        return;
                    }
                    
                    angular.forEach(result.tmpMovement, function(movement){
                        
                        if(movement.tpMovimento == "PROC"
                        && result.tmpAmbproce.length > 0) {
                            angular.forEach(result.tmpAmbproce,function(ambproce) {
                                  
                                if(movement.cdMovimento == ambproce.cdProcedimentoCompleto) {
                                    movement.movementObject = ambproce;
                                    movement.movementObject.gruProDAO = {};

                                    angular.forEach(result.tmpGruPro, function(gruPro){
                                        if(ambproce.cdGrupoProc == gruPro.cdGrupoProc) {
                                            movement.movementObject.gruProDAO = gruPro;
                                        }
                                    });
                                }
                            });
                        }

                        if(movement.tpMovimento == "INSU"
                        && result.tmpInsumos.length > 0) {
                            angular.forEach(result.tmpInsumos,function(insumo) {
                                if(movement.cdTipoInsumo == insumo.cdTipoInsumo 
                                && movement.cdMovimento  == insumo.cdInsumoCompleto) {
                                    movement.movementObject = insumo;
                                }
                            });
                        }

                        if(movement.tpMovimento == "PACOTE"
                        && result.tmpPaproins.length > 0) {
                            angular.forEach(result.tmpPaproins,function(paproins) {
                                if(movement.idRegistro === paproins.idRegistro) {
                                    movement.movementObject = paproins;
                                }
                            });
                        }
                    });

                    callback(result.tmpMovement);
                });
        };
                
        factory.getMovementByKey = function (code, disclaimers, callback) {
            factory.getMovementByFilter(code, 0, 1, false, disclaimers, 
                function(result){
                    callback(result[0]);
                });
        };

        factory.getPackageWithMovements = function (pack, callback) {
          factory.TOTVSPost({method: 'getPackageWithMovements'},
                            {tmpMovement: [pack], tmpPaproins: [pack.movementObject]}, 
            function(result) {
              var resultAux = {};

              resultAux.cdViaAcesso = 0;              
              resultAux.cdMovimento = result.tmpMovement[0].cdMovimento;
              resultAux.dsMovimento = pack.dsMovimento;
              resultAux.hrRealizacaoFim = result.tmpMovement[0].hrRealizacaoFim;              
              resultAux.vlCobranca = result.tmpMovement[0].vlCobranca;              
              resultAux.vlPagamento = result.tmpMovement[0].vlPagamento;              
              resultAux.qtMovimento = result.qtMovimento;
              resultAux.dtRealizacao = result.tmpMovement[0].dtRealizacao;
              resultAux.hrRealizacao = result.tmpMovement[0].hrRealizacao;
              resultAux.tpTecUtil = parseInt(result.tmpMovement[0].tpTecUtil);
              resultAux.rotulo = result.tmpMovement[0].rotulo;
              resultAux.tpMovimento = 'PACOTE';
              resultAux.paymentTotalValueLabel = '';
              resultAux.chargingTotalValueLabel = '';

              resultAux.movementObject = angular.copy(pack.movementObject);              
              
              resultAux.providers = angular.copy(pack.providers);

              resultAux.packageInputs = [];
              resultAux.packageProcedures = [];

              angular.forEach(result.tmpMovementPackage, function(movementPackage) {
                if(movementPackage.tpMovimento === 'INSU') {
                    resultAux.packageInputs.push(movementPackage);
                    
                    angular.forEach(result.tmpInsumos, function(insumos){                    
                        if(movementPackage.cdTipoInsumo == insumos.cdTipoInsumo
                        && movementPackage.cdMovimento  == insumos.cdInsumoCompleto) {
                            movementPackage.movementObject = angular.copy(insumos);
                        }
                    });
                }else if(movementPackage.tpMovimento === 'PROC') {
                    resultAux.packageProcedures.push(movementPackage);
                    angular.forEach(result.tmpAmbproce, function(ambproce){
                        if(parseInt(movementPackage.cdMovimento) === ambproce.cdProcedimentoCompleto) {
                            movementPackage.movementObject = angular.copy(ambproce);
                            angular.forEach(result.tmpGruPro, function(gruPro){
                                if(gruPro.cdGrupoProc === ambproce.cdGrupoProc) {                          
                                  movementPackage.movementObject.gruProDAO = gruPro;                          
                                }
                            });
                        }
                    });
                }
              });

              callback(resultAux);
            });
        };

        factory.getMovementRestriction = function(cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, cdTipoInsumo, cdInsumo,
                             nrProcesso, nrSeqDigitacao, tpMovimento, callback) {

            factory.TOTVSPost({method: 'getMovementRestriction', cdUnidade: cdUnidade, 
                                  cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                                  nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                                  nrDocSistema: nrDocSistema, cdTipoInsumo: cdTipoInsumo, cdInsumo: cdInsumo,
                                  nrProcesso: nrProcesso, nrSeqDigitacao: nrSeqDigitacao,
                                  tpMovimento: tpMovimento}, {}, callback);
        };

        factory.getDivisionMovementRestriction = function(cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
            nrDocOriginal, nrDocSistema, callback) {

            factory.TOTVSPost({method: 'getDivisionMovementRestriction', cdUnidade: cdUnidade, 
                            cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                            nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                            nrDocSistema: nrDocSistema}, {}, callback);
        };        

        factory.getPackageRestriction = function(cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, movements, callback) {
            factory.TOTVSPost({method: 'getPackageRestriction', cdUnidade: cdUnidade, 
                                  cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                                  nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                                  nrDocSistema: nrDocSistema}, 
                              {tmpMovementKey: movements}, 
                                  callback);
        };

        factory.applyManualRestrictionPackage = function (cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, cdTipoCob, cdTipoPagamento, movements,
                             restriction, callback) {

            factory.TOTVSPost({method: 'applyManualRestrictionPackage', cdUnidade: cdUnidade, 
                                  cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                                  nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                                  nrDocSistema: nrDocSistema, cdTipoCob: cdTipoCob, cdTipoPagamento: cdTipoPagamento},
                              {tmpMovementKey: movements,
                               tmpRestriction: restriction},
                              callback);
        };

        factory.applyManualRestrictionProcedure = function (cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, nrProcesso, nrSeqDigitacao, cdTipoCob, cdTipoPagamento,
                             lgValidacaoPosterior, restriction, callback) {
            factory.TOTVSPost({method: 'applyManualRestrictionProcedure', cdUnidade: cdUnidade, 
                               cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                               nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                               nrDocSistema: nrDocSistema, nrProcesso: nrProcesso, nrSeqDigitacao: nrSeqDigitacao,
                               cdTipoCob: cdTipoCob, cdTipoPagamento: cdTipoPagamento, lgValidacaoPosterior: lgValidacaoPosterior},
                              {tmpRestriction: restriction},
                                  callback);
        };

        factory.applyManualRestrictionInput = function (cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, nrProcesso, nrSeqDigitacao, cdTipoInsumo, cdInsumo, 
                             cdTipoCob, cdTipoPagamento, lgValidacaoPosterior,
                             restriction, callback) {
            factory.TOTVSPost({method: 'applyManualRestrictionInput', cdUnidade: cdUnidade, 
                               cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                               nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                               nrDocSistema: nrDocSistema, nrProcesso: nrProcesso, nrSeqDigitacao: nrSeqDigitacao,
                               cdTipoInsumo: cdTipoInsumo, cdInsumo: cdInsumo, cdTipoCob: cdTipoCob, 
                               cdTipoPagamento: cdTipoPagamento, lgValidacaoPosterior: lgValidacaoPosterior},
                              {tmpRestriction: restriction},
                                  callback);
        };

        factory.getMovementsPercentages = function (filters, movements, callback) {
            factory.postWithArray({method: 'getMovementsPercentages'},
                              {tmpFilterValue: dtsUtils.mountTmpFilterValue(filters),
                               tmpMovement: movements},
               function(result){
                angular.forEach(movements, function(movto){                              
                  movto.fatoresRedAcres = [];
                  angular.forEach(result.tmpProPerc, function(proPerc){
                      if(movto.cdEspAmb       == proPerc.cdEspAmb
                      && movto.cdGrupoProcAmb == proPerc.cdGrupoProcAmb
                      && movto.cdProcedimento == proPerc.cdProcedimento
                      && movto.dvProcedimento == proPerc.dvProcedimento){

                          movto.fatoresRedAcres = proPerc; 
                      }
                  });
                });

                callback(movements);
               });
        };

        factory.applyRestrictionValidationPackage = function (cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, cdTipoCob, cdTipoPagamento, lgValidacaoPosterior, movements, callback) {
            factory.TOTVSPost({method: 'applyRestrictionValidationPackage', cdUnidade: cdUnidade, 
                                  cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                                  nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                                  nrDocSistema: nrDocSistema, cdTipoCob: cdTipoCob, cdTipoPagamento: cdTipoPagamento,
                                  lgValidacaoPosterior: lgValidacaoPosterior},
                              {tmpMovementKey: movements}, callback);
        };

        factory.applyRestrictionValidationProcedure = function (cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, nrProcesso, nrSeqDigitacao,
                             cdTipoCob, cdTipoPagamento, lgValidacaoPosterior, callback) {
            factory.TOTVSPost({method: 'applyRestrictionValidationProcedure', cdUnidade: cdUnidade, 
                               cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                               nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                               nrDocSistema: nrDocSistema, nrProcesso: nrProcesso, nrSeqDigitacao: nrSeqDigitacao,
                               cdTipoCob: cdTipoCob, cdTipoPagamento: cdTipoPagamento, lgValidacaoPosterior: lgValidacaoPosterior},
                              {}, callback);
        };

        factory.applyRestrictionValidationInput = function (cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, nrProcesso, nrSeqDigitacao, cdTipoInsumo, cdInsumo,
                             cdTipoCob, cdTipoPagamento, lgValidacaoPosterior, callback) {
            factory.TOTVSPost({method: 'applyRestrictionValidationInput', cdUnidade: cdUnidade, 
                               cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                               nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                               nrDocSistema: nrDocSistema, nrProcesso: nrProcesso, nrSeqDigitacao: nrSeqDigitacao,
                               cdTipoInsumo: cdTipoInsumo, cdInsumo: cdInsumo, cdTipoCob: cdTipoCob, 
                               cdTipoPagamento: cdTipoPagamento, lgValidacaoPosterior: lgValidacaoPosterior},
                              {}, callback);
        };
        
        factory.getDocumentProceduresByFilter = function(cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, limit, filters, orders, pageOffset, tmpMovementKey, callback) {
            factory.TOTVSPost({method: 'getDocumentProceduresByFilter', cdUnidade: cdUnidade, 
                            cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                            nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                            nrDocSistema: nrDocSistema, pageOffset: pageOffset, limit:limit}, 
                            {tmpMovementKey: tmpMovementKey, 
                             tmpFilterValue: dtsUtils.mountTmpFilterValue(filters),
                             tmpOrderFields: dtsUtils.mountTmpOrderFields(orders)},
                function(result){
                    if(!result || !result.tmpMovementProcedure)
                        callback(result);
                    
                    movementAssembler.assembleTmpMovementProcedure(result);
                    
                    callback(result);
                });
        };
        
        factory.getDocumentInputsByFilter = function(cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, limit, filters, orders, pageOffset, tmpMovementKey, callback) {
            factory.TOTVSPost({method: 'getDocumentInputsByFilter', cdUnidade: cdUnidade, 
                            cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                            nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                            nrDocSistema: nrDocSistema, pageOffset: pageOffset, limit:limit}, 
                        {tmpMovementKey: tmpMovementKey,
                         tmpFilterValue: dtsUtils.mountTmpFilterValue(filters),
                         tmpOrderFields: dtsUtils.mountTmpOrderFields(orders)},
                function(result){
                    if(!result || !result.tmpMovementInput)
                        callback(result);
                    
                    movementAssembler.assembleTmpMovementInput(result);
                    
                    callback(result);
                });
        };
        
        factory.getDocumentPackagesByFilter = function(
                        cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal, nrDocOriginal, nrDocSistema, 
                        cdUnidadePrincipal, cdPrestadorPrincipal, cdModalidade, cdPlano, cdTipoPlano,
                        limit, filters, orders, pageOffset, tmpMovementKey, callback) {
            factory.TOTVSPost({method: 'getDocumentPackagesByFilter', cdUnidade: cdUnidade, 
                            cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                            nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                            nrDocSistema: nrDocSistema, 
                            cdUnidadePrincipal: cdUnidadePrincipal,
                            cdPrestadorPrincipal: cdPrestadorPrincipal,
                            cdModalidade: cdModalidade, cdPlano: cdPlano,             
                            cdTipoPlano: cdTipoPlano,           
                            pageOffset: pageOffset, limit:limit},
                        {tmpMovementKey: tmpMovementKey,
                         tmpFilterValue: dtsUtils.mountTmpFilterValue(filters),
                         tmpOrderFields: dtsUtils.mountTmpOrderFields(orders)}, 
                function(result){
                    if(!result || !result.tmpMovementPackage)
                        callback(result);
                    
                    movementAssembler.assembleTmpMovementPackage(result);
                    
                    callback(result);
                });
        };

        factory.getTabelasProcedimento = function (cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, nrProcesso, nrSeqDigitacao, callback) {
            factory.postWithArray({method: 'getTabelasProcedimento', cdUnidade: cdUnidade, 
                               cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                               nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                               nrDocSistema: nrDocSistema, nrProcesso: nrProcesso, nrSeqDigitacao: nrSeqDigitacao},
                              {}, callback);
        };

        factory.getTabelasInsumo = function (cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, nrProcesso, nrSeqDigitacao, cdTipoInsumo, cdInsumo, callback) {
            factory.postWithArray({method: 'getTabelasInsumo', cdUnidade: cdUnidade, 
                               cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                               nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                               nrDocSistema: nrDocSistema, nrProcesso: nrProcesso, nrSeqDigitacao: nrSeqDigitacao,
                               cdTipoInsumo: cdTipoInsumo, cdInsumo: cdInsumo},
                              {}, callback);
        };

        factory.getValoresProcedimento = function (cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, nrProcesso, nrSeqDigitacao, callback) {
            factory.postWithArray({method: 'getValoresProcedimento', cdUnidade: cdUnidade, 
                               cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                               nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                               nrDocSistema: nrDocSistema, nrProcesso: nrProcesso, nrSeqDigitacao: nrSeqDigitacao},
                              {}, callback);
        };

        factory.getValoresInsumo = function (cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, nrProcesso, nrSeqDigitacao, cdTipoInsumo, cdInsumo, callback) {
            factory.postWithArray({method: 'getValoresInsumo', cdUnidade: cdUnidade, 
                               cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                               nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                               nrDocSistema: nrDocSistema, nrProcesso: nrProcesso, nrSeqDigitacao: nrSeqDigitacao,
                               cdTipoInsumo: cdTipoInsumo, cdInsumo: cdInsumo},
                              {}, callback);
        };

        factory.getDadosPtuProcedimento = function (cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, nrProcesso, nrSeqDigitacao, callback) {
            factory.postWithArray({method: 'getDadosPtuProcedimento', cdUnidade: cdUnidade, 
                               cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                               nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                               nrDocSistema: nrDocSistema, nrProcesso: nrProcesso, nrSeqDigitacao: nrSeqDigitacao},
                              {}, callback);
        };

        factory.getDadosPtuInsumo = function (cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, nrProcesso, nrSeqDigitacao, cdTipoInsumo, cdInsumo, callback) {
            factory.postWithArray({method: 'getDadosPtuInsumo', cdUnidade: cdUnidade, 
                               cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                               nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                               nrDocSistema: nrDocSistema, nrProcesso: nrProcesso, nrSeqDigitacao: nrSeqDigitacao,
                               cdTipoInsumo: cdTipoInsumo, cdInsumo: cdInsumo},
                              {}, callback);
        };

        factory.getPrestadoresProcedimento = function (cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, nrProcesso, nrSeqDigitacao, callback) {
            factory.postWithArray({method: 'getPrestadoresProcedimento', cdUnidade: cdUnidade, 
                               cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                               nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                               nrDocSistema: nrDocSistema, nrProcesso: nrProcesso, nrSeqDigitacao: nrSeqDigitacao},
                              {}, callback);
        };

        factory.getPrestadoresInsumo = function (cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, nrProcesso, nrSeqDigitacao, cdTipoInsumo, cdInsumo, callback) {
            factory.postWithArray({method: 'getPrestadoresInsumo', cdUnidade: cdUnidade, 
                               cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                               nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                               nrDocSistema: nrDocSistema, nrProcesso: nrProcesso, nrSeqDigitacao: nrSeqDigitacao,
                               cdTipoInsumo: cdTipoInsumo, cdInsumo: cdInsumo},
                              {}, callback);
        };

        factory.getLotesProcedimento = function (cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, nrProcesso, nrSeqDigitacao, callback) {
            factory.TOTVSPost({method: 'getLotesProcedimento', cdUnidade: cdUnidade, 
                               cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                               nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                               nrDocSistema: nrDocSistema, nrProcesso: nrProcesso, nrSeqDigitacao: nrSeqDigitacao},
                              {}, callback);
        };

        factory.getLotesInsumo = function (cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, nrProcesso, nrSeqDigitacao, cdTipoInsumo, cdInsumo, callback) {
            factory.TOTVSPost({method: 'getLotesInsumo', cdUnidade: cdUnidade, 
                               cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                               nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                               nrDocSistema: nrDocSistema, nrProcesso: nrProcesso, nrSeqDigitacao: nrSeqDigitacao,
                               cdTipoInsumo: cdTipoInsumo, cdInsumo: cdInsumo},
                              {}, callback);
        };

        factory.applyManualRestrictionMultipleMovements = function (cdUnidade, cdUnidadePrestadora, cdTransacao, 
                             nrSerieDocOriginal, nrDocOriginal, nrDocSistema, cdTipoCob, cdTipoPagamento,
                             lgValidacaoPosterior, tmpMovementKey, tmpRestriction, callback) {
            factory.TOTVSPost({method: 'applyManualRestrictionMultipleMovements', cdUnidade: cdUnidade, 
                               cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                               nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                               nrDocSistema: nrDocSistema, cdTipoCob: cdTipoCob, cdTipoPagamento: cdTipoPagamento,
                               lgValidacaoPosterior: lgValidacaoPosterior},
                              {tmpMovementKey: tmpMovementKey, tmpRestriction: tmpRestriction}, callback);
        };
        
        factory.getMovementsFromGuideForRC = function (aaGuiaAtendimento,
                        nrGuiaAtendimento, callback) {
            factory.TOTVSGet({method: 'getMovementsFromGuideForRC',
                                aaGuiaAtendimento: aaGuiaAtendimento,
                                nrGuiaAtendimento: nrGuiaAtendimento},
                function(result){
                    if (!result || !result.tmpMovementProcedure)
                        callback(result);
                    
                    movementAssembler.assembleTmpMovementProcedure(result);
                    movementAssembler.assembleTmpMovementInput(result);
                    movementAssembler.assembleTmpMovementPackage(result);
                    
                    callback({tmpMovementProcedure: result.tmpMovementProcedure,
                              tmpMovementInput: result.tmpMovementInput,
                              tmpMovementPackage: result.tmpMovementPackage});
                });
        };

        factory.processRestrictionsProcedure = function (cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, nrProcesso, nrSeqDigitacao, cdTipoCob, cdTipoPagamento,
                             cdCodGloPrincipal, cdClasseErroPrincipal, lgValidacaoPosterior, maintenanceType, restriction, removedRestrictions, callback) {
            factory.TOTVSPost({method: 'processRestrictionsProcedure', cdUnidade: cdUnidade, 
                               cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                               nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                               nrDocSistema: nrDocSistema, nrProcesso: nrProcesso, nrSeqDigitacao: nrSeqDigitacao,
                               cdTipoCob: cdTipoCob, cdTipoPagamento: cdTipoPagamento, cdCodGloPrincipal: cdCodGloPrincipal,
                               cdClasseErroPrincipal: cdClasseErroPrincipal, lgValidacaoPosterior: lgValidacaoPosterior,
                               inTipoManutencao: maintenanceType},
                              {tmpAddedRestrictions: restriction, tmpRemovedRestrictions:removedRestrictions},
                                  callback);
        };

        factory.processRestrictionsInput = function (cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, nrProcesso, nrSeqDigitacao, cdTipoInsumo, cdInsumo, cdTipoCob, cdTipoPagamento, 
                             cdCodGloPrincipal, cdClasseErroPrincipal, lgValidacaoPosterior, maintenanceType, restriction, removedRestrictions, callback) {
            factory.TOTVSPost({method: 'processRestrictionsInput', cdUnidade: cdUnidade, 
                               cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                               nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                               nrDocSistema: nrDocSistema, nrProcesso: nrProcesso, nrSeqDigitacao: nrSeqDigitacao,
                               cdTipoInsumo: cdTipoInsumo, cdInsumo: cdInsumo, cdTipoCob: cdTipoCob, 
                               cdTipoPagamento: cdTipoPagamento, cdCodGloPrincipal: cdCodGloPrincipal,
                               cdClasseErroPrincipal: cdClasseErroPrincipal, lgValidacaoPosterior: lgValidacaoPosterior,
                               inTipoManutencao: maintenanceType},
                              {tmpAddedRestrictions: restriction, tmpRemovedRestrictions:removedRestrictions},
                                  callback);
        };

        factory.processRestrictionsPackage = function (cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, cdTipoCob, cdTipoPagamento,
                             cdCodGloPrincipal, cdClasseErroPrincipal, lgValidacaoPosterior, maintenanceType,
                             movements, restriction, removedRestrictions, callback) {

            factory.TOTVSPost({method: 'processRestrictionsPackage', cdUnidade: cdUnidade, 
                                  cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                                  nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                                  nrDocSistema: nrDocSistema, cdTipoCob: cdTipoCob, cdTipoPagamento: cdTipoPagamento,
                                  cdCodGloPrincipal: cdCodGloPrincipal, cdClasseErroPrincipal: cdClasseErroPrincipal,
                                  lgValidacaoPosterior: lgValidacaoPosterior,inTipoManutencao: maintenanceType},
                              {tmpMovementKey: movements, tmpAddedRestrictions: restriction, 
                               tmpRemovedRestrictions:removedRestrictions},
                              callback);
        };

        factory.getMultipleMovementsRestrictions = function (cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, filters, movementsList, callback) {

            factory.TOTVSPost({method: 'getMultipleMovementsRestrictions', cdUnidade: cdUnidade, 
                                  cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                                  nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                                  nrDocSistema: nrDocSistema},
                              {tmpFilterValue: dtsUtils.mountTmpFilterValue(filters),
                               tmpMovementKey: movementsList}, 
                              function(result){
                                  if (!result || !result.tmpCodiglos)
                                      callback(result);

                                  var docrecon = {};
                                  for (var i = result.tmpCodiglos.length - 1; i >= 0; i--) {
                                      
                                      docrecon = {};
                                      for (var j = result.tmpMovrcglo.length - 1; j >= 0; j--) {
                                          if(result.tmpCodiglos[i].cdCodGlo     == result.tmpMovrcglo[j].cdCodGlo
                                          && result.tmpCodiglos[i].cdClasseErro == result.tmpMovrcglo[j].cdClasseErro){

                                              if (result.tmpCodiglos[i].documentos == undefined){
                                                  result.tmpCodiglos[i].documentos = [];

                                                  docrecon.cdUnidade           = result.tmpMovrcglo[j].cdUnidade;
                                                  docrecon.cdUnidadePrestadora = result.tmpMovrcglo[j].cdUnidadePrestadora;
                                                  docrecon.cdTransacao         = result.tmpMovrcglo[j].cdTransacao;
                                                  docrecon.nrSerieDocOriginal  = result.tmpMovrcglo[j].nrSerieDocOriginal;
                                                  docrecon.nrDocOriginal       = result.tmpMovrcglo[j].nrDocOriginal;  
                                                  docrecon.nrDocSistema        = result.tmpMovrcglo[j].nrDocSistema;
                                                  docrecon.movimentos = [];

                                                  result.tmpCodiglos[i].documentos.push(angular.copy(docrecon));
                                              }

                                              for (var h = result.tmpMovementResult.length - 1; h >= 0; h--) {
                                                if(result.tmpMovementResult[h].cdUnidade           == result.tmpMovrcglo[j].cdUnidade
                                                && result.tmpMovementResult[h].cdUnidadePrestadora == result.tmpMovrcglo[j].cdUnidadePrestadora 
                                                && result.tmpMovementResult[h].cdTransacao         == result.tmpMovrcglo[j].cdTransacao
                                                && result.tmpMovementResult[h].nrSerieDocOriginal  == result.tmpMovrcglo[j].nrSerieDocOriginal
                                                && result.tmpMovementResult[h].nrDocOriginal       == result.tmpMovrcglo[j].nrDocOriginal   
                                                && result.tmpMovementResult[h].nrDocSistema        == result.tmpMovrcglo[j].nrDocSistema
                                                && result.tmpMovementResult[h].nrProcesso          == result.tmpMovrcglo[j].nrProcesso   
                                                && result.tmpMovementResult[h].nrSeqDigitacao      == result.tmpMovrcglo[j].nrSeqDigitacao){
                                                    result.tmpCodiglos[i].documentos[0].movimentos.push(angular.copy(result.tmpMovementResult[h]));  
                                                }
                                              }
                                              
                                          }
                                      }
                                  } 

                                  callback(result.tmpCodiglos);
                              });
        };


        factory.processRestrictionsMultiple = function (cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, cdTipoCob, cdTipoPagamento, lgValidacaoPosterior,
                             movementsList, tmpRemovedRestrictions, callback) {

            factory.TOTVSPost({method: 'processRestrictionsMultiple', cdUnidade: cdUnidade, 
                                  cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                                  nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                                  nrDocSistema: nrDocSistema, cdTipoCob: cdTipoCob, cdTipoPagamento: cdTipoPagamento,
                                  lgValidacaoPosterior: lgValidacaoPosterior},
                              {tmpMovementKey: movementsList, tmpRemovedRestrictions: tmpRemovedRestrictions},
                               callback);

        };

        factory.applyRestrictionValidationMultiple = function (cdUnidade, cdUnidadePrestadora, cdTransacao, 
                             nrSerieDocOriginal, nrDocOriginal, nrDocSistema, cdTipoCob, cdTipoPagamento,
                             tmpMovementKey, callback) {
            factory.TOTVSPost({method: 'applyRestrictionValidationMultiple', cdUnidade: cdUnidade, 
                               cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                               nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                               nrDocSistema: nrDocSistema, cdTipoCob: cdTipoCob, cdTipoPagamento: cdTipoPagamento},
                              {tmpMovementKey: tmpMovementKey}, callback);
        };

        factory.getValoresCobrancaProcedimento = function (cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, nrProcesso, nrSeqDigitacao, callback) {
            factory.postWithArray({method: 'getValoresCobrancaProcedimento', cdUnidade: cdUnidade, 
                                   cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                                   nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                                   nrDocSistema: nrDocSistema, nrProcesso: nrProcesso, nrSeqDigitacao: nrSeqDigitacao},
                                  {}, callback);
        };

        factory.getValoresCobrancaInsumo = function (cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, nrProcesso, nrSeqDigitacao, cdTipoInsumo, cdInsumo, callback) {
            factory.postWithArray({method: 'getValoresCobrancaInsumo', cdUnidade: cdUnidade, 
                                   cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                                   nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                                   nrDocSistema: nrDocSistema, nrProcesso: nrProcesso, nrSeqDigitacao: nrSeqDigitacao,
                                   cdTipoInsumo: cdTipoInsumo, cdInsumo: cdInsumo},
                                  {}, callback);
        };

        factory.getDadosTissProcedimento = function (cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, nrProcesso, nrSeqDigitacao, callback) {
            factory.postWithArray({method: 'getDadosTissProcedimento', cdUnidade: cdUnidade, 
                               cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                               nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                               nrDocSistema: nrDocSistema, nrProcesso: nrProcesso, nrSeqDigitacao: nrSeqDigitacao},
                              {}, callback);
        };

        factory.getDadosTissInsumo = function (cdUnidade, cdUnidadePrestadora, cdTransacao, nrSerieDocOriginal,
                             nrDocOriginal, nrDocSistema, nrProcesso, nrSeqDigitacao, cdTipoInsumo, cdInsumo, callback) {
            factory.postWithArray({method: 'getDadosTissInsumo', cdUnidade: cdUnidade, 
                               cdUnidadePrestadora: cdUnidadePrestadora, cdTransacao: cdTransacao,
                               nrSerieDocOriginal: nrSerieDocOriginal, nrDocOriginal: nrDocOriginal,
                               nrDocSistema: nrDocSistema, nrProcesso: nrProcesso, nrSeqDigitacao: nrSeqDigitacao,
                               cdTipoInsumo: cdTipoInsumo, cdInsumo: cdInsumo},
                              {}, callback);
        };

        return factory;
  }

  index.register.factory('hrc.movement.Factory', movementFactory);    
});
