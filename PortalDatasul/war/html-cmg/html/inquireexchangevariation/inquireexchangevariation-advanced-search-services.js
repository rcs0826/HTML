/*jslint plusplus: true, devel: false, forin: true, indent: 4, maxerr: 50 */
/*global define, angular, $, TOTVSEvent */
define(['index', 'angularAMD', '/dts/cmg/js/zoom/unid-fechto-cx.js', '/dts/cmg/js/zoom/cta-corren.js', '/dts/cmg/js/api/inquireexchangevariation.js', '/dts/utb/js/zoom/finalid-econ.js', '/dts/utb/js/zoom/empresa.js', '/dts/utb/js/zoom/cenar-ctbl.js'], function(index) {

    'use strict';

    function ServiceModalAdvSearch($modal) {

        this.open = function(params) {

            var instance = $modal.open({

                templateUrl: '/dts/cmg/html/inquireexchangevariation/inquireexchangevariation.advanced.search.html',
                controller: 'cmg.inquireexchangevariation.ModalAdvancedSearchCtrl as controller',
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
    index.register.service('cmg.inquireexchangevariation.ModalAdvancedSearch.Service', ServiceModalAdvSearch);

    function ModalAdvancedSearchCtrl($rootScope, $scope, $modalInstance, parameters, utbUtilsService, serviceEconPurposeAux, serviceCompanyAux, serviceCashClosingUnitAux, serviceGLScenarioAux, TOTVSEvent) {

        /*################################# Definição de Variáveis #################################*/

        var thisModalAdvancedSearchCtrl = this;

        this.serviceList = parameters.serviceList;
        this.ttInqExchVarInitParams = parameters.ttInqExchVarInitParams;

        this.model = {};
        this.disclaimers = {};

        this.utbUtils = utbUtilsService;
        this.serviceEconPurpose = serviceEconPurposeAux;
        this.serviceCompany = serviceCompanyAux;
        this.serviceCashClosingUnit = serviceCashClosingUnitAux;
        this.serviceGLScenario = serviceGLScenarioAux;

        /*######################################## Funções #########################################*/

        /* Função....: apply
			Descrição.: disparada ao clicar no botão Aplicar
			Parâmetros: <não há>
		*/
        this.apply = function() {
            //console.log('ModalAdvancedSearchCtrl', 'function: apply');

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
            //console.log('ModalAdvancedSearchCtrl', 'function: cancel');

            $modalInstance.dismiss('cancel');

        }
        ;

        /* Função....: isInvalidForm
			Descrição.: Valida os campos do formulário
			Parâmetros: <não há>
		*/
        this.isInvalidForm = function() {
            //console.log("ModalAdvancedSearchCtrl", "function: isInvalidForm", thisModalAdvancedSearchCtrl.model);

            var messages = [], isInvalidForm = false, warning;

            if (thisModalAdvancedSearchCtrl.model.economicPurpose === undefined || thisModalAdvancedSearchCtrl.model.economicPurpose === null) {
                isInvalidForm = true;
                messages.push({
                    literal: 'l-economic-purpose',
                    context: 'dts/utb'
                });
            }

            if (thisModalAdvancedSearchCtrl.model.listCompany === undefined || thisModalAdvancedSearchCtrl.model.listCompany === null) {
                isInvalidForm = true;
                messages.push({
                    literal: 'l-company',
                    context: 'dts/utb'
                });
            }

            /* Obrigatório apenas se o parâmetro UFC Obrigatório em
				Parâmetros Gerais Caixa Bancos estiver marcado*/
            if (thisModalAdvancedSearchCtrl.ttInqExchVarInitParams && thisModalAdvancedSearchCtrl.ttInqExchVarInitParams !== null && thisModalAdvancedSearchCtrl.ttInqExchVarInitParams.hasOwnProperty('isReqCashClosUnit') && thisModalAdvancedSearchCtrl.ttInqExchVarInitParams.isReqCashClosUnit) {

                if (thisModalAdvancedSearchCtrl.model.listCashClosingUnit === undefined || thisModalAdvancedSearchCtrl.model.listCashClosingUnit === null) {
                    isInvalidForm = true;
                    messages.push({
                        literal: 'l-cash-closing-unit',
                        context: 'dts/cmg'
                    });
                }
            }

            if (thisModalAdvancedSearchCtrl.model.glScenario === undefined || thisModalAdvancedSearchCtrl.model.glScenario === null) {
                isInvalidForm = true;
                messages.push({
                    literal: 'l-gl-scenario',
                    context: 'dts/utb'
                });
            }

            if (thisModalAdvancedSearchCtrl.model.dateMoveCheckingAcct === undefined || thisModalAdvancedSearchCtrl.model.dateMoveCheckingAcct === null || thisModalAdvancedSearchCtrl.model.dateMoveCheckingAcct.start === undefined || thisModalAdvancedSearchCtrl.model.dateMoveCheckingAcct.start === null) {
                isInvalidForm = true;
                messages.push({
                    literal: 'l-transaction-date',
                    context: 'dts/cmg'
                });
            }

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
            //console.log("ModalAdvancedSearchCtrl", "function: parseDisclaimersToModel");

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
            //console.log("ModalAdvancedSearchCtrl", "function: init");

            thisModalAdvancedSearchCtrl.parseDisclaimersToModel();

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

    ModalAdvancedSearchCtrl.$inject = ['$rootScope', '$scope', '$modalInstance', 'parameters', 'utb.utils.Service', 'utb.finalid-econ.zoom', 'utb.empresa.zoom', 'cmg.unid-fechto-cx.zoom', 'utb.cenar-ctbl.zoom', 'TOTVSEvent'];
    index.register.controller('cmg.inquireexchangevariation.ModalAdvancedSearchCtrl', ModalAdvancedSearchCtrl);

});
