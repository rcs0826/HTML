define(['index'], function(index) {
	
	/**
	 * Controller Edit
	 */
	timeEditCtrl.$inject = [
		'$rootScope', 
		'$scope', 
		'$stateParams', 
		'$window', 
		'$location',
		'$state',
		'totvs.app-main-view.Service',
		'mmi.bomn00306.Service',
		'TOTVSEvent',
		'$timeout'
	];
	
	function timeEditCtrl($rootScope, 
						   $scope, 
						   $stateParams, 
						   $window, 
						   $location,
						   $state,
						   appViewService,
						   bomn00306Service,
						   TOTVSEvent,
						   $timeout) {
	
		/**
		 * Variável Controller
		 */
		var controller = this;
		controller.model = {};

	    controller.saveNewDisabled;
	    var breadcrumbTitle;
	    var headerTitle;
		controller.isSaveNew = false;	 
		
	    // *********************************************************************************
	    // *** Functions
	    // *********************************************************************************
		
		controller.init = function() {
	
	        if (appViewService.startView($rootScope.i18n('l-hour-type'), 'mmi.time.EditCtrl', controller)) {          
	        }
	         
			defineTipoAcao();
			controlaRadioSets();
		}
		
        controller.load = function(id) {			
			
	        bomn00306Service.getRecord(id, function(result) {
	            controller.model = result;
				$("input[id^='des-tip-hora']").focus();
				controller.headerTitle = controller.model['cod-tip-hora'] + " - " + controller.model['des-tip-hora'];
			});
		}

		var defineTipoAcao = function(){
			if ($stateParams && $stateParams.id) { //editar
	            controller.load($stateParams.id);	            
	            controller.breadcrumbTitle = $rootScope.i18n('l-edit');
	            controller.saveNewDisabled = true;
	        } else { //adicionar
				controller.model = {};       
	            controller.headerTitle = $rootScope.i18n('l-add');
	            controller.breadcrumbTitle = controller.headerTitle;
				controller.saveNewDisabled = false;
				controller.model['idi-tip-hora'] = 1;
				controller.model['idi-tip-val'] = 1;
				setFocus();
	        }
		}

		var controlaRadioSets = function(){
			controller.optionsRadioTipoHora = [{value: 1, label: $rootScope.i18n('l-increase')},
											   {value: 2, label: $rootScope.i18n('l-decrease')}];

			controller.optionsRadioTipoValor = [{value: 1, label: $rootScope.i18n('l-hours')},
												{value: 2, label: $rootScope.i18n('l-percentage')}];																				
		}
         
	    controller.save = function() {
	         
	        if ($state.is('dts/mmi/time.edit')) {         
				if(!controller.model['des-tip-hora']){
					controller.model['des-tip-hora'] = '';
				}
				
	            bomn00306Service.updateRecord(controller.model['cod-tip-hora'], controller.model, function(result) {	            	
	                controller.onSaveUpdate(true, result);	            	
	            });
	        } else { 
	            bomn00306Service.saveRecord(controller.model, function(result) {	            	
	                controller.onSaveUpdate(false, result);	            	
	            });
	        }
	        
	        controller.isSaveNew = false;
	    }
	       
	    controller.saveNew = function() {
	    	controller.save();
	    	controller.isSaveNew = true;
	    }
	    
	    controller.onSaveUpdate = function(isUpdate, result) {	    	
	    	if (!result.$hasError) {	    		

	    		if (controller.isSaveNew === true) {
			        controller.init();
			        setFocus();
		    	} else {
		    		controller.redirectToDetail();
		    	}
		     
		        $rootScope.$broadcast(TOTVSEvent.showNotification, {
		            type: 'success',
		            title: (isUpdate ? $rootScope.i18n('msg-record-updated') : $rootScope.i18n('msg-record-created')),
		            detail: (isUpdate ? $rootScope.i18n('msg-record-success-updated') : $rootScope.i18n('msg-record-success-created'))
		        });
	    	}
	    }
	    
	    controller.cancel = function() {
	        $rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question',
	            text: $rootScope.i18n('l-cancel-operation'),
	            cancelLabel: 'l-no',
	            confirmLabel: 'l-yes',
	            callback: function(isPositiveResult) {
					if (isPositiveResult) { 
						$location.path('/dts/mmi/time');
	                }
	            }
	        });
	    }
		 	         
	    controller.redirectToDetail = function() {
	        $location.path('/dts/mmi/time/detail/' + controller.model['cod-tip-hora']);
		}

	    var setFocus = function() {
	    	$timeout(function() {
	    		$('#cod-tip-hora').find('*').filter(':input:visible:first').focus();
	        },500);
	    }
	     	     
	    if ($rootScope.currentuserLoaded) { 
			controller.init(); 
		}
	     	    
	    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
	        controller.init();
	    });
	}
	
	index.register.controller('mmi.time.EditCtrl', timeEditCtrl);
		
});