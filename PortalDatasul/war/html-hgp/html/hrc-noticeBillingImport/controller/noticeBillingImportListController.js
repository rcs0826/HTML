define(['index',
    '/dts/hgp/html/hrc-noticeBillingImport/noticeBillingImportFactory.js',
    '/dts/hgp/html/hrc-noticeBillingImport/controller/noticeBillingImportAdvancedFilterController.js',
    '/dts/hgp/html/hrc-noticeBillingImport/maintenance/controller/noticeBillingImportMaintenanceController.js',
    '/dts/hgp/html/hrc-noticeBillingImport/controller/noticeBillingImportHistSitController.js',
    '/dts/hgp/html/hrc-noticeBillingImport/controller/noticeBillingImportErrorMessagesController.js',
    '/dts/hgp/html/enumeration/documentosImportAvisosCobStatusEnumeration.js',
    '/dts/hgp/html/hvp-beneficiary/detail/beneficiaryDetailController.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    noticeBillingImportListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service',
                                                  'hrc.noticeBillingImport.Factory','global.userConfigs.Factory',
                                                  '$modal','AbstractAdvancedFilterController','TOTVSEvent'];
    function noticeBillingImportListController($rootScope, $scope, appViewService,noticeBillingImportFactory,
                                                userConfigsFactory,$modal,AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;
        $scope.StringTools = StringTools;

        _self.cdProgramaCorrente = 'hrc.noticeBillingImportList';
        _self.config = [];
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.disclaimers = [];
        _self.listOfNoticeBillingImport = [];
        _self.listOfNoticeBillingImportCount = 0;
        $scope.DOCUMENTOS_AVISOS_STATUS_IMP_ENUM = DOCUMENTOS_AVISOS_STATUS_IMP_ENUM;
        
        this.search = function (isMore) {

            var startAt = 0;
            _self.listOfNoticeBillingImportCount = 0;

            if (isMore) {
                startAt = _self.listOfNoticeBillingImport.length + 1;
            } else {
                _self.listOfNoticeBillingImport = [];
            } 

            //Limpa o campo de busca 
            _self.searchInputText = '';    

            var filters = [];
            filters = this.disclaimers.slice();
            //Caso nao possua filtros nao realiza busca dos documentos
            if(filters.length == 0){
                return;
            }

            //Busca os periodos com os filtros informados, retornando o numero de registros configurados após o campo startAt
            noticeBillingImportFactory.getNoticeBillingImportByFilter('', startAt, parseInt(_self.config.qtdRegistrosBusca), true, _self.disclaimers, 
                function (result) {
                    _self.hasDoneSearch = true;
                    
                    //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                    if (result) {
                        angular.forEach(result, function (value) {

                            if (value && value.$length) {
                               _self.listOfNoticeBillingImportCount = value.$length;
                            }
                            _self.listOfNoticeBillingImport.push(value);
                        });
                        if (isMore === false) {
                            $('.page-wrapper').scrollTop(0);
                        }
                    }
            });
        };    

        this.addEventListeners = function(){

            $rootScope.$on('invalidateNoticeBillingImport',function(event, cddSeq){

                if(!_self.listOfNoticeBillingImport
                || _self.listOfNoticeBillingImport.length == 0){
                    return;
                }

                for (var i=0; i < _self.listOfNoticeBillingImport.length; i++) {
                    var noticeBillingImport = _self.listOfNoticeBillingImport[i];
                    var indAux = i;

                    if(noticeBillingImport.cddSeq == cddSeq){                
                        noticeBillingImportFactory.getNoticeBillingImportByFilter('', 0, 0, false,[
                                {property:'cddSeq', value: cddSeq, priority:1}
                            ],function(result){
                                if(result){
                                    var noticeBillingImportAux = result[0];
                                    _self.listOfNoticeBillingImport[indAux] = noticeBillingImportAux;
                                }
                        }, {noCountRequest: true});
                        break;
                    }
                }
            });  
        };

        this.openConfigWindow = function () {

            var configWindow = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-noticeBillingImport/ui/noticeBillingImportListConfiguration.html',
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
                templateUrl: '/dts/hgp/html/hrc-noticeBillingImport/ui/noticeBillingImportAdvancedFilter.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrc.noticeBillingImportAdvFilter.Control as afController',
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
            appViewService.startView("Avisos de Cobrança Importados", 'hrc.noticeBillingImportList.Control', _self);
                        
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

        this.searchHistSituation = function (cddSeq) {

            var searchHistSituation = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-noticeBillingImport/ui/noticeBillingImportHistSit.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrc.noticeBillingImportHistSit.Control as controller',
                resolve: {
                    cddSeq: function(){  
                        return cddSeq;  
                    },
                }                         
            });

        };

        this.searchErrorMessages = function (cddSeq) {

            var searchErrorMessages = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-noticeBillingImport/ui/noticeBillingImportErrorMessages.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrc.noticeBillingImportErrorMessages.Control as controller',
                resolve: {
                    cddSeq: function(){  
                        return cddSeq;  
                    },
                }                         
            });

        };

        this.removeDisclaimer = function (disclaimer) {

            // percorre os disclaimers até encontrar o disclaimer passado na função e o remove
            for (var i = 0; i < _self.disclaimers.length; i++) {
                if (_self.disclaimers[i].property === disclaimer.property) {
                    _self.disclaimers.splice(i, 1);
                }
            }

            _self.search(false);
       };

        if ($rootScope.currentuserLoaded) {
            _self.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }
    }
    index.register.controller('hrc.noticeBillingImportList.Control', noticeBillingImportListController);

});


