/*globals index, define, */
define([
	'index',
	'/dts/crm/html/report/report-services.list.js',
	'/dts/crm/html/report/report-services.edit.js',
	'/dts/crm/html/report/report-services.detail.js',
	'/dts/crm/html/report/report-services.available.js',
	'/dts/crm/html/report/report-services.parameter.js',
	'/dts/crm/html/report/report-services.advanced-search.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/report', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/report.start', {
			url: '/dts/crm/report/',
			controller: 'crm.report.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/report/report.list.html'
		})
		.state('dts/crm/report.detail', {
			url: '/dts/crm/report/detail/:id',
			controller: 'crm.report.detail.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/report/report.detail.html'
		})
		.state('dts/crm/report.new', {
			url: '/dts/crm/report/new',
			controller: 'crm.report.edit.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/report/report.edit.html'
		})
		.state('dts/crm/report.available', {
			url: '/dts/crm/report/available',
			controller: 'crm.report.available.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/report/report.available.menu.html'
		});
});
