/*globals index, define */
define([
	'index',
	'/dts/crm/js/api/fchcrm1019.js',
	'/dts/crm/html/product/product-services.list.js',
	'/dts/crm/html/product/product-services.edit.js',
	'/dts/crm/html/product/product-services.detail.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/product', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/product.start', {
			url: '/dts/crm/product/',
			controller: 'crm.product.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/product/product.list.html'
		})
		.state('dts/crm/product.detail', {
			url: '/dts/crm/product/detail/:id',
			controller: 'crm.product.detail.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/product/product.detail.html'
		});
});
