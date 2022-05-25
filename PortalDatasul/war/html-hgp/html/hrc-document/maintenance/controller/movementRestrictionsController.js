define(['index',
    '/dts/hgp/html/hrc-document/documentFactory.js',
    '/dts/hgp/html/hrc-document/maintenance/controller/restrictionZoomController.js',
    '/dts/hgp/html/enumeration/billingValidationEnumeration.js',
    '/dts/hgp/html/enumeration/paymentValidationEnumeration.js',
    '/dts/hgp/html/hrc-movement/movementFactory.js',
    '/dts/hgp/html/enumeration/maintenanceTypeEnumeration.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER 
    // *************************************************************************************

    movementRestrictionsController.$inject = ['$rootScope', '$scope', '$modalInstance',
                                           'hrc.document.Factory', 'hrc.movement.Factory',
                                           'hrc.global.Factory', 'disclaimers', 
                                           'document', 'procInsu', 'maintenanceType', 'action', 'TOTVSEvent'];
    function movementRestrictionsController($rootScope, $scope, $modalInstance, documentFactory, 
                                          movementFactory, hrcGlobalFactory, 
                                          disclaimers, document, procInsu, maintenanceType, action, TOTVSEvent) {

        var _self = this;
        _self.documentKey = null;
        _self.manualRestriction = {};
        _self.restrictionsList = [];
        _self.divisionMovementRestrictionsList = [];
        _self.restriction = {};
        _self.removedRestrictions = [];
        _self.procInsu = procInsu;
        _self.action = action;

        _self.qtdeGlosaManual = 0;

        var lgGlosaManual = false;
        var lgAlterouGlosaPrincipal = false;
        _self.manualRestrictionAdd = undefined;

        $scope.BILLING_VALIDATION_ENUM = BILLING_VALIDATION_ENUM;
        $scope.PAYMENT_VALIDATION_ENUM = PAYMENT_VALIDATION_ENUM;
        
        _self.filters = {dtLimite     : new Date().getTime(),
                        lgCancelado: false,
                        lgGlosaManual: true,
                        SEARCH_OPTION: "canGenerateRestriction"};	

        _self.billingValidationValues = BILLING_VALIDATION_ENUM.ENUMERATION_VALUES;
        _self.paymentValidationValues = PAYMENT_VALIDATION_ENUM.ENUMERATION_VALUES;

        this.init = function () {
            $(' .restrictionDiv').slideToggle();

            _self.lgValidacaoPosterior = false;

            if(procInsu.tpMovimento === 'PACOTE') {
                _self.filters.lgGlosaFracionamento = false;

                movementFactory.getPackageRestriction(procInsu.cdUnidade, procInsu.cdUnidadePrestadora, 
                        procInsu.cdTransacao, procInsu.nrSerieDocOriginal, procInsu.nrDocOriginal,
                        procInsu.nrDocSistema, procInsu.movementKey, 
                        function(result) {
                            _self.restrictionsList = result.tmpMovrcglo;

                            angular.forEach(_self.restrictionsList, function(restriction){
                                restriction.controller = _self;
                            });

                            _self.cdTipoCob = angular.copy(result.cdTipoCob);
                            _self.cdTipoPagamento = angular.copy(result.cdTipoPagamento);

                            for (var i = _self.restrictionsList.length - 1; i >= 0; i--) {
                                if(_self.restrictionsList[i].lgGlosaManual == true){
                                    _self.qtdeGlosaManual++;
                                }
                            }
                });
            } else {
                var cdInsumo = 0;
                var cdTipoInsumo = 0;

                if(procInsu.tpMovimento === 'INSU') {
                    cdTipoInsumo = procInsu.cdTipoInsumo;
                    cdInsumo = procInsu.cdInsumo;
                }

                movementFactory.getMovementRestriction(procInsu.cdUnidade, procInsu.cdUnidadePrestadora, 
                            procInsu.cdTransacao, procInsu.nrSerieDocOriginal, procInsu.nrDocOriginal,
                            procInsu.nrDocSistema, cdTipoInsumo, cdInsumo, procInsu.nrProcesso, procInsu.nrSeqDigitacao, 
                            procInsu.tpMovimento, 
                            function(result){
                                _self.restrictionsList = result.tmpMovrcglo;
    
                                angular.forEach(_self.restrictionsList, function(restriction){
                                    restriction.controller = _self;
                                });
                    
                                _self.cdTipoCob = angular.copy(result.cdTipoCob);
                                _self.cdTipoPagamento = angular.copy(result.cdTipoPagamento);
                    
                                for (var i = _self.restrictionsList.length - 1; i >= 0; i--) {
                                    if(_self.restrictionsList[i].lgGlosaManual == true){
                                        _self.qtdeGlosaManual++;
                                    }
                                }
                            });    
                            
                if (maintenanceType == MAINTENANCE_TYPE_ENUM.EDIT_MOVEMENT){
                    movementFactory.getDivisionMovementRestriction(procInsu.cdUnidade, procInsu.cdUnidadePrestadora, 
                                procInsu.cdTransacao, procInsu.nrSerieDocOriginal, procInsu.nrDocOriginal,
                                procInsu.nrDocSistema, 
                                function(result){
                                    _self.divisionMovementRestrictionsList = result.tmpMovrcglo;

                                    angular.forEach(_self.divisionMovementRestrictionsList, function(restriction){
                                        restriction.controller = _self;
                                    });
                                    
                                    if(_self.restrictionsList.length == 0){
                                        _self.cdTipoCob = angular.copy(result.cdTipoCob);
                                        _self.cdTipoPagamento = angular.copy(result.cdTipoPagamento);
                                    }

                                    for (var i = _self.divisionMovementRestrictionsList.length - 1; i >= 0; i--) {
                                        if(_self.divisionMovementRestrictionsList[i].lgGlosaManual == true){
                                            _self.qtdeGlosaManual++;
                                        }
                                    }
                                });        
                }                     
            }
        };

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        //Chama ao selecionar uma glosa manual no zoom
        this.onSelectRestriction = function (){
            if (!_self.manualRestriction) {
                _self.manualRestriction = {};
            }

            hrcGlobalFactory.getRestrictionByFilter(_self.manualRestriction.cdCodGlo, 0, 0, false,
			[{property: 'cdClasseErro', value: _self.manualRestriction.cdClasseErro, priority: 1}],
                  function(result){
                    if(result[0]){
                        _self.restriction = result[0];

                    }
                });
        };

        //Esconde o div de glosa manual
        this.closeManualRestriction = function () {
            _self.manualRestriction = {};
            _self.restriction = {};
            $(' .restrictionDiv').slideToggle();
        };

        //Botão Aplicar:  seta a glosa manual na lista de glosas
        this.setManualRestriction = function(){
            var lgAchouGlosa = false;

            if (angular.isUndefined(_self.manualRestriction.cdCodGlo)
             || _self.manualRestriction.cdCodGlo == 0) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title:  'Glosa não informada'
                });
                return;
            }

            if (_self.restriction.lgGlosaFracionamento == true
            && (_self.manualRestriction.qtGlosar == undefined
             || _self.manualRestriction.qtGlosar == '')) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title:  'Qtde Glosada não informada'
                });
                return;
            }

            if(_self.restriction.lgGlosaFracionamento == true){
                _self.manualRestriction.qtMovimentosGlosados = _self.manualRestriction.qtGlosar;
            }else{
                _self.manualRestriction.qtMovimentosGlosados = procInsu.qtMovimento;    
            }

            _self.manualRestrictionAdd = angular.copy(_self.manualRestriction);
            _self.manualRestrictionAdd.onChangeRestriction = _self.onChangeRestriction;

            _self.manualRestrictionAdd.cdClasseErro = _self.restriction.cdClasseErro;
            _self.manualRestrictionAdd.rotuloCodGlo = _self.restriction.cdCodGlo + " - " + _self.restriction.dsCodGlo;
            
            _self.manualRestrictionAdd.rotuloClasseErro = _self.restriction.rotuloClasseErro;
            _self.manualRestrictionAdd.qtMovimentosGlosados = _self.manualRestriction.qtMovimentosGlosados;
            _self.manualRestrictionAdd.controller = _self;

            //Necessario para saber se foi apenas adicionada a glosa na tela
            _self.manualRestrictionAdd.lgGlosaNaoSalva = true;

            lgGlosaManual = true;
            /*_self.lgAchouClasseErro = true;*/
            _self.qtdeGlosaManual++;  

            //Se a lista estiver vazia adiciona a glosa manual
            if(_self.restrictionsList.length == 0){
                _self.manualRestrictionAdd.lgGlosaPrincipal = true;
                _self.restrictionsList.push(angular.copy(_self.manualRestrictionAdd));    
            }else{
                //Verifica se a lista possui uma glosa com a classe de erro 6
                // e altera essa glosa
                for (var i = _self.restrictionsList.length - 1; i >= 0; i--) {
                    if (_self.restrictionsList[i].cdClasseErro == _self.manualRestrictionAdd.cdClasseErro) {
                        //Verifica se a antiga glosa manual estava marcada como principal
                        // e altera a nova para ser a principal
                        if(_self.restrictionsList[i].lgGlosaPrincipal == true){
                            _self.manualRestrictionAdd.lgGlosaPrincipal = true;
                        }

                        if(_self.restrictionsList[i].selected == true){
                            _self.manualRestrictionAdd.selected = true;
                        }

                        _self.restrictionsList[i] = angular.copy(_self.manualRestrictionAdd);

                        lgAchouGlosa = true;
                        _self.qtdeGlosaManual--;
                        break;
                    }

                    //Caso seja o ultimo item da lista e não achou glosa adiciona a glosa na lista
                    if(!lgAchouGlosa
                    && i == 0){
                        _self.restrictionsList.push(angular.copy(_self.manualRestrictionAdd));    
                    }
                };
            }

            _self.closeManualRestriction();
        };

        //Botão Adicionar/Alterar Glosa Manual
        this.addManualRestriction = function () {
            _self.restriction = {};
            _self.manualRestriction = {};

            $(' .restrictionDiv').css({
                    'margin-top': '25px',
                    'visibility': 'visible',
					'width'     : '700px'});
            $(' .divBody').css({
				    'height': '270px',
			        'width' : '650px'}); 

            $(' .restrictionDiv').slideToggle();
        };

        this.save = function () {

            var tmpRestriction = [];
            var restrictionAux = {};
            var cdCodGloPrincipal = 0;
            var cdClasseErroPrincipal = 0;
            
            for (var i = _self.restrictionsList.length - 1; i >= 0; i--) {
                restrictionAux = {};

                if(_self.restrictionsList[i].lgGlosaPrincipal == true){
                    cdCodGloPrincipal     = _self.restrictionsList[i].cdCodGlo;
                    cdClasseErroPrincipal = _self.restrictionsList[i].cdClasseErro;
                }
            
                if(_self.restrictionsList[i].lgGlosaNaoSalva == true){
                    restrictionAux = angular.copy(_self.restrictionsList[i]);

                    //Tira a referência para evitar que o json fique circular
                    restrictionAux.controller = undefined; 
                    tmpRestriction.push(restrictionAux);
                }
            }

            if(procInsu.tpMovimento === 'PROC'){
                movementFactory.processRestrictionsProcedure(procInsu.cdUnidade, procInsu.cdUnidadePrestadora, 
                    procInsu.cdTransacao, procInsu.nrSerieDocOriginal, procInsu.nrDocOriginal,
                    procInsu.nrDocSistema, procInsu.nrProcesso, procInsu.nrSeqDigitacao, 
                    _self.cdTipoCob, _self.cdTipoPagamento, cdCodGloPrincipal, cdClasseErroPrincipal, _self.lgValidacaoPosterior,
                    maintenanceType, tmpRestriction, _self.removedRestrictions, _self.setManualRestrictionResult);
            }else if(procInsu.tpMovimento === 'INSU'){
                movementFactory.processRestrictionsInput(procInsu.cdUnidade, procInsu.cdUnidadePrestadora, 
                    procInsu.cdTransacao, procInsu.nrSerieDocOriginal, procInsu.nrDocOriginal,
                    procInsu.nrDocSistema, procInsu.nrProcesso, procInsu.nrSeqDigitacao, procInsu.cdTipoInsumo, procInsu.cdInsumo,
                    _self.cdTipoCob, _self.cdTipoPagamento, cdCodGloPrincipal, cdClasseErroPrincipal, _self.lgValidacaoPosterior,
                    maintenanceType, tmpRestriction, _self.removedRestrictions, _self.setManualRestrictionResult);
            } else {
                movementFactory.processRestrictionsPackage(procInsu.cdUnidade, procInsu.cdUnidadePrestadora, 
                    procInsu.cdTransacao, procInsu.nrSerieDocOriginal, procInsu.nrDocOriginal,
                    procInsu.nrDocSistema, _self.cdTipoCob, _self.cdTipoPagamento,
                    cdCodGloPrincipal, cdClasseErroPrincipal, _self.lgValidacaoPosterior, maintenanceType, procInsu.movementKey,
                    tmpRestriction, _self.removedRestrictions, _self.setManualRestrictionResult);
            }
        };

        this.setManualRestrictionResult = function (result) {
            var resultAux = {};
            
            if(result.$hasError == true){
                return;
            }            

            if(lgGlosaManual == true){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'success', title:  'Glosa Manual realizada com Sucesso'
                });
            }else if(lgAlterouGlosaPrincipal == true){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'success', title:  'Alteração realizada com Sucesso'
                });
            }else {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'success', title:  'Validação de Glosas realizado com Sucesso!'
                });
            }

            resultAux = result;

            if (!(angular.isUndefined(result.tmpMovementProvider))){
                resultAux = result.tmpMovementProvider;
            }

            $modalInstance.close(resultAux);
        };

        //Sincroniza o lgGlosaPrincipal de acordo com a tela
        this.onChangeRestriction = function(restriction){
            for (var i = _self.restrictionsList.length - 1; i >= 0; i--) {
                _self.restrictionsList[i].lgGlosaPrincipal = false;
            }

            restriction.lgGlosaPrincipal = true;
            lgAlterouGlosaPrincipal = true;
        };

        this.removeManualRestriction = function () {
            var restrictionAux = {};
            var hasError = true; 

            for (var i = _self.restrictionsList.length - 1; i >= 0; i--) {
                if(_self.restrictionsList[i].selected == true){
                    lgAlterouGlosaPrincipal = true;
                    hasError = false;

                    if(_self.restrictionsList[i].lgGlosaNaoSalva){
                        _self.qtdeGlosaManual--;
                        _self.restrictionsList.splice(i,1);
                    }else{
                        _self.qtdeGlosaManual--;
                        restrictionAux = angular.copy(_self.restrictionsList[i]);
                        //Tira a referência para evitar que o json fique circular
                        restrictionAux.controller = undefined; 
                        _self.removedRestrictions.push(restrictionAux);

                        _self.restrictionsList.splice(i,1);
                    }
                    
                }
            }
            
            if (hasError){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title:  'Não foram selecionadas Glosas para Desfazer a Glosa Manual'
                });
            }
        };

        $scope.$watch('$viewContentLoaded', function() {
            _self.init();
        });
    }
    
    index.register.controller('hrc.movementRestrictions.Control', movementRestrictionsController);
});