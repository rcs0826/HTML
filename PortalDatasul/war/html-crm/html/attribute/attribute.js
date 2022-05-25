/*globals index, define */
define([
	'index',
    '/dts/crm/html/attribute/attribute-services.advanced-search.js',
	'/dts/crm/js/api/fchcrm1083.js',
	'/dts/crm/html/attribute/attribute-services.edit.js',
	'/dts/crm/html/attribute/attribute-services.list.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/attribute', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/attribute.start', {
			url: '/dts/crm/attribute/',
			controller: 'crm.attribute.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/attribute/attribute.list.html'
		});
});
