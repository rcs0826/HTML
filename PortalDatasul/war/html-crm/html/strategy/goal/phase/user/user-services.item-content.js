/*globals index, define, TOTVSEvent, CRMControl, CRMUtil */
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1076.js',
	'/dts/crm/html/strategy/goal/phase/user/user-services.edit.js'
], function (index) {

	'use strict';

	var service;

	// *************************************************************************************
	// *** STRATEGY > META > PHASE > USER ITEM SERVICE|CONTROLLER
	// *************************************************************************************

	service = function ($rootScope, TOTVSEvent, factory, modalAddEdit) {

		this.addEditStrategyPhaseUserGoal = function (phaseGoal, userGoal, $index) {
			modalAddEdit.open({
				goal: userGoal,
				phaseGoal: phaseGoal.num_id
			}).then(function (results) {

				results = results || [];

				var i, result;
				for (i = 0; i < results.length; i++) {
					result = results[i];
					if (CRMUtil.isUndefined(result)) { continue; }
					if (CRMUtil.isDefined(userGoal) && userGoal.num_id === result.num_id) {
					phaseGoal.ttMetaFaseUsuario[$index] = result;
				} else {
					phaseGoal.ttMetaFaseUsuario = phaseGoal.ttMetaFaseUsuario || [];
					phaseGoal.ttMetaFaseUsuario.push(result);
					}
				}
			});
		};

		this.removeEditStrategyPhaseUserGoal = function (phaseGoal, userGoal, $index) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-strategy-goal-user', [], 'dts/crm').toLowerCase(), userGoal.nom_usuar
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteStrategyGoalPhaseUser(userGoal.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-strategy-goal-user', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						phaseGoal.ttMetaFaseUsuario.splice($index, 1);
					});
				}
			});
		};

	};

	service.$inject = [
		'$rootScope', 'TOTVSEvent', 'crm.crm_estrateg_vda.factory', 'crm.strategy-goal-phase-user.modal.edit'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.service('crm.strategy-goal-phase-user.item-content.service', service);

});
