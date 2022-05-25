define(['index'
], function (index) {

    contactMaintenanceModalController.$inject = ['$scope', '$modalInstance', 'totvs.utils.Service', 
                'personMaintenanceController', 'contactToEdit', 'contactIndex'];
    function contactMaintenanceModalController($scope, $modalInstance, totvsUtilsService, 
                personMaintenanceController, contactToEdit, contactIndex) {

        var _self = this;
        $scope.controller = personMaintenanceController;
        
        this.init = function(){  
            personMaintenanceController.originalContact = angular.copy(personMaintenanceController.contact);
            totvsUtilsService.focusOn('tipoContato');
        };
        
        this.saveContact = function(){
            var retorno = personMaintenanceController.addContact();
            
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
            personMaintenanceController.originalContact = undefined;
            personMaintenanceController.doRemoveContact(contactToEdit, contactIndex + 1, true);
            $modalInstance.close();
        };
        
        this.cancel = function () {
            //limpa o contato da area de edicao e fecha o modal
            personMaintenanceController.afterAddContact();
            $modalInstance.dismiss('cancel');
        };

        $scope.$watch('$viewContentLoaded', function() {
            _self.init();
        });
    }
    index.register.controller('hvp.contactMaintenanceModalController', contactMaintenanceModalController);
});
