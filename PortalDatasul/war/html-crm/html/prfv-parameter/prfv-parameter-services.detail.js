/*globals define, angular */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1116.js',
	'/dts/crm/html/prfv-parameter/form/form-services.tab.js',
	'/dts/crm/html/prfv-parameter/source/source-services.tab.js'
], function (index) {

	'use strict';

	var controller;

	// *************************************************************************************
	// *** CONTROLLER - DETAIL
	// *************************************************************************************

	controller = function ($rootScope, $scope, $stateParams, $location, TOTVSEvent, helper,
							factory, modalEdit, legend, serviceFormTab, serviceSourceTab) {

		var CRMControl = this;

		this.model = undefined;

		angular.extend(this, serviceFormTab);
		angular.extend(this, serviceSourceTab);

		this.types = [
			{num_id: 1, nom_tipo: $rootScope.i18n('l-standard', [], 'dts/crm')},
			{num_id: 2, nom_tipo: $rootScope.i18n('l-percentage', [], 'dts/crm')}
		];

		this.sources = [
			{num_id: 1, nom_fonte: $rootScope.i18n('l-orders', [], 'dts/crm')},
			{num_id: 2, nom_fonte: $rootScope.i18n('l-invoices', [], 'dts/crm')}
		];

		this.frequencies = [
			{num_id: 1, nom_frequencia: legend.calculationFrequency.NAME(1)},
			{num_id: 2, nom_frequencia: legend.calculationFrequency.NAME(2)},
			{num_id: 3, nom_frequencia: legend.calculationFrequency.NAME(3)},
			{num_id: 4, nom_frequencia: legend.calculationFrequency.NAME(4)},
			{num_id: 5, nom_frequencia: legend.calculationFrequency.NAME(5)},
			{num_id: 6, nom_frequencia: legend.calculationFrequency.NAME(6)}
		];

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

		this.prfvSources = [
			{num_id: 1, nom_fonte: $rootScope.i18n('l-prfv-source-open', [], 'dts/crm')},
			{num_id: 2, nom_fonte: $rootScope.i18n('l-prfv-source-partial', [], 'dts/crm')},
			{num_id: 3, nom_fonte: $rootScope.i18n('l-prfv-source-total', [], 'dts/crm')},
			{num_id: 4, nom_fonte: $rootScope.i18n('l-prfv-source-suspended', [], 'dts/crm')},
			{num_id: 5, nom_fonte: $rootScope.i18n('l-prfv-source-canceled', [], 'dts/crm')}
		];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.loadDefaults = function () {
			var i = 0;

			if (CRMControl.model.idi_tip_calc_prfv > 0) {
				CRMControl.model.ttTipoPRFV = CRMControl.types[CRMControl.model.idi_tip_calc_prfv - 1];
			}

			if (CRMControl.model.idi_fonte_prfv > 0) {
				CRMControl.model.ttFontePRFV = CRMControl.sources[CRMControl.model.idi_fonte_prfv - 1];
			}

			if (CRMControl.model.idi_calc_freq > 0) {
				CRMControl.model.ttFrequencia = CRMControl.frequencies[CRMControl.model.idi_calc_freq - 1];
			}

			if (CRMControl.model.ttForma) {
				for (i = 0; i < CRMControl.model.ttForma.length; i++) {
					if (CRMControl.model.ttForma[i].idi_forma_calc_prfv > 0) {
						CRMControl.model.ttForma[i].ttPRFVForma = CRMControl.prfvForms[CRMControl.model.ttForma[i].idi_forma_calc_prfv - 1];
					}
				}
			}

			if (CRMControl.model.ttFonte) {
				for (i = 0; i < CRMControl.model.ttFonte.length; i++) {
					if (CRMControl.model.ttFonte[i].idi_status_ped > 0) {
						CRMControl.model.ttFonte[i].ttPRFVFonte = CRMControl.prfvSources[CRMControl.model.ttFonte[i].idi_status_ped - 1];
					}
				}
			}
		};

		this.load = function (id) {
			factory.getRecord(id, function (result) {
				if (result) {
					CRMControl.model = result;
					CRMControl.loadDefaults();
				}
			});
		};

		this.onEdit = function () {
			modalEdit.open({
				parameter: CRMControl.model
			}).then(function (result) {
				if (result) {
					CRMControl.model = result;
					CRMControl.loadDefaults();
				}
			});
		};

		this.onRemove = function () {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('nav-prfv-parameter', [], 'dts/crm').toLowerCase(), CRMControl.model.des_prfv
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteRecord(CRMControl.model.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-prfv-parameter', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						$location.path('/dts/crm/prfv-parameter/');
					});
				}
			});
		};

		// *********************************************************************************
		// *** Initialize
		// *********************************************************************************

		this.init = function () {

			var viewName = $rootScope.i18n('nav-prfv-parameter', [], 'dts/crm'),
				viewController = 'crm.prfv-parameter.detail.control';

			helper.loadCRMContext(function () {

				helper.startView(viewName, viewController, CRMControl);

				CRMControl.model = undefined;

				if ($stateParams && $stateParams.id) {
					CRMControl.load($stateParams.id);
				}
			});
		};

		if ($rootScope.currentuserLoaded) { CRMControl.init(); }

		// *********************************************************************************
		// *** Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControl = undefined;
		});

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			CRMControl.init();
		});
	};

	controller.$inject = [
		'$rootScope', '$scope', '$stateParams', '$location', 'TOTVSEvent', 'crm.helper',
		'crm.crm_param_prfv.factory', 'crm.prfv-parameter.modal.edit', 'crm.legend',
		'crm.form-parameter.service', 'crm.source-parameter.service'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.controller('crm.prfv-parameter.detail.control', controller);

});
