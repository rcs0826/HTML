define([
	'index',
	'/dts/mpd/html/internalcustomerdetail/internalcustomerdetail-services.js'
], function(index) {

	index.stateProvider
		.state('dts/mpd/internalcustomerdetail', {
			abstract: true,
			template: '<ui-view/>'
		})
		.state('dts/mpd/internalcustomerdetail.start', {
			url: '/dts/mpd/internalcustomerdetail/:customerId',
			controller:'salesorder.internalcustomerdetail.controller',
			controllerAs: 'controller',
			templateUrl:'/dts/mpd/html/internalcustomerdetail/internalcustomerdetail.html'
		});
});
