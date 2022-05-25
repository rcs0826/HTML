/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/api/fchcrm1003.js'
], function (index) {

	'use strict';

	var modalAccountContactEdit;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************

	modalAccountContactEdit = function ($modal) {
		this.open = function (params) {

			params = params || {};

			params.isContact = true;

			// O controller do cadastro de conta é reaproveitado.

			var instance = $modal.open({
				templateUrl: '/dts/crm/html/account/contact/contact.edit.html',
				controller: 'crm.account.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
	modalAccountContactEdit.$inject = ['$modal'];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.account-contact.modal.edit', modalAccountContactEdit);
});
