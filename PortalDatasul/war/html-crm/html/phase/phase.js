/*globals index, define */
define([
	'index',
	'/dts/crm/js/api/fchcrm1077.js',
	'/dts/crm/html/phase/phase-services.edit.js',
	'/dts/crm/html/phase/phase-services.list.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/phase', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/phase.start', {
			url: '/dts/crm/phase/',
			controller: 'crm.phase.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/phase/phase.list.html'
		});
});
