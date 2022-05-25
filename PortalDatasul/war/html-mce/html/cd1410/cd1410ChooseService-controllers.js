define(['index'], function (index) {

    // CONTROLLER MODAL ATENDIMENTO SALDOS
    cd1410CtrlChooseService.$inject = [
         '$rootScope', 
         '$scope', 
         '$modalInstance', 
         'parameters',
         'mce.utils.Service', 
         '$filter', 
         'TOTVSEvent', 
         'mce.fchmatcd1410.factory'
     ];

    function cd1410CtrlChooseService($rootScope,
                                      $scope, 
                                      $modalInstance, 
                                      parameters, 
                                      mceUtils, 
                                      $filter, 
                                      TOTVSEvent, 
                                      fchmatcd1410) {

        // *********************************************************************************
        // *** Variables
        // *********************************************************************************
        var controller = this;
 
        this.mceUtils = mceUtils;
        this.dataItem = parameters.dataItem;
        this.fchmatcd1410 = fchmatcd1410;
        this.tipoConEst = this.dataItem['tipo-con-est'];
        /* Formata casas decimais qt-requisitada */
        this.dataItem['qt-atendida'] = controller.mceUtils.formatDecimal(controller.dataItem['qt-atendida'], 4);
        /* Busca data atual para devolucao */
        this.dataItem['dt-atend'] = Date.now();
        this.manterFechada = false;       

        // *********************************************************************************
        // *** Functions
        // *********************************************************************************       

        /* Função....: returnRequisitionProcessing
           Descrição.: Realizadevolução de requisições
           Parâmetros: <não há> 
        */
        this.materialRequisitionReturn = function (dateMaterialProcessing, manterFechada, dirtyTTSummaryInventoryBalance) {
            controller.fchmatcd1410.materialRequisitionReturn({
                    dateMaterialProcessing: dateMaterialProcessing,
                    manterFechada: manterFechada
                }, dirtyTTSummaryInventoryBalance,
                function (result) {
                    if (result && result.$hasError) {
                        return;
                    }
                    $modalInstance.close(result);
                });
        };

        /* Função....: callMaterialRequisitionReturn
           Descrição.: Função cetralizada para chamar materialRequisitionReturn
           Parâmetros: <não há> 
        */
         this.callMaterialRequisitionReturn = function () {
             controller.materialRequisitionReturn(
                 controller.dataItem['dt-atend'],
                 controller.manterFechada,
                 controller.dirtyTTSummaryInventoryBalance
             );
         }; 

        /* Função....: apply
           Descrição.: Função disparada ao clicar no botõa aplicar
           Parâmetros: <não há> 
        */
        this.apply = function () {            
            /* Controle por lote ou referencia*/
            if (this.dataItem['tipo-con-est'] >= 3 && controller.dirtyTTSummaryInventoryBalance.length > 0) {

                controller.fchmatcd1410.validateLot(
                    { 
                        dateMaterialProcessing: controller.dataItem['dt-atend']
                    } , controller.dirtyTTSummaryInventoryBalance ,
                    function (result) {
                        if (result.plValidaLote) {
                            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                                title: 'l-there-are-lots-expired',
                                cancelLabel: 'l-cancel',
                                confirmLabel: 'l-confirm',
                                text: $scope.i18n('l-there-are-lots-expired'),
                                callback: function (isPositiveResult) {
                                    if (isPositiveResult) {                            
                                         controller.callMaterialRequisitionReturn();
                                    }
                                }
                            });
                        } else {
                            controller.callMaterialRequisitionReturn();
                        }
                    }
                );
            } else {
                controller.callMaterialRequisitionReturn();
            }
        };

        /* Função....: getTemplateSituacao
           Descrição.: Funcao chamada pela celula situação.
                       Retorna template que altera cor do conteúdo da célula
                       conforme situação do item da requisição
           Parâmetros: dataItem: objeto correspondente à linha do grid
         */
        function getTemplateSituacao(dataItem) {
            var color = '';
            switch (dataItem['sit']) {
                case 1:
                    color = "#ff0000"; /* 1 - atrasada - red */
                    break;
                case 2:
                    color = '#ffa500'; /* 2- pendente - orange */
                    break;
                case 3:
                    color = '#008000'; /* 3 - green */
                    break;
                 default:
                    color = "#000000"; // black
            }
            return '<span style = "font-weight: bold; color: ' + color + ';">' + dataItem['desc-status'] + '</span>';
        }

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
        this.getSummaryInventoryBalance = function () {

            controller.ttSummaryInventoryBalance = [];

            controller.fchmatcd1410.getSummaryInventoryBalance({
                    num_docto: controller.dataItem['nr-requisicao'],
                    seq: controller.dataItem['sequencia'],
                    it_codigo:controller.dataItem['it-codigo']
                }, {},
                function (result) {
                   controller.ttSummaryInventoryBalance = result;
                });
        };

        if ($rootScope.currentuserLoaded) {
           controller.getSummaryInventoryBalance();
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
    }
    index.register.controller('mce.cd1410.ChooseService', cd1410CtrlChooseService);
});
