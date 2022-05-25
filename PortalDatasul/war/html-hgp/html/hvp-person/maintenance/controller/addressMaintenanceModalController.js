define(['index'
], function (index) {

    addressMaintenanceModalController.$inject = ['$scope', '$modalInstance', 'totvs.utils.Service', 
                'personMaintenanceController', 'addressToEdit', 'addressIndex'];
    function addressMaintenanceModalController($scope, $modalInstance, totvsUtilsService, 
                personMaintenanceController, addressToEdit, addressIndex) {

        var _self = this;
        $scope.controller = personMaintenanceController;
        
        this.init = function(){  
            personMaintenanceController.loadUfs();
            personMaintenanceController.originaladdress = angular.copy(personMaintenanceController.address);
            //totvsUtilsService.focusOn('addressZoom');
        };
        
        this.saveaddress = function(){
            var retorno = personMaintenanceController.addAddress(true);
            
            //se eh retonro do $timeout tem que tratar diferente
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
        
        this.onEditSuccess = function(){
            personMaintenanceController.originalAddress = undefined;
            personMaintenanceController.doAddressElimination(addressToEdit, addressIndex + 1, true);
            $modalInstance.close();
        };
        
        this.cancel = function () {
            //limpa o endereco da area de edicao e fecha o modal
//            documentMaintenanceController.afterAddaddress();
            $modalInstance.dismiss('cancel');
        };

        $scope.$watch('$viewContentLoaded', function() {
            _self.init();
        });
    }
    index.register.controller('hvp.addressMaintenanceModalController', addressMaintenanceModalController);
});
