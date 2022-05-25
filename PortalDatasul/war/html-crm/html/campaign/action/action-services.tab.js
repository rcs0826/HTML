/*globals index, define, TOTVSEvent, CRMControl, CRMUtil */
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1001.js',
	'/dts/crm/html/campaign/action/action-services.edit.js',
	'ng-load!/dts/crm/js/libs/3rdparty/ng-draggable/ng-draggable.js'
], function (index) {

	'use strict';

	var service;

	// *************************************************************************************
	// *** CAMPAIGN > ACTION TAB SERVICE|CONTROLLER
	// *************************************************************************************

	service = function ($rootScope, TOTVSEvent, factory, modalActionEdit) {

		this.addEditAction = function (action) {

			var i, sequence = 1, CRMControl = this;

			if (CRMControl.model.ttAcao) {
				sequence = CRMControl.model.ttAcao.length + 1;
			}

			modalActionEdit.open({
				campaign: CRMControl.model.num_id,
				action: action,
				sequence: sequence
			}).then(function (results) {

				results = results || [];

				var i, result;

				for (i = 0; i < results.length; i++) {

					result = results[i];

					if (CRMUtil.isUndefined(result)) { continue; }

					if (CRMUtil.isDefined(action) && action.num_id === result.num_id) {
						for (i = 0; i < CRMControl.model.ttAcao.length; i++) {
							if (CRMControl.model.ttAcao[i].num_id === result.num_id) {
								CRMControl.model.ttAcao[i] = result;
								break;
							}
						}
					} else {
						CRMControl.model.ttAcao = CRMControl.model.ttAcao || [];
						CRMControl.model.ttAcao.push(result);
					}

					CRMControl.selectAction(result);

					if (result.log_acao_default === true) {
						CRMControl.updateCampaignActionDefaultInList(result.num_id);
					}
				}
			});
		};

		this.removeAction = function (action) {

			var CRMControl = this;

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-campaign-action', [], 'dts/crm').toLowerCase(), action.nom_acao
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteCampaignAction(action.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-campaign', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						var i;

						for (i = 0; i < CRMControl.model.ttAcao.length; i++) {
							if (CRMControl.model.ttAcao[i].num_id === action.num_id) {
								CRMControl.model.ttAcao.splice(i, 1);
								CRMControl.selectAction(CRMControl.model.ttAcao[0]);
								break;
							}
						}
					});
				}
			});
		};

		this.selectAction = function (action) {

			var CRMControl = this;

			if (action) {

				if (CRMUtil.isUndefined(CRMControl.selectedAction)) {
					CRMControl.selectedAction = action;
				}

				CRMControl.selectedAction.$selected = false;
				CRMControl.selectedAction = action;
				CRMControl.selectedAction.$selected = true;
			} else {
				CRMControl.selectedAction = undefined;
			}
		};

		this.setAsDefaultAction = function (action) {

			var CRMControl = this;

			factory.setCampaignActionAsDefault(action.num_id, function (result) {

				if (!result && result.l_ok === false) { return; }

				CRMControl.updateCampaignActionDefaultInList(action.num_id);
			});
		};

		this.updateCampaignActionDefaultInList = function (idDefault) {

			var i, CRMControl = this;

			for (i = 0; i < CRMControl.model.ttAcao.length; i++) {
				if (CRMControl.model.ttAcao[i].num_id === idDefault) {
					CRMControl.model.ttAcao[i].log_acao_default = true;
				} else {
					CRMControl.model.ttAcao[i].log_acao_default = false;
				}
			}
		};

		this.onCampaignActionDropComplete = function ($to, $data, $event) {

			var i,
				$from,
				action,
				newOrder = [],
				CRMControl = this;

			// $from = $data.num_ord_acao - 1;
			for (i = 0; i < CRMControl.model.ttAcao.length; i++) {

				action = CRMControl.model.ttAcao[i];

				if (action.num_id === $data.num_id) {
					$from = i;
					break;
				}
			}

			CRMControl.model.ttAcao.move($from, $to);

			for (i = 0; i < CRMControl.model.ttAcao.length; i++) {
				action = CRMControl.model.ttAcao[i];
				action.num_ord_acao = i + 1;
				newOrder.push(action.num_id);
			}

			factory.reorderCampaignActions(newOrder);
		};
	};

	service.$inject = [
		'$rootScope', 'TOTVSEvent', 'crm.crm_campanha.factory', 'crm.campaign-action.modal.edit'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.service('crm.campaign-action.tab.service', service);

});
