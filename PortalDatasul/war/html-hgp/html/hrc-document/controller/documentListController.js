define(['index',
    '/dts/hgp/html/hrc-document/documentFactory.js',
    '/dts/hgp/html/enumeration/documentStatusEnumeration.js',
    '/dts/hgp/html/enumeration/beneficiaryTypeEnumeration.js',
    '/dts/hgp/html/enumeration/serviceTypeEnumeration.js',
    '/dts/hgp/html/hrc-document/controller/advancedFilterController.js',
    '/dts/hgp/html/hvp-beneficiary/detail/beneficiaryDetailController.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/js/util/DateTools.js',
    '/dts/hgp/html/hrc-document/maintenance/controller/documentValuesController.js',
    '/dts/hgp/html/hrc-document/maintenance/controller/restrictionValidationController.js',
    '/dts/hgp/html/hrc-document/maintenance/controller/manualRestrictionController.js',
    '/dts/hgp/html/hrc-document/maintenance/controller/undoManualRestrictionController.js',
    '/dts/hgp/html/hrc-document/controller/statusReportController.js',
    '/dts/hgp/html/hrc-document/controller/statusReportLinkDocumentController.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/hrc-document/controller/releaseDocumentParamsController.js',
    '/dts/hgp/html/hrc-document/controller/linkDocumentsController.js',
    '/dts/hgp/html/hrc-document/controller/medicalNurseAuditorController.js',
    '/dts/hgp/html/hrc-document/controller/returnVisitToleranceController.js',
    '/dts/hgp/html/hrc-document/maintenance/controller/movementDetailsController.js',    
    '/dts/hgp/html/hrc-document/maintenance/controller/movementRestrictionsController.js',
    '/dts/hgp/html/enumeration/maintenanceTypeEnumeration.js',
    '/dts/hgp/html/hrc-document/maintenance/controller/documentCopyController.js',    
    '/dts/hgp/html/hrc-document/controller/csvConfigurationController.js',    
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    documentListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service',
        'hrc.document.Factory', '$modal', '$timeout', '$state', 'AbstractAdvancedFilterController',
        'global.userConfigs.Factory', 'TOTVSEvent'];
    function documentListController($rootScope, $scope, appViewService, documentFactory, 
            $modal, $timeout, $state, AbstractAdvancedFilterController, userConfigsFactory, TOTVSEvent) {

        var _self = this;
        $scope.StringTools = StringTools;
        $scope.DOCUMENT_STATUS_ENUM = DOCUMENT_STATUS_ENUM;
        $scope.BENEFICIARY_TYPE_ENUM = BENEFICIARY_TYPE_ENUM;
        $scope.SERVICE_TYPE_ENUM = SERVICE_TYPE_ENUM;

        this.movementOrderFields = [
            {
                title: 'Documento',
                property: "documento",
                asc: true,
                default:true
            },{
                title: 'Data de Realização',
                property: "dtRealizacao",
                asc: true
            },{
                title: 'Código do Movimento',
                property: "cdMovimento",
                asc: true
            },{
                title: 'Nome do Beneficiário',
                property: "nomBeneficiario",
                asc: true
            }
        ];
        
        this.documentOrderFields = [
            {
                title: 'Documento',
                property: "documento",
                asc: true,
                default:true
            },{
                title: 'Prestador',
                property: "prestador",
                asc: true
            },{
                title: 'Nome do Beneficiário',
                property: "nomBeneficiario",
                asc: true
            }
        ];
        
        this.selectedOrderDocField = this.documentOrderFields[0];  
        this.selectedOrderMovField = this.movementOrderFields[0];  

        // *********************************************************************************
        // *** Functions
        // *********************************************************************************	

        this.openAdvancedSearch = function () {

            var advancedFilter = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-document/ui/advanced-filter.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrc.document-advfil.Control as afController',
                resolve: {
                    disclaimers: function () {
                        return _self.disclaimers;
                    },
                    AbstractAdvancedFilterController : function(){
                        return AbstractAdvancedFilterController;
                    },
                    listaPorMovimento : function(){
                        return _self.listaPorMovimento;
                    }
                }
            });
            
            advancedFilter.result.then(function (dis) {  
                _self.search(false, true);
            });
        };
        
        this.openConfigWindow = function () {

            _self.configWindow = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-document/ui/documentListConfiguration.html',
                size: 'sm',
                backdrop: 'static',
                controller: 'global.genericConfigController as controller',
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

                        funcs.openCSVColumnsConfiguration = function(){
                            _self.openCSVColumnsConfiguration();
                        };                        

                        return funcs;
                    }
                }
            });

            _self.configWindow.result.then(function (config) {
                _self.config = angular.copy(config);
            });
        };

        this.openCSVColumnsConfiguration = function(){
            var csvColumnsConfiguration = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-document/ui/csv-columns.html',
                size: 'lg',
                backdrop: 'static', 
                controller: 'hrc.csvConfiguration.Control as controller',
                resolve: {
                    config: function () {
                        return angular.copy(_self.config);
                    },
                    programName: function(){
                        return _self.cdProgramaCorrente;
                    }
                }
            });

            csvColumnsConfiguration.result.then(function (config) {
                _self.config = angular.copy(config);
                _self.configWindow.close(_self.config);
            });
        }

        this.openDocumentValues = function (document) {

            var disclaimersAux = [];
            _self.tmpUnselectedDocuments = [];

            //todos
            if (angular.isUndefined(document) === true) {
                disclaimersAux = angular.copy(_self.disclaimers);
                
                for (var i = _self.listOfdocument.length - 1; i >= 0; i--) {
                    if(_self.listOfdocument[i].$selected == false){
                        _self.tmpUnselectedDocuments.push(_self.listOfdocument[i]);
                    }
                }
                
                if (_self.listOfdocumentCount == _self.tmpUnselectedDocuments.length){
                    $rootScope.$broadcast(TOTVSEvent.showBusinessMessage,
                        [{code: 'Atenção!',
                        detail: 'Não foram selecionados documentos para a Soma de Valores dos Documentos!',
                        type: 'error'}]
                    );
                    return;
                }
            } else {
                disclaimersAux = [{property: 'cdUnidade', value: document.cdUnidade},
                    {property: 'cdUnidadePrestadora', value: document.cdUnidadePrestadora},
                    {property: 'cdTransacao', value: document.cdTransacao},
                    {property: 'nrSerieDocOriginal', value: document.nrSerieDocOriginal},
                    {property: 'nrDocOriginal', value: document.nrDocOriginal},
                    {property: 'nrDocSistema', value: document.nrDocSistema}]
            }

            disclaimersAux.push({property: 'lgConsideraRessus', value: true});

            var documentValues = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-document/maintenance/ui/document-values.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrc.documentValues.Control as controller',
                resolve: {
                    disclaimers: function () {
                        return disclaimersAux;
                    },
                    document: function(){
                        return document;
                    },
                    tmpUnselectedDocuments: function(){
                        return _self.tmpUnselectedDocuments;
                    }
                }
            });
        };

        this.openRestrictionValidation = function (document) {
            var disclaimersAux = [];
            _self.tmpUnselectedDocuments = [];
        
            //todos
            if(angular.isUndefined(document) === true){
                disclaimersAux = angular.copy(_self.disclaimers);

                for (var i = _self.listOfdocument.length - 1; i >= 0; i--) {
                    if(_self.listOfdocument[i].$selected == false){
                        _self.tmpUnselectedDocuments.push(_self.listOfdocument[i]);
                    }
                }
                
                if (_self.listOfdocumentCount == _self.tmpUnselectedDocuments.length){
                    $rootScope.$broadcast(TOTVSEvent.showBusinessMessage,
                        [{code: 'Atenção!',
                        detail: 'Não foram selecionados documentos para Validação das Glosas!',
                        type: 'error'}]
                    );
                    return;
                }
            }else{
                disclaimersAux = [{property: 'cdUnidade', value: document.cdUnidade},
                    {property: 'cdUnidadePrestadora', value: document.cdUnidadePrestadora},
                    {property: 'cdTransacao', value: document.cdTransacao},
                    {property: 'nrSerieDocOriginal', value: document.nrSerieDocOriginal},
                    {property: 'nrDocOriginal', value: document.nrDocOriginal},
                    {property: 'nrDocSistema', value: document.nrDocSistema}]
            }

            disclaimersAux.push({property: 'lgConsideraRessus', value: false});
            disclaimersAux.push({property: "filtroPorMovimento", value: AbstractAdvancedFilterController.model.filtroPorMovimento});
            if(_self.listaPorMovimento == 1){
                disclaimersAux.push({property: "listaPorMovimento", value: true});
                _self.hasDoneSearchByMovement = true;
                pageSize = _self.config.qtdRegistrosBuscaMovto;
            }

            var restrictionValidation = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-document/maintenance/ui/restriction.validation.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrc.restrictionValidation.Control as controller',
                resolve: {
                    disclaimers: function () {
                        return disclaimersAux;
                    },
                    document: function(){
                        return document;
                    },
                    movementsList: function(){
                        return undefined;
                    },
                    movementsNumbers: function(){
                        return undefined;
                    },
                    tmpUnselectedDocuments: function(){
                        return _self.tmpUnselectedDocuments;
                    }
                }
            });
            
            restrictionValidation.result.then(function (document) {   
                var modalVar = $modal.open({
                    animation: true,
                    templateUrl: '/dts/hgp/html/hrc-document/ui/statusReport.html',
                    size: 'lg',
                    backdrop: 'static',
                    controller: 'hrc.statusReport as controller',
                    resolve: {
                        configs: function(){
                            return {
                                doneStr: 'Validados',
                                actionStr: 'Validação de Glosas'
                            };  
                        },
                        resultList: function () {
                            return document;
                        }
                    }
                });
                _self.search(false, false);
            });

        };

        this.openManualRestriction = function (document) {
            var disclaimersAux = [];
            _self.tmpUnselectedDocuments = [];
        
            //todos
            if(angular.isUndefined(document) === true){
                disclaimersAux = angular.copy(_self.disclaimers);
                
                for (var i = _self.listOfdocument.length - 1; i >= 0; i--) {
                    if(_self.listOfdocument[i].$selected == false){
                        _self.tmpUnselectedDocuments.push(_self.listOfdocument[i]);
                    }
                }

                if (_self.listOfdocumentCount == _self.tmpUnselectedDocuments.length){
                    $rootScope.$broadcast(TOTVSEvent.showBusinessMessage,
                        [{code: 'Atenção!',
                        detail: 'Não foram selecionados documentos para realizar a Glosa Manual!',
                        type: 'error'}]
                    );
                    return;
                }
                
            }else{
                disclaimersAux = [{property: 'cdUnidade', value: document.cdUnidade},
                    {property: 'cdUnidadePrestadora', value: document.cdUnidadePrestadora},
                    {property: 'cdTransacao', value: document.cdTransacao},
                    {property: 'nrSerieDocOriginal', value: document.nrSerieDocOriginal},
                    {property: 'nrDocOriginal', value: document.nrDocOriginal},
                    {property: 'nrDocSistema', value: document.nrDocSistema}]
            }

            disclaimersAux.push({property: 'lgConsideraRessus', value: false});

            var manualRestriction = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-document/maintenance/ui/manual.restriction.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrc.manualRestriction.Control as controller',
                resolve: {
                    disclaimers: function () {
                        return disclaimersAux;
                    },
                    document: function(){
                        return document;
                    },
                    movementsList: function(){
                        return undefined;
                    },
                    movementsNumbers: function(){
                        return undefined;  
                    },
                    tmpUnselectedDocuments: function(){
                        return _self.tmpUnselectedDocuments;
                    }
                }
            });
            
            manualRestriction.result.then(function (document) {   
                var modalVar = $modal.open({
                    animation: true,
                    templateUrl: '/dts/hgp/html/hrc-document/ui/statusReport.html',
                    size: 'lg',
                    backdrop: 'static',
                    controller: 'hrc.statusReport as controller',
                    resolve: {
                        configs: function(){
                            return {
                                doneStr: 'Glosados',
                                actionStr: 'Glosa Manual'
                            };  
                        },
                        resultList: function () {
                            return document;
                        }
                    }
                });
               

               _self.search(false, false);
            });
        };

        this.removeDocuments = function (document) {
            var disclaimersAux = [];
            var size = 'lg';
            _self.tmpUnselectedDocuments = [];
            
            if (angular.isUndefined(document) === true) {
                disclaimersAux = angular.copy(_self.disclaimers);
                msgDesc = 'Confirma a Remoção dos Documentos?';
                size = 'md';

                for (var i = _self.listOfdocument.length - 1; i >= 0; i--) {
                    if(_self.listOfdocument[i].$selected == false){
                        _self.tmpUnselectedDocuments.push(_self.listOfdocument[i]);
                    }
                }

                if (_self.listOfdocumentCount == _self.tmpUnselectedDocuments.length){
                    $rootScope.$broadcast(TOTVSEvent.showBusinessMessage,
                        [{code: 'Atenção!',
                        detail: 'Não foram selecionados documentos para serem removidos!',
                        type: 'error'}]
                        );
                    return;
                }

            } else {
                disclaimersAux = [{property: 'cdUnidade', value: document.cdUnidade},
                                  {property: 'cdUnidadePrestadora', value: document.cdUnidadePrestadora},
                                  {property: 'cdTransacao', value: document.cdTransacao},
                                  {property: 'nrSerieDocOriginal', value: document.nrSerieDocOriginal},
                                  {property: 'nrDocOriginal', value: document.nrDocOriginal},
                                  {property: 'nrDocSistema', value: document.nrDocSistema}];

                msgDesc = ' Documento <br>'
                        + '  Unidade Prestadora  ' + StringTools.fill(document.cdUnidadePrestadora, '0', 4)
                        + '  | Transação  ' + StringTools.fill(document.cdTransacao, '0', 4)
                        + '  | Série  '     + document.nrSerieDocOriginal 
                        + '  | Documento  ' + StringTools.fill(document.nrDocOriginal, '0', 8) 
                        + '  | Sequência  ' + StringTools.fill(document.nrDocSistema, '0', 9)
                        + '<br> <br> Confirma a Remoção?' ;
            }

            disclaimersAux.push({property: 'lgConsideraRessus', value: false});

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!',
                text: msgDesc,
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                size: size,
                callback: function (hasChooseYes) {
                    if (hasChooseYes != true) 
                        return;
                    
                    documentFactory.removeDocuments(disclaimersAux, _self.tmpUnselectedDocuments, function (result) {
                        if (result) {
                            var modalVar = $modal.open({
                                animation: true,
                                templateUrl: '/dts/hgp/html/hrc-document/ui/statusReport.html',
                                size: 'lg',
                                backdrop: 'static',
                                controller: 'hrc.statusReport as controller',
                                resolve: {
                                    configs: function(){
                                        return {
                                            doneStr: 'Removidos',
                                            actionStr: 'Remoção de Documentos',
                                            hideMovements : true
                                        };  
                                    },
                                    resultList: function () {
                                        return result;
                                    }
                                }
                            });

                            modalVar.result.then(function () {
                                _self.search();
                            });
                            
                            
                        }
                    });
                }
            }); 
        };
        
        this.releaseDocuments = function (document) {
            var disclaimersAux = [];
            var size = 'lg';
            _self.tmpUnselectedDocuments = [];
            var releaseDocumentsByInvoice = false;

            for (var i = 0; i < _self.disclaimers.length; i++) {
                if(_self.disclaimers[i].property === 'aaFaturaCdSerieNfCodFaturAp'){
                    releaseDocumentsByInvoice = true;
                }
            }
            
            if (angular.isUndefined(document) === true) {
                disclaimersAux = angular.copy(_self.disclaimers);
                size = 'md';

                for (var i = _self.listOfdocument.length - 1; i >= 0; i--) {
                    if(_self.listOfdocument[i].$selected == false){
                        _self.tmpUnselectedDocuments.push(_self.listOfdocument[i]);
                    }
                }

                if (_self.listOfdocumentCount == _self.tmpUnselectedDocuments.length){
                    $rootScope.$broadcast(TOTVSEvent.showBusinessMessage,
                        [{code: 'Atenção!',
                        detail: 'Não foram selecionados documentos para realizar a Liberação dos Documentos!',
                        type: 'error'}]
                    );
                    return;
                }
            } else {
                disclaimersAux = [{property: 'cdUnidade', value: document.cdUnidade},
                                  {property: 'cdUnidadePrestadora', value: document.cdUnidadePrestadora},
                                  {property: 'cdTransacao', value: document.cdTransacao},
                                  {property: 'nrSerieDocOriginal', value: document.nrSerieDocOriginal},
                                  {property: 'nrDocOriginal', value: document.nrDocOriginal},
                                  {property: 'nrDocSistema', value: document.nrDocSistema}]
            }

            disclaimersAux.push({property: 'lgConsideraRessus', value: false});

            var releaseDocuments = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-document/ui/releaseDocumentParams.html',
                size: size,
                backdrop: 'static',
                controller: 'hrc.releaseDocumentParams.Control as controller',
                resolve: {
                    disclaimers: function () {
                        return disclaimersAux;
                    },
                    document: function(){
                        return document;
                    },
                    batchRelease: function(){
                        return _self.doBatchExecution(document);
                    },
                    tmpUnselectedDocuments: function(){
                        return _self.tmpUnselectedDocuments;
                    },
                    source: function(){
                        return 'TISS';
                    }
                }
            });

            releaseDocuments.result.then(function (result) {
				/* ver esse if */
                if(result.$hasError){
                    return;
                }

                if(_self.doBatchExecution(document) == true){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'information', 
                        title: 'Criado pedido ' + result.nrPedido + ' para execução batch '
                            + ' da liberação de documentos.'
                    });
                    return;
                }

                var modalVar = $modal.open({
                    animation: true,
                    templateUrl: '/dts/hgp/html/hrc-document/ui/statusReport.html',
                    size: 'lg',
                    backdrop: 'static',
                    controller: 'hrc.statusReport as controller',
                    resolve: {
                        configs: function(){
                            return {
                                doneStr: 'Liberados',
                                actionStr: 'Liberação de Documentos',
                                releaseDocumentsByInvoiceStyle : releaseDocumentsByInvoice
                            };  
                        },
                        resultList: function () {
                            return result;
                        }
                    }
                });

                modalVar.result.then(function () {
                    _self.search();
                });
            });
        };

        this.unreleaseDocuments = function (document) {
            var disclaimersAux = [];
            var size = 'lg';
            _self.tmpUnselectedDocuments = [];
            var msgAleta = '<br> <br>'
                + ' <div class="alert alert-warning" role="alert"> '
                + ' <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>'   
                + ' Caso algum documento possua fatura, todos os documentos da fatura serão afetados.'
                + ' </div>';
            
            if (angular.isUndefined(document) === true) {
                disclaimersAux = angular.copy(_self.disclaimers);
                size = 'md';

                msgDesc = 'Deseja Desfazer a Liberação dos Documentos?';

                for (var i = _self.listOfdocument.length - 1; i >= 0; i--) {
                    if(_self.listOfdocument[i].$selected == false){
                        _self.tmpUnselectedDocuments.push(_self.listOfdocument[i]);
                    }
                }

                if (_self.listOfdocumentCount == _self.tmpUnselectedDocuments.length){
                    $rootScope.$broadcast(TOTVSEvent.showBusinessMessage,
                        [{code: 'Atenção!',
                        detail: 'Não foram selecionados documentos para Desfazer a Liberação dos Documentos!',
                        type: 'error'}]
                    );
                    return;
                }

                msgDesc = msgDesc + msgAleta;

            } else {
                disclaimersAux = [{property: 'cdUnidade', value: document.cdUnidade},
                                  {property: 'cdUnidadePrestadora', value: document.cdUnidadePrestadora},
                                  {property: 'cdTransacao', value: document.cdTransacao},
                                  {property: 'nrSerieDocOriginal', value: document.nrSerieDocOriginal},
                                  {property: 'nrDocOriginal', value: document.nrDocOriginal},
                                  {property: 'nrDocSistema', value: document.nrDocSistema},
                                {property: 'nrDocSistema', value: document.nrDocSistema}];

                msgDesc = ' Documento <br>'
                        + '  Unidade Prestadora  ' + StringTools.fill(document.cdUnidadePrestadora, '0', 4)
                        + '  | Transação  ' + StringTools.fill(document.cdTransacao, '0', 4)
                        + '  | Série  '     + document.nrSerieDocOriginal 
                        + '  | Documento  ' + StringTools.fill(document.nrDocOriginal, '0', 8) 
                        + '  | Sequência  ' + StringTools.fill(document.nrDocSistema, '0', 9)
                        + ' <br> <br> Deseja Desfazer a Liberação?';

                if(document.urlFatura != ''){
                    msgDesc = msgDesc + msgAleta;
                }
            }
            
            disclaimersAux.push({property: 'lgConsideraRessus', value: false});

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!',
                text: msgDesc,
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                size: size,
                callback: function (hasChooseYes) {
                    if (hasChooseYes != true) 
                        return;
                    
                    if(_self.doBatchExecution(document) == true){
                        documentFactory.batchUnreleaseDocuments(disclaimersAux, [], _self.tmpUnselectedDocuments, function (result) {
                            if(result.$hasError){
                                return;
                            }
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'information', 
                                title: 'Criado pedido ' + result.nrPedido + ' para execução batch '
                                    + ' para desfazer a liberação de documentos.'
                            });
                        });
                        return;
                    }
                    
                    documentFactory.unreleaseDocuments(disclaimersAux, [], _self.tmpUnselectedDocuments, function (result) {
                        if (result) {

                            var modalVar = $modal.open({
                                animation: true,
                                templateUrl: '/dts/hgp/html/hrc-document/ui/statusReport.html',
                                size: 'lg',
                                backdrop: 'static',
                                controller: 'hrc.statusReport as controller',
                                resolve: {
                                    configs: function(){
                                        return {
                                            doneStr: '',
                                            actionStr: 'Desfazer Liberação dos Documentos'
                                        };  
                                    },
                                    resultList: function () {
                                        return result;
                                    }
                                }
                            });

                            modalVar.result.then(function () {
                                _self.search();
                            });
                            
                            
                        }
                    });
                }
            });   
        };

        this.openLinkDocuments = function (document, showOnlyLinkedDocuments) {
            var disclaimersAux = [];
            _self.tmpUnselectedDocuments = [];
        
            //todos
            if(angular.isUndefined(document) === true){
                disclaimersAux = angular.copy(_self.disclaimers);
                
                for (var i = _self.listOfdocument.length - 1; i >= 0; i--) {
                    if(_self.listOfdocument[i].$selected == false){
                        _self.tmpUnselectedDocuments.push(_self.listOfdocument[i]);
                    }
                }

                if (_self.listOfdocumentCount == _self.tmpUnselectedDocuments.length){
                    $rootScope.$broadcast(TOTVSEvent.showBusinessMessage,
                        [{code: 'Atenção!',
                        detail: 'Não foram selecionados documentos para realizar a Vinculação de Documentos nas Internações!',
                        type: 'error'}]
                    );
                    return;
                }

                if ((_self.listOfdocumentCount - _self.tmpUnselectedDocuments.length) >= 100){
                    $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                        title: 'Atenção',
                        text: 'O filtro informado pode retornar muitos registros e a consulta pode demorar alguns minutos. Deseja continuar?',
                        cancelLabel: 'Não',
                        confirmLabel: 'Sim',
                        callback: function(lgConfirmar) {
                            if(lgConfirmar){
                                $state.go($state.get('dts/hgp/hrc-linkDocuments.edit'), 
                                         {disclaimers: angular.copy(_self.disclaimers), 
                                          config: _self.config,
                                          tmpUnselectedDocuments: _self.tmpUnselectedDocuments}); 
                            }
                        }
                    });
                    return;
                }

                $state.go($state.get('dts/hgp/hrc-linkDocuments.edit'), 
                         {disclaimers: angular.copy(_self.disclaimers), 
                          config: _self.config,
                          tmpUnselectedDocuments: _self.tmpUnselectedDocuments}); 
                
            }else{
                disclaimersAux = [{property: 'cdUnidade', value: document.cdUnidade},
                                  {property: 'cdUnidadePrestadora', value: document.cdUnidadePrestadora},
                                  {property: 'cdTransacao', value: document.cdTransacao},
                                  {property: 'nrSerieDocOriginal', value: document.nrSerieDocOriginal},
                                  {property: 'nrDocOriginal', value: document.nrDocOriginal},
                                  {property: 'nrDocSistema', value: document.nrDocSistema}];
            
                var linkDocuments = $modal.open({
                    animation: true,
                    templateUrl: '/dts/hgp/html/hrc-document/ui/linkDocuments.html',
                    size: 'lg',
                    backdrop: 'static',
                    controller: 'hrc.linkDocuments.Control as controller',
                    resolve: {
                        disclaimers: function () {
                            return disclaimersAux;
                        },
                        document: function(){
                            return document;
                        },
                        showOnlyLinkedDocuments: function(){
                            return showOnlyLinkedDocuments;
                        }
                    }
                });   
            
                linkDocuments.result.then(function (result) {   
                   _self.statusLinkResults(result);
                }); 
            }
        };
        this.applyReturnVisitTolerance = function(document){
            
             var documentValues = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-document/ui/returnVisitToleranceParams.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrc.returnVisitTolerance.Control as controller',
                resolve: {
                    disclaimers: function () {
                        return _self.disclaimers;
                    },
                    document: function(){
                        return document;
                    }
                }
            });
        }
        
        this.statusLinkResults = function(result){

            var modalVar = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-document/ui/statusReportLinkDocument.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrc.statusReportLinkDocument.Control as controller',
                resolve: {
                    configs: function(){
                        return {
                            doneStr: 'Vinculados',
                            actionStr: 'Vinculação de Documentos'
                        };  
                    },
                    resultList: function () {
                        return result;
                    }
                }
            });

        }
        
        this.openUndoManualRestriction = function (document) {
            var disclaimersAux = [];
            _self.tmpUnselectedDocuments = [];
        
            //todos
            if(angular.isUndefined(document) === true){
                disclaimersAux = angular.copy(_self.disclaimers);
                
                for (var i = _self.listOfdocument.length - 1; i >= 0; i--) {
                    if(_self.listOfdocument[i].$selected == false){
                        _self.tmpUnselectedDocuments.push(_self.listOfdocument[i]);
                    }
                }

                if (_self.listOfdocumentCount == _self.tmpUnselectedDocuments.length){
                    $rootScope.$broadcast(TOTVSEvent.showBusinessMessage,
                        [{code: 'Atenção!',
                        detail: 'Não foram selecionados documentos para Desfazer a Glosa Manual!',
                        type: 'error'}]
                    );
                    return;
                }                
            }else{
                disclaimersAux = [{property: 'cdUnidade', value: document.cdUnidade},
                                  {property: 'cdUnidadePrestadora', value: document.cdUnidadePrestadora},
                                  {property: 'cdTransacao', value: document.cdTransacao},
                                  {property: 'nrSerieDocOriginal', value: document.nrSerieDocOriginal},
                                  {property: 'nrDocOriginal', value: document.nrDocOriginal},
                                  {property: 'nrDocSistema', value: document.nrDocSistema}];
            }

            disclaimersAux.push({property: 'lgConsideraRessus', value: false});

            var undoManualRestriction = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-document/maintenance/ui/undoManualRestriction.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrc.undoManualRestriction.Control as controller',
                resolve: {
                    disclaimers: function () {
                        return disclaimersAux;
                    },
                    document: function(){
                        return document;
                    },
                    movementsList: function(){
                        return undefined;
                    },
                    movementsNumbers: function(){
                        return undefined;  
                    },
                    tmpUnselectedDocuments: function(){
                        return _self.tmpUnselectedDocuments;
                    }
                }
            });   
        
            undoManualRestriction.result.then(function (result) {   
               var modalVar = $modal.open({
                    animation: true,
                    templateUrl: '/dts/hgp/html/hrc-document/ui/statusReport.html',
                    size: 'lg',
                    backdrop: 'static',
                    controller: 'hrc.statusReport as controller',
                    resolve: {
                        configs: function(){
                            return {
                                doneStr: '',
                                actionStr: 'Desfazer Glosa Manual dos Documentos'
                            };  
                        },
                        resultList: function () {
                            return result;
                        }
                    }
                });

                modalVar.result.then(function () {
                    _self.search();
                });

            });
        };

        this.openMedicalAuditor = function (document) {
            var disclaimersAux = [];
            _self.tmpUnselectedDocuments = [];
            
            if (angular.isUndefined(document) === true) {
                disclaimersAux = angular.copy(_self.disclaimers);

                for (var i = _self.listOfdocument.length - 1; i >= 0; i--) {
                    if(_self.listOfdocument[i].$selected == false){
                        _self.tmpUnselectedDocuments.push(_self.listOfdocument[i]);
                    }
                }

                if (_self.listOfdocumentCount == _self.tmpUnselectedDocuments.length){
                    $rootScope.$broadcast(TOTVSEvent.showBusinessMessage,
                        [{code: 'Atenção!',
                        detail: 'Não foram selecionados documentos para informar o Medico/Enfermeiro Auditor!',
                        type: 'error'}]
                    );
                    return;
                }
            } else {
                disclaimersAux = [{property: 'cdUnidade', value: document.cdUnidade},
                                  {property: 'cdUnidadePrestadora', value: document.cdUnidadePrestadora},
                                  {property: 'cdTransacao', value: document.cdTransacao},
                                  {property: 'nrSerieDocOriginal', value: document.nrSerieDocOriginal},
                                  {property: 'nrDocOriginal', value: document.nrDocOriginal},
                                  {property: 'nrDocSistema', value: document.nrDocSistema}]
            }

            disclaimersAux.push({property: 'lgConsideraRessus', value: false});

            var medicalAuditorModal = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-document/ui/medicalNurseAuditor.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrc.medicalNurseAuditor.Control as controller',
                resolve: {
                    disclaimers: function () {
                        return disclaimersAux;
                    },
                    batchRelease: function(){
                        return _self.doBatchExecution(document);
                    },
                    tmpUnselectedDocuments: function(){
                        return _self.tmpUnselectedDocuments;
                    }
                }
            });

            medicalAuditorModal.result.then(function (result) {
                if(result.$hasError){
                    return;
                }

                if(_self.doBatchExecution(document) == true){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'information', 
                        title: 'Criado pedido ' + result.nrPedido + ' para execução batch '
                            + ' da liberação de documentos.'
                    });
                    return;
                }

                var modalVar = $modal.open({
                    animation: true,
                    templateUrl: '/dts/hgp/html/hrc-document/ui/statusReport.html',
                    size: 'lg',
                    backdrop: 'static',
                    controller: 'hrc.statusReport as controller',
                    resolve: {
                        configs: function(){
                            return {
                                doneStr: '',
                                actionStr: 'Documentos'
                            };  
                        },
                        resultList: function () {
                            return result;
                        }
                    }
                });
            });
        };
        
        this.removeDisclaimer = function (disclaimer) {

            for (var i = 0; i < _self.disclaimers.length; i++) {
                if (_self.disclaimers[i].property === disclaimer.property) {
                    _self.disclaimers.splice(i, 1);
                }
            }

            _self.search(false, false);
        };

        this.getListOfMovements = function(result){

            if(result.tmpMovementInput){
                angular.forEach(result.tmpMovementInput, function (myMovement) {
                    myMovement = _self.prepareMovementToView(myMovement);
                    _self.listOfInputs.push(myMovement);
                    _self.bothMovementList.push(myMovement);
                });
            }

            if(result.tmpMovementProcedure){
                angular.forEach(result.tmpMovementProcedure, function (myMovement) {
                    myMovement = _self.prepareMovementToView(myMovement);
                    _self.listOfProcedures.push(myMovement);
                    _self.bothMovementList.push(myMovement);
                    });
            }

            _self.bothMovementList.sort(function(a,b) {
                return a.idRegistro < b.idRegistro ? -1 : a.idRegistro > b.idRegistro ? 1 : 0;
                });
        }

        this.prepareMovementToView= function(myMovement){
                        if (myMovement.cdTipoInsumo != 0){
                            myMovement.rotuloMovto = StringTools.fill(myMovement.cdTipoInsumo, '0', 2)
                                                   + myMovement.rotulo;
                        }else{
                            myMovement.rotuloMovto = myMovement.rotulo;
                        }

                        myMovement.filterField = myMovement.document.urlChave 
                                        + "|" + myMovement.rotulo
                                               + "|" + myMovement.document.rotuloBenef
                                               + "|" + myMovement.provider.preserv.rotulo
                                        + "|" + myMovement.dtRealizacao
                                               + "|" + myMovement.provider.vlCobrado
                                               + "|" + myMovement.provider.vlMovimento;
                        myMovement.selected = true;
            return myMovement;
        }

        this.search = function (isMore, isAdvancedFilter) {

            var startAt = 0;
            var pageSize = _self.config.qtdRegistrosBusca;
            _self.listOfdocumentCount = 0;
            _self.hasDoneSearch = false;
            _self.hasDoneSearchByMovement = false;
            _self.allDocsRessus = true;
            var searchOrder = _self.selectedOrderDocField;

            if(_self.listaPorMovimento == 1){
                searchOrder = _self.selectedOrderMovField;
            }

            if (isMore) {
                startAt = this.listOfdocument.length + 1;

                if(_self.listaPorMovimento == 1){
                    startAt = 1;
                    startAt = startAt + _self.listOfProcedures.length;
                    startAt = startAt + _self.listOfInputs.length;
                } 
            } else {
                _self.listOfdocument = [];
                _self.listOfInputs = [];
                _self.listOfProcedures = [];     
                _self.bothMovementList = [];
                _self.numRegisters = 0;
                _self.proceduresCount = 0;
                _self.inputsCount = 0;
            }
            
            var filters = _self.getSearchFilters(isAdvancedFilter);

            if(filters.length == 0)
                return; 

            documentFactory.getDocumentsByFilter(
                "", startAt, pageSize,
                true, filters, 
                [searchOrder],
                 function (result) {                    
                    _self.hasDoneSearch = true;
                    if (result) {
                        _self.listOfdocumentCount = result.countRegister;                        

                        if (!isMore) {
                            _self.totalProceduresCount = result.countProcedureRegister;
                            _self.totalInputsCount = result.countInputRegister;
                        }

                        angular.forEach(result.tmpDocrecon, function (value) {
                            value.$selected = true;

                            _self.listOfdocument.push(value);  
                            //_self.proceduresCount = _self.proceduresCount + value.tmpMovementProcedure.length;
                            //_self.inputsCount = _self.inputsCount + value.tmpMovementInput.length;

                            if (!value.isRessus) {
                                _self.allDocsRessus = false;
                            }
                        });

                        _self.getListOfMovements(result);

                        _self.numRegisters = 0;

                        if(_self.listaPorMovimento == 1){
                            _self.proceduresCount =  _self.listOfProcedures.length;
                            _self.inputsCount  = _self.listOfInputs.length;
                            _self.numRegisters = _self.listOfProcedures.length;
                            _self.numRegisters = _self.numRegisters + _self.listOfInputs.length;
                        }
                        else{
                            _self.numRegisters = _self.listOfdocument.length;
                        } 
                        
                        $timeout(function(){
                            _self.setDocumentVisualization(_self.config.documentDetailLevel);
                        },100);
                        
                        if (isMore === false) {
                            $('.page-wrapper').scrollTop(0);
                        }
                    }
                });

            this.setPageTitle();
        };

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        this.init = function () {  
            appViewService.startView("Central Guias TISS", 'hrc.documentList.Control', _self);
                
            if(appViewService.lastAction != 'newtab'){
                $timeout(function(){
                    _self.setDocumentVisualization(_self.documentDetailLevel);
                },100);
                return;
            }

            _self.allDocsRessus = true;
            
            _self.addEventListeners();

            _self.documentDetailLevel = 2;
            
            _self.cdProgramaCorrente = 'hrc.documentList';
            _self.disclaimers = [];
            _self.config = {};
            _self.configWindow = {};
            
            _self.hasDoneSearch = false;
            _self.listOfdocument = [];
            _self.bothMovementList = [];
            _self.listOfProcedures = [];
            _self.listOfInputs = [];
            _self.listOfdocumentCount = 0;
            _self.totalInputsCount = 0;
            _self.totalProceduresCount = 0;
            _self.inputsCount = 0;
            _self.proceduresCount = 0;
            _self.numRegisters = 0;
            _self.tmpUnselectedDocuments = [];
            _self.listaPorMovimento = 0;
            _self.hasDoneSearchByMovement = false;
            _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
            _self.serviceTypeSelectedTab = 0;
            _self.pageTitle = "";
            _self.resultByFilter;
            
            userConfigsFactory.getConfigByKey(
                    $rootScope.currentuser.login, 
                    _self.cdProgramaCorrente,
                function(result){
                   if(angular.isUndefined(result) == true){
                        _self.config = { lgBuscarAoAbrirTela  : true,
                                         qtdRegistrosBusca    : "20",
                                         qtdRegistrosMovto    : "100",
                                         documentDetailLevel  : 2,
                                         minDoctosExecBatch   : "20",
                                         minMovtosSaveExecBatch : "0",
                                         listaPorMovimento    : 0};
                        _self.listaPorMovimento = 0; 
                        _self.pageTitle = "Documentos";
                   }else{
                        _self.config = result.desConfig;

                        if(_self.config.listaPorMovimento)
                            _self.listaPorMovimento = _self.config.listaPorMovimento;
                        
                        if(_self.config.disclaimers){
                            _self.disclaimers = angular.copy(_self.config.disclaimers);
                        }
                        
                        if(_self.config.lgBuscarAoAbrirTela == true){
                            _self.search(false);
                       }
                   }
                });            
        };

        this.setDocumentVisualization = function(level){
            _self.documentDetailLevel = level;
            
            switch(level){
                case 0:
                    $('.beneficiary-details').css('display','none');
                    $('.provider-details').css('display','none');
                    break;
                case 1:
                    $('.beneficiary-details').css('display','block');
                    $('.provider-details').css('display','none');
                    break;
                case 2:
                    $('.beneficiary-details').css('display','block');
                    $('.provider-details').css('display','block');
                    break;
            }  

            if(level == _self.config.documentDetailLevel){
                return;
            }

            _self.config.documentDetailLevel = level;
            
            userConfigsFactory.saveUserConfiguration($rootScope.currentuser.login, 
                _self.cdProgramaCorrente, _self.config ,undefined, {noCountRequest: true}); 

        };
        
        this.doBatchExecution = function(document){
            if(angular.isUndefined(document) == false){
                return false;
            }

            if((_self.listOfdocumentCount - _self.tmpUnselectedDocuments.length) > _self.config.minDoctosExecBatch){
                return true;
            }
            return false;
        };

        this.openCloseDetail = function($index){         

            var id = '#document' + $index;
            if(_self.documentDetailLevel != 2){   
                $(id + ' .provider-details').slideToggle();
                if(_self.documentDetailLevel != 1){
                    $(id + ' .beneficiary-details').slideToggle();
                }
            }
        };

        this.setListVisualization = function (option){
            _self.listaPorMovimento = option;
            _self.config.listaPorMovimento = _self.listaPorMovimento;

            _self.search(false);

            userConfigsFactory.saveUserConfiguration($rootScope.currentuser.login, 
                _self.cdProgramaCorrente, _self.config ,undefined, {noCountRequest: true}); 
        }

        this.onListOrderChange = function(){
            $timeout(function(){        
                _self.listOfdocument = [];
                _self.listOfProcedures = [];
                _self.listOfInputs = [];                
                _self.bothMovementList = [];            
                _self.search(false);
            });
        };

        this.addEventListeners = function(){
          
            $rootScope.$on('documentInvalidation',function(event, changedDoc){

                if(!_self.listOfdocument
                || _self.listOfdocument.length == 0){
                    return;
                }

                for (var i=0; i < _self.listOfdocument.length; i++) {
                    var document = _self.listOfdocument[i];
                    var indAux = i;
                    
                    if(document.cdUnidade           == changedDoc.cdUnidade
                    && document.cdUnidadePrestadora == changedDoc.cdUnidadePrestadora
                    && document.cdTransacao         == changedDoc.cdTransacao
                    && document.nrSerieDocOriginal  == changedDoc.nrSerieDocOriginal
                    && document.nrDocOriginal       == changedDoc.nrDocOriginal
                    && document.nrDocSistema        == changedDoc.nrDocSistema){
                
                        documentFactory.getDocumentsByFilter('', 0, 0, false,[
                                {property:'cdUnidade'           , value: document.cdUnidade             , priority:9},
                                {property:'cdUnidadePrestadora' , value: document.cdUnidadePrestadora   , priority:8},
                                {property:'cdTransacao'         , value: document.cdTransacao           , priority:7},
                                {property:'nrSerieDocOriginal'  , value: document.nrSerieDocOriginal    , priority:6},
                                {property:'nrDocOriginal'       , value: document.nrDocOriginal         , priority:5},
                                {property:'nrDocSistema'        , value: document.nrDocSistema          , priority:4},
                                {property: HibernateTools.SEARCH_OPTION_CONSTANT, value: 'Descriptions'}
                            ],[],[], function(result){
                                if(result){
                                    var docAux = result[0];
                                    docAux.$selected = document.$selected;
                                    _self.listOfdocument[indAux] = docAux;
                                }
                        }, {noCountRequest: true});
                        break;
                    }
                }
            });  
        };

        this.openMovementDetails = function(register){
            
            var procInsuAux = {cdUnidade : register.document.cdUnidade,
                              cdUnidadePrestadora : register.document.cdUnidadePrestadora,
                              cdTransacao : register.document.cdTransacao,
                              nrSerieDocOriginal : register.document.nrSerieDocOriginal,
                              nrDocOriginal : register.document.nrDocOriginal,
                              nrDocSistema : register.document.nrDocSistema,
                              nrProcesso : register.provider.nrProcesso,
                              nrSeqDigitacao : register.provider.nrSeqDigitacao,
                              cdMovimento: register.cdMovimento,
                              tpMovimento : register.tpMovimento};                   

            if(register.tpMovimento == 'INSU'){
                procInsuAux.cdTipoInsumo = register.cdTipoInsumo;
                procInsuAux.cdInsumo     = register.cdMovimento;
            }

            var movementDetails = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-document/maintenance/ui/movementDetails.html',
                backdrop: 'static',
                windowClass: 'extra-large',
                controller: 'hrc.movementDetails.Control as controller',
                resolve: {
                    procInsu: function(){
                        return procInsuAux;
                    }
                }
            });
        };

        this.openMovementRestrictions = function(register){
            var procInsuAux = {cdUnidade : register.document.cdUnidade,
                               cdUnidadePrestadora : register.document.cdUnidadePrestadora,
                               cdTransacao : register.document.cdTransacao,
                               nrSerieDocOriginal : register.document.nrSerieDocOriginal,
                               nrDocOriginal : register.document.nrDocOriginal,
                               nrDocSistema : register.document.nrDocSistema,
                               nrProcesso : register.provider.nrProcesso,
                               nrSeqDigitacao : register.provider.nrSeqDigitacao,
                               tpMovimento : register.tpMovimento,
                               rotuloMovimento: register.rotulo,
                               cdMovimento: register.cdMovimento,
                               movementKey: []};
                              
            if(register.tpMovimento == 'INSU'){
                procInsuAux.cdTipoInsumo = register.cdTipoInsumo;
                procInsuAux.cdInsumo     = register.cdMovimento;
            }

            var movementRestriction = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-document/maintenance/ui/movementRestrictions.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrc.movementRestrictions.Control as controller',
                resolve: {
                    disclaimers: function(){
                        return undefined;
                    },
                    document: function(){
                        return register.document;
                    },
                    procInsu: function(){
                        return procInsuAux;
                    },                
                    maintenanceType: function(){
                        return MAINTENANCE_TYPE_ENUM.LIST_MOVEMENTS
                    },  
                    action: function() {
                        //nao permite validar glosas ou glosar manual
                        //qdo trata-se de um movto de pacote
                        if(register.idRegistroPacote > 0)
                            return 'DETAIL';

                        //movimentos de baixa de aviso
                        //nao podem ser modificados
                        if(register.lgBaixaAvisoVlZerado)
                            return 'DETAIL';

                        //movimentos do ressus
                        //nao podem ser modificados
                        if(register.lgRessus)
                            return 'DETAIL';

                        return 'EDIT';
                    }
                }
            });

            movementRestriction.result.then(function (result) {
                if(register.tpMovimento != 'PACOTE') {
                    register.provider.vlGlosado = result.vlGlosado;
                    register.provider.inStatus = result.cdValidacao;
                }
            });            
        };
        
        this.changeServiceTypeTab = function(serviceType){
            _self.serviceTypeSelectedTab = serviceType;
           this.setPageTitle();
        }

        this.setPageTitle = function(){
            if(_self.listaPorMovimento == 1){
                _self.pageTitle = "Movimentos";
            }else{
                _self.pageTitle = "Documentos";
            } 
        }

        this.printCSV = function(isAdvancedFilter){
            var filters = _self.getSearchFilters(false);
            var searchOrder = _self.selectedOrderDocField;

            if(_self.config.csvColumns == undefined){
                _self.config.csvColumns = [];
            }

            if(_self.listaPorMovimento == 1){
                searchOrder = _self.selectedOrderMovField;
            }
 
            documentFactory.printCSV(
                "", 0, 0,
                true, filters, 
                [searchOrder],_self.config.csvColumns,
                 function (result) {    
            });

        }

        this.getSearchFilters = function(isAdvancedFilter){
            var filters = [];
            filters = _self.disclaimers.slice();

            //Caso não possua filtros não realiza busca dos documentos
            if(filters.length == 0){
                return filters;
            }      
            
            filters.push({property: HibernateTools.SEARCH_OPTION_CONSTANT, value: 'Descriptions'});
            filters.push({property: "lgConsideraRessus", value: true});

            if (isAdvancedFilter){                    
                _self.listaPorMovimento = AbstractAdvancedFilterController.model.listaPorMovimento;
            }

            filters.push({property: "filtroPorMovimento", value: AbstractAdvancedFilterController.model.filtroPorMovimento});

            if(_self.listaPorMovimento == 1){
                filters.push({property: "listaPorMovimento", value: true});
                filters.push({property: "inTipoServicoAbaSelecionada", value: _self.serviceTypeSelectedTab});
                _self.hasDoneSearchByMovement = true;
                pageSize = _self.config.qtdRegistrosBuscaMovto;
            }

            for (var i = filters.length - 1; i >= 0; i--) {
                if(filters[i].property == "cdPacote"){
                    filters[i].value = filters[i].value.replace(' (A)', '')
                                                       .replace(' (P)', '');
                    break;
                }
            }

            return filters;
        }

        this.openDocumentCopy = function (document) {
            var disclaimersAux = [];
            _self.tmpUnselectedDocuments = [];
        
            if(!angular.isUndefined(document)){
                disclaimersAux = [{property: 'cdUnidade', value: document.cdUnidade},
                    {property: 'cdUnidadePrestadora', value: document.cdUnidadePrestadora},
                    {property: 'cdTransacao', value: document.cdTransacao},
                    {property: 'nrSerieDocOriginal', value: document.nrSerieDocOriginal},
                    {property: 'nrDocOriginal', value: document.nrDocOriginal},
                    {property: 'nrDocSistema', value: document.nrDocSistema}]
            }

            disclaimersAux.push({property: 'lgConsideraRessus', value: false});

            var copyDocuments = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-document/maintenance/ui/document-copy.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrc.documentCopy.Control as controller',
                resolve: {
                    disclaimers: function () {
                        return disclaimersAux;
                    },
                    document: function(){
                        return document;
                    },
                }
            });
            
            copyDocuments.result.then(function (document) {               
               _self.search(false, false);
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
    

    index.register.controller('hrc.documentList.Control', documentListController);

});
