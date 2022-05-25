/*jslint plusplus: true, devel: false, forin: true, indent: 4, maxerr: 50 */
/*global define, angular, $, TOTVSEvent */
define(['index', 'angularAMD', '/dts/cmg/html/inquireexchangevariation/inquireexchangevariation-advanced-search-services.js', '/dts/cmg/js/zoom/cta-corren.js', '/dts/cmg/js/api/inquireexchangevariation.js'], function(index) {

    'use strict';

    function InqExchVarListCtrl($rootScope, $scope, $stateParams, $location, $filter, $timeout, $state, $totvsprofile, appViewService, customizationService, utbUtilsService, modalAdvancedSearch, inquireExchVarFactory, serviceListAux, serviceCheckingAcctAux, TOTVSEvent) {

        /*################################# Definição de Variáveis #################################*/

        var thisInqExchVarListCtrl = this;

        this.listResult = [];
        this.disclaimers = {};
        this.model = {};

        this.utbUtils = utbUtilsService;
        this.serviceCheckingAcct = serviceCheckingAcctAux;
        this.serviceList = serviceListAux;

        this.typeMsgSearch = "info";
        this.msgSearchNotFound = undefined;
        this.ttInqExchVarInitParams = undefined;
        this.acronymsIndicEconDefault = undefined;
        this.decimalsIndicEconDefault = undefined;

        this.gridOptions = undefined;

        /*######################################## Funções #########################################*/

        /*
        Função....: cellRendererTransactionFlow
        Descrição.: renderiza células da coluna "Fluxo" para os ícones de entrada ou saída
        Parâmetros: params
        */
        this.cellRendererTransactionFlow = function(dataItem) {

            var resultElement = dataItem.transactionFlow;

            if (!resultElement) {
                return resultElement;
            }

            if (dataItem.transactionFlow === 1) {
                resultElement = '<div>' + '<span class="glyphicon glyphicon-triangle-top" ' + 'style="color: green;"></span> ' + $rootScope.i18n("l-document-in", [], "dts/cmg") + '</div> ';
            } else {
                resultElement = '<div>' + '<span class="glyphicon glyphicon-triangle-bottom" ' + 'style="color: red;"></span> ' + $rootScope.i18n("l-document-out", [], "dts/cmg") + '</div> ';
            }

            return resultElement;

        };

        /*
        Função....: cellRendererPostedToGl
        Descrição.: renderiza células da coluna "Contabilizado" para apresentar o checkbox
        Parâmetros: params
        */
        this.cellRendererPostedToGl = function(dataItem) {

            var resultElement = dataItem.postedToGl;

            resultElement = '<div style="text-align: center;" > ' + '<span> ';

            /* Apresentar o checkbox marcado    para o valor Contabilizado = true
               Apresentar o checkbox desmarcado para o valor Contabilizado = false */
            if (dataItem.postedToGl === true) {
                resultElement = resultElement + '<input type="checkbox" checked disabled />';
            } else {
                resultElement = resultElement + '<input type="checkbox" disabled />';
            }

            resultElement = resultElement + '</span> ' + '</div> ';

            return resultElement;

        };

        /*
        Função....: cellRendererCompanyCheckingAcc
        Descrição.: renderiza células da coluna "Data Movimento" para apresentar os grupos e data corretamente
        Parâmetros: params
        */
        this.cellRendererCompanyCheckingAcc = function(dataItem) {

            return thisInqExchVarListCtrl.utbUtils.formatDate(dataItem.transactionDate);

        };

        /*
        Função....: cellRendererTransactionValue
        Descrição.: renderiza células da coluna "Valor"
        Parâmetros: params
        */
        this.cellRendererTransactionValue = function(dataItem, total) {

            var resultElement, data = dataItem,
                value = dataItem.transactionValue,
                acronymsIndicEcon = thisInqExchVarListCtrl.acronymsIndicEconDefault || "",
                decimalsIndicEcon = thisInqExchVarListCtrl.decimalsIndicEconDefault || 2,
                formatValue;

            if (data && angular.isObject(data) && data.hasOwnProperty('acronymsIndicEcon')) {
                acronymsIndicEcon = data.acronymsIndicEcon;
            }

            if (data && angular.isObject(data) && data.hasOwnProperty('decimalsIndicEcon')) {
                decimalsIndicEcon = data.decimalsIndicEcon;
            }

            formatValue = thisInqExchVarListCtrl.utbUtils.formatDecimal(value, acronymsIndicEcon + ' ', decimalsIndicEcon);

            resultElement = '<div style="text-align: right;" > ';

            if (!total) {
                resultElement = resultElement + '<span style="font-style: normal"> ';
            } else {
                resultElement = resultElement + "Total " + total + ":";
                if (value < 0) {
                    resultElement = resultElement + '<span style="font-weight: bolder; font-style: normal; color: red;"> ';
                } else {
                    resultElement = resultElement + '<span style="font-weight: bolder; font-style: normal; color: green;"> ';
                }
            }

            resultElement = resultElement + formatValue + '</span> ' + '</div> ';

            return resultElement;

        };
        /*
        Função....: priceFooterTemplate
        Descrição.: renderiza total
        Parâmetros: 
        */
        this.priceFooterTemplate = function() {
            return function(data) {
                var parent = data.parent();
                var items = parent.items;
                var total = 0;
                var grupo = "";
                if (parent.field == '["companyCodeF"]')
                    grupo = $rootScope.i18n('l-company', [], 'dts/cmg')
                if (parent.field == '["checkingAcctCodeF"]')
                    grupo = $rootScope.i18n('l-c-account', [], 'dts/cmg')
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (item.transactionFlow == 2) {
                        total = total - item.transactionValue;
                    } else {
                        total = total + item.transactionValue;
                    }
                }
                parent.transactionValue = total;
                return thisInqExchVarListCtrl.cellRendererTransactionValue(parent, grupo);
            }
        };
        /*
        Função....: groupHeaderTemplate
        Descrição.: renderiza titulos dos grupos
        Parâmetros: 
        */
        this.groupHeaderTemplate = function() {
            return function(data) {
                if (data.field == '["companyCodeF"]')
                    return '<span class="glyphicon glyphicon-stats"></span> ' + $rootScope.i18n("l-company", [], "dts/cmg") + ": " + data.value + " (" + data.aggregates.transactionValue.count + ")";
                if (data.field == '["checkingAcctCodeF"]')
                    return '<span class="glyphicon glyphicon-credit-card"></span> ' + $rootScope.i18n("l-checking-account", [], "dts/cmg") + ": " + data.value + " (" + data.aggregates.transactionValue.count + ")";
            }
        };



        /*
        Função....: getParametersSearch
        Descrição.: retorna/valida os parâmetros que serão passados para o serviço rest de consulta
        Parâmetros: <não há>
        */
        this.getParametersSearch = function() {
            //console.log("InqExchVarListCtrl", "function: isInvalidForm");

            var ttEmpresa, ttCtaCorren, ttUnidFechtoCx, ttInqExchVarParams, ttInqExchVarParamsRow, parameters, fieldsRequired = "";

            /* Converte os disclaimers no objeto model */
            thisInqExchVarListCtrl.utbUtils.parseDisclaimersToModel(thisInqExchVarListCtrl.disclaimers, function(model, disclaimers) {
                thisInqExchVarListCtrl.model = {};
                thisInqExchVarListCtrl.model = model;
            });

            /* Parâmetro ttEmpresa (uma ou mais empresas selecionadas) [OBRIGATÓRIO] */
            ttEmpresa = [];
            if (thisInqExchVarListCtrl.model.listCompany !== undefined && thisInqExchVarListCtrl.model.listCompany !== null) {

                if (thisInqExchVarListCtrl.model.listCompany.hasOwnProperty("objSelected")) {
                    /* Múltiplos registros selecionados */
                    ttEmpresa = thisInqExchVarListCtrl.model.listCompany.objSelected || {};
                } else {
                    /* Apenas 1 registro selecionado */
                    ttEmpresa = thisInqExchVarListCtrl.model.listCompany;
                }
            } else {

                /* Campo empresa obrigatório */
                if (fieldsRequired && fieldsRequired !== "") {
                    fieldsRequired += ", ";
                }
                fieldsRequired += $rootScope.i18n('l-company', undefined, 'dts/utb');

            }

            /* Parâmetro ttCtaCorren (uma ou mais contas correntes selecionadas) [OPCIONAL] */
            ttCtaCorren = [];
            if (thisInqExchVarListCtrl.model.listCheckingAcct !== undefined && thisInqExchVarListCtrl.model.listCheckingAcct !== null) {

                if (thisInqExchVarListCtrl.model.listCheckingAcct.hasOwnProperty("objSelected")) {
                    /* Múltiplos registros selecionados */
                    ttCtaCorren = thisInqExchVarListCtrl.model.listCheckingAcct.objSelected || {};
                } else {
                    /* Apenas 1 registro selecionado */
                    ttCtaCorren = thisInqExchVarListCtrl.model.listCheckingAcct;
                }
            }

            /* Parâmetro ttUnidFechtoCx (uma ou mais UFC selecionadas) [OPCIONAL ou OBRIGATÓRIO] */
            ttUnidFechtoCx = [];
            if (thisInqExchVarListCtrl.model.listCashClosingUnit !== undefined && thisInqExchVarListCtrl.model.listCashClosingUnit !== null) {

                if (thisInqExchVarListCtrl.model.listCashClosingUnit.hasOwnProperty("objSelected")) {
                    /* Múltiplos registros selecionados */
                    ttUnidFechtoCx = thisInqExchVarListCtrl.model.listCashClosingUnit.objSelected || {};
                } else {
                    /* Apenas 1 registro selecionado */
                    ttUnidFechtoCx = thisInqExchVarListCtrl.model.listCashClosingUnit;
                }
            } else {

                /* Obrigatório apenas se o parâmetro UFC Obrigatório em
          Parâmetros Gerais Caixa Bancos estiver marcado*/
                if (thisInqExchVarListCtrl.ttInqExchVarInitParams && thisInqExchVarListCtrl.ttInqExchVarInitParams.hasOwnProperty('isReqCashClosUnit') && thisInqExchVarListCtrl.ttInqExchVarInitParams.isReqCashClosUnit) {

                    /* Campo empresa obrigatório */
                    if (fieldsRequired && fieldsRequired !== "") {
                        fieldsRequired += ", ";
                    }
                    fieldsRequired += $rootScope.i18n('l-cash-closing-unit', undefined, 'dts/cmg');
                }
            }

            /* Parâmetro ttInqExchVarParams (demais parâmetros) */
            ttInqExchVarParams = [];
            ttInqExchVarParamsRow = {};
            ttInqExchVarParamsRow.viewDetails = true;

            /* Parâmetro ttInqExchVarParams.economicPurpose (finalidade econômica) [OBRIGATÓRIO] */
            if (thisInqExchVarListCtrl.model.economicPurpose && thisInqExchVarListCtrl.model.economicPurpose !== null && thisInqExchVarListCtrl.model.economicPurpose.hasOwnProperty('cod_finalid_econ')) {

                ttInqExchVarParamsRow.economicPurpose = thisInqExchVarListCtrl.model.economicPurpose.cod_finalid_econ;

            } else {

                ttInqExchVarParamsRow.economicPurpose = "";

                /* Campo finalidade econômica obrigatória */
                if (fieldsRequired && fieldsRequired !== "") {
                    fieldsRequired += ", ";
                }
                fieldsRequired += $rootScope.i18n('l-economic-purpose', undefined, 'dts/utb');

            }

            /* Parâmetro ttInqExchVarParams.glScenario (cenário contábil) [OBRIGATÓRIO] */
            if (thisInqExchVarListCtrl.model.glScenario && thisInqExchVarListCtrl.model.glScenario !== null && thisInqExchVarListCtrl.model.glScenario.hasOwnProperty('cod_cenar_ctbl')) {

                ttInqExchVarParamsRow.glScenario = thisInqExchVarListCtrl.model.glScenario.cod_cenar_ctbl;

            } else {

                ttInqExchVarParamsRow.glScenario = "";

                /* Campo cenário contábil obrigatório */
                if (fieldsRequired && fieldsRequired !== "") {
                    fieldsRequired += ", ";
                }
                fieldsRequired += $rootScope.i18n('l-gl-scenario', undefined, 'dts/utb');

            }

            /* Parâmetro ttInqExchVarParams.dateStMoveCheckAcct (data inicial de transação) [OBRIGATÓRIO] */
            if (thisInqExchVarListCtrl.model.dateMoveCheckingAcct && thisInqExchVarListCtrl.model.dateMoveCheckingAcct !== null && thisInqExchVarListCtrl.model.dateMoveCheckingAcct.hasOwnProperty('start') && thisInqExchVarListCtrl.model.dateMoveCheckingAcct.start !== undefined && thisInqExchVarListCtrl.model.dateMoveCheckingAcct.start !== null) {

                ttInqExchVarParamsRow.dateStMoveCheckAcct = thisInqExchVarListCtrl.model.dateMoveCheckingAcct.start;

                /* Parâmetro ttInqExchVarParams.dateEndMoveCheckAcct (data final de transação) [OPCIONAL]
          obs.: no serviço é assumido 31/12/9999 caso não tenha sido informada */
                if (thisInqExchVarListCtrl.model.dateMoveCheckingAcct.hasOwnProperty('end') && thisInqExchVarListCtrl.model.dateMoveCheckingAcct.end !== undefined && thisInqExchVarListCtrl.model.dateMoveCheckingAcct.end !== null) {
                    ttInqExchVarParamsRow.dateEndMoveCheckAcct = thisInqExchVarListCtrl.model.dateMoveCheckingAcct.end;
                }

            } else {

                /* Campo data transação obrigatório */
                if (fieldsRequired && fieldsRequired !== "") {
                    fieldsRequired += ", ";
                }
                fieldsRequired += $rootScope.i18n('l-transaction-date', undefined, 'dts/cmg');

            }

            ttInqExchVarParams.push(ttInqExchVarParamsRow);

            /* Validação caso algum campo obrigatório não tenha sido informado */
            if (fieldsRequired && fieldsRequired !== "") {

                thisInqExchVarListCtrl.msgSearchNotFound = $rootScope.i18n('msg-search-performed-fields-req-adv-search', undefined, 'dts/cmg') + fieldsRequired;
                thisInqExchVarListCtrl.typeMsgSearch = "danger";
                thisInqExchVarListCtrl.listResult = undefined;
                return false;
            }

            thisInqExchVarListCtrl.msgSearchNotFound = $rootScope.i18n('msg-record-not-found-search', undefined, 'dts/cmg');
            thisInqExchVarListCtrl.typeMsgSearch = "info";

            parameters = {};
            parameters.ttCtaCorren = ttCtaCorren;
            parameters.ttEmpresa = ttEmpresa;
            parameters.ttUnidFechtoCx = ttUnidFechtoCx;
            parameters.ttInqExchVarParams = ttInqExchVarParams;

            return parameters;

        };

        /*
        Função....: search
        Descrição.: efetua a consulta
        Parâmetros: <não há>
        */
        this.search = function(isSavePreferences) {
            //console.log('InqExchVarListCtrl', 'function: search', thisInqExchVarListCtrl.model);

            var parameters = thisInqExchVarListCtrl.getParametersSearch();

            /* Retorno inválido dos parâmetros não efetua a consulta */
            if (!parameters) {
                return;
            }

            inquireExchVarFactory.inquireExchangeVariation(undefined, angular.toJson(parameters), function(result) {

                if (result && result.$hasError) {
                    return;
                }

                /* Salvando preferências do usuário */
                if (isSavePreferences) {
                    thisInqExchVarListCtrl.savePreferences();
                }

                if (angular.isArray(result) && result.length >= 1) {

                    thisInqExchVarListCtrl.acronymsIndicEconDefault = result[0].acronymsIndicEcon;
                    thisInqExchVarListCtrl.decimalsIndicEconDefault = result[0].decimalsIndicEcon;

                }

                thisInqExchVarListCtrl.listResult = result || [];

            });
        };

        /*
        Função....: removeDisclaimer
        Descrição.: remove um disclaimer
        Parâmetros: disclaimer
        */
        this.removeDisclaimer = function(disclaimer) {
            var index = thisInqExchVarListCtrl.disclaimers.indexOf(disclaimer);
            if (index !== -1) {
                thisInqExchVarListCtrl.disclaimers.splice(index, 1);
                thisInqExchVarListCtrl.search(true);
            }
        };

        /*
        Função....: openAdvancedSearch
        Descrição.: abre a tela de pesquisa avançada
        Parâmetros: <não há>
        */
        this.openAdvancedSearch = function() {
            //console.log('InqExchVarListCtrl', 'function: openAdvancedSearch');

            modalAdvancedSearch.open({

                disclaimers: thisInqExchVarListCtrl.disclaimers,
                serviceList: thisInqExchVarListCtrl.serviceList,
                ttInqExchVarInitParams: thisInqExchVarListCtrl.ttInqExchVarInitParams

            }).then(function(result) {
                //console.log('InqExchVarListCtrl', 'function: openAdvancedSearch', 'result', result);

                thisInqExchVarListCtrl.disclaimers = result.disclaimers;
                thisInqExchVarListCtrl.search(true);

            });
        };

        /*
        Função....: loadPreferences
        Descrição.: carrega preferências do usuário
        Parâmetros: <não há>
        */
        this.loadPreferences = function() {
            //console.log("InqExchVarListCtrl", "function: loadPreferences");

            /* Retorna parâmetros iniciais */
            inquireExchVarFactory.getInitParams(undefined, function(result) {

                if (result && result.$hasError) {
                    return;
                }

                /* Carrega parâmetro: Finalidade Econômica */
                if (result.hasOwnProperty("ttFinalidEcon") && angular.isArray(result.ttFinalidEcon) && result.ttFinalidEcon.length >= 1) {
                    thisInqExchVarListCtrl.model.economicPurpose = result.ttFinalidEcon[0];
                }

                /* Carrega parâmetro: Empresa */
                if (result.hasOwnProperty("ttEmpresa") && angular.isArray(result.ttEmpresa) && result.ttEmpresa.length >= 1) {
                    thisInqExchVarListCtrl.model.listCompany = result.ttEmpresa[0];
                }

                /* Carrega parâmetro: Cenário Contábil */
                if (result.hasOwnProperty("ttCenarCtbl") && angular.isArray(result.ttCenarCtbl) && result.ttCenarCtbl.length >= 1) {
                    thisInqExchVarListCtrl.model.glScenario = result.ttCenarCtbl[0];
                }

                /* Carrega parâmetros: data início e fim da consulta e se é obrigatório a UFC */
                if (result.hasOwnProperty("ttInqExchVarInitParams") && angular.isArray(result.ttInqExchVarInitParams) && result.ttInqExchVarInitParams.length >= 1) {
                    thisInqExchVarListCtrl.ttInqExchVarInitParams = result.ttInqExchVarInitParams[0];

                    thisInqExchVarListCtrl.model.dateMoveCheckingAcct = {};
                    thisInqExchVarListCtrl.model.dateMoveCheckingAcct.start = thisInqExchVarListCtrl.ttInqExchVarInitParams.dateStMoveCheckAcct;
                    thisInqExchVarListCtrl.model.dateMoveCheckingAcct.end = thisInqExchVarListCtrl.ttInqExchVarInitParams.dateEndMoveCheckAcct;
                }

                /* Chamada do método GET remoto passando uma página, sem filtros e a função de callback */
                $totvsprofile.remote.get('/inquireexchangevariation/list', undefined, function(result) {

                    var profileDataArray = result;

                    //console.info("InqExchVarListCtrl", "function: totvsprofile.get", 'Preferencias do usuario carregadas', profileDataArray);

                    if (profileDataArray === undefined || !angular.isArray(profileDataArray) || profileDataArray.length === 0) {
                        /* Atualiza disclaimers com base no model */
                        thisInqExchVarListCtrl.disclaimers = thisInqExchVarListCtrl.serviceList.parseModelToDisclaimers(thisInqExchVarListCtrl.model, thisInqExchVarListCtrl.ttInqExchVarInitParams);

                        /* Dispara a consulta */
                        thisInqExchVarListCtrl.search(false);
                        return;
                    }

                    angular.forEach(profileDataArray, function(data) {

                        switch (data.dataCode) {

                            case 'listCheckingAcct':

                                thisInqExchVarListCtrl.model.listCheckingAcct = (data.dataValue === 'array') ? thisInqExchVarListCtrl.utbUtils.parseProfileDataArrayToList(profileDataArray, 'checkingAcct', 'cod_cta_corren', 'nom_abrev') : thisInqExchVarListCtrl.utbUtils.parseProfileDataArrayToItem(profileDataArray, 'checkingAcct', 'cod_cta_corren', 'nom_abrev');
                                break;

                            case 'economicPurpose':

                                thisInqExchVarListCtrl.model.economicPurpose = thisInqExchVarListCtrl.utbUtils.parseProfileDataArrayToItem(profileDataArray, 'economicPurpose', 'cod_finalid_econ', 'des_finalid_econ');
                                break;

                            case 'listCompany':

                                thisInqExchVarListCtrl.model.listCompany = (data.dataValue === 'array') ? thisInqExchVarListCtrl.utbUtils.parseProfileDataArrayToList(profileDataArray, 'company', 'cod_empresa', 'nom_abrev') : thisInqExchVarListCtrl.utbUtils.parseProfileDataArrayToItem(profileDataArray, 'company', 'cod_empresa', 'nom_abrev');
                                break;

                            case 'listCashClosingUnit':

                                thisInqExchVarListCtrl.model.listCashClosingUnit = (data.dataValue === 'array') ? thisInqExchVarListCtrl.utbUtils.parseProfileDataArrayToList(profileDataArray, 'cashClosingUnit', 'cod_unid_fechto_cx', 'des_unid_fechto_cx') : thisInqExchVarListCtrl.utbUtils.parseProfileDataArrayToItem(profileDataArray, 'cashClosingUnit', 'cod_unid_fechto_cx', 'des_unid_fechto_cx');
                                break;

                            case 'glScenario':

                                thisInqExchVarListCtrl.model.glScenario = thisInqExchVarListCtrl.utbUtils.parseProfileDataArrayToItem(profileDataArray, 'glScenario', 'cod_cenar_ctbl', 'des_cenar_ctbl');
                                break;

                            case 'dateMoveCheckingAcct_start':

                                if (!angular.isObject(thisInqExchVarListCtrl.model.dateMoveCheckingAcct)) {
                                    thisInqExchVarListCtrl.model.dateMoveCheckingAcct = {};
                                }

                                thisInqExchVarListCtrl.model.dateMoveCheckingAcct.start = data.dataValue;
                                break;

                            case 'dateMoveCheckingAcct_end':

                                if (!angular.isObject(thisInqExchVarListCtrl.model.dateMoveCheckingAcct)) {
                                    thisInqExchVarListCtrl.model.dateMoveCheckingAcct = {};
                                }

                                thisInqExchVarListCtrl.model.dateMoveCheckingAcct.end = data.dataValue;
                                break;
                        }
                    });

                    /* Atualiza disclaimers com base no model */
                    thisInqExchVarListCtrl.disclaimers = thisInqExchVarListCtrl.serviceList.parseModelToDisclaimers(thisInqExchVarListCtrl.model, thisInqExchVarListCtrl.ttInqExchVarInitParams);

                    /* Dispara a consulta */
                    thisInqExchVarListCtrl.search(false);

                });
            });
        };

        /*
        Função....: savePreferences
        Descrição.: salva preferências do usuário
        Parâmetros: <não há>
        */
        this.savePreferences = function() {
            //console.log("InqExchVarListCtrl", "function: savePreferences");

            /* Chamada do método SET remoto passando uma página, 
               objeto do tipo array contendo valores e a função de callback */
            $totvsprofile.remote.remove('/inquireexchangevariation/list', undefined, function(result) {

                var profileDataArray = [],
                    listCashClosingUnit, i, cashClosingUnit;

                /* GRAVANDO - CONTA CORRENTE (listCheckingAcct) */
                profileDataArray = thisInqExchVarListCtrl.utbUtils.addSelectInProfileDataArray(profileDataArray, thisInqExchVarListCtrl.model.listCheckingAcct, 'listCheckingAcct', 'checkingAcct', 'cod_cta_corren', 'nom_abrev');

                /* GRAVANDO - FINALIDADE ECONÔMICA (economicPurpose) */
                profileDataArray = thisInqExchVarListCtrl.utbUtils.addSelectInProfileDataArray(profileDataArray, thisInqExchVarListCtrl.model.economicPurpose, 'economicPurpose', 'economicPurpose', 'cod_finalid_econ', 'des_finalid_econ');

                /* GRAVANDO - EMPRESA (listCompany) */
                profileDataArray = thisInqExchVarListCtrl.utbUtils.addSelectInProfileDataArray(profileDataArray, thisInqExchVarListCtrl.model.listCompany, 'listCompany', 'company', 'cod_empresa', 'nom_abrev');

                /* GRAVANDO - UNIDADE FECHAMENTO DE CAIXA (listCashClosingUnit) */
                profileDataArray = thisInqExchVarListCtrl.utbUtils.addSelectInProfileDataArray(profileDataArray, thisInqExchVarListCtrl.model.listCashClosingUnit, 'listCashClosingUnit', 'cashClosingUnit', 'cod_unid_fechto_cx', 'des_unid_fechto_cx');

                /* GRAVANDO - CENÁRIO CONTÁBIL (glScenario) */
                profileDataArray = thisInqExchVarListCtrl.utbUtils.addSelectInProfileDataArray(profileDataArray, thisInqExchVarListCtrl.model.glScenario, 'glScenario', 'glScenario', 'cod_cenar_ctbl', 'des_cenar_ctbl');

                /* GRAVANDO - DATA DE TRANSAÇÃO (dateMoveCheckingAcct) */
                profileDataArray.push({
                    dataCode: 'dateMoveCheckingAcct_start',
                    dataValue: thisInqExchVarListCtrl.model.dateMoveCheckingAcct.start
                });

                /* GRAVANDO - NOME DO ARQUIVO DE SAÍDA (model.filename) */
                profileDataArray.push({
                    dataCode: 'dateMoveCheckingAcct_end',
                    dataValue: thisInqExchVarListCtrl.model.dateMoveCheckingAcct.end
                });

                /* Chamada do método SET remoto passando uma página, 
            objeto do tipo array contendo valores e a função de callback */
                //console.info("InqExchVarListCtrl", "function: totvsprofile.set", 'Salvando preferencias', profileDataArray);
                $totvsprofile.remote.set('/inquireexchangevariation/list', profileDataArray, function(result) { //console.info("InqExchVarListCtrl", "function: totvsprofile.set", 'Preferencias do usuario armazenadas');
                });
            });
        };

        /*
        Função....: onChangeCheckingAcct
        Descrição.: evento de onchange do campo Conta Corrente
        Parâmetros: <não há>
        */
        this.onChangeCheckingAcct = function(selected, oldValue) {
            //console.log("InqExchVarListCtrl", "function: onChangeCheckingAcct", selected, oldValue);

            if (selected) {
                thisInqExchVarListCtrl.model.listCheckingAcct = selected;
            }

            /*
             Função parseModelToDisclaimers deve ser chamada para atualizar os disclaimers */
            thisInqExchVarListCtrl.disclaimers = thisInqExchVarListCtrl.serviceList.parseModelToDisclaimers(thisInqExchVarListCtrl.model, thisInqExchVarListCtrl.ttInqExchVarInitParams);

            thisInqExchVarListCtrl.search(true);

        };
        /*
        Função....: init
        Descrição.: responsável por inicializar o controller principal
        Parâmetros: <não há>
        */
        this.init = function() {
            //console.log("InqExchVarListCtrl", "function: init");

            if (appViewService.startView($rootScope.i18n('l-inquire-exchange-variation', undefined, 'dts/cmg'), 'cmg.inquireexchangevariation.ListCtrl', thisInqExchVarListCtrl)) {

                thisInqExchVarListCtrl.msgSearchNotFound = $rootScope.i18n('msg-record-not-found-search', undefined, 'dts/cmg');

                thisInqExchVarListCtrl.loadPreferences();
            }

            var i18n = $rootScope.i18n;
        };

        /*####################################### Principal ########################################*/

        if ($rootScope.currentuserLoaded) {
            this.init();
        }

        $scope.$on(TOTVSEvent.rootScopeInitialize, function() {
            thisInqExchVarListCtrl.init();
        });

        /*##########################################################################################*/

    }

    InqExchVarListCtrl.$inject = ['$rootScope', '$scope', '$stateParams', '$location', '$filter', '$timeout', '$state', '$totvsprofile', 'totvs.app-main-view.Service', 'customization.generic.Factory', 'utb.utils.Service', 'cmg.inquireexchangevariation.ModalAdvancedSearch.Service', 'cmg.inquireexchangevariation.Factory', 'cmg.inquireexchangevariation.InquireExchangeVariationList.Service', 'cmg.cta-corren.zoom', 'TOTVSEvent'];

    index.register.controller('cmg.inquireexchangevariation.ListCtrl', InqExchVarListCtrl);

    function ServiceList($rootScope, utbUtils) {

        var service = {};

        /*
        Função....: parseModelToDisclaimers
        Descrição.: responsável por transformar o objeto model nos disclaimers
        Parâmetros: <não há>
        */
        service.parseModelToDisclaimers = function(model, ttInqExchVarInitParams) {
            //console.log("ServiceList", "function: parseModelToDisclaimers");

            var disclaimers = [],
                key, uniqueModel, disclaimer, fields;

            for (key in model) {

                uniqueModel = model[key];
                disclaimer = undefined;
                fields = undefined;

                if (uniqueModel !== undefined) {

                    switch (key) {
                        case 'economicPurpose':
                            fields = ['cod_finalid_econ', 'des_finalid_econ'];
                            disclaimer = utbUtils.parseTypeToDisclaimer('select', key, uniqueModel, 'l-economic-purpose', 'dts/utb', true, fields);
                            break;
                        case 'listCompany':
                            fields = ['cod_empresa', 'nom_abrev'];
                            disclaimer = utbUtils.parseTypeToDisclaimer('select', key, uniqueModel, 'l-company', 'dts/utb', true, fields);
                            break;
                        case 'listCashClosingUnit':
                            fields = ['cod_unid_fechto_cx', 'des_unid_fechto_cx'];
                            disclaimer = utbUtils.parseTypeToDisclaimer('select', key, uniqueModel, 'l-cash-closing-unit', 'dts/cmg', (ttInqExchVarInitParams.isReqCashClosUnit || false), fields);
                            break;
                        case 'listCheckingAcct':
                            fields = ['cod_cta_corren', 'nom_abrev'];
                            disclaimer = utbUtils.parseTypeToDisclaimer('select', key, uniqueModel, 'l-checking-account', 'dts/cmg', false, fields);
                            break;
                        case 'glScenario':
                            fields = ['cod_cenar_ctbl', 'des_cenar_ctbl'];
                            disclaimer = utbUtils.parseTypeToDisclaimer('select', key, uniqueModel, 'l-gl-scenario', 'dts/utb', true, fields);
                            break;
                        case 'dateMoveCheckingAcct':
                            disclaimer = utbUtils.parseTypeToDisclaimer('date-range', key, uniqueModel, 'l-transaction-date', 'dts/cmg', true);
                            break;
                    }

                    if (disclaimer !== undefined) {
                        disclaimers.push(disclaimer);
                    }
                }
            }

            return disclaimers;

        };

        return service;

    }

    ServiceList.$inject = ['$rootScope', 'utb.utils.Service'];
    index.register.service('cmg.inquireexchangevariation.InquireExchangeVariationList.Service', ServiceList);

});
