define(['index',
		'/dts/mmi/js/zoom/ref-item.js'], function(index) {

    suspendController.$inject = [	                              
    	'$rootScope',	         
    	'$scope',
    	'$modalInstance',
    	'model',
    	'$filter',
    	'TOTVSEvent',
        '$timeout',
        'fchmip.fchmiporder.Factory'];

    function suspendController($rootScope, 
   							   $scope,
							   $modalInstance,
							   model,
							   $filter,
							   TOTVSEvent,
                               $timeout,
                               fchmiporder) {

        var suspendController = this;

        // *********************************************************************************
        // *** Funções
        // *********************************************************************************
        
        suspendController.init = function() {
            
            suspendController.model = model;
            
            $timeout(function() {
                angular.element('#cd-pend-padr').find('*').filter(':input:visible:first').focus();
            },500);
        }
        
    	suspendController.suspende = function(){
    		suspendController.params = {
    				'nr-ord-produ': model.task["nr-ord-produ"],
                    'cd-tarefa': model.task["cd-tarefa"],
                    'cd-pend-padr': suspendController.zoomPendencia == undefined ? "" : suspendController.zoomPendencia['cd-pend-padr'],
                    'narrativa': suspendController.narrativa
    		};
    		            
    		fchmiporder.suspendeTarefa(suspendController.params, suspendeTarefaCallback); 
        }

        var suspendeTarefaCallback = function(result){
            if (result && result.logVerificaPert === true){
                $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                    title: 'l-question',
                    text: $rootScope.i18n('msg-question-avail-pert'),
                    cancelLabel: 'l-no',
                    confirmLabel: 'l-yes',
                    callback: function(isPositiveResult){
                        if(isPositiveResult){
                            suspendController.params['rowid-hist-ord-taref'] = result.cRowidHistOrdAber;
                            fchmiporder.suspendeSucessoras(suspendController.params, suspendeSucessorasCallback);
                        }
                        else {
                            suspendController.sucessNotify(result);
                        }
                        
                    }
                });
            }
            else{
                suspendController.sucessNotify(result);
            }

        }

        var suspendeSucessorasCallback = function(result){
            suspendController.sucessNotify(result);
        }

        suspendController.sucessNotify = function(result) {
            if (result && !result.$hasError) {	

                suspendController.model.atualizaSucessoras = true;

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'success',
                    title: $rootScope.i18n('msg-task-suspend'),
                    detail: $rootScope.i18n('msg-success-task-suspended-number')
                });
                suspendController.model.estadoOM = result.iEstadoOM;
                $modalInstance.close();	                  
            }
        }
       
        suspendController.reativa = function(){
        	suspendController.params = {
    				'nr-ord-produ': model.task["nr-ord-produ"],
                    'cd-tarefa': model.task["cd-tarefa"],
                    'narrativa': suspendController.narrativa
    		};
            fchmiporder.reativaTarefa(suspendController.params, reativaTarefaCallback); 
        }

        var reativaTarefaCallback = function(result){
            if (result && result.logVerificaPert === true){
            	suspendController.model.estadoOM = result.iEstadoOM;
                $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                    title: 'l-question',
                    text: $rootScope.i18n('msg-question-avail-pert-reactivate'),
                    cancelLabel: 'l-no',
                    confirmLabel: 'l-yes',
                    callback: function(isPositiveResult){
                        if(isPositiveResult){
                            suspendController.params['rowid-hist-ord-taref'] = result.cRowidHistOrdAber;
                            fchmiporder.reativaSucessoras(suspendController.params, reativaSucessorasCallback);
                        }
                        else {
                            suspendController.sucessNotifyReactivate(result);
                        }
                    }
                });
            }
            else{
                suspendController.sucessNotifyReactivate(result);
            }
        }

        var reativaSucessorasCallback = function(result){             
            suspendController.sucessNotifyReactivate(result);
        }

        suspendController.sucessNotifyReactivate = function(result) {
            if (result && !result.$hasError) {	

                suspendController.model.atualizaSucessoras = true;

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'success',
                    title: $rootScope.i18n('msg-task-reactivate'),
                    detail: $rootScope.i18n('msg-success-task-reactivated-number')
                });
                suspendController.model.estadoOM = result.iEstadoOM;
                $modalInstance.close();	                  
            }
        }

        suspendController.close = function (cancel) {
            $modalInstance.close();
        }
        
        suspendController.cancel = function (cancel) {
        	$modalInstance.dismiss();
        }
    	
    	// *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************                
         
        if ($rootScope.currentuserLoaded) { suspendController.init(); }
        
        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {		 
    	    $modalInstance.dismiss('cancel');
        });
        
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            suspendController.init();
        });
    }

    index.register.controller('mmi.order.suspendCtrl', suspendController);
});