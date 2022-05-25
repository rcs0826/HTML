/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1109.js',
	'/dts/crm/html/ticket-flow/rules/rules-services.edit.js'

], function (index) {

	'use strict';
	var controllerFlowRulesTab;


	controllerFlowRulesTab = function ($rootScope, $scope, helper, TOTVSEvent, $stateParams, factory, modalFlowRulesEdit) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlFlowRulesTab = this;

		this.listOfFlowRules = [];

		this.flowId = $stateParams.id || 0;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.onRulesDropComplete = function ($to, $data, $event) {

			var i,
				$from,
				rule,
				newOrder = [],
				CRMControl = this;

			// $from = $data.num_seq - 1;
			for (i = 0; i < CRMControl.listOfFlowRules.length; i++) {

				rule = CRMControl.listOfFlowRules[i];

				if (rule.num_id === $data.num_id) {
					$from = i;
					break;
				}
			}

			CRMControl.listOfFlowRules.move($from, $to);

			for (i = 0; i < CRMControl.listOfFlowRules.length; i++) {
				rule = CRMControl.listOfFlowRules[i];
				rule.num_seq = i + 1;
				newOrder.push(rule.num_id);
			}

			factory.reorderFlowRules(newOrder);
		};

		this.addEdit = function (item) {
			modalFlowRulesEdit.open({
				flowId: this.flowId,
				model: item
			}).then(function (result) {
				CRMControlFlowRulesTab.getRulesByFlow(true);
			});
		};

		this.remove = function (item, index) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete-flow-rules', [item.nom_usuar], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteRecord(item.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						var index = CRMControlFlowRulesTab.listOfFlowRules.indexOf(item);

						if (index !== -1) {
							CRMControlFlowRulesTab.listOfFlowRules.splice(index, 1);
						}

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-rules', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});
					});
				}
			});
		};

		this.getRulesByFlow = function (notTakeTheCache) {
			if (!this.flowId || this.flowId < 1) { return; }

			factory.getRulesByFlow(this.flowId, function (result) {
				CRMControlFlowRulesTab.listOfFlowRules = result || [];
			}, true, notTakeTheCache); // sempre salva no cache, mas quando add novo n pega do cache
		};

		this.load = function () {
			CRMControlFlowRulesTab.getRulesByFlow();
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {
			if (!this.flowId || this.flowId < 0) { return; }
			this.load();
		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlFlowRulesTab = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadTicketFlow, function (event) {
			CRMControlFlowRulesTab.getRulesByFlow();
		});

	}; // controllerFlowRulesTab
	controllerFlowRulesTab.$inject = [
		'$rootScope', '$scope', 'crm.helper', 'TOTVSEvent', '$stateParams', 'crm.crm_ocor_fluxo_regra.factory',
		'crm.ticket-flow-rules.modal.selection'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.ticket-flow-rules.tab.control', controllerFlowRulesTab);

});
