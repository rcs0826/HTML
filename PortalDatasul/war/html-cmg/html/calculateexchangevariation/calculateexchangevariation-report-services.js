/*jslint plusplus: true, devel: false, forin: true, indent: 4, maxerr: 50 */
/*global define, angular, $, TOTVSEvent */
define(['index', '/dts/cmg/js/zoom/unid-fechto-cx.js', '/dts/cmg/js/api/calculateexchangevariation.js', 'js/menu/services/ExecutionService', 'js/menu/directives/TotvsDatasulExecutionRpwDirective'], function(index) {

    'use strict';

    function CalcExchVarRepCtrl($rootScope, $scope, $stateParams, $location, $filter, appViewService, customizationService, servCashClosingUnit, calculateExchangeVariationFactory, utbUtilsService, executionService, $totvsprofile, TOTVSEvent) {

        /*################################# Definição de Variáveis #################################*/

        var thisCalcExchVarRepCtrl = this;

        this.model = {};
        this.params = {};

        this.ttExchangeVarInitParams = {};
        this.ttExchangeVarTransTypesDTO = [];

        this.serviceCashClosingUnit = servCashClosingUnit;
        this.utbUtils = utbUtilsService;

        /*######################################## Funções #########################################*/

        /* Função....: cancel
			Descrição.: fecha a tela
			Parâmetros: <não há>
		*/
        this.cancel = function() {
            //console.log("calcExchVarRepCtrl", "function: cancel");

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: $rootScope.i18n('l-question', undefined, 'dts/cmg'),
                text: $rootScope.i18n('msg-question-cancel-operation', undefined, 'dts/cmg'),
                cancelLabel: $rootScope.i18n('l-no', undefined, 'dts/cmg'),
                confirmLabel: $rootScope.i18n('l-yes', undefined, 'dts/cmg'),
                callback: function(isPositiveResult) {
                    if (isPositiveResult) {
                        // Confirmado o fechamento

                        appViewService.removeView(appViewService.getPageActive());
                    }
                }
            });
        }
        ;

        /* Função....: savePreferences
			Descrição.: salva preferências do usuário
			Parâmetros: <não há>
		*/
        this.savePreferences = function() {
            //console.log("calcExchVarRepCtrl", "function: savePreferences");

            /* Chamada do método SET remoto passando uma página, 
				objeto do tipo array contendo valores e a função de callback */
            $totvsprofile.remote.remove('/calculateexchangevariation/report', undefined, function(result) {

                var profileDataArray = [];

                /* GRAVANDO - DATA FIM CÁLCULO (params.calcDate) */
                profileDataArray.push({
                    dataCode: 'calcDate',
                    dataValue: thisCalcExchVarRepCtrl.params.calcDate
                });

                /* GRAVANDO - TIPO TRANSAÇÃO CAIXA (params.cashTransTypeCode) */
                profileDataArray.push({
                    dataCode: 'cashTransTypeCode',
                    dataValue: thisCalcExchVarRepCtrl.params.cashTransTypeCode
                });

                /* GRAVANDO - SERVIDOR RPW (model.rpwServer) */
                profileDataArray.push({
                    dataCode: 'rpwServer',
                    dataValue: thisCalcExchVarRepCtrl.model.rpwServer
                });

                /* GRAVANDO - SERVIDOR RPW (model.rpwServer) */
                profileDataArray.push({
                    dataCode: 'printParameters',
                    dataValue: thisCalcExchVarRepCtrl.model.printParameters
                });

                /* GRAVANDO - NOME DO ARQUIVO DE SAÍDA (model.filename) */
                profileDataArray.push({
                    dataCode: 'filename',
                    dataValue: thisCalcExchVarRepCtrl.model.filename
                });

                /* GRAVANDO - UNIDADE FECHAMENTO DE CAIXA (params.listCashClosingUnit) */
                profileDataArray = thisCalcExchVarRepCtrl.utbUtils.addSelectInProfileDataArray(profileDataArray, thisCalcExchVarRepCtrl.params.listCashClosingUnit, 'listCashClosingUnit', 'cashClosingUnit', 'cod_unid_fechto_cx', 'des_unid_fechto_cx');

                /* Chamada do método SET remoto passando uma página, 
						objeto do tipo array contendo valores e a função de callback */
                //console.info("calcExchVarRepCtrl", "function: totvsprofile.set", 'Salvando preferencias', profileDataArray);
                $totvsprofile.remote.set('/calculateexchangevariation/report', profileDataArray, function(result) {//console.info("calcExchVarRepCtrl", "function: totvsprofile.set", 'Preferencias do usuario armazenadas');
                });
            });
        }
        ;

        /* Função....: isInvalidForm
			Descrição.: Valida os campos do formulário
			Parâmetros: <não há>
		*/
        this.isInvalidForm = function() {
            //console.log("calcExchVarRepCtrl", "function: isInvalidForm");

            var messages = [], isInvalidForm = false, warning, scheduleDate, scheduleTime;

            if (thisCalcExchVarRepCtrl.params.calcDate === undefined) {
                isInvalidForm = true;
                messages.push({
                    literal: 'l-end-date-calculating',
                    context: 'dts/cmg'
                });
            }

            if (thisCalcExchVarRepCtrl.params.cashTransTypeCode === undefined) {
                isInvalidForm = true;
                messages.push({
                    literal: 'l-cash-trans-type',
                    context: 'dts/cmg'
                });
            }

            if (thisCalcExchVarRepCtrl.ttExchangeVarInitParams.isReqCashClosUnit && thisCalcExchVarRepCtrl.params.listCashClosingUnit === undefined) {
                isInvalidForm = true;
                messages.push({
                    literal: 'l-cash-closing-unit',
                    context: 'dts/cmg'
                });
            }

            if (thisCalcExchVarRepCtrl.model.rpwServer === undefined || thisCalcExchVarRepCtrl.model.rpwServer === "") {
                isInvalidForm = true;
                messages.push({
                    literal: 'l-rpw-server',
                    context: ''
                });
            }

            if (thisCalcExchVarRepCtrl.model.filename === undefined || thisCalcExchVarRepCtrl.model.filename === "") {
                isInvalidForm = true;
                messages.push({
                    literal: 'l-output-filename',
                    context: ''
                });
            }

            if (thisCalcExchVarRepCtrl.model.schedule.type !== "TODAY") {

                scheduleDate = thisCalcExchVarRepCtrl.model.schedule.date;
                scheduleTime = thisCalcExchVarRepCtrl.model.schedule.time;

                if (scheduleDate === undefined || isNaN(scheduleDate) || scheduleDate === null) {
                    isInvalidForm = true;
                    messages.push({
                        literal: 'l-schedule-to',
                        context: ''
                    });
                }
                if (scheduleTime === undefined || scheduleTime === null) {
                    isInvalidForm = true;
                    messages.push({
                        literal: 'l-time',
                        context: ''
                    });
                }
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
                    title: $rootScope.i18n('l-attention', undefined, 'dts/utb'),
                    detail: warning
                });
            }

            return isInvalidForm;

        }
        ;

        /* Função....: exec
			Descrição.: executa o processo de criação do pedido de execução
						para o cálculo da variação cambial
			Parâmetros: <não há>
		*/
        this.exec = function() {
            //console.log('calcExchVarRepCtrl', 'function: exec', thisCalcExchVarRepCtrl.params);

            /* Efetua validacoes de tela (campos obrigatorios) */
            if (thisCalcExchVarRepCtrl.isInvalidForm()) {
                return;
            }

            var modelIsValidParams = {}
              , ttCalcExchangeVarParamDTO = []
              , ttCashClosingUnitListDTO = [];

            ttCalcExchangeVarParamDTO.push({
                calcDate: thisCalcExchVarRepCtrl.params.calcDate,
                cashTransTypeCode: thisCalcExchVarRepCtrl.params.cashTransTypeCode
            });

            if (thisCalcExchVarRepCtrl.params.listCashClosingUnit && thisCalcExchVarRepCtrl.params.listCashClosingUnit.hasOwnProperty('objSelected')) {
                angular.forEach(thisCalcExchVarRepCtrl.params.listCashClosingUnit.objSelected, function(cashClosingUnit) {
                    ttCashClosingUnitListDTO.push({
                        cashClosingUnitCode: cashClosingUnit.cod_unid_fechto_cx
                    });

                });
            } else {
                ttCashClosingUnitListDTO.push({
                    cashClosingUnitCode: ((thisCalcExchVarRepCtrl.params.listCashClosingUnit) ? thisCalcExchVarRepCtrl.params.listCashClosingUnit.cod_unid_fechto_cx : "")
                });
            }

            modelIsValidParams.ttCalcExchangeVarParamDTO = ttCalcExchangeVarParamDTO;
            modelIsValidParams.ttCashClosingUnitListDTO = ttCashClosingUnitListDTO;

            /* Efetua validacoes de negocio */
            calculateExchangeVariationFactory.isValidParams(undefined, modelIsValidParams, function(result) {

                if (result && result.$hasError) {
                    return;
                }

                /* Salvando preferências do usuário */
                thisCalcExchVarRepCtrl.savePreferences();

                /* Tratamento abaixo para tratar as informacoes que estarao no model
					e serao enviadas ao servico Datasul padrao de geracao do pedido de
					execucao RPW. Como a temp-table que ira chegar ao progress eh campo x valor
					e os valores sao todos em formato character, eh feito este tratamento */

                /* DATA DE CALCULO */
                if (thisCalcExchVarRepCtrl.params.calcDate === undefined) {
                    thisCalcExchVarRepCtrl.model.calcDate = "";
                } else {
                    thisCalcExchVarRepCtrl.model.calcDate = thisCalcExchVarRepCtrl.params.calcDate;
                }

                /* TIPO TRANSACAO DE CAIXA */
                if (thisCalcExchVarRepCtrl.params.cashTransTypeCode === undefined) {
                    thisCalcExchVarRepCtrl.model.cashTransTypeCode = "";
                } else {
                    thisCalcExchVarRepCtrl.model.cashTransTypeCode = thisCalcExchVarRepCtrl.params.cashTransTypeCode;
                }

                /* UNIDADE FECHAMENTO DE CAIXA */
                thisCalcExchVarRepCtrl.model.listCashClosingUnit = "";

                if (thisCalcExchVarRepCtrl.params.listCashClosingUnit && thisCalcExchVarRepCtrl.params.listCashClosingUnit.hasOwnProperty('objSelected')) {
                    angular.forEach(thisCalcExchVarRepCtrl.params.listCashClosingUnit.objSelected, function(cashClosingUnit) {

                        thisCalcExchVarRepCtrl.model.listCashClosingUnit += "|" + cashClosingUnit.cod_unid_fechto_cx;

                    });
                } else {
                    thisCalcExchVarRepCtrl.model.listCashClosingUnit = (thisCalcExchVarRepCtrl.params.listCashClosingUnit) ? thisCalcExchVarRepCtrl.params.listCashClosingUnit.cod_unid_fechto_cx : "";
                }

                /* Chamada do servico rest datasul para criacao do pedido de execucao RPW */
                executionService.send(thisCalcExchVarRepCtrl.model);

            });
        }
        ;

        /* Função....: loadPreferences
			Descrição.: carrega preferências do usuário
			Parâmetros: <não há>
		*/
        this.loadPreferences = function() {
            //console.log("calcExchVarRepCtrl", "function: loadPreferences");

            /* Retorna parâmetros iniciais para o cálculo */
            calculateExchangeVariationFactory.getInitParams(undefined, function(result) {

                if (result) {

                    /* Carrega parâmetros: data início de cálculo e se é obrigatório a UFC */
                    if (result.hasOwnProperty("ttExchangeVarInitParams") && angular.isArray(result.ttExchangeVarInitParams) && result.ttExchangeVarInitParams.length >= 1) {
                        thisCalcExchVarRepCtrl.ttExchangeVarInitParams = result.ttExchangeVarInitParams[0];
                    }

                    /* Carrega combo com tipos transação de caixa */
                    if (result.hasOwnProperty("ttExchangeVarTransTypesDTO") && angular.isArray(result.ttExchangeVarTransTypesDTO) && result.ttExchangeVarInitParams.length >= 1) {
                        thisCalcExchVarRepCtrl.ttExchangeVarTransTypesDTO = result.ttExchangeVarTransTypesDTO;
                    }

                    /* Chamada do método GET remoto passando uma página, sem filtros e a função de callback */
                    $totvsprofile.remote.get('/calculateexchangevariation/report', undefined, function(result) {

                        var profileDataArray = result;

                        //console.info("calcExchVarRepCtrl", "function: totvsprofile.get", 'Preferencias do usuario carregadas', profileDataArray);

                        /* Limpa campo Unidade Fechamento Caixa */
                        thisCalcExchVarRepCtrl.params.listCashClosingUnit = undefined;

                        angular.forEach(profileDataArray, function(data) {

                            switch (data.dataCode) {

                            case 'calcDate':

                                thisCalcExchVarRepCtrl.params.calcDate = data.dataValue;
                                break;

                            case 'cashTransTypeCode':

                                thisCalcExchVarRepCtrl.params.cashTransTypeCode = data.dataValue;
                                break;

                            case 'rpwServer':

                                thisCalcExchVarRepCtrl.model.rpwServer = data.dataValue;
                                break;

                            case 'printParameters':

                                thisCalcExchVarRepCtrl.model.printParameters = data.dataValue;
                                break;

                            case 'filename':

                                thisCalcExchVarRepCtrl.model.filename = data.dataValue;
                                break;

                            case 'listCashClosingUnit':

                                thisCalcExchVarRepCtrl.params.listCashClosingUnit = (data.dataValue === 'array') ? thisCalcExchVarRepCtrl.utbUtils.parseProfileDataArrayToList(profileDataArray, 'cashClosingUnit', 'cod_unid_fechto_cx', 'des_unid_fechto_cx') : thisCalcExchVarRepCtrl.utbUtils.parseProfileDataArrayToItem(profileDataArray, 'cashClosingUnit', 'cod_unid_fechto_cx', 'des_unid_fechto_cx');
                                break;
                            }
                        });
                    });
                }
            });
        }
        ;

        /* Função....: loadDefault
			Descrição.: responsável por carregar parâmetros padrões
			Parâmetros: <não há>
		*/
        this.loadDefault = function() {
            //console.log("calcExchVarRepCtrl", "function: loadDefault");

            var today = new Date();

            // Schedule
            thisCalcExchVarRepCtrl.params.calcDate = today.getTime();
            thisCalcExchVarRepCtrl.params.listCashClosingUnit = undefined;

            // Execução
            thisCalcExchVarRepCtrl.model.filename = 'calculateexchangevar.log';
            thisCalcExchVarRepCtrl.model.programa = 'fch/fchcmg/calculateexchangevariation.r';

        }
        ;

        /* Função....: init
			Descrição.: responsável por inicializar o controller principal
			Parâmetros: <não há>
		*/
        this.init = function() {
            //console.log("calcExchVarRepCtrl", "function: init");

            if (appViewService.startView($rootScope.i18n('l-calculate-exchange-variation', undefined, 'dts/cmg'), 'cmg.calculateexchangevariation.ReportCtrl', thisCalcExchVarRepCtrl)) {

                thisCalcExchVarRepCtrl.loadDefault();
                thisCalcExchVarRepCtrl.loadPreferences();

            }

            customizationService.callEvent('cmg.calculateexchangevariation.ReportCtrl', 'initEvent', thisCalcExchVarRepCtrl);

        }
        ;

        /*####################################### Principal ########################################*/

        if ($rootScope.currentuserLoaded) {
            this.init();
        }

        $scope.$on(TOTVSEvent.rootScopeInitialize, function() {
            thisCalcExchVarRepCtrl.init();
        });

        $scope.$on('$destroy', function() {
            thisCalcExchVarRepCtrl = undefined;
        });

        /*##########################################################################################*/

    }

    CalcExchVarRepCtrl.$inject = ['$rootScope', '$scope', '$stateParams', '$location', '$filter', 'totvs.app-main-view.Service', 'customization.generic.Factory', 'cmg.unid-fechto-cx.zoom', 'cmg.calculateexchangevariation.Factory', 'utb.utils.Service', 'Execution', '$totvsprofile', 'TOTVSEvent'];

    index.register.controller('cmg.calculateexchangevariation.ReportCtrl', CalcExchVarRepCtrl);

});
