/*globals index, angular, define, TOTVSEvent, CRMControl, console */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1001.js',
	'/dts/crm/js/zoom/crm_grp_usuar.js'
], function (index) {

	'use strict';

	var service;

	// *************************************************************************************
	// *** CAMPAIGN > ACTION > GROUP TAB SERVICE|CONTROLLER
	// *************************************************************************************

	service = function ($rootScope, TOTVSEvent, factory) {

		this.addActionGroup = function (action, selectedGroups) {

			if (!selectedGroups) { return; }

			if (selectedGroups.objSelected && selectedGroups.size >= 0) {
				selectedGroups = selectedGroups.objSelected;
			}

			if (!angular.isArray(selectedGroups)) {
				selectedGroups = [selectedGroups];
			}

			var i, selecteds = [], CRMControl = this;

			for (i = 0; i < selectedGroups.length; i++) {
				if (selectedGroups[i].num_id > 0) {
					selecteds.push(selectedGroups[i].num_id);
				}
			}

			if (selecteds.length === 0) { return; }

			action.ttGrupo = action.ttGrupo || [];

			factory.addCampaignActionGroups(action.num_id, selecteds, function (result) {

				if (!result || result.length === 0) { return; }

				for (i = 0; i < result.length; i++) {
					action.ttGrupo.push(result[i]);
				}

				CRMControl.reloadActionUsers(action);
			});

			this.selectedGroups = undefined;
		};

		this.setActionGroupDefault = function (action, group) {

			factory.setCampaignActionGroupDefault(group.num_id, function (result) {

				if (!result && result.l_ok === false) { return; }

				var i;

				for (i = 0; i < action.ttGrupo.length; i++) {
					if (action.ttGrupo[i].num_id === group.num_id) {
						action.ttGrupo[i].log_livre_1 = true;
					} else {
						action.ttGrupo[i].log_livre_1 = false;
					}
				}
			});
		};

		this.removeActionGroup = function (action, group, $index) {

			var CRMControl = this;

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-campaign-action-group', [], 'dts/crm').toLowerCase(),
					group.nom_grp_usuar
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteCampaignActionGroup(group.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-campaign', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						action.ttGrupo.splice($index, 1);
						CRMControl.reloadActionUsers(action);
					});
				}
			});
		};

		this.reloadActionUsers = function (action) {

			var i;

			factory.getAllActionsUsers01(action.num_id_campanha, action.num_id_acao, undefined, function (result) {

				if (!result) { return; }

				action.ttUsuario = [];

				for (i = 0; i < result.length; i++) {
					action.ttUsuario.push(result[i]);
				}

			}, false);
		};
	};

	service.$inject = [
		'$rootScope', 'TOTVSEvent', 'crm.crm_campanha.factory'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.service('crm.campaign-action-group.tab.service', service);

});
