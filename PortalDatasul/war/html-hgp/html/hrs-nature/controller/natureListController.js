define(['index',
    '/dts/hgp/html/hrs-nature/natureFactory.js',
    '/dts/hgp/html/hrs-reason/hrs-reason.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hrs-nature/maintenance/controller/natureMaintenanceController.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    natureListController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service',
                                                  'hrs.nature.Factory','global.userConfigs.Factory',
                                                  '$modal','AbstractAdvancedFilterController','TOTVSEvent'];
    function natureListController($rootScope, $scope, $state, $stateParams, appViewService,natureFactory,
                                                userConfigsFactory,$modal,AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;

        $scope.StringTools = StringTools;
        _self.cdProgramaCorrente = 'hrs.natureList';
        _self.config = [];
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.disclaimers = [];
        _self.listOfNature = [];
        _self.listOfNatureCount = 0;
        
        this.search = function (isMore) {

            var startAt = 0;
            _self.listOfNatureCount = 0;

            if (isMore) {
                startAt = _self.listOfNature.length + 1;
            } else {
                _self.listOfNature = [];
            }
            
            
            //Testa se foi preenchido o campo de busca
            if ((!angular.isUndefined(_self.searchInputText))
                && _self.searchInputText !== ''){

                
                //Remove todos os disclaimers
                _self.disclaimers = [];
                
                var filtro = _self.searchInputText;
                if (isNaN(filtro)) {                    
                    _self.disclaimers.push({property: 'dsNatureza',
                                            value: filtro,
                                            title: 'Natureza: ' + filtro,
                                            priority: 1});
                } else {
                    _self.disclaimers.push({property: 'idNatureza',
                                            value: filtro,
                                            title: 'ID Natureza: '  + filtro,
                                            priority: 1});
                }
            }

            //Limpa o campo de busca 
            _self.searchInputText = '';

            /*
            //Caso não possua disclaimers não realiza a busca
            if(_self.disclaimers.length == 0){
                return;
            }
            */

            //Busca os periodos com os filtros informados, retornando o numero de registros configurados após o campo startAt
            natureFactory.getNatureByFilter('', startAt, parseInt(_self.config.qtdRegistrosBusca), true, _self.disclaimers, function (result) {
                _self.hasDoneSearch = true;
                //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                if (result) {
                    angular.forEach(result, function (value) {

                        if (value && value.$length) {
                           _self.listOfNatureCount = value.$length;
                        }
                        _self.listOfNature.push(value);
                    });
                    if (isMore === false) {
                        $('.page-wrapper').scrollTop(0);
                    }
                }
            });
        };    

        this.addEventListeners = function(){
          
            $rootScope.$on('invalidateNature',function(event, changedNature){
                if(!_self.listOfNature 
                || _self.listOfNature.length == 0){
                    return;
                }

                for (var i=0; i < _self.listOfNature.length; i++) {
                    var nature = _self.listOfNature[i];
                    var indAux = i;
                    
                    if(nature.idNatureza == changedNature.idNatureza){
                        natureFactory.getNatureByFilter('', 0, 0, false,[
                                {property:'idNatureza'           , value: nature.idNatureza             , priority:1}
                            ],function(result){
                                if(result){
                                    var natureAux = result[0];
                                    natureAux.$selected = nature.$selected;
                                    _self.listOfNature[indAux] = natureAux;
                                }
                        }, {noCountRequest: true});
                        break;
                    }
                }
            });  
        };

        this.reasonsNature = function(selectedNature){
            if (selectedNature){
                disclaimerAux = [];
                disclaimerAux.push({property: 'idNatureza',
                                        value: selectedNature.idNatureza,
                                        title: 'Natureza: ' + selectedNature.idNatureza,
                                        priority: 1});
                $state.go($state.get('dts/hgp/hrs-reason.start'),  
                                     {disclaimers: disclaimerAux});
            }
        };

        this.removeNature = function (selectednature) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
               title: 'Atenção!',
               text: 'Você realmente deseja remover o registro selecionado?',
               cancelLabel: 'Não',
               confirmLabel: 'Sim',
               size: 'md',
               callback: function (hasChoosenYes) {
                   if (hasChoosenYes != true) 
                       return;

                   natureFactory.removeNature(selectednature,
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

        this.openAdvancedSearch = function () {

            var advancedFilter = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-nature/ui/natureAdvancedFilter.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrs.natureAdvFilter.Control as afController',
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
                templateUrl: '/dts/hgp/html/hrs-nature/ui/natureListConfiguration.html',
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
            appViewService.startView("Naturezas de Impugnação", 'hrs.natureList.Control', _self);
        
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

            // percorre os disclaimers até encontrar o disclaimer passado na função e o remove
            // obs.: Não funciona para mais de um disclaimer quando são apenas 2, 
            //       pois o length dos disclaimers usado no for é modificado assim
            //       que é removido o primeiro disclaimer
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
    index.register.controller('hrs.natureList.Control', natureListController);

});


