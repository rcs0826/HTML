define(['index'], function(index) {
    
    changedsalesorderCtrl.$inject = [
        '$filter',
        'i18nFilter',
        '$modal',
        'totvs.app-main-view.Service',
        'fchman.fchmanproductionplan.Factory',
        'fchman.fchmanproductionplanitem.Factory',
        'fchmpl.fchmpl0001.Factory'
    ];
    
    function changedsalesorderCtrl($filter,
                                   i18n,
                                   $modal,
                                   appViewService,
                                   fchmanproductionplanFactory,
                                   fchmanproductionplanitemFactory,
                                   fchmpl0001Factory) {
        
        var controller = this;
        
        controller.listSelectedProductionPlan = [];
        controller.listProductionPlan = [];
        controller.productionPlanCode = "";
        controller.gridData = [];
        controller.gridDataOriginal = [];

        var initDate = new Date();
        initDate.setMonth(initDate.getMonth() - 1);

        var finalDate = new Date();
        finalDate.setMonth(finalDate.getMonth() + 1);

        controller.advancedSearch = {
            itemString: "",
            familyString: "",
            stockGroupString: "",
            plannerString: "",
            customerRequestString: "",
            requestNumberString: "",
            printDate: {
                startDate: initDate,
                endDate: finalDate
            },
            deliveryDate: {
                startDate: initDate,
                endDate: finalDate
            },
            needDate: {
                startDate: initDate,
                endDate: finalDate
            },
            siteCode: "",
            isChangedQuantityUp: true,
            isChangedQuantityDown: true
        };

        /* INÍCIO DAS FUNÇÕES DO CABEÇALHO DE PLANO */
        
        controller.ttProductionPlanParam = {
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

        
        /* Função....: setProductionPlanSelectedObject
           Descrição.: Filtra a lista de planos de producao de a cordo com o valor digitado
           Parâmetros: input (valor digitado) */
        controller.setProductionPlanSelectedObject = function () {
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
        controller.loadDataProductionPlan = function () {
            controller.listProductionPlan = [];
            controller.listSelectedProductionPlan = [];
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
                        });
                    });
                }
            });
        };
        
        /* Função....: selectProductionPlan
           Descrição.: adiciona o plano de producao selecionado ao filtros e executa a busca
           Parâmetros:  */
        controller.selectProductionPlan = function() {
            controller.listItem = [];
            controller.iniPerDtIni = "";
            controller.iniPerDtFin = "";
            controller.fimPerDtIni = "";
            controller.fimPerDtFin = "";
            controller.productionPlanSelectedObject = {};
            controller.gridData = [];
            controller.gridDataOriginal = [];

            setTimeout(function() {
                controller.setProductionPlanSelectedObject();
                
                if (controller.productionPlanCode) {
                    controller.productionPlanPeriodType = controller.productionPlanSelectedObject.periodType;
                    controller.isMultiSites = controller.productionPlanSelectedObject.isMultiSites;
                    controller.loadDates();
                }

                controller.changedSalesOrders();
            }, 0);
        };
        
        /* Função....: traduzLog
           Descrição.: Retorna uma string "Sim" ou "Nao", de acordo com o valor logico.
                       Aparece no cabecalho do multi estabelecimento.
           Parâmetros: inputLog */
        controller.traduzLog = function(inputLog) {
            if (inputLog == undefined)
                return "";
            else if (inputLog)
                return i18n('l-yes', [], 'dts/mpl');
            else
                return i18n('l-no', [], 'dts/mpl');
        };
        
        /* Função....: formatPeriod
           Descrição.: Formata o periodo para ser usado no cabecalho
           Parâmetros: periodo, ano */
        controller.formatPeriod = function (period, year) {
            if (period && year) {
                return $filter('periodFilter')(period + '/' + year) + " - ";
            } else {
                return "";
            }
        };
        
        /* Função....: formatDateRange
           Descrição.: Formata a data para ser usada no cabecalho
           Parâmetros: data inicial, data final */
        controller.formatDateRange = function (iniDate, finDate) {
            if (iniDate && finDate) {
                return iniDate + "\u00A0\u00A0" + i18n('l-to', [], 'dts/mpl') + "\u00A0\u00A0" + finDate;
            } else {
                return "";
            }
        };

        /* Função....: loadDates
           Descrição.: Carrega as datas de acordo com o periodo do plano selecionado
           Parâmetros:  */
        controller.loadDates = function () {
            var params;
            if (controller.productionPlanCode) {
                if (controller.productionPlanSelectedObject.periodType == undefined){
                    controller.setProductionPlanSelectedObject();
                }
                params = {
                    nrPeriodo : controller.productionPlanSelectedObject.initialPeriod,
                    ano : controller.productionPlanSelectedObject.initialPeriodYear
                };

                fchmanproductionplanitemFactory.getPeriod(controller.productionPlanSelectedObject.periodType, params, function(result) {
                    if (result) {
                        controller.iniPerDtIni = new Date(result[0].dtInicio).toLocaleDateString();
                        controller.iniPerDtFin = new Date(result[0].dtTermino).toLocaleDateString();
                    }
                });
                
                params = {
                    nrPeriodo : controller.productionPlanSelectedObject.finalPeriod,
                    ano : controller.productionPlanSelectedObject.finalPeriodYear
                };

                fchmanproductionplanitemFactory.getPeriod(controller.productionPlanSelectedObject.periodType, params, function(result) {
                    if (result) {
                        controller.fimPerDtIni = new Date(result[0].dtInicio).toLocaleDateString();
                        controller.fimPerDtFin = new Date(result[0].dtTermino).toLocaleDateString();
                    }
                });
            }
        };
        /* FIM DAS FUNÇÕES DO CABEÇALHO DE PLANO */

        controller.quickSearch = function() {
            
            if (!controller.quickSearchModel) {
                controller.quickSearchModel = "";
            }

            controller.gridData = controller.gridDataOriginal.filter(function (gridRow) {
                var itemCode = gridRow.itemCode.toLowerCase();
                var quickSearchModel = controller.quickSearchModel.toLowerCase();

                return itemCode.lastIndexOf(quickSearchModel, 0) === 0;
            });
        };

        controller.changedSalesOrders = function() {

            if (!controller.productionPlanSelectedObject.planCode) return;

            var parameters = {
                planCode: controller.productionPlanSelectedObject.planCode,
                initialDate: controller.advancedSearch.printDate.startDate,
                finalDate: controller.advancedSearch.printDate.endDate,
                initialDeliveryDate: controller.advancedSearch.deliveryDate.startDate,
                finalDeliveryDate: controller.advancedSearch.deliveryDate.endDate,
                isChangedQuantityUp: controller.advancedSearch.isChangedQuantityUp,
                isChangedQuantityDown: controller.advancedSearch.isChangedQuantityDown,
                plannerString: controller.advancedSearch.plannerString,
                itemString: controller.advancedSearch.itemString,
                familyString: controller.advancedSearch.familyString,
                stockGroupString: controller.advancedSearch.stockGroupString,
                /* siteCode: controller.advancedSearch.siteCode, */
                initialNeedDate: controller.advancedSearch.needDate.startDate,
                finalNeedDate: controller.advancedSearch.needDate.endDate,
                customerRequestString: controller.advancedSearch.customerRequestString,
                requestNumberString: controller.advancedSearch.requestNumberString
            };
            
            fchmpl0001Factory.changedSalesOrders(parameters, function(result) {
                if (result){
                    controller.gridData = result;
                    controller.gridDataOriginal = JSON.parse(JSON.stringify(controller.gridData));

                    controller.quickSearch();
                }
            });
        };

        controller.openAdvancedSearch = function() {
            var modalInstance = $modal.open({
                templateUrl: '/dts/mpl/html/changedsalesorder/changedsalesorder-advancedsearch.html',
                controller: 'mpl.changedsalesorder.advancedsearch.controller as controller',
                size: 'md',
                resolve: {
                    model: function () {
                        return controller.advancedSearch;
                    }
                }
            });
            
            modalInstance.result.then(function (model) {
                
                controller.advancedSearch = model;
                
                controller.changedSalesOrders();
            });
        };

        controller.exportCsv = function() {
            if (controller.gridData.length == 0) return;
            
            setTimeout(function() {

                //Busca os itens do plano selecionado
                fchmpl0001Factory.listItemsCsv(controller.gridData, function(result){

                    if (result && result.csv != "") {
                        var ie = navigator.userAgent.match(/MSIE\s([\d.]+)/),
                            ie11 = navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/rv:11/),
                            ieEDGE = navigator.userAgent.match(/Edge/g),
                            ieVer=(ie ? ie[1] : (ie11 ? 11 : (ieEDGE ? 12 : -1)));

                        if (ie && ieVer<10) {
                            console.log("No blobs on IE ver<10");
                            return;
                        }
            
                        var textFileAsBlob = new Blob([result.csv], {type: 'text/plain'});
                        var fileName = i18n('l-changed-sales-orders', [], 'dts/mpl') + " - " + i18n('l-plan', [], 'dts/mpl') + " - " + controller.productionPlanCode + '.csv';

                        if (ieVer>-1) {
                            window.navigator.msSaveBlob(textFileAsBlob, fileName);
                        } else {
                            var a         = document.createElement('a');
                            a.href        = 'data:attachment/csv,' +  encodeURIComponent(result.csv);
                            a.target      = '_blank';
                            a.download    = fileName;

                            document.body.appendChild(a);
                            a.click();
                        }
                    }
                });
            },100);
        };

        controller.init = function() {
            
            createTab = appViewService.startView(i18n('l-changed-sales-orders', [], 'dts/mpl'), 'mpl.changedsalesorder-list.controller', controller);
            
            if (createTab) {
                controller.loadDataProductionPlan();
            }
        };
        
        controller.init();
    }
    
    index.register.controller('mpl.changedsalesorder-list.controller', changedsalesorderCtrl);
});