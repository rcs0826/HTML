define(['index',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hrc-movement/movementFactory.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER 
    // *************************************************************************************

    movementDetailsController.$inject = ['$rootScope', '$scope', '$modalInstance','$modal' ,
                                         'procInsu', 'hrc.movement.Factory', 'TOTVSEvent']
    function movementDetailsController($rootScope, $scope, $modalInstance,$modal, procInsu, movementFactory, TOTVSEvent) {

        var _self = this;
        $scope.StringTools = StringTools;
        _self.movementTablesDetails = {};
        _self.movementValuesDetails = {};
        _self.movementPtuData = undefined;
        _self.movementTissData = undefined;
        _self.movementLoteImp = undefined;
        _self.movementLoteExp = undefined;
        _self.procInsu = procInsu;
        _self.hasResultValues = false;
        _self.hasResultTables = false;
        _self.hasResultPtuData = false;
        _self.hasResultTissData = false;
        _self.hasResultProvidersDetails = false;
        _self.hasResultLotes = false;
        _self.hasResultCobValues = false;
        // 
        _self.indicUm = "";
        _self.percUm  = 0;
        _self.valorUm = 0.0;
        _self.indicDois = "";
        _self.percDois  = 0;
        _self.valorDois = 0.0; 
        _self.hasPartic = false;      
        _self.performTitle = "Valor";
        
        this.init = function () {
            _self.selectMovementDetailsTab('TAB');            
        };  
        
        this.initValoresPerformance = function () {
            var arrayOfStrings = _self.movementValuesDetails.desPagtoPerformance.split(";");

            if (arrayOfStrings.length > 1){
                _self.hasSecondIndicator = false;
                _self.indicUm = arrayOfStrings[0];
                _self.percUm  = arrayOfStrings[1];
                _self.valorUm = arrayOfStrings[2].replace(",",".");

                if (arrayOfStrings.length > 4) { 
                    _self.hasSecondIndicator = true;
                    _self.indicDois = arrayOfStrings[3];
                    _self.percDois  = arrayOfStrings[4];
                    _self.valorDois = arrayOfStrings[5].replace(",",".");
                }
                
                if (arrayOfStrings[(arrayOfStrings.length - 1)] == 'S') {
                    _self.hasPartic = true;
                    _self.performTitle = "Valor *";
                }
            }
        };

        this.selectMovementDetailsTab = function(tabName){
            switch(tabName){
                case 'TAB':
                    if (_self.hasResultTables == false){
                        if(procInsu.tpMovimento == 'PROC'){
                            movementFactory.getTabelasProcedimento(procInsu.cdUnidade, procInsu.cdUnidadePrestadora, 
                                procInsu.cdTransacao, procInsu.nrSerieDocOriginal, procInsu.nrDocOriginal, procInsu.nrDocSistema,
                                procInsu.nrProcesso, procInsu.nrSeqDigitacao, 
                                function(result){
                                    if(result[0]){
                                        _self.movementTablesDetails = result[0];
                                        _self.hasResultTables = true;
                                    }
                                });
                        }else{
                            movementFactory.getTabelasInsumo(procInsu.cdUnidade, procInsu.cdUnidadePrestadora, 
                                procInsu.cdTransacao, procInsu.nrSerieDocOriginal, procInsu.nrDocOriginal, procInsu.nrDocSistema,
                                procInsu.nrProcesso, procInsu.nrSeqDigitacao, procInsu.cdTipoInsumo, procInsu.cdInsumo,
                                function(result){
                                    if(result[0]){
                                        _self.movementTablesDetails = result[0];
                                        _self.hasResultTables = true;
                                    }
                                });
                        }
                    }
                    break;
                case 'VAL':
                    if (_self.hasResultValues == false){
                        if(procInsu.tpMovimento == 'PROC'){
                            movementFactory.getValoresProcedimento(procInsu.cdUnidade, procInsu.cdUnidadePrestadora, 
                                procInsu.cdTransacao, procInsu.nrSerieDocOriginal, procInsu.nrDocOriginal, procInsu.nrDocSistema,
                                procInsu.nrProcesso, procInsu.nrSeqDigitacao, 
                                function(result){
                                    if(result[0]){
                                        _self.movementValuesDetails = result[0];
                                        _self.hasResultValues = true;
                                        _self.initValoresPerformance();
                                    }
                                });
                        }else{
                            movementFactory.getValoresInsumo(procInsu.cdUnidade, procInsu.cdUnidadePrestadora, 
                                procInsu.cdTransacao, procInsu.nrSerieDocOriginal, procInsu.nrDocOriginal, procInsu.nrDocSistema,
                                procInsu.nrProcesso, procInsu.nrSeqDigitacao, procInsu.cdTipoInsumo, procInsu.cdInsumo,
                                function(result){
                                    if(result[0]){
                                        _self.movementValuesDetails = result[0];
                                        _self.hasResultValues = true;                                        
                                    }
                                });
                        }
                    }
                    break;
                case 'PTU':
                    if (_self.hasResultPtuData == false){
                        if(procInsu.tpMovimento == 'PROC'){
                            movementFactory.getDadosPtuProcedimento(procInsu.cdUnidade, procInsu.cdUnidadePrestadora, 
                                procInsu.cdTransacao, procInsu.nrSerieDocOriginal, procInsu.nrDocOriginal, procInsu.nrDocSistema,
                                procInsu.nrProcesso, procInsu.nrSeqDigitacao, 
                                function(result){
                                    if(result[0]){
                                        _self.movementPtuData = result[0];
                                    }
                                    _self.hasResultPtuData = true;
                                });
                        }else{
                            movementFactory.getDadosPtuInsumo(procInsu.cdUnidade, procInsu.cdUnidadePrestadora, 
                                procInsu.cdTransacao, procInsu.nrSerieDocOriginal, procInsu.nrDocOriginal, procInsu.nrDocSistema,
                                procInsu.nrProcesso, procInsu.nrSeqDigitacao, procInsu.cdTipoInsumo, procInsu.cdInsumo,
                                function(result){
                                    if(result[0]){
                                        _self.movementPtuData = result[0];
                                    }
                                    _self.hasResultPtuData = true;
                                });
                        }
                    }
                    break;
                case 'PREST':
                    _self.getProviders();
                    break;
                case 'LOTE':
                    if(procInsu.tissProviderBatch !== undefined
                    && procInsu.tissProviderBatch !== ''){
                        _self.getProviders();
                        _self.tissProviderBatch = procInsu.tissProviderBatch;
                    }

                    if (_self.hasResultLotes == false){
                        if(procInsu.tpMovimento == 'PROC'){
                            movementFactory.getLotesProcedimento(procInsu.cdUnidade, procInsu.cdUnidadePrestadora, 
                                procInsu.cdTransacao, procInsu.nrSerieDocOriginal, procInsu.nrDocOriginal, procInsu.nrDocSistema,
                                procInsu.nrProcesso, procInsu.nrSeqDigitacao, 
                                function(result){
                                    if(result){
                                        _self.movementLoteImp = result.tmpMovementLoteImp[0];
                                        _self.movementLoteExp = result.tmpMovementLoteExp[0];
                                    }
                                    _self.hasResultLotes = true;
                                });
                        }else{
                            movementFactory.getLotesInsumo(procInsu.cdUnidade, procInsu.cdUnidadePrestadora, 
                                procInsu.cdTransacao, procInsu.nrSerieDocOriginal, procInsu.nrDocOriginal, procInsu.nrDocSistema,
                                procInsu.nrProcesso, procInsu.nrSeqDigitacao, procInsu.cdTipoInsumo, procInsu.cdInsumo,
                                function(result){
                                    if(result){
                                        _self.movementLoteImp = result.tmpMovementLoteImp[0];
                                        _self.movementLoteExp = result.tmpMovementLoteExp[0];
                                    }
                                    _self.hasResultLotes = true;
                                });
                        }
                    }
                    break;
                case 'VALCOB':
                    if (_self.hasResultCobValues == false){
                        if(procInsu.tpMovimento == 'PROC'){
                            movementFactory.getValoresCobrancaProcedimento(procInsu.cdUnidade, procInsu.cdUnidadePrestadora, 
                                procInsu.cdTransacao, procInsu.nrSerieDocOriginal, procInsu.nrDocOriginal, procInsu.nrDocSistema,
                                procInsu.nrProcesso, procInsu.nrSeqDigitacao, 
                                function(result){
                                    if(result){
                                        _self.movementValuesCobDetails = result[0];
                                    }
                                    _self.hasResultCobValues = true;
                                });
                        }else{
                            movementFactory.getValoresCobrancaInsumo(procInsu.cdUnidade, procInsu.cdUnidadePrestadora, 
                                procInsu.cdTransacao, procInsu.nrSerieDocOriginal, procInsu.nrDocOriginal, procInsu.nrDocSistema,
                                procInsu.nrProcesso, procInsu.nrSeqDigitacao, procInsu.cdTipoInsumo, procInsu.cdInsumo,
                                function(result){
                                    if(result){
                                        _self.movementValuesCobDetails = result[0];
                                    }
                                    _self.hasResultCobValues = true;
                                });
                        }
                    }
                    break;
                case 'TISS':
                    if (_self.hasResultTissData == false){
                        if(procInsu.tpMovimento == 'PROC'){
                            movementFactory.getDadosTissProcedimento(procInsu.cdUnidade, procInsu.cdUnidadePrestadora, 
                                procInsu.cdTransacao, procInsu.nrSerieDocOriginal, procInsu.nrDocOriginal, procInsu.nrDocSistema,
                                procInsu.nrProcesso, procInsu.nrSeqDigitacao, 
                                function(result){
                                    if(result[0]){
                                        _self.movementTissData = result[0];
                                    }
                                    _self.hasResultTissData = true;
                                });
                        }else{
                            movementFactory.getDadosTissInsumo(procInsu.cdUnidade, procInsu.cdUnidadePrestadora, 
                                procInsu.cdTransacao, procInsu.nrSerieDocOriginal, procInsu.nrDocOriginal, procInsu.nrDocSistema,
                                procInsu.nrProcesso, procInsu.nrSeqDigitacao, procInsu.cdTipoInsumo, procInsu.cdInsumo,
                                function(result){
                                    if(result[0]){
                                        _self.movementTissData = result[0];
                                    }
                                    _self.hasResultTissData = true;
                                });
                        }
                    }
                    break;                    
            }      
        };

        this.getProviders = function () {
            if (_self.hasResultProvidersDetails == false){
                if(procInsu.tpMovimento == 'PROC'){
                    movementFactory.getPrestadoresProcedimento(procInsu.cdUnidade, procInsu.cdUnidadePrestadora, 
                        procInsu.cdTransacao, procInsu.nrSerieDocOriginal, procInsu.nrDocOriginal, procInsu.nrDocSistema,
                        procInsu.nrProcesso, procInsu.nrSeqDigitacao, 
                        function(result){
                            if(result[0]){
                                _self.movementProvidersDatails = result[0];
                            }
                            _self.hasResultProvidersDetails = true;
                        });
                }else{
                    movementFactory.getPrestadoresInsumo(procInsu.cdUnidade, procInsu.cdUnidadePrestadora, 
                        procInsu.cdTransacao, procInsu.nrSerieDocOriginal, procInsu.nrDocOriginal, procInsu.nrDocSistema,
                        procInsu.nrProcesso, procInsu.nrSeqDigitacao, procInsu.cdTipoInsumo, procInsu.cdInsumo,
                        function(result){
                            if(result[0]){
                                _self.movementProvidersDatails = result[0];
                            }
                            _self.hasResultProvidersDetails = true;
                        });
                }
            }
        }

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        this.cancelPerformanceModal = function (){
            $modal.dismiss('cancel');
        }

        $scope.$watch('$viewContentLoaded', function() {
            _self.init();
        });
    }
    index.register.controller('hrc.movementDetails.Control', movementDetailsController);
});
