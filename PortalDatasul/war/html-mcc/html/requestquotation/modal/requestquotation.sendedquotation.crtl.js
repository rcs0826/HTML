define(['index',
	'/dts/mcc/js/api/ccapi362.js',
    '/dts/mcc/html/requestquotation/modal/requestquotation.sendedquotationdetail.crtl.js'
	], function(index){

		sendedQuotationByProcessController.$inject = ['$rootScope', '$scope', '$modalInstance', 'parameters', 'TOTVSEvent', 'mcc.ccapi362.Factory', 'mcc.requestquotation.modal.ModalSendedQuotationByProcessDetail'];		
		function sendedQuotationByProcessController($rootScope, $scope, $modalInstance, parameters, TOTVSEvent, ccapi362, modalSendedQuotationByProcessDetail ){

			var ctrl = this;	
            ctrl.model = {};
			ctrl.model.sendsOfQuotation  = [];
            ctrl.model.sendsOfVendorQuotation  = [];
            ctrl.model.quotationProcessNumber = 0;
			
			/* 
			 * Objetivo: método de inicialização da tela
			 * Parâmetros: 
			 */
			ctrl.init = function() {	            
                ctrl.model.quotationProcessNumber = parameters.quotationProcessNumber;
                ccapi362.getSendedQuotationProcessByProcess({'quotationProcessNumber' : ctrl.model.quotationProcessNumber}, function(result){
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
                    ctrl.model.sendsOfVendorQuotation = result['ttVendorSendedQuotationProcess'];
                    
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
             * Parameters:  processQuotation: Número do processo de cotação
             *              vendorNumber: Número do fornecedor
             *              seq: Sequência do envio
             */
            ctrl.onDetailSended = function(processQuotation, vendorNumber, seq) {
                params = {processQuotation : processQuotation, vendorNumber : vendorNumber, seq : seq }
                var modalInstance = modalSendedQuotationByProcessDetail.open(params).then(function(result) {});
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
        // *** Modal Solicitações enviadas
        // *********************************************************************************
        modalSendedQuotationByProcess.$inject = ['$modal'];
        function modalSendedQuotationByProcess ($modal) {
        
            this.open = function (params) {   
                var instance = $modal.open({
                    templateUrl: '/dts/mcc/html/requestquotation/modal/requestquotation.sendedquotation.html',
                    controller: 'mcc.requestquotation.modal.SendedQuotationByProcessCtrl as controller',
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

		index.register.controller('mcc.requestquotation.modal.SendedQuotationByProcessCtrl', sendedQuotationByProcessController);
        index.register.service('mcc.requestquotation.modal.ModalSendedQuotationByProcess', modalSendedQuotationByProcess);
	});
