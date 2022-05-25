/*globals index, define, TOTVSEvent, CRMControl, console */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1001.js',
	'/dts/crm/html/campaign/action/media/media-services.select.js'
], function (index) {

	'use strict';

	var service;

	// *************************************************************************************
	// *** CAMPAIGN > ACTION > MEDIA TAB SERVICE|CONTROLLER
	// *************************************************************************************

	service = function ($rootScope, TOTVSEvent, factory, modalSelection) {

		this.selectMedias = function (action) {

			action.ttMidia = action.ttMidia || [];

			modalSelection.open({
				action: action.num_id,
				actionMedias: action.ttMidia
			}).then(function (result) {

				if (!result) { return; }

				var i;

				action.ttMidia = action.ttMidia || [];

				for (i = 0; i < result.length; i++) {

					if (i === 0 && action.ttMidia.length === 0) {
						result[i].log_mid_default = true;
					}

					action.ttMidia.push(result[i]);
				}
			});
		};

		this.removeActionMedia = function (action, media, $index) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-campaign-action-media', [], 'dts/crm').toLowerCase(),
					media.nom_mid_relacto
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteCampaignActionMedia(media.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-campaign', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						action.ttMidia.splice($index, 1);
					});
				}
			});
		};

		this.setAsActionMediaDefault = function (action, media) {

			factory.setCampaignActionMediaAsDefault(media.num_id, function (result) {

				if (!result && result.l_ok === false) { return; }

				var i;

				for (i = 0; i < action.ttMidia.length; i++) {
					if (action.ttMidia[i].num_id === media.num_id) {
						action.ttMidia[i].log_mid_default = true;
					} else {
						action.ttMidia[i].log_mid_default = false;
					}
				}
			});
		};
	};

	service.$inject = [
		'$rootScope', 'TOTVSEvent', 'crm.crm_campanha.factory', 'crm.campaign-action-media.modal.selection'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.service('crm.campaign-action-media.tab.service', service);

});
