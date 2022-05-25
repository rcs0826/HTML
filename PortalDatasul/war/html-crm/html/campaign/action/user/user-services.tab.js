/*globals angular, index, define, TOTVSEvent, CRMControl, console */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1001.js',
	'/dts/crm/js/zoom/crm_usuar.js'
], function (index) {

	'use strict';

	var service;

	// *************************************************************************************
	// *** CAMPAIGN > ACTION > USER TAB SERVICE|CONTROLLER
	// *************************************************************************************

	service = function ($rootScope, TOTVSEvent, factory) {

		this.addActionUser = function (action, selectedUsers) {

			if (!selectedUsers) { return; }

			if (selectedUsers.objSelected && selectedUsers.size >= 0) {
				selectedUsers = selectedUsers.objSelected;
			}

			if (!angular.isArray(selectedUsers)) {
				selectedUsers = [selectedUsers];
			}

			var i, selecteds = [];

			for (i = 0; i < selectedUsers.length; i++) {
				if (selectedUsers[i].num_id > 0) {
					selecteds.push(selectedUsers[i].num_id);
				}
			}

			if (selecteds.length === 0) { return; }

			action.ttUsuario = action.ttUsuario || [];

			factory.addCampaignActionUsers(action.num_id, selecteds, function (result) {
				if (!result || result.length === 0) { return; }
				for (i = 0; i < result.length; i++) {
					action.ttUsuario.push(result[i]);
				}
			});

			this.selectedUsers = undefined;
		};

		this.removeActionUser = function (action, user, $index) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-campaign-action-user', [], 'dts/crm').toLowerCase(),
					user.nom_usuar
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteCampaignActionUser(user.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-campaign', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						action.ttUsuario.splice($index, 1);
					});
				}
			});
		};

		this.setActionUserDefault = function (action, user) {

			factory.setCampaignActionUserDefault(user.num_id, function (result) {

				if (!result && result.l_ok === false) { return; }

				var i;

				for (i = 0; i < action.ttUsuario.length; i++) {
					if (action.ttUsuario[i].num_id === user.num_id) {
						action.ttUsuario[i].log_livre_1 = true;
					} else {
						action.ttUsuario[i].log_livre_1 = false;
					}
				}
			});
		};

	};

	service.$inject = [
		'$rootScope', 'TOTVSEvent', 'crm.crm_campanha.factory'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.service('crm.campaign-action-user.tab.service', service);

});
