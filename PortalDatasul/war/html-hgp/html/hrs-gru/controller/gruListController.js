define(['index', 
    '/dts/hgp/html/hrs-gru/gruFactory.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hrs-gru/maintenance/controller/gruMaintenanceController.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/enumeration/gruStatusEnumeration.js',
    '/dts/hgp/html/hrc-document/controller/releaseDocumentParamsController.js',
    '/dts/hgp/html/hrc-document/documentFactory.js',
],
function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    gruListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service',
                                 'hrs.gru.Factory','global.userConfigs.Factory','$modal',
                                 'AbstractAdvancedFilterController', 'hrc.document.Factory','TOTVSEvent'];
    function gruListController($rootScope, $scope, appViewService,
                               gruFactory, userConfigsFactory, $modal,
                               AbstractAdvancedFilterController, documentFactory, TOTVSEvent) {

        var _self = this;

        $scope.StringTools = StringTools;
        $scope.GRU_STATUS_ENUM = GRU_STATUS_ENUM;

        _self.cdProgramaCorrente = 'hrs.gruList';
        _self.config = [];
        _self.listItemInfoClasses = "col-sm-3 col-md-3 col-lg-3 col-sm-height";
        _self.disclaimers = [];
        _self.listOfGru = [];
        _self.listOfGruCount = 0;

        this.init = function(){

            appViewService.startView("Cadastro de GRU", 'hrs.gruList.Control', _self);

            if(appViewService.lastAction != 'newtab'){
                return;
            }

            userConfigsFactory.getConfigByKey($rootScope.currentuser.login,
                                              _self.cdProgramaCorrente,
            function(result){

               if(angular.isUndefined(result) == true){
                    _self.config = {lgBuscarAoAbrirTela : true,
                                    qtdRegistrosBusca   : "20"};
                    _self.search(false);
               } else {
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

        this.search = function (isMore) {

            var startAt = 0;
            _self.listOfGruCount = 0;

            if (isMore) {
                startAt = _self.listOfGru.length + 1;
            } else {
                _self.listOfGru = [];
            }
            //Testa se foi preenchido o campo de busca
            if (!angular.isUndefined(_self.searchInputText) &&
                _self.searchInputText !== '') {

                //Remove todos os disclaimers
                _self.disclaimers = [];
                var filtro = this.searchInputText;

                if (!isNaN(filtro)) {

                    _self.disclaimers.push({property: 'cddGru',
                                            value: filtro,
                                            title: 'N??mero Documento: ' + filtro,
                                            priority: 1});
                }
            }

            //Limpa o campo de busca
            _self.searchInputText = '';

            //Busca os periodos com os filtros informados, retornando o numero de registros configurados ap??s o campo startAt
            gruFactory.getGruByFilter('', startAt, parseInt(_self.config.qtdRegistrosBusca),
                                      true, _self.disclaimers,
            function (result) {

                _self.hasDoneSearch = true;

                //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                if (!angular.isUndefined(result)) {
                    angular.forEach(result, function (ressusAbiGru) {

                        if (ressusAbiGru && ressusAbiGru.$length) {
                            _self.listOfGruCount = ressusAbiGru.$length;
                         }

                        _self.listOfGru.push(ressusAbiGru);
                    });

                    if (isMore === false) {
                        $('.page-wrapper').scrollTop(0);
                    }
                }
            });
        };

        this.removeGru = function (selectedgru) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
               title: 'Aten????o!',
               text: 'Voc?? realmente deseja remover o registro selecionado?',
               cancelLabel: 'N??o',
               confirmLabel: 'Sim',
               size: 'md',
               callback: function (hasChoosenYes) {
                   if (hasChoosenYes != true)
                       return;

                   gruFactory.removeGru(selectedgru,
                   function (result) {

                       if(result.$hasError == true){
                           return;
                       }

                       $rootScope.$broadcast(TOTVSEvent.showNotification,
                                             {type: 'success', title: 'Registro removido com sucesso'});

                       _self.search(false);
                   });
               }
            });
        };

        this.openAdvancedSearch = function () {
            /* Apaga valor  pois valor final esta com problemas e nao volta no model*/
            _self.disclaimers.vlTotalGru = [];

            var advancedFilter = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-gru/ui/gruAdvancedFilter.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrs.gruAdvFilter.Control as afController',
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
                _self.search(false);
            });
        };

        this.openConfigWindow = function () {

            var configWindow = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-gru/ui/gruListConfiguration.html',
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

        this.removeDisclaimer = function (disclaimer) {

            // percorre os disclaimers at?? encontrar o disclaimer passado na fun????o e o remove
            // obs.: N??o funciona para mais de um disclaimer quando s??o apenas 2,
            //       pois o length dos disclaimers usado no for ?? modificado assim
            //       que ?? removido o primeiro disclaimer
            for (var i = 0; i < _self.disclaimers.length; i++) {
                if (_self.disclaimers[i].property === disclaimer.property) {
                    _self.disclaimers.splice(i, 1);
                }
            }

            _self.search(false);
        };

        this.releaseDocument = function (gru) {
            var cdUnidCdPrestadorPrincipal = StringTools.fill(gru.cdnUnidPrestdor,"0",4) + StringTools.fill(gru.cdnPrestdor,"0",8);
            var aaFaturaCdSerieNfCodFaturAp = StringTools.fill(gru.cdnAnoFatur,"0",4) + "/" + gru.codSerNotaFisc + "/" + gru.codFaturCtasPagar;
            var disclaimersAux = [{property: 'cdUnidCdPrestadorPrincipal', value: cdUnidCdPrestadorPrincipal},
                                  {property: 'aaFaturaCdSerieNfCodFaturAp', value: aaFaturaCdSerieNfCodFaturAp}]
            var modalReleaseDocument = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-document/ui/releaseDocumentParams.html',
                size: 'md',
                backdrop: 'static',
                controller: 'hrc.releaseDocumentParams.Control as controller',
                resolve: {
                    disclaimers: function () {
                        return disclaimersAux;
                    },
                    document: function(){
                        return undefined;
                    },
                    batchRelease: function(){
                        return true;
                    },
                    tmpUnselectedDocuments: function(){
                        return [];
                    },
                    source: function(){
                        return 'GRU';
                    }
                }
            });

            modalReleaseDocument.result.then(function (result) {
				/* ver esse if */
                if(result.$hasError){
                    return;
                }

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'information',
                    title: 'Criado pedido ' + result.nrPedido + ' para execu????o batch '
                        + ' da libera????o da Fatura do Contas M??dicas'
                });

            });

        };

        this.cancelGRURelease = function (gru) {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Aten????o!',
                text: 'Confirma o Cancelamento da Libera????o da Fatura Do Contas M??dicas',
                cancelLabel: 'N??o',
                confirmLabel: 'Sim',
                size: 'md',
                callback: function (hasChooseYes) {
                    if (hasChooseYes != true) 
                        return;

                    var cdUnidCdPrestadorPrincipal = StringTools.fill(gru.cdnUnidPrestdor,"0",4) + StringTools.fill(gru.cdnPrestdor,"0",8);
                    var aaFaturaCdSerieNfCodFaturAp = StringTools.fill(gru.cdnAnoFatur,"0",4) + "/" + gru.codSerNotaFisc + "/" + gru.codFaturCtasPagar;
                    var disclaimersAux = [{property: 'cdUnidCdPrestadorPrincipal', value: cdUnidCdPrestadorPrincipal},
                                          {property: 'aaFaturaCdSerieNfCodFaturAp', value: aaFaturaCdSerieNfCodFaturAp},
                                          {property: 'nmPrograma', value: "GRU"}];
            
                    documentFactory.batchUnreleaseDocuments(disclaimersAux, [], [],
                        function (result) {
                            if(result.$hasError){
                                return;
                            }
                    
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'information', 
                            title: 'Criado pedido ' + result.nrPedido + ' para execu????o batch '
                                 + ' para Desfazer a Libera????o da Fatura do Contas M??dicas'
                        });
                    });
                }
        })};

        if ($rootScope.currentuserLoaded) {
            this.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }
    }
    index.register.controller('hrs.gruList.Control', gruListController);

});