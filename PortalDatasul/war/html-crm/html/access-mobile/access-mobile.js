/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
define([
	'index',
	'/dts/crm/html/access-mobile/access-mobile-services.detail.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/access-mobile', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/access-mobile.start', {
			url: '/dts/crm/access-mobile/',
			controller: 'crm.access-mobile.detail.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/access-mobile/access-mobile.detail.html'
		});
});
