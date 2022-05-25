/*globals index, define*/
define([
	'index',
	'/dts/crm/html/ticket-subject/ticket-subject-services.list.js',
	'/dts/crm/html/ticket-subject/ticket-subject-services.edit.js',
	'/dts/crm/html/ticket-subject/ticket-subject-services.detail.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/ticket-subject', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/ticket-subject.start', {
			url: '/dts/crm/ticket-subject/',
			controller: 'crm.ticket-subject.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/ticket-subject/ticket-subject.list.html'
		})
		.state('dts/crm/ticket-subject.detail', {
			url: '/dts/crm/ticket-subject/detail/:id',
			controller: 'crm.ticket-subject.detail.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/ticket-subject/ticket-subject.detail.html'
		});
});
