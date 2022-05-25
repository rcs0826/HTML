define(['index',
        '/dts/hgp/html/hcg-professional/professionalZoomController.js'
], function (index) {

    movementMaintenanceModalController.$inject = ['$scope', '$modalInstance', 'totvs.utils.Service', 
                'documentMaintenanceController', 'movementToEdit', 'movtoIndex'];
    function movementMaintenanceModalController($scope, $modalInstance, totvsUtilsService, 
                documentMaintenanceController, movementToEdit, movtoIndex) {

        var _self = this;
        $scope.controller = documentMaintenanceController;
        
        this.init = function(){  
            documentMaintenanceController.originalMovement = angular.copy(documentMaintenanceController.movement);
            //totvsUtilsService.focusOn('movementZoom');
        };
        
        this.saveMovement = function(){
            var retorno = documentMaintenanceController.addMovementItem();
            
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
            documentMaintenanceController.originalMovement = undefined;
            documentMaintenanceController.doMovementElimination(movementToEdit, movtoIndex + 1, true);
            $modalInstance.close();
        };
        
        this.cancel = function () {
            //limpa o movimento da area de edicao e fecha o modal
            documentMaintenanceController.afterAddMovement();
            $modalInstance.dismiss('cancel');
        };

        $scope.$watch('$viewContentLoaded', function() {
            _self.init();
        });
    }
    index.register.controller('hrc.movementMaintenanceModalController', movementMaintenanceModalController);
});
