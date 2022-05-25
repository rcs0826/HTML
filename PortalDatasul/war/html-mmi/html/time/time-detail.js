define(['index'], function(index) {
	
	/**
	 * Controller Detail
	 */

	timeDetailCtrl.$inject = [
		'$rootScope', 
		'$scope',
		'$stateParams', 
		'$state',
		'totvs.app-main-view.Service',
		'mmi.bomn00306.Service',
        'TOTVSEvent'
	];
	
	function timeDetailCtrl($rootScope,
								$scope, 								
								$stateParams, 
								$state,
							    appViewService,
							    bomn00306Service,
                                TOTVSEvent) {

		controller = this;
				
		// *************************************************************************************
		// *** Functions
		// *************************************************************************************
		
		controller.init = function() {
			if (appViewService.startView($rootScope.i18n('l-hour-type'), 'mmi.time.DetailCtrl', controller)) {             
			}
			      	
            if ($stateParams && $stateParams.id) {
                this.load($stateParams.id);
            }            
		}
		
		controller.load = function(id) {

            controller.model = {};

			bomn00306Service.getRecord(id, function(record) {
	            if (record) {
                    controller.model = record;	
	            }
	        });
		}

		controller.delete = function(record) {
	        $rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question', 
	            text: $rootScope.i18n('l-confirm-delete-record', record['cod-tip-hora']),
	            cancelLabel: 'l-no', 
	            confirmLabel: 'l-yes', 	            
	            callback: function(isPositiveResult) { 
	                if (isPositiveResult) { 
	                     
	                    bomn00306Service.deleteRecord(record['cod-tip-hora'], function(result) {
	                    	
	                    	if (!result.$hasError) {	                                 
								$rootScope.$broadcast(TOTVSEvent.showNotification, {
									type: 'success', 
									title: $rootScope.i18n('msg-record-deleted'), 
									detail: $rootScope.i18n('msg-record-success-deleted') 
								});	   
								
								$state.go('dts/mmi/time.start');
	                        }
	                    });
	                }
	            }
	        });
	    }

	    if ($rootScope.currentuserLoaded) { this.init(); }
	     
	    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
	        controller.init();
	    });
						
	}
	
	index.register.controller('mmi.time.DetailCtrl', timeDetailCtrl);
	
});
