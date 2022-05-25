/* global angular*/
define([
    'index',
    '/dts/mpd/js/zoom/idioma.js',
    '/dts/mpd/js/zoom/emitente.js',
    '/dts/mpd/js/zoom/pais.js',
    '/dts/mpd/js/zoom/inco-cx.js',
    '/dts/mpd/js/zoom/decl-padrao.js',
    '/dts/mpd/js/zoom/itinerario.js',
    '/dts/mpd/js/zoom/pto-contr.js',
    '/dts/mpd/js/zoom/pto-itiner.js',
    '/dts/mpd/js/zoom/cont-emit.js',
    '/dts/mpd/js/dbo/bocx115na.js',
], function(index) {
    'use strict';
    /*jshint validthis: true*/

    exportInfoController.$inject = [
        '$scope',
        '$rootScope',
        '$stateParams',
        '$timeout',
        'salesorder.pd4000ExportExpenseModal.Service',
        'mpd.bocx115na.Factory',
        'mpd.fchdis0051.Factory',
        'customization.generic.Factory',
        'TOTVSEvent',
        'dts-utils.message.Service'
    ];
    function exportInfoController(
        $scope,
        $rootScope,
        $stateParams,
        $timeout,
        exportExpenseModal,
        bocx115na,
        fchdis0051,
        customService,
        TOTVSEvent,
        messageUtils) {
        var controller = this;

        controller.orderId = $stateParams.orderId;
        controller.order = {};
        controller.model = {};
        controller.gridExpenses = [];

        // Opções do select via transporte
        controller.viaTransporteOptions = [
            {key: 1, value: $rootScope.i18n('Rodoviário', [], 'dts/mpd')},
            {key: 2, value: $rootScope.i18n('Aeroviário', [], 'dts/mpd')},
            {key: 3, value: $rootScope.i18n('Marítimo', [], 'dts/mpd')},
            {key: 4, value: $rootScope.i18n('Ferroviário', [], 'dts/mpd')},
            {key: 5, value: $rootScope.i18n('Rodoferroviário', [], 'dts/mpd')},
            {key: 6, value: $rootScope.i18n('Rodofluvial', [], 'dts/mpd')},
            {key: 7, value: $rootScope.i18n('Rodoaeroviário', [], 'dts/mpd')},
            {key: 8, value: $rootScope.i18n('Outros', [], 'dts/mpd')}
        ];

        // Opções do select tp frete export
        controller.tpFreteExportOptions = [
            {key: 1, value: $rootScope.i18n('Collect', [], 'dts/mpd')},
            {key: 2, value: $rootScope.i18n('Prepaid', [], 'dts/mpd')}
        ];

        controller.ptoItinerSelectInit = {
            properties: ['cod-itiner'],
            values: [0]
        };
        controller.ptoItinerZoomInit = {};

        // Informações default (Utilizado para restaurar valores qdo. clicado em "Descartar alterações")
        controller.master = {};

        controller.setModel = function setModel(order, orderParameters, orderExport, orderExportExpense) {
            controller.order = order;
            controller.orderParameters = orderParameters;
            controller.model = orderExport;
            controller.gridExpenses = orderExportExpense;

            // Cópia "backup" para restaurar valores antigos
            controller.master.model = angular.copy(orderExport);
            controller.master.gridExpenses = angular.copy(orderExportExpense);

            controller.orderDisabled = $scope.orderController.orderDisabled;
            if ($scope.orderController.pd4000['aba-exportacao'].fieldEnabled === false) {
                controller.orderDisabled = true;
            }

            if (controller.model)
                setSelectInit();
        };

        controller.save = function save() {
            fchdis0051.saveExportOrder({}, {
                nrPedido: controller.model['nr-pedido'],
                ttOrderParameters: controller.orderParameters,
                ttOrderExportInfo: controller.model,
                ttOrderExportExpenseInfo: controller.gridExpenses
            }, function(result) {
                customService.callCustomEvent("saveExportOrder", {
                    controller:controller,
                    result: result 
                });

                if(result && !result.$hasError) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        title: $rootScope.i18n('Sucesso', [], 'dts/mpd'),
                        detail: $rootScope.i18n('Pedido de Exportação Criado', [], 'dts/mpd'),
                        type: 'success'
                    });
                }
            });
        };

        controller.discardChanges = function discardChanges() {
            controller.master.gridExpenses = controller.master.gridExpenses || [];
            controller.master.model = controller.master.model || {};

            controller.model = angular.copy(controller.master.model);
            controller.gridExpenses = angular.copy(controller.master.gridExpenses);
        };

        controller.onChangeItinerary = function onChangeItinerary() {
            setSelectInit();
            bocx115na.getRecord(controller.model['cod-itiner'], function(result) {
                if(result) {
                    controller.model['pto-despacho'] = result['pto-despacho'];
                    controller.model['pto-embarque'] = result['pto-embarque'];
                    controller.model['pto-desembarque'] = result['pto-desembarque'];
                    controller.model['pto-chegada'] = result['pto-chegada'];
                }

                // Exibe a mensagem após o término da requisição
                if(controller.gridExpenses.length > 0) {
                    $rootScope.$broadcast(TOTVSEvent.showMessage, {
                        title: 'Atenção',
                        text: $rootScope.i18n('O pedido de venda já possui despesas informadas com base no itinerário anterior. Verifique se há necessidade de alterar as despesas já cadastradas devido ao novo itinerário informado para o pedido.', [], 'dts/mpd'),
                        type: 'info',
                        callback: function() {
                            controller.gridExpenses.forEach(function(expense) {
                                expense['cod-itiner'] = controller.model['cod-itiner'];
                            });
                        }
                    });
                }
            });
        };

        function setSelectInit() {
            controller.ptoItinerSelectInit = {
                gotomethod: 'gotokeyitinerpto',
                codItiner: controller.model['cod-itiner'],
                properties: ['cod-itiner'],
                values: [controller.model['cod-itiner']]
            };

            controller.ptoItinerZoomInit = {
                properties: ['cod-itiner'],
                values: [controller.model['cod-itiner']]
            };
        }

        controller.getDefaultExpenses = function getDefaultExpenses() {
            fchdis0051.getDefaultExportExpenses({ nrPedido: controller.orderId,
                                            codItiner: controller.model['cod-itiner'],
                                            codIncoterm: controller.model['cod-incoterm'] }, function(result) {
                customService.callCustomEvent("getDefaultExportExpenses", {
                    controller:controller,
                    result: result 
                });
                                                
                controller.gridExpenses = result.ttOrderExportExpenseInfo;
            });
        };

        controller.removeExpense = function removeExpense() {
            messageUtils.question( {
                title: 'Pergunta',
                text: $rootScope.i18n(controller.gridExpensesSelectedItems.length > 1 ? 'Confirma eliminação dos itens selecionados?' : 'Confirma eliminação do item selecionado?', [], 'dts/mpd'),
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                defaultCancel: true,
                callback: function(isPositiveResult) {
                    if (isPositiveResult) { // se foi clicado o botão confirmar
                        controller.gridExpensesSelectedItems.forEach(function(expense) {
                            controller.gridExpenses.forEach(function(gridExpense) {
                                if(expense.sequencia === gridExpense.sequencia) {
                                    controller.gridExpenses.splice(controller.gridExpenses.indexOf(gridExpense), 1);
                                    return false;
                                }
                            });
                        });
                    }
                }
            });
        };

        controller.addExpense = function addExpense() {
            exportExpenseModal.open({
                isEdit: false,
                expenses: controller.gridExpenses,
                exportOrder: controller.model
            }, function(modalInstance) {
                modalInstance.result.then(function (data) {
                    controller.gridExpenses.push(data);
    			});
            });
        };

        controller.editExpense = function editExpense() {
            exportExpenseModal.open({
                isEdit: true,
                expenses: controller.gridExpenses,
                exportOrder: controller.model,
                expense: controller.gridExpensesSelectedItem,
            }, function(modalInstance) {
                modalInstance.result.then(function (data) {
                    controller.gridExpenses.forEach(function(gridExpense) {
                        if(data.sequencia === gridExpense.sequencia) {
                            var index = controller.gridExpenses.indexOf(gridExpense);
                            if(index >= 0) {
                                controller.gridExpenses[index] = data;
                            }
                            return false;
                        }
                    });
    			});
            });
        };

		$scope.$on("salesorder.pd4000.selectview", function (event,data) {
			if (data == 'pd4000f') {
				$timeout(function() {
					angular.element('input[name="exportinfocontroller_model[cod-idioma]"]').focus();
				}, 100);				
            }
		});

        // EVENTS
        $scope.$on("salesorder.pd4000.loadorder", function (event, data) {
            if (data != "pd4000c") {
                controller.setModel($scope.orderController.order,
                                    $scope.orderController.orderParameters,
                                    $scope.orderController.orderExport,
                                    $scope.orderController.orderExportExpense);
            }
        });

		$scope.$on("salesorder.pd4000.changeparameters", function (event,data) {
            controller.orderParameters =  $scope.orderController.orderParameters;
		});
    }

    exportExpenseModal.$inject = ['$modal'];
    function exportExpenseModal($modal) {
        this.open = function open(parameters, callback) {
            require(['/dts/mpd/html/pd4000/pd4000.export.expense.js'], function() {
                var modalInstance = $modal.open({
                    templateUrl: '/dts/mpd/html/pd4000/pd4000.export.expense.html',
                    controller: 'salesorder.pd4000ExportExpenseModal.Controller as exportExpenseController',
                    size: 'lg',
                    resolve: {
                        modalParams: function() {
                            return parameters;
                        }
                    }
                });
                callback(modalInstance);
            });
        };
    }

    index.register.controller('salesorder.pd4000ExportInfo.Controller', exportInfoController);
    index.register.service('salesorder.pd4000ExportExpenseModal.Service', exportExpenseModal);
});

