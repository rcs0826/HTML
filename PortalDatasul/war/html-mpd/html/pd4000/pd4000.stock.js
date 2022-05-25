/* global TOTVSEvent, angular*/
define(['index'], function(index) {
    
    modalStockController.$inject = ['mpd.fchdis0051.Factory', 'modalParams', '$modalInstance', '$modal'];

    function modalStockController(fchdis0051, modalParams, $modalInstance, $modal) {

        var modalStockController = this;

        modalStockController.ttItemEstoque = modalParams.ttItemEstoque;
        modalStockController.ttItemEstoqueParam = modalParams.ttItemEstoqueParam; 
        modalStockController.ttItemEstoqueDeposito = modalParams.ttItemEstoqueDeposito; 

        modalStockController.close = function() {
            $modalInstance.close({
                ttItemEstoqueParam: modalStockController.ttItemEstoqueParam,
                ttItemEstoqueDeposito: modalStockController.ttItemEstoqueDeposito
            });
        }

        modalStockController.openParameters = function () {
            var modalInstance = $modal.open({
                templateUrl: '/dts/mpd/html/pd4000/pd4000.stock.params.html',
                controller: 'salesorder.pd4000StockParams.Controller as stockParamsController',
                size: 'lg',
                resolve: {
                    modalParams: function () { 
                        return {
                            ttItemEstoqueParam: modalStockController.ttItemEstoqueParam,
                            ttItemEstoqueDeposito: modalStockController.ttItemEstoqueDeposito
                        };
                    }                        
                }
            });

            modalInstance.result.then(function (data) {
                modalStockController.ttItemEstoqueParam = data.ttItemEstoqueParam;
                modalStockController.ttItemEstoqueDeposito = data.ttItemEstoqueDeposito;

                var ttItemEstoqueDeposito = [];
                
                if (modalStockController.ttItemEstoqueDeposito)  {
                    if (modalStockController.ttItemEstoqueDeposito.hasOwnProperty('size')) {
                        for (var i = 0; i < modalStockController.ttItemEstoqueDeposito.size; i++) {
                            ttItemEstoqueDeposito.push({
                                "deposito": modalStockController.ttItemEstoqueDeposito.objSelected[i]['cod-depos']
                            })
                        }
                    } else {
                        ttItemEstoqueDeposito.push({
                            "deposito": modalStockController.ttItemEstoqueDeposito['cod-depos']
                        })
                    }                
                }


                fchdis0051.itemstock({
                    item: modalStockController.ttItemEstoque['it-codigo'],
                    referencia: modalStockController.ttItemEstoque['cod-refer']
                }, {
                    ttItemEstoqueDeposito: ttItemEstoqueDeposito,
                    ttItemEstoqueParam: modalStockController.ttItemEstoqueParam
                }, function (data) {
                    modalStockController.ttItemEstoque = data.ttItemEstoque[0];
                });                
			});
        }

        modalStockController.loadSimulation = function () {

            if (modalStockController.ttItemEstoqueSimulacao != undefined) return; 
            
            fchdis0051.itemstocksimulation (
                {},
                {
                    ttItemEstoqueDeposito: modalStockController.ttItemEstoqueDeposito,
                    ttItemEstoqueParam: modalStockController.ttItemEstoqueParam,
                    ttItemEstoque: modalStockController.ttItemEstoque
                },
                function (data) {
                    modalStockController.ttItemEstoqueSimulacao = data.ttItemEstoqueSimulacao;
                }
            )

        }

        modalStockController.loadSalesOrders = function (dataItem) {
            if (dataItem == undefined) return;
            fchdis0051.itemstocksimulationsalesorder (
                {
                    item: modalStockController.ttItemEstoque['it-codigo'],
                    referencia: modalStockController.ttItemEstoque['cod-refer'],
                    data: dataItem['data-saldo']
                },
                modalStockController.ttItemEstoqueParam,                
                function (data) {
                    dataItem.ttItemEstoqueSimulacaoSalesOrder = data.ttItemEstoqueSimulacaoSalesOrder;
                }
            )
        }

        modalStockController.loadProdOrders = function (dataItem) {
            if (dataItem.ttItemEstoqueSimulacaoProdOrder != undefined) return;
            fchdis0051.itemstocksimulationprodorder (
                {
                    item: modalStockController.ttItemEstoque['it-codigo'],
                    referencia: modalStockController.ttItemEstoque['cod-refer'],
                    data: dataItem['data-saldo']
                },
                modalStockController.ttItemEstoqueParam,                
                function (data) {
                    dataItem.ttItemEstoqueSimulacaoProdOrder = data.ttItemEstoqueSimulacaoProdOrder;
                }
            )
        }

        modalStockController.loadPurchOrders = function (dataItem) {
            if (dataItem.ttItemEstoqueSimulacaoPurchOrder != undefined) return;
            fchdis0051.itemstocksimulationpurchorder (
                {
                    item: modalStockController.ttItemEstoque['it-codigo'],
                    referencia: modalStockController.ttItemEstoque['cod-refer'],
                    data: dataItem['data-saldo']
                },
                modalStockController.ttItemEstoqueParam,                
                function (data) {
                    dataItem.ttItemEstoqueSimulacaoPurchOrder = data.ttItemEstoqueSimulacaoPurchOrder;
                }
            )
        }

        modalStockController.loadReserve = function (dataItem) {
            if (dataItem.ttItemEstoqueSimulacaoReserve != undefined) return;
            fchdis0051.itemstocksimulationreserve (
                {
                    item: modalStockController.ttItemEstoque['it-codigo'],
                    referencia: modalStockController.ttItemEstoque['cod-refer'],
                    data: dataItem['data-saldo']
                },
                modalStockController.ttItemEstoqueParam,                
                function (data) {
                    dataItem.ttItemEstoqueSimulacaoReserve = data.ttItemEstoqueSimulacaoReserve;
                }
            )
        }

    }

    index.register.controller('salesorder.pd4000Stock.Controller', modalStockController);

});
