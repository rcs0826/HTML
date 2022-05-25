define(['index',
	'/dts/mcc/js/api/ccapi362.js'
	], function(index){

		confirmSendingController.$inject = ['$rootScope', '$scope', '$modalInstance', 'parameters', 'TOTVSEvent', 'mcc.ccapi362.Factory'];		
		function confirmSendingController($rootScope, $scope, $modalInstance, parameters, TOTVSEvent, ccapi362 ){

			var ctrl = this;				
			ctrl.ttSendingItemInfo = [];
			/* 
			 * Objetivo: método de inicialização da tela
			 * Parâmetros: 
			 */
			ctrl.init = function() {	

				//Busca as ordens e fornecedores das ordens configurados para envio
				var param = {'pQuotationProcessNumber': parameters.quotationProcessNumber,
			                 'pSuggestVendorRelated': parameters.suggestVendorRelated};
				ccapi362.getSendingConfirmInfo(param, function(result){
					//Marca os selecionados para envio
					for (var i = 0; i < result.length ; i++){	
						var item = result[i];
						for (var j = 0; j < item['ttSendingVendorItemInfo'].length ; j++){
							if(item['ttSendingVendorItemInfo'][j]['envia-email']){
								item['ttSendingVendorItemInfo'][j].$selected = true;
							}else{
								item['ttSendingVendorItemInfo'][j].$selected = false;
							}
						}							    		
					} 
					ctrl.ttSendingItemInfo = result;
				});
			}

			/* 
			 * Objetivo: Cancelar alterações feitas e fechar o modal 
			 * Parâmetros: 
			 */
			this.cancel = function() {
				$modalInstance.dismiss('cancel');
			}						

			/* 
			 * Objetivo: cofirma as informações do grid e fechar o modal
			 * Parâmetros: 
			 */
			ctrl.apply = function(){
				var params = {	'pQuotationProcessNumber': parameters.quotationProcessNumber,
								'dsQuotationProcessItem': {'ttSendingItemInfo': ctrl.ttSendingItemInfo}};
	  			ccapi362.sendQuotationProcess({}, params, function(result){
					if(!result['$hasError']){
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'success',
                            title: $rootScope.i18n('l-quotation-process', [], 'dts/mcc'),
                        detail: $rootScope.i18n('l-request-quotation-sent-success-msg', [], 'dts/mcc')
                        });
                        $modalInstance.close();
                    }
				});
			}

			/* 
			 * Objetivo: Pega as informações selecionadas no grid para o envio
			 * Parâmetros: e - Evento do on-change do grid
			 */
			ctrl.onChange = function(e){
				var kendo = e.sender;
				if(!kendo.dataItem(kendo.select())){					
					return;
				}
				kendo.dataItem(kendo.select())['envia-email'] = kendo.dataItem(kendo.select()).$selected;
				
				for(var i=0; i<ctrl.ttSendingItemInfo.length; i++){
					if(	ctrl.ttSendingItemInfo[i]['cdd-solicit'] == kendo.dataItem(kendo.select())['cdd-solicit'] &&
						ctrl.ttSendingItemInfo[i]['numero-ordem'] == kendo.dataItem(kendo.select())['numero-ordem']){
						for(var j=0; j < ctrl.ttSendingItemInfo[i].ttSendingVendorItemInfo.length; j++){
							if(	ctrl.ttSendingItemInfo[i].ttSendingVendorItemInfo[j]['cdd-solicit'] == kendo.dataItem(kendo.select())['cdd-solicit'] &&
								ctrl.ttSendingItemInfo[i].ttSendingVendorItemInfo[j]['numero-ordem'] == kendo.dataItem(kendo.select())['numero-ordem'] &&
								ctrl.ttSendingItemInfo[i].ttSendingVendorItemInfo[j]['cod-emitente'] == kendo.dataItem(kendo.select())['cod-emitente']){
								
								ctrl.ttSendingItemInfo[i].ttSendingVendorItemInfo[j]['envia-email'] = kendo.dataItem(kendo.select()).$selected;
								ctrl.ttSendingItemInfo[i].ttSendingVendorItemInfo[j].$selected = kendo.dataItem(kendo.select()).$selected;
								break;
							}
						}
					}
				}
			}

			this.init();

		}

		index.register.controller('mcc.requestquotation.modal.ConfirmSendingCtrl', confirmSendingController);

	});
