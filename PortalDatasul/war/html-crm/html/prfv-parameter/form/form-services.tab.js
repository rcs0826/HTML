/*globals index, define, TOTVSEvent, CRMControl, console, angular */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/html/prfv-parameter/form/form-services.edit.js'
], function (index) {
	'use strict';

	var service;

	service = function ($rootScope, TOTVSEvent, factory, modalFormEdit) {

		var CRMControl = this;

		this.prfvForms = [
			{num_id: 1, nom_form: $rootScope.i18n('l-prfv-form-global', [], 'dts/crm')},
			{num_id: 2, nom_form: $rootScope.i18n('l-prfv-form-customer-type', [], 'dts/crm')},
			{num_id: 3, nom_form: $rootScope.i18n('l-prfv-form-activity-field', [], 'dts/crm')},
			{num_id: 4, nom_form: $rootScope.i18n('l-prfv-form-customer-group', [], 'dts/crm')},
			{num_id: 5, nom_form: $rootScope.i18n('l-prfv-form-classification', [], 'dts/crm')},
			{num_id: 6, nom_form: $rootScope.i18n('l-prfv-form-person-type', [], 'dts/crm')},
			{num_id: 7, nom_form: $rootScope.i18n('l-prfv-form-country', [], 'dts/crm')},
			{num_id: 8, nom_form: $rootScope.i18n('l-prfv-form-state', [], 'dts/crm')},
			{num_id: 9, nom_form: $rootScope.i18n('l-prfv-form-region', [], 'dts/crm')},
			{num_id: 10, nom_form: $rootScope.i18n('l-prfv-form-representative', [], 'dts/crm')},
			{num_id: 11, nom_form: $rootScope.i18n('l-prfv-form-sale-channel', [], 'dts/crm')}
		];

		this.addEditForm = function (model, prfvForm) {
			var i, isEditMode;

			isEditMode = prfvForm ? true : false;

			modalFormEdit.open({
				prfvForm: prfvForm ? angular.copy(prfvForm) : {},
				parameterId: model.num_id
			}).then(function (result) {
				if (result) {
					if (!model.ttForma) {
						model.ttForma = [];
					}

					if (isEditMode) {
						if (result && result.length > 0) {
							for (i = 0; i < model.ttForma.length; i++) {
								if (result[0].num_id === model.ttForma[i].num_id) {
									model.ttForma[i] = result[0];
									model.ttForma[i].ttPRFVForma = CRMControl.prfvForms[result[0].idi_forma_calc_prfv - 1];
									break;
								}
							}
						}
					} else {
						for (i = 0; i < result.length; i++) {
							result[i].ttPRFVForma = CRMControl.prfvForms[result[i].idi_forma_calc_prfv - 1];
							model.ttForma.push(result[i]);
						}
					}

					model.ttForma.sort(function (a, b) {
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

		this.removeForm = function (list, item, index) {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('nav-prfv-forms', [], 'dts/crm').toLowerCase(), item.ttPRFVForma.nom_form
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteForm(item.num_id, function (result) {
						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-prfv-forms', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						list.splice(index, 1);
					});
				}
			});
		};
	};

	service.$inject = [
		'$rootScope', 'TOTVSEvent', 'crm.crm_param_prfv.factory', 'crm.crm_prfv_forma.modal.edit'
	];

	// ########################################################
	// ### Register
	// ########################################################
	index.register.service('crm.form-parameter.service', service);

});
