define([
    'index',
    '/dts/mpd/js/zoom/itinerario.js',
    '/dts/mpd/js/zoom/pto-itiner.js',
    '/dts/mpd/js/zoom/emitente.js',
    '/dts/mpd/js/zoom/moeda.js',
    '/dts/mpd/js/zoom/cond-pagto.js',
    '/dts/mpd/js/zoom/desp-imp.js',
], function(index) {
    'use strict';
    /* jshint validthis: true */

    modalExportExpensecontroller.$inject = [
        '$rootScope', 
        'mpd.fchdis0051.Factory',
        'customization.generic.Factory', 
        'modalParams', 
        '$modalInstance'];
    function modalExportExpensecontroller(
        $rootScope, 
        fchdis0051, 
        customService,
        modalParams, 
        $modalInstance) {
        var controller = this;
        controller.model = {};
        controller.isEdit = modalParams.isEdit;

        controller.classifDespOptions = [
            {key: 1, value: $rootScope.i18n('Nenhuma', [], 'dts/mpd')},
            {key: 2, value: $rootScope.i18n('Frete', [], 'dts/mpd')},
            {key: 3, value: $rootScope.i18n('Seguro', [], 'dts/mpd')},
            {key: 4, value: $rootScope.i18n('Embalagem', [], 'dts/mpd')},
        ];

        this.init = function init() {
            setDefaults();
            if(!modalParams.isEdit) {
                fchdis0051.getDefaultExportExpensesData({
                    nrPedido: controller.model['nr-pedido'],
                    codItiner: controller.model['cod-itiner']
                }, function(result) {
                    customService.callCustomEvent("getDefaultExportExpensesData", {
                        controller:controller,
                        result: result 
                    });

                    if(result.ttOrderExportExpenseInfo.length > 0) {
                        controller.model = result.ttOrderExportExpenseInfo[0];

                        // Seta a sequência para a maior + 1
                        var lastSeq = 0;
                        modalParams.expenses.forEach(function(expense) {
                            if(expense.sequencia > lastSeq) {
                                lastSeq = expense.sequencia;
                            }
                        });
                        controller.model.sequencia = lastSeq + 1;
                    }
                });
            } else {
                controller.model = angular.copy(modalParams.expense);
                setDefaults();
            }
        };

        function setDefaults() {
            // Inicializa alguns parâmetros do model
            controller.model['nr-pedido'] = modalParams.exportOrder['nr-pedido'];
            controller.model['cod-itiner'] = modalParams.exportOrder['cod-itiner'];
        }

        this.onChangeExpense = function onChangeExpense() {
            fchdis0051.leaveExportExpense({campo: 'cdn-despes', valor: controller.model['cdn-despes']}, {}, function(result) {
                if(result && result.valores) {
                    controller.model['cod-emitente-desp'] = result.valores[0];
                    controller.model['cdn-classif-despes'] = result.valores[1];
                    controller.model['cod-cond-pag'] = result.valores[2];
                }
            });
        };

        this.onChangeVendor = function onChangeVendor() {
            fchdis0051.leaveExportExpense({campo: 'cod-emitente-desp', valor: controller.model['cod-emitente-desp']}, {}, function(result) {
                if(result && result.valores) {
                    controller.model['cod-cond-pag'] = result.valores[0];
                }
            });
        };

        this.close = function() {
            $modalInstance.dismiss('cancel');
        };

        this.save = function() {
            var expenses = angular.copy(modalParams.expenses);

            if(modalParams.isEdit) {
                // Remove a antiga despesa do array
                expenses.forEach(function(oldExpense) {
                    if(oldExpense.sequencia === controller.model.sequencia) {
                        expenses.splice(expenses.indexOf(oldExpense), 1);
                    }
                });
            }

            // Coloca a despesa corrente no array
            expenses.push(controller.model);

            fchdis0051.validateExportExpense(
            {
                sequencia: controller.model.sequencia,
                isEdit: modalParams.isEdit
            }, {
                ttOrderExportInfo: modalParams.exportOrder,
                ttOrderExportExpenseInfo: expenses
            }, function(result) {
                customService.callCustomEvent("validateExportExpense", {
                    controller:controller,
                    result: result 
                });

                if(!result.$hasError && result.ttOrderExportExpenseInfo.length > 0) {
                    $modalInstance.close(result.ttOrderExportExpenseInfo[0]);
                }
            });
        };

        this.init();
    }

    index.register.controller('salesorder.pd4000ExportExpenseModal.Controller', modalExportExpensecontroller);
});
