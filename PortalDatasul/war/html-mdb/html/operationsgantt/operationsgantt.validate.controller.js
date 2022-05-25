define(['index'],  function (index) {

    validateController.$inject = ['$rootScope',
                                      '$scope',
                                      '$modalInstance',
                                      'fchmdb.fchmdb0002.Factory',
                                      'i18nFilter',
                                      'model'];

    function validateController($rootScope,
                                    $scope,
                                    $modalInstance,
                                    fchmdb0002Factory,
                                    i18n,
                                    model) {
        var controller = this;

        controller.gridData = [];
        controller.refreshGantt = true;


        controller.close = function () {
            $modalInstance.close(controller.refreshGantt);
        }

        controller.gridOptions = {
                reorderable: true,
                resizable: true
        };

        controller.refresh = function () {
            var params ={ 
                "p-cod-cenario": controller.selectedScenario,
                "p-num-simulacao": controller.selectedSimulation
            }
            fchmdb0002Factory.operationsValidate(params, function(result) {
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

        controller.init = function () {
            controller.gridData = model.listOper;
            controller.gridDataOriginal = model.listOper;
        }

        controller.init();
    };

    index.register.controller('mdb.operationsgantt.validate.controller', validateController);

});