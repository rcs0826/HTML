define(['index'], function (index) {

advancedSearchController.$inject = ['$rootScope', 
                                    '$scope', 
                                    '$modalInstance', 
                                    'i18nFilter', 
                                    'model'];

    function advancedSearchController($rootScope, 
                                      $scope, 
                                      $modalInstance, 
                                      i18n, 
                                      model) {
        var controller = this;
        
        $scope.status = {
           isFirstOpen: true,
           open: true
        };

        controller.model = JSON.parse(JSON.stringify(model));

        controller.apply = function () {
            if (controller.model.variation.start === undefined || controller.model.variation.start === "") {
                controller.model.variation.start = 0.0;
            } else {
                controller.model.variation.start = parseFloat(controller.model.variation.start.replace(",", "."));
            }
            if (controller.model.variation.end === undefined || controller.model.variation.end === "") {
                controller.model.variation.end = 0.0;
            } else {
                controller.model.variation.end = parseFloat(controller.model.variation.end.replace(",", "."));
            }
            
            $modalInstance.close(controller.model);
        }

        controller.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    };

    index.register.controller('mcs.realforecastedcost.advancedsearch.controller', advancedSearchController);
});