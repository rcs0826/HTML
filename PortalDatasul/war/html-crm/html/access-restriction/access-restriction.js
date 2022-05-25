/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
define([
	'index',
	'/dts/crm/html/access-restriction/access-restriction-services.list.js',
	'/dts/crm/html/access-restriction/access-restriction-services.edit.js',
	'/dts/crm/html/access-restriction/access-restriction-services.detail.js',
	'/dts/crm/html/access-restriction/access-restriction-services.advanced-search.js',
	'/dts/crm/html/access-restriction/access-restriction-services.selection.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/access-restriction', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/access-restriction.start', {
			url: '/dts/crm/access-restriction/',
			controller: 'crm.access-restriction.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/access-restriction/access-restriction.list.html'
		})
		.state('dts/crm/access-restriction.detail', {
			url: '/dts/crm/access-restriction/detail/:id',
			controller: 'crm.access-restriction.detail.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/access-restriction/access-restriction.detail.html'
		});
});
