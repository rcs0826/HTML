/*globals index, define, angular, TOTVSEvent, console */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1036.js',
	'/dts/crm/js/api/fchcrm1004.js',
	'/dts/crm/html/ticket-flow/status/status-services.tab.js',
	'/dts/crm/html/ticket-flow/resources/resources-services.tab.js',
	'/dts/crm/html/ticket-flow/rules/rules-services.tab.js'
], function (index) {

	'use strict';

	var controller;

	// *************************************************************************************
	// *** CONTROLLER - DETAIL
	// *************************************************************************************

	controller = function ($rootScope, $scope, $stateParams, $location, TOTVSEvent, helper,
							factory, modalEdit, serviceTicketFlowStatusTab, serviceTicketFlowResourceTab, ticketFlowHelper, preferenceFactory) {

		var CRMControl = this;

		this.model = undefined;

		this.selectedFlowStatus = undefined;
		this.isIntegratedWithGpls = false;

		angular.extend(this, serviceTicketFlowStatusTab);
		angular.extend(this, serviceTicketFlowResourceTab);

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.load = function (id) {
			factory.getRecord(id, function (result) {
				CRMControl.model = result;
				CRMControl.getResources(id);
				ticketFlowHelper.parseStatusChangePermission(CRMControl.model);
				if (CRMControl.model.ttFluxoStatus && CRMControl.model.ttFluxoStatus.length > 0) {

					CRMControl.model.ttFluxoStatus.sort(function (item1, item2) {
						return item1.num_seq - item2.num_seq;
					});

					CRMControl.selectedFlowStatus = CRMControl.model.ttFluxoStatus[0];
					CRMControl.selectedFlowStatus.$selected = true;

				}
			});
		};

		this.onEdit = function () {
			modalEdit.open({
				ticketFlow: CRMControl.model
			}).then(function (result) {
				if (result) {
					CRMControl.model = result;
				}
			});
		};


		this.onRemove = function () {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('nav-ticket-flow', [], 'dts/crm').toLowerCase(), CRMControl.model.nom_ocor_fluxo
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteRecord(CRMControl.model.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-ticket-flow', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						$location.path('/dts/crm/ticket-flow/');
					});
				}
			});
		};

		this.loadPreferences = function () {
			preferenceFactory.isIntegratedWithGP(function (result) {
				CRMControl.isIntegratedWithGpls = result;
			});
		};

		// *********************************************************************************
		// *** Initialize
		// *********************************************************************************

		this.init = function () {

			var viewName = $rootScope.i18n('nav-ticket-flow', [], 'dts/crm'),
				viewController = 'crm.ticket-flow.detail.control';

			helper.loadCRMContext(function () {

				helper.startView(viewName, viewController, CRMControl);

				CRMControl.model = undefined;

				if ($stateParams && $stateParams.id) {
					CRMControl.load($stateParams.id);
					CRMControl.loadPreferences();
				}
			});
		};

		if ($rootScope.currentuserLoaded) { CRMControl.init(); }

		// *********************************************************************************
		// *** Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControl = undefined;
		});

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			CRMControl.init();
		});
	};

	controller.$inject = [
		'$rootScope', '$scope', '$stateParams', '$location', 'TOTVSEvent', 'crm.helper',
		'crm.crm_ocor_fluxo.factory', 'crm.ticket-flow.modal.edit', 'crm.ticket-flow-status.tab.service',
		'crm.ticket-flow-resources.tab.service', 'crm.ticket-flow.helper', 'crm.crm_param.factory'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.controller('crm.ticket-flow.detail.control', controller);

});
