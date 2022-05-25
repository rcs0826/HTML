define(['index',
        'ng-load!ui-file-upload'
       ], function (index) {

    /**
     * Controller List
     */
    productionplanitemListCtrl.$inject = [
        '$rootScope',
        '$scope',
        '$modal',
        '$filter',
        '$stateParams',
        '$location',
        '$window',
        'totvs.app-main-view.Service',
        'fchman.fchmanproductionplan.Factory',
        'fchman.fchmanproductionplanitem.Factory',
        'helperProductionPlanItem', 
        'TOTVSEvent'
    ];

    function productionplanitemListCtrl($rootScope,
                                        $scope,
                                        $modal,
                                        $filter,
                                        $stateParams,
                                        $location,
                                        $window,
                                        appViewService,
                                        fchmanproductionplanFactory,
                                        fchmanproductionplanitemFactory,
                                        helperProductionPlanItem,
                                        TOTVSEvent) {

        /**
         * Variável Controller
         */
        var controller = this;

        /**
         * Variáveis
         */
        this.listProductionPlan = [];  // array que mantem a lista de registros dos planos de produção
        this.listSelectedProductionPlan = []; // usado para armazenar o plano de producacao selecionado na lista de planos
        this.listItem = [];  // array que mantem a lista de registros de itens
        this.totalRecordsItems = 0; // atributo que mantem a contagem de registros da pesquisa dos itens
        this.disclaimers = [];      // array que mantem a lista de filtros aplicados
        this.numRecordsItems = 20;  // quantidade inicial de resultados para a lista de itens
        var quickSearchTextItems = "";   // atributo que contem o valor da pesquisa rápida
        this.advancedSearch = {itemCode: {start: "", // objeto com as informações do filtro avançado
                                          end: "ZZZZZZZZZZZZZZZZ"},
                               siteCode: {start: "",
                                          end: "ZZZZZ"},
                               customerGroup: {start: 0,
                                               end: 9999},
                               isMultiSites: false
        };
        this.productionPlanCode = "";
        this.productionPlanPeriodType;
        this.isMultiSites = false;
        this.hasMoreItems = false;
        this.iniPerDtIni = "";
        this.iniPerDtFin = "";
        this.fimPerDtIni = "";
        this.fimPerDtFin = "";

        
        /**
         * Temp-tables
         */
        this.ttProductionPlanParam = {
            planCodeString: "",
            initialDate: Date.parse('01/01/1900'),
            finalDate: Date.parse("12/31/9999"),
            initialPeriod: "",
            finalPeriod: "",
            isActive: true,
            isInactive: true,
            isProductionPlan: true,
            isPlanSale: true
        };
        
        // *************************************************************************************
        // *** Functions
        // *************************************************************************************

        /* Função....: openAdvancedSearchItem
           Descrição.: Abertura da tela de pesquisa avançada
           Parâmetros:  */
        this.openAdvancedSearchItem = function () {

            var modalInstance = $modal.open({
                templateUrl: '/dts/mpl/html/productionplanitem/productionplanitem.advanced.search.html',
                controller: 'mpl.productionplanitem.SearchCtrl as controller',
                size: 'lg',
                resolve: {
                    model: function () {
                        // passa o objeto com os dados da pesquisa avançada para o modal
                        return controller.advancedSearch;
                    }
                }
            });
            
            // quando o usuario clicar em pesquisar:
            modalInstance.result.then(function () {
                
                // cria os disclaimers
                controller.addDisclaimers();
                // e chama o busca dos dados
                controller.loadDataItems(false, controller.productionPlanCode, true);
            });
        };
        
        /* Função....: openModalAddNeeds
           Descrição.: Abertura da tela de necessidades
           Parâmetros: codigo do item, descricao do item, referencia, codigo do estabelecimento  */
        this.openModalAddNeeds = function (itemCode, itemDescription, reference, siteCode) {
            
            var model = {
                    planCode: controller.productionPlanCode,
                    itemCode: itemCode,
                    itemDescription: itemDescription,
                    reference: reference,
                    siteCode: siteCode,
                    periodType: controller.productionPlanPeriodType,
                    isMultiSites: controller.productionPlanSelectedObject.isMultiSites
            };

            var modalInstance = $modal.open({
                templateUrl: '/dts/mpl/html/productionplanitem/productionplanitem.edit.needs.html',
                controller: 'mpl.productionplanitem.EditNeedsCtrl as controller',
                size: 'lg',
                resolve: {
                    model: function () {
                        // passa o objeto com os dados da pesquisa avançada para o modal
                        return model;
                    }
                }
            });
            
            // quando o usuario clicar em salvar:
            modalInstance.result.then(function () {
                controller.loadDataItems(false, controller.productionPlanCode, true);
            });
        };
        
        /* Função....: openModalImport
           Descrição.: Abertura da tela de importação
           Parâmetros:  */
        this.openModalImport = function () {
            
            var model = {
                    planCode: controller.productionPlanCode,
                    planDescription: controller.productionPlanSelectedObject.planDescription
            };

            var modalInstance = $modal.open({
                templateUrl: '/dts/mpl/html/productionplanitem/productionplanitem.import.html',
                controller: 'mpl.productionplanitem.ImportCtrl as controller',
                size: 'lg',
                resolve: {
                    model: function () {
                        // passa o objeto com os dados da pesquisa avançada para o modal
                        return model;
                    }
                }
            });
            
            // quando o usuario clicar em salvar:
            modalInstance.result.then(function () {                
                controller.loadDataItems(false, controller.productionPlanCode, true);
            });
        };

        /* Função....: addDisclaimers
           Descrição.: Método para adicionar os disclaimers da tela de pesquisa avançada
           Parâmetros:  */
        this.addDisclaimers = function () {
            // reinicia os disclaimers
            controller.disclaimers = [];
            
            // cria os disclaimers para os filtros informados
            for (property in controller.advancedSearch) {
                if (controller.advancedSearch && 
                    (controller.advancedSearch[property].start || controller.advancedSearch[property].end)) {
                    // só adiciona disclaimers se o padrão da busca for alterado
                    if ((property == "itemCode" &&
                        (controller.advancedSearch[property].start != "" ||
                         controller.advancedSearch[property].end != "ZZZZZZZZZZZZZZZZ")) || 
                       (property == "siteCode" &&
                        (controller.advancedSearch[property].start != "" ||
                         controller.advancedSearch[property].end != "ZZZZZ")) || 
                       (property == "customerGroup" &&
                        (controller.advancedSearch[property].start != 0 ||
                         controller.advancedSearch[property].end != 9999))) {
                           
                        var faixa = '', deate = ' ' + $rootScope.i18n('l-from-start'), label = '';
                    
                        if (controller.advancedSearch[property].start) {
                            faixa = controller.advancedSearch[property].start;
                            deate = ' ' + $rootScope.i18n('l-from') + ' ' + controller.advancedSearch[property].start;
                        };

                        if (controller.advancedSearch[property].end) {
                            faixa = faixa + ';' + controller.advancedSearch[property].end;
                            deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + controller.advancedSearch[property].end;
                        } else {
                            faixa = faixa + ';';
                            deate = deate + ' ' + $rootScope.i18n('l-to-end');
                        };

                        if (property == "itemCode") {
                            label = $rootScope.i18n('l-item') + deate;
                        }
                        if (property == "siteCode") {
                            label = $rootScope.i18n('l-site') + deate;
                        }
                        if (property == "customerGroup") {
                            label = $rootScope.i18n('l-customer-group') + deate;
                        }

                        controller.addDisclaimer(property, faixa, label);
                    }
                };
            };
        };

        /* Função....: addDisclaimer
           Descrição.: Adiciona um objeto na lista de disclaimers
           Parâmetros: propriedade (item, estabelecimento, grupo cliente), valor, label */
        this.addDisclaimer = function (property, value, label) {
            controller.disclaimers.push({
                property: property,
                value: value,
                title: label
            });
        };

        /* Função....: removeDisclaimer
           Descrição.: Remove um disclaimer
           Parâmetros: disclaimer */
        this.removeDisclaimer = function (disclaimer) {
            // pesquisa e remove o disclaimer do array
            var index = controller.disclaimers.indexOf(disclaimer);
            if (index != -1) {
                controller.disclaimers.splice(index, 1);
            };
            
            if (disclaimer.property == 'itemCode') {
                controller.advancedSearch.itemCode.start = '';
                controller.advancedSearch.itemCode.end = 'ZZZZZZZZZZZZZZZZ';
            };
            if (disclaimer.property == 'siteCode') {
                controller.advancedSearch.siteCode.start = '';
                controller.advancedSearch.siteCode.end = 'ZZZZZ';
            };
            if (disclaimer.property == 'customerGroup') {
                controller.advancedSearch.customerGroup.start = '0';
                controller.advancedSearch.customerGroup.end = '99';
            };

            // recarrega os dados quando remove um disclaimer
            controller.loadDataItems(false, controller.productionPlanCode, true);
        };
        
        /* Função....: setProductionPlanSelectedObject
           Descrição.: Filtra a lista de planos de producao de a cordo com o valor digitado
           Parâmetros: input (valor digitado) */
        this.setProductionPlanSelectedObject = function () {
            controller.productionPlanSelectedObject = {};
            controller.listProductionPlan.forEach(function(plan) {
                if (plan.planCode == controller.productionPlanCode){
                    controller.productionPlanSelectedObject = plan;
                }
            });
        };
        
        /* Função....: loadDataProductionPlan
           Descrição.: Carrega a lista de planos de producao
           Parâmetros:  */
        this.loadDataProductionPlan = function () {
            controller.listProductionPlan = [];
            controller.listSelectedProductionPlan = [];
            controller.totalRecordsItems = 0;
            controller.productionPlanSelectedObject = {};
            

            fchmanproductionplanFactory.getProductionPlanList(controller.ttProductionPlanParam, function (result) {
                if (result) {
                    // para cada item do result
                    angular.forEach(result, function (value) {
                        
                        // adicionar o item na lista de resultado
                        controller.listProductionPlan.push({planCode: value.planCode,
                                                            planDescription: value.planDescription,
                                                            periodType: value.periodType,
                                                            isMultiSites: value.isMultiSites,
                                                            planType: value.planType,
                                                            initialPeriod: value.initialPeriod,
                                                            initialPeriodYear: value.initialPeriodYear,
                                                            finalPeriod: value.finalPeriod,
                                                            finalPeriodYear: value.finalPeriodYear,
                                                            planStatus: value.planStatus});
                    });
                    
                    controller.listProductionPlan.forEach(function(plan) {
                        controller.listSelectedProductionPlan.push({
                            label: plan.planCode + " - " + plan.planDescription,
                            value: plan.planCode + ""
                        })
                    });
            
                    if ($stateParams && $stateParams.productionPlanCode) {

                        if (controller.productionPlanSelectedObject.periodType == undefined){
                            controller.setProductionPlanSelectedObject();
                        }

                        controller.productionPlanPeriodType = controller.productionPlanSelectedObject.periodType;
                        controller.loadDataItems(false, $stateParams.productionPlanCode, true);
                        controller.loadDates();
                    }
                };
            });
        };
        
        /* Função....: selectProductionPlan
           Descrição.: adiciona o plano de producao selecionado ao filtros e executa a busca
           Parâmetros:  */
        this.selectProductionPlan = function() {
            controller.listItem = [];
            controller.iniPerDtIni = "";
            controller.iniPerDtFin = "";
            controller.fimPerDtIni = "";
            controller.fimPerDtFin = "";
            controller.productionPlanSelectedObject = {};

            setTimeout(function() {
                controller.setProductionPlanSelectedObject();
                
                if (controller.productionPlanCode) {
                    controller.productionPlanPeriodType = controller.productionPlanSelectedObject.periodType;
                    controller.isMultiSites = controller.productionPlanSelectedObject.isMultiSites;
                    controller.advancedSearch.isMultiSites = controller.isMultiSites;
                    controller.loadDataItems(false, controller.productionPlanCode, true);
                    controller.loadDates();
                } 
            }, 0);
        };
        
        /* Função....: traduzLog
           Descrição.: Retorna uma string "Sim" ou "Nao", de acordo com o valor logico.
                       Aparece no cabecalho do multi estabelecimento.
           Parâmetros: inputLog */
        this.traduzLog = function(inputLog) {
            if (inputLog == undefined)
                return "";
            else if (inputLog)
                return $rootScope.i18n('l-yes');
            else
                return $rootScope.i18n('l-no');
        }
        
        /* Função....: formatPeriod
           Descrição.: Formata o periodo para ser usado no cabecalho
           Parâmetros: periodo, ano */
        this.formatPeriod = function (period, year) {
            if (period && year) {
                return $filter('periodFilter')(period + '/' + year) + " - ";
            } else {
                return "";
            }
        }
        
        /* Função....: formatDateRange
           Descrição.: Formata a data para ser usada no cabecalho
           Parâmetros: data inicial, data final */
        this.formatDateRange = function (iniDate, finDate) {
            if (iniDate && finDate) {
                return iniDate + "\u00A0\u00A0" + $rootScope.i18n('l-to') + "\u00A0\u00A0" + finDate;
            } else {
                return "";
            }
        }
        
        /* Função....: loadDates
           Descrição.: Carrega as datas de acordo com o periodo do plano selecionado
           Parâmetros:  */
        this.loadDates = function () {
            var params;
            if (controller.productionPlanCode) {
                if (controller.productionPlanSelectedObject.periodType == undefined){
                    controller.setProductionPlanSelectedObject();
                }
                params = {
                    nrPeriodo : controller.productionPlanSelectedObject.initialPeriod,
                    ano : controller.productionPlanSelectedObject.initialPeriodYear
                }
                fchmanproductionplanitemFactory.getPeriod(controller.productionPlanSelectedObject.periodType, params, function(result) {
                    if (result) {
                        controller.iniPerDtIni = new Date(result[0].dtInicio).toLocaleDateString();
                        controller.iniPerDtFin = new Date(result[0].dtTermino).toLocaleDateString();
                    }
                });
                
                params = {
                    nrPeriodo : controller.productionPlanSelectedObject.finalPeriod,
                    ano : controller.productionPlanSelectedObject.finalPeriodYear
                }
                fchmanproductionplanitemFactory.getPeriod(controller.productionPlanSelectedObject.periodType, params, function(result) {
                    if (result) {
                        controller.fimPerDtIni = new Date(result[0].dtInicio).toLocaleDateString();
                        controller.fimPerDtFin = new Date(result[0].dtTermino).toLocaleDateString();
                    }
                });
            }
        }

        /* Função....: loadDataItems
           Descrição.: Método de leitura dos dados dos itens
           Parâmetros: Mais Resultados, codigo do plano de producao, limpa a lista de itens */
        this.loadDataItems = function(isMore, productionPlanCode, limpaLista) {
            
            // valores default para o inicio e pesquisa
            var parameters;
            
            parameters = {
                itemStringIni         : controller.advancedSearch.itemCode.start || "",
                itemStringFin         : controller.advancedSearch.itemCode.end,
                stockGroupStringIni   : controller.advancedSearch.customerGroup.start || 0,
                stockGroupStringFin   : controller.advancedSearch.customerGroup.end,
                siteStringIni         : controller.advancedSearch.siteCode.start || "",
                siteStringFin         : controller.advancedSearch.siteCode.end,
                startAt               : 1,
                limitAt               : controller.numRecordsItems,
                itemCode              : "",
                siteCode              : "",
                isMore                : isMore,
                advancedSearch          : limpaLista,
                itemStringQuickSearch : controller.quickSearchTextItems || ""
            };
            
            if (isMore) {
                parameters.itemCode = controller.listItem[controller.listItem.length - 1].itemCode;
                parameters.siteCode = controller.listItem[controller.listItem.length - 1].siteCode;
            };
            
            if (controller.advancedSearch.siteCode) {
                parameters.siteStringIni = controller.advancedSearch.siteCode.start || "";
                parameters.siteStringFin = controller.advancedSearch.siteCode.end;
            };
            
            if (controller.advancedSearch.customerGroup) {
                parameters.stockGroupStringIni = controller.advancedSearch.customerGroup.start || 0;
                parameters.stockGroupStringFin = controller.advancedSearch.customerGroup.end;
            };
            
            if (controller.advancedSearch.itemCode) {
                parameters.itemStringIni = controller.advancedSearch.itemCode.start || "";
                parameters.itemStringFin = controller.advancedSearch.itemCode.end;
            };
            
            fchmanproductionplanitemFactory.getProductionPlanItemsBatch(productionPlanCode, parameters, function(result) {
                
                if (limpaLista) {
                    controller.listItem = [];
                }

                if (!isMore) {
                    controller.totalRecordsItems = result.pTotal;
                }

                // para cada item do result
                if (result.ttProductionPlanItemVO) {
                    angular.forEach(result.ttProductionPlanItemVO, function (value) {
                        // adicionar o item na lista de resultado
                        controller.listItem.push({siteCode: value.siteCode,
                                                  itemCode: value.itemCode,
                                                  reference: value.reference,
                                                  itemDescription: value.itemDescription,
                                                  unitOfMeasure: value.unitOfMeasure,
                                                  quantity: value.confirmQuantity,
                                                  hasMore: value.hasMore});
                        if (result.hasMore) {
                            controller.hasMoreItems = result.hasMore;
                        };
                    });
                }
            });
        };

        /* Função....: deleteItem
           Descrição.: Evento de click no botao excluir.
                       Remove registro da base de dados
           Parâmetros: item */
        this.deleteItem = function(item) {
            // envia um evento para perguntar ao usuário
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question', // titulo da mensagem
                text: $rootScope.i18n('msg-confirm-delete-needs'), // texto da mensagem
                cancelLabel: 'l-no', // label do botão cancelar
                confirmLabel: 'l-yes', // label do botão confirmar                
                callback: function(isPositiveResult) { // função de retorno
                    if (isPositiveResult) { // se foi clicado o botão confirmar
                            
                        var parameters = {
                            productionPlanCode: controller.productionPlanCode,
                            itemCode: item.itemCode,
                            reference: item.reference,
                            siteCode: item.siteCode
                        };

                        // chama o metodo de remover registro do service
                        fchmanproductionplanitemFactory.removeProductionPlanItem(parameters, function(result) {
                            if (!result['$hasError']) {
                                // remove o item da lista
                                var index = controller.listItem.indexOf(item);

                                if (index != -1) {
                                    controller.listItem.splice(index, 1);

                                    controller.totalRecordsItems--;

                                    // notifica o usuario que o registro foi removido
                                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                        type: 'success', // tipo de notificação
                                        title: $rootScope.i18n('msg-needs-deleted'),
                                        detail: $rootScope.i18n('msg-needs-removed')
                                    });
                                }
                            }
                        });
                    }
                }
            });
        };
        
        /* Função....: setParamAdd
           Descrição.: Evento de click no botao Adicionar. 
                       Redireciona para a tela de adicionar item.
           Parâmetros:  */
        this.setParamAdd = function() {
            if (controller.productionPlanSelectedObject) {
                helperProductionPlanItem.data = {
                    productionPlanCode: controller.productionPlanCode,
                    productionPlanPeriodType: controller.productionPlanPeriodType,
                    isMultiSites: controller.productionPlanSelectedObject.isMultiSites,
                    planType: controller.productionPlanSelectedObject.planType,
                    initialPeriod: controller.productionPlanSelectedObject.initialPeriod,
                    finalPeriod: controller.productionPlanSelectedObject.finalPeriod,
                    initialPeriodYear: controller.productionPlanSelectedObject.initialPeriodYear,
                    finalPeriodYear: controller.productionPlanSelectedObject.finalPeriodYear,
                    planDescription: controller.productionPlanSelectedObject.planDescription,
                    planStatus: controller.productionPlanSelectedObject.planStatus
                };

                $location.path('dts/mpl/productionplanitem/new/');
            }
        };

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        /* Função....: init
           Descrição.: quando o controller for iniciado
           Parâmetros:  */
        this.init = function () {
            
            if (appViewService.startView(
                $rootScope.i18n('l-production-plan-item'), 
                'mpl.productionplanitem.ListCtrl',
                controller
            )) {}

            if ($stateParams && $stateParams.productionPlanCode) {
                controller.productionPlanCode = $stateParams.productionPlanCode;
            }

            controller.loadDataProductionPlan();
            
            if (helperProductionPlanItem && helperProductionPlanItem.data && helperProductionPlanItem.data.productionPlanCode) {
                
                controller.productionPlanSelectedObject = {
                    planCode: helperProductionPlanItem.data.productionPlanCode,
                    periodType: helperProductionPlanItem.data.productionPlanPeriodType,
                    isMultiSites: helperProductionPlanItem.data.isMultiSites,
                    planType: helperProductionPlanItem.data.planType,
                    initialPeriod: helperProductionPlanItem.data.initialPeriod,
                    finalPeriod: helperProductionPlanItem.data.finalPeriod,
                    initialPeriodYear: helperProductionPlanItem.data.initialPeriodYear,
                    finalPeriodYear: helperProductionPlanItem.data.finalPeriodYear,
                    planDescription: helperProductionPlanItem.data.planDescription,
                    planStatus: helperProductionPlanItem.data.planStatus
                };
                
                controller.loadDataItems(false, helperProductionPlanItem.data.productionPlanCode, true);
                controller.loadDates();
            }
        };

        if ($rootScope.currentuserLoaded) { 
            this.init(); 
        }

        // *********************************************************************************
        // *** Events Listeners
        // *********************************************************************************

        $scope.$on('$destroy', function () {
            controller = undefined;
        });

        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        });
    };

    // *********************************************************************************
    // *** Controller Pesquisa Avançada
    // *********************************************************************************

    productionplanItemSearchCtrl.$inject = ['$modalInstance', 'model'];

    function productionplanItemSearchCtrl ($modalInstance, 
                                           model) {

        // recebe os dados de pesquisa atuais e coloca no controller
        this.advancedSearch = model;
        this.isOpen = true;

        // ação de pesquisar
        this.search = function () {
            // close é o fechamento positivo
            $modalInstance.close();
        };

        // ação de fechar
        this.close = function () {
            // dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
            $modalInstance.dismiss();
        };
    };

    index.register.controller('mpl.productionplanitem.ListCtrl', productionplanitemListCtrl);
    index.register.controller('mpl.productionplanitem.SearchCtrl', productionplanItemSearchCtrl);
    
    index.register.service('helperProductionPlanItem', function() {
        return {
            data: {}
        };
    });

});