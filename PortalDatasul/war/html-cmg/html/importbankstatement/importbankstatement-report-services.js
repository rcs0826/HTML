/*jslint plusplus: true, devel: false, forin: true, indent: 4, maxerr: 50 */
/*global define, angular, $, TOTVSEvent */
define(['index', '/dts/cmg/js/zoom/unid-fechto-cx.js', '/dts/cmg/js/zoom/regra-extrat-bcio.js', '/dts/cmg/js/dbo/cmg910wl.js', '/dts/cmg/js/api/importbankstatement.js', 'js/menu/services/ExecutionService', 'js/menu/directives/TotvsDatasulExecutionRpwDirective'], function(index) {

    'use strict';

    function ImpBankStmntRepCtrl($rootScope, $scope, $stateParams, $location, $filter, appViewService, customizationService, servCashClosingUnit, serviceRuleBankStmntAux, cmg910wlFactoryAux, importbankstatementFactory, utbUtilsService, executionService, $totvsprofile, TOTVSEvent) {

        /*################################# Definição de Variáveis #################################*/

        var thisImpBankStmntRepCtrl = this;

        this.model = {};
        this.params = {};

        this.ttImpBankStmntInitParams = {};

        this.serviceCashClosingUnit = servCashClosingUnit;
        this.serviceRuleBankStmnt = serviceRuleBankStmntAux;
        this.cmg910wlFactory = cmg910wlFactoryAux;
        this.utbUtils = utbUtilsService;
        this.listRuleBankStmntInit = undefined;
        this.stateParamId = undefined;

        /*######################################## Funções #########################################*/

        /* Função....: cancel
			Descrição.: fecha a tela
			Parâmetros: <não há>
		*/
        this.cancel = function() {
            //console.log("ImpBankStmntRepCtrl", "function: cancel");

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: $rootScope.i18n('l-question', undefined, 'dts/cmg'),
                text: $rootScope.i18n('msg-question-cancel-operation', undefined, 'dts/cmg'),
                cancelLabel: $rootScope.i18n('l-no', undefined, 'dts/cmg'),
                confirmLabel: $rootScope.i18n('l-yes', undefined, 'dts/cmg'),
                callback: function(isPositiveResult) {
                    if (isPositiveResult) {
                        // Confirmado o fechamento
                        $location.path('dts/cmg/importbankstatement/');
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
            //console.log("ImpBankStmntRepCtrl", "function: savePreferences");

            /* Chamada do método SET remoto passando uma página, 
				objeto do tipo array contendo valores e a função de callback */
            $totvsprofile.remote.remove('/importbankstatement/report', undefined, function(result) {

                var profileDataArray = [];

                /* GRAVANDO - VALIDA DATA DUPLICADA  (model.isValidDuplDate) */
                profileDataArray.push({
                    dataCode: 'isValidDuplDate',
                    dataValue: thisImpBankStmntRepCtrl.params.isValidDuplDate
                });

                /* GRAVANDO - VALIDA REFERÊNCIA DUPLICADA  (model.isValidDuplRef) */
                profileDataArray.push({
                    dataCode: 'isValidDuplRef',
                    dataValue: thisImpBankStmntRepCtrl.params.isValidDuplRef
                });

                /* GRAVANDO - VALIDA SALDO FINAL: SISTEMA X EXTRATO  (model.isValidFinalBalSysExt) */
                profileDataArray.push({
                    dataCode: 'isValidFinalBalSysExt',
                    dataValue: thisImpBankStmntRepCtrl.params.isValidFinalBalSysExt
                });

                /* GRAVANDO - SERVIDOR RPW (model.rpwServer) */
                profileDataArray.push({
                    dataCode: 'rpwServer',
                    dataValue: thisImpBankStmntRepCtrl.model.rpwServer
                });

                /* GRAVANDO - IMPRIME PARÂMETROS (model.printParameters) */
                profileDataArray.push({
                    dataCode: 'printParameters',
                    dataValue: thisImpBankStmntRepCtrl.model.printParameters
                });

                /* GRAVANDO - NOME DO ARQUIVO DE SAÍDA (model.filename) */
                profileDataArray.push({
                    dataCode: 'filename',
                    dataValue: thisImpBankStmntRepCtrl.model.filename
                });

                /* GRAVANDO - UNIDADE FECHAMENTO DE CAIXA (model.listCashClosingUnit) */
                profileDataArray = thisImpBankStmntRepCtrl.utbUtils.addSelectInProfileDataArray(profileDataArray, thisImpBankStmntRepCtrl.params.listCashClosingUnit, 'listCashClosingUnit', 'cashClosingUnit', 'cod_unid_fechto_cx', 'des_unid_fechto_cx');

                /* Chamada do método SET remoto passando uma página, 
						objeto do tipo array contendo valores e a função de callback */
                //console.info("ImpBankStmntRepCtrl", "function: totvsprofile.set", 'Salvando preferencias', profileDataArray);
                $totvsprofile.remote.set('/importbankstatement/report', profileDataArray, function(result) {//console.info("ImpBankStmntRepCtrl", "function: totvsprofile.set", 'Preferencias do usuario armazenadas');
                });
            });
        }
        ;

        /* Função....: isInvalidForm
			Descrição.: Valida os campos do formulário
			Parâmetros: <não há>
		*/
        this.isInvalidForm = function() {
            //console.log("ImpBankStmntRepCtrl", "function: isInvalidForm");

            var messages = [], isInvalidForm = false, warning, scheduleDate, scheduleTime;

            if (thisImpBankStmntRepCtrl.ttImpBankStmntInitParams.isReqCashClosUnit && thisImpBankStmntRepCtrl.params.listCashClosingUnit === undefined) {
                isInvalidForm = true;
                messages.push({
                    literal: 'l-cash-closing-unit',
                    context: 'dts/cmg'
                });
            }

            if (thisImpBankStmntRepCtrl.params.listRuleBankStmnt === undefined) {
                isInvalidForm = true;
                messages.push({
                    literal: 'l-rule-bank-statement',
                    context: 'dts/cmg'
                });
            }

            if (thisImpBankStmntRepCtrl.model.rpwServer === undefined || thisImpBankStmntRepCtrl.model.rpwServer === "") {
                isInvalidForm = true;
                messages.push({
                    literal: 'l-rpw-server',
                    context: ''
                });
            }

            if (thisImpBankStmntRepCtrl.model.filename === undefined || thisImpBankStmntRepCtrl.model.filename === "") {
                isInvalidForm = true;
                messages.push({
                    literal: 'l-output-filename',
                    context: ''
                });
            }

            if (thisImpBankStmntRepCtrl.model.schedule.type !== "TODAY") {

                scheduleDate = thisImpBankStmntRepCtrl.model.schedule.date;
                scheduleTime = thisImpBankStmntRepCtrl.model.schedule.time;

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
                    title: $rootScope.i18n('l-attention', undefined, 'dts/cmg'),
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
            //console.log('ImpBankStmntRepCtrl', 'function: exec');

            /* Efetua validacoes de tela (campos obrigatorios) */
            if (thisImpBankStmntRepCtrl.isInvalidForm()) {
                return;
            }

            var modelIsValidParams = {}
              , ttImportBankStmntExecParam = []
              , ttRuleBankStmnt = []
              , ttCashClosingUnit = [];

            ttImportBankStmntExecParam.push({
                validateDate: thisImpBankStmntRepCtrl.params.isValidDuplDate,
                validateReference: thisImpBankStmntRepCtrl.params.isValidDuplRef,
                validateEndBalance: thisImpBankStmntRepCtrl.params.isValidFinalBalSysExt
            });

            if (thisImpBankStmntRepCtrl.params.listRuleBankStmnt && thisImpBankStmntRepCtrl.params.listRuleBankStmnt.hasOwnProperty('objSelected')) {

                ttRuleBankStmnt = thisImpBankStmntRepCtrl.params.listRuleBankStmnt.objSelected;

            } else {

                if (thisImpBankStmntRepCtrl.params.listRuleBankStmnt) {
                    ttRuleBankStmnt.push(thisImpBankStmntRepCtrl.params.listRuleBankStmnt);
                }
            }

            if (thisImpBankStmntRepCtrl.params.listCashClosingUnit && thisImpBankStmntRepCtrl.params.listCashClosingUnit.hasOwnProperty('objSelected')) {

                ttCashClosingUnit = thisImpBankStmntRepCtrl.params.listCashClosingUnit.objSelected;

            } else {

                if (thisImpBankStmntRepCtrl.params.listCashClosingUnit) {
                    ttCashClosingUnit.push(thisImpBankStmntRepCtrl.params.listCashClosingUnit);
                }
            }

            modelIsValidParams.ttImportBankStmntExecParam = ttImportBankStmntExecParam;
            modelIsValidParams.ttRuleBankStmnt = ttRuleBankStmnt;
            modelIsValidParams.ttCashClosingUnit = ttCashClosingUnit;

            /* Efetua validacoes de negocio */
            importbankstatementFactory.isValidParamsExec(undefined, modelIsValidParams, function(result) {

                if (result && result.$hasError) {
                    return;
                }

                /* Salvando preferências do usuário */
                thisImpBankStmntRepCtrl.savePreferences();

                /* Tratamento abaixo para tratar as informacoes que estarao no model
					e serao enviadas ao servico Datasul padrao de geracao do pedido de
					execucao RPW. Como a temp-table que ira chegar ao progress eh campo x valor
					e os valores sao todos em formato character, eh feito este tratamento */

                /* VALIDA DATA DUPLICADA */
                if (thisImpBankStmntRepCtrl.params.isValidDuplDate === undefined || thisImpBankStmntRepCtrl.params.isValidDuplDate === null) {
                    thisImpBankStmntRepCtrl.model.isValidDuplDate = false;
                } else {
                    thisImpBankStmntRepCtrl.model.isValidDuplDate = thisImpBankStmntRepCtrl.params.isValidDuplDate;
                }

                /* VALIDA REFERÊNCIA DUPLICADA */
                if (thisImpBankStmntRepCtrl.params.isValidDuplRef === undefined || thisImpBankStmntRepCtrl.params.isValidDuplRef === null) {
                    thisImpBankStmntRepCtrl.model.isValidDuplRef = false;
                } else {
                    thisImpBankStmntRepCtrl.model.isValidDuplRef = thisImpBankStmntRepCtrl.params.isValidDuplRef;
                }

                /* VALIDA SALDO FINAL: SISTEMA X EXTRATO */
                if (thisImpBankStmntRepCtrl.params.isValidFinalBalSysExt === undefined || thisImpBankStmntRepCtrl.params.isValidFinalBalSysExt === null) {
                    thisImpBankStmntRepCtrl.model.isValidFinalBalSysExt = false;
                } else {
                    thisImpBankStmntRepCtrl.model.isValidFinalBalSysExt = thisImpBankStmntRepCtrl.params.isValidFinalBalSysExt;
                }

                /* UNIDADE FECHAMENTO DE CAIXA */
                thisImpBankStmntRepCtrl.model.listCashClosingUnit = "";

                if (thisImpBankStmntRepCtrl.params.listCashClosingUnit && thisImpBankStmntRepCtrl.params.listCashClosingUnit !== null && thisImpBankStmntRepCtrl.params.listCashClosingUnit.hasOwnProperty('objSelected')) {
                    angular.forEach(thisImpBankStmntRepCtrl.params.listCashClosingUnit.objSelected, function(cashClosingUnit) {

                        thisImpBankStmntRepCtrl.model.listCashClosingUnit += "|" + cashClosingUnit.cod_unid_fechto_cx;

                    });
                } else {
                    thisImpBankStmntRepCtrl.model.listCashClosingUnit = (thisImpBankStmntRepCtrl.params.listCashClosingUnit) ? thisImpBankStmntRepCtrl.params.listCashClosingUnit.cod_unid_fechto_cx : "";
                }

                /* REGRAS */
                thisImpBankStmntRepCtrl.model.listRuleBankStmnt = "";

                if (thisImpBankStmntRepCtrl.params.listRuleBankStmnt && thisImpBankStmntRepCtrl.params.listRuleBankStmnt !== null && thisImpBankStmntRepCtrl.params.listRuleBankStmnt.hasOwnProperty('objSelected')) {
                    angular.forEach(thisImpBankStmntRepCtrl.params.listRuleBankStmnt.objSelected, function(ruleBankStmnt) {

                        thisImpBankStmntRepCtrl.model.listRuleBankStmnt += "|" + ruleBankStmnt.num_id_regra_extrat;

                    });
                } else {
                    thisImpBankStmntRepCtrl.model.listRuleBankStmnt = (thisImpBankStmntRepCtrl.params.listRuleBankStmnt) ? thisImpBankStmntRepCtrl.params.listRuleBankStmnt.num_id_regra_extrat : "";
                }

                /* Chamada do servico rest datasul para criacao do pedido de execucao RPW */
                executionService.send(thisImpBankStmntRepCtrl.model);

            });
        }
        ;

        /* Função....: loadPreferences
			Descrição.: carrega preferências do usuário
			Parâmetros: <não há>
		*/
        this.loadPreferences = function() {
            //console.log("ImpBankStmntRepCtrl", "function: loadPreferences");

            /* Retorna parâmetros iniciais para o cálculo */
            importbankstatementFactory.getInitParamsExec(undefined, function(result) {

                if (result) {

                    /* Carrega parâmetros: se é obrigatório a UFC */
                    if (angular.isArray(result) && result.length >= 1) {
                        thisImpBankStmntRepCtrl.ttImpBankStmntInitParams = result[0];
                    }

                    /* Chamada do método GET remoto passando uma página, sem filtros e a função de callback */
                    $totvsprofile.remote.get('/importbankstatement/report', undefined, function(result) {

                        var profileDataArray = result;

                        //console.info("ImpBankStmntRepCtrl", "function: totvsprofile.get", 'Preferencias do usuario carregadas', profileDataArray);

                        /* Limpa campo Unidade Fechamento Caixa */
                        thisImpBankStmntRepCtrl.params.listCashClosingUnit = undefined;

                        angular.forEach(profileDataArray, function(data) {

                            switch (data.dataCode) {

                            case 'isValidDuplDate':

                                thisImpBankStmntRepCtrl.params.isValidDuplDate = data.dataValue;
                                break;

                            case 'isValidDuplRef':

                                thisImpBankStmntRepCtrl.params.isValidDuplRef = data.dataValue;
                                break;

                            case 'isValidFinalBalSysExt':

                                thisImpBankStmntRepCtrl.params.isValidFinalBalSysExt = data.dataValue;
                                break;

                            case 'rpwServer':

                                thisImpBankStmntRepCtrl.model.rpwServer = data.dataValue;
                                break;

                            case 'printParameters':

                                thisImpBankStmntRepCtrl.model.printParameters = data.dataValue;
                                break;

                            case 'filename':

                                thisImpBankStmntRepCtrl.model.filename = data.dataValue;
                                break;

                            case 'listCashClosingUnit':

                                thisImpBankStmntRepCtrl.params.listCashClosingUnit = (data.dataValue === 'array') ? thisImpBankStmntRepCtrl.utbUtils.parseProfileDataArrayToList(profileDataArray, 'cashClosingUnit', 'cod_unid_fechto_cx', 'des_unid_fechto_cx') : thisImpBankStmntRepCtrl.utbUtils.parseProfileDataArrayToItem(profileDataArray, 'cashClosingUnit', 'cod_unid_fechto_cx', 'des_unid_fechto_cx');
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
            //console.log("ImpBankStmntRepCtrl", "function: loadDefault");

            /* Classe MultipleSelectResult utilizada para montagem do objeto de múltipla seleção
				quando no modo de Alteração existir duas ou mais Contas Correntes para a regra */
            function MultipleSelectResult() {}
            MultipleSelectResult.prototype.toString = function() {
                return this.objSelected.length + ' - ' + $rootScope.i18n('l-selecteds', undefined, 'dts/utb');
            }
            ;

            /* Filtro para apresentar as regras do usuário corrente */
            thisImpBankStmntRepCtrl.listRuleBankStmntInit = {
                filters: {
                    'cod_usuario': $rootScope.currentuser.login
                }
            };

            /* Model e Params */
            thisImpBankStmntRepCtrl.model = {};
            thisImpBankStmntRepCtrl.params = {};

            /* Execução */
            thisImpBankStmntRepCtrl.model.filename = 'importbankstatement.log';
            thisImpBankStmntRepCtrl.model.programa = 'fch/fchcmg/importbankstatement.r';

            /* Quando a regra seja passada por stateparam, alimenta o campo da regra com a mesma,
				caso contrário é para executar todas as regras */
            if (thisImpBankStmntRepCtrl.stateParamId !== "") {
                thisImpBankStmntRepCtrl.cmg910wlFactory.getRecord({
                    user: $rootScope.currentuser.login,
                    id: thisImpBankStmntRepCtrl.stateParamId
                }, function(result) {
                    if (result && angular.isObject(result)) {
                        thisImpBankStmntRepCtrl.params.listRuleBankStmnt = result;
                    }
                });
            } else {
                thisImpBankStmntRepCtrl.cmg910wlFactory.findRecords({
                    limit: 999999999,
                    properties: {
                        property: 'cod_usuario',
                        value: $rootScope.currentuser.login
                    }
                }, function(result) {
                    if (result && angular.isArray(result)) {

                        if (result.length > 1) {
                            thisImpBankStmntRepCtrl.params.listRuleBankStmnt = new MultipleSelectResult();
                            thisImpBankStmntRepCtrl.params.listRuleBankStmnt.objSelected = result;
                        } else if (result.length === 1) {
                            thisImpBankStmntRepCtrl.params.listRuleBankStmnt = result[0];
                        }
                    }
                });
            }
        }
        ;

        /* Função....: init
			Descrição.: responsável por inicializar o controller principal
			Parâmetros: <não há>
		*/
        this.init = function() {
            //console.log("ImpBankStmntRepCtrl", "function: init");

            var id, createTab;

            /* createTab indica se a Aba já está aberta ou está sendo criada */
            createTab = appViewService.startView($rootScope.i18n('l-import-bank-statement', undefined, 'dts/cmg'), 'cmg.importbankstatement.ReportCtrl', thisImpBankStmntRepCtrl);

            // Se houver parametros na URL
            if ($stateParams && $stateParams.id && $stateParams.id === "all") {

                id = "all";

            } else {

                if ($stateParams && $stateParams.id) {
                    id = parseInt($stateParams.id, 10);
                }

                if (!id || isNaN(id)) {
                    id = "";
                }
            }

            /* Tratamento para manter o estado da tela ao sair da mesma e retornar */
            if (id === "all") {

                thisImpBankStmntRepCtrl.stateParamId = "";
                thisImpBankStmntRepCtrl.loadDefault();
                thisImpBankStmntRepCtrl.loadPreferences();

            } else {
                if (id !== thisImpBankStmntRepCtrl.stateParamId) {

                    thisImpBankStmntRepCtrl.stateParamId = id;
                    thisImpBankStmntRepCtrl.loadDefault();
                    thisImpBankStmntRepCtrl.loadPreferences();

                }
            }

            customizationService.callEvent('cmg.importbankstatement.ReportCtrl', 'initEvent', thisImpBankStmntRepCtrl);

        }
        ;

        /*####################################### Principal ########################################*/

        if ($rootScope.currentuserLoaded) {
            thisImpBankStmntRepCtrl.init();
        }

        $scope.$on(TOTVSEvent.rootScopeInitialize, function() {
            thisImpBankStmntRepCtrl.init();
        });

        $scope.$on('$destroy', function() {
            thisImpBankStmntRepCtrl = undefined;
        });

        /*##########################################################################################*/

    }

    ImpBankStmntRepCtrl.$inject = ['$rootScope', '$scope', '$stateParams', '$location', '$filter', 'totvs.app-main-view.Service', 'customization.generic.Factory', 'cmg.unid-fechto-cx.zoom', 'cmg.regra-extrat-bcio.zoom', 'cmg.cmg910wl.Factory', 'cmg.importbankstatement.Factory', 'utb.utils.Service', 'Execution', '$totvsprofile', 'TOTVSEvent'];

    index.register.controller('cmg.importbankstatement.ReportCtrl', ImpBankStmntRepCtrl);

});
