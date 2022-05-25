define(['index',   '/dts/mpd/js/api/fchdis0046.js'], function (index) {
	index.stateProvider		
	.state('dts/mpd/internalorderhistory', {  
		abstract: true,				 
		template: '<ui-view/>'       
	})
	.state('dts/mpd/internalorderhistory.start', {
	  url:'/dts/mpd/internalorderhistory/:orderId',
	  controller:'salesorder.internalorderhistory.controller',
	  controllerAs: 'controller',
	  templateUrl:'/dts/mpd/html/internalorderhistory/internalorderhistory.html'
	});

	internalOrderHistoryCtrl.$inject = ['totvs.app-main-view.Service', '$filter', '$stateParams', 'mpd.fchdis0046.Factory'];

	function internalOrderHistoryCtrl(appViewService, $filter, $stateParams, fchdis0046) {
            var ctrl = this;

            this.orderId = $stateParams.orderId;

            appViewService.startView($filter('i18n')('l-order-history') + " " + this.orderId, 'salesorder.internalorderhistory.controller');

            fchdis0046.getInternalOrderHistory({nrPedido: this.orderId}, function(result){
            	ctrl.history = result;			
            });

	}//function internalorderhistoryCtrl()

	index.register.controller('salesorder.internalorderhistory.controller', internalOrderHistoryCtrl);

});