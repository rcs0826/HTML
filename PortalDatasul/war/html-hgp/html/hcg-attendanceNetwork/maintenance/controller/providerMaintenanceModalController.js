define(['index'
], function (index) {

    providerMaintenanceModalController.$inject = ['$scope', '$modalInstance', 'totvs.utils.Service', 
                'attendanceNetworkMaintenanceController', 'providerToEdit', 'providerIndex'];
    function providerMaintenanceModalController($scope, $modalInstance, totvsUtilsService, 
                attendanceNetworkMaintenanceController, providerToEdit, providerIndex) {

        var _self = this;
        $scope.controller = attendanceNetworkMaintenanceController;
        
        this.init = function(){
            _self.originalProvider = angular.copy(attendanceNetworkMaintenanceController.provider);
        };
        
        this.saveMovement = function(){
            var retorno = attendanceNetworkMaintenanceController.addProvider(true);

            if(retorno.hasOwnProperty('$$timeoutId')){
                retorno.then(function(retornoAux){
                    if(retornoAux == true){
                        _self.onEditSuccess();
                    }
                });
            }else if(retorno == true){
                _self.onEditSuccess();
            }
        };
        
        this.onEditSuccess = function (argumento) {
            attendanceNetworkMaintenanceController.doRemoveProvider(providerToEdit, providerIndex + 1, true);
            $modalInstance.close();
        };

        this.cancel = function () {
            //limpa o prestador da area de edicao e fecha o modal
            attendanceNetworkMaintenanceController.provider = {};
            $modalInstance.dismiss('cancel');
        };

        $scope.$watch('$viewContentLoaded', function() {
            _self.init();
        });
    }
    index.register.controller('hcg.providerMaintenanceModalController', providerMaintenanceModalController);
});
