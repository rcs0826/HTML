define(['index', 
    '/dts/hgp/html/hrs-justification/justificationFactory.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hrs-justification/maintenance/controller/justificationMaintenanceController.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    justificationListController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service',
                                                  'hrs.justification.Factory',
                                                  'global.userConfigs.Factory',
                                                  '$modal','AbstractAdvancedFilterController','TOTVSEvent'];
    function justificationListController($rootScope, $scope, $state, $stateParams, appViewService,justificationFactory, 
                                                userConfigsFactory,$modal,AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;

        _self.cdProgramaCorrente = 'hrs.justificationList';
        _self.config = [];
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.disclaimers = [];
        _self.listOfJustification = [];
        _self.listOfJustificationCount = 0;
        
        this.search = function (isMore) {

            var startAt = 0;
            _self.listOfJustificationCount = 0;

            if (isMore) {
                startAt = _self.listOfJustification.length + 1;
            } else {
                _self.listOfJustification = [];
            }
            
            //Testa se foi preenchido o campo de busca
            if ((!angular.isUndefined(_self.searchInputText))
                && _self.searchInputText !== ''){

                //Remove todos os disclaimers
                var arrayLength = _self.disclaimers.length - 1;
                for (var i = arrayLength ; i >= 0 ; i--) {
                    _self.disclaimers.splice(i, 1);
                }   
            }

            //Testa se foi preenchido o campo de busca
            if ((!angular.isUndefined(_self.searchInputText))
                && _self.searchInputText !== ''){

                
                //Remove todos os disclaimers
                _self.disclaimers = [];
                
                var filtro = _self.searchInputText;
                if (isNaN(filtro)) {                    
                    _self.disclaimers.push({property: 'dsJustificativa',
                                            value: filtro,
                                            title: 'Justificativa: ' + filtro,
                                            priority: 1});
                } else {
                    _self.disclaimers.push({property: 'idJustificativa',
                                            value: filtro,
                                            title: 'ID Justificativa: ' + filtro,
                                            priority: 1});
                }
            }

            //Limpa o campo de busca 
            _self.searchInputText = '';
           
            //Busca os periodos com os filtros informados, retornando o numero de registros configurados após o campo startAt
            justificationFactory.getJustificationByFilter('', startAt, parseInt(_self.config.qtdRegistrosBusca), true, _self.disclaimers, function (result) {
                _self.hasDoneSearch = true;
                //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                if (result) {
                    angular.forEach(result, function (value) {

                        if (value && value.$length) {
                           _self.listOfJustificationCount = value.$length;
                        }
                        _self.listOfJustification.push(value);
                    });
                    if (isMore === false) {
                        $('.page-wrapper').scrollTop(0);
                    }
                }
            });
        };     

        this.addEventListeners = function(){
          
            $rootScope.$on('invalidateJustification',function(event, changedjustification){
                if(!_self.listOfJustification 
                || _self.listOfJustification.length == 0){
                    return;
                }

                for (var i=0; i < _self.listOfJustification.length; i++) {
                    var justification = _self.listOfJustification[i];
                    var indAux = i;
                    
                    if(justification.idJustificativa == changedjustification.idJustificativa){
                        justificationFactory.getJustificationByFilter('', 0, 0, false,[
                                {property:'idJustificativa'           , value: justification.idJustificativa             , priority:1}
                            ],function(result){
                                if(result){
                                    var justificationAux = result[0];
                                    justificationAux.$selected = justification.$selected;
                                    _self.listOfJustification[indAux] = justificationAux;
                                }
                        }, {noCountRequest: true});
                        break;
                    }
                }
            });  
        };  
        
        this.removejustification = function (selectedjustification) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
               title: 'Atenção!',
               text: 'Você realmente deseja remover o registro selecionado?',
               cancelLabel: 'Não',
               confirmLabel: 'Sim',
               size: 'md',
               callback: function (hasChoosenYes) {
                   if (hasChoosenYes != true) 
                       return;

                   justificationFactory.removejustification(selectedjustification,
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
                templateUrl: '/dts/hgp/html/hrs-justification/ui/justificationAdvancedFilter.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrs.justificationAdvFilter.Control as afController',
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

        this.init = function(){
            appViewService.startView("Justificativas de Impugnação", 'hrs.justificationList.Control', _self);
            
            if (appViewService.lastAction != 'newtab'){
                return;
            }

            _self.addEventListeners();
            
            if (!angular.isUndefined($stateParams.disclaimers)){
                _self.disclaimers = $stateParams.disclaimers;
            }

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
    index.register.controller('hrs.justificationList.Control', justificationListController);

});


