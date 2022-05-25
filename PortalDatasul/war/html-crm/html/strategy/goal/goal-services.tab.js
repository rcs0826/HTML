/*globals index, define, TOTVSEvent, CRMControl, CRMUtil */
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1076.js',
	'/dts/crm/html/strategy/goal/goal-services.edit.js'
], function (index) {

	'use strict';

	var service;

	// *************************************************************************************
	// *** STRATEGY > META TAB SERVICE|CONTROLLER
	// *************************************************************************************

	service = function ($rootScope, TOTVSEvent, factory, modalAddEdit) {

		this.addEditStrategyGoal = function (strategyGoal) {

			var i, CRMControl = this;

			modalAddEdit.open({
				strategy: CRMControl.model.num_id,
				goal: strategyGoal
			}).then(function (results) {

				
				results = results || [];
				
				var i, j, result;
				
				for (i = 0; i < results.length; i++) {
					
					result = results[i];
					
					if (CRMUtil.isUndefined(result)) { continue; }
					
					if (CRMUtil.isDefined(strategyGoal) && strategyGoal.num_id === result.num_id) {
						for (j = 0; j < CRMControl.model.ttMeta.length; j++) {
							if (CRMControl.model.ttMeta[j].num_id === result.num_id) {
								CRMControl.model.ttMeta[j] = result;
								break;
							}
						}
					} else {
						CRMControl.model.ttMeta = CRMControl.model.ttMeta || [];
						CRMControl.model.ttMeta.push(result);
					}
					
					CRMControl.selectStrategyGoal(result);
				}
			});
		};

		this.removeStrategyGoal = function (strategyGoal) {

			var i, CRMControl = this;

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-strategy-goal', [], 'dts/crm').toLowerCase(), strategyGoal.des_meta
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteStrategyGoal(strategyGoal.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-strategy-goal', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						for (i = 0; i < CRMControl.model.ttMeta.length; i++) {
							if (CRMControl.model.ttMeta[i].num_id === strategyGoal.num_id) {
								CRMControl.model.ttMeta.splice(i, 1);
								CRMControl.selectStrategyGoal(CRMControl.model.ttMeta[0]);
								break;
							}
						}
					});
				}
			});
		};

		this.selectStrategyGoal = function (goal) {

			var CRMControl = this;

			if (goal) {

				if (CRMUtil.isUndefined(CRMControl.selectedGoal)) {
					CRMControl.selectedGoal = goal;
				}

				CRMControl.selectedGoal.$selected = false;
				CRMControl.selectedGoal = goal;
				CRMControl.selectedGoal.$selected = true;
			} else {
				CRMControl.selectedGoal = undefined;
			}
		};
	};

	service.$inject = [
		'$rootScope', 'TOTVSEvent', 'crm.crm_estrateg_vda.factory', 'crm.strategy-goal.modal.edit'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.service('crm.strategy-goal.tab.service', service);

});
