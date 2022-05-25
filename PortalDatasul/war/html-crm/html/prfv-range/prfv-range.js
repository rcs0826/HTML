/*globals define */
define([
	'index',
	'/dts/crm/html/prfv-range/prfv-range-services.edit.js',
	'/dts/crm/html/prfv-range/prfv-range-services.list.js',
	'/dts/crm/html/prfv-range/prfv-range-services.detail.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/prfv-range', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/prfv-range.start', {
			url: '/dts/crm/prfv-range/',
			controller: 'crm.prfv-range.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/prfv-range/prfv-range.list.html'
		})
		.state('dts/crm/prfv-range.detail', {
			url: '/dts/crm/prfv-range/detail/:id',
			controller: 'crm.prfv-range.detail.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/prfv-range/prfv-range.detail.html'
		});
});
