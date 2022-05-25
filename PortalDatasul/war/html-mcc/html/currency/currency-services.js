define([
    'index',
    '/dts/mcc/js/api/ccapi353.js'
], function (index) {
    // *********************************************************************************
    // *** Controller Modal moeda
    // *********************************************************************************
    controllerChangeCurrency.$inject = ['$rootScope', '$scope', '$modalInstance', 'parameters', 'mcc.ccapi353.Factory', 'totvs.utils.Service', '$timeout'];
    function controllerChangeCurrency($rootScope, $scope, $modalInstance, parameters, factoryCurrency, totvsUtilsService, $timeout) {
        // *********************************************************************************
        // *** Variables
        // *********************************************************************************
        var ChangeCurrencyControl = this; 
        this.moeda = {
            'mo-codigo': '0'
        }; 
        this.opcaoConversao = 1; //Data da Cotação Fornecedor
        this.dataConversao = undefined;
        this.currencyList = undefined;
        // *********************************************************************************
        // *** Functions
        // *********************************************************************************    	
        this.apply = function () {
            $modalInstance.close({ moeda: this.moeda,
                opcaoConversao: this.opcaoConversao,
                dataConversao: this.dataConversao
            });
        }

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        }

        this.init = function () {
            $timeout(function () {
                totvsUtilsService.focusOn('modalCurrency');
            }, 100);

            factoryCurrency.getCurrencies(function (currencyList) { /* Busca todas as moedas e as exibe */
                if (currencyList) {
                    ChangeCurrencyControl.currencyList = currencyList;
                    $.grep(currencyList, function (element, index) {
                        if (element['mo-codigo'] == 0 && ChangeCurrencyControl.moeda['mo-codigo'] == 0) {
                            ChangeCurrencyControl.moeda.descricao = element.descricao;
                        }
                    });
                };
            }
            );
        }

        // Limpa o campo data de conversão se a opção selecionada para conversão for 1 (Data de cotação do fornecedor)
        this.mudouConversao = function () {
            if (ChangeCurrencyControl.opcaoConversao == 1) {
                ChangeCurrencyControl.dataConversao = undefined;
            }
        }

        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            $modalInstance.dismiss('cancel');
        });

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
        ChangeCurrencyControl.moeda = parameters.moeda;
        ChangeCurrencyControl.opcaoConversao = parameters.opcaoConversao;
        ChangeCurrencyControl.dataConversao = parameters.dataConversao;

        this.init();
        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************
        $scope.$on('$destroy', function () {
            ChangeCurrencyControl = undefined;
        });
    }
    index.register.controller('mcc.currency.ChangeCurrencyCtrl', controllerChangeCurrency);
});
