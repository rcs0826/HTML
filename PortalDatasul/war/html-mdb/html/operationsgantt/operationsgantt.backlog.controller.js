requirejs.config({
  paths: {
      'moment': '/dts/mdb/js/libs/3rdparty/moment/moment'
  },
  shim: {
      'moment':['angular']
  }
});

define(['index', 'moment'],  function (index, moment) {

    backlogController.$inject = ['$rootScope',
                                '$scope',
                                '$modalInstance',
                                'fchmdb.fchmdb0002.Factory',
                                'toaster',
                                'i18nFilter',
                                'model'];

    function backlogController($rootScope,
                              $scope,
                              $modalInstance,
                              fchmdb0002Factory,
                              toaster,
                              i18n,
                              model) {
        var controller = this;

        controller.gridData = [];
        controller.refreshGantt = false;


        controller.close = function () {
            $modalInstance.close(controller.refreshGantt);
        }

        controller.changeOper = function (event) {
            //atualiza no gridData
            controller.gridData.forEach(function (oper) {
                if(oper.id == event.model.id){
                    oper['$selected'] = true;
                }
            });
            //atualiza na tela
            event.model['$selected'] = true;
        }

        controller.apply = function () {
            controller.operAlocar = [];
            controller.gridData.forEach(function(oper) {
                if (oper.$selected) {
                    if (oper['datetime-inicio']){
                        oper['datetime-inicio'] = moment(oper['datetime-inicio']).format();
                    }
                    controller.operAlocar.push(oper);
                }
            });
            if (controller.operAlocar.length > 0){
                controller.allocateOp(controller.operAlocar);
            }
        }
        controller.allocateOp = function(ttWtdbrOperacao) {

            fchmdb0002Factory.updateOp(ttWtdbrOperacao, function(result) {
                ttWtdbrOperacao = result['tt-wtdbr-operacao'];
                controller.ttErrors = result['tt-erro'];

                if (result.hasAlert) {
                    toaster.warning(
                        i18n('l-warning', [], 'dts/mdb'),
                        i18n('l-inconsistent-operation', [], 'dts/mdb')
                    );
                }
                if (result.hasError) {
                    controller.ttErrors.forEach(function ( error ){
                        toaster.error(
                            i18n('l-error', [], 'dts/mdb'),
                            error.mensagem,
                            60000
                        );
                    });
                    return;
                }
                /* nao encontrou erros */
                toaster.success(
                    i18n('l-success-2', [], 'dts/mdb'),
                    i18n('msg-operation-allocated-successfully', [], 'dts/mdb')
                );

                controller.refreshGantt = true;
                controller.refresh();
            });
        };

        controller.gridOptions = {
                reorderable: true,
                resizable: true
        };

        controller.refresh = function () {

            var params = {"p-cod-cenario": model.selectedScenario,
                        "p-num-simulacao": model.selectedSimulation};

            fchmdb0002Factory.operationsBacklog(params, function(result) {                
                controller.gridData = result;
                controller.gridData.forEach(function (op) {
                    controller.gridDataOriginal.forEach(function (opOld) {
                        if (op.id === opOld.id){
                            op['$selected']       = opOld['$selected'];
                            op['gm-codigo']       = opOld['gm-codigo'];
                            op['cod-ctrab']       = opOld['cod-ctrab'];
                            op['datetime-inicio'] = opOld['datetime-inicio'];
                        }
                    })
                })
                controller.gridDataOriginal = result;
            });
        }

        /* Lista registros conforme termo informado nos Grupos de Máquinas, Ordens e Itens */
        controller.searchItem = function () {
            setTimeout(function() {

                var vlPesquisa = controller.valorSearch.toLowerCase();
                var gmOrdemItem = "";

                controller.gridData = controller.gridDataOriginal.filter(function(oper) {

                    gmOrdemItem = oper['gm-codigo'].toLowerCase() +
                                  oper['num-ord-alpha'].toLowerCase() +
                                  oper['it-codigo'].toLowerCase();

                    if(gmOrdemItem.includes(vlPesquisa)) {
                        return oper;
                    }
                });
                controller.grid.refresh();
            }, 100);
        }

        controller.init = function () {
            controller.valorSearch = "";
            controller.gridData = model.listOper;
            controller.gridDataOriginal = model.listOper;
        }

        controller.init();
    };

    index.register.controller('mdb.operationsgantt.backlog.controller', backlogController);

});