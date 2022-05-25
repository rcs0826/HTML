define(['index', 
    '/dts/hgp/html/hrs-abiAnalysisAttendance/abiAnalysisAttendanceFactory.js',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/controller/abiAnalysisAttendanceAdvancedFilterController.js',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/search/controller/abiAnalysisAttendanceRefundSearchController.js',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/search/controller/abiAnalysisAttendanceImpugSearchController.js',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/search/controller/abiAnalysisAttendanceSuspSearchController.js',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/pdfGeneration/controller/abiAnalisysAttendanceImpugApealController.js',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/controller/abiAnalysisAttendanceRelDeclaController.js',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/controller/resultImpugnationModalController.js',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/attendanceErrors/controller/attendanceErrorsModalController.js',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/controller/abiAnalysisAttendanceMovementMaintenance.js',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/controller/impugnationMotiveModalController.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/enumeration/abiAnalysisAttendanceEnumeration.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/hrs-permissionSituation/permissionSituationFactory.js',
    '/dts/hgp/html/enumeration/attendanceStatusEnumeration.js',
    '/dts/hgp/html/enumeration/abiStatusEnumeration.js',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/controller/attendanceHistoricModalController.js',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/attendanceGRU/controller/attendanceGRUModalController.js',
    '/dts/hgp/html/hrs-situation/attendanceSituation/controller/attendanceSituationModalController.js',
    '/dts/hgp/html/hrs-gru/gruFactory.js',
    '/dts/hgp/html/hrs-situation/situationFactory.js',
    '/dts/hgp/html/enumeration/gruStatusEnumeration.js',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/controller/bondDeclarationModalController.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    abiAnalysisAttendanceListController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 
                                                   'totvs.utils.Service', 'totvs.app-main-view.Service', '$location', 
                                                   'hrs.abiAnalysisAttendance.Factory', 
                                                   'global.userConfigs.Factory', 'hrs.permissionSituation.Factory', 
                                                   'hrs.situation.Factory', '$modal', 
                                                   'AbstractAdvancedFilterController', 'hrs.gru.Factory', 'TOTVSEvent', '$timeout'];
    function abiAnalysisAttendanceListController($rootScope, $scope, $state, $stateParams, 
                                                 totvsUtilsService, appViewService, $location, 
                                                 abiAnalysisAttendanceFactory, 
                                                 userConfigsFactory, permissionSituationFactory, 
                                                 situationFactory, $modal,
                                                 AbstractAdvancedFilterController, gruFactory, TOTVSEvent, $timeout) {
    
        var _self = this;

        $scope.StringTools = StringTools;
        $scope.ABI_ANALYSIS_ATTENDANCE_ENUM = ABI_ANALYSIS_ATTENDANCE_ENUM;
        $scope.ATTENDANCE_STATUS_ENUM = ATTENDANCE_STATUS_ENUM;
        $scope.ABI_STATUS_ENUM = ABI_STATUS_ENUM;
        $scope.GRU_STATUS_ENUM = GRU_STATUS_ENUM;

        _self.cdProgramaCorrente = 'hrs.abiAnalysisAttendanceList';
        _self.config = [];
        _self.disclaimers = [];
        _self.listItemInfoClasses2col = "col-sm-6 col-md-6 col-lg-6 col-sm-height";
        _self.listItemInfoClasses3col = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.listItemInfoClasses4col = "col-sm-3 col-md-3 col-lg-3 col-sm-height";
        _self.listItemInfoClasses6col = "col-sm-2 col-md-2 col-lg-2 col-sm-height";
        _self.listOfAbiAnalysisAttendance = [];
        _self.listOfAbiAnalysisAttendanceCount = 0;
        _self.limit = 50;
        
        /* Seguranca - Permissoes por Situacao da ABI */
        _self.listOfPermissionSituation = [];

        // Todas as permissoes por situacao do usuario logado
        permissionSituationFactory.getPermissionSituationSecurityByUser(function (result) {            
            angular.forEach(result, function (value) {
                if (value.cdnPermis > 0){ 
                    _self.listOfPermissionSituation.push(value);                        
                }
            });
            
            if (!_self.listOfPermissionSituation){
                _self.config = {lgBuscarAoAbrirTela : true, qtdRegistrosBusca   : "20"};
                _self.search(false);
            }
        });
        /* END - Seguranca - Permissoes por Situacao da ABI */


        this.init = function(){
            appViewService.startView("Análise de Atendimentos da ABI", 'hrs.abiAnalysisAttendanceList.Control', _self);

            _self.cddRessusAbiDados = $stateParams.cddRessusAbiDados;
            _self.codProcesso       = $stateParams.codProcesso.replace('.','/');
            _self.codAbi            = $stateParams.codAbi;
            _self.listOfAbiAnalysisAttendance = [];
            _self.listOfAbiAnalysisAttendanceCount = 0;

            _self.addEventListeners();
            
            userConfigsFactory.getConfigByKey(
                $rootScope.currentuser.login, 
                _self.cdProgramaCorrente,
                function(result){
                    if(angular.isUndefined(result) == true){
                        _self.config = {lgBuscarAoAbrirTela : true,
                                        qtdRegistrosBusca   : "20"};
                        _self.search(false);            
                    }else{
                        _self.config = result.desConfig;
                    
                        if(_self.config.disclaimers){
                            _self.disclaimers = angular.copy(_self.config.disclaimers);
                        }
                    
                        if(_self.config.lgBuscarAoAbrirTela == true){
                            _self.search(false);
                        }
                    }
                });                                        
        };

        this.openImpugRecurso = function openImpugRecurso(abiAnalysisAttendancePar, idPermissaoPar) {
            var AttendanceRefundHist = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/pdfGeneration/ui/abiAnalisysAttendanceImpugApeal.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrs.abiAnalisysAttendanceImpugApeal.Control as controller',
                resolve: {
                    analisysAttendance : function(){
                        return abiAnalysisAttendancePar;
                    },
                    cddRessusAbiDados : function(){
                        return _self.cddRessusAbiDados;
                    },
                    idPermissao : function(){
                        return idPermissaoPar;
                    }
                }
            });

        };

        this.generateImpugApeal = function generateImpugApeal(abiAnalysisAttendancePar){        

            abiAnalysisAttendanceFactory.generateImpugApeal(2,      
                                                            abiAnalysisAttendancePar.cddRessusAbiAtendim,
                function(result){
                    if(result.$hasError == true){
                        return;
                    }

                    _self.search(false);

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Documento gerado com sucesso! '
                    });
                }
            );
        };        
        
        this.generateImpugApealBatch = function (){
            
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                                  title: 'Atenção!',
                                  text: 'Somente os atendimentos com status Análise Concluída serão gerados. Confirma a geração?',
                                  cancelLabel: 'Cancelar',
                                  confirmLabel: 'Confirmar',
                                  size: 'md',
                                  callback: function (hasChooseYes) {
                                      if (hasChooseYes) {
                                          _self.callGenerateImpugApealBatch();
                                      }
                                  }
            });                   
        };

        this.callGenerateImpugApealBatch = function (){
            var tmpUnselectedAttendance = [];

            for (var i = _self.listOfAbiAnalysisAttendance.length - 1; i >= 0; i--) {
                if(_self.listOfAbiAnalysisAttendance[i].$selected == false){
                    tmpUnselectedAttendance.push(_self.listOfAbiAnalysisAttendance[i]);
                }
            }

            if (_self.listOfAbiAnalysisAttendanceCount == tmpUnselectedAttendance.length){
                $rootScope.$broadcast(TOTVSEvent.showBusinessMessage,
                    [{code: 'Atenção!',
                    detail: 'Não foram selecionados registros!',
                    type: 'error'}]
                    );
                return;
            }        

            abiAnalysisAttendanceFactory.generateImpugApealBatch(_self.cddRessusAbiDados,
                                                                 tmpUnselectedAttendance,
                                                                 _self.disclaimers,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }

                    _self.search(false);

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Documento gerado com sucesso! '
                    });
            });             
        }

        this.getGenerateImpugApealPermission = function getGenerateImpugApealPermission(abiAnalysisAttendancePar){

            return abiAnalysisAttendancePar.idiStatus >= ATTENDANCE_STATUS_ENUM.ANALISE_CONCLUIDA;
        };

        this.getLabelGenerateImpugApeal = function getLabelGenerateImpugApeal(abiAnalysisAttendancePar){

            switch(abiAnalysisAttendancePar.idiStatus){
                case ATTENDANCE_STATUS_ENUM.ANALISE_CONCLUIDA:
                    return "Gerar Impugnação/Recurso";
                default:
                    return "Download Impugnação/Recurso";
            }            
        };

        this.openResultImpugRecurso = function openResultImpugRecurso(abiAnalysisAttendancePar, idPermissaoPar) {

            var AttendanceRefundHist = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/ui/resultImpugnationModal.html',
                size: 'md',
                backdrop: 'static',
                controller: 'hrs.resultImpugnationModalController.Control as controller',
                resolve: {
                    analisysAttendance : function(){
                        return abiAnalysisAttendancePar;
                    },
                    cddRessusAbiDados : function(){
                        return _self.cddRessusAbiDados;
                    },
                    idPermissao : function(){
                        return idPermissaoPar;
                    }
                }
            });

        };
        
        this.generateRessusBondDeclarationBatch = function() {
            var attendanceBondReport = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/ui/bondDeclarationModal.html',
                size: 'md',
                backdrop: 'static',
                controller: 'hrs.bondDeclarationModal.Control as controller',
                resolve: { }
            });


            attendanceBondReport.result.then(function (objTipoPessoaGeracao) { 
                _self.callGenerateRessusBondDeclarationBatch(objTipoPessoaGeracao);
            });            
        }

        this.callGenerateRessusBondDeclarationBatch = function(objTipoPessoaGeracao) {
            //Testa se foi preenchido o campo de busca
            if ((!angular.isUndefined(_self.searchInputText))
                && _self.searchInputText !== ''){
                //Remove todos os disclaimers
                var arrayLength = _self.disclaimers.length - 1;
                for (var i = arrayLength ; i >= 0 ; i--) {
                    _self.disclaimers.splice(i, 1);
                }   
            }

            var tmpUnselectedAttendance = [];

            for (var i = _self.listOfAbiAnalysisAttendance.length - 1; i >= 0; i--) {
                if(_self.listOfAbiAnalysisAttendance[i].$selected == false){
                    tmpUnselectedAttendance.push(_self.listOfAbiAnalysisAttendance[i]);
                }
            }

            if (_self.listOfAbiAnalysisAttendanceCount == tmpUnselectedAttendance.length){
                $rootScope.$broadcast(TOTVSEvent.showBusinessMessage,
                    [{code: 'Atenção!',
                    detail: 'Não foram selecionados registros!',
                    type: 'error'}]
                    );
                return;
            }

            var tmpFilterValue = angular.copy(_self.disclaimers);
            tmpFilterValue.push(objTipoPessoaGeracao);

            abiAnalysisAttendanceFactory.generateRessusBondDeclaration(_self.cddRessusAbiDados,
                                                                       tmpUnselectedAttendance, /*simpleFilterValue*/
                                                                       tmpFilterValue,
                function (result) {
                    if (result)
                        if (result.nrPedido > 0) {
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'success', title: 'Criado pedido de execução número ' + result.nrPedido + '! '
                            });
                            return;
                        }

                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error', title: 'Erro ao criar pedido de execução! '
                        });
                }
            );
        }

        this.search = function(isMore) {
            startAt = 0;
            if (isMore) {
                startAt = _self.listOfAbiAnalysisAttendance.length + 1;
            } else {
                _self.listOfAbiAnalysisAttendance = [];
            }

            //Testa se foi preenchido o campo de busca
            if ((!angular.isUndefined(_self.searchInputText))
            && _self.searchInputText !== ''){
                if(isNaN(_self.searchInputText)){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'warning', title: 'Deverá ser informado um valor numérico!'
                    });
                    return;
                }

                //Remove todos os disclaimers
                var arrayLength = _self.disclaimers.length - 1;
                for (var i = arrayLength ; i >= 0 ; i--) {
                    _self.disclaimers.splice(i, 1);
                }   
            }
            
            abiAnalysisAttendanceFactory.getRessusAbiAtendimByFilter(
                _self.cddRessusAbiDados,
                _self.searchInputText,
                startAt, 
                parseInt(_self.config.qtdRegistrosBusca), 
                true, 
                _self.disclaimers,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }

                    if (result) {
                         angular.forEach(result, function (value) {

                            if (value && value.$length) {
                               _self.listOfAbiAnalysisAttendanceCount = value.$length;
                            }

                            if(value.codComptcia !== undefined
                            && value.codComptcia !== ""){
                                value.codComptcia = value.codComptcia.substring(0, 2)
                                                   + "/"
                                                   + value.codComptcia.substring(2);
                            }

                            value.$selected = true;
                            value.inAcao = 'Detalhar';
                            if (_self.validaPermissaoBotao(value, 'Editar'))
                                value.inAcao = 'Editar';

                            _self.listOfAbiAnalysisAttendance.push(value);
                        });

                        _self.setAttributeClass();
                    }
            });

            abiAnalysisAttendanceFactory.getRessusAbiSituations(function (result){
                _self.abiSituation = result;
                _self.abiSituationOptions = [];
                angular.forEach(result, function(value){
                    _self.abiSituationOptions.push({"label":value.nmSituacao},{"value":value.idiSubStatus});
                });
            });
        };

        this.getRessusAbiAtendimData = function(abiAnalysisAttendance){
            $state.go($state.get('dts/hgp/hrs-abiAnalysisAttendance.maintenance'), 
                      {tmpRessusAbiAtendim: abiAnalysisAttendance,
                      codAbi: _self.codAbi,
                      codProcesso: _self.codProcesso}); 
        }

        this.openAttendanceErrors = function(cddRessusAbiAtendim){
            abiAnalysisAttendanceFactory.getErrors(cddRessusAbiAtendim,0,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }

                    if (result) {
                        var attendanceErrors = $modal.open({
                            animation: true,
                            templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/attendanceErrors/ui/attendanceErrorsModal.html',
                            size: 'lg',
                            backdrop: 'static',
                            controller: 'hrs.attendanceErrorsModal.Control as controller',
                            resolve:{
                                errorList:function(){
                                    return result;
                                }
                            }
                        });
                    }
            });
        }
        
        this.getPermissionSituationSecurity = function(cdnSituacao){
            var cdnPermisAux = 0;            

            angular.forEach(_self.listOfPermissionSituation, function (item) {
                if(item.cdnSituacao == cdnSituacao && cdnPermisAux < item.cdnPermis){
                    cdnPermisAux = item.cdnPermis;                      
                }    
            });

            return cdnPermisAux;
        };

        this.validaPermissaoBotao= function(abiAnalysisAttendance, funcao){

            var cdnPermisAux = false;
            angular.forEach(_self.listOfPermissionSituation, function (item) {
                if (item.idiStatus == abiAnalysisAttendance.idiStatus 
                    && item.idiSubStatus == abiAnalysisAttendance.idiSubStatus){
                
                    if ((funcao == 'Editar') && (item.cdnPermis == 2)) {
                        cdnPermisAux = true;
                    } else if ((funcao == 'Detalhar') && (item.cdnPermis == 1)) {
                        cdnPermisAux = true;
                    }
                }
            });
                     
            return cdnPermisAux;
        };

        this.openAdvancedSearch = function () {
            var advancedFilter = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/ui/abiAnalysisAttendanceAdvancedFilter.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrs.abiAnalysisAttendanceAdvFilter.Control as afController',
                resolve: {
                    disclaimers: function () {
                        return _self.disclaimers;
                    },
                    AbstractAdvancedFilterController : function(){
                        return AbstractAdvancedFilterController;
                    }
                }
            });
            
            advancedFilter.result.then(function (disclaimers) {
                _self.disclaimers = disclaimers;
                _self.search(false, true);
            });
        };

        this.openAttendanceData = function (cdProtooAbiPar, cdProtoAihPar, idPermissaoPar) {
            var AttendanceData = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/ui/abiAnalysisAttendanceData.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrs.abiAnalysisAttendData.Control as adController',
                resolve: {
                    disclaimers: function () {
                        return _self.disclaimers;
                    },
                    AbstractAdvancedFilterController : function(){
                        return AbstractAdvancedFilterController;
                    },
                    cdProtocoloAbi : function(){
                        return cdProtooAbiPar;
                    },
                    cdProtocoloAih : function(){
                        return cdProtoAihPar;
                    },
                    idPermissao : function(){
                        return idPermissaoPar;
                    }
                }
            });
            
            AttendanceData.result.then(function (disclaimers) {
                _self.search(false, true);
            });
        };
        
        this.openDeclaracoes = function (abiAnalysisAttendance, idPermissaoPar) {
            var AttendanceData = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/ui/abiAnalysisAttendanceRelDecla.html', 
                size: 'lg',
                backdrop: 'static',
                controller: 'hrs.abiAnalysisAttendanceRelDecla.Control as declaController',
                resolve: {
                    abiAnalysisAttendance : function() {
                        return abiAnalysisAttendance;
                    },
                    idPermissao : function() {
                        return idPermissaoPar;
                    }
                }
            });
            
            AttendanceData.result.then(function (disclaimers) {
                _self.search(false, true);
            });
        };

        
        this.openAttendanceJustification = function (cddRessusAbiAtendim, idPermissaoPar) {
            var AttendanceData = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/ui/abiAnalysisAttendanceJustification.html', 
                size: 'lg',
                backdrop: 'static',
                controller: 'hrs.abiAnalysisAttendJustification.Control as ajController',
                resolve: {
                    disclaimers: function () {
                        return _self.disclaimers;
                    },
                    AbstractAdvancedFilterController : function(){
                        return AbstractAdvancedFilterController;
                    },
                    cddRessusAbiAtendim : function(){
                        return cddRessusAbiAtendim;
                    },
                    abiAttendanceJustificationList : function() {
                        angular.forEach(_self.abiAttendanceJustificationList, function(value){
                            if (value.cd_protocolo_abi == cdProtooAbiPar &&
                                value.cd_protocolo_aih == cdProtoAihPar){
                                _self.arrJustificationAih.push(value);                                
                            }
                        });

                        return _self.arrJustificationAih;
                    },
                    idPermissao : function(){
                        return idPermissaoPar;
                    }                    
                }
            });
            
            AttendanceData.result.then(function (disclaimers) {
                _self.search(false, true);
            });
        };
        
        this.openAttendanceSupportingDocuments = function (cdProtooAbiPar, cdProtoAihPar, idPermissaoPar) {
            var AttendanceData = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/ui/abiAnalysisAttendanceSupportingDocuments.html', 
                size: 'lg',
                backdrop: 'static',
                controller: 'hrs.abiAnalysisAttendanceSupDoc.Control as sdController',
                resolve: {
                    disclaimers: function () {
                        return _self.disclaimers;
                    },
					abiAttendanceJustificationList: function() {
						return _self.abiAttendanceJustificationList;
					},
                    AbstractAdvancedFilterController : function(){
                        return AbstractAdvancedFilterController;
                    },
                    cdProtocoloAbi : function(){
                        return cdProtooAbiPar;
                    },
                    cdProtocoloAih : function(){
                        return cdProtoAihPar;
                    },
                    idPermissao : function(){
                        return idPermissaoPar;
                    }
                }
            });
            
            AttendanceData.result.then(function (disclaimers) {
                _self.search(false, true);
            });
        };
        
        this.openAttendanceProcSupplies = function (cdProtooAbiPar, cdProtoAihPar, abiAnalysisAttendancePar, idPermissaoPar) {
            var AttendanceData = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/ui/abiAnalysisAttendanceProceduresSupplies.html', 
                size: 'lg',
                backdrop: 'static',
                controller: 'hrs.abiAnalysisAttendanceProcSupplies.control as psController',
                resolve: {
                    cdProtocoloAbi : function(){
                        return cdProtooAbiPar;
                    },
                    cdProtocoloAih : function(){
                        return cdProtoAihPar;
                    },
                    analisysAttendance : function(){
                        return abiAnalysisAttendancePar;
                    }, 
                    abiAnalysis: function(){
                        return _self.abiAnalysis;
                    },
                    idPermissao : function(){
                        return idPermissaoPar;
                    }
                }
            });                        
        };

        this.openSuspHist = function openSuspHist(idBeneficiarioPar, idPermissaoPar) {
            var AttendanceSuspHist = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/search/ui/abiAnalysisAttendanceSuspSearch.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrs.abiAnalysisAttendanceSuspSearch.Control as ssController',
                resolve: {
                    idBeneficiario: function () {
                        return idBeneficiarioPar;
                    },
                    idPermissao : function(){
                        return idPermissaoPar;
                    }
                }
            });
        };

        this.openImpugHist = function openImpugHist(nrAih, cdProtocoloAbi, idPermissaoPar) {
            var AttendanceImpugHist = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/search/ui/abiAnalysisAttendanceImpugSearch.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrs.abiAnalysisAttendanceImpugSearch.Control as isController',
                resolve: {
                    nrAih : function(){
                        return nrAih;
                    }, 
                    cdProtocoloAbi : function() {
                        return cdProtocoloAbi;
                    },
                    idPermissao : function(){
                        return idPermissaoPar;
                    }
                }
            });
        };

        this.openRefundHist = function openRefundHist(idBeneficiarioPar, idPermissaoPar) {
            var AttendanceRefundHist = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/search/ui/abiAnalysisAttendanceRefundSearch.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrs.abiAnalysisAttendanceRefundSearch.Control as rsController',
                resolve: {
                    idBeneficiario: function () {
                        return idBeneficiarioPar;
                    },
                    idPermissao : function(){
                        return idPermissaoPar;
                    }
                }
            });
        };

        this.openAttendanceHistoric = function (ressusAbiAtendim) {
            var attendanceHistoric = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/ui/attendanceHistoricModal.html', 
                size: 'lg',
                backdrop: 'static',
                controller: 'hrs.attendanceHistoricModalController.Control as controller',
                resolve: {                    
                    ressusAbiAtendim : function(){
                        return ressusAbiAtendim;
                    }                   
                }
            });
        };

        this.openConfigWindow = function () {
            var configWindow = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/ui/abiAnalysisAttendanceRelDeclara.html',
                size: 'sm',
                backdrop: 'static',
                controller: 'hrs.abiAnalysisAttendanceRelDeclara as controller',
                resolve: {
                    config: function () {
                        return angular.copy(_self.config);
                    },
                    programName: function(){
                        return _self.cdProgramaCorrente;
                    },
                    extensionFunctions: function(){
                        var funcs = {};
                        funcs.setCurrentFilterAsDefault = function(){
                            this.config.disclaimers = angular.copy(_self.disclaimers);
                        };     
                        return funcs;
                    }
                }
            });

            configWindow.result.then(function (config) {
                _self.config = angular.copy(config);
            });
        };
        
        this.removeDisclaimer = function (disclaimer) {
            // percorre os disclaimers até encontrar o disclaimer passado na função e o remove
            // obs.: Não funciona para mais de um disclaimer quando são apenas 2, 
            //       pois o length dos disclaimers usado no for é modificado assim
            //       que é removido o primeiro disclaimer
            for (var i = 0; i < _self.disclaimers.length; i++) {
                if (_self.disclaimers[i] === disclaimer) {
                    _self.disclaimers.splice(i, 1);
                }
            }

            _self.search(false);
        };

        this.exportAttendaceCSV = function exportAttendaceCSV(){
            this.exportCSVFile(_self.listOfAbiAnalysisAttendance, 'ABIs');
        };
        
        this.exportCSVFile = function exportCSVFile(items, fileTitle) {
            var str = 'N. AIH;' +
                      'COD.;' +
                      'MODALIDADE;' + 
                      'TERMO;' + 
                      'NOME BENEFICIARIO;' +
                      'CONTRATANTE;' +
                      'DATA DE INICIO DO ATENDIMENTO;' +
                      'DATA DE FIM DO ATENDIMENTO;' +
                      'VALOR;' +
                      'MOTIVO;' +
                      'STATUS;' +
                      '\r\n';

            angular.forEach(_self.listOfAbiAnalysisAttendance, function (value) {
                str = str + value.nrAih                                             + ";" + 
                            value.cdCco                                             + ";" + 
                            value.cdModalidade                                      + ";" + 
                            value.nrTerAdesao                                       + ";" + 
                            value.nmUsuario                                         + ";" + 
                            value.nmContratante                                     + ";" + 
                            new Date(value.dtInternacao).toLocaleDateString()       + ";" + 
                            new Date(value.dtSaida).toLocaleDateString()            + ";" + 
                            StringTools.formatNumberToCurrency(value.vlTunep)       + ";" + 
                            value.rotuloMotivos + ";" + 
                            value.dsSituacao    + ";" + 
                            '\r\n';
            });

            // *********** DOWNLOAD DO CSV  **************
            var csv = str;
            var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

            var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            if (navigator.msSaveBlob) {                                     // IE 10+
                navigator.msSaveBlob(blob, exportedFilenmae);
            } else {
                var link = document.createElement("a");
                if (link.download !== undefined) { // feature detection
                    // Browsers that support HTML5 download attribute
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", exportedFilenmae);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
            // *********** DOWNLOAD DO CSV  **************
        };

        this.openImpugnationMotive = function (attendance) {
            var movementImpugnationMotive = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/ui/impugnationMotiveModal.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrs.impugnationMotiveModalController.Control as controller',
                resolve:{
                    movto: function () {
                        return undefined;
                    },
                    attendance: function () {
                        return attendance;
                    },
                    cddRessusAbiDados : function(){
                        return _self.cddRessusAbiDados;
                    },
                }   
            });

            movementImpugnationMotive.result.then(function (result) {
                if(result == 'SUCCESS'){
                    _self.search(false);
                }
            });
        };

        this.attendanceReprocess = function(abiAnalysisAttendance){
            abiAnalysisAttendanceFactory.reprocessarAtendimento(abiAnalysisAttendance.cddRessusAbiAtendim,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Atendimento Reprocessado com sucesso! '
                    });
            });
        };

        this.getSubStatusMaintenancePermission = function(abiAnalysisAttendance){
            if(abiAnalysisAttendance.idiStatus == ATTENDANCE_STATUS_ENUM.IMPORTACAO_COM_ERRO 
            || abiAnalysisAttendance.idiStatus == ATTENDANCE_STATUS_ENUM.EM_ANALISE){
                return true;
            }
            return false;
        }

        this.getActionMaintenancePermission = function(abiAnalysisAttendance){
            if(abiAnalysisAttendance.idiStatus <= ATTENDANCE_STATUS_ENUM.ANALISE_CONCLUIDA){
                return true;
            }
            return false;
        }
        
        this.getImpugResultMaintenancePermission = function(abiAnalysisAttendance){
            if(abiAnalysisAttendance.idiStatus == ATTENDANCE_STATUS_ENUM.ENVIADA
            && abiAnalysisAttendance.inAcao == 'Editar'){
                return true;
            }
            return false;
        }

        this.getSubSituatuionLabel = function(abiAnalysisAttendance){
            abiAnalysisAttendance.subStatus = "Não Informado";
            if (abiAnalysisAttendance.idiSubStatus > 0){
                angular.forEach(_self.abiSituation, function(value){
                    if(value.idSituacao == abiAnalysisAttendance.idiSubStatus){
                        abiAnalysisAttendance.subStatus = value.nmSituacao;
                    }});
            }
            return abiAnalysisAttendance.subStatus;
        }

        this.getAbiSituatuionLabel = function(){
            if(angular.isUndefined(_self.listOfAbiAnalysisAttendance)
            || angular.isUndefined(_self.listOfAbiAnalysisAttendance[0]))
                return "";

            idiStatusAbiAux = _self.listOfAbiAnalysisAttendance[0].idiStatusAbi;

            if(idiStatusAbiAux == ABI_STATUS_ENUM.ANALISE_IMPUGNACAO
            || idiStatusAbiAux == ABI_STATUS_ENUM.AGUARDANDO_DECISAO_IMPUGNACAO){
                return "| Em Impugnação";
            }

            if(idiStatusAbiAux == ABI_STATUS_ENUM.ANALISE_RECURSO
            || idiStatusAbiAux == ABI_STATUS_ENUM.AGUARDANDO_DECISAO_RECURSO){
                return "| Em Recurso";
            }
        }

        this.onAbiAnalysisSubStatusComplete = function(abiAnalysisAttendance){
            $timeout(function(){
                abiAnalysisAttendanceFactory.updateAbiAtendimSubStatus(abiAnalysisAttendance.cddRessusAbiAtendim,
                                                                       abiAnalysisAttendance.idiSubStatus,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Atendimento Atualizado com sucesso! '
                    });
                });
            });
        };

		this.generateCSV = function(){
            
            var tmpUnselectedAttendance = [];

            for (var i = _self.listOfAbiAnalysisAttendance.length - 1; i >= 0; i--) {
                if(_self.listOfAbiAnalysisAttendance[i].$selected == false){
                    tmpUnselectedAttendance.push(_self.listOfAbiAnalysisAttendance[i]);
                }
            }

            if (_self.listOfAbiAnalysisAttendanceCount == tmpUnselectedAttendance.length){
                $rootScope.$broadcast(TOTVSEvent.showBusinessMessage,
                    [{code: 'Atenção!',
                    detail: 'Não foram selecionados registros!',
                    type: 'error'}]
                    );
                return;
            }
            
            var disclaimersAux = angular.copy(_self.disclaimers);
            
            disclaimersAux.push({property: 'lgGeraCsv', value: true });
            abiAnalysisAttendanceFactory.generateCSV(_self.cddRessusAbiDados,
                                                     tmpUnselectedAttendance,
                                                     disclaimersAux,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Documento gerado com sucesso! '
                    });
            });
        };

        this.updateAttendanceGru = function (attendance){

            var disclaimersAux = [];
            var tmpUnselectedAttendance = [];
            var dsMensagemAux = "";

            var listGru = [];

            var filterListAux = [{property: 'cddRessusAbiDados', value: _self.cddRessusAbiDados},
                                 {property: 'idiStatus', value: GRU_STATUS_ENUM.PENDENTE}];

            gruFactory.getGruByFilter("", 0, 0, false, filterListAux, function(result){

                listGru = result;
    
                /* Se não existe GRU */
                if (angular.isUndefined(listGru) 
                ||  listGru.length == 0){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title: 'Não foram encontradas GRUs!'
                    });
                    return;
                }                            
    
                if(attendance != undefined){
                    disclaimersAux = [{property: 'cddRessusAbiAtendim', value: attendance.cddRessusAbiAtendim}];
                    dsMensagemAux  = "Deseja vincular a " + attendance.codTipAtendim + " " + attendance.cddAtendim + " à GRU " + listGru[0].cddGru + "?";
                }else{                  
                    for (var i = _self.listOfAbiAnalysisAttendance.length - 1; i >= 0; i--) {
                        if(_self.listOfAbiAnalysisAttendance[i].$selected == false){
                            tmpUnselectedAttendance.push(_self.listOfAbiAnalysisAttendance[i]);
                        }
                    }
        
                    if (_self.listOfAbiAnalysisAttendanceCount == tmpUnselectedAttendance.length){
                        $rootScope.$broadcast(TOTVSEvent.showBusinessMessage,
                            [{code: 'Atenção!',
                            detail: 'Não foram selecionados registros!',
                            type: 'error'}]
                            );
                        return;
                    }
        
                    disclaimersAux = angular.copy(_self.disclaimers);
                    dsMensagemAux  = "Deseja vincular os atendimentos à GRU " + listGru[0].cddGru + "? <br><br>";
                    dsMensagemAux += "Somente os atendimentos com status Aguardando GRU ou Aguardando Pagamento serão atualizados."
                }
    
                //Se existe somente uma gru pendente
                if (listGru.length == 1
                && (   (attendance == undefined)
                    || (attendance != undefined
                     && attendance.cddGru == 0))){
                    $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                        title: 'Atenção!',
                        text: dsMensagemAux,
                        cancelLabel: 'Não',
                        confirmLabel: 'Sim',
                        size: 'md',
                        callback: function (hasChooseYes) {
                            if (hasChooseYes) {    
                                _self.saveAttendanceGRU(_self.cddRessusAbiDados, listGru[0].cddGru, disclaimersAux, tmpUnselectedAttendance);
                            }
                            return;
                        }
                    });
                }else{
                    var attendanceGRU = $modal.open({
                            animation: true,
                            templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/attendanceGRU/ui/attendanceGRUModal.html',
                            size: 'lg',
                            backdrop: 'static',
                            controller: 'hrs.attendanceGRUModal.Control as controller',
                            resolve:{
                                listGru:function(){
                                    return listGru;
                                },
                                attendance:function(){
                                    return attendance;
                                },
                                cddRessusAbiDados : function(){
                                    return _self.cddRessusAbiDados;
                                },
                                disclaimers:function(){
                                    return disclaimersAux;
                                },
                                tmpUnselectedAttendance:function(){
                                    return tmpUnselectedAttendance;
                                },
                                saveAttendanceGRU: function(){
                                    return _self.saveAttendanceGRU;
                                }
                            }
                    });
                }

            });
        };

        this.saveAttendanceGRU = function(cddRessusAbiDados, cddGRU, disclaimersAux, tmpUnselectedAttendance){

            abiAnalysisAttendanceFactory.updateAbiAtendimGRU(cddRessusAbiDados, cddGRU, disclaimersAux, tmpUnselectedAttendance,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }
    
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Atendimento Atualizado com sucesso! '
                    });

                    _self.search(false);
            });
        };        
        
        this.setAttributeClass = function () {
            $timeout(function(){
                var abistatus = $(".abi-status-component");
                $.each( abistatus, function(index, value){
                    //$(value.childNodes[0]).addClass("abi-status-component");
                    $(value.childNodes[0]).addClass("abi-status-geral");
                });

                var abistatus = $(".id-abi-status-1");
                $.each( abistatus, function(index, value){
                    $(value.childNodes[0]).addClass("abi-status-1");
                    $(value.childNodes[0]).addClass("abi-status-geral");
                });

                var abistatus = $(".id-abi-status-2");
                $.each( abistatus, function(index, value){
                    $(value.childNodes[0]).addClass("abi-status-2");
                    $(value.childNodes[0]).addClass("abi-status-geral");
                });

                var abistatus = $(".id-abi-status-3");
                $.each( abistatus, function(index, value){
                    $(value.childNodes[0]).addClass("abi-status-3");
                    $(value.childNodes[0]).addClass("abi-status-geral");
                });

                var abistatus = $(".id-abi-status-4");
                $.each( abistatus, function(index, value){
                    $(value.childNodes[0]).addClass("abi-status-4");
                    $(value.childNodes[0]).addClass("abi-status-geral");
                });

                var abistatus = $(".id-abi-status-5");
                $.each( abistatus, function(index, value){
                    $(value.childNodes[0]).addClass("abi-status-5");
                    $(value.childNodes[0]).addClass("abi-status-geral");
                });

                var abistatus = $(".id-abi-status-6");
                $.each( abistatus, function(index, value){
                    $(value.childNodes[0]).addClass("abi-status-6");
                    $(value.childNodes[0]).addClass("abi-status-geral");
                });
            }); 
        };
        
        this.changeSubStatus = function() {

            if (_self.listOfAbiAnalysisAttendance.length == 0){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning', title: 'Nenhum atendimento selecionado! '
                });
                return;
            }

            var listSituation = [];

            var filterListAux = [{property: 'cddRessusAbiDados', value: _self.cddRessusAbiDados},
                                 {property: 'idiStatus', value: GRU_STATUS_ENUM.PENDENTE}];


            situationFactory.getSituationByFilter("", 0, 0, false, filterListAux, function(result){
            
                if(result.length == 0){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'warning', title: 'Não existem Status da Análise cadastrados! '
                    });
                    return;
                }
                
                listSituation = result;
                $modal.open({
                    animation: true,
                    templateUrl: '/dts/hgp/html/hrs-situation/attendanceSituation/ui/attendanceSituationModal.html',
                    size: 'md',
                    backdrop: 'static',
                    controller: 'hrs.attendanceSituationModal.Control as controller',
                    resolve:{
                        listSituation:function(){
                            return listSituation;
                        },
                        cddRessusAbiDados : function(){
                            return _self.cddRessusAbiDados;
                        },
                        saveAttendanceSituation: function(){
                            return _self.saveAttendanceSituation;
                        }
                    }
                })
            })
        };

        this.saveAttendanceSituation = function(cddRessusAbiDados, idSituacao){
            var tmpUnselectedAttendance = [];

            for (var i = _self.listOfAbiAnalysisAttendance.length - 1; i >= 0; i--) {
                if(_self.listOfAbiAnalysisAttendance[i].$selected == false){
                    tmpUnselectedAttendance.push(_self.listOfAbiAnalysisAttendance[i]);
                }
            }

            abiAnalysisAttendanceFactory.updateAbiAtendimSituacao(cddRessusAbiDados, idSituacao, _self.disclaimers, tmpUnselectedAttendance,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }
    
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Atendimento Atualizado com sucesso! '
                    });

                    _self.search(false);
            });
        };        

        this.addEventListeners = function(){
          
            $rootScope.$on('invalidateAttendance',function(event, changedAttendance){

                if(!_self.listOfAbiAnalysisAttendance
                || _self.listOfAbiAnalysisAttendance.length == 0){
                    return;
                }

                for (var i=0; i < _self.listOfAbiAnalysisAttendance.length; i++) {
                    var attendance = _self.listOfAbiAnalysisAttendance[i];
                    var indAux = i;
                    
                    if(attendance.cddRessusAbiAtendim == changedAttendance.cddRessusAbiAtendim){


                        abiAnalysisAttendanceFactory.getRessusAbiAtendimByFilter(changedAttendance.cddRessusAbiDados,
                                                                                 '', /*simpleFilterValue*/
                                                                                 0, 
                                                                                 1, 
                                                                                 false, 
                                                                                 [{property:'cddRessusAbiAtendim', value: attendance.cddRessusAbiAtendim}],
                            function (result) {
                                if(result){
                                    var attendanceAux = result[0];
                                    attendanceAux.$selected = attendance.$selected;
                                    _self.listOfAbiAnalysisAttendance[indAux] = attendanceAux;

                                    attendanceAux.inAcao = 'Detalhar';
                                    if (_self.validaPermissaoBotao(attendanceAux, 'Editar'))
                                        attendanceAux.inAcao = 'Editar';

                                    _self.setAttributeClass();
                                }
                            }, {noCountRequest: true});
                        break;
                    }
                }
            });  
        };

        if ($rootScope.currentuserLoaded) {
            this.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }
    }
    index.register.controller('hrs.abiAnalysisAttendanceList.Control', abiAnalysisAttendanceListController);
});