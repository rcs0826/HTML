define([
    'index'
], function(index){

	orderCloseCtrl.$inject = [
		'$modalInstance',
	    '$scope',
	    '$rootScope',
	    '$filter',
	    'TOTVSEvent',
		'model',
		'fchmip.fchmiporder.Factory',
		'helperOrder'
	];

    function orderCloseCtrl ($modalInstance,
					         $scope,
					         $rootScope,
					         $filter,
					         TOTVSEvent,
					         model,
							 fchmiporder,
							 helperOrder) {

        var closeCtrl = this;
		closeCtrl.hifen = " - ";
		closeCtrl.valorDeLeitura = 0;
        
        // *************************************************************************************
		// *** Functions
		// *************************************************************************************
                    
        closeCtrl.init = function() {

			closeCtrl.model = model;
			closeCtrl.traducao = [];
			closeCtrl.traducao.push($rootScope.i18n('l-counter'));
			closeCtrl.traducao.push($rootScope.i18n('l-utility'));
			
			closeCtrl.tipoControle = [
				{ value: '1', label: closeCtrl.traducao[0], disabled: false },
				{ value: '2', label: closeCtrl.traducao[1], disabled: false }
			];

        	closeCtrl.params = {
				"i-ordem": model.order["nr-ord-produ"],
				"da-dt-base": new Date(),
				"c-cd-tecnico": "",
				"l-oc-pend": false,
				"l-req-pend": false,
				"l-aceite": false,
				"estado-pred": 0,
				"narrativa-pad": model.order.narrativa,
				"l-tarefa": true,
				"tipoApontamento": model.order.tipoApontamento,
				"apontamento": 0.0000,
				"valorLeitura": 0.0000
			};

			closeCtrl.valorDeLeitura = closeCtrl.params.valorLeitura;

			closeCtrl.buscaTecnicos();
			closeCtrl.buscaContadorAcumulado();
		}

		closeCtrl.filterTechnician = function(input){
			closeCtrl.listOfTechnician = $filter('filter')(closeCtrl.listOfTechnicianAux, {$:input});
		}		

		closeCtrl.onChangeData = function(){
	        if (closeCtrl.params['da-dt-base'] == null || closeCtrl.params['da-dt-base'] == undefined) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-invalid-date')
				});
				return;
			}
	        
	        if (closeCtrl.model.order.tipoControle > 1) {
	        	closeCtrl.buscaContadorAcumulado();
	        }
		}

		closeCtrl.buscaContadorAcumulado = function(){
			var params = {
				'equipamento': model.order['cd-equipto'],
				'dataEncerramento': closeCtrl.params['da-dt-base']
			}

			fchmiporder.buscaContadorAcumulado(params, buscaContadorCallback);
		}
		
		var buscaContadorCallback = function(result){
			if (closeCtrl.model.order.tipoApontamento == 1){
				closeCtrl.params.apontamento = result.contador;
				closeCtrl.contadorAcumulado  = result.contadorAcumulado;
			} else if (closeCtrl.model.order.tipoApontamento == 2){
				closeCtrl.contadorAcumulado  = result.contadorAcumulado;
			}
		}
			
		closeCtrl.buscaTecnicos = function(){
			var params = {'nrOrdem': model.order["nr-ord-produ"],
						  'cdTarefa': 0};
	  
			fchmiporder.getTecnicoDados(params, function(result){				
				if (result) {

					closeCtrl.listOfTechnician = [];

					angular.forEach(result.ttListTecnico, function (value) {
		
						closeCtrl.listOfTechnician.push(value);
						closeCtrl.listOfTechnicianAux = closeCtrl.listOfTechnician;
					});
				}
			});
		}

	    closeCtrl.closeOrder = function() {
        	var hoje = new Date();
        	
        	if (!validaPlanoUtilizacao()) return;
        	
        	if (!validaData()) return;
        	
			if (closeCtrl.params['da-dt-base'] < closeCtrl.model.order['dt-manut']) {
	        	$rootScope.$broadcast(TOTVSEvent.showQuestion, {
                    title: 'l-question',
                    text: $rootScope.i18n('msg-close-order-date-validate'),
                    cancelLabel: 'l-no',
                    confirmLabel: 'l-yes',
                    callback: function(isPositiveResult) {
                    	if (isPositiveResult) {
                    		fchmiporder.validaDataMedio(closeCtrl.params, validaDataMedioCallback);
                    	}
                    }
                });
			} else if (closeCtrl.params['da-dt-base'] > hoje) {
        		$rootScope.$broadcast(TOTVSEvent.showQuestion, {
                    title: 'l-question',
                    text: $rootScope.i18n('msg-close-order-validate'),
                    cancelLabel: 'l-no',
                    confirmLabel: 'l-yes',
                    callback: function(isPositiveResult) {
                    	if (isPositiveResult) {
                    		fchmiporder.validaDataMedio(closeCtrl.params, validaDataMedioCallback);
                    	}
                    }
                });
        	} else {
        		fchmiporder.validaDataMedio(closeCtrl.params, validaDataMedioCallback);
			}
        }
	    
	    var validaDataMedioCallback = function(result) {
	    	if (result) {
	    		if (result.medioFechado) {
	    			var msgParams = [];
	    			msgParams.push($filter('orderNumberMask')(closeCtrl.params['i-ordem']));
	    			msgParams.push($filter('date')(closeCtrl.params['da-dt-base'], 'dd/MM/yyyy'));
	    			msgParams.push($filter('date')(result.dataMedio, 'dd/MM/yyyy'));
	    				
	    			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
	                    title: 'l-question',
	                    text: $rootScope.i18n('msg-close-order-batch-date', msgParams),
	                    cancelLabel: 'l-no',
	                    confirmLabel: 'l-yes',
	                    callback: function(isPositiveResult) {
	                    	if (isPositiveResult) {
	                    		fchmiporder.closeOrder(closeCtrl.params, closeOrderCallback);
	                    	}
	                    }
	                });
	    		} else {
	    			if (result.ttOrdem !== undefined) {
		    			closeCtrl.model.result = result.ttOrdem[0];
		    			closeOrderCallback(result);
	    			}
	    		}
	    	}
	    }

        var closeOrderCallback = function(result) {
        	if (result) {        		
        		if (result.length > 0) {
            		closeCtrl.model.result = result[0];
        		}

        		$rootScope.$broadcast(TOTVSEvent.showNotification, {
		            type: 'success',
                    title: $rootScope.i18n('msg-order-close'),
                    detail: $rootScope.i18n('msg-order-close-success', $filter('orderNumberMask')(closeCtrl.model.result['nr-ord-produ']))
		        });

        		$modalInstance.close();
        	}
        };
        
        var validaPlanoUtilizacao = function() {
        	var hoje = new Date();

			if (closeCtrl.model.order.tipoControle != 1 && closeCtrl.model.order['cd-manut']){

				if (closeCtrl.params['da-dt-base'] > hoje){
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('l-attention'),
						detail: $rootScope.i18n('l-date-invalid')
					});
					return false;
				}
					
				if (closeCtrl.isInvalidForm()){
					return false;
				}

				closeCtrl.params['c-cd-tecnico'] = closeCtrl.userTechnician.cdTecnico;
				closeCtrl.params.tipoControle    = model.order.tipoApontamento;
			}

	        return true;
        }
        
        var validaData = function() {
        	if (closeCtrl.params['da-dt-base'] == null || closeCtrl.params['da-dt-base'] == undefined) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-invalid-date')
				});

				return false;
			}
        	
        	return true;
        }
        
        closeCtrl.isInvalidForm = function() {	         
	        var messages = [];
	        var isInvalidForm = false;
	        
	        if (closeCtrl.userTechnician == undefined) {
	        	isInvalidForm = true;
	            messages.push('l-technician');
	        }
			
			if (closeCtrl.params.apontamento === undefined || closeCtrl.params.apontamento === "") {
	        	isInvalidForm = true;
	            messages.push('l-counter');
	        }
			
			if (isInvalidForm) {
                angular.forEach(messages, function(item) {
                  var warning = '';
                  warning = $rootScope.i18n('l-field');
                  warning = warning + ' ' + $rootScope.i18n(item);
                  warning = warning + ' ' + $rootScope.i18n('l-is-required');
                  $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error',
                        title: $rootScope.i18n('l-attention'),
                        detail: warning
                    });
                });
            }
            return isInvalidForm;
		}
		
		closeCtrl.onChangeValorLeitura = function(){

			if (closeCtrl.valorDeLeitura == closeCtrl.params.valorLeitura){
				return;
			}

			var params = {
				"codInspecao": closeCtrl.model.order['cd-inspecao'],
				"valorLeitura": closeCtrl.params.valorLeitura
			}

			fchmiporder.validaFaixaInspecao(params, validaFaixaInspecaoCallBack);

			closeCtrl.valorDeLeitura = closeCtrl.params.valorLeitura;
		}

		var validaFaixaInspecaoCallBack = function(result){
			if (result){
				if (result.foraDaFaixa){
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('l-attention'),
						detail: $rootScope.i18n('msg-invalid-reading-value')
					});
				}
			}
		}
		

        closeCtrl.cancel = function () {
            $modalInstance.dismiss();
        }

        if ($rootScope.currentuserLoaded) { 
        	closeCtrl.init(); 
        }

        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
        });	

        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            $modalInstance.dismiss('cancel');
        });
    }

    index.register.controller('mmi.order.CloseCtrl', orderCloseCtrl);
});