/*globals, define*/
define([
	'index',
	'/dts/crm/html/register-batch-action/register-batch-action-services.edit.js'
], function (index) {
	'use strict';

	index.stateProvider
		.state('dts/crm/register-batch-action', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/register-batch-action.start', {
			url: '/dts/crm/register-batch-action',
			controller: 'crm.register-batch-action.edit.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/register-batch-action/register-batch-action.edit.menu.html'
		})  
		.state('dts/crm/register-batch-action.new', {
			url: '/dts/crm/register-batch-action/new?publicId&publicName',
			controller: 'crm.register-batch-action.edit.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/register-batch-action/register-batch-action.edit.menu.html'
		});
});
