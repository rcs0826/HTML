/* global TOTVSEvent, angular*/
define(['index'], function(index) {
    
    

    orderPaymentController.$inject = [
        '$scope', 
        '$stateParams', 
        '$timeout',
        '$filter',
        'customization.generic.Factory',
        'mpd.fchdis0051.Factory'];

    function orderPaymentController(
            $scope, 
            $stateParams, 
            $timeout,
            $filter,
            customService,
            fchdis0051) {                
    	
        var data = $filter('date');
        var curr = $filter('currency');
        var numb = $filter('number');

        var orderPaymentController = this;
    
        orderPaymentController.orderId = $stateParams.orderId;
        orderPaymentController.enabled = false;
        orderPaymentController.ttSpecialPaymentConditionPD4000 = [];
        orderPaymentController.calculated = {};

        orderPaymentController.loadData = function () {
            orderPaymentController.order = $scope.orderController.order;
            orderPaymentController.orderDisabled = $scope.orderController.orderDisabled;
            orderPaymentController.ttOrderParameters = $scope.orderController.orderParameters 
            orderPaymentController.ttSpecialPaymentConditionPD4000 = $scope.orderController.ttSpecialPaymentConditionPD4000
            orderPaymentController.original = angular.copy(orderPaymentController.ttSpecialPaymentConditionPD4000);

            if ($scope.orderController.pd4000['aba-pagamento'].fieldEnabled == false) {
                orderPaymentController.orderDisabled = true;
            }

            orderPaymentController.enabled = !orderPaymentController.orderDisabled;

            if (!orderPaymentController.orderDisabled) {
                var ttVisibleFields = $scope.orderController.ttVisibleFields;
                for (var i = 0; i < ttVisibleFields.length; i++) {
                    if (ttVisibleFields[i].fieldName == 'cod-cond-pag') {
                        orderPaymentController.enabled = ttVisibleFields[i].fieldEnabled;
                    }
                }

                orderPaymentController.calculated = {};

                for (i = 0; i < orderPaymentController.ttSpecialPaymentConditionPD4000.length; i++) {
                    var payment = orderPaymentController.ttSpecialPaymentConditionPD4000[i];
                    if (payment['calc-data-pagto']) 
                        orderPaymentController.calculated['calc-data-pagto'] = true; 
                    if (payment['calc-nr-dias-venc']) 
                        orderPaymentController.calculated['calc-nr-dias-venc'] = true; 
                    if (payment['calc-perc-pagto']) 
                        orderPaymentController.calculated['calc-perc-pagto'] = true; 
                    if (payment['calc-vl-pagto']) 
                        orderPaymentController.calculated['calc-vl-pagto'] = true; 
                }
            }

            if (orderPaymentController.orderDisabled || orderPaymentController.order['cod-cond-pag']) {
                orderPaymentController.paymentsGrid.hideColumn('$selected');
                orderPaymentController.paymentsGrid.hideColumn('["nr-sequencia"]');
            } else {
                orderPaymentController.paymentsGrid.showColumn('$selected');
                orderPaymentController.paymentsGrid.showColumn('["nr-sequencia"]');
            }
            
        };

		$scope.$on("salesorder.pd4000.selectview", function (event,data) {
			if (data == 'pd4000d') {
				$timeout(function() {
					angular.element('input[name="orderpaymentcontroller_order_cod_cond_pag_input"]').focus();
				}, 100);				
            }
		});

		$scope.$on("salesorder.pd4000.changeparameters", function (event,data) {
			orderPaymentController.ttOrderParameters = $scope.orderController.orderParameters;
		});

        $scope.$on("salesorder.pd4000.loadorder", function (event,data) {
            if (data != "pd4000d") {
                // busca os dados do controller principal
                orderPaymentController.loadData();
            }
        });

        orderPaymentController.changeCondPag = function () {
            fchdis0051.changeOrderPaymentTerm({
                nrPedido: orderPaymentController.orderId
            }, {
                ttOrder: orderPaymentController.order, 
                ttOrderParameters: orderPaymentController.ttOrderParameters
            }, function(result) {
                customService.callCustomEvent("changeOrderPaymentTerm", {
                    controller:orderPaymentController,
                    result: result 
                });

                if (!result.$hasError)
                    $scope.$emit("salesorder.pd4000.loadorder","pd4000d");
            })
        };

        orderPaymentController.dataPagtoTemplate = function (dataItem) {
            if (dataItem['data-pagto'] == null) return "";
            var val = data(dataItem['data-pagto'],'dd/MM/yyyy');
            if (dataItem['calc-data-pagto'])
                val = '<strong><em>' + val + '</em></strong>';
            return val;
        };

        orderPaymentController.nrDiasVencTemplate = function (dataItem) {
            var val = numb(dataItem['nr-dias-venc'],0);
            if (dataItem['calc-nr-dias-venc'])
                val = '<strong><em>' + val + '</em></strong>';
            return val;
        };

        orderPaymentController.percPagtoTemplate = function (dataItem) {
            var val = numb(dataItem['perc-pagto'],2);
            if (dataItem['calc-perc-pagto'])
                val = '<strong><em>' + val + '</em></strong>';
            return val;
        };

        orderPaymentController.vlPagtoTemplate = function (dataItem) {
			var val = numb(dataItem['vl-pagto'],5);
            if (dataItem['calc-vl-pagto'])
                val = '<strong><em>' + val + '</em></strong>';
            return val;
        };

        orderPaymentController.gridEdit = function (event,column) {

            var noedit = false;

            var data = event.model;

            if (column.column == "nr-sequencia" && data.hasOwnProperty("ttRowId"))
                noedit = true;

            if (column.column == "data-pagto" && orderPaymentController.calculated['calc-data-pagto'])
                noedit = true;

            if (column.column == "nr-dias-venc" && orderPaymentController.calculated['calc-nr-dias-venc'])
                noedit = true;

            if (column.column == "perc-pagto" && orderPaymentController.calculated['calc-perc-pagto'])
                noedit = true;

            if (column.column == "vl-pagto" && orderPaymentController.calculated['calc-vl-pagto'])
                noedit = true;

            if (noedit || !orderPaymentController.enabled || orderPaymentController.order['cod-cond-pag']) {
                orderPaymentController.paymentsGrid.closeCell();
                orderPaymentController.paymentsGrid.table.focus();              
                return;
            }
            $timeout(function () {
                var inputs = $(event.container).find("input:focus:text");
                if (inputs.length > 0) inputs[0].setSelectionRange(0,999);
            },50);
        }

        orderPaymentController.itemsGridSave = function (event, column, value, original, currentIndex) {
            if (column.column == "perc-pagto" && value > 100) {
                event.preventDefault();
            }
        }

        orderPaymentController.canSave = function () {
            return !angular.equals(orderPaymentController.ttSpecialPaymentConditionPD4000, orderPaymentController.original);
        }        

        orderPaymentController.addPaymentTerm = function () {

            var lastseq = 0;

            for (var i = 0; i < orderPaymentController.ttSpecialPaymentConditionPD4000.length; i++) {
                if (orderPaymentController.ttSpecialPaymentConditionPD4000[i]['nr-sequencia'] > lastseq)
                    lastseq = orderPaymentController.ttSpecialPaymentConditionPD4000[i]['nr-sequencia']; 
            }

            var obj = {
                "nr-pedido"    : orderPaymentController.orderId,
                "cod-vencto"   : 1,
                "data-pagto"   : null,
                "nr-dias-venc" : 0,
                "nr-sequencia" : lastseq + 10,
                "observacoes"  : "",
                "perc-pagto"   : 0,
                "vl-pagto"     : 0
            };
            var i = orderPaymentController.ttSpecialPaymentConditionPD4000.push(obj);

            $timeout(function () {
                obj = orderPaymentController.paymentsGrid.dataSource.at(i - 1);
                orderPaymentController.paymentsGrid.select("tr[data-uid='" + obj.uid + "']");
                orderPaymentController.paymentsGrid.editCell("tr[data-uid='" + obj.uid + "'] td:eq(1)");
            });

        }

        orderPaymentController.removePaymentTerm = function() {
            for (var s = 0; s < orderPaymentController.gridSelectedItems.length; s++) {
                var selected = orderPaymentController.gridSelectedItems[s];
                for (var i = orderPaymentController.ttSpecialPaymentConditionPD4000.length - 1; i >= 0 ; i--) {
                    if (orderPaymentController.ttSpecialPaymentConditionPD4000[i]['nr-sequencia'] == selected['nr-sequencia'])
                        orderPaymentController.ttSpecialPaymentConditionPD4000.splice(i,1);
                }
            }

            if (orderPaymentController.ttSpecialPaymentConditionPD4000.length == 0)
                orderPaymentController.calculated = {};
        }
        
        orderPaymentController.cancel = function () {
            orderPaymentController.ttSpecialPaymentConditionPD4000 = angular.copy(orderPaymentController.original);
        }

        orderPaymentController.save = function () {
            fchdis0051.saveOrderPaymentTerm({
                nrPedido: orderPaymentController.orderId
            }, 
            orderPaymentController.ttSpecialPaymentConditionPD4000 
            , function(result) {
                customService.callCustomEvent("saveOrderPaymentTerm", {
                    controller:orderPaymentController,
                    result: result 
                });
                if (result.lok) $scope.$emit("salesorder.pd4000.loadorder","pd4000d");
            });
        }

    } 

    index.register.controller('salesorder.pd4000Payment.Controller', orderPaymentController);

});

