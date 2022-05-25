define(['index',
	'/dts/mcc/js/api/ccapi362.js'
	], function(index){

		sendedQuotationDetailController.$inject = ['$rootScope', '$scope', '$modalInstance', 'parameters', 'TOTVSEvent', 'mcc.ccapi362.Factory'];		
		function sendedQuotationDetailController($rootScope, $scope, $modalInstance, parameters, TOTVSEvent, ccapi362 ){
			var ctrl = this;	
            ctrl.model = {};    
            ctrl.model.detailSend = [];
            ctrl.model.processQuotation = 0;
            ctrl.model.purchOrderLine = 0;
            ctrl.model.vendorNumber = 0;
            ctrl.model.seq = 0;
			
			/* 
			 * Objetivo: método de inicialização da tela
			 * Parâmetros: 
			 */
			ctrl.init = function() {	                            
                ctrl.model.processQuotation = parameters.processQuotation;
                ctrl.model.purchOrderLine = parameters.purchOrderLine;
                ctrl.model.vendorNumber = parameters.vendorNumber;
                ctrl.model.seq = parameters.seq;
                
                ccapi362.getSendedQuotationProcessDetail({'processQuotation' : parameters.processQuotation,
                                                          'purchOrderLine' : parameters.purchOrderLine,
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
                    ctrl.model.detailSend = result[0];
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

		index.register.controller('mcc.requestquotation.modal.SendedQuotationDetailCtrl', sendedQuotationDetailController);

	});
