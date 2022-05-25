/* global TOTVSEvent, angular*/
define(['index'], function(index) {

	modalOpenController.$inject = [
		'$modalInstance',
		'$location',
		'$rootScope',
		'TOTVSEvent'];

	function modalOpenController(
		$modalInstance,
		$location,
		$rootScope,
		TOTVSEvent) {

		var modalOpenController = this;

		modalOpenController.customerId = "";
		modalOpenController.nrPedcli = "";
		modalOpenController.selectedOrder = [];

		modalOpenController.selectOrder = function () {
			if(modalOpenController.selectedOrder){
				if (modalOpenController.selectedOrder['nome-abrev']) {
					modalOpenController.customerId = modalOpenController.selectedOrder['nome-abrev'];
				}

				if(modalOpenController.selectedOrder['nr-pedcli']){
					modalOpenController.nrPedcli = modalOpenController.selectedOrder['nr-pedcli'];
				}
			}
		}

		this.changeCustomer = function(){

		}

		this.close = function() {
			$modalInstance.dismiss();
		}

		this.open = function() {

			if(!modalOpenController.customerId){
				$rootScope.$broadcast(TOTVSEvent.showNotification, [{type: 'info', title: 'Atenção', detail: 'Informe o nome abreviado do cliente'}]);
			}else{
				if(modalOpenController.selectedOrder){

					if(modalOpenController.customerId == modalOpenController.selectedOrder['nome-abrev']){
						if (modalOpenController.selectedOrder['nr-pedido']) {
							$location.url('/dts/mpd/pd4000/' + modalOpenController.selectedOrder['nr-pedido']);
							$modalInstance.close();
						}
					}else{
						$rootScope.$broadcast(TOTVSEvent.showNotification, [{type: 'info', title: 'Atenção', detail: 'Verifique se o pedido do cliente informado pertence ao cliente'}]);
					}
				}else{
					$rootScope.$broadcast(TOTVSEvent.showNotification, [{type: 'info', title: 'Atenção', detail: 'Informe o pedido do cliente'}]);
				}
			}
		};
	}

	index.register.controller('salesorder.pd4000Open.Controller', modalOpenController);

});

