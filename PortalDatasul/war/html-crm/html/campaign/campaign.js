/*globals index, define */
define([
	'index',
	'/dts/crm/js/api/fchcrm1001.js',
	'/dts/crm/html/campaign/campaign-services.edit.js',
	'/dts/crm/html/campaign/campaign-services.list.js',
	'/dts/crm/html/campaign/campaign-services.detail.js',
	'/dts/crm/html/campaign/campaign-services.advanced-search.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/campaign', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/campaign.start', {
			url: '/dts/crm/campaign/',
			controller: 'crm.campaign.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/campaign/campaign.list.html'
		})
		.state('dts/crm/campaign.detail', {
			url: '/dts/crm/campaign/detail/:id',
			controller: 'crm.campaign.detail.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/campaign/campaign.detail.html'
		});
});
