define(['index'], function(index) {

    acceptController.$inject = [	                              
    	'$rootScope',	         
    	'$scope',
    	'$modalInstance',
    	'model',
    	'TOTVSEvent',
        'fchmip.fchmiporder.Factory'];

    function acceptController($rootScope, 
   							   $scope,
							   $modalInstance,
							   model,
							   TOTVSEvent,
                               fchmiporder) {

        var acceptController = this;

        // *********************************************************************************
        // *** Funções
        // *********************************************************************************
        
        acceptController.init = function() {            
            acceptController.model = angular.copy(model);
        }
        
    	acceptController.salvar = function() {
            var params = {
                'pNrOrdProdu': acceptController.model.task['nr-ord-produ'],
                'pCdTarefa': acceptController.model.task['cd-tarefa'],
                'pSitAceite': acceptController.model.task['sit-aceite'],
                'pObsAceite': acceptController.model.task['obs-aceite']
            }

    		fchmiporder.realizarAceiteTarefa(params, realizarAceiteTarefaCallback); 
        }

        var realizarAceiteTarefaCallback = function(result) {
            if (result) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'success',
                    title: $rootScope.i18n('l-accept'),
                    detail: $rootScope.i18n('msg-success-task-update')
                });
                
                model.task['sit-aceite'] = acceptController.model.task['sit-aceite'];
                model.task['obs-aceite'] = acceptController.model.task['obs-aceite'];

                if (model.task['sit-aceite']) {
                    model.task['_']['sit-aceite'] = $rootScope.i18n('l-yes');
                } else {
                    model.task['_']['sit-aceite'] = $rootScope.i18n('l-no');
                }

                $modalInstance.close();
            }
        }

        acceptController.close = function () {
            $modalInstance.close();
        }
        
        acceptController.cancel = function () {
        	$modalInstance.dismiss();
        }
    	
    	// *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************                
         
        if ($rootScope.currentuserLoaded) { acceptController.init(); }
        
        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {		 
    	    $modalInstance.dismiss('cancel');
        });
        
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            acceptController.init();
        });
    }

    index.register.controller('mmi.order.acceptCtrl', acceptController);
});