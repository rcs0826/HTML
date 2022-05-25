/*globals index, define */
define([
	'index',
	'/dts/crm/html/expense/expense-services.edit.js'
], function (index) {

	'use strict';

	index.stateProvider.state('dts/crm/expense', {
		'abstract': true,
		template: '<ui-view/>'
	});
});
