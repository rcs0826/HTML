/*globals index, define */
define([
	'index',
	'/dts/crm/html/info/info-services.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/info', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/info.start', {
			url: '/dts/crm/info/',
			controller: 'crm.info.detail.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/info/info.detail.html'
		});
});
