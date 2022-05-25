/*jslint plusplus: true, devel: false, forin: true, indent: 4, maxerr: 50 */
/*global define, angular, $, TOTVSEvent */
define(['index', 'angularAMD'], function(index) {
    'use strict';
    function ServiceModalAdvSearch($modal) {
        this.open = function(params) {
            var instance = $modal.open({
                templateUrl: '/dts/hub/html/paramfncproduct/paramfncproduct.advanced.search.html',
                controller: 'hub.paramfncproduct.ModalAdvancedSearchCtrl as controller',
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    parameters: function() {
                        return params;
                    }
                }
            });
            return instance.result;
        }
        ;
    }
    ServiceModalAdvSearch.$inject = ['$modal'];
    index.register.service('hub.paramfncproduct.ModalAdvancedSearch.Service', ServiceModalAdvSearch);
    function ModalAdvancedSearchCtrl($rootScope, $scope, $modalInstance, parameters, utbUtilsService, TOTVSEvent) {
        /*################################# Definição de Variáveis #################################*/
        var thisModalAdvancedSearchCtrl = this;
        this.serviceList = parameters.serviceList;
        this.ttAplicatDtsul = parameters.ttAplicatDtsul;
        this.ttModulDtsul = parameters.ttModulDtsul;
        this.ttShowAplicatDtsul = this.ttAplicatDtsul;
        this.ttShowModulDtsul = this.ttModulDtsul;
        this.model = {};
        this.disclaimers = {};
        this.utbUtils = utbUtilsService;
        /*######################################## Funções #########################################*/
        // Função....: onChangeApp
        // Descrição.: evento de onchange do campo de filtro da tela principal
        // Parâmetros: <não há>
        this.onChangeApp = function() {
            var availModule = false;
            if (thisModalAdvancedSearchCtrl.model.app == "" || thisModalAdvancedSearchCtrl.model.app == null) {
                thisModalAdvancedSearchCtrl.ttShowModulDtsul = thisModalAdvancedSearchCtrl.ttModulDtsul;
            } else {
                thisModalAdvancedSearchCtrl.ttShowModulDtsul = [];

                for (var e = 0; e < thisModalAdvancedSearchCtrl.ttModulDtsul.length; e++) {
                    if (thisModalAdvancedSearchCtrl.ttModulDtsul[e].cod_aplicat_dtsul.toUpperCase() == thisModalAdvancedSearchCtrl.model.app.toUpperCase()) {
                        var modules = {};
                        modules.cod_modul_dtsul = thisModalAdvancedSearchCtrl.ttModulDtsul[e].cod_modul_dtsul;
                        modules.nom_modul_dtsul_menu = thisModalAdvancedSearchCtrl.ttModulDtsul[e].nom_modul_dtsul_menu;
                        thisModalAdvancedSearchCtrl.ttShowModulDtsul.push(modules);
                        if (thisModalAdvancedSearchCtrl.model.module != "" && thisModalAdvancedSearchCtrl.model.module != null && thisModalAdvancedSearchCtrl.model.module.toUpperCase() == modules.cod_modul_dtsul.toUpperCase()) {
                            availModule = true;
                        }
                    }
                }
                if (!availModule) {
                    thisModalAdvancedSearchCtrl.model.module = "";
                }
            }
        }
        ;
        /* Função....: apply
           Descrição.: disparada ao clicar no botão Aplicar
           Parâmetros: <não há>
        */
        this.apply = function() {
            if (thisModalAdvancedSearchCtrl.isInvalidForm()) {
                return;
            }
            thisModalAdvancedSearchCtrl.disclaimers = thisModalAdvancedSearchCtrl.serviceList.parseModelToDisclaimers(thisModalAdvancedSearchCtrl.model, thisModalAdvancedSearchCtrl.ttInqExchVarInitParams);
            $modalInstance.close({
                disclaimers: thisModalAdvancedSearchCtrl.disclaimers
            });
        }
        ;
        /* Função....: cancel
           Descrição.: disparada ao clicar no botão Cancelar
           Parâmetros: <não há>
        */
        this.cancel = function() {
            $modalInstance.dismiss('cancel');
        }
        ;
        /* Função....: isInvalidForm
           Descrição.: Valida os campos do formulário
           Parâmetros: <não há>
        */
        this.isInvalidForm = function() {
            var messages = [], isInvalidForm = false, warning;
            // Se for invalido, monta e mostra a mensagem
            if (isInvalidForm) {
                warning = $rootScope.i18n('l-field', undefined, 'dts/utb') + ":";
                if (messages.length > 1) {
                    warning = $rootScope.i18n('l-fields', undefined, 'dts/utb') + ":";
                }
                angular.forEach(messages, function(item) {
                    warning = warning + ' ' + $rootScope.i18n(item.literal, undefined, item.context) + ', ';
                });
                if (messages.length > 1) {
                    warning = warning + ' ' + $rootScope.i18n('l-requireds', undefined, 'dts/utb');
                } else {
                    warning = warning + ' ' + $rootScope.i18n('l-required', undefined, 'dts/utb');
                }
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-attention', undefined, 'dts/cmg'),
                    detail: warning
                });
            }
            return isInvalidForm;
        }
        ;
        /* Função....: parseDisclaimersToModel
           Descrição.: responsável por transformar os disclaimers no objeto model
           Parâmetros: <não há>
        */
        this.parseDisclaimersToModel = function() {
            thisModalAdvancedSearchCtrl.utbUtils.parseDisclaimersToModel(parameters.disclaimers, function(model, disclaimers) {
                thisModalAdvancedSearchCtrl.model = model;
                thisModalAdvancedSearchCtrl.disclaimers = disclaimers;
            });
        }
        ;
        /* Função....: init
           Descrição.: responsável por inicializar o controller principal
           Parâmetros: <não há>
        */
        this.init = function() {
            thisModalAdvancedSearchCtrl.parseDisclaimersToModel();
            thisModalAdvancedSearchCtrl.onChangeApp();
        }
        ;
        /*####################################### Principal ########################################*/
        if ($rootScope.currentuserLoaded) {
            this.init();
        }
        $scope.$on(TOTVSEvent.rootScopeInitialize, function() {
            thisModalAdvancedSearchCtrl.init();
        });
        $scope.$on('$destroy', function() {
            thisModalAdvancedSearchCtrl = undefined;
        });
        /* Toda modal deve conter este tratamento para esconder a mesma ao clicar no botão Voltar do navegador */
        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            $modalInstance.dismiss('cancel');
        });
        /*##########################################################################################*/
    }
    ModalAdvancedSearchCtrl.$inject = ['$rootScope', '$scope', '$modalInstance', 'parameters', 'utb.utils.Service', 'TOTVSEvent'];
    index.register.controller('hub.paramfncproduct.ModalAdvancedSearchCtrl', ModalAdvancedSearchCtrl);
});
