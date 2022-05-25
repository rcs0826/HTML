/*globals index, define */
define([
	'index',
	'/dts/crm/js/api/fchcrm1113.js',
	'/dts/crm/html/generic-action-setting/generic-action-setting-services.list.js',
	'/dts/crm/html/generic-action-setting/generic-action-setting-services.edit.js',
	'/dts/crm/html/generic-action-setting/generic-action-setting-services.detail.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/generic-action-setting', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/generic-action-setting.start', {
			url: '/dts/crm/generic-action-setting/',
			controller: 'crm.generic-action-setting.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/generic-action-setting/generic-action-setting.list.html'
		})
		.state('dts/crm/generic-action-setting.detail', {
			url: '/dts/crm/generic-action-setting/detail/:id',
			controller: 'crm.generic-action-setting.detail.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/generic-action-setting/generic-action-setting.detail.html'
		});
});
