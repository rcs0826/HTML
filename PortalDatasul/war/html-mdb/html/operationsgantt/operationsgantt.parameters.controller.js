define(['index',
        'css!/dts/mdb/html/operationsgantt/parameters-style.css'], function (index) {

    parametersController.$inject = ['$rootScope', 
                                    '$scope', 
                                    '$modalInstance', 
                                    'i18nFilter', 
                                    'model'];
    
        function parametersController($rootScope, 
                                      $scope, 
                                      $modalInstance, 
                                      i18n,  
                                      model) {
            var controller = this;

            controller.init = function () {

                controller.model = JSON.parse(JSON.stringify(model));

                controller.gridData = controller.model.gmFilter;
                controller.gridData.forEach(function (gm) {
                    controller.enableGridGm = true;
                    gm['$selected'] = gm.selecionado;
                });

                //ordenar lista de gms 
                controller.gridData.sort(function(a,b){
                    return a.gmCodDesc < b.gmCodDesc ? -1 : a.gmCodDesc > b.gmCodDesc ? 1 : 0;
                });
                controller.gridDataAux = JSON.parse(JSON.stringify(controller.gridData));

                controller.periods = [{value: 1, label: i18n('l-daily', [], 'dts/mdb')},
                                      {value: 2, label: i18n('l-weekly', [], 'dts/mdb')},
                                      {value: 3, label: i18n('l-monthly', [], 'dts/mdb')}];

            }
                
            controller.apply = function () {
                controller.gridData.forEach(function (gm) {
                    gm.selecionado = gm.$selected;
                });
                
                if (0 != JSON.stringify(controller.gridData).localeCompare(JSON.stringify(controller.gridDataAux)) || 
                    JSON.stringify(controller.model.periodDate) !== JSON.stringify(model.periodDate) ||
                    JSON.stringify(controller.model.showWorkCentersWithoutOperation) !== JSON.stringify(model.showWorkCentersWithoutOperation) ||
                    JSON.stringify(controller.model.showWorkCentersWithInfiniteCapacity) !== JSON.stringify(model.showWorkCentersWithInfiniteCapacity)){
                    controller.model.atualizaGmList = true;
                }else{
                    controller.model.atualizaGmList = false;
                }

                $modalInstance.close(controller.model);
            }
    
            controller.cancel = function () {
                $modalInstance.dismiss('cancel');
            }
            
            controller.init();
    
            $scope.$on('$stateChangeStart', function () {
                $modalInstance.dismiss('cancel');
            });
        };
    
        index.register.controller('mdb.operationsgantt.parameters.controller', parametersController);
    });