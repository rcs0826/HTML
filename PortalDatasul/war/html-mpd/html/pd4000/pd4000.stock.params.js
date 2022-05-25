/* global TOTVSEvent, angular*/
define(['index'], function(index) {
    
    stockParamsController.$inject = ['mpd.fchdis0051.Factory', 'modalParams', '$modalInstance'];

    function stockParamsController(fchdis0051, modalParams, $modalInstance) {

        var stockParamsController = this;

        stockParamsController.ttItemEstoqueDeposito = modalParams.ttItemEstoqueDeposito;

        stockParamsController.ttItemEstoqueParam = modalParams.ttItemEstoqueParam;
        stockParamsController.ttItemEstoqueParam['i-cb-deposito'] = stockParamsController.ttItemEstoqueParam['i-cb-deposito'].toString();

        stockParamsController.close = function() {
            $modalInstance.dismiss('cancel');
        }

        stockParamsController.selectedDepositos = function () {

            if (stockParamsController.ttItemEstoqueDeposito == undefined) return "";

            if (stockParamsController.ttItemEstoqueDeposito.hasOwnProperty('size'))
                return stockParamsController.ttItemEstoqueDeposito.toString();
            return stockParamsController.ttItemEstoqueDeposito['cod-depos'] + " - " + stockParamsController.ttItemEstoqueDeposito['nome']; 
        }

        stockParamsController.confirm = function() {

            $modalInstance.close({
                ttItemEstoqueParam:stockParamsController.ttItemEstoqueParam,
                ttItemEstoqueDeposito: stockParamsController.ttItemEstoqueDeposito
            });
        };
    }

    index.register.controller('salesorder.pd4000StockParams.Controller', stockParamsController);

});
