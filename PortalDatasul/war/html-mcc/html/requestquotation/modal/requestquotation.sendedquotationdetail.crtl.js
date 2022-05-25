define(['index',
	'/dts/mcc/js/api/ccapi362.js'
	], function(index){

		sendedQuotationDetailByProcessController.$inject = ['$rootScope', '$scope', '$modalInstance', 'parameters', 'TOTVSEvent', 'mcc.ccapi362.Factory'];		
		function sendedQuotationDetailByProcessController($rootScope, $scope, $modalInstance, parameters, TOTVSEvent, ccapi362 ){
			var ctrl = this;	
            ctrl.model = {};    
            ctrl.model.detailSend = [];
            ctrl.model.processQuotation = 0;
            ctrl.model.vendorNumber = 0;
            ctrl.model.seq = 0;
			
			/* 
			 * Objetivo: método de inicialização da tela
			 * Parâmetros: 
			 */
			ctrl.init = function() {	                            
                ctrl.model.processQuotation = parameters.processQuotation;
                ctrl.model.vendorNumber = parameters.vendorNumber;
                ctrl.model.seq = parameters.seq;
                
                ccapi362.getSendedDetailByProcessVendor({'processQuotation' : parameters.processQuotation,
                                                          'vendorNumber' : parameters.vendorNumber,
                                                          'seq' : parameters.seq}, 
                function(result){
                    ctrl.afterGetData(result);
                });
            }
            
            /* 
             * Objetivo: Método executado após a busca das informações
             * Parâmetros: result: Dados retornados dos métodos de busca
             */
            ctrl.afterGetData = function(result){
                if(result){ 
                    ctrl.model.detailSend = result['ttItemSendedQuotationProcess'][0];
                    ctrl.model.purchaseOrderLines = result['ttPurchRequisitionInfo'];
                }
            }

			/* 
			 * Objetivo: Cancelar alterações feitas e fechar o modal 
			 * Parâmetros: 
			 */
			ctrl.cancel = function() {
				$modalInstance.dismiss('cancel');
			}						

			ctrl.init();
        }
        
        // *********************************************************************************
        // *** Modal de Detalhe de Solicitações enviadas
        // *********************************************************************************
        modalSendedQuotationByProcessDetail.$inject = ['$modal'];
        function modalSendedQuotationByProcessDetail ($modal) {

            this.open = function (params) {   
                var instance = $modal.open({
                    templateUrl: '/dts/mcc/html/requestquotation/modal/requestquotation.sendedquotationdetail.html',
                    controller: 'mcc.requestquotation.modal.SendedQuotationDetailByProcessCtrl as controller',
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

		index.register.controller('mcc.requestquotation.modal.SendedQuotationDetailByProcessCtrl', sendedQuotationDetailByProcessController);
        index.register.service('mcc.requestquotation.modal.ModalSendedQuotationByProcessDetail', modalSendedQuotationByProcessDetail);
	});
