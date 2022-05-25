/*globals index, define */
define([
    'index',
    '/dts/crm/html/preference-financial/preference-financial-services.js'
], function (index) {
    
    'use strict';

	index.stateProvider
		.state('dts/crm/preference-financial', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/preference-financial.start', {
			url : '/dts/crm/preference-financial/',
			controller : 'crm.preference-financial.list.control',
			controllerAs : 'controller',
			templateUrl : '/dts/crm/html/preference-financial/preference-financial.html'
		});
});