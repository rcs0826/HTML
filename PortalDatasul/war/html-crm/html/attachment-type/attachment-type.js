/*globals index, define */
define([
	'index',
	'/dts/crm/js/api/fchcrm1092.js',
	'/dts/crm/html/attachment-type/attachment-type-services.edit.js',
	'/dts/crm/html/attachment-type/attachment-type-services.list.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/attachment-type', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/attachment-type.start', {
			url: '/dts/crm/attachment-type/',
			controller: 'crm.attachment-type.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/attachment-type/attachment-type.list.html'
		});
});
