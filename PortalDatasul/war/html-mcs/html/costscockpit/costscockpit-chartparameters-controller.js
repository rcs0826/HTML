define(['index'], function (index) {

    controllerAdvancedSearch.$inject = [ '$rootScope', '$scope', '$modalInstance', 'parameters' ];

    function controllerAdvancedSearch($rootScope, $scope, $modalInstance, parameters) {
        var self = this;

        self.actTypes = [];
        
        self.apply = function () {
            
            self.prepareParams();

            $modalInstance.close({parametros: self.param}); // fecha modal retornando parametro
        }

        self.prepareParams = function() {
            
            self.param = {dtTrans: self.model.dtTrans,
                          selectedActTypes: self.model.selectedActTypes};
        }

        self.setDefaultsParameter = function () {
            
            self.actTypes = parameters.actTypes;
            self.model.dtTrans = parameters.dtTrans;
            self.model.selectedActTypes = parameters.selectedActTypes;
        }
        
        self.cancel = function () {
            $modalInstance.dismiss('cancel'); // fecha modal sem retornar parametros
        }

        self.init = function () {
            self.model = {};

            self.setDefaultsParameter();
        }

        self.init();
        
        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {  
             $modalInstance.dismiss('cancel');
        });
    };

    index.register.controller('mcs.costscockpit.chartparameters.controller', controllerAdvancedSearch);
});