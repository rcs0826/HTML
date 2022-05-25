/*globals index, define*/
define([
	'index',
	'/dts/crm/html/ticket/ticket-services.list.js',
	'/dts/crm/html/ticket/ticket-services.edit.js',
	'/dts/crm/html/ticket/ticket-services.detail.js',
	'/dts/crm/html/ticket/ticket-services.advanced-search.js'
], function (index) {

	'use strict';

	index.stateProvider.state('dts/crm/ticket', {
		'abstract': true,
		template: '<ui-view/>'
	}).state('dts/crm/ticket.start', {
		url: '/dts/crm/ticket/',
		controller: 'crm.ticket.list.control',
		controllerAs: 'controllerTicketList',
		templateUrl: '/dts/crm/html/ticket/ticket.list.html'
	}).state('dts/crm/ticket.detail', {
		url: '/dts/crm/ticket/detail/:id',
		controller: 'crm.ticket.detail.control',
		controllerAs: 'controller',
		templateUrl: '/dts/crm/html/ticket/ticket.detail.html'
	});

});
