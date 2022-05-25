/*global define*/
define([
	'index',
	'/dts/crm/html/preference-notification/preference-notification-services.list.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/preference-notification', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/preference-notification.start', {
			url: '/dts/crm/preference-notification/',
			controller: 'crm.preferencenotification.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/preference-notification/preference-notification.list.html'
		});
});
