/*globals index, define */
define([
	'index',
	'/dts/crm/js/api/fchcrm1076.js',
	'/dts/crm/html/strategy/strategy-services.list.js',
	'/dts/crm/html/strategy/strategy-services.edit.js',
	'/dts/crm/html/strategy/strategy-services.detail.js',
	'/dts/crm/html/strategy/strategy-services.advanced-search.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/strategy', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/strategy.start', {
			url: '/dts/crm/strategy/',
			controller: 'crm.strategy.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/strategy/strategy.list.html'
		})
		.state('dts/crm/strategy.detail', {
			url: '/dts/crm/strategy/detail/:id',
			controller: 'crm.strategy.detail.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/strategy/strategy.detail.html'
		});
});
