/*globals index, define */
define([
	'index',
	'/dts/crm/js/api/fchcrm1074.js',
	'/dts/crm/html/detail/detail-services.edit.js',
	'/dts/crm/html/detail/detail-services.list.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/detail', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/detail.start', {
			url: '/dts/crm/detail/',
			controller: 'crm.detail.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/detail/detail.list.html'
		});
});
