define([
	'index',
	'/dts/mcc/js/api/fchmatenterquotations.js'
], function(index) {

	approveModal.$inject = ['$modal'];
	function approveModal($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/mcc/html/quotation/approvemodal/approvemodal.html',
				controller: 'mcc.quotation.approveModalCtrl as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'md',
				resolve: { 
					parameters: function () { return params; } 
				}
			});
			return instance.result;
		}
	}

	approveModalController.$inject = ['$rootScope','$scope', '$modalInstance', 'parameters', 'toaster', '$q','mcc.fchmatenterquotations.Factory', 'totvs.app-notification.Service', '$timeout'];
    function approveModalController($rootScope, $scope, $modalInstance, parameters, toaster, $q, fchmatenterquotations, appNotificationService, $timeout) {
        var approveModalControl = this;
        approveModalControl.model = [];

        /*
         * Objetivo: método de inicialização da tela
         * Parâmetros: 
         * Observações: 
         */
        approveModalControl.init = function(){			
			approveModalControl.updateDeliveriesOptions = [	{value:1, label: $rootScope.i18n('l-all')},
															{value:2, label: $rootScope.i18n('l-not-update-2')}];
			approveModalControl.model.updateDeliveriesDate = 2;

			if(!parameters || !parameters.vendor || !parameters.ttCotacaoItem){
				return;
			}

			
			if(parameters && parameters.vendor){
				approveModalControl.model.vendorId = parameters.vendor['cod-emitente'];
				approveModalControl.model.vendorName = parameters.vendor['nome-abrev'];
			}

			if(parameters && parameters.ttCotacaoItem){
				approveModalControl.approval = parameters.ttCotacaoItem['cot-aprovada'];
				approveModalControl.model.comments = parameters.ttCotacaoItem["motivo-apr"];
				approveModalControl.ttCotacaoItem = parameters.ttCotacaoItem;
				if(approveModalControl.approval)
					approveModalControl.getDeliverySchedule(parameters.ttCotacaoItem['numero-ordem']);
			}
		}
		
		/*
		 * Objetivo: Função chamada ao preencher o grid
		 * Parâmetros: data: dados que serão vinculados no grid
		 * Observações: 
		 */
		approveModalControl.onData = function(data){
			//Ajusta altura do grid de entregas
			$timeout(function() {
				$("#divDeliveryGrid .k-grid-content").height(100);
				$("#divDeliveryGrid .k-grid").height(130);
			}, 20);
		}

		/*
		 * Objetivo: Busca as informações das entregas
		 * Parâmetros: pNrOrdem: número da ordem de compra
		 * Observações: 
		 */
		approveModalControl.getDeliverySchedule = function(pNrOrdem){
			fchmatenterquotations.getDeliverySchedule({pNrOrdem:pNrOrdem},function(result){
				approveModalControl.model.parts = result;
			});
		}

		/*
		 * Objetivo: Busca as informações atualizadas das entregas
		 * Parâmetros: 
		 * Observações: 
		 */
		approveModalControl.updateDeliverySchedule = function(){
			approveModalControl.ttCotacaoItem.updateShip = approveModalControl.model.updateDeliveriesDate;
			var params = {ttQuotations: approveModalControl.ttCotacaoItem, 
						  ttDeliverySchedule: approveModalControl.model.parts};
		  	fchmatenterquotations.updateDeliverySchedule(params,function(result){
				approveModalControl.model.parts = result;
			})
		}

		/*
		 * Objetivo: verifica se permitido alterar o valor da coluna do grid
		 * Parâmetros: 
		 * Observações: 
		 */
		approveModalControl.checkEdit = function(){
			if(parseInt(approveModalControl.model.updateDeliveriesDate) === 1)
				return true;
			else
				return false;
		}

		/*
		 * Objetivo: método executado na edição de uma coluna do grid
		 * Parâmetros: 	event: evento angular
						column: coluna do grid
		 * Observações: 
		 */
		approveModalControl.onEdit = function(event,column){
			if(parseInt(approveModalControl.model.updateDeliveriesDate) !== 1){
				approveModalControl.partGrid.closeCell();
				approveModalControl.partGrid.table.focus();
			}
		}		

		/*
		 * Objetivo: Cancelar ação / Fechar modal
		 * Parâmetros:
		 */
		approveModalControl.cancel = function() {
			$modalInstance.dismiss('cancel');
		}

		/*
		 * Objetivo: Processar informações / Atender requisições
		 * Parâmetros:
		 */
		approveModalControl.apply = function(){
			//verifica o prazo de entrega x data de entrega
			if(approveModalControl.ttCotacaoItem['cot-aprovada']){
				var prazoEntrega = parseInt(approveModalControl.ttCotacaoItem['prazo-entreg']);
				var prazoAux = new Date(approveModalControl.ttCotacaoItem['data-cotacao']);
				prazoAux.setDate(prazoAux.getDate() + prazoEntrega);
				var prazoEntregaMaiorDataEntrega = false;
				for(var i=0; i<approveModalControl.model.parts.length; i++){
					if(approveModalControl.model.parts[i]["data-entrega"] < prazoAux){
						prazoEntregaMaiorDataEntrega = true;
						break;
					}
				}
				if(prazoEntregaMaiorDataEntrega){
					return appNotificationService.question({
						title: $rootScope.i18n('l-confirm-delivery-time-msg', [], 'dts/mcc'),
						text: $rootScope.i18n('l-confirm-delivery-time-help', [], 'dts/mcc'),
						cancelLabel: 'l-no',
						confirmLabel: 'l-yes',
						callback: function(isPositiveResult) {
							if(isPositiveResult)
								$modalInstance.close(approveModalControl.model);
							else
								return false;
						}
					});
				}else{
					$modalInstance.close(approveModalControl.model);
				}
			}else{
				$modalInstance.close(approveModalControl.model);
			}
		}
		
        approveModalControl.init(); // busca as informações default da tela

		$scope.$on('$destroy', function () {
			followupListControl = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            $modalInstance.dismiss('cancel');
        });
    }

	index.register.controller('mcc.quotation.approveModalCtrl', approveModalController);
	index.register.service('mcc.quotation.approveModal',approveModal);
});
