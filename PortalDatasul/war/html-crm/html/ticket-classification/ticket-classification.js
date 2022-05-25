/*globals index, define */
define([
	'index',
	'/dts/crm/js/api/fchcrm1036.js',
	'/dts/crm/html/ticket-classification/ticket-classification-services.list.js',
	'/dts/crm/html/ticket-classification/ticket-classification-services.edit.js',
	'/dts/crm/html/ticket-classification/ticket-classification-services.detail.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/ticket-classification', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/ticket-classification.start', {
			url: '/dts/crm/ticket-classification/',
			controller: 'crm.ticket-classification.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/ticket-classification/ticket-classification.list.html'
		})
		.state('dts/crm/ticket-classification.detail', {
			url: '/dts/crm/ticket-classification/detail/:id',
			controller: 'crm.ticket-classification.detail.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/ticket-classification/ticket-classification.detail.html'
		});
});
