define(['index'], function (index) {

advancedSearchController.$inject = ['$scope',
                                    '$modalInstance',
                                    'model'];

    function advancedSearchController($scope,
                                      $modalInstance,
                                      model) {
        var controller = this;
        
        $scope.status = {
           open: true
        };

        controller.model = JSON.parse(JSON.stringify(model));

        controller.apply = function () {

            // força '' quando uma propriedade for null ou undefined
            // acontece quando usa o botao limpar do campo
            for (property in controller.model) {
                controller.model[property] = controller.model[property] ? controller.model[property] : '';
            }
            
            $modalInstance.close(controller.model);
        }

        controller.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    };

    index.register.controller('mpl.changedsalesorder.advancedsearch.controller', advancedSearchController);
});