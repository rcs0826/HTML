define(['index'
], function (index) {

    factoryLotationMaintenanceModalController.$inject = ['$scope', '$modalInstance', 'totvs.utils.Service', 
                'beneficiaryLotationMaintenanceController', 'factoryLotationToEdit', 'factoryIndex'];
    function factoryLotationMaintenanceModalController($scope, $modalInstance, totvsUtilsService, 
                beneficiaryLotationMaintenanceController, factoryLotationToEdit, factoryIndex) {


        var _self = this;
        $scope.controller = beneficiaryLotationMaintenanceController;    

        this.init = function(){  
            //totvsUtilsService.focusOn('factoryLotationZoom');
        };
        
        this.savefactoryLotation = function(){
            var retorno = beneficiaryLotationMaintenanceController.addFactoryLotation();        

            if(retorno == true){                
                beneficiaryLotationMaintenanceController.doRemoveFactoryLotation(factoryLotationToEdit, factoryIndex + 1, true);
                $modalInstance.close();
            }
        };
        
        this.cancel = function () {
            //limpa o movimento da area de edicao e fecha o modal
            $modalInstance.dismiss('cancel');
        };

        $scope.$watch('$viewContentLoaded', function() {
            _self.init();
        });
    }
    index.register.controller('hvp.factoryLotationMaintenanceModalController', factoryLotationMaintenanceModalController);
});
