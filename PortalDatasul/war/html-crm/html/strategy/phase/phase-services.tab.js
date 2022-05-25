/*globals index, define, TOTVSEvent, CRMControl, CRMUtil */
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1076.js',
	'/dts/crm/html/strategy/phase/phase-services.edit.js',
	'ng-load!/dts/crm/js/libs/3rdparty/ng-draggable/ng-draggable.js'
], function (index) {

	'use strict';

	var service;

	// *************************************************************************************
	// *** STRATEGY > PHASE TAB SERVICE|CONTROLLER
	// *************************************************************************************

	service = function ($rootScope, TOTVSEvent, factory, modalAddEdit) {

		this.addEditStrategyPhase = function (strategy, strategyPhase, $index) {

			var i, sequence = 1;

			if (strategy.ttFase) {
				sequence = strategy.ttFase.length + 1;
			}

			modalAddEdit.open({
				phase: strategyPhase,
				strategy: strategy.num_id,
				sequence: sequence
			}).then(function (results) {

				results = results || [];
				
				var i, result;
				
				for (i = 0; i < results.length; i++) {
					
					result = results[i];
					
					if (CRMUtil.isUndefined(result)) { continue; }
					
					if (CRMUtil.isDefined(strategyPhase) && strategyPhase.num_id === result.num_id) {
						strategy.ttFase[$index] = result;
					} else {
						strategy.ttFase = strategy.ttFase || [];
						strategy.ttFase.push(result);
					}
				}
			});
		};

		this.removeStrategyPhase = function (strategyPhase, $index) {

			var CRMControl = this;

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-strategy-phase', [], 'dts/crm').toLowerCase(), strategyPhase.des_fase
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteStrategyPhase(strategyPhase.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-strategy-phase', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						CRMControl.model.ttFase.splice($index, 1);
					});
				}
			});
		};

		this.onStrategyPhaseDropComplete = function (strategy, $to, $data, $event) {

			var i,
				$from,
				phase,
				newOrder = [],
				CRMControl = this;

			// $from = $data.num_order - 1;
			for (i = 0; i < CRMControl.model.ttFase.length; i++) {

				phase = CRMControl.model.ttFase[i];

				if (phase.num_id === $data.num_id) {
					$from = i;
					break;
				}
			}

			CRMControl.model.ttFase.move($from, $to);

			for (i = 0; i < CRMControl.model.ttFase.length; i++) {
				phase = CRMControl.model.ttFase[i];
				phase.num_order = i + 1;
				newOrder.push(phase.num_id);
			}

			factory.reorderStrategyPhases(newOrder);
		};

		this.reorderStrategyPhase = function (strategy) {

			strategy.ttFase = strategy.ttFase || [];

			strategy.ttFase.sort(function (item1, item2) {
				return item1.num_order - item2.num_order;
			});
		};
	};

	service.$inject = [
		'$rootScope', 'TOTVSEvent', 'crm.crm_estrateg_vda.factory', 'crm.strategy-phase.modal.edit'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.service('crm.strategy-phase.tab.service', service);

});
