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

        controller.periods = [{value: 1, label: i18n('l-daily', [], 'dts/mdb')},
                              {value: 2, label: i18n('l-weekly', [], 'dts/mdb')},
                              {value: 3, label: i18n('l-monthly', [], 'dts/mdb')}];

        controller.apply = function () {
            $modalInstance.close(controller.model);
        }

        controller.cancel = function () {
            $modalInstance.dismiss('cancel');
        }

        $scope.$on('$stateChangeStart', function () {
            $modalInstance.dismiss('cancel');
        }); 
    };

    index.register.controller('mdb.itemcalculationstatement.parameters.controller', parametersController);
});