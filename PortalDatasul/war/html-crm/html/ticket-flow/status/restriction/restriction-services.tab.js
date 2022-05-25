/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1106.js',
	'/dts/crm/html/ticket-flow/status/restriction/restriction-services.edit.js'

], function (index) {

	'use strict';
	var controllerRestrictionStatusTab;


	controllerRestrictionStatusTab = function ($rootScope, $scope, helper, TOTVSEvent,
											 factory, modalStatusRestrictionEdit) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlStatusRestrictionTab = this;

		this.listOfStatusRestriction = [];

		this.status = undefined;
		this.ttFluxoStatus = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.addEdit = function (item) {
			modalStatusRestrictionEdit.open({
				status: this.status,
				ttFluxoStatus: this.ttFluxoStatus,
				model: item
			}).then(function (result) {
				CRMControlStatusRestrictionTab.getRestrictionsByFlowStatus(true);
			});
		};

		this.remove = function (item, index) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete-restriction', [item.nom_status_ocor], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteRecord(item.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						var index = CRMControlStatusRestrictionTab.listOfStatusRestriction.indexOf(item);

						if (index !== -1) {
							CRMControlStatusRestrictionTab.listOfStatusRestriction.splice(index, 1);
						}

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-status-restriction', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});
					});
				}
			});
		};

		this.getRestrictionsByFlowStatus = function (notTakeTheCache) {
			if (!this.status || !this.status.num_id) { return; }

			factory.getRestrictionsByFlowStatus(this.status.num_id, function (result) {
				CRMControlStatusRestrictionTab.listOfStatusRestriction = result || [];
			}, true, notTakeTheCache); // sempre salva no cache, mas quando add novo n pega do cache
		};

		this.load = function () {
			CRMControlStatusRestrictionTab.getRestrictionsByFlowStatus();
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function (status, ttFluxoStatus) {
			if (!status || !status.num_id) { return; }
			this.status = status;
			this.ttFluxoStatus = ttFluxoStatus;
			this.load();
		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlStatusRestrictionTab = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadTicketFlowStatus, function (event, status) {
			CRMControlStatusRestrictionTab.status = status;
			CRMControlStatusRestrictionTab.getRestrictionsByFlowStatus();
		});

	}; // controllerRestrictionStatusTab
	controllerRestrictionStatusTab.$inject = [
		'$rootScope', '$scope', 'crm.helper', 'TOTVSEvent', 'crm.crm_ocor_fluxo_restric.factory',
		'crm.ticket-flow-status-restriction.modal.selection'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.ticket-flow-status-restriction.tab.control', controllerRestrictionStatusTab);

});
