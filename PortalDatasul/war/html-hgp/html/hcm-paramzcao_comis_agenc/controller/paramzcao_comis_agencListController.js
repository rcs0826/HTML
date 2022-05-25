define(['index',
    '/dts/hgp/html/hcm-paramzcao_comis_agenc/paramzcao_comis_agencFactory.js',
    '/dts/hgp/html/hcm-paramzcao_comis_agenc/controller/paramzcao_comis_agencAdvancedFilterController.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hcm-paramzcao_comis_agenc/maintenance/controller/paramzcao_comis_agencMaintenanceController.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    paramzcao_comis_agencListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service',
                                                  'hcm.paramzcao_comis_agenc.Factory','global.userConfigs.Factory',
                                                  '$modal','AbstractAdvancedFilterController','TOTVSEvent'];
    function paramzcao_comis_agencListController($rootScope, $scope, appViewService,paramzcao_comis_agencFactory,
                                                userConfigsFactory,$modal,AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;

        _self.cdProgramaCorrente = 'hcm.paramzcao_comis_agencList';
        _self.config = {};
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.disclaimers = [];
        _self.listOfParamzcao_comis_agenc = [];
        _self.listOfParamzcao_comis_agencCount = 0;

        this.search = function (isMore) {

            var startAt = 0;
            _self.listOfParamzcao_comis_agencCount = 0;

            if (isMore) {
                startAt = _self.listOfParamzcao_comis_agenc.length + 1;
            } else {
                _self.listOfParamzcao_comis_agenc = [];
            }

            //Testa se foi preenchido o campo de busca
            if ((!angular.isUndefined(_self.searchInputText))
                && _self.searchInputText !== ''){

                //Remove todos os disclaimers
                var arrayLength = _self.disclaimers.length - 1;
                for (var i = arrayLength ; i >= 0 ; i--) {
                    _self.disclaimers.splice(i, 1);
                }

                if (isNaN(_self.searchInputText)) {
                    _self.disclaimers.push({property: 'desParamzcaoAgenc',
                                            value: _self.searchInputText,
                                            title: 'Descrição: ' + _self.searchInputText,
                                            priority: 1});
                } else {
                    _self.disclaimers.push({property: 'idRegra',
                                            value: _self.searchInputText,
                                            title: 'ID: ' + _self.searchInputText,
                                            priority: 1});
                }
            }

            //Limpa o campo de busca
            _self.searchInputText = '';

            //Busca os periodos com os filtros informados, retornando o numero de registros configurados após o campo startAt
            paramzcao_comis_agencFactory.getParamzcao_comis_agencByFilter('', startAt, _self.config.qtdRegistrosBusca, true, _self.disclaimers, function (result) {
                _self.hasDoneSearch = true;
                //Se encontrou resultados, preenche a lista de periodos com eles
                if (result) {
                    angular.forEach(result, function (value) {

                        if (value && value.$length) {
                           _self.listOfParamzcao_comis_agencCount = value.$length;
                        }
                        value = _self.preparaRegistro(value);
                        _self.listOfParamzcao_comis_agenc.push(value);
                    });
                    if (isMore === false) {
                        $('.page-wrapper').scrollTop(0);
                    }
                }
            });
        };

        // prepara registro para mostrar na listagem
        this.preparaRegistro = function(reg) {

            switch (reg.considParamzcaoAgenc) {
                case 1:
                    reg.dsConsidParamzcaoAgenc = 'Vidas Novas';
                    break;
                case 2:
                    reg.dsConsidParamzcaoAgenc = 'Vidas Existentes';
                    break;
                case 3:
                    reg.dsConsidParamzcaoAgenc = 'Vidas Titular Novo';
                    break;
                case 4:
                    reg.dsConsidParamzcaoAgenc = 'Vidas Totais';
                    break;                    
                default:
                    reg.dsConsidParamzcaoAgenc = 'Invalido';
                    break;
            }

            switch (reg.idiConsidParamzcaoBenefPagto) {
                case 1:
                    reg.dsIdiConsidParamzcaoBenefPagto = 'Vidas Novas';
                    break;
                case 2:
                    reg.dsIdiConsidParamzcaoBenefPagto = 'Vidas Existentes';
                    break;
                case 3:
                    reg.dsIdiConsidParamzcaoBenefPagto = 'Vidas Titular Novo';
                    break;
                case 4:
                    reg.dsIdiConsidParamzcaoBenefPagto = 'Vidas Totais';
                    break;                    
                default:
                    reg.dsIdiConsidParamzcaoBenefPagto = 'Invalido';
                    break;
            }

            switch (reg.contagComisAgenc) {
                case 1:
                    reg.dsContagComisAgenc = 'Grupo contratante';
                    break;
                case 2:
                    reg.dsContagComisAgenc = 'Contratante';
                    break;
                case 3:
                    reg.dsContagComisAgenc = 'Termo';
                    break;
                case 4:
                    reg.dsContagComisAgenc = 'Termo/Evento';
                    break;                    
                default:
                    reg.dsContagComisAgenc = 'Invalido';
                    break;
            }
            switch (reg.inVigPropMod) {
                case 1:
                    reg.dsinVigPropMod = 'Vigencia proposta';
                    break;
                case 2:
                    reg.dsinVigPropMod = 'Vigencia modulo';
                    break;                
                default:
                    reg.dsinVigPropMod = 'Invalido';
                    break;
            }			
            return reg;
        };

        this.removeParamzcao_comis_agenc = function (selectedparamzcao_comis_agenc) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
               title: 'Atenção!',
               text: 'Você realmente deseja remover o registro selecionado?',
               cancelLabel: 'Não',
               confirmLabel: 'Sim',
               size: 'md',
               callback: function (hasChoosenYes) {
                   if (hasChoosenYes != true)
                       return;

                   paramzcao_comis_agencFactory.removeParamzcao_comis_agenc(selectedparamzcao_comis_agenc,
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
                templateUrl: '/dts/hgp/html/hcm-paramzcao_comis_agenc/ui/paramzcao_comis_agencAdvancedFilter.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hcm.paramzcao_comis_agencAdvFilter.Control as afController',
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
                templateUrl: '/dts/hgp/html/hcm-paramzcao_comis_agenc/ui/paramzcao_comis_agencListConfiguration.html',
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
            appViewService.startView("Regras de Comissão e Agenciamento", 'hcm.paramzcao_comis_agencList.Control', _self);

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

        if ($rootScope.currentuserLoaded) {
            this.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }
    }

    index.register.controller('hcm.paramzcao_comis_agencList.Control', paramzcao_comis_agencListController);
});


