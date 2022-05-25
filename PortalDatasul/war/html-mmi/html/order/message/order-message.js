define([
    'index'
], function(index){

	orderMessageCtrl.$inject = [
		'$modalInstance',
	    '$scope',
	    '$rootScope',
	    'TOTVSEvent',
		'model',
	];

    function orderMessageCtrl ($modalInstance,
					           $scope,
					           $rootScope,
					           TOTVSEvent,
					           model) {

        var messageCtrl = this;
        
        // *************************************************************************************
		// *** Functions
		// *************************************************************************************
                    
        messageCtrl.init = function() {
        	messageCtrl.model = model;
        }
        
        messageCtrl.cancel = function () {
            $modalInstance.dismiss();
        }
        
        if ($rootScope.currentuserLoaded) { 
        	messageCtrl.init(); 
        }
            
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
        });	

        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            $modalInstance.dismiss('cancel');
        });
    }

    index.register.controller('mmi.order.MessageCtrl', orderMessageCtrl);
});