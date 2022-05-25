/*globals index, define, TOTVSEvent, CRMControl, CRMEvent, CRMUtil */
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1036.js',
	'/dts/crm/html/ticket-flow/status/status-services.edit.js',
	'ng-load!/dts/crm/js/libs/3rdparty/ng-draggable/ng-draggable.js',
	'/dts/crm/html/ticket-flow/status/resource/resource-services.tab.js',
	'/dts/crm/html/ticket-flow/status/restriction/restriction-services.tab.js',
    '/dts/crm/html/ticket-flow/status/rules/rules-services.tab.js'
], function (index) {

	'use strict';

	var service;

	// *************************************************************************************
	// *** TICKETFLOW > STATUS TAB SERVICE|CONTROLLER
	// *************************************************************************************

	service = function ($rootScope, TOTVSEvent, factory, modalActionEdit, ticketFlowHelper) {

		this.addEditFlowStatus = function (status) {

			var sequence = 1, CRMControl = this;

			if (CRMControl.model.ttFluxoStatus && CRMControl.model.ttFluxoStatus.length > 0) {
				sequence = CRMControl.model.ttFluxoStatus[CRMControl.model.ttFluxoStatus.length - 1].num_seq + 1;
			}

			modalActionEdit.open({
				flow: CRMControl.model.num_id,
				status: status,
				sequence: sequence
			}).then(function (results) {

				results = results || [];

				var i, result;

				for (i = 0; i < results.length; i++) {

					result = results[i];

					if (CRMUtil.isUndefined(result)) { continue; }

					if (CRMUtil.isDefined(status) && status.num_id === result.num_id) {
						for (i = 0; i < CRMControl.model.ttFluxoStatus.length; i++) {
							if (CRMControl.model.ttFluxoStatus[i].num_id === result.num_id) {
								CRMControl.model.ttFluxoStatus[i] = result;
								break;
							}
						}
					} else {
						CRMControl.model.ttFluxoStatus = CRMControl.model.ttFluxoStatus || [];
						CRMControl.model.ttFluxoStatus.push(result);
					}

					ticketFlowHelper.parseStatusChangePermission(CRMControl.model);

					CRMControl.selectFlowStatus(result);
				}
			});
		};

		this.removeStatus = function (status) {

			var CRMControl = this;

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-ticket-flow', [], 'dts/crm').toLowerCase(), status.nom_status_ocor
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteTicketFlowStatus(status.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-ticket-flow', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						var i;

						for (i = 0; i < CRMControl.model.ttFluxoStatus.length; i++) {
							if (CRMControl.model.ttFluxoStatus[i].num_id === status.num_id) {
								CRMControl.model.ttFluxoStatus.splice(i, 1);
								CRMControl.selectFlowStatus(CRMControl.model.ttFluxoStatus[0]);
								break;
							}
						}
					});
				}
			});
		};

		this.selectFlowStatus = function (status) {

			var CRMControl = this;

			if (status) {

				if (CRMUtil.isUndefined(CRMControl.selectedFlowStatus)) {
					CRMControl.selectedFlowStatus = status;
				}

				CRMControl.selectedFlowStatus.$selected = false;
				CRMControl.selectedFlowStatus = status;
				CRMControl.selectedFlowStatus.$selected = true;
			} else {
				CRMControl.selectedFlowStatus = undefined;
			}

			$rootScope.$broadcast(CRMEvent.scopeLoadTicketFlowStatus, CRMControl.selectedFlowStatus);
		};

		this.onTicketFlowStatusDropComplete = function ($to, $data, $event) {

			var i,
				$from,
				status,
				newOrder = [],
				CRMControl = this;

			for (i = 0; i < CRMControl.model.ttFluxoStatus.length; i++) {

				status = CRMControl.model.ttFluxoStatus[i];

				if (status.num_id === $data.num_id) {
					$from = i;
					break;
				}
			}

			CRMControl.model.ttFluxoStatus.move($from, $to);

			for (i = 0; i < CRMControl.model.ttFluxoStatus.length; i++) {
				status = CRMControl.model.ttFluxoStatus[i];
				status.num_seq = i + 1;
				newOrder.push(status.num_id);
			}

			factory.reorderTicketFlowStatus(newOrder);
		};
	};

	service.$inject = [
		'$rootScope', 'TOTVSEvent', 'crm.crm_ocor_fluxo.factory', 'crm.ticket-flow-status.modal.edit',
		'crm.ticket-flow.helper'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.service('crm.ticket-flow-status.tab.service', service);

});
