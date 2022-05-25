/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1105.js',
	'/dts/crm/html/ticket-flow/status/resource/resource-services.edit.js'

], function (index) {

	'use strict';
	var controllerStatusResourceTab;


	controllerStatusResourceTab = function ($rootScope, $scope, helper, TOTVSEvent,
											 factory, modalStatusResourceEdit) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlStatusResourceTab = this;

		this.listOfStatusResource = [];

		this.status = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.addEdit = function (item) {
			modalStatusResourceEdit.open({
				status: this.status,
				model: item
			}).then(function (result) {
				if (result !== undefined) {
					CRMControlStatusResourceTab.getResourcesByFlowStatus(true);
				}
			});
		};

		this.setDefault = function (resource) {

			factory.setResourceAsDefault(resource.num_id, function (result) {

				if (!result && result.l_ok === false) { return; }

				var i;

				for (i = 0; i < CRMControlStatusResourceTab.listOfStatusResource.length; i++) {
					if (CRMControlStatusResourceTab.listOfStatusResource[i].num_id === resource.num_id) {
						CRMControlStatusResourceTab.listOfStatusResource[i].log_padr = true;
					} else {
						CRMControlStatusResourceTab.listOfStatusResource[i].log_padr = false;
					}
				}
			});
		};

		this.remove = function (item, index) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete-resource', [item.nom_usuar], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteRecord(item.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						var index = CRMControlStatusResourceTab.listOfStatusResource.indexOf(item);

						if (index !== -1) {
							CRMControlStatusResourceTab.listOfStatusResource.splice(index, 1);
							//CRMControlStatusResourceTab.listOfStatusResourceCount -= 1;
						}

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-resource', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});
					});
				}
			});
		};

		this.getResourcesByFlowStatus = function (notTakeTheCache) {
			if (!this.status || !this.status.num_id) { return; }

			factory.getResourcesByFlowStatus(this.status.num_id, function (result) {
				CRMControlStatusResourceTab.listOfStatusResource = result || [];
			}, true, notTakeTheCache); // sempre salva no cache, mas quando add novo n pega do cache
		};

		this.load = function () {
			CRMControlStatusResourceTab.getResourcesByFlowStatus();
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function (status) {
			if (!status || !status.num_id) { return; }
			this.status = status;
			this.load();
		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlStatusResourceTab = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadTicketFlowStatus, function (event, status) {
			CRMControlStatusResourceTab.status = status;
			CRMControlStatusResourceTab.getResourcesByFlowStatus();
		});

	}; // controllerStatusResourceTab
	controllerStatusResourceTab.$inject = [
		'$rootScope', '$scope', 'crm.helper', 'TOTVSEvent', 'crm.crm_ocor_fluxo_status_recur.factory',
		'crm.ticket-flow-status-resource.modal.selection'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.ticket-flow-status-resource.tab.control', controllerStatusResourceTab);

});
