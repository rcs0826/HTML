define(['index',
    '/dts/hgp/html/hrb-loteImportRetCompartRisco/loteImportRetCompartRiscoFactory.js',
    '/dts/hgp/html/hrb-loteImportRetCompartRisco/controller/loteImportRetCompartRiscoAdvancedFilterController.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hrb-loteImportRetCompartRisco/maintenance/controller/loteImportRetCompartRiscoMaintenanceController.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    loteImportRetCompartRiscoListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service',
                                      'hrb.loteImportRetCompartRisco.Factory','global.userConfigs.Factory',
                                      '$modal','AbstractAdvancedFilterController','TOTVSEvent'];
    function loteImportRetCompartRiscoListController($rootScope, $scope, appViewService,loteImportRetCompartRiscoFactory,
                                                  userConfigsFactory,$modal,AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;
        $scope.StringTools = StringTools;

        _self.cdProgramaCorrente = 'hrb.loteImportRetCompartRiscoList';
        _self.config = [];
        _self.listItemInfoClasses = "col-sm-6 col-md-6 col-lg-6 col-sm-height";
        _self.disclaimers = [];
        _self.listOfLoteImportRetCompartRisco = [];
        _self.listOfLoteImportRetCompartRiscoCount = 0;
        
        this.search = function (isMore) {
            
            var startAt = 0;
            _self.listOfLoteImportRetCompartRiscoCount = 0;

            if (isMore) {
                startAt = _self.listOfLoteImportRetCompartRisco.length + 1;
            } else {
                _self.listOfLoteImportRetCompartRisco = [];
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
            loteImportRetCompartRiscoFactory.getLoteImportRetCompartRiscoByFilter('', startAt, parseInt(_self.config.qtdRegistrosBusca), true, _self.disclaimers, function (result) {
                _self.hasDoneSearch = true;
                //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                if (result) {
                    angular.forEach(result, function (value) {

                        if (value && value.$length) {
                           _self.listOfLoteImportRetCompartRiscoCount = value.$length;
                        }
                        _self.listOfLoteImportRetCompartRisco.push(value);
                    });
                    if (isMore === false) {
                        $('.page-wrapper').scrollTop(0);
                    }
                }
            });
        };    

        this.addEventListeners = function(){
          
            $rootScope.$on('invalidateLoteImportRetCompartRisco',function(event, cdUnidadeDestino, nrLoteExp, nrSequenciaLote){

                if(!_self.listOfLoteImportRetCompartRisco 
                || _self.listOfLoteImportRetCompartRisco.length == 0){
                    return;
                }

                for (var i=0; i < _self.listOfLoteImportRetCompartRisco.length; i++) {
                    var loteImportRetCompartRisco = _self.listOfLoteImportRetCompartRisco[i];
                    var indAux = i;
                    
                    if(loteImportRetCompartRisco.cdUnidadeDestino == cdUnidadeDestino 
                    && loteImportRetCompartRisco.nrLoteExp == nrLoteExp
                    && loteImportRetCompartRisco.nrSequenciaLote == nrSequenciaLote){
                        loteImportRetCompartRiscoFactory.getLoteImportRetCompartRiscoByFilter('', 0, 0, false,[
                                {property:'cdUnidadeDestino', value: cdUnidadeDestino, priority:1},
                                {property:'nrLoteExp',  value: nrLoteExp, priority:2},
                                {property:'nrSequenciaLote',  value: nrSequenciaLote, priority:3}
                            ],function(result){
                                if(result){
                                    var loteImportRetCompartRiscoAux = result[0];
                                    _self.listOfLoteImportRetCompartRisco[indAux] = loteImportRetCompartRiscoAux;
                                }
                        }, {noCountRequest: true});
                        break;
                    }
                }
            });  
        };        

        this.removeLoteImportRetCompartRisco = function (selectedloteImportRetCompartRisco) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
               title: 'Atençao!',
               text: 'Você realmente deseja remover o registro selecionado?',
               cancelLabel: 'Nao',
               confirmLabel: 'Sim',
               size: 'md',
               callback: function (hasChoosenYes) {
                    if (hasChoosenYes != true)
                        return;

                    loteImportRetCompartRiscoFactory.removeLoteImportRetCompartRisco(selectedloteImportRetCompartRisco,
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
                templateUrl: '/dts/hgp/html/hrb-loteImportRetCompartRisco/ui/loteImportRetCompartRiscoListConfiguration.html',
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
                templateUrl: '/dts/hgp/html/hrb-loteImportRetCompartRisco/ui/loteImportRetCompartRiscoAdvancedFilter.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrb.loteImportRetCompartRiscoAdvFilter.Control as afController',
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
            appViewService.startView("Lotes de Importação Retorno Compartilhamento de Riscos", 'hrb.loteImportRetCompartRiscoList.Control', _self);
                        
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
    index.register.controller('hrb.loteImportRetCompartRiscoList.Control', loteImportRetCompartRiscoListController);

});


