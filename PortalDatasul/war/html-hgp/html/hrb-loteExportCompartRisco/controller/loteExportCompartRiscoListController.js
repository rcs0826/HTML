define(['index',
    '/dts/hgp/html/hrb-loteExportCompartRisco/loteExportCompartRiscoFactory.js',
    '/dts/hgp/html/hrb-loteExportCompartRisco/controller/loteExportCompartRiscoAdvancedFilterController.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hrb-loteExportCompartRisco/maintenance/controller/loteExportCompartRiscoMaintenanceController.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    loteExportCompartRiscoListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service',
                                      'hrb.loteExportCompartRisco.Factory','global.userConfigs.Factory',
                                      '$modal','AbstractAdvancedFilterController','TOTVSEvent'];
    function loteExportCompartRiscoListController($rootScope, $scope, appViewService,loteExportCompartRiscoFactory,
                                                  userConfigsFactory,$modal,AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;
        $scope.StringTools = StringTools;

        _self.cdProgramaCorrente = 'hrb.loteExportCompartRiscoList';
        _self.config = [];
        _self.listItemInfoClasses = "col-sm-6 col-md-6 col-lg-6 col-sm-height";
        _self.disclaimers = [];
        _self.listOfLoteExportCompartRisco = [];
        _self.listOfLoteExportCompartRiscoCount = 0;
        
        this.search = function (isMore) {
            
            var startAt = 0;
            _self.listOfLoteExportCompartRiscoCount = 0;

            if (isMore) {
                startAt = _self.listOfLoteExportCompartRisco.length + 1;
            } else {
                _self.listOfLoteExportCompartRisco = [];
            }
            
            //Testa se foi preenchido o campo de busca
            if ((!angular.isUndefined(_self.searchInputText))
                && _self.searchInputText !== ''){
                
                //Remove todos os disclaimers
                _self.disclaimers = [];
                
                var filtro = this.searchInputText;
                if (isNaN(filtro)) {     
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title: 'Formato do filtro inválido.'
                    });
                    return;
                } else {
                    _self.disclaimers.push({property: 'cdUnidadeDestino',
                        value: filtro,
                        title: 'Unidade Destino: ' + filtro,
                        priority: 1});
                }
                                       
            }

            //Limpa o campo de busca 
            _self.searchInputText = '';
            
            //Caso nao possua disclaimers nao realiza a busca
            if(_self.disclaimers.length == 0){
                return;
            }            

            //Busca os periodos com os filtros informados, retornando o numero de registros configurados apos o campo startAt
            loteExportCompartRiscoFactory.getLoteExportCompartRiscoByFilter('', startAt, parseInt(_self.config.qtdRegistrosBusca), true, _self.disclaimers, function (result) {
                _self.hasDoneSearch = true;
                //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                if (result) {
                    angular.forEach(result, function (value) {

                        if (value && value.$length) {
                           _self.listOfLoteExportCompartRiscoCount = value.$length;
                        }
                        _self.listOfLoteExportCompartRisco.push(value);
                    });
                    if (isMore === false) {
                        $('.page-wrapper').scrollTop(0);
                    }
                }
            });
        };    

        this.addEventListeners = function(){
          
            $rootScope.$on('invalidateLoteExportCompartRisco',function(event, cdUnidadeDestino, nrLoteExp){

                if(!_self.listOfLoteExportCompartRisco 
                || _self.listOfLoteExportCompartRisco.length == 0){
                    return;
                }

                for (var i=0; i < _self.listOfLoteExportCompartRisco.length; i++) {
                    var loteExportCompartRisco = _self.listOfLoteExportCompartRisco[i];
                    var indAux = i;
                    
                    if(loteExportCompartRisco.cdUnidadeDestino == cdUnidadeDestino 
                    && loteExportCompartRisco.nrLoteExp == nrLoteExp){
                        loteExportCompartRiscoFactory.getLoteExportCompartRiscoByFilter('', 0, 0, false,[
                                {property:'cdUnidadeDestino', value: cdUnidadeDestino, priority:1},
                                {property:'nrLoteExp',  value: nrLoteExp, priority:2}
                            ],function(result){
                                if(result){
                                    var loteExportCompartRiscoAux = result[0];
                                    _self.listOfLoteExportCompartRisco[indAux] = loteExportCompartRiscoAux;
                                }
                        }, {noCountRequest: true});
                        break;
                    }
                }
            });  
        };        

        this.removeLoteExportCompartRisco = function (selectedloteExportCompartRisco) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
               title: 'Atençao!',
               text: 'Você realmente deseja remover o registro selecionado?',
               cancelLabel: 'Nao',
               confirmLabel: 'Sim',
               size: 'md',
               callback: function (hasChoosenYes) {
                    if (hasChoosenYes != true)
                        return;

                    loteExportCompartRiscoFactory.removeLoteExportCompartRisco(selectedloteExportCompartRisco,
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

        this.cancelaLoteExportCompartRisco = function (selectedloteExportCompartRisco) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
               title: 'Atençao!',
               text: 'Você realmente deseja cancelar o registro selecionado?',
               cancelLabel: 'Nao',
               confirmLabel: 'Sim',
               size: 'md',
               callback: function (hasChoosenYes) {
                    if (hasChoosenYes != true)
                        return;

                    loteExportCompartRiscoFactory.cancelaLoteExportCompartRisco(
                        selectedloteExportCompartRisco.cdUnidadeDestino,
                        selectedloteExportCompartRisco.nrLoteExp,
                    function (result) {

                       if(result.$hasError == true){
                           return;
                       }
                       
                       $rootScope.$broadcast(TOTVSEvent.showNotification, {
                           type: 'success', title: 'Registro cancelado com sucesso'
                       });
                       _self.search(false);
                   }); 
               }
            }); 
        };   

        this.openConfigWindow = function () {

            var configWindow = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrb-loteExportCompartRisco/ui/loteExportCompartRiscoListConfiguration.html',
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

        this.openAdvancedSearch = function () {
            
            var advancedFilter = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrb-loteExportCompartRisco/ui/loteExportCompartRiscoAdvancedFilter.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrb.loteExportCompartRiscoAdvFilter.Control as afController',
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

        this.init = function(){
            appViewService.startView("Lotes de Exportação Compartilhamento de Riscos", 'hrb.loteExportCompartRiscoList.Control', _self);
                        
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
            for (var i = 0; i < _self.disclaimers.length; i++) {
                if (_self.disclaimers[i].property === disclaimer.property) {
                    _self.disclaimers.splice(i, 1);
                    i--;
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
    index.register.controller('hrb.loteExportCompartRiscoList.Control', loteExportCompartRiscoListController);

});


