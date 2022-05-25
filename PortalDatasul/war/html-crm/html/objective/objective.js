/*globals index, define */
define([
	'index',
	'/dts/crm/js/api/fchcrm1071.js',
	'/dts/crm/html/objective/objective-services.edit.js',
	'/dts/crm/html/objective/objective-services.list.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/objective', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/objective.start', {
			url: '/dts/crm/objective/',
			controller: 'crm.objective.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/objective/objective.list.html'
		});
});
