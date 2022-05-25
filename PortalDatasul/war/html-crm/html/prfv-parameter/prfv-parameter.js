/*globals define */
define([
	'index',
	'/dts/crm/html/prfv-parameter/prfv-parameter-services.edit.js',
	'/dts/crm/html/prfv-parameter/prfv-parameter-services.list.js',
	'/dts/crm/html/prfv-parameter/prfv-parameter-services.detail.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/prfv-parameter', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/prfv-parameter.start', {
			url: '/dts/crm/prfv-parameter/',
			controller: 'crm.prfv-parameter.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/prfv-parameter/prfv-parameter.list.html'
		})
		.state('dts/crm/prfv-parameter.detail', {
			url: '/dts/crm/prfv-parameter/detail/:id',
			controller: 'crm.prfv-parameter.detail.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/prfv-parameter/prfv-parameter.detail.html'
		});
});
