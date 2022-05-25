define(['index'], function(index) {

	/**
	 * Controller Detail
	 */
	observacaoExecucaoCtrl.$inject = [
		'$rootScope',
		'$scope',
		'TOTVSEvent',
    '$modalInstance',
    'fchmip.programacao.Factory',
    'model'
	];

	function observacaoExecucaoCtrl($rootScope,
                                $scope,
                                TOTVSEvent,
                                $modalInstance,
                                programacaoFactory,
                                model) {
		
    var observacaoExecucaoCtrl = this;
        observacaoExecucaoCtrl.sprint = model;
		
		observacaoExecucaoCtrl.init = function() {
    }
    
    observacaoExecucaoCtrl.executar = function(){
          

        if (observacaoExecucaoCtrl.model === undefined){
          observacaoExecucaoCtrl.sprint.ttSprint.observacao = '';
        }else{
          observacaoExecucaoCtrl.sprint.ttSprint.observacao = observacaoExecucaoCtrl.model['des-obs'];
        }

        var parametrosExecutar = {
          'ttOrdemPeriodo' : observacaoExecucaoCtrl.sprint.ttOrdemPeriodo,
          'ttSprint'       : observacaoExecucaoCtrl.sprint.ttSprint,
          'ttProgramacao'  : observacaoExecucaoCtrl.sprint.ttProgramacao
        };  
       programacaoFactory.executarPeriodo(parametrosExecutar, parametrosExecucaoCallback);
    }
    
		var parametrosExecucaoCallback = function(result) {
      if (result.ttSprint["0"].situacao === 3) {
        $modalInstance.close('cancel');
      } else {
        $modalInstance.dismiss('cancel');
      }
		}

    observacaoExecucaoCtrl.fechar = function(){
    
      $modalInstance.dismiss('cancel');
    }
    
    if ($rootScope.currentuserLoaded) {
      observacaoExecucaoCtrl.init();
		}
		
    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
      controller.init();
    });
	}

	index.register.controller("mmi.sprint.ObservacaoExecucaoCtrl", observacaoExecucaoCtrl);
});
