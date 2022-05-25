define([
	'index',
    '/dts/mcc/js/api/ccapi351.js',
    '/dts/mcc/html/currency/currency-services.js',
    '/dts/mcc/js/zoom/pedido-compr.js'
], function(index) { 

    // **************************************************************************************
	// *** CONTROLLER - DETAIL
	// **************************************************************************************
	purchaseOrderDetailController.$inject = ['$rootScope', '$scope', '$stateParams', 'totvs.app-main-view.Service', 'mcc.ccapi351.Factory', 'mcc.currency.ModalChangeCurrency', '$location', '$state', 'TOTVSEvent'];
	function purchaseOrderDetailController($rootScope, $scope, $stateParams, appViewService, purchaseOrderFactory, modalChangeCurrency, $location, $state, TOTVSEvent) {
		var purchaseOrderDetailControl = this;
		
		// *********************************************************************************
		// *** Variables
		// *********************************************************************************
        this.moeda = {    		
    		'mo-codigo' : '0'
        };
        this.opcaoConversao = 1; //Data da Cotação Fornecedor
        this.dataConversao = undefined;
        this.qtdOrdem = this.qtdRecebimento = this.qtdAlteracao = 0;
        this.numPedido = undefined;
        		
		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		/* Busca as informações do pedido de compra */
		this.load = function(numPedido, dataConv, moeda) {
            if (numPedido) {
            
                purchaseOrderFactory.purchaseOrderDetails({pNrPedido: numPedido, 
                                                           pDate: dataConv, 
                                                           pCurrency: moeda['mo-codigo']}, function(order) {                        							
                   		/* Zerar os contadores quando a requisição terminar */
                       	purchaseOrderDetailControl.qtdOrdem = purchaseOrderDetailControl.qtdRecebimento = purchaseOrderDetailControl.qtdAlteracao = 0;
						if (order[0]) {							
                            purchaseOrderDetailControl.order = order;
                            purchaseOrderDetailControl.numPedido = order[0]['num-pedido'];
                            
                        	/* Quantida de registros de cada temp-table */
                            if(order[0].ttOrdemCompra)
                        		purchaseOrderDetailControl.qtdOrdem = order[0].ttOrdemCompra.length; 
                        	if(order[0].ttRecebimento)
                        		purchaseOrderDetailControl.qtdRecebimento = order[0].ttRecebimento.length; 
                        	if(order[0].ttAltPed)
                        		purchaseOrderDetailControl.qtdAlteracao = order[0].ttAltPed.length;                         	
                        }else{
                        	purchaseOrderDetailControl.order = {};
                        	purchaseOrderDetailControl.numPedido = undefined;
                        	setTimeout(function () {
					            angular.element("#OrderZoomBox > a").trigger("click");
						    }, 100);
                        }		
                    }
                );
            }
		}

		this.applyZoom = function(order){		
			if(!order) return;
			purchaseOrderDetailControl.apply = true;
			$location.path('dts/mcc/purchaseorder/detail/' + order);
			purchaseOrderDetailControl.zoomOrder = order;			
		}

		/* Exibe a modal para efetuar a troca de moeda/opção de cotação, ao confirmar, recarrega os dados do pedido de acordo com a nova moeda*/
        this.changeCurrency = function() {
        	
            var modalInstance = modalChangeCurrency.open({
				                    moeda : purchaseOrderDetailControl.moeda,
	                                opcaoConversao : purchaseOrderDetailControl.opcaoConversao,
	                                dataConversao : purchaseOrderDetailControl.dataConversao
	                             }).then(function(result) {
	                                    purchaseOrderDetailControl.moeda          = result.moeda;
	                                    purchaseOrderDetailControl.opcaoConversao = result.opcaoConversao;
	                                    purchaseOrderDetailControl.dataConversao  = result.dataConversao;
	                                    purchaseOrderDetailControl.load(purchaseOrderDetailControl.numPedido, 
	                                                                    purchaseOrderDetailControl.dataConversao, 
	                                                                    purchaseOrderDetailControl.moeda);
		                        });
        }
		
		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************	
		this.init = function() {
			var apply = this.apply;
			createTab = appViewService.startView($rootScope.i18n('l-order-detail-title'), 'mcc.purchaseorder.DetailCtrl', purchaseOrderDetailControl);
			this.apply = apply;

			if(	createTab === false && 	        	
				(purchaseOrderDetailControl.numPedido == $stateParams.nrPedido) && !this.apply) {
				return;
			}

			if ($stateParams && $stateParams.nrPedido) {
                purchaseOrderDetailControl.numPedido = $stateParams.nrPedido;
                this.apply = false;
                this.zoomOrder = undefined;
                this.load($stateParams.nrPedido, this.dataConversao, this.moeda);
			} else {				
				if(!purchaseOrderDetailControl.zoomOrder && !purchaseOrderDetailControl.numPedido) {					
					setTimeout(function () {
			            angular.element("#OrderZoomBox > a").trigger("click");
				    }, 300);
			    }
			}		
		}
		
		if ($rootScope.currentuserLoaded) { this.init(); }
		
		// *********************************************************************************
		// *** Events Listeners
		// *********************************************************************************		
		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			purchaseOrderDetailControl.init();
		});		
	}    
    
    // *********************************************************************************
    // *** Modal Moeda
    // *********************************************************************************
    modalChangeCurrency.$inject = ['$modal'];
    function modalChangeCurrency ($modal) {
	
		this.open = function (params) {			
			var instance = $modal.open({
				templateUrl: '/dts/mcc/html/currency/changecurrency.html',
				controller: 'mcc.currency.ChangeCurrencyCtrl as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { 
                    parameters: function () { return params; } 
                }
			});
			return instance.result;
		}
    }
    
    index.register.service('mcc.currency.ModalChangeCurrency', modalChangeCurrency);
    index.register.controller('mcc.purchaseorder.DetailCtrl', purchaseOrderDetailController);
});
