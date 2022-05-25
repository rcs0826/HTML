/*globals index, define */
define([
    'index',
    '/dts/crm/html/hierarchy-type/hierarchy-type-services.list.js',
    '/dts/crm/html/hierarchy-type/hierarchy-type-services.edit.js',
    '/dts/crm/html/hierarchy-type/hierarchy-type-services.detail.js'
], function (index) {
    
    'use strict';
    
    index.stateProvider
		.state('dts/crm/hierarchy-type', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/hierarchy-type.start', {
			url: '/dts/crm/hierarchy-type/',
			controller: 'crm.hierarchy-type.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/hierarchy-type/hierarchy-type.list.html'
		})
		.state('dts/crm/hierarchy-type.detail', {
			url: '/dts/crm/hierarchy-type/detail/:id',
			controller: 'crm.hierarchy-type.detail.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/hierarchy-type/hierarchy-type.detail.html'
		});
    
});
