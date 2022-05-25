/*globals index, define, TOTVSEvent, CRMControl, CRMUtil */
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1001.js',
	'/dts/crm/html/campaign/action/result/result-services.edit.js'
], function (index) {

	'use strict';

	var service;

	// *************************************************************************************
	// *** CAMPAIGN > ACTION > RESULT TAB SERVICE|CONTROLLER
	// *************************************************************************************

	service = function ($rootScope, TOTVSEvent, factory, modalResult) {

		this.addEditActionResult = function (action, actionResult, $index) {

			modalResult.open({
				action: action.num_id,
				result: actionResult
			}).then(function (results) {
				
				results = results || [];
				
				var i, j, result;
				
				for (i = 0; i < results.length; i++) {
					
					result = results[i];
					
					if (CRMUtil.isUndefined(result)) { continue; }
					
					if (CRMUtil.isDefined(actionResult) && actionResult.num_id === result.num_id) {
						for (j = 0; j < action.ttResultado.length; j++) {
							if (action.ttResultado[j].num_id === result.num_id) {
								action.ttResultado[j] = result;
								break;
							}
						}
					} else {
						
						action.ttResultado = action.ttResultado || [];

						if (action.ttResultado.length === 0) {
							result.log_restdo_default = true;
						}

						action.ttResultado.push(result);
					}
					
					if (result.log_restdo_default === true) {
						for (j = 0; j < action.ttResultado.length; j++) {
							if (action.ttResultado[j].num_id === result.num_id) {
								action.ttResultado[j].log_restdo_default = true;
							} else {
								action.ttResultado[j].log_restdo_default = false;
							}
						}
					}
				}
			});
		};

		this.removeActionResult = function (action, resultAction, $index) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-campaign-action-result', [], 'dts/crm').toLowerCase(),
					resultAction.nom_restdo
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteCampaignActionResult(resultAction.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-campaign', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						action.ttResultado.splice($index, 1);
					});
				}
			});
		};

		this.setAsActionResultDefault = function (action, resultAction) {

			factory.setCampaignActionResultAsDefault(resultAction.num_id, function (result) {

				if (!result && result.l_ok === false) { return; }

				var i;

				for (i = 0; i < action.ttResultado.length; i++) {
					if (action.ttResultado[i].num_id === resultAction.num_id) {
						action.ttResultado[i].log_restdo_default = true;
					} else {
						action.ttResultado[i].log_restdo_default = false;
					}
				}
			});
		};

	};

	service.$inject = [
		'$rootScope', 'TOTVSEvent', 'crm.crm_campanha.factory', 'crm.campaign-action-result.modal.edit'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.service('crm.campaign-action-result.tab.service', service);

});
