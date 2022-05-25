/*global define*/
define([
    'index',
    '/dts/crm/html/lead-import/lead-import-services.list.js'

], function (index) {
    
    'use strict';
    
    index.stateProvider
		.state('dts/crm/lead-import', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/lead-import.start', {
			url: '/dts/crm/lead-import/',
			controller: 'crm.lead-import.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/lead-import/lead-import.list.html'
		});

});
