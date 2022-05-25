define(['index',
    '/dts/hgp/html/hrb-loteImportCompartRisco/loteImportCompartRiscoFactory.js',
    '/dts/hgp/html/hrb-loteImportCompartRisco/controller/loteImportCompartRiscoAdvancedFilterController.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hrb-loteImportCompartRisco/maintenance/controller/loteImportCompartRiscoMaintenanceController.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    loteImportCompartRiscoListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service',
                                      'hrb.loteImportCompartRisco.Factory','global.userConfigs.Factory',
                                      '$modal','AbstractAdvancedFilterController','TOTVSEvent'];
    function loteImportCompartRiscoListController($rootScope, $scope, appViewService,loteImportCompartRiscoFactory,
                                                  userConfigsFactory,$modal,AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;
        $scope.StringTools = StringTools;

        _self.cdProgramaCorrente = 'hrb.loteImportCompartRiscoList';
        _self.config = [];
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.disclaimers = [];
        _self.listOfLoteImportCompartRisco = [];
        _self.listOfLoteImportCompartRiscoCount = 0;
        
        this.search = function (isMore) {
            
            var startAt = 0;
            _self.listOfLoteImportCompartRiscoCount = 0;

            if (isMore) {
                startAt = _self.listOfLoteImportCompartRisco.length + 1;
            } else {
                _self.listOfLoteImportCompartRisco = [];
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
                    _self.disclaimers.push({property: 'cdUnidadeOrigem',
                        value: filtro,
                        title: 'Unidade Origem: ' + filtro,
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
            loteImportCompartRiscoFactory.getLoteImportCompartRiscoByFilter('', startAt, parseInt(_self.config.qtdRegistrosBusca), true, _self.disclaimers, function (result) {
                _self.hasDoneSearch = true;
                //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                if (result) {
                    angular.forEach(result, function (value) {

                        if (value && value.$length) {
                           _self.listOfLoteImportCompartRiscoCount = value.$length;
                        }
                        _self.listOfLoteImportCompartRisco.push(value);
                    });
                    if (isMore === false) {
                        $('.page-wrapper').scrollTop(0);
                    }
                }
            });
        };    

        this.addEventListeners = function(){
          
            $rootScope.$on('invalidateLoteImportCompartRisco',function(event, cdContratante, nrLoteImp){

                if(!_self.listOfLoteImportCompartRisco 
                || _self.listOfLoteImportCompartRisco.length == 0){
                    return;
                }

                for (var i=0; i < _self.listOfLoteImportCompartRisco.length; i++) {
                    var loteImportCompartRisco = _self.listOfLoteImportCompartRisco[i];
                    var indAux = i;
                    
                    if(loteImportCompartRisco.cdContratante == cdContratante 
                    && loteImportCompartRisco.nrLoteImp == nrLoteImp){
                        loteImportCompartRiscoFactory.getLoteImportCompartRiscoByFilter('', 0, 0, false,[
                                {property:'cdContratante', value: cdContratante, priority:1},
                                {property:'nrLoteImp',  value: nrLoteImp, priority:2}
                            ],function(result){
                                if(result){
                                    var loteImportCompartRiscoAux = result[0];
                                    _self.listOfLoteImportCompartRisco[indAux] = loteImportCompartRiscoAux;
                                }
                        }, {noCountRequest: true});
                        break;
                    }
                }
            });  
        };        

        this.removeLoteImportCompartRisco = function (selectedloteImportCompartRisco) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
               title: 'Atençao!',
               text: 'Você realmente deseja remover o registro selecionado?',
               cancelLabel: 'Nao',
               confirmLabel: 'Sim',
               size: 'md',
               callback: function (hasChoosenYes) {
                    if (hasChoosenYes != true)
                        return;

                    loteImportCompartRiscoFactory.removeLoteImportCompartRisco(selectedloteImportCompartRisco,
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

        this.openConfigWindow = function () {

            var configWindow = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrb-loteImportCompartRisco/ui/loteImportCompartRiscoListConfiguration.html',
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
                templateUrl: '/dts/hgp/html/hrb-loteImportCompartRisco/ui/loteImportCompartRiscoAdvancedFilter.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrb.loteImportCompartRiscoAdvFilter.Control as afController',
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
            appViewService.startView("Lotes de Importação Compartilhamento de Riscos", 'hrb.loteImportCompartRiscoList.Control', _self);
                        
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
    index.register.controller('hrb.loteImportCompartRiscoList.Control', loteImportCompartRiscoListController);

});


