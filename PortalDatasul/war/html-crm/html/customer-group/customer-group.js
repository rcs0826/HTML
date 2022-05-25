/*globals define */
define([
	'index',
	'/dts/crm/js/api/fchcrm1037.js',
	'/dts/crm/html/customer-group/customer-group-services.edit.js',
	'/dts/crm/html/customer-group/customer-group-services.list.js',
	'/dts/crm/html/customer-group/customer-group-services.detail.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/customer-group', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/customer-group.start', {
			url: '/dts/crm/customer-group/',
			controller: 'crm.customer-group.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/customer-group/customer-group.list.html'
		})
		.state('dts/crm/customer-group.detail', {
			url: '/dts/crm/customer-group/detail/:id',
			controller: 'crm.customer-group.detail.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/customer-group/customer-group.detail.html'
		});
});
