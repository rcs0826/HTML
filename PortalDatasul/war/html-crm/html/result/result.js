/*globals index, define */
define([
	'index',
	'/dts/crm/js/api/fchcrm1073.js',
	'/dts/crm/html/result/result-services.edit.js',
	'/dts/crm/html/result/result-services.list.js',
	'/dts/crm/html/result/result-services.detail.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/result', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/result.start', {
			url: '/dts/crm/result/',
			controller: 'crm.result.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/result/result.list.html'
		})
		.state('dts/crm/result.detail', {
			url: '/dts/crm/result/detail/:id',
			controller: 'crm.result.detail.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/result/result.detail.html'
		});
});
