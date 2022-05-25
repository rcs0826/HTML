define(['index'], function (index) {

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
         
        controller.model = JSON.parse(JSON.stringify(model));

        controller.rsExibeOpt = [{value: 1, label: i18n('l-taxa-hora', [], 'dts/mcs')},
                                 {value: 2, label: i18n('l-total-ggf', [], 'dts/mcs')},
                                 {value: 3, label: i18n('l-horas-rep', [], 'dts/mcs')}];

        controller.rsTipoValOpt = [{value: 1, label: i18n('l-total', [], 'dts/mcs')},
                                   {value: 2, label: i18n('l-forecasted', [], 'dts/mcs')},
                                   {value: 3, label: i18n('l-forecasted2', [], 'dts/mcs')},
                                   {value: 4, label: i18n('l-managerial', [], 'dts/mcs')}];

        controller.apply = function () {
            $modalInstance.close(controller.model);            
        }

        controller.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
        
        controller.desmarca = function () {
            if(controller.model.resultType == 3){
                controller.model.showDetailToClass = false;
            }
        }         

    };

    index.register.controller('mcs.ggfbycostcenter-parameters.controller', parametersController);
});