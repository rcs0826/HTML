define(['index',
    '/dts/hgp/html/hrb-beneficiarioCompartRiscoIntercam/beneficiarioCompartRiscoIntercamFactory.js',
    '/dts/hgp/html/hrb-beneficiarioCompartRiscoIntercam/controller/advancedFilterController.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    beneficiarioCompartRiscoIntercamListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service',
                                      'hrb.beneficiarioCompartRiscoIntercam.Factory','global.userConfigs.Factory',
                                      '$modal','AbstractAdvancedFilterController','TOTVSEvent'];
    function beneficiarioCompartRiscoIntercamListController($rootScope, $scope, appViewService,beneficiarioCompartRiscoIntercamFactory,
                                                userConfigsFactory,$modal,AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;

        _self.cdProgramaCorrente = 'hrb.beneficiarioCompartRiscoIntercamList';
        _self.config = [];
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.disclaimers = [];
        _self.listOfbeneficiarioCompartRiscoIntercam = [];
        _self.listOfbeneficiarioCompartRiscoIntercamCount = 0;

        this.criaRotulo = function (registro) {
            return "Unidade: " + registro.cdnUnidCart  + " - Beneficiário: " + registro.cddCartUsuar + " " 
                + registro.nmUsuario;            
        }
        
        this.search = function (isMore) {

            var startAt = 0;
            _self.listOfbeneficiarioCompartRiscoIntercamCount = 0;

            if (isMore) {
                startAt = _self.listOfbeneficiarioCompartRiscoIntercam.length + 1;
            } else {
                _self.listOfbeneficiarioCompartRiscoIntercam = [];
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
                    _self.disclaimers.push({property: 'cdUnidCart',
                        value: filtro,
                        title: 'Unidade: ' + filtro,
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
            beneficiarioCompartRiscoIntercamFactory.getBeneficiarioCompartRiscoIntercamByFilter('', startAt, parseInt(_self.config.qtdRegistrosBusca), true, _self.disclaimers, function (result) {
                _self.hasDoneSearch = true;
                //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                if (result) {
                    angular.forEach(result, function (value) {

                        if (value && value.$length) {
                           _self.listOfbeneficiarioCompartRiscoIntercamCount = value.$length;
                        }
                        value.rotulo = _self.criaRotulo(value);
                        //value.dsStatus = _self.listStatus.get(value.inStatus);
                        _self.listOfbeneficiarioCompartRiscoIntercam.push(value);
                    });
                    if (isMore === false) {
                        $('.page-wrapper').scrollTop(0);
                    }
                }
            });
        };    

        this.openConfigWindow = function () {

            var configWindow = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrb-beneficiarioCompartRiscoIntercam/ui/configuration.html',
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
                templateUrl: '/dts/hgp/html/hrb-beneficiarioCompartRiscoIntercam/ui/advancedFilter.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrb.beneficiarioCompartRiscoIntercamAdvFilter.Control as afController',
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
            appViewService.startView("Compartilhamento de Riscos de Beneficiário Intercâmbio", 'hrb.beneficiarioCompartRiscoIntercamList.Control', _self);
                        
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
    index.register.controller('hrb.beneficiarioCompartRiscoIntercamList.Control', beneficiarioCompartRiscoIntercamListController);

});


