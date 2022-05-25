define([
	'index',
	'/dts/mcc/js/api/ccapi369.js'
], function(index) {

	linkModal.$inject = ['$modal'];
	
	function linkModal($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/mcc/html/purchaseorder/edit/purchaseorder.link.html',
				controller: 'mcc.purchaseorder.linkCtrl as controller',
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

	linkController.$inject = ['$scope', '$rootScope', '$modalInstance', 'parameters', 'mcc.ccapi351.Factory', 'mcc.ccapi369.Factory', 'TOTVSEvent'];
	function linkController($scope, $rootScope, $modalInstance, parameters, ccapi351, ccapi369, TOTVSEvent) {
		
		var linkControl = this;
		linkControl.filterValue = '';
		linkControl.ordersEstablishmentDifferentOrder = false;
		linkControl.orders = [];
		linkControl.ordersSnapshot = [];
		linkControl.selectedItem = null;
		linkControl.selectedItems = [];

		/*
         * Objetivo: método de inicialização da tela
         * Parâmetros: 
         * Observações: 
         */
		linkControl.init = function() {
			linkControl.purchaseNumber = parameters;
			linkControl.selectedFilterOption = 'numero-ordem';
			linkControl.filterOptions = [
				{ value: 'numero-ordem', label: $rootScope.i18n('l-requisition') },
				{ value: 'cdd-solicit', label: $rootScope.i18n('l-quotation-process') },
				{ value: 'it-codigo', label: $rootScope.i18n('l-item') },
				{ value: 'requisitante', label: $rootScope.i18n('l-requester') },
				{ value: 'it-codigo-desc', label: $rootScope.i18n('l-item-description') },
				{ value: 'narrativa', label: $rootScope.i18n('l-description-complementary-order') },
			];
			linkControl.loadRequisitions();
		}

		/*
		 * Objetivo: Filtra os dados do Array.
		 * Parâmetros:
		 */
		 linkControl.filter = function() {
			var filterValue = document.getElementById('controller_filtervalue').value;
			if (filterValue != '') {
				linkControl.orders = linkControl.ordersSnapshot.filter(function (element) {
					return String(element[linkControl.selectedFilterOption]).indexOf(filterValue) >= 0;
				});
			} else {
				linkControl.orders = linkControl.ordersSnapshot.slice(0);
			}
		}

		/*
		 * Objetivo: Evento de onChange do componente de switch da tela.
		 * Parâmetros:
		 */
		linkControl.onChangeEstabDifferent = function() {
			linkControl.orders = [];
			linkControl.filterValue = '';
			setTimeout(function() {
				linkControl.loadRequisitions();
			}, 0);
		}

		/*
		 * Objetivo: Evento de onChange do componente descrição complentar. Neste campo será exibido a 
		 * narrativa das ordens de compras.
		 * Parâmetros:
		 */
		linkControl.onGridChange = function() {
			var kGrid = $(".k-grid").data("kendoGrid");
			var object = kGrid.dataItem(kGrid.select());
			linkControl.description = object['narrativa'];
		}
		
		/*
		 * Objetivo: Carrega as Ordens de compras a serem vinculadas no pedido de compras.
		 * Parâmetros:
		 */
		linkControl.loadRequisitions = function() {
			var params = {
				'numPedido': linkControl.purchaseNumber, 
				'confEstab': linkControl.ordersEstablishmentDifferentOrder
			};
			ccapi351.requisitionsToLink(params, {}, function(result) {
				linkControl.orders = result;
				linkControl.ordersSnapshot = linkControl.orders.slice(0);
			});
		}

		/*
		 * Objetivo: Cancelar ação / Fechar modal
		 * Parâmetros:
		 */
		linkControl.cancel = function() {
			$modalInstance.dismiss('cancel');
		}

		/*
		 * Objetivo: Confirma a vinculação da ordem ao pedido.
		 * Parâmetros:
		 */
		linkControl.apply = function() {
			var parameters = {
				pNrOrder: linkControl.purchaseNumber,
				plConfEstab: linkControl.ordersEstablishmentDifferentOrder,
				ttSummaryPurchRequisition: linkControl.selectedItems
			};
			
			ccapi369.linkRequisitionToOrder({}, parameters, function (result) {
				if (!result['$hasError']) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success',
                        title: $rootScope.i18n('l-purchase-orders', [], 'dts/mcc'),
                        detail: $rootScope.i18n('l-success-linked', [], 'dts/mcc')
                    });
					$modalInstance.close({});
                }
			});
		}

		linkControl.init(); // busca as informações default da tela

		$scope.$on('$destroy', function () {
			linkControl = undefined;
		});

		$scope.$on('$stateChangeStart', function () {
			$modalInstance.dismiss('cancel');
		});
	}

	index.register.controller('mcc.purchaseorder.linkCtrl', linkController);
	index.register.service('mcc.purchaseorder.linkModal', linkModal);
});
