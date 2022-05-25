define(['index',
	'/dts/mcc/js/api/ccapi362.js',
	'/dts/mpd/js/zoom/emitente.js',
	], function(index){

		vendorsOrderController.$inject = ['$rootScope', '$scope', '$modalInstance', 'parameters', 'TOTVSEvent', 'mcc.ccapi362.Factory'];		
		function vendorsOrderController($rootScope, $scope, $modalInstance, parameters, TOTVSEvent, ccapi362 ){

			var ctrl = this;				
			ctrl.vendors  = [];
			

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
			ctrl.apply = function(){	
                for (var i = 0; i < ctrl.vendors.length ; i++){
                    ctrl.vendors[i]['envia-email'] = ctrl.vendors[i].$selected;		
                } 
                       
                ccapi362.saveItemFornecPurchaseOrder({},{'pQuotationProcessNumber' : parameters.cddSolicit,
                                                         'ttItemFornecPurchaseOrder' : ctrl.vendors}, function(result){});
                
				$modalInstance.close();
			}

			this.init();

		}

		index.register.controller('mcc.requestquotation.modal.VendorsOrderCtrl', vendorsOrderController);

	});
