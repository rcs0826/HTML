define(['index'], function(index) {

	/**
	 * Controller Detail
	 */
	informacaoPeriodoCtrl.$inject = [
		'$rootScope',
		'$scope',
		'TOTVSEvent',
    '$modalInstance',
    'model'
	];

	function informacaoPeriodoCtrl($rootScope,
                                $scope,
                                TOTVSEvent,
                                $modalInstance,
                                model) {
		
    var informacaoPeriodoCtrl = this;
    informacaoPeriodoCtrl.period = model;
		
		informacaoPeriodoCtrl.init = function() {
      console.log(informacaoPeriodoCtrl.period);
    }

    informacaoPeriodoCtrl.fechar = function(){
      $modalInstance.close('cancel');
    }
    
    if ($rootScope.currentuserLoaded) {
      informacaoPeriodoCtrl.init();
		}
		
    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
      controller.init();
    });
	}

	index.register.controller("mmi.sprint.dashboard.InformacaoPeriodoCtrl", informacaoPeriodoCtrl);
});
