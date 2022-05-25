/*globals index, define */
define([
    'index',
    '/dts/crm/html/class-transition/class-transition-services.list.js',
    '/dts/crm/html/class-transition/class-transition-services.edit.js'
], function (index) {
    
    'use strict';
    
    index.stateProvider.state('dts/crm/class-transition', {
		'abstract': true,
		template: '<ui-view/>'
	}).state('dts/crm/class-transition.start', {
		url: '/dts/crm/class-transition/',
		controller: 'crm.class-transition.list.control',
		controllerAs: 'controller',
		templateUrl: '/dts/crm/html/class-transition/class-transition.list.html'
	}).state('dts/crm/class-transition.detail', {
		url: '/dts/crm/class-transition/detail/:id',
		controller: 'crm.class-transition.detail.control',
		controllerAs: 'controller',
		templateUrl: '/dts/crm/html/class-transition/class-transition.detail.html'
	});
});