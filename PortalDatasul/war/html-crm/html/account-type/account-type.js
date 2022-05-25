/*globals index, define*/

define([
    'index',
    '/dts/crm/html/account-type/account-type-services.list.js',
    '/dts/crm/html/account-type/account-type-services.edit.js',
    '/dts/crm/html/account-type/account-type-services.detail.js'
], function (index) {

    'use strict';

	index.stateProvider.state('dts/crm/account-type', {
		'abstract': true,
		template: '<ui-view/>'
	}).state('dts/crm/account-type.start', {
		url: '/dts/crm/account-type/',
		controller: 'crm.account-type.list.control',
		controllerAs: 'controller',
		templateUrl: '/dts/crm/html/account-type/account-type.list.html'
	}).state('dts/crm/account-type.detail', {
		url: '/dts/crm/account-type/detail/:id',
		controller: 'crm.account-type.detail.control',
		controllerAs: 'controller',
		templateUrl: '/dts/crm/html/account-type/account-type.detail.html'
	});

});
