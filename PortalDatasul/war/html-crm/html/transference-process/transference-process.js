/*globals index, define */
define([
    'index',
    '/dts/crm/html/transference-process/transference-process-services.js'
], function (index) {
    
    'use strict';

    index.stateProvider
		.state('dts/crm/transference-process', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/transference-process.start', {
			url: '/dts/crm/transference-process/',
			controller: 'crm.transference-process.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/transference-process/transference-process.list.html'
		});
});