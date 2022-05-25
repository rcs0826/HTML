define(['index'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER 
    // *************************************************************************************
    genericConfigController.$inject = ['$scope', '$modalInstance', '$injector', 'global.userConfigs.Factory', 
                '$rootScope', '$timeout' , 'programName', 'config', 'extensionFunctions'];
    function genericConfigController($scope, $modalInstance, $injector, userConfigsFactory, 
            $rootScope, $timeout, programName, config, extensionFunctions) {

        var _self = this;
        _self.config = config;

        this.init = function(){
            if(extensionFunctions){
                $.extend(this, extensionFunctions);    
            }
        };

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        
        this.onSaveClick = function(){
            $timeout(function(){
                $('.submitButton').click();
            });
        };

        this.saveConfiguration = function () {
            
            userConfigsFactory.saveUserConfiguration(
                    $rootScope.currentuser.login, programName,
                    _self.config,
                function(result){
                    if(result){
                        $modalInstance.close(_self.config);
                    }
                });
            
        };

        // *********************************************************************************
        // *** Events Listeners
        // *********************************************************************************
        $scope.$watch('$viewContentLoaded', function () {
            _self.init();
        });
    }

    index.register.controller('global.genericConfigController', genericConfigController);
});

