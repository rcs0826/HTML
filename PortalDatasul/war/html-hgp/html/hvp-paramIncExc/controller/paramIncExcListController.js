define(['index',
    '/dts/hgp/html/hvp-paramIncExc/paramIncExcFactory.js',
    '/dts/hgp/html/hvp-paramIncExc/controller/paramIncExcAdvancedFilterController.js',
    '/dts/hgp/html/hvp-paramIncExc/controller/paramIncExcImportController.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hvp-paramIncExc/maintenance/controller/paramIncExcMaintenanceController.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    paramIncExcListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service',
                                                  'hvp.paramIncExc.Factory','global.userConfigs.Factory',
                                                  '$modal','AbstractAdvancedFilterController','TOTVSEvent'];
    function paramIncExcListController($rootScope, $scope, appViewService,paramIncExcFactory,
                                                userConfigsFactory,$modal,AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;

        _self.cdProgramaCorrente = 'hvp.paramIncExcList';
        _self.config = [];
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.disclaimers = [];
        _self.listOfParamIncExc = [];
        _self.listOfParamIncExcCount = 0;
        
        this.search = function (isMore) {

            var startAt = 0;
            _self.listOfParamIncExcCount = 0;

            if (isMore) {
                startAt = _self.listOfParamIncExc.length + 1;
            } else {
                _self.listOfParamIncExc = [];
            }
            
            //Testa se foi preenchido o campo de busca
            if ((!angular.isUndefined(_self.searchInputText))
                && _self.searchInputText !== ''){

                
                //Remove todos os disclaimers
                _self.disclaimers = [];
                
                var filtro = this.searchInputText;
                if (isNaN(filtro)) {                    
                    _self.disclaimers.push({property: 'desRegra',
                                            value: filtro,
                                            title: 'Descriçao da Regra',
                                            priority: 1});
                } else {
                    _self.disclaimers.push({property: 'cddRegra',
                                            value: filtro,
                                            title: 'ID Regra',
                                            priority: 1});
                }
            }


            //Limpa o campo de busca 
            _self.searchInputText = '';

            /*
            //Caso nao possua disclaimers nao realiza a busca
            if(_self.disclaimers.length == 0){
                return;
            }
            */

            //Busca os periodos com os filtros informados, retornando o numero de registros configurados apos o campo startAt
            paramIncExcFactory.getParamIncExcByFilter('', startAt, parseInt(_self.config.qtdRegistrosBusca), true, _self.disclaimers, function (result) {
                _self.hasDoneSearch = true;
                //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                if (result) {
                    angular.forEach(result, function (value) {

                        if (value && value.$length) {
                           _self.listOfParamIncExcCount = value.$length;
                        }
                        value.rotulo = value.cddRegra + " - " + value.dsTipRegra + " - " + value.desRegra;
                        _self.listOfParamIncExc.push(value);
                    });
                    angular.forEach(_self.listOfParamIncExc, function (value) {
                        //Austa o label "TODOS" para os campos zerados
                        if (angular.isUndefined(value.cdnModalid)) {
                           value.cdnModalid = 0;
                        }
                        if (value.cdnModalid == 0) {
                           value.dsModalidade = "Todas";
                        }

                        if (angular.isUndefined(value.cdnPlano)) {
                           value.cdnPlano = 0;
                        }
                        if (value.cdnPlano == 0) {
                           value.nmPlano = "Todos";
                        }
                        
                        if (angular.isUndefined(value.cdnTipPlano)) {
                           value.cdnTipPlano = 0;
                        }
                        if (value.cdnTipPlano == 0) {
                           value.nmTipoPlano = "Todos";
                        }
                        
                        if (angular.isUndefined(value.numInscrContrnte)) {
                           value.numInscrContrnte = 0;
                        }
                        if (value.numInscrContrnte == 0) {
                           value.nmContratante = "Todos";
                        }

                        if (angular.isUndefined(value.cdnTipPlano)) {
                           value.cdnTipPlano = 0;
                        }
                        if (value.cdnTipPlano == 0) {
                           value.nmTipoPlano = "Todos";
                        }

                        if (angular.isUndefined(value.cdMotivoCancelamento)) {
                           value.cdMotivoCancelamento = 0;
                        }
                        if (value.cdMotivoCancelamento == 0) {
                           value.dsMotivo = "Todos";
                        }
                    });
                    if (isMore === false) {
                        $('.page-wrapper').scrollTop(0);
                    }
                }
            });
        };    

        this.addEventListeners = function(){
          
            $rootScope.$on('invalidateParamIncExc',function(event, cddRegra){

                if(!_self.listOfParamIncExc 
                || _self.listOfParamIncExc.length == 0){
                    return;
                }

                for (var i=0; i < _self.listOfParamIncExc.length; i++) {
                    var paramIncExc = _self.listOfParamIncExc[i];
                    var indAux = i;
                    
                    if(paramIncExc.cddRegra == cddRegra){
                        paramIncExcFactory.getParamIncExcByFilter('', 0, 0, false,[
                                {property:'cddRegra', value: cddRegra, priority:1}
                            ],function(result){
                                if(result){
                                    var paramIncExcAux = result[0];
                                    paramIncExcAux.$selected = paramIncExc.$selected;
                                    _self.listOfParamIncExc[indAux] = paramIncExcAux;
                                }
                        }, {noCountRequest: true});
                        break;
                    }
                }
            });  
        };

        this.removeParamIncExc = function (selectedparamIncExc) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
               title: 'Atençao!',
               text: 'Você realmente deseja remover o registro selecionado?',
               cancelLabel: 'Nao',
               confirmLabel: 'Sim',
               size: 'md',
               callback: function (hasChoosenYes) {
                   if (hasChoosenYes != true) 
                       return;

                   paramIncExcFactory.removeParamIncExc(selectedparamIncExc,
                   function (result) {

                       if(result.$hasError == true){
                           return;
                       }
                       
                       $rootScope.$broadcast(TOTVSEvent.showNotification, {
                           type: 'success', title: 'Registro removido com sucesso'
                       });
                       _self.search(false);
                   }); 
               }
            }); 
        };   

        this.import = function () {

            var importFrame = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hvp-paramIncExc/ui/paramIncExcImport.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hvp.paramIncExcImport.Control as impController',
                resolve: {}
            });
            
            importFrame.result.then(function () {
                _self.search(false);
            });
        };

        this.openAdvancedSearch = function () {

            var advancedFilter = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hvp-paramIncExc/ui/paramIncExcAdvancedFilter.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hvp.paramIncExcAdvFilter.Control as afController',
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
                templateUrl: '/dts/hgp/html/hvp-paramIncExc/ui/paramIncExcListConfiguration.html',
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

        this.init = function(){
            appViewService.startView("Regras de Inclusao e Exclusao de Beneficiários", 'hvp.paramIncExcList.Control', _self);
                        
            if(appViewService.lastAction != 'newtab'){
                return;
            }
            
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

        this.removeDisclaimer = function (disclaimer) {

            // percorre os disclaimers ate encontrar o disclaimer passado na funçao e o remove
            // obs.: Nao funciona para mais de um disclaimer quando sao apenas 2, 
            //       pois o length dos disclaimers usado no for e modificado assim
            //       que e removido o primeiro disclaimer
            for (var i = 0; i < _self.disclaimers.length; i++) {
                if (_self.disclaimers[i].property === disclaimer.property) {
                    _self.disclaimers.splice(i, 1);
                }
            }

            _self.search(false);
        };

        if ($rootScope.currentuserLoaded) {
            this.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }
    }
    index.register.controller('hvp.paramIncExcList.Control', paramIncExcListController);

});


