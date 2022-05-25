/* global TOTVSEvent, angular*/
define(['index'], function (index) {

    // TODO: verificar validateAllocation

    itemAllocationController.$inject = [
        '$scope',
        '$stateParams',
        '$timeout',
        'customization.generic.Factory',
        'mpd.fchdis0051.Factory'];

    function itemAllocationController(
        $scope,
        $stateParams,
        $timeout,
        customService,
        fchdis0051) {

        var itemAllocationController = this;

        itemAllocationController.orderId = $stateParams.orderId;
        itemAllocationController.pesquisa = null;
        itemAllocationController.alocato = false;

        itemAllocationController.init = function (item) {
            if (item) {
                itemAllocationController.item = item;
                itemAllocationController.ttOrderItemAllocation = item.ttOrderItemAllocation
                itemAllocationController.original = angular.copy(itemAllocationController.ttOrderItemAllocation);
                itemAllocationController.orderDisabled = $scope.orderController.orderDisabled;
                if ($scope.orderController.pd4000['aba-alocacao'].fieldEnabled == false) {
                    itemAllocationController.orderDisabled = true;
                }

            }
        }

        itemAllocationController.gridSave = function (e) {
            $timeout(function () {
                var grid = itemAllocationController.gridAllocation;
                grid.footer.find(".k-footer-template").replaceWith(grid.footerTemplate(grid.dataSource.aggregates()));
            });
        }

        itemAllocationController.gridEdit = function (event, column) {
            $timeout(function () {
                var inputs = $(event.container).find("input:focus:text");
                if (inputs.length > 0) inputs[0].setSelectionRange(0, 999);
            }, 50);
        }

        itemAllocationController.reload = function () {

            fchdis0051.orderitemalocationrefresh(
                { nrPedido: itemAllocationController.orderId },
                itemAllocationController.ttOrderItemAllocation || [],
                function (result) {
                    customService.callCustomEvent("orderItemAlocationRefresh", {
                        controller: itemAllocationController,
                        result: result
                    });

                    itemAllocationController.ttOrderItemAllocation = result.ttOrderItemAllocation;
                    itemAllocationController.original = angular.copy(itemAllocationController.ttOrderItemAllocation);
                }
            );

        }

        itemAllocationController.clean = function () {
            for (var index = 0; index < itemAllocationController.ttOrderItemAllocation.length; index++) {
                var element = itemAllocationController.ttOrderItemAllocation[index];
                element["qt-aloc-ped"] = 0;
            }
            itemAllocationController.gridAllocation.dataSource.data(itemAllocationController.ttOrderItemAllocation);
        }

        itemAllocationController.filtrar = function () {
            var filters = [];

            if (itemAllocationController.pesquisa) {
                filters.push({ field: '["cod-depos"]', operator: 'contains', value: itemAllocationController.pesquisa });
            }
            if (itemAllocationController.alocado) {
                filters.push({ field: '["qt-aloc-ped"]', operator: 'neq', value: 0 });
            }
            itemAllocationController.gridAllocation.dataSource.filter(filters);
        }

        itemAllocationController.save = function () {

            ttOrderItemAllocation = [];

            for (var i = 0; i < itemAllocationController.ttOrderItemAllocation.length; i++) {
                for (var j = 0; j < itemAllocationController.original.length; j++) {
                    if (itemAllocationController.ttOrderItemAllocation[i]['nr-seq-item'] === itemAllocationController.original[j]['nr-seq-item'] &&
                        itemAllocationController.ttOrderItemAllocation[i]['cod-depos'] === itemAllocationController.original[j]['cod-depos'] &&
                        itemAllocationController.ttOrderItemAllocation[i]['cod-localiz'] === itemAllocationController.original[j]['cod-localiz'] &&
                        itemAllocationController.ttOrderItemAllocation[i]['lote'] === itemAllocationController.original[j]['lote'] &&
                        itemAllocationController.ttOrderItemAllocation[i]['qt-aloc-ped'] !== itemAllocationController.original[j]['qt-aloc-ped']) {
                        var element = itemAllocationController.ttOrderItemAllocation[i];
                        ttOrderItemAllocation.push(element);
                    }
                }
            }

            fchdis0051.saveorderitemalocation({
                nrPedido: itemAllocationController.orderId
            }, ttOrderItemAllocation,
                function (result) {
                    customService.callCustomEvent("saveOrderItemAlocation", {
                        controller: itemAllocationController,
                        result: result
                    });

                    itemAllocationController.reload();
                });
        }


    }

    index.register.controller('salesorder.pd4000ItemAllocation.Controller', itemAllocationController);

});

