define(['index'], function(index) {

	/**
	 * Controller Detail
	 */
	observacaoEncerramentoCtrl.$inject = [
		'$rootScope',
		'$scope',
		'TOTVSEvent',
    '$modalInstance',
    'fchmip.dashboard.Factory',
    'model',
    '$timeout'
	];

	function observacaoEncerramentoCtrl($rootScope,
                                $scope,
                                TOTVSEvent,
                                $modalInstance,
                                dashboardFactory,
                                model,
                                $timeout) {
		
    var observacaoEncerramentoCtrl = this;                                          
        observacaoEncerramentoCtrl.sprint = model;
        observacaoEncerramentoCtrl.model = {};
		
		observacaoEncerramentoCtrl.init = function() {

      observacaoEncerramentoCtrl.model.checkbox = true;
      setFocus();
      observacaoEncerramentoCtrl.model['des-obs'] = observacaoEncerramentoCtrl.sprint.ttSprint["0"].observacao;
    }

    var setFocus = function() {
      $timeout(function() {
        $('#observacao').find('*').filter(':input:visible:first').focus();
        },500);
    }
    
    observacaoEncerramentoCtrl.encerrarPeriodo = function(){                 
      
        if (observacaoEncerramentoCtrl.model === undefined){
          observacaoEncerramentoCtrl.sprint.ttSprint["0"].observacao = '';
        }else{
          observacaoEncerramentoCtrl.sprint.ttSprint["0"].observacao = observacaoEncerramentoCtrl.model['des-obs'];
        }

        var parametros = {
          'ttSprint'  : observacaoEncerramentoCtrl.sprint.ttSprint,
          'encerraImpedimento' : observacaoEncerramentoCtrl.model.checkbox          
       }; 

       dashboardFactory.encerrarPeriodo(parametros, encerrarPeriodoCallback);
    }
    
		var encerrarPeriodoCallback = function(result) {
      if (!result.hasError) {								

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
		      type: 'success',
          title: $rootScope.i18n('l-period-shut'),
					detail: $rootScope.i18n('msg-period-shut')				
				});

				$modalInstance.close('cancel');
      }	
		}

    observacaoEncerramentoCtrl.fechar = function(){    
      $modalInstance.dismiss('cancel');
    }
    
    if ($rootScope.currentuserLoaded) {
      observacaoEncerramentoCtrl.init();
    }
    
    $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {		 
      $modalInstance.dismiss('cancel');
    });
		
    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
      controller.init();
    });
	}

	index.register.controller("mmi.sprint.dashboard.ObservacaoEncerramentoCtrl", observacaoEncerramentoCtrl);
});
