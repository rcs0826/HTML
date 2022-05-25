define(['index',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hrs-situation/maintenance/controller/situationMaintenanceController.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    situationListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service',
                                                  'hrs.situation.Factory','global.userConfigs.Factory',
                                                  '$modal','AbstractAdvancedFilterController','TOTVSEvent'];
    function situationListController($rootScope, $scope, appViewService,situationFactory,
                                                userConfigsFactory,$modal,AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;

        _self.cdProgramaCorrente = 'hrs.situationList';
        _self.config = [];
        _self.disclaimers = [];
        _self.listOfSituation = [];
        _self.listOfSituationCount = 0;
        
        this.search = function (isMore) {
            var startAt = 0;
            _self.listOfSituationCount = 0;

            if (isMore) {
                startAt = _self.listOfSituation.length + 1;
            } else {
                _self.listOfSituation = [];
            }
            
            //Testa se foi preenchido o campo de busca
            if ((!angular.isUndefined(_self.searchInputText))
                && _self.searchInputText !== ''){

                //Remove todos os disclaimers
                var arrayLength = _self.disclaimers.length - 1;
                for (var i = arrayLength ; i >= 0 ; i--) {
                    _self.disclaimers.splice(i, 1);
                }   

                if(StringTools.hasOnlyNumbers(_self.searchInputText)){
                    _self.disclaimers.push({property:'idSituacao',title: 'Situação' + ': ' 
                        + _self.searchInputText,
                        value:_self.searchInputText, priority:1});
                } else {
                    _self.disclaimers.push({property:'nmSituacao',title: 'Situação' + ': ' 
                        + _self.searchInputText,
                        value:_self.searchInputText, priority:1});
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
            situationFactory.getSituationByFilter('', startAt, parseInt(_self.config.qtdRegistrosBusca), true, _self.disclaimers, function (result) {
                _self.hasDoneSearch = true;
                //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                if (result) {
                    angular.forEach(result, function (value) {

                        if (value && value.$length) {
                           _self.listOfSituationCount = value.$length;
                        }
                        _self.listOfSituation.push(value);
                    });
                    if (isMore === false) {
                        $('.page-wrapper').scrollTop(0);
                    }
                }
            });
        };     

        this.addEventListeners = function(){
          
            $rootScope.$on('invalidateSituation',function(event, changedSituation){
                if(!_self.listOfSituation 
                || _self.listOfSituation.length == 0){
                    return;
                }

                for (var i=0; i < _self.listOfSituation.length; i++) {
                    var situation = _self.listOfSituation[i];
                    var indAux = i;
                    
                    if(situation.idSituacao == changedSituation.idSituacao){
                        situationFactory.getSituationByFilter('', 0, 0, false,[
                                {property:'idSituacao'           , value: situation.idSituacao             , priority:1}
                            ],function(result){
                                if(result){
                                    var situationAux = result[0];
                                    situationAux.$selected = situation.$selected;
                                    _self.listOfSituation[indAux] = situationAux;
                                }
                        }, {noCountRequest: true});
                        break;
                    }
                }
            });  
        };

        this.removeSituation = function (selectedsituation) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
               title: 'Atenção!',
               text: 'Você realmente deseja remover o registro selecionado?',
               cancelLabel: 'Não',
               confirmLabel: 'Sim',
               size: 'md',
               callback: function (hasChoosenYes) {
                   if (hasChoosenYes != true) 
                       return;

                   situationFactory.removeSituation(selectedsituation,
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


        this.init = function(){
            appViewService.startView("Status da Análise", 'hrs.situationList.Control', _self);
                                  
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

        this.openConfigWindow = function () {

            var configWindow = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-justification/ui/justificationListConfiguration.html',
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

        if ($rootScope.currentuserLoaded) {
            this.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }
    }
    index.register.controller('hrs.situationList.Control', situationListController);

});


