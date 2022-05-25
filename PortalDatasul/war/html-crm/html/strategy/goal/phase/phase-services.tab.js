/*globals index, define, TOTVSEvent, CRMControl, CRMUtil */
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1076.js',
	'/dts/crm/html/strategy/goal/phase/phase-services.edit.js'
], function (index) {

	'use strict';

	var service;

	// *************************************************************************************
	// *** STRATEGY > META > PHASE TAB SERVICE|CONTROLLER
	// *************************************************************************************

	service = function ($rootScope, TOTVSEvent, factory, modalAddEdit) {
        

		this.addEditStrategyPhaseGoal = function (goal, isIntegratedWithGP, phaseGoal, $index) {

			var CRMControl = this;

			modalAddEdit.open({
				goal: goal.num_id,
				phaseGoal: phaseGoal,
				phases: CRMControl.model.ttFase,
                isIntegratedWithGP: isIntegratedWithGP
			}).then(function (results) {

				results = results || [];
				var i, result;
				for (i = 0; i < results.length; i++) {

					result = results[i];
					if (CRMUtil.isUndefined(result)) { continue; }
                    
					if (CRMUtil.isDefined(phaseGoal) && phaseGoal.num_id === result.num_id) {
                        goal.ttMetaFase[$index] = result;
                    } else {
                        goal.ttMetaFase = goal.ttMetaFase || [];
                        goal.ttMetaFase.push(result);
					}
				}
			});
		};

		this.removeStrategyPhaseGoal = function (goal, phaseGoal, $index) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-strategy-phase-goal', [], 'dts/crm').toLowerCase(), phaseGoal.des_fase
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteStrategyGoalPhase(phaseGoal.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-strategy-phase-goal', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						goal.ttMetaFase.splice($index, 1);
					});
				}
			});
		};
	};

	service.$inject = [
		'$rootScope', 'TOTVSEvent', 'crm.crm_estrateg_vda.factory', 'crm.strategy-goal-phase.modal.edit'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.service('crm.strategy-goal-phase.tab.service', service);

});
