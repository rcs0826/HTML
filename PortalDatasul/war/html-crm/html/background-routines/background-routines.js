/*globals index, define */
define([
	'index',
	'/dts/crm/html/background-routines/background-routines-services.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/background-routines', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/background-routines.start', {
			url : '/dts/crm/background-routines/',
			controller : 'crm.background-routines.list.control',
			controllerAs : 'controller',
			templateUrl : '/dts/crm/html/background-routines/background-routines.html'
		});
});
