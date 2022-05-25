/*globals index, define, TOTVSEvent, CRMControl, console, angular */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/html/prfv-parameter/source/source-services.edit.js'
], function (index) {
	'use strict';

	var service;

	service = function ($rootScope, TOTVSEvent, factory, modalSourceEdit) {

		var CRMControl = this;

		this.prfvSources = [
			{num_id: 1, nom_fonte: $rootScope.i18n('l-prfv-source-open', [], 'dts/crm')},
			{num_id: 2, nom_fonte: $rootScope.i18n('l-prfv-source-partial', [], 'dts/crm')},
			{num_id: 3, nom_fonte: $rootScope.i18n('l-prfv-source-total', [], 'dts/crm')},
			{num_id: 4, nom_fonte: $rootScope.i18n('l-prfv-source-suspended', [], 'dts/crm')},
			{num_id: 5, nom_fonte: $rootScope.i18n('l-prfv-source-canceled', [], 'dts/crm')}
		];

		this.addEditSource = function (model, source) {
			var i, isEditMode;

			isEditMode = source ? true : false;

			modalSourceEdit.open({
				source: source ? angular.copy(source) : {},
				parameterId: model.num_id
			}).then(function (result) {
				if (result) {
					if (!model.ttFonte) {
						model.ttFonte = [];
					}

					if (isEditMode) {
						if (result && result.length > 0) {
							for (i = 0; i < model.ttFonte.length; i++) {
								if (result[0].num_id === model.ttFonte[i].num_id) {
									model.ttFonte[i] = result[0];
									model.ttFonte[i].ttPRFVFonte = CRMControl.prfvSources[result[0].idi_status_ped - 1];
									break;
								}
							}
						}
					} else {
						for (i = 0; i < result.length; i++) {
							result[i].ttPRFVFonte = CRMControl.prfvSources[result[i].idi_status_ped - 1];
							model.ttFonte.push(result[i]);
						}
					}

					model.ttFonte.sort(function (a, b) {
						if (a.num_id < b.num_id) {
							return -1;
						}
						if (a.num_id > b.num_id) {
							return 1;
						}

						return 0;
					});
				}
			});
		};

		this.removeSource = function (list, item, index) {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('nav-prfv-sources', [], 'dts/crm').toLowerCase(), item.ttPRFVFonte.nom_fonte
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteSource(item.num_id, function (result) {
						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-prfv-sources', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						list.splice(index, 1);
					});
				}
			});
		};
	};

	service.$inject = [
		'$rootScope', 'TOTVSEvent', 'crm.crm_param_prfv.factory', 'crm.crm_prfv_ped.modal.edit'
	];

	// ########################################################
	// ### Register
	// ########################################################
	index.register.service('crm.source-parameter.service', service);

});
