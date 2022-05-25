/*globals index, define, TOTVSEvent, CRMControl, console */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1001.js',
	'/dts/crm/html/campaign/action/objective/objective-services.select.js'
], function (index) {

	'use strict';

	var service;

	// *************************************************************************************
	// *** CAMPAIGN > ACTION > OBJECTIVE TAB SERVICE|CONTROLLER
	// *************************************************************************************

	service = function ($rootScope, TOTVSEvent, factory, modalSelection) {

		this.selectObjectives = function (action) {

			action.ttObjetivo = action.ttObjetivo || [];

			modalSelection.open({
				action: action.num_id,
				actionObjectives: action.ttObjetivo
			}).then(function (result) {

				if (!result) { return; }

				var i;

				action.ttObjetivo = action.ttObjetivo || [];

				for (i = 0; i < result.length; i++) {

					if (i === 0 && action.ttObjetivo.length === 0) {
						result[i].log_objet_default = true;
					}

					action.ttObjetivo.push(result[i]);
				}
			});
		};

		this.removeActionObjective = function (action, objective, $index) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-campaign-action-objective', [], 'dts/crm').toLowerCase(),
					objective.nom_objet_acao
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteCampaignActionObjective(objective.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-campaign', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						action.ttObjetivo.splice($index, 1);
					});
				}
			});
		};

		this.setAsActionObjectiveDefault = function (action, objective) {

			factory.setCampaignActionObjectiveAsDefault(objective.num_id, function (result) {

				if (!result && result.l_ok === false) { return; }

				var i;

				for (i = 0; i < action.ttObjetivo.length; i++) {
					if (action.ttObjetivo[i].num_id === objective.num_id) {
						action.ttObjetivo[i].log_objet_default = true;
					} else {
						action.ttObjetivo[i].log_objet_default = false;
					}
				}
			});
		};
	};

	service.$inject = [
		'$rootScope', 'TOTVSEvent', 'crm.crm_campanha.factory', 'crm.campaign-action-objective.modal.selection'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.service('crm.campaign-action-objective.tab.service', service);

});
