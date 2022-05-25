/*globals index, define */
define([
	'index',
	'/dts/crm/html/preference/preference-services.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/preference', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/preference.start', {
			url : '/dts/crm/preference/',
			controller : 'crm.preference.list.control',
			controllerAs : 'controller',
			templateUrl : '/dts/crm/html/preference/preference.list.html'
		});
});
