define(['index',
	'/dts/mcc/js/api/ccapi362.js',
    '/dts/mcc/html/requestquotation/modal/requestquotation.sendedquotationdetail.order.crtl.js'
	], function(index){

		sendedQuotationController.$inject = ['$rootScope', '$scope', '$modalInstance', 'parameters', 'TOTVSEvent', 'mcc.ccapi362.Factory', 'mcc.requestquotation.modal.ModalSendedQuotationDetail'];		
		function sendedQuotationController($rootScope, $scope, $modalInstance, parameters, TOTVSEvent, ccapi362, modalSendedQuotationDetail ){

			var ctrl = this;	
            ctrl.model = {};
			ctrl.model.sendsOfQuotation  = [];
            ctrl.model.sendsOfItemQuotation  = [];
            ctrl.model.purchOrderLineNumber = 0;
			
			/* 
			 * Objetivo: método de inicialização da tela
			 * Parâmetros: 
			 */
			ctrl.init = function() {	            
                ctrl.model.purchOrderLineNumber = parameters.purchOrderLineNumber;
                ccapi362.getSendedQuotationProcess({'purchaseOrderNumber' : parameters.purchOrderLineNumber}, function(result){
                    ctrl.afterGetData(result);
                });
            }
            
            /* 
             * Objetivo: Método executado após a busca das informações
             * Parâmetros: result: Dados retornados dos métodos de busca
             */
            ctrl.afterGetData = function(result){
                if(result){ 
                    ctrl.model.sendsOfQuotation = result['ttSendedQuotationProcess'];
                    ctrl.model.sendsOfItemQuotation = result['ttItemSendedQuotationProcess'];
                    
                    /* Verifica se a data limite para cotação está expirada, se tiver deixa em vermelho */
                    for (var i = ctrl.model.sendsOfQuotation.length - 1; i >= 0; i--) {
                        if (ctrl.model.sendsOfQuotation[i]['dtm-expirac'] > Date.now()) {
                            ctrl.model.sendsOfQuotation[i]['statusClass'] = "status-2";
                        } else {
                            ctrl.model.sendsOfQuotation[i]['statusClass'] = "status-1";
                        }
                    }
                }
            }

            /*
             * Objetivo: Apresenta a tela com as situações dos envios
             * Parameters:  vendorNumber: Número do fornecedor
             */
            ctrl.onDetailSended = function(processQuotation, purchOrderLine, vendorNumber, seq) {
                params = {processQuotation : processQuotation, purchOrderLine : purchOrderLine, vendorNumber : vendorNumber, seq : seq }
                var modalInstance = modalSendedQuotationDetail.open(params).then(function(result) {});
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
        modalSendedQuotationDetail.$inject = ['$modal'];
        function modalSendedQuotationDetail ($modal) {

            this.open = function (params) {   
                var instance = $modal.open({
                    templateUrl: '/dts/mcc/html/requestquotation/modal/requestquotation.sendedquotationdetail.order.html',
                    controller: 'mcc.requestquotation.modal.SendedQuotationDetailCtrl as controller',
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

		index.register.controller('mcc.requestquotation.modal.SendedQuotationCtrl', sendedQuotationController);
        index.register.service('mcc.requestquotation.modal.ModalSendedQuotationDetail', modalSendedQuotationDetail);
        
	});
