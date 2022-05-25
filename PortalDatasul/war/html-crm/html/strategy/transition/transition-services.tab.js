/*globals index, define, TOTVSEvent, CRMControl, CRMUtil */
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1076.js',
	'/dts/crm/html/strategy/transition/transition-services.edit.js'
], function (index) {

	'use strict';

	var service;

	// *************************************************************************************
	// *** STRATEGY > TRANSITION TAB SERVICE|CONTROLLER
	// *************************************************************************************

	service = function ($rootScope, TOTVSEvent, factory, modalAddEdit) {

		this.addEditStrategyTransition = function (strategy, strategyTransition, $index) {

			modalAddEdit.open({
				transition: strategyTransition,
				strategy: strategy.num_id,
				phases: strategy.ttFase
			}).then(function (results) {

				results = results || [];
				
				var i, result;
				
				for (i = 0; i < results.length; i++) {
					
					result = results[i];
					
					if (CRMUtil.isUndefined(result)) { continue; }
					
					if (CRMUtil.isDefined(strategyTransition) && strategyTransition.num_id === result.num_id) {
						strategy.ttTransicao[$index] = result;
					} else {
						strategy.ttTransicao = strategy.ttTransicao || [];
						strategy.ttTransicao.push(result);
					}
				}
			});
		};

		this.removeStrategyTransition = function (strategyTransition, $index) {

			var CRMControl = this;

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-strategy-transition', [], 'dts/crm').toLowerCase(),
					strategyTransition.des_fase + ' / ' + strategyTransition.des_prox_fase
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteStrategyTransition(strategyTransition.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-strategy-transition', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						CRMControl.model.ttTransicao.splice($index, 1);
					});
				}
			});
		};

	};

	service.$inject = [
		'$rootScope', 'TOTVSEvent', 'crm.crm_estrateg_vda.factory', 'crm.strategy-transition.modal.edit'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.service('crm.strategy-transition.tab.service', service);

});
