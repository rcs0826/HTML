define(['index'], function(index) {

	/**
	 * Controller Detail
	 */
	informacaoSprintCtrl.$inject = [
		'$rootScope',
		'$scope',
		'TOTVSEvent',
    '$modalInstance',
    'model'
	];

	function informacaoSprintCtrl($rootScope,
                                $scope,
                                TOTVSEvent,
                                $modalInstance,
                                model) {
		
    var informacaoSprintCtrl = this;
    informacaoSprintCtrl.sprint = model;
		
		informacaoSprintCtrl.init = function() {
		}

    informacaoSprintCtrl.fechar = function(){
      $modalInstance.close('cancel');
    }
    
    if ($rootScope.currentuserLoaded) {
      informacaoSprintCtrl.init();
		}
		
    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
      controller.init();
    });
	}

	index.register.controller("mmi.sprint.dashboard.InformacaoSprintCtrl", informacaoSprintCtrl);
});
