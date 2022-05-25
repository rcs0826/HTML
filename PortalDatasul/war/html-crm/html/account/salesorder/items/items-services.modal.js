/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil */
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
	'index',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var modalItemsSalesOrder,
		controllerModalItemsSalesOrder;

	// *************************************************************************************
	// *** MODAL
	// *************************************************************************************
	modalItemsSalesOrder = function ($modal) {

		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/account/salesorder/items/items.modal.html',
				controller: 'crm.items-salesorder.modal.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};

	modalItemsSalesOrder.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER MODAL
	// *************************************************************************************
	controllerModalItemsSalesOrder = function (parameters, $modalInstance, salesOrderItemsFactory, salesOrderItemHelper, $rootScope, accessRestrictionFactory) {

		var CRMControlItemsSalesOrder = this,
			i,
			item;

		this.accessRestriction = undefined;

		this.listItems = [];

		this.init = function () {
			accessRestrictionFactory.getUserRestrictions('salesorder.tab.item', $rootScope.currentuser.login, function (result) {
				CRMControlItemsSalesOrder.accessRestriction = result || {};
			});

			salesOrderItemsFactory.getItems(parameters.nomAbrev, parameters.nrPedCli, function (result) {
				for (i = 0; i < result.length; i++) {
					item = result[i];
					salesOrderItemHelper.parseSalesOrderItemStatus(item);
					CRMControlItemsSalesOrder.listItems.push(item);
				}

			});
		};

		this.close = function () {
			$modalInstance.dismiss('cancel');
		};

		this.init();
	};

	controllerModalItemsSalesOrder.$inject = ['parameters', '$modalInstance', 'crm.mpd_peditem.factory', 'crm.salesorderitem.helper', '$rootScope', 'crm.crm_acess_portal.factory'];



	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.items-salesorder.modal', modalItemsSalesOrder);
	index.register.controller('crm.items-salesorder.modal.control', controllerModalItemsSalesOrder);

});
