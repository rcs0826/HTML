define(['index',
	'/dts/mcc/js/api/ccapi362.js',
	'/dts/mpd/js/zoom/emitente.js'
	], function(index){

		modalCtrl.$inject = ['$rootScope', '$scope', '$modalInstance', 'parameters', 'TOTVSEvent', 'mcc.ccapi362.Factory', 'totvs.utils.Service'];		
		function modalCtrl($rootScope, $scope, $modalInstance, parameters, TOTVSEvent, ccapi362, totvsUtilsService){

			var ctrl = this;				
			ctrl.vendors  = [];
			ctrl.selected = false;
			

			/* 
			 * Objetivo: método de inicialização da tela
			 * Parâmetros: 
			 */
			ctrl.init = function() {							
				ttPurchaseOrder = [];
				ttPurchaseOrder.push({"numero-ordem": parameters.purchaseOrderNumber});
				ctrl.purchaseOrderNumber = parameters.purchaseOrderNumber;
                
                ccapi362.getItemFornecPurchaseOrder({'pQuotationProcessNumber' : parameters.cddSolicit,
                                                    'pOnlyVendorItem' : parameters.suggestVendorRelated, 
                                                     ttPurchaseOrder},
                    function(result){
                        vendorsAux = result;
                        for (var i = 0; i < result.length ; i++){								    		
                            if(result[i]['envia-email']){
                                vendorsAux[i].$selected = true;
								ctrl.selected = true;
                            }		
                        } 
                        ctrl.setVendors(vendorsAux);
                    }							  	
                );
			}

			/* 
			 * Objetivo: método pra setar registros no array que sera apresentado em tela
			 * Parâmetros: Array de fornecedores
			 * Obs: Realizado dessa forma pois após popular o array do grid, os campos
			 * não são mais atualizados em tela, dessa forma o array do grid só deve ser populado quando todos
			 * os campos já tiverem sido setados.
			 */
			ctrl.setVendors = function(vendorsAux){				
				ctrl.vendors = vendorsAux;
			}
			
			/* 
			 * Objetivo: Cancelar alterações feitas e fechar o modal de fornecedores
			 * Parâmetros: 
			 */
			this.cancel = function() {
				$modalInstance.dismiss('cancel');
			}						

			/* 
			 * Objetivo: cofirma as informações do grid e fechar o modal de fornecedores
			 * Parâmetros: 
			 */
			this.apply = function(){	
                for (var i = 0; i < this.vendors.length ; i++){
                    this.vendors[i]['envia-email'] = this.vendors[i].$selected;		
                } 
                       
                ccapi362.saveItemFornecPurchaseOrder({},{'pQuotationProcessNumber' : parameters.cddSolicit,
                                                         'ttItemFornecPurchaseOrder' : this.vendors}, function(result){});
                
				$modalInstance.close();
			}
			
			ctrl.unselectAll = function() {	
				ttPurchaseOrder = [];
				ttPurchaseOrder.push({"numero-ordem": parameters.purchaseOrderNumber});
				ctrl.purchaseOrderNumber = parameters.purchaseOrderNumber;
                
                ccapi362.getItemFornecPurchaseOrder({'pQuotationProcessNumber' : parameters.cddSolicit,
                                                    'pOnlyVendorItem' : parameters.suggestVendorRelated, 
                                                     ttPurchaseOrder},
                    function(result){
                        vendorsAux = result;
                        for (var i = 0; i < result.length ; i++){								    		
                            vendorsAux[i].$selected = false;	
							ctrl.selected = false;
                        } 
                        ctrl.setVendors(vendorsAux);
                    }							  	
                );
		    }
			
		    ctrl.selectAll = function() {	
				ttPurchaseOrder = [];
				ttPurchaseOrder.push({"numero-ordem": parameters.purchaseOrderNumber});
				ctrl.purchaseOrderNumber = parameters.purchaseOrderNumber;
                
                ccapi362.getItemFornecPurchaseOrder({'pQuotationProcessNumber' : parameters.cddSolicit,
                                                    'pOnlyVendorItem' : parameters.suggestVendorRelated, 
                                                     ttPurchaseOrder},
                    function(result){
                        vendorsAux = result;
                        for (var i = 0; i < result.length ; i++){								    		
                            vendorsAux[i].$selected = true;	
							ctrl.selected = true;
                        } 
                        ctrl.setVendors(vendorsAux);
                    }							  	
                );
			}
			
			this.init();
		}

		index.register.controller('mcc.modalCtrl', modalCtrl);
	});
