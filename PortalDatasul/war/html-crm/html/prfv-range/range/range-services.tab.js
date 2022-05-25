/*globals index, define, TOTVSEvent, CRMControl, console, angular */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/html/prfv-range/range/range-services.edit.js'
], function (index) {
	'use strict';

	var service;

	service = function ($rootScope, TOTVSEvent, factory, modalRangeEdit) {

		var CRMControl = this;

		this.colors = [
			{num_id: 1, nom_cor: $rootScope.i18n('l-color-yellow', [], 'dts/crm')},
			{num_id: 2, nom_cor: $rootScope.i18n('l-color-orange', [], 'dts/crm')},
			{num_id: 3, nom_cor: $rootScope.i18n('l-color-red', [], 'dts/crm')},
			{num_id: 4, nom_cor: $rootScope.i18n('l-color-pink', [], 'dts/crm')},
			{num_id: 5, nom_cor: $rootScope.i18n('l-color-dark-blue', [], 'dts/crm')},
			{num_id: 6, nom_cor: $rootScope.i18n('l-color-light-blue', [], 'dts/crm')},
			{num_id: 7, nom_cor: $rootScope.i18n('l-color-green', [], 'dts/crm')},
			{num_id: 8, nom_cor: $rootScope.i18n('l-color-brown', [], 'dts/crm')},
			{num_id: 9, nom_cor: $rootScope.i18n('l-color-black', [], 'dts/crm')},
			{num_id: 10, nom_cor: $rootScope.i18n('l-color-silver', [], 'dts/crm')},
			{num_id: 11, nom_cor: $rootScope.i18n('l-color-white', [], 'dts/crm')},
			{num_id: 12, nom_cor: $rootScope.i18n('l-color-violet', [], 'dts/crm')}
		];

		this.addEditRange = function (model, range) {
			var i, isEditMode;

			isEditMode = range ? true : false;

			modalRangeEdit.open({
				range: range ? angular.copy(range) : {},
				headerRangeId: model.num_id
			}).then(function (result) {
				if (result) {
					if (!model.ttFaixa) {
						model.ttFaixa = [];
					}

					if (isEditMode) {
						if (result && result.length > 0) {
							for (i = 0; i < model.ttFaixa.length; i++) {
								if (result[0].num_id === model.ttFaixa[i].num_id) {
									model.ttFaixa[i] = result[0];
									model.ttFaixa[i].ttCor = CRMControl.colors[result[0].idi_cor_con - 1];
									break;
								}
							}
						}
					} else {
						for (i = 0; i < result.length; i++) {
							result[i].ttCor = CRMControl.colors[result[i].idi_cor_con - 1];
							model.ttFaixa.push(result[i]);
						}
					}

					model.ttFaixa.sort(function (a, b) {
						if (a.vli_inicial < b.vli_inicial) {
							return -1;
						}
						if (a.vli_inicial > b.vli_inicial) {
							return 1;
						}

						return 0;
					});
				}
			});
		};

		this.removeRange = function (list, item, index) {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-ranges', [], 'dts/crm').toLowerCase(), item.des_faixa_prfv
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteRange(item.num_id, function (result) {
						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-ranges', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						list.splice(index, 1);
					});
				}
			});
		};
	};

	service.$inject = [
		'$rootScope', 'TOTVSEvent', 'crm.crm_prfv_faixa_cabec.factory', 'crm.crm_faixa.modal.edit'
	];

	// ########################################################
	// ### Register
	// ########################################################
	index.register.service('crm.range.service', service);

});
