/* global TOTVSEvent, angular*/
define(['index'], function(index) {
    

    advancePaymentController.$inject = [
        '$scope', 
        '$stateParams', 
        '$rootScope',
        '$timeout',
        'dts-utils.message.Service',
        'dts-utils.Resize.Service',
        'customization.generic.Factory',
        'totvs.app-notification.Service',
        'mpd.fchdis0051.Factory'];

    function advancePaymentController(
            $scope, 
            $stateParams, 
            $rootScope,
            $timeout,
            messageUtils,
            resizeService,
            customService,
            notification,
            fchdis0051) {                
    	
        var advancePaymentController = this;
    
        advancePaymentController.orderId = $stateParams.orderId;
        advancePaymentController.enabled = false;
        advancePaymentController.enabledIndAntecip = false;

        advancePaymentController.loadData = function () {
            advancePaymentController.order = $scope.orderController.order;
            advancePaymentController.orderDisabled = $scope.orderController.orderDisabled;
            advancePaymentController.ttPrepaymentPD4000 = $scope.orderController.ttPrepaymentPD4000[0];
            advancePaymentController.original = angular.copy(advancePaymentController.ttPrepaymentPD4000);
            advancePaymentController.originalIndAntecip = advancePaymentController.order['ind-antecip'];
            advancePaymentController.enabledIndAntecip = !advancePaymentController.orderDisabled;

            if (!advancePaymentController.orderDisabled) {
                var ttVisibleFields = $scope.orderController.ttVisibleFields;
                for (var i = 0; i < ttVisibleFields.length; i++) {
                    if (ttVisibleFields[i].fieldName == 'ind-antecip') {
                        advancePaymentController.enabledIndAntecip = ttVisibleFields[i].fieldEnabled;
                    }
                }
            }

            if ($scope.orderController.pd4000['aba-antecipacoes'].fieldEnabled == false) {
                advancePaymentController.enabledIndAntecip = false;
            }
            

            advancePaymentController.enabled = advancePaymentController.enabledIndAntecip && advancePaymentController.order['ind-antecip'];

        };

		$scope.$on("salesorder.pd4000.selectview", function (event,data) {
			if (data == 'pd4000f') {
				$timeout(function() {
					angular.element('input[name="advancepaymentcontroller_order[ind-antecip]"]').focus();
				}, 100);				
            }
		});

        $scope.$on("salesorder.pd4000.loadorder", function (event,data) {
            if (data != "pd4000f") {
                // busca os dados do controller principal
                advancePaymentController.loadData();
            }
        });

        advancePaymentController.changeIndAntecip = function () {
            advancePaymentController.enabled = advancePaymentController.enabledIndAntecip && advancePaymentController.order['ind-antecip'];
        }

        advancePaymentController.cancel = function () {
            advancePaymentController.ttPrepaymentPD4000 = angular.copy(advancePaymentController.original);
            advancePaymentController.order['ind-antecip'] = advancePaymentController.originalIndAntecip;
            advancePaymentController.changeIndAntecip();
        }



        advancePaymentController.save = function () {
            if (advancePaymentController.ttPrepaymentPD4000['observacoes'] == undefined) {
                notification.notify( {
                    type: 'error',
                    title: 'Obervação',
                    detail: 'O campo Observação deve ser informado'
                });
                return;
            }
            messageUtils.question( {
                title: 'Salvar antecipações',
                text: $rootScope.i18n('Confirma salvar as antecipações do pedido?'),
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                callback: function(isPositiveResult) {
                    if (isPositiveResult) {
                        advancePaymentController.savePrePayment();
                    }
                }
            });
        }

        advancePaymentController.savePrePayment = function () {

            fchdis0051.savePrePayment(
                {
                    nrPedido: advancePaymentController.orderId
                }, {
                    indAntecip: advancePaymentController.order['ind-antecip'],
                    ttPrepaymentPD4000: advancePaymentController.ttPrepaymentPD4000
                }, 
                function (result) {

                    if (!result.$hasError) {
                        advancePaymentController.original = angular.copy(advancePaymentController.ttPrepaymentPD4000);
                        advancePaymentController.originalIndAntecip = advancePaymentController.order['ind-antecip'];
                    }

                    customService.callCustomEvent("savePrepayment", {
                        controller:advancePaymentController,
                        result: result 
                    });
                });
        }

        advancePaymentController.remove = function () {

            fchdis0051.deletePrePayment(
                {
                    nrPedido: advancePaymentController.orderId
                }, 
                function (result) {

                    customService.callCustomEvent("deletePrePayment", {
                        controller:advancePaymentController,
                        result: result 
                    });
                                        
                    if (!result.$hasError) {
                        advancePaymentController.ttPrepaymentPD4000= {};
                    }

                });
        }

        resizeService.resize('.pd4000atencipacoes');

    } 

    index.register.controller('salesorder.pd4000AdvancePayment.Controller', advancePaymentController);

});

