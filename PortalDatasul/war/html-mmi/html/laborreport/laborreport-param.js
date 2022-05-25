define(['index'], function(index) {

    parametersCtrl.$inject = [
        '$rootScope',	                          
        '$scope',
        'TOTVSEvent',
        '$modalInstance',
        'model'];
  
    function parametersCtrl($rootScope,
                             $scope,
                             TOTVSEvent,
                             $modalInstance,
                             model) {

        var paramCtrl = this;

        // *************************************************************************************
		// *** Functions
		// *************************************************************************************
                    
        paramCtrl.init = function() {
        	paramCtrl.model = model;
        	paramCtrl.parametrosApontamento = true;
        	paramCtrl.parametrosEncerramento = true;
        }
        
        paramCtrl.mostraParametrosApontamento = function() {
        	paramCtrl.parametrosApontamento = !paramCtrl.parametrosApontamento;
        }
        
        paramCtrl.mostraParametrosEncerramento = function() {
        	paramCtrl.parametrosEncerramento = !paramCtrl.parametrosEncerramento;
        }
    
        paramCtrl.close = function () {
            $modalInstance.close();
        }
        
        if ($rootScope.currentuserLoaded) { 
        	paramCtrl.init(); 
        }
                      
    }

    index.register.controller('mmi.laborreport.paramCtrl', parametersCtrl);
});