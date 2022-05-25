define(['index',   '/dts/mpd/js/api/fchdis0066.js'], function (index) {
	
	
	
	index.stateProvider
		
	.state('dts/mpd/quotationhistory', {  
		abstract: true,				 
		template: '<ui-view/>'       
	})
	.state('dts/mpd/quotationhistory.start', {
	  url:'/dts/mpd/quotationhistory/:orderId',
	  controller:'salesorder.quotation.history.Controller',
	  controllerAs: 'controller',
	  templateUrl:'/dts/mpd/html/quotationhistory/quotationhistory.html'
	});

	quotationHistoryCtrl.$inject = ['totvs.app-main-view.Service', '$filter', '$stateParams', 'mpd.fchdis0066.Factory'];

	function quotationHistoryCtrl(appViewService, $filter, $stateParams, fchdis0066) {

		var ctrl = this;

		this.orderId = $stateParams.orderId;

		appViewService.startView($filter('i18n')('l-quotation-history') + " " + this.orderId, 'salesorder.quotationHistory.Controller');

		fchdis0066.getQuotationHistory({nrPedido: this.orderId}, function(result){
			ctrl.history = result;			
		});

	}//function quotationHistoryCtrl()

	index.register.controller('salesorder.quotation.history.Controller', quotationHistoryCtrl);

});