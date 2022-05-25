/*jslint plusplus: true, devel: false, forin: true, indent: 4, maxerr: 50 */
/*global define, angular, $, TOTVSEvent */
define(['index', 'angularAMD'], function(index) {
    'use strict';
    function ServiceModalConfirmActiv($modal) {
        this.open = function(params) {
            var instance = $modal.open({
                templateUrl: '/dts/hub/html/paramfncproduct/paramfncproduct.confirm.activation.html',
                controller: 'hub.paramfncproduct.ModalConfirmActivCtrl as controller',
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
    ServiceModalConfirmActiv.$inject = ['$modal'];
    index.register.service('hub.paramfncproduct.ModalConfirmActiv.Service', ServiceModalConfirmActiv);
    function ModalConfirmActivCtrl($rootScope, $scope, $modalInstance, parameters, utbUtilsService, TOTVSEvent) {
        /*################################# Definição de Variáveis #################################*/
        var thisModalConfirmActivCtrl = this;
        this.record = parameters.modalRecord;
        this.model = {};
        this.utbUtils = utbUtilsService;
        /*######################################## Funções #########################################*/
        /* Função....: apply
           Descrição.: disparada ao clicar no botão Aplicar
           Parâmetros: <não há>
        */
        this.apply = function() {
            if (thisModalConfirmActivCtrl.isInvalidForm()) {
                return;
            }
            $modalInstance.close({
                log_aceite: thisModalConfirmActivCtrl.model.confirmReadAgree
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
        /* Função....: init
           Descrição.: responsável por inicializar o controller principal
           Parâmetros: <não há>
        */
        this.init = function() {}
        ;
        /*####################################### Principal ########################################*/
        if ($rootScope.currentuserLoaded) {
            this.init();
        }
        $scope.$on(TOTVSEvent.rootScopeInitialize, function() {
            thisModalConfirmActivCtrl.init();
        });
        $scope.$on('$destroy', function() {
            thisModalConfirmActivCtrl = undefined;
        });
        /* Toda modal deve conter este tratamento para esconder a mesma ao clicar no botão Voltar do navegador */
        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            $modalInstance.dismiss('cancel');
        });
        /*##########################################################################################*/
    }
    ModalConfirmActivCtrl.$inject = ['$rootScope', '$scope', '$modalInstance', 'parameters', 'utb.utils.Service', 'TOTVSEvent'];
    index.register.controller('hub.paramfncproduct.ModalConfirmActivCtrl', ModalConfirmActivCtrl);
});
