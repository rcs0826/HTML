define([
    'index'
], function(index){


	orderSuspendCtrl.$inject = [
		'$modalInstance',
	    '$scope',
	    '$rootScope',
	    '$filter',
	    'TOTVSEvent',
		'model',
		'fchmip.fchmiporder.Factory',
	    '$timeout'];

    function orderSuspendCtrl (
	        $modalInstance,
	        $scope,
	        $rootScope,
	        $filter,
	        TOTVSEvent,
	        model,
			fchmiporder,
		    $timeout) {

        var suspendCtrl = this;
        
        /* Utilizado para controlar o botão de Supender/Reativar da tela order.suspend.html */
	    suspendCtrl.estadoOm = model['estado-om'];
        
            				
		/** Realiza a Suspensao da Ordem */
		this.suspend = function(){	
		   
			if (suspendCtrl.isInvalidSuspend()) {
                return;
            }
			
			parameters = {
                	'nr-ord-produ': model["nr-ord-produ"],
                	'transacao' : parseInt("1"),
                	'cd-tarefa' : parseInt("0"), 
	                'cd-pend-padr': suspendCtrl.pendenciaPadrao["cd-pend-padr"],
	                'narrativa' : suspendCtrl.narrativa
    			}
            
            fchmiporder.suspendOrder(parameters, function(result){
	    		
	    		if (result) {
					if (result.length > 0) {
						var nrOrderMasked = $filter('orderNumberMask')(String(model["nr-ord-produ"]));
				        $rootScope.$broadcast(TOTVSEvent.showNotification, {
				        	type: 'success',
				            title: $rootScope.i18n('msg-order-suspend'),
				            detail: $rootScope.i18n('msg-success-order-suspended-number', nrOrderMasked)
				        });
						model["estado-om"] = result[0]["estado-om"];
						$modalInstance.close();
					}
	            }
	    	});    	       
		}
		
		
		/**
		 * Realiza a Reativação da Ordem
		 */
		this.reactivate = function(){
			
			parameters = {
                	'nr-ord-produ': model["nr-ord-produ"],
	                'narrativa' : suspendCtrl.narrativa
    			}
			
            fchmiporder.reactivateOrder(parameters, function(result){
            	
	    		if (result) {
					if (result.length > 0) {
						var nrOrderMasked = $filter('orderNumberMask')(String(model["nr-ord-produ"]));
				        $rootScope.$broadcast(TOTVSEvent.showNotification, {
				        	type: 'success',
				            title: $rootScope.i18n('msg-order-reactivate'),
				            detail: $rootScope.i18n('msg-success-order-reactivate-number', nrOrderMasked)
				        });
						model["estado-om"] = result[0]["estado-om"];
						$modalInstance.close();
					}
	            }
				
				
	    	});			
		}
		

		this.isInvalidSuspend= function(){

			var messages = [];
			var isInvalidForm = false;
			

			if (!suspendCtrl.pendenciaPadrao) {
                isInvalidForm = true;
                messages.push('l-holdover');
            }            

			// se for invalido, monta e mostra a mensagem
            if (isInvalidForm) {
                var warning = $rootScope.i18n('l-field');
                if (messages.length > 1) {
                    warning = $rootScope.i18n('l-fields');
                }
                angular.forEach(messages, function(item) {
                    warning = warning + ' ' + $rootScope.i18n(item) + ',';
                });
                if (messages.length > 1) {
                    warning = warning + ' ' + $rootScope.i18n('l-requireds-2');
                } else {
                    warning = warning + ' ' + $rootScope.i18n('l-required-2');
                }
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-attention'),
                    detail: warning
                });
            }	
			return isInvalidForm;
		}	

		suspendCtrl.setFocus = function() {
			$timeout(function() {
				$('#cd-pend-padr').find('*').filter(':input:visible:first').focus();
			},500);
		}

		   // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
            
        this.init = function() {
		// título que será mostrado no header de suspenção html
		 suspendCtrl.headerTitle = $filter('orderNumberMask')(String(model['nr-ord-produ'])) + " - " + model['des-man-corr'];	
		 // Setar o focu no campo pendencia
		 suspendCtrl.setFocus();
        }
        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { 
            this.init(); 
        }
            
        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************
            
        // cria um listerner de evento para inicializar o taskEditControl somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
        });	

        // ação de fechar
        this.cancel = function () {
            // dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
            $modalInstance.dismiss();
        }

        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            $modalInstance.dismiss('cancel');
        });
    }

    index.register.controller('mmi.order.SuspendCtrl', orderSuspendCtrl);

});