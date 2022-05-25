/*globals index, define */
define([
	'index',
	'/dts/crm/js/api/fchcrm1072.js',
	'/dts/crm/html/media/media-services.edit.js',
	'/dts/crm/html/media/media-services.list.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/media', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/media.start', {
			url: '/dts/crm/media/',
			controller: 'crm.media.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/media/media.list.html'
		});
});
