define([
    'index',
    '/dts/mcc/js/api/fchmatenterquotations.js',
    '/dts/mcc/js/api/fchmatmultipleunitsmeasure.js'
], function (index) {

    /* Objetivo: Abre a modal de aprovação de múltiplas cotações */
    approveMultipleQuotationsModal.$inject = ['$modal'];
    function approveMultipleQuotationsModal($modal) {
        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/mcc/html/quotation/approvemodal/approvemultiplequotationsmodal.html',
                controller: 'mcc.quotation.approveMultipleQuotationsModalCtrl as controller',
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    parameters: function () { return params; }
                }
            });
            return instance.result;
        }
    }

    approveMultipleQuotationsModalController.$inject = ['$rootScope', '$scope', '$modalInstance', 'parameters', 'TOTVSEvent', 'toaster', '$q', 'mcc.fchmatenterquotations.Factory', 'totvs.app-notification.Service', '$timeout', 'mcc.fchmatmultipleunitsmeasure.Factory'];
    function approveMultipleQuotationsModalController($rootScope, $scope, $modalInstance, parameters, TOTVSEvent, toaster, $q, fchmatenterquotations, appNotificationService, $timeout, fchmatmultipleunitsmeasure) {
        var approveMultipleQuotationsModalControl = this;
        approveMultipleQuotationsModalControl.model = [];
        approveMultipleQuotationsModalControl.model.ttOrders = [];
        approveMultipleQuotationsModalControl.model.ttCotacaoItem = [];
        approveMultipleQuotationsModalControl.model.ttDeliverySchedule = [];
        approveMultipleQuotationsModalControl.model.ttDeliveryScheduleAux = [];
        approveMultipleQuotationsModalControl.model.comments = "";

        approveMultipleQuotationsModalControl.model.internalUnitOfMeasure = null;
        approveMultipleQuotationsModalControl.model.internalUnitOfMeasureDescription = null;
        approveMultipleQuotationsModalControl.model.orderQty = 0;
        approveMultipleQuotationsModalControl.model.totalQty = 0;
        approveMultipleQuotationsModalControl.listItemVendorUnit = [];
        approveMultipleQuotationsModalControl.unitOfMeasureDesc = [];
        approveMultipleQuotationsModalControl.multipleOrders = [];


        /*
         * Objetivo: método de inicialização da tela
         * Parâmetros: 
         * Observações: 
         */
        approveMultipleQuotationsModalControl.init = function () {
            approveMultipleQuotationsModalControl.updateDeliveriesOptions = [{ value: 1, label: $rootScope.i18n('l-up-to-delivery') },
                                                                             { value: 2, label: $rootScope.i18n('l-all') },
                                                                             { value: 3, label: $rootScope.i18n('l-not-update-2') }];
            approveMultipleQuotationsModalControl.model.updateDeliveriesDate = 3;

            if (!parameters || !parameters.ttCotacaoItem) {
                return;
            }

            var listItemVendor = [];
            if (parameters && parameters.ttCotacaoItem) {
                for (var i = 0; i < parameters.ttCotacaoItem.length; i++) {
                    parameters.ttCotacaoItem[i]['qtdDoForn'] = 0;
                    parameters.ttCotacaoItem[i]['manufacturer'] = parameters.ttCotacaoItem[i]['cdn-fabrican'];
                    parameters.ttCotacaoItem[i]['manufacturerDescription'] = parameters.ttCotacaoItem[i]['nom-fabrican'];
                    parameters.ttCotacaoItem[i]['internalUM'] = parameters.ttCotacaoItem[i]['un-interna'];

                    var lFound = false;
                    for (var j = 0; j < approveMultipleQuotationsModalControl.model.ttOrders.length; j++) {
                        if (approveMultipleQuotationsModalControl.model.ttOrders[j]['numero-ordem'] == parameters.ttCotacaoItem[i]['numero-ordem']
                            && approveMultipleQuotationsModalControl.model.ttOrders[j]['it-codigo'].toLowerCase() == parameters.ttCotacaoItem[i]['it-codigo'].toLowerCase()) {
                            lFound = true;
                        }
                    }
                    if (!lFound) 
                        approveMultipleQuotationsModalControl.model.ttOrders.push(parameters.ttCotacaoItem[i]);

                    approveMultipleQuotationsModalControl.multipleOrders[parameters.ttCotacaoItem[i]['numero-ordem']] = lFound;

                    listItemVendor.push({ itemCode: parameters.ttCotacaoItem[i]['it-codigo'], vendorCode: parameters.ttCotacaoItem[i]['cod-emitente'] });
                }
                approveMultipleQuotationsModalControl.model.comments = parameters.ttCotacaoItem["motivo-apr"];
                approveMultipleQuotationsModalControl.model.ttCotacaoItem = parameters.ttCotacaoItem;

                fchmatmultipleunitsmeasure.getItemVendorUnits({}, { lGet: true, ttItemVendorVO: listItemVendor }, function (result) {
                    if (result && result.length > 0) {
                        approveMultipleQuotationsModalControl.listItemVendorUnit = result;

                        for (var i = 0; i < result.length; i++) {
                            approveMultipleQuotationsModalControl.unitOfMeasureDesc[result[i].unitOfMeasure.toLowerCase()] = result[i].unitOfMeasureDescription;
                        }
                    }

                    approveMultipleQuotationsModalControl.getDeliveryScheduleList();
                });
            }
        }

		/*
		 * Objetivo: Busca as informações das entregas das ordens
		 * Parâmetros: 
		 * Observações: 
		 */
        approveMultipleQuotationsModalControl.getDeliveryScheduleList = function () {
            var params = {};
            params.lMultipleOrders = true;
            params.ttOrderList = [];
            for (var i = 0; i < approveMultipleQuotationsModalControl.model.ttOrders.length; i++) {
                params.ttOrderList.push({ "numero-ordem": approveMultipleQuotationsModalControl.model.ttOrders[i]['numero-ordem'] });
            }
            fchmatenterquotations.getDeliveryScheduleList({}, params, function (result) {
                var quotations = [];
                for (var i = 0; i < approveMultipleQuotationsModalControl.model.ttCotacaoItem.length; i++) {
                    if (result) {
                        for (var j = 0; j < result.length; j++) {
                            if (result[j]['numero-ordem'] == approveMultipleQuotationsModalControl.model.ttCotacaoItem[i]['numero-ordem']) {
                                var delivery = angular.copy(result[j]);
                                delivery['un'] = approveMultipleQuotationsModalControl.model.ttCotacaoItem[i]['un'];
                                delivery['un-desc'] = approveMultipleQuotationsModalControl.unitOfMeasureDesc[approveMultipleQuotationsModalControl.model.ttCotacaoItem[i]['un'].toLowerCase()];
                                delivery['manufacturer'] = approveMultipleQuotationsModalControl.model.ttCotacaoItem[i]['cdn-fabrican'];
                                delivery['manufacturerDescription'] = approveMultipleQuotationsModalControl.model.ttCotacaoItem[i]['nom-fabrican'];
                                delivery['qtd'] = delivery['quantidade'];
                                delivery['qtd-do-forn'] = delivery['quantidade'] * approveMultipleQuotationsModalControl.getIndexToConvertion(delivery['it-codigo'], delivery['un']);
                                delivery['qtdDoForn'] = delivery['qtd-do-forn'];
                                quotations.push(delivery);
                            }
                        }
                    }
                }
                approveMultipleQuotationsModalControl.model.ttDeliverySchedule = quotations;
                var obj = approveMultipleQuotationsModalControl.gridOrders.dataSource.at(0);
                approveMultipleQuotationsModalControl.gridOrders.select(".gridOrders tr[data-uid='" + obj.uid + "']");
                approveMultipleQuotationsModalControl.gridOrders.editCell(".gridOrders tr[data-uid='" + obj.uid + "'] td:eq(1)");
            });
        }

		/*
		 * Objetivo: Busca índice para conversão 
		 * Parâmetros: 	item - código do item
		 * 				unit - código da unidade de medida
		 */
        approveMultipleQuotationsModalControl.getIndexToConvertion = function (item, unit) {
            item = item.toLowerCase();
            unit = unit.toLowerCase();
            for (var i = 0; i < approveMultipleQuotationsModalControl.listItemVendorUnit.length; i++) {
                if (approveMultipleQuotationsModalControl.listItemVendorUnit[i]['itemCode'].toLowerCase() == item &&
                    approveMultipleQuotationsModalControl.listItemVendorUnit[i]['unitOfMeasure'].toLowerCase() == unit) {
                    return approveMultipleQuotationsModalControl.listItemVendorUnit[i]['indexToConvertion'];
                }
            }

            return 1;
        }

		/*
		 * Objetivo: método executado na alteração do grid
		 * Parâmetros: 	event: evento angular
		 * Observações: 
		 */
        approveMultipleQuotationsModalControl.onChangeGridOrders = function (event) {
            var kendo = event.sender;
            approveMultipleQuotationsModalControl.model.vendorId = kendo.dataItem(kendo.select())['cod-emitente'];
            approveMultipleQuotationsModalControl.model.vendorName = kendo.dataItem(kendo.select())['nome-abrev'];

            approveMultipleQuotationsModalControl.model.internalUnitOfMeasure = kendo.dataItem(kendo.select())['un-interna'];
            approveMultipleQuotationsModalControl.model.internalUnitOfMeasureDescription = approveMultipleQuotationsModalControl.unitOfMeasureDesc[kendo.dataItem(kendo.select())['un-interna'].toLowerCase()];
            approveMultipleQuotationsModalControl.model.orderQty = kendo.dataItem(kendo.select())['qt-solic'];

            approveMultipleQuotationsModalControl.model.ttDeliveryScheduleAux = [];
            for (var i = 0; i < approveMultipleQuotationsModalControl.model.ttDeliverySchedule.length; i++) {
                if (approveMultipleQuotationsModalControl.model.ttDeliverySchedule[i]['numero-ordem'] == kendo.dataItem(kendo.select())['numero-ordem']) {
                    approveMultipleQuotationsModalControl.model.ttDeliveryScheduleAux.push(approveMultipleQuotationsModalControl.model.ttDeliverySchedule[i]);
                }
            }

            approveMultipleQuotationsModalControl.calculateTotal(kendo.dataItem(kendo.select())['numero-ordem']);
        }

		/*
		 * Objetivo: método responsável por calcular a quantidade total
		 * Parâmetros: 	numOrdem - número da ordem
		 * Observações: 
		 */
        approveMultipleQuotationsModalControl.calculateTotal = function (numOrdem) {
            setTimeout(function () {
                var qtd = 0;
                for (var i = 0; i < approveMultipleQuotationsModalControl.model.ttDeliverySchedule.length; i++) {
                    if (approveMultipleQuotationsModalControl.model.ttDeliverySchedule[i]['numero-ordem'] == numOrdem) {
                        qtd = qtd + approveMultipleQuotationsModalControl.model.ttDeliverySchedule[i]['quantidade'];
                    }
                }
                if(qtd == approveMultipleQuotationsModalControl.model.orderQty){
                    approveMultipleQuotationsModalControl.model.equalQuantities = true;
                }
                else{
                    approveMultipleQuotationsModalControl.model.equalQuantities = false;
                }
                approveMultipleQuotationsModalControl.model.totalQty = qtd;
            }, 1);
        }

		/*
		 * Objetivo: método executado na alteração dos dados do grid de cotação
		 * Parâmetros: 	event: evento angular
		 * 				column: coluna alterada
		 * Observações: 
		 */
        approveMultipleQuotationsModalControl.onEditGridQuotes = function (event, column) {
            var kendo = event.sender;
            var numOrdem = kendo.dataItem(kendo.select())['numero-ordem'];

            if (approveMultipleQuotationsModalControl.multipleOrders[numOrdem] === false && column.column == "quantidade") {
                approveMultipleQuotationsModalControl.quotationsGrid.closeCell();
                approveMultipleQuotationsModalControl.quotationsGrid.table.focus();
            }
        }

		/* Objetivo: método executado após editar algum campo do grid de entregas.
		 * Parâmetros:	event: dados do evento
		 * 				column: coluna que foi editada
		 * 				value:  valor informado pelo usuário
		 * 				currentIndex: index do array original
		 * 				original: referência ao objeto do array original (sem modificação)
		 */
        approveMultipleQuotationsModalControl.onSaveGridQuotes = function (event, column, value, currentIndex, original) {
            var kendo = event.sender;
            approveMultipleQuotationsModalControl.calculateTotal(kendo.dataItem(kendo.select())['numero-ordem']);
            setTimeout(function () {
                approveMultipleQuotationsModalControl.updateVendorQty(approveMultipleQuotationsModalControl.model.ttDeliveryScheduleAux[currentIndex]);
                approveMultipleQuotationsModalControl.updateValuesToApprove(approveMultipleQuotationsModalControl.model.ttDeliveryScheduleAux[currentIndex]);
            }, 10);
        }

        /*
         * Objetivo: Atualizar a quantidade do fornecedor no grid
         * Parâmetros: data: objeto com a entrega da linha editada
         */
        approveMultipleQuotationsModalControl.updateVendorQty = function (data) {
            data['qtdDoForn'] = data['quantidade'] *
                approveMultipleQuotationsModalControl.getIndexToConvertion(data['it-codigo'], data['un']);
            approveMultipleQuotationsModalControl.quotationsGrid.dataSource.data(approveMultipleQuotationsModalControl.model.ttDeliveryScheduleAux);

        }

        /*
         * Objetivo: Atualizar os valores do array utilizado na aprovação
         * Parâmetros: data: objeto com a entrega da linha editada
         */
        approveMultipleQuotationsModalControl.updateValuesToApprove = function (data) {
            var deliveryList = approveMultipleQuotationsModalControl.model.ttDeliverySchedule;
            for (var i = 0; i < deliveryList.length; i++) {
                if (deliveryList[i]['numero-ordem'] === data['numero-ordem'] &&
                    deliveryList[i]['parcela'] === data['parcela'] &&
                    deliveryList[i]['manufacturer'] === data['manufacturer'] &&
                    deliveryList[i]['un'] === data['un']) {

                    deliveryList[i]['data-entrega'] = data['data-entrega'];
                    deliveryList[i]['quantidade'] = data['quantidade'];
                    deliveryList[i]['qtd-do-forn'] = data['qtd-do-forn'];
                }
            }
        }

		/*
		 * Objetivo: Cancelar ação / Fechar modal
		 * Parâmetros:
		 */
        approveMultipleQuotationsModalControl.cancel = function () {
            $modalInstance.dismiss('cancel');
        }

		/*
		 * Objetivo: Processar informações / Atender requisições
		 * Parâmetros:
		 */
        approveMultipleQuotationsModalControl.apply = function () {
            /* Valida Quantidades */
            var lErrorQty = false;
            var lErrorQtyZero = false;
            var lErrorComments = false;
            var errors = [];
            var errorsQtyZeroAux = [];
            for (var i = 0; i < approveMultipleQuotationsModalControl.model.ttOrders.length; i++) {
                var qtd = 0;
                for (var j = 0; j < approveMultipleQuotationsModalControl.model.ttDeliverySchedule.length; j++) {
                    approveMultipleQuotationsModalControl.model.ttDeliverySchedule[j]['qtd'] = approveMultipleQuotationsModalControl.model.ttDeliverySchedule[j]['quantidade'];
                    if (approveMultipleQuotationsModalControl.model.ttOrders[i]['numero-ordem'] == approveMultipleQuotationsModalControl.model.ttDeliverySchedule[j]['numero-ordem']) {

                        qtd = qtd + approveMultipleQuotationsModalControl.model.ttDeliverySchedule[j]['quantidade'];

                        if (qtd == 0 || qtd == "" || qtd == null || qtd == undefined) {
                            lErrorQtyZero = true;
                            if (!errorsQtyZeroAux[approveMultipleQuotationsModalControl.model.ttDeliverySchedule[j]['numero-ordem']]) {
                                errorsQtyZeroAux[approveMultipleQuotationsModalControl.model.ttDeliverySchedule[j]['numero-ordem']] = true;
                                errors.push({ order: approveMultipleQuotationsModalControl.model.ttDeliverySchedule[j]['numero-ordem'], error: "lErrorQtyZero" });
                            }
                        }
                    }
                }

                if (qtd != approveMultipleQuotationsModalControl.model.ttOrders[i]['qt-solic']) {
                    lErrorQty = true;
                    errors.push({ order: approveMultipleQuotationsModalControl.model.ttOrders[i]['numero-ordem'], error: "lErrorQty" });
                }
            }

            /* Valida narrativa */
            if (!approveMultipleQuotationsModalControl.model.comments || approveMultipleQuotationsModalControl.model.comments.trim() == "") {
                lErrorComments = true;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning',
                    title: $rootScope.i18n('l-enter-reason-for-approve', [], 'dts/mcc'), // título da mensagem
                    detail: "", // texto da mensagem
                });
            } else {
                //repassa o motivo de aprovação para as cotações
                for (var i = 0; i < approveMultipleQuotationsModalControl.model.ttCotacaoItem.length; i++) {
                    approveMultipleQuotationsModalControl.model.ttCotacaoItem[i]['motivo-apr'] = approveMultipleQuotationsModalControl.model.comments;
                    approveMultipleQuotationsModalControl.model.ttCotacaoItem[i]['motivo-apr'] = approveMultipleQuotationsModalControl.model.comments;
                }
            }

            if (!lErrorQty && !lErrorQtyZero && !lErrorComments) {
                var params = {};
                params.ttQuotations = approveMultipleQuotationsModalControl.model.ttCotacaoItem;
                params.ttDeliverySchedule = approveMultipleQuotationsModalControl.model.ttDeliverySchedule;
                params.updateScheduleDate = approveMultipleQuotationsModalControl.model.updateDeliveriesDate;
                fchmatenterquotations.aproveMultipleQuotations({}, params, function (result) {
                    if (!result.$hasError) {
                        $modalInstance.close({ params: params, result: result }); //fecha a modal
                    }

                });
            } else {
                var msgErrorQty = "";
                var msgErrorQtyZero = "";
                for (var i = 0; i < errors.length; i++) {
                    if (errors[i]["error"] == "lErrorQty") {
                        msgErrorQty = msgErrorQty + "" + errors[i]["order"] + ", ";
                    }

                    if (errors[i]["error"] == "lErrorQtyZero") {
                        msgErrorQtyZero = msgErrorQtyZero + "" + errors[i]["order"] + ", ";
                    }

                }

                if (msgErrorQty != "") {
                    msgErrorQty = msgErrorQty.substring(0, (msgErrorQty.length - 2));
                    if ((msgErrorQty.match(/,/g) || []).length >= 1)
                        msgErrorQty = $rootScope.i18n('l-requisitions', [], 'dts/mcc') + ": " + msgErrorQty;
                    else
                        msgErrorQty = $rootScope.i18n('l-requisition', [], 'dts/mcc') + ": " + msgErrorQty;

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'warning',
                        title: $rootScope.i18n('l-qty-reported-different-requested-qty', [], 'dts/mcc'), // título da mensagem
                        detail: msgErrorQty, // texto da mensagem
                    });
                }
                if (msgErrorQtyZero != "") {
                    msgErrorQtyZero = msgErrorQtyZero.substring(0, (msgErrorQtyZero.length - 2));
                    if ((msgErrorQtyZero.match(/,/g) || []).length >= 1)
                        msgErrorQtyZero = $rootScope.i18n('l-requisitions', [], 'dts/mcc') + ": " + msgErrorQtyZero;
                    else
                        msgErrorQtyZero = $rootScope.i18n('l-requisition', [], 'dts/mcc') + ": " + msgErrorQtyZero;

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'warning',
                        title: $rootScope.i18n('l-amount-must-be-greater-than-zero'), // título da mensagem
                        detail: msgErrorQtyZero, // texto da mensagem
                    });
                }
            }
        }

        approveMultipleQuotationsModalControl.init(); // busca as informações default da tela

        $scope.$on('$destroy', function () {
            approveMultipleQuotationsModalControl = undefined;
        });

        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            $modalInstance.dismiss('cancel');
        });
    }

    index.register.controller('mcc.quotation.approveMultipleQuotationsModalCtrl', approveMultipleQuotationsModalController);
    index.register.service('mcc.quotation.approveMultipleQuotationsModal', approveMultipleQuotationsModal);
});
