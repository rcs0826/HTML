define(['index',   '/dts/mpd/js/portal-factories.js'], function (index) {
	index.stateProvider
		
	.state('dts/mpd/orderhistory', {  
		abstract: true,				 
		template: '<ui-view/>'       
	})
	.state('dts/mpd/orderhistory.start', {
	  url:'/dts/mpd/orderhistory/:orderId',
	  controller:'salesorder.orderHistory.Controller',
	  controllerAs: 'controller',
	  templateUrl:'/dts/mpd/html/orderhistory/orderhistory.html'
	});

	orderHistoryCtrl.$inject = [
		'totvs.app-main-view.Service',
		'$filter',
		'$stateParams',
		'salesorder.salesorders.Factory'
	];

	function orderHistoryCtrl(appViewService, $filter, $stateParams, orderResource) {

		var ctrl = this;

		this.orderId = $stateParams.orderId;

		appViewService.startView(
			$filter('i18n')('l-order-history') + " " + this.orderId, 'salesorder.orderHistory.Controller'
		);

		orderResource.getOrderHistory({nrPedido: this.orderId}, function(result){
			ctrl.history = result;			
		});

	} // function orderHistoryCtrl()

	index.register.controller('salesorder.orderHistory.Controller', orderHistoryCtrl);
});
