/*globals index, define */

define([
	'index',
	'/dts/crm/html/prfv/prfv-services.list.js',
	'/dts/crm/html/prfv/prfv-services.summary.js',
	'/dts/crm/html/prfv/prfv-services.advanced-search.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/prfv', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/prfv.start', {
			url: '/dts/crm/prfv/',
			controller: 'crm.prfv.list.control',
			controllerAs: 'controllerRangePrfvList',
			templateUrl: '/dts/crm/html/prfv/range-prfv.list.html'
		});
});
