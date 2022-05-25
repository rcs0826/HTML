/*global define*/
define([
	'index',
	'/dts/crm/html/opportunity/opportunity-services.edit.js',
	'/dts/crm/html/opportunity/opportunity-services.list.js',
	'/dts/crm/html/opportunity/opportunity-services.detail.js',
	'/dts/crm/html/opportunity/opportunity-services.advanced-search.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/opportunity', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/opportunity.start', {
			url: '/dts/crm/opportunity/',
			controller: 'crm.opportunity.list.control',
			controllerAs: 'controllerOpportunityList',
			templateUrl: '/dts/crm/html/opportunity/opportunity.list.html'
		})
		.state('dts/crm/opportunity.detail', {
			url: '/dts/crm/opportunity/detail/:id',
			controller: 'crm.opportunity.detail.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/opportunity/opportunity.detail.html'
		});
});
