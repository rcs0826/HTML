define(['index', 
        '/dts/mpd/js/portal-factories.js',
        '/dts/mpd/html/budgetcommunication/budgetcommunication-controllers.js'], function (index) {

	index.stateProvider
		.state('dts/mpd/budgetcommunication', {
			abstract: true,
			template: '<ui-view/>'
		})
		.state('dts/mpd/budgetcommunication.start', {
			url: '/dts/mpd/budgetcommunication/:budgetId/:budgetCode',
			controller: 'salesorder.budgetcommunication.Controller',
			controllerAs: 'controller',
			templateUrl: '/dts/mpd/html/budgetcommunication/budgetcommunication.html'
		});

});