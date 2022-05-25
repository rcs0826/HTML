define(['index',
    '/dts/hgp/html/hrs-reason/reasonFactory.js',
    '/dts/hgp/html/hrs-justification/hrs-justification.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hrs-reason/maintenance/controller/reasonMaintenanceController.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    reasonListController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service',
                                                  'hrs.reason.Factory',
                                                  'global.userConfigs.Factory',
                                                  '$modal','AbstractAdvancedFilterController','TOTVSEvent'];
    function reasonListController($rootScope, $scope, $state, $stateParams, appViewService,reasonFactory, 
                                                userConfigsFactory,$modal,AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;

        _self.cdProgramaCorrente = 'hrs.reasonList';
        _self.config = [];
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.disclaimers = [];
        _self.listOfReason = [];
        _self.listOfReasonCount = 0;
        
        this.search = function (isMore) {

            var startAt = 0;
            _self.listOfReasonCount = 0;

            if (isMore) {
                startAt = _self.listOfReason.length + 1;
            } else {
                _self.listOfReason = [];
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
                    _self.disclaimers.push({property: 'dsMotivo',
                                            value: filtro,
                                            title: 'Motivo: ' + filtro,
                                            priority: 1});
                } else {
                    _self.disclaimers.push({property: 'idMotivo',
                                            value: filtro,
                                            title: 'ID Motivo: ' + filtro,
                                            priority: 1});
                }
            }

            //Limpa o campo de busca 
            _self.searchInputText = '';
           
            //Busca os periodos com os filtros informados, retornando o numero de registros configurados após o campo startAt
            reasonFactory.getReasonByFilter('', startAt, parseInt(_self.config.qtdRegistrosBusca), true, _self.disclaimers, function (result) {
                _self.hasDoneSearch = true;
                //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                if (result) {
                    angular.forEach(result, function (value) {

                        if (value && value.$length) {
                           _self.listOfReasonCount = value.$length;
                        }
                        _self.listOfReason.push(value);
                    });
                    if (isMore === false) {
                        $('.page-wrapper').scrollTop(0);
                    }
                }
            });
        };       

        this.addEventListeners = function(){
          
            $rootScope.$on('invalidateReason',function(event, changedReason){
                if(!_self.listOfReason 
                || _self.listOfReason.length == 0){
                    return;
                }

                for (var i=0; i < _self.listOfReason.length; i++) {
                    var reason = _self.listOfReason[i];
                    var indAux = i;
                    
                    if(reason.idNatureza == changedReason.idNatureza && 
                       reason.idMotivo   == changedReason.idMotivo){
                        reasonFactory.getReasonByFilter('', 0, 0, false,[
                                {property:'idNatureza'           , value: reason.idNatureza             , priority:2},
                                {property:'idMotivo'             , value: reason.idMotivo               , priority:1}
                            ],function(result){
                                if(result){
                                    var reasonAux = result[0];
                                    reasonAux.$selected = reason.$selected;
                                    _self.listOfReason[indAux] = reasonAux;
                                }
                        }, {noCountRequest: true});
                        break;
                    }
                }
            });  
        };

        this.justificationReason = function(selectedReason){
            if (selectedReason){
                disclaimerAux = [];
                disclaimerAux.push({property: 'idMotivo',
                                        value: selectedReason.idMotivo,
                                        title: 'Motivo: ' + selectedReason.idMotivo,
                                        priority: 2});
                disclaimerAux.push({property: 'idNatureza',
                                        value: selectedReason.idNatureza,
                                        title: 'Natureza: ' + selectedReason.idNatureza,
                                        priority: 1});
                $state.go($state.get('dts/hgp/hrs-justification.start'),  
                                     {disclaimers: disclaimerAux});
            }
        };

        this.removeReason = function (selectedreason) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
               title: 'Atenção!',
               text: 'Você realmente deseja remover o registro selecionado?',
               cancelLabel: 'Não',
               confirmLabel: 'Sim',
               size: 'md',
               callback: function (hasChoosenYes) {
                   if (hasChoosenYes != true) 
                       return;

                   reasonFactory.removeReason(selectedreason,
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
                templateUrl: '/dts/hgp/html/hrs-reason/ui/reasonListConfiguration.html',
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
            appViewService.startView("Motivos de Impugnação", 'hrs.reasonList.Control', _self);
            
            if(appViewService.lastAction != 'newtab'){
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
    index.register.controller('hrs.reasonList.Control', reasonListController);

});


