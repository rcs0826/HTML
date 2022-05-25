define([
	'index',
	'/dts/mpd/html/rulesoperations/rulesoperations-services.js'
], function(index) {

	index.stateProvider
	.state('dts/mpd/rulesoperations', {
		abstract: true,
		template: '<ui-view/>'
	})
	.state('dts/mpd/rulesoperations.start', {
		url: '/dts/mpd/rulesoperations/',
		controller: 'mpd.rulesoperations.list.control',
		controllerAs: 'controller',
		templateUrl: '/dts/mpd/html/rulesoperations/rulesoperations.list.html'
	});
});
