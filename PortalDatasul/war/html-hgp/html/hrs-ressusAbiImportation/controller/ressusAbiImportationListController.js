define(['index',
    '/dts/hgp/html/hrs-ressusAbiImportation/ressusAbiImportationFactory.js',
    '/dts/hgp/html/hrs-ressusAbiImportation/controller/ressusAbiImportationAdvancedFilterController.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hrs-ressusAbiImportation/maintenance/controller/ressusAbiImportationMaintenanceController.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/enumeration/abiStatusEnumeration.js',
    '/dts/hgp/html/hrs-ressusAbiImportation/controller/statusModalController.js',
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    ressusAbiImportationListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service',
                                                  'hrs.ressusAbiImportation.Factory','global.userConfigs.Factory',
                                                  '$modal','AbstractAdvancedFilterController','TOTVSEvent'];
    function ressusAbiImportationListController($rootScope, $scope, appViewService,ressusAbiImportationFactory,
                                                userConfigsFactory,$modal,AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;
        _self.cdProgramaCorrente = 'hrs.ressusAbiImportationList';
        _self.config = [];
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.disclaimers = [];
        _self.listOfRessusAbiImportation = [];
        _self.listOfRessusAbiImportationCount = 0;
        $scope.ABI_STATUS_ENUM = ABI_STATUS_ENUM;

        this.search = function (isMore) {

            var startAt = 0;
            _self.listOfRessusAbiImportationCount = 0;

            if (isMore) {
                startAt = _self.listOfRessusAbiImportation.length + 1;
            } else {
                _self.listOfRessusAbiImportation = [];
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

            //Limpa o campo de busca 
            _self.searchInputText = '';
            //Busca os objetos com os filtros informados, retornando o numero de registros configurados após o campo startAt
            ressusAbiImportationFactory.getRessusAbiDadosByFilter('', startAt, parseInt(_self.config.qtdRegistrosBusca), true, _self.disclaimers, function (result) {
                _self.hasDoneSearch = true;
                //Se encontrou resultados, preenche a lista de periodos com os mesmos.

                if (result) {
                    angular.forEach(result, function (value) {
                        if (value && value.$length) {
                           _self.listOfRessusAbiImportationCount = value.$length;
                        }
                        _self.listOfRessusAbiImportation.push(value);
                    });
                    if (isMore === false) {
                        $('.page-wrapper').scrollTop(0);
                    }
                }
            });
        };    

        this.alteraStatusAbiDados = function (selectedressusAbiImportation) {

            var editMovementModal = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-ressusAbiImportation/ui/statusModal.html', 
                size: 'md',
                controller: 'hrs.statusModal.control as controller',
                resolve: {
                    ressusAbiImportationListController: function(){
                        return _self;
                    },
                    selectedressusAbiImportation: function(){
                        return selectedressusAbiImportation;
                    }
                }
            });
        };

        this.removeRessusAbiDados = function (selectedressusAbiImportation) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
               title: 'Atenção!',
               text: 'Você realmente deseja remover o registro selecionado?',
               cancelLabel: 'Não',
               confirmLabel: 'Sim',
               size: 'md',
               callback: function (hasChoosenYes) {
                   if (hasChoosenYes != true) 
                       return;

                   ressusAbiImportationFactory.removeRessusAbiDados(selectedressusAbiImportation,
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
                templateUrl: '/dts/hgp/html/hrs-ressusAbiImportation/ui/ressusAbiImportationAdvancedFilter.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrs.ressusAbiImportationAdvFilter.Control as afController',
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
                templateUrl: '/dts/hgp/html/hrs-ressusAbiImportation/ui/ressusAbiImportationListConfiguration.html',
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

        this.reprocessAbi = function(ressusAbiImportation){
            if(ressusAbiImportation.codSit == ABI_STATUS_ENUM.CARGA_COM_ERRO){
                $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                   title: 'Atenção!',
                   text: 'Você deseja realizar a importação dos dados no revisão de Contas ao reprocessar a ABI?',
                   cancelLabel: 'Não',
                   confirmLabel: 'Sim',
                   size: 'md',
                   callback: function (userChoice) {
                       _self.reprocess(ressusAbiImportation.cddRessusAbiDados,userChoice);
                   }
                }); 
            }else{
                _self.reprocess(ressusAbiImportation.cddRessusAbiDados,true);
            }
        };

        this.reprocess = function(cddRessusAbiDados){

             ressusAbiImportationFactory.reprocess(cddRessusAbiDados,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }
                        
                    var dsMensagem = 'Criado pedido ' + result.nrPedido + ' para execução batch do Reprocessamento da ABI ';
                    
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'information', 
                        title: dsMensagem
                    });
               }); 

        };

        this.init = function(){
            appViewService.startView("Central de Movimentação RESSUS", 'hrs.ressusAbiImportationList.Control', _self);
                        
            if(appViewService.lastAction != 'newtab'){
                return;
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

        this.fillInteger = function(source,size){
            return StringTools.fill(source,'0',size);
        };

        if ($rootScope.currentuserLoaded) {
            this.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }
    }
    index.register.controller('hrs.ressusAbiImportationList.Control', ressusAbiImportationListController);

});