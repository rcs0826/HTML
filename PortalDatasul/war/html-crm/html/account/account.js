/*globals index, define*/
define([
	'index',
	'/dts/crm/html/account/account-services.list.js',
	'/dts/crm/html/account/account-services.detail.js',
	'/dts/crm/html/account/account-services.edit.js',
	'/dts/crm/html/account/account-services.advanced-search.js',
	'/dts/crm/html/account/account-services.summary.js'
], function (index) {

	'use strict';

	index.stateProvider.state('dts/crm/account', {
		'abstract': true,
		template: '<ui-view/>'
	}).state('dts/crm/account.start', {
		url: '/dts/crm/account/',
		controller: 'crm.account.list.control',
		controllerAs: 'controller',
		templateUrl: '/dts/crm/html/account/account.list.html'
	}).state('dts/crm/account.detail', {
		url: '/dts/crm/account/detail/:id?isSourceMpd',
		controller: 'crm.account.detail.control',
		controllerAs: 'controller',
		templateUrl: '/dts/crm/html/account/account.detail.html'
	});
});
