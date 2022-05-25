define(['index',
    '/dts/hgp/html/hrc-documentosExportAvisosCob/documentosExportAvisosCobFactory.js',
    '/dts/hgp/html/enumeration/documentosExportAvisosCobStatusEnumeration.js',
    '/dts/hgp/html/hrc-documentosExportAvisosCob/controller/advancedFilterController.js',
    '/dts/hgp/html/hrc-documentosExportAvisosCob/controller/documentosExportAvisosCobHistSitController.js',
    '/dts/hgp/html/hrc-documentosExportAvisosCob/controller/documentosExportAvisosCobErrorMessagesController.js',
    '/dts/hgp/html/hrc-documentosExportAvisosCob/controller/documentosExportAvisosCobRemoverController.js',    
    '/dts/hgp/html/hrc-documentosExportAvisosCob/controller/documentosExportAvisosCobReprocessarController.js',   
    '/dts/hgp/html/hvp-beneficiary/detail/beneficiaryDetailController.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/js/util/DateTools.js',    
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/js/util/HibernateTools.js',    
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    documentosExportAvisosCobListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service',
        'hrc.documentosExportAvisosCob.Factory','$modal', '$timeout', '$state', 'AbstractAdvancedFilterController',
        'global.userConfigs.Factory', 'TOTVSEvent'];
    function documentosExportAvisosCobListController($rootScope, $scope, appViewService, documentosExportAvisosCobFactory, 
             $modal, $timeout, $state, AbstractAdvancedFilterController, userConfigsFactory, TOTVSEvent) {

        var _self = this;
        $scope.StringTools = StringTools;
        $scope.DOCUMENTOS_AVISOS_STATUS_EXP_ENUM = DOCUMENTOS_AVISOS_STATUS_EXP_ENUM;

        // *********************************************************************************
        // *** Functions
        // *********************************************************************************	

        this.openAdvancedSearch = function () {

            var advancedFilter = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-documentosExportAvisosCob/ui/advanced-filter.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrc.documentosExportAvisosCob-advfil.Control as afController',
                resolve: {
                    disclaimers: function () {
                        return _self.disclaimers;
                    },
                    AbstractAdvancedFilterController : function(){
                        return AbstractAdvancedFilterController;
                    }
                }
            });
            
            advancedFilter.result.then(function (dis) {

                _self.search(false);
            });
        };
        
        this.openConfigWindow = function () {

            var configWindow = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-documentosExportAvisosCob/ui/documentosExportAvisosCobListConfiguration.html',
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

                        return funcs;
                    }
                }
            });

            configWindow.result.then(function (config) {
                _self.config = angular.copy(config);
            });
            
        };
        
        this.searchHistSituation = function (idSeqAvisoCob) {

            var searchHistSituation = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-documentosExportAvisosCob/ui/documentosExportAvisosCobHistSit.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrc.documentosExportAvisosCobHistSit.Control as controller',
                resolve: {
                    idSeqAvisoCob: function(){  
                        return idSeqAvisoCob;  
                    },
                }                         
            });

        };

        this.searchErrorMessages = function (idSeqAvisoCob) {

            var searchErrorMessages = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-documentosExportAvisosCob/ui/documentosExportAvisosCobErrorMessages.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrc.documentosExportAvisosCobErrorMessages.Control as controller',
                resolve: {
                    idSeqAvisoCob: function(){  
                        return idSeqAvisoCob;  
                    },
                }                         
            });

        };

        this.removeDisclaimer = function (disclaimer) {

            for (var i = 0; i < _self.disclaimers.length; i++) {
                if (_self.disclaimers[i].property === disclaimer.property) {
                    _self.disclaimers.splice(i, 1);
                }
            }

            _self.search(false);
        };

        this.search = function (isMore) {
            var startAt = 0;
            this.listTmpDoctoAvisoCobCount = 0;

            _self.hasDoneSearch = false;

            if (isMore) {
                startAt = this.listTmpDoctoAvisoCob.length + 1;
            } else {
                this.listTmpDoctoAvisoCob = [];
            }

            //Limpa o campo de busca 
            _self.searchInputText = ''; 
            
            var filters = [];                    

            filters = this.disclaimers.slice();

            //Caso não possua filtros não realiza busca dos documentos
            if(filters.length == 0){
                return;
            } 
               

            documentosExportAvisosCobFactory.getTodosDocumentosAvisos(startAt,parseInt(_self.config.qtdRegistrosBusca),true,filters, function (result) {                    
                    _self.hasDoneSearch = true;
                    if (result) {    

                        _self.listTmpDoctoAvisoCobCount = result.QP_numRegisters;      

                        angular.forEach(result.tmpDoctoAvisoCob, function (document) {
                            document.$selected = true;
                        });

                        if (_self.listTmpDoctoAvisoCob.length == 0){
                            _self.listTmpDoctoAvisoCob = result.tmpDoctoAvisoCob;
                        }else{                   
                            _self.listTmpDoctoAvisoCob = _self.listTmpDoctoAvisoCob.concat(result.tmpDoctoAvisoCob);                                                                    
                        }
                        if (isMore === false) {
                            $('.page-wrapper').scrollTop(0);
                        }
                    }
                });
        };


        this.removerDocumentosAvisos = function(tipo,tmpDoctoAvisoCob){            
            let isBatch = false;
            let isTodosDocumentos = false;
            let tmpNaoSelecDoctoAvisoCob = [];
            let hasChooseYes = false;

            if (tmpDoctoAvisoCob == undefined){
                tmpDoctoAvisoCob = [];
            }

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!',
                text: 'Você realmente deseja remover o(s) aviso(s) de cobrança selecionado(s)?',                    
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                size: 'md',
                callback: function (hasChooseYes) {                    
                    if (!hasChooseYes ) {
                        return;
                    }
                    if (tipo == "Selecionados"){  
						for (var i = 0; i < _self.listTmpDoctoAvisoCob.length; i++) {					
							if (!_self.listTmpDoctoAvisoCob[i].$selected){
								tmpNaoSelecDoctoAvisoCob.push(_self.listTmpDoctoAvisoCob[i]);
							}
						}							  
                         /* tmpNaoSelecDoctoAvisoCob = _self.listTmpDoctoAvisoCob.filter (e => !e.$selected); */
                        if ((_self.listTmpDoctoAvisoCobCount - tmpNaoSelecDoctoAvisoCob.length) >= _self.config.minDoctosExecBatch){
                            isBatch = true;                    
                        }                                                           
                    }else {
                        if (1 >= _self.config.minDoctosExecBatch){    
                            isBatch = true;   
                        }   
                    }

                    var filters = [];                    
                    filters = _self.disclaimers.slice(); 
                    if (!isBatch){
                        var removerDocumts = $modal.open({
                            animation: true,
                            templateUrl: '/dts/hgp/html/hrc-documentosExportAvisosCob/ui/documentosExportAvisosCobRemover.html',
                            size: "xlg",
                            backdrop: 'static',
                            controller: 'hrc.documentosExportAvisosCobRemover.Control as controller',
                            resolve: {
                                tmpDoctoAvisoCob: function(){
                                    return tmpDoctoAvisoCob;
                                },                        
                                disclaimers: function () {
                                    return _self.disclaimers;
                                },
                                tmpNaoSelecDoctoAvisoCob: function(){
                                    return tmpNaoSelecDoctoAvisoCob;
                                }
                            }                                                       
                        });

                        removerDocumts.result.then(function (callback) {
                            _self.search(false);
                        });                  
                    }else{ /* Se execucao por Batch */
                        documentosExportAvisosCobFactory.postDeletarAvisosCobrancas(tmpDoctoAvisoCob,filters,isBatch,tmpNaoSelecDoctoAvisoCob, function (result) { 
                            _self.hasDoneSearch = true;
                            if (result) {                                             
                                if (result.$hasError){
                                        return;
                                }else{
                                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                        type: 'information', 
                                        title: 'Criado pedido ' + result.nrPedido + ' para execução batch '
                                            + ' da remoção de documentos de aviso de cobrança.'
                                    });                            
                                }
                            }     
                            _self.hasDoneSearch = false;
                        });
                    }
                }
            });
        }

        this.reprocessarDocumentosAvisos = function(tipo,tmpDoctoAvisoCob){            
            let isBatch = false;
            let isTodosDocumentos = false;
            let tmpNaoSelecDoctoAvisoCob = [];
            let hasChooseYes = false;

            if (tmpDoctoAvisoCob == undefined){
                tmpDoctoAvisoCob = [];
            }

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!',
                text: 'Esse processo tentará estabelecer comunicação com a unidade origem do beneficiário. Você realmente deseja reprocessar o(s) aviso(s) de cobrança selecionado(s)?',
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                size: 'md',
                callback: function (hasChooseYes) {                    
                    if (!hasChooseYes ) {
                        return;
                    }
                    if (tipo == "Selecionados"){  
						for (var i = 0; i < _self.listTmpDoctoAvisoCob.length; i++) {					
							if (!_self.listTmpDoctoAvisoCob[i].$selected){
								tmpNaoSelecDoctoAvisoCob.push(_self.listTmpDoctoAvisoCob[i]);
							}
						}							  
                         /* tmpNaoSelecDoctoAvisoCob = _self.listTmpDoctoAvisoCob.filter (e => !e.$selected); */
                        if ((_self.listTmpDoctoAvisoCobCount - tmpNaoSelecDoctoAvisoCob.length) >= 2){
                            isBatch = true;                    
                        }                                                           
                    }else {
                        if (1 >= _self.config.minDoctosExecBatch){    
                            isBatch = true;   
                        }   
                    }

                    var filters = [];                    
                    filters = _self.disclaimers.slice(); 
                    if (!isBatch){
                        var reprocessarDocumts = $modal.open({
                            animation: true,
                            templateUrl: '/dts/hgp/html/hrc-documentosExportAvisosCob/ui/documentosExportAvisosCobReprocessar.html',
                            size: "xlg",
                            backdrop: 'static',
                            controller: 'hrc.documentosExportAvisosCobReprocessar.Control as controller',
                            resolve: {
                                tmpDoctoAvisoCob: function(){
                                    return tmpDoctoAvisoCob;
                                },                        
                                disclaimers: function () {
                                    return _self.disclaimers;
                                },
                                tmpNaoSelecDoctoAvisoCob: function(){
                                    return tmpNaoSelecDoctoAvisoCob;
                                }
                            }                                                       
                        });

                        reprocessarDocumts.result.then(function (callback) {
                            _self.search(false);
                        });                  
                    }else{ /* Se execucao por Batch */
                        documentosExportAvisosCobFactory.comunicarAvisoComErro(tmpDoctoAvisoCob,filters,isBatch,tmpNaoSelecDoctoAvisoCob, function (result) { 
                            _self.hasDoneSearch = true;
                            if (result) {                                             
                                if (result.$hasError){
                                        return;
                                }else{
                                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                        type: 'information', 
                                        title: 'Pedido de execução ' + result.nrPedido + ' criado com sucesso.'
                                    });                            
                                }
                            }     
                            _self.hasDoneSearch = false;
                        });
                    }
                }
            });
        }

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        this.init = function () {  
            appViewService.startView("Consulta Avisos de Cobrança Exportados", 'hrc.documentExportedNoticesEventList.Control', _self);
            
           /* _self.addEventListeners();*/
            _self.cdProgramaCorrente = 'hrc.documentExportedNoticesEventList';
        
            if(appViewService.lastAction != 'newtab'){
                $timeout(function(){
                    _self.search(false);
                },100);
                return;
            }
            
            _self.config = {};
			_self.disclaimers = [];            
            _self.hasDoneSearch = false;
            _self.listTmpDoctoAvisoCob = [];
            _self.listTmpDoctoAvisoCobCount = 0;            
            
            _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
            
            userConfigsFactory.getConfigByKey(
                    $rootScope.currentuser.login, 
                    _self.cdProgramaCorrente,
                function(result){
                   if(angular.isUndefined(result) == true){
                        _self.config = { lgBuscarAoAbrirTela  : true,
                                         qtdRegistrosBusca    : "20",                                         
                                         minDoctosExecBatch   : "20"};
                                    
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
        if ($rootScope.currentuserLoaded) {
            this.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }        
    }

    index.register.controller('hrc.documentosExportAvisosCobList.Control', documentosExportAvisosCobListController);

});
