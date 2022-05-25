define([
	'index',
	'/dts/mcc/js/api/ccapi361.js',
	'/dts/mla/js/zoom/mla-usuar-aprov.js',
	'/dts/mcc/js/zoom/comprador.js'
], function(index) {

	// ########################################################
    // ### CONTROLLER MODAL CONFIGURAÇÃO DE GERAÇÃO DE ORDENS
	// ########################################################
    settingsOrderGeneratorController.$inject = ['$rootScope','$scope', '$modalInstance', 'mcc.ccapi361.Factory', 'parameters', 'toaster'];
    function settingsOrderGeneratorController($rootScope, $scope, $modalInstance, ccapi361, parameters, toaster) {
        // *********************************************************************************
		// *** Variables
		// *********************************************************************************
        var settingsOrderGeneratorControl = this;
        settingsOrderGeneratorControl.model = [];
        settingsOrderGeneratorControl.radioOptions = [];
        
        // *********************************************************************************
		// *** Functions
		// *********************************************************************************
		/*
		 * Objetivo: Buscar dados da tela
		 * Parâmetros:
		 */
		settingsOrderGeneratorControl.load = function(){
			settingsOrderGeneratorControl.loaded = false;
			settingsOrderGeneratorControl.model.buyerId = $rootScope.currentuser.login;

			settingsOrderGeneratorControl.ttViewAs = parameters.defaultInformation.ttViewAs;
			settingsOrderGeneratorControl.generateOrdersByPurchaseGroup = parameters.defaultInformation.generateByPurchaseGroup;
			settingsOrderGeneratorControl.model.generatedOrderTo = (settingsOrderGeneratorControl.generateOrdersByPurchaseGroup)?1:2;

			settingsOrderGeneratorControl.radioOptions = [{value: 1, label: $rootScope.i18n('l-purchase-group', [], 'dts/mcc'), disabled: !settingsOrderGeneratorControl.generateOrdersByPurchaseGroup},
                      									  {value: 2, label: $rootScope.i18n('l-buyer-responsible-for-item', [], 'dts/mcc'), disabled: settingsOrderGeneratorControl.generateOrdersByPurchaseGroup},
                      									  {value: 3, label: $rootScope.i18n('l-specific-buyer', [], 'dts/mcc')}];
			//seleciona a primeira opção do combo 'Natureza da ordem'
			settingsOrderGeneratorControl.model.typeOrder ='1';			
		}

		/*
		 * Objetivo: Cancelar ação / Fechar modal
		 * Parâmetros:
		 */
		settingsOrderGeneratorControl.cancel = function() {
			$modalInstance.dismiss('cancel');
		}

		/*
		 * Objetivo: Processar informações / Atender requisições
		 * Parâmetros:
		 */
		settingsOrderGeneratorControl.apply = function(){
			if(parseInt(settingsOrderGeneratorControl.model.generatedOrderTo) == 3){
				if(settingsOrderGeneratorControl.model.buyerId == "" || 
					 settingsOrderGeneratorControl.model.buyerId == null || 
					 settingsOrderGeneratorControl.model.buyerId == undefined){
					toaster.pop('error','',$rootScope.i18n('l-inform-specific-buyer'));	
					return
				}else{
					// validar o comprador no progress
					ccapi361.checkBuyer({pBuyer:settingsOrderGeneratorControl.model.buyerId},function(result){
						if(!result.pValidBuyer){
							toaster.pop('error','',$rootScope.i18n('l-invalid-buyer'));
							return;
						}
					});	
				}				
			}

			processRequestParams = {};
			processRequestParams.usuario = $rootScope.currentuser.login;
			processRequestParams.icms = parseInt(settingsOrderGeneratorControl.model.icms);
			processRequestParams.generateOrders = parseInt(settingsOrderGeneratorControl.model.typeOrder);
			processRequestParams.groupItems = settingsOrderGeneratorControl.model.groupItems;
			if(!processRequestParams.groupItems)
				processRequestParams.groupItems = false;
			processRequestParams.divideOrders = settingsOrderGeneratorControl.model.splitOrdersBetweenSuppliers;
			if(!processRequestParams.divideOrders)
				processRequestParams.divideOrders = false;
			processRequestParams.generateOrdersRelation = parseInt(settingsOrderGeneratorControl.model.generatedOrderTo);
			processRequestParams.buyer = settingsOrderGeneratorControl.model.buyerId;
			
			ccapi361.processRequest(processRequestParams, parameters.requestSelected, function(result){
				ttSummaryPurchRequisition = result.ttSummaryPurchRequisition;
				settingsOrderGeneratorControl.model.ttSummaryPurchRequisition = ttSummaryPurchRequisition;
				RowErrorsAux = result.RowErrorsAux;
				for(var i=0;i<RowErrorsAux.length;i++){
					switch(RowErrorsAux[i].ErrorSubType.toUpperCase()){
						case "ERROR": 
							toasterType = "error"
							break;
						case "WARNING": 
							toasterType = "warning"
							break;
						case "INFORMATION": 
							toasterType = "info"
							break;						
						default: 
							toasterType = "error"
							break;
					}
					
					toaster.pop(toasterType, RowErrorsAux[i].ErrorNumber,RowErrorsAux[i].ErrorDescription);
				}

				for(var i=0;i<ttSummaryPurchRequisition.length;i++){
					settingsOrderGeneratorControl.model.recarregar = true;
					toaster.pop('success', $rootScope.i18n('l-new-orderline'),ttSummaryPurchRequisition[i]["numero-ordem"]);
				}

				if(settingsOrderGeneratorControl.model.recarregar) {
					$modalInstance.close(settingsOrderGeneratorControl.model);	
				}
			});			
		}

		
        // *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************
        settingsOrderGeneratorControl.load(); // busca as informações default da tela

        // *********************************************************************************
		// *** Events Listners
		// *********************************************************************************
		$scope.$on('$destroy', function () {
			followupListControl = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            $modalInstance.dismiss('cancel');
        });
    }

	index.register.controller('mcc.settingsordergenerator.modalSettingsOrderGeneratorCtrl', settingsOrderGeneratorController);
});
