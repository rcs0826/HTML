define(['index'], function(index) {
	
	/**
	 * Controller List
	 */
    itemcalculationstatementdetail.$inject = ['$rootScope', 
                                              '$scope',
                                              'totvs.app-main-view.Service',
                                              'fchmdb.fchmdb0001.Factory',
                                              '$filter',
                                              'i18nFilter',
                                              '$modal',
                                              '$location',
                                              '$stateParams'];


    function itemcalculationstatementdetail($rootScope, 
                                            $scope,
                                            appViewService, 
                                            fchmdb0001Factory,
                                            $filter,
                                            i18n,
                                            $modal,
                                            $location,
                                            $stateParams) {

        var controller = this;

        controller.item = [];

        controller.movtos = [];
        controller.treeColumns = [];
        controller.dado = {};

        controller.chartwidth = "100%";

        controller.tabs = [
            {title: i18n('l-planning', [], 'dts/mdb'), active: true, id: 1, tooltip: i18n('l-quantity-by-period-and-type', [], 'dts/mdb')}, 
            {title: i18n('l-fluctuation', [], 'dts/mdb'), active: false, id: 2, tooltip: i18n('l-inventory-fluctuation', [], 'dts/mdb')}
        ];

        controller.paramModel = {selectedPeriod: 1};

        controller.colAttributes = {
            class: "table-cell",
            style: "text-align: right; font-size: 14px; width: 155px;"
        };

        controller.colHeaderAttributes = {
            style: "text-align: center; width: 155px;"
        };
        
        controller.createTypes = function() {
            controller.lineTypes = [{
                label : i18n('l-hard-order', [], 'dts/mdb'), //"Ordens Firme",
                field : "de-qt-ordem-firme",
                iTipoOrig: 1
            }, {
                label : i18n('l-planned-order', [], 'dts/mdb'), //"Ordens Planejadas"
                field : "de-qt-ordem-planej", //de-qt-ordem-planej
                iTipoOrig: 2
            } , {
                label : i18n('l-reservation-firm', [], 'dts/mdb'), //"Reservas Firme"
                field : "de-qt-res-firme", //de-qt-res-firme
                iTipoOrig: 3
            }, {
                label : i18n('l-planned-reserves', [], 'dts/mdb'), //"Reservas Planejadas"
                field : "de-qt-res-planej", //de-qt-res-planej
                iTipoOrig: 4
            }, {
                label : i18n('l-orders', [], 'dts/mdb'), //"Pedidos"
                field : "de-qt-ped-venda", //de-qt-ped-venda
                iTipoOrig: 7
            }, {
                label : i18n('l-scenario-forecast', [], 'dts/mdb'), //"Previsão do Cenário"
                field : "de-qt-prev-cenar", //de-qt-prev-cenar
                iTipoOrig: 5
            }, {
                label : i18n('l-scenario-order', [], 'dts/mdb'), //"Pedidos do Cenário"
                field : "de-qt-ped-cenar", //de-qt-ped-cenar
                iTipoOrig: 6
            }];
            
            // caso multi estab mostra as duas linhas a seguir 
            if (controller.item['log-multi-estab']) {
                //tamanho do grid maior quando multi estab - Respeitando apenas quando a tela reduzida
                controller.height = "330";
                controller.lineTypes.push({
                    label : i18n('l-production-request', [], 'dts/mdb'), //"Solic. Prod."
                    field : "de-qt-solic-prod", //de-qt-solic-prod
                    iTipoOrig: 8
                });            
                controller.lineTypes.push( {
                    label : i18n('l-receiving-schedule', [], 'dts/mdb'), //"Programação Rec."
                    field : "de-qt-prog-receb", //de-qt-prog-receb
                    iTipoOrig: 9
                });
            } else {
                //tamanho grid - Respeitando apenas quando a tela reduzida
                controller.height = "260";
            }
    
            controller.lineTypes.push({
                label : i18n('l-available', [], 'dts/mdb'), //"Disponível"
                field : "de-qt-dispon" //de-qt-dispon 
            });
        }

        controller.init = function() {
            appViewService.startView($rootScope.i18n('l-item-calculation-statement'), 
                                    'mdb.itemcalculationstatement-detail.controller', controller);

            controller.item = {};
            controller.activeTab = controller.tabs[0];
            controller.getDetails();
        }
        
        controller.createTree = function(treeRows, treeColumns) {

            var dataSource = new kendo.data.TreeListDataSource({
                transport: {
                    read: function(options) {
                        if (!options.data.id) {
                            options.success(treeRows);
                        }
                    }
                }
            });

            controller.mostraPlanilha = true;
                       
            controller.treelistOptions = {
                dataSource: dataSource,
                height: 440,
                selectable: true,
                resizable: true,
                reorderable: false,
                sortable: false,
                columns: treeColumns,
                columnMenu: true
            };
        }

        controller.tabClick = function(selectedTab) {
            controller.tabs.forEach(function(tab) {
                tab.active = false;
            });

            selectedTab.active = true;
            controller.activeTab = selectedTab;
            controller.updateChart(controller.periodosGrafico, controller.saldoDisponivelGrafico, controller.estoqueSegurancaGrafico);
        }

        controller.getDetails = function() {
            var params = {
                cCodigoItem: decodeURIComponent($stateParams.item),
                cCodigoRefer: decodeURIComponent($stateParams.refer),
                cCodigoCenario: decodeURIComponent($stateParams.scenario),
                cSimulation: $stateParams.simulation,
                logPerda: $stateParams.logPerda,
                iTipoPeriodo: controller.paramModel.selectedPeriod
            };
            
            controller.movtos = [];
            controller.treeLines = [];
            controller.treeColumns = [];
            
            //variaveis para o grafico de linhas
            controller.periodosGrafico = [];
            controller.saldoDisponivelGrafico = [];
            controller.estoqueSegurancaGrafico = [];
            
            //Configuração inicial e ao alternar entre as abas Planilha e Gráfico
            controller.mostraPlanilha = false;
            //controller.activeTab = controller.tabs[0];
            
            fchmdb0001Factory.calculatedItemsDetail(params, function(result) {
                if (result && result['tt-lista-item']) {

                    controller.item = result['tt-lista-item'][0];

                    controller.periodDetail = result['tt-estoq-periodo'];

                    controller.createTypes();

                    controller.movtos = controller.item["tt-estoq"] || [];
                    
                    for (var i = 0; i < controller.movtos.length; i++) {
                        const movto = controller.movtos[i];

                        if (i == 0) {
                            var headerTitle = {
                                field: "tipo",
                                title: " ",
                                locked: true,
                                lockable: false,
                                width: 250,
                                attributes: {
                                    class: "table-cell",
                                    style: "font-size: 14px;"
                                }
                            };

                            controller.treeColumns.push(headerTitle);
                        }
                        
                        var headerTitle = {
                            field: "data" + Math.abs(movto['dt-termino']),
                            title: movto['periodo'],
                            lockable: false,
                            headerAttributes: controller.colHeaderAttributes,
                            attributes: controller.colAttributes,
                            format: "{0:n4}"
                        };

                        controller.treeColumns.push(headerTitle);

                        controller.periodosGrafico.push(movto['periodo']);
                        controller.saldoDisponivelGrafico.push(movto['de-qt-dispon']);
                        controller.estoqueSegurancaGrafico.push(controller.item['quant-segur']);

                        for (var index = 0; index < controller.lineTypes.length; index++) {
                            
                            const lineType = controller.lineTypes[index];
                            const typeField = lineType.field;
                            
                            if (i == 0) {
                                if (movto[typeField] == 0) {
                                    movto[typeField] = "";
                                }

                                var line = {
                                    tipo: lineType.label,
                                    id: lineType.iTipoOrig,
                                    parentId: null
                                }

                                line[headerTitle.field] = movto[typeField];

                                controller.treeLines.push(line);
                            } else {
                                if (movto[typeField] == 0 && typeField != "de-qt-dispon") {
                                    controller.treeLines[index][headerTitle.field] = "";
                                } else {
                                    controller.treeLines[index][headerTitle.field] = movto[typeField];
                                }
                            }
                        }
                    }

                    // carregar o grafico 
                    controller.updateChart(controller.periodosGrafico, controller.saldoDisponivelGrafico, controller.estoqueSegurancaGrafico);

                    // Cria linha de detalhe das ordens
                    for (let i = 0; i < controller.movtos.length; i++) {
                        const movto = controller.movtos[i];
                        
                        for (let index = 0; index < controller.lineTypes.length; index++) {
                            
                            const lineType = controller.lineTypes[index];
                            const typeField = lineType.field;

                            for (let j = 0; j < controller.periodDetail.length; j++) {
                                const periodDetailOrder = controller.periodDetail[j];
                                
                                if (periodDetailOrder.parentId == lineType.iTipoOrig && periodDetailOrder.periodo == movto.periodo) {
                                    if (movto[typeField] == 0) {
                                        movto[typeField] = "";
                                    }
                                    
                                    var line = {
                                        tipo: periodDetailOrder.cComplemento,
                                        id: parseInt('' + periodDetailOrder.parentId + j),
                                        parentId: periodDetailOrder.parentId
                                    }
    
                                    line["data" + Math.abs(movto['dt-termino'])] = periodDetailOrder.deQtde;
    
                                    controller.treeLines.push(line);
                                }
                            }
                        }
                    }
                    
                    controller.createTree(controller.treeLines, controller.treeColumns);
                }
            });
        }

        controller.openParameters = function() {
            var modalInstance = $modal.open({
                templateUrl: '/dts/mdb/html/itemcalculationstatement/itemcalculationstatement.parameters.html',
                controller: 'mdb.itemcalculationstatement.parameters.controller as controller',
                size: 'md',
                resolve: {
                    model: function () {
                        // passa o objeto com os dados da pesquisa avancada para o modal
                        return controller.paramModel;
                    }
                }
            });
            
            // quando o usuario clicar em salvar:
            modalInstance.result.then(function (paramModel) {
                controller.paramModel = paramModel;
                controller.getDetails();
            });
        }

        //grafico de linhas - Saldo disponivel
        controller.updateChart = function(periodosGrafico,saldoDisponivelGrafico, estoqueSegurancaGrafico) {
            controller.typeChart = "line";
            controller.categories = periodosGrafico;

            controller.series = [
                {name: i18n('l-safety-storage', [], 'dts/mdb') , 
                 markers: {visible: false}, 
                 labels: { visible: false, format: "n2" }, 
                 color: 'red', 
                 type: "line",
                 tooltip: {
                    visible: true,
                    format: "n2"
                 },
                 data: estoqueSegurancaGrafico
                 },
                {name: i18n('l-available-balance', [], 'dts/mdb'), 
                 markers: {visible: true},
                 labels: {visible: true, format: "n2", position: "top"},
                 color: '#1E90FF',
                 type: "line",
                 tooltip: {
                    visible: true,
                    format: "n2"
                 },
                 data: saldoDisponivelGrafico}
            ];
            
            setTimeout(function() {

                if (controller.categories.length * 100 > $(window).width()) {
                    controller.chartwidth = (controller.categories.length * 100) + "px";   
                }else{
                    controller.chartwidth = $(".tabset").width();
                }
                
                $("#chart").kendoChart({
                    series: controller.series,
                    valueAxis: {
                        axisCrossingValue: [-500000000,0],
                        labels: {
                            format: "n0"
                        }
                    },
                    categoryAxis: {
                        categories: controller.categories
                    },
                    tooltip: {
                        visible: true
                    },
                    legend: {
                        visible: true,
                        position: "bottom",
                        align: "start"
                    }
                });
            }, 0);
        }

        // se o contexto da aplicação já carregou, inicializa a tela.
        controller.init();
    }

    index.register.controller('mdb.itemcalculationstatement.detail.controller', itemcalculationstatementdetail);


});
