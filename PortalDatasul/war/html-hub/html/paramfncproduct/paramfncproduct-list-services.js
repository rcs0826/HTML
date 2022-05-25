/*jslint plusplus: true, devel: false, forin: true, indent: 4, maxerr: 50 */
/*global define, angular, $, TOTVSEvent */
define(['index', 'angularAMD', '/dts/hub/html/paramfncproduct/paramfncproduct-advanced-search-services.js', '/dts/hub/html/paramfncproduct/paramfncproduct-confirm-activation-services.js', '/dts/hub/js/api/paramfncproduct.js'], function(index) {
    'use strict';
    function ParamFncProdListCtrl($rootScope, $scope, $stateParams, $location, $filter, $timeout, $state, $totvsprofile, appViewService, customizationService, utbUtilsService, ParamFncProdFactory, ModalConfirmActiv, modalAdvancedSearch, serviceList, TOTVSEvent) {
        /*################################# Definição de Variáveis #################################*/
        // variaveis padrões
        var thisParamFncProdListCtrl = this;
        this.listResult = [];
        this.disclaimers = [];
        this.model = {};
        this.serviceList = serviceList;
        // variaveis de navegação/listagem
        this.ttAplicatDtsul = [];
        this.ttModulDtsul = [];
        this.ttFunctions = [];
        this.ttShowAplicatDtsul = this.ttAplicatDtsul;
        this.ttShowModulDtsul = this.ttModulDtsul;
        // disclaimer inicial
        var disclaimer = {
            "property": "showFunction",
            "value": "0",
            "title": $rootScope.i18n('l-show-function', undefined, 'dts/hub') + ': ' + $rootScope.i18n('l-all', undefined, 'dts/hub'),
            "fixed": true
        };
        this.disclaimers.push(disclaimer);
        /*######################################## Funções #########################################*/
        // Função....: disableAllFunction
        // Descrição.: desativa todas as funções
        // Parâmetros: <não há>
        this.disableAllFunction = function() {
            var listResult = [];
            for (var i = 0; i < thisParamFncProdListCtrl.listResult.length; i++) {
                if (thisParamFncProdListCtrl.listResult[i].log_ativac) {
                    listResult.push(thisParamFncProdListCtrl.listResult[i]);
                }
            }
            var parameters = listResult;
            ParamFncProdFactory.disableFunction(undefined, angular.toJson(parameters), function(result) {
                thisParamFncProdListCtrl.updateList();
            });
        }
        // Função....: disableFunction
        // Descrição.: ativa a função
        // Parâmetros: record: registro; 
        this.disableFunction = function(record) {
            var parameters = [record];
            ParamFncProdFactory.disableFunction(undefined, angular.toJson(parameters), function(result) {
                if (result && result.$hasError) {
                    return;
                }
                thisParamFncProdListCtrl.updateList();
            });
        }
        // Função....: activeAllFunction
        // Descrição.: ativa todas as funções
        // Parâmetros: <não há>
        this.activeAllFunction = function() {
            var listResult = [];
            for (var i = 0; i < thisParamFncProdListCtrl.listResult.length; i++) {
                if (!thisParamFncProdListCtrl.listResult[i].log_ativac) {
                    listResult.push(thisParamFncProdListCtrl.listResult[i]);
                }
            }
            var parameters = listResult;
            ParamFncProdFactory.activateFunction(undefined, angular.toJson(parameters), function(result) {
                thisParamFncProdListCtrl.updateList();
            });
        }
        // Função....: activeFunction
        // Descrição.: ativa a função
        // Parâmetros: record: registro; 
        this.activeFunction = function(record) {
            if (record.log_usa_aceite || !record.log_desligto) {
                ModalConfirmActiv.open({
                    modalRecord: record
                }).then(function(result) {
                    record.log_aceite = result.log_aceite ? true : false;
                    thisParamFncProdListCtrl.callActiveFunction([record]);
                });
            } else {
                thisParamFncProdListCtrl.callActiveFunction([record]);
            }
        }
        // Função....: callActiveFunction
        // Descrição.: faz a chamada da factory que irá ativar a função no banco
        // Parâmetros: record: registro; 
        this.callActiveFunction = function(record) {
            var parameters = record;
            ParamFncProdFactory.activateFunction(undefined, angular.toJson(parameters), function(result) {
                if (result && result.$hasError) {
                    return;
                }
                thisParamFncProdListCtrl.updateList();
            });
        }
        /* Função....: openAdvancedSearch
           Descrição.: abre a tela de pesquisa avançada
           Parâmetros: <não há>
        */
        this.openAdvancedSearch = function() {
            modalAdvancedSearch.open({
                disclaimers: thisParamFncProdListCtrl.disclaimers,
                serviceList: thisParamFncProdListCtrl.serviceList,
                ttAplicatDtsul: thisParamFncProdListCtrl.ttAplicatDtsul,
                ttModulDtsul: thisParamFncProdListCtrl.ttModulDtsul
            }).then(function(result) {
                thisParamFncProdListCtrl.disclaimers = result.disclaimers;
                thisParamFncProdListCtrl.search();
            });
        }
        ;
        // Função....: loadInitialStage
        // Descrição.: carrega tela pela primeira vez
        // Parâmetros: <não há>
        this.loadInitialStage = function() {
            /* Retorna parâmetros iniciais */
            ParamFncProdFactory.getInitParams(undefined, function(result) {
                if (result && result.$hasError) {
                    return;
                }
                thisParamFncProdListCtrl.ttFunctions = result.ttFunctions ? result.ttFunctions : [];
                thisParamFncProdListCtrl.listResult = result.ttFunctions ? result.ttFunctions : [];
                ;thisParamFncProdListCtrl.ttAplicatDtsul = result.ttAplicatDtsul ? result.ttAplicatDtsul : [];
                thisParamFncProdListCtrl.ttShowAplicatDtsul = thisParamFncProdListCtrl.ttAplicatDtsul;
                thisParamFncProdListCtrl.ttModulDtsul = result.ttModulAppDtsul ? result.ttModulAppDtsul : [];
                thisParamFncProdListCtrl.ttShowModulDtsul = thisParamFncProdListCtrl.ttModulDtsul;
            });
        }
        ;
        // Função....: updateList
        // Descrição.: atualiza lista
        // Parâmetros: <não há>
        this.updateList = function() {
            var parametersList = thisParamFncProdListCtrl.ttFunctions;
            ParamFncProdFactory.updateFunctions(undefined, angular.toJson(parametersList), function(resultList) {
                if (resultList && resultList.$hasError) {
                    return;
                }
                thisParamFncProdListCtrl.ttFunctions = resultList ? resultList : [];
                thisParamFncProdListCtrl.search();
            });
        }
        ;
        // Função....: search
        // Descrição.: Realiza buscas
        // Parâmetros: <não há>
        this.search = function() {
            var functionName = false;
            var app = false;
            var module = false;
            thisParamFncProdListCtrl.listResult = [];
            utbUtilsService.parseDisclaimersToModel(thisParamFncProdListCtrl.disclaimers, function(model, disclaimers) {
                thisParamFncProdListCtrl.model = model;
                thisParamFncProdListCtrl.disclaimers = disclaimers;
            });
            if (thisParamFncProdListCtrl.model.functionName != undefined && thisParamFncProdListCtrl.model.functionName != "") {
                functionName = true;
            }
            if (thisParamFncProdListCtrl.model.app != undefined && thisParamFncProdListCtrl.model.app != "") {
                app = true;
            }
            if (thisParamFncProdListCtrl.model.module != undefined && thisParamFncProdListCtrl.model.module != "") {
                module = true;
            }
            for (var i = 0; i < thisParamFncProdListCtrl.ttFunctions.length; i++) {
                var add = true;
                //thisParamFncProdListCtrl.model.showFunction == 'Active'
                if (thisParamFncProdListCtrl.model.showFunction == 1 && !thisParamFncProdListCtrl.ttFunctions[i].log_ativac) {
                    add = false;
                } else {
                    //thisParamFncProdListCtrl.model.showFunction == 'Disable'
                    if (thisParamFncProdListCtrl.model.showFunction == 2 && thisParamFncProdListCtrl.ttFunctions[i].log_ativac) {
                        add = false;
                    }
                }
                if (add) {
                    if (functionName) {
                        // filtra nome da função
                        if (thisParamFncProdListCtrl.ttFunctions[i].nom_funcao.toLowerCase().indexOf(thisParamFncProdListCtrl.model.functionName.toLowerCase()) === -1) {
                            add = false;
                        }
                    }
                }
                if (add) {
                    if (app) {
                        if (thisParamFncProdListCtrl.ttFunctions[i].cod_aplicat_dtsul.toUpperCase() !== thisParamFncProdListCtrl.model.app.toUpperCase()) {
                            add = false;
                        }
                    }
                }
                if (add) {
                    if (module) {
                        if (thisParamFncProdListCtrl.ttFunctions[i].cod_modul_dtsul.toUpperCase() !== thisParamFncProdListCtrl.model.module.toUpperCase()) {
                            add = false;
                        }
                    }
                }
                if (add) {
                    thisParamFncProdListCtrl.listResult.push(thisParamFncProdListCtrl.ttFunctions[i]);
                }
            }
        }
        ;
        // Função....: onChangefunctionName
        // Descrição.: evento de onchange do campo de filtro da tela principal
        // Parâmetros: <não há>
        this.onChangefunctionName = function() {
            if (thisParamFncProdListCtrl.model.functionName == "" || thisParamFncProdListCtrl.model.functionName == null ) {
                for (var i = thisParamFncProdListCtrl.disclaimers.length - 1; i >= 0; i--) {
                    if (thisParamFncProdListCtrl.disclaimers[i].property == "functionName") {
                        thisParamFncProdListCtrl.removeDisclaimer(thisParamFncProdListCtrl.disclaimers[i]);
                    }
                }
            } else {
                thisParamFncProdListCtrl.disclaimers = thisParamFncProdListCtrl.serviceList.parseModelToDisclaimers(thisParamFncProdListCtrl.model);
            }
            thisParamFncProdListCtrl.search();
        }
        // Função....: removeDisclaimer
        // Descrição.: remove um disclaimer
        // Parâmetros: disclaimer
        this.removeDisclaimer = function(disclaimer) {
            var index = thisParamFncProdListCtrl.disclaimers.indexOf(disclaimer);
            if (index !== -1) {
                thisParamFncProdListCtrl.disclaimers.splice(index, 1);
                thisParamFncProdListCtrl.search();
            }
        }
        ;
        // Função....: init
        //Descrição.: responsável por inicializar o controller principal
        //Parâmetros: <não há>
        this.init = function() {
            if (appViewService.startView($rootScope.i18n('l-parameters-product-functions', undefined, 'dts/hub'), 'hub.paramfncproduct.ListCtrl', thisParamFncProdListCtrl)) {
                thisParamFncProdListCtrl.loadInitialStage();
            }
        }
        /*####################################### Principal ########################################*/
        if ($rootScope.currentuserLoaded) {
            this.init();
        }
        $scope.$on(TOTVSEvent.rootScopeInitialize, function() {
            thisParamFncProdListCtrl.init();
        });
        /*##########################################################################################*/
    }
    ParamFncProdListCtrl.$inject = ['$rootScope', '$scope', '$stateParams', '$location', '$filter', '$timeout', '$state', '$totvsprofile', 'totvs.app-main-view.Service', 'customization.generic.Factory', 'utb.utils.Service', 'hub.paramfncproduct.Factory', 'hub.paramfncproduct.ModalConfirmActiv.Service', 'hub.paramfncproduct.ModalAdvancedSearch.Service', 'hub.paramfncproduct.ParamFncProductList.Service', 'TOTVSEvent'];
    index.register.controller('hub.paramfncproduct.ListCtrl', ParamFncProdListCtrl);
    function ServiceList($rootScope, utbUtils) {
        var service = {};
        // Função....: parseModelToDisclaimers
        // Descrição.: responsável por transformar o objeto model nos disclaimers
        // Parâmetros: <não há>
        this.parseModelToDisclaimers = function(model) {
            var disclaimers = [], key, uniqueModel, disclaimer, fields;
            for (key in model) {
                uniqueModel = model[key];
                disclaimer = undefined;
                fields = undefined;
                if (uniqueModel !== undefined && uniqueModel !== "" && uniqueModel !== null ) {
                    switch (key) {
                    case 'functionName':
                        disclaimer = utbUtils.parseTypeToDisclaimer('char', key, uniqueModel, 'l-name', 'dts/utb', false, fields);
                        break;
                    case 'app':
                        disclaimer = utbUtils.parseTypeToDisclaimer('char', key, uniqueModel, 'l-app', 'dts/hub', false, fields);
                        break;
                    case 'module':
                        disclaimer = utbUtils.parseTypeToDisclaimer('char', key, uniqueModel, 'l-module', 'dts/hub', false, fields);
                        break;
                    case 'showFunction':
                        var label;
                        if (uniqueModel == 0) {
                            label = $rootScope.i18n('l-all', undefined, 'dts/hub')
                        } else {
                            if (uniqueModel == 1) {
                                label = $rootScope.i18n('l-activated', undefined, 'dts/hub')
                            } else {
                                label = $rootScope.i18n('l-disabled', undefined, 'dts/hub')
                            }
                        }
                        disclaimer = {
                            'property': key,
                            'value': uniqueModel,
                            'title': $rootScope.i18n('l-show-function', undefined, 'dts/hub') + ': ' + label,
                            'fixed': true
                        };
                        break;
                    }
                    if (disclaimer !== undefined) {
                        disclaimers.push(disclaimer);
                    }
                }
            }
            return disclaimers;
        }
        ;
    }
    ServiceList.$inject = ['$rootScope', 'utb.utils.Service'];
    index.register.service('hub.paramfncproduct.ParamFncProductList.Service', ServiceList);
});
