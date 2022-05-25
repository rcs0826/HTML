define(['index'], function (index) {

    // CONTROLLER MODAL ATENDIMENTO SALDOS
    cd1409CtrlChooseBalance.$inject = [
   '$rootScope', '$scope', '$modalInstance', 'parameters',
        'mce.utils.Service', '$filter', 'TOTVSEvent', 'mce.fchmatcd1409.factory',
   ];



    function cd1409CtrlChooseBalance($rootScope, $scope, $modalInstance, parameters, mceUtils, $filter, TOTVSEvent, fchmatcd1409) {

        // *********************************************************************************
        // *** Variables
        // *********************************************************************************
        var controller = this;

        this.mceUtils = mceUtils;
        this.dataItem = parameters.dataItem;
        this.fchmatcd1409 = fchmatcd1409;

        /* Formata casas decimais qt-requisitada */
        this.dataItem['qt-a-atender'] = controller.mceUtils.formatDecimal(controller.dataItem['qt-a-atender'], 4);
        this.close = false;

        /* Busca data atual para atendimento */
        this.dataItem['dt-atend'] = Date.now();

        this.groupLotsWMS = false;
        this.enableComponents = true;


        // *********************************************************************************
        // *** Functions
        // *********************************************************************************       

        /* Função....: balanceRequestProcessing
           Descrição.: Realiza atendimento de requisições
           Parâmetros: <não há> 
        */
        this.balanceRequestProcessing = function (dateMaterialProcessing, close, ttSummaryInventoryBalance) {
            controller.fchmatcd1409.balanceRequestProcessing({
                    dateMaterialProcessing: dateMaterialProcessing,
                    close: close
                }, ttSummaryInventoryBalance,
                function (result) {
                    if (result && result.$hasError) {
                        return;
                    }
                    $modalInstance.close(result);
                });

        };


        /* Função....: apply
           Descrição.: Função disparada ao clicar no botõa aplicar
           Parâmetros: <não há> 
        */
        this.apply = function () {
            // SE O ITEM FOR CONTROLADO POR LOTE E FOI DIGITADA ALGUMA QUANTIDADE A ATENDER
            // VALIDA A DATA DE VALIDADE DO LOTE
            if(controller.ttSummaryInventoryBalance.length > 0){
                if (this.dataItem['tipo-con-est'] === 3) {                
                    controller.fchmatcd1409.validateLot({
                            dateMaterialProcessing: this.dataItem['dt-atend']
                        }, controller.ttSummaryInventoryBalance,
                        function (result) {
                
                            if (result.plValidaLote) {
                
                                $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                                    title: 'l-there-are-lots-expired',
                                    cancelLabel: 'l-cancel',
                                    confirmLabel: 'l-confirm',
                                    text: $scope.i18n('l-there-are-lots-expired'),
                                    callback: function (isPositiveResult) {
                                        if (isPositiveResult) {
                
                                            controller.balanceRequestProcessing(
                                                controller.dataItem['dt-atend'],
                                                controller.close,
                                                controller.ttSummaryInventoryBalance
                                            );
                                        }
                                    }
                                });
                            } else {
                                controller.balanceRequestProcessing(
                                    controller.dataItem['dt-atend'],
                                    controller.close,
                                    controller.ttSummaryInventoryBalance
                                );
                            }
                        });
                
                } else {
                    controller.balanceRequestProcessing(
                        controller.dataItem['dt-atend'],
                        controller.close,
                        controller.ttSummaryInventoryBalance
                    );
                }
            }
        };


        /* Função....: cancel
           Descrição.: Função disparada ao clicar no botõa cancelar
           Parâmetros: <não há> 
        */

        this.cancel = function () {
            $modalInstance.dismiss('cancel'); // fecha modal sem retornar parametros
        };

        /* Função....: getItemBalance
           Descrição.: Função disparada ao clicar entrar na tela e 
                       ao clicar no check agrupa lotes wms
                       Buscar saldos em estoque para o item da requisição
           Parâmetros: <não há> 
        */
        this.getItemBalance = function () {

            controller.ttSummaryInventoryBalance = [];

            controller.fchmatcd1409.getItemBalance({
                    rRowId: controller.dataItem['rRowid'],
                    GroupLot: controller.groupLotsWMS
                }, {},
                function (result) {
                    controller.ttSummaryInventoryBalance = result;
                    controller.enableComponents = controller.ttSummaryInventoryBalance.length > 0;
                });
        };

        /* Função....: changeWMS
           Descrição.: Função disparada ao clicar no check agrupa lotes wms
                       Samarizar saldos em estoque para depositos wms
           Parâmetros: <não há> 
        */
        this.changeWMS = function () {
           controller.getItemBalance();
        };


        if ($rootScope.currentuserLoaded) {
            controller.getItemBalance();
        }

        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************

        $scope.$on('$destroy', function () {
            controller = undefined;
        });

        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            // TODO: Confirmar o fechamento caso necessário.
            $modalInstance.dismiss('cancel');
        });




    };
    index.register.controller('mce.cd1409.ChooseBalance', cd1409CtrlChooseBalance);
});
