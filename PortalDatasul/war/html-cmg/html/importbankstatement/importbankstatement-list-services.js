/*jslint plusplus: true, devel: false, forin: true, indent: 4, maxerr: 50 */
/*global define, angular, $, TOTVSEvent */
define(['index', 'angularAMD', '/dts/cmg/js/api/importbankstatement.js', '/dts/cmg/js/zoom/banco.js'], function(index) {

    'use strict';

    function ImpBankStatemListCtrl($rootScope, $scope, $stateParams, $location, $filter, appViewService, customizationService, importbankstatementFactory, serviceBankAux, TOTVSEvent) {

        /*################################# Definição de Variáveis #################################*/

        var thisImpBankStatemListCtrl = this;

        this.disclaimers = [];
        this.model = {};
        this.listResult = undefined;
        this.listResultAll = undefined;
        this.searchFilter = undefined;
        this.totalRecords = 0;
        this.serviceBank = serviceBankAux;

        /*######################################## Funções #########################################*/

        /* Função....: deleteAllRule
			Descrição.: executa todos os registros
			Parâmetros: <não há>
		*/
        this.deleteAllRule = function() {
            //console.log("impBankStatemListCtrl", "function: deleteAllRule");

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: $rootScope.i18n('l-question', undefined, 'dts/cmg'),
                text: $rootScope.i18n('msg-confirm-delete-all-records-ignore-filters', undefined, 'dts/cmg'),
                cancelLabel: $rootScope.i18n('l-no', undefined, 'dts/cmg'),
                confirmLabel: $rootScope.i18n('l-yes', undefined, 'dts/cmg'),
                callback: function(isPositiveResult) {
                    if (isPositiveResult) {
                        // Confirmado a eliminação

                        // Método de remover registro
                        importbankstatementFactory.deleteAllUserRule(function(result) {

                            if (result && result.$hasError) {
                                return;
                            }

                            thisImpBankStatemListCtrl.loadDefaults();

                            // Notificar o usuario que os registros foram removidos
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'success',
                                title: $rootScope.i18n('l-rules', undefined, 'dts/cmg') + ' ' + $rootScope.i18n('msg-success-delete-plural', undefined, 'dts/cmg')
                            });
                        });
                    }
                }
            });
        }
        ;

        /* Função....: deleteRule
			Descrição.: evento de exclusão do registro na tabela dwb_set_list
			Parâmetros: record
		*/
        this.deleteRule = function(record) {
            //console.log("impBankStatemListCtrl", "function: deleteRule", record);

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: $rootScope.i18n('l-question', undefined, 'dts/cmg'),
                text: $rootScope.i18n('l-confirm-delete-operation', undefined, 'dts/cmg'),
                cancelLabel: $rootScope.i18n('l-no', undefined, 'dts/cmg'),
                confirmLabel: $rootScope.i18n('l-yes', undefined, 'dts/cmg'),
                callback: function(isPositiveResult) {
                    if (isPositiveResult) {
                        // Confirmado a eliminação

                        // Método de remover registro
                        importbankstatementFactory.deleteUserRule(record.num_id_regra_extrat, function(result) {

                            if (result && result.$hasError) {
                                return;
                            }

                            // Remover o item da lista
                            var index = thisImpBankStatemListCtrl.listResult.indexOf(record);
                            if (index !== -1) {

                                thisImpBankStatemListCtrl.listResult.splice(index, 1);
                                thisImpBankStatemListCtrl.totalRecords = thisImpBankStatemListCtrl.listResult.length;

                                // Notifica o usuario que o registro foi removido
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type: 'success',
                                    title: $rootScope.i18n('l-rule', undefined, 'dts/cmg') + ': ' + record.num_id_regra_extrat + ' - ' + record.des_regra_extrat + ', ' + $rootScope.i18n('msg-success-delete', undefined, 'dts/cmg')
                                });
                            }
                        });
                    }
                }
            });
        }
        ;

        /* Função....: removeDisclaimer
			Descrição.: elimina um filtro (disclaimer)
			Parâmetros: disclaimer
		*/
        this.removeDisclaimer = function(disclaimer) {
            //console.log("impBankStatemListCtrl", "function: removeDisclaimer", disclaimer);

            var index = thisImpBankStatemListCtrl.disclaimers.indexOf(disclaimer);
            if (index !== -1) {

                if (disclaimer.property === 'bank') {
                    thisImpBankStatemListCtrl.searchFilter = undefined;
                    thisImpBankStatemListCtrl.model.bank = undefined;
                }

                thisImpBankStatemListCtrl.disclaimers.splice(index, 1);
                thisImpBankStatemListCtrl.onChangeBank();
            }
        }
        ;

        /* Função....: getUserRecords
			Descrição.: retorna os registros da tabela dwb_set_list do usuário
			Parâmetros: isNewSearch
		*/
        this.getUserRecords = function(isNewSearch) {
            //console.log("impBankStatemListCtrl", "function: getUserRecords", isNewSearch);

            thisImpBankStatemListCtrl.listResult = [];
            thisImpBankStatemListCtrl.totalRecords = 0;

            if (isNewSearch) {

                thisImpBankStatemListCtrl.searchFilter = undefined;
                thisImpBankStatemListCtrl.listResultAll = [];

                importbankstatementFactory.getUserRules(undefined, function(result) {

                    if (result) {

                        //console.log("impBankStatemListCtrl", "function: getUserRules", result);

                        thisImpBankStatemListCtrl.listResultAll = result;
                        thisImpBankStatemListCtrl.listResult = thisImpBankStatemListCtrl.listResultAll;
                        thisImpBankStatemListCtrl.totalRecords = thisImpBankStatemListCtrl.listResult.length;

                    }
                });
            } else {

                angular.forEach(thisImpBankStatemListCtrl.listResultAll, function(movRow) {

                    if (movRow.cod_banco === thisImpBankStatemListCtrl.searchFilter) {
                        thisImpBankStatemListCtrl.listResult.push(movRow);
                    }

                });

                thisImpBankStatemListCtrl.totalRecords = thisImpBankStatemListCtrl.listResult.length;

            }
        }
        ;

        /* Função....: loadPreferences
			Descrição.: carrega preferências do usuário
			Parâmetros: <não há>
		*/
        this.loadPreferences = function() {
            //console.log("impBankStatemListCtrl", "function: loadPreferences");

            thisImpBankStatemListCtrl.getUserRecords(true);

        }
        ;

        /* Função....: loadDefaults
			Descrição.: carrega valores defaults
			Parâmetros: <não há>
		*/
        this.loadDefaults = function() {
            //console.log("impBankStatemListCtrl", "function: loadDefaults");

            thisImpBankStatemListCtrl.disclaimers = [];
            thisImpBankStatemListCtrl.model = {};
            thisImpBankStatemListCtrl.listResult = undefined;
            thisImpBankStatemListCtrl.listResultAll = undefined;
            thisImpBankStatemListCtrl.searchFilter = undefined;
            thisImpBankStatemListCtrl.totalRecords = 0;

        }
        ;

        /* Função....: onChangeBank
			Descrição.: evento de onchange do campo Banco
			Parâmetros: <não há>
		*/
        this.onChangeBank = function(selected, oldValue) {
            //console.log("impBankStatemListCtrl", "function: onChangeBank", selected, oldValue);

            if (selected) {
                thisImpBankStatemListCtrl.model.bank = selected;
            }

            thisImpBankStatemListCtrl.searchFilter = "";
            if (thisImpBankStatemListCtrl.model.bank !== undefined && thisImpBankStatemListCtrl.model.bank !== null && thisImpBankStatemListCtrl.model.bank.hasOwnProperty('cod_banco')) {
                thisImpBankStatemListCtrl.searchFilter = thisImpBankStatemListCtrl.model.bank.cod_banco;
            }

            thisImpBankStatemListCtrl.disclaimers = [];

            if (thisImpBankStatemListCtrl.searchFilter && thisImpBankStatemListCtrl.searchFilter !== "") {

                thisImpBankStatemListCtrl.disclaimers.push({
                    property: 'bank',
                    value: thisImpBankStatemListCtrl.searchFilter,
                    fixed: false,
                    title: $rootScope.i18n('l-bank', undefined, 'dts/cmg') + ': ' + thisImpBankStatemListCtrl.model.bank.cod_banco + ' - ' + thisImpBankStatemListCtrl.model.bank.nom_banco,
                    model: {
                        property: 'bank',
                        value: thisImpBankStatemListCtrl.searchFilter
                    }
                });

                thisImpBankStatemListCtrl.getUserRecords(false);
            } else {
                thisImpBankStatemListCtrl.getUserRecords(true);
            }
        }
        ;

        /* Função....: init
			Descrição.: responsável por inicializar o controller principal
			Parâmetros: <não há>
		*/
        this.init = function() {
            //console.log('impBankStatemListCtrl', 'function: init');

            appViewService.startView($rootScope.i18n('l-import-bank-statement', undefined, 'dts/cmg'), 'cmg.importbankstatement.ListCtrl', thisImpBankStatemListCtrl);

            thisImpBankStatemListCtrl.loadDefaults();
            thisImpBankStatemListCtrl.loadPreferences();

        }
        ;

        /*####################################### Principal ########################################*/

        if ($rootScope.currentuserLoaded) {
            thisImpBankStatemListCtrl.init();
        }

        $scope.$on(TOTVSEvent.rootScopeInitialize, function() {
            thisImpBankStatemListCtrl.init();
        });

        /*##########################################################################################*/
    }

    ImpBankStatemListCtrl.$inject = ['$rootScope', '$scope', '$stateParams', '$location', '$filter', 'totvs.app-main-view.Service', 'customization.generic.Factory', 'cmg.importbankstatement.Factory', 'cmg.banco.zoom', /* Zoom Banco (banco) */
    'TOTVSEvent'];

    index.register.controller('cmg.importbankstatement.ListCtrl', ImpBankStatemListCtrl);

});
