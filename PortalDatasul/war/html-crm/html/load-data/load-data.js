/*globals index, define */
define([
	'index',
	'/dts/crm/html/load-data/load-data-services.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/load-data', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/load-data.start', {
			url : '/dts/crm/load-data/',
			controller : 'crm.load-data.list.control',
			controllerAs : 'controller',
			templateUrl : '/dts/crm/html/load-data/load-data.html'
		});
});
