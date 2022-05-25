/*globals index, define */
define([
	'index',
	'/dts/crm/js/api/fchcrm1046.js',
	'/dts/crm/html/group-user/group-user-services.list.js',
	'/dts/crm/html/group-user/group-user-services.edit.js',
	'/dts/crm/html/group-user/group-user-services.detail.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/group-user', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/group-user.start', {
			url: '/dts/crm/group-user/',
			controller: 'crm.group-user.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/group-user/group-user.list.html'
		})
		.state('dts/crm/group-user.detail', {
			url: '/dts/crm/group-user/detail/:id',
			controller: 'crm.group-user.detail.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/group-user/group-user.detail.html'
		});
});
