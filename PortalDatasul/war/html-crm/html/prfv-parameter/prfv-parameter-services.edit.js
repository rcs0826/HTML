/*global angular, define, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1027.js',
	'/dts/crm/js/api/fchcrm1054.js',
	'/dts/crm/js/api/fchcrm1116.js',
	'/dts/crm/js/api/fchcrm1117.js'
], function (index) {

	'use strict';

	var modal,
		controller;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************

	modal = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/prfv-parameter/prfv-parameter.edit.html',
				controller: 'crm.prfv-parameter.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};

	modal.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER EDIT
	// *************************************************************************************

	controller = function ($rootScope, $scope, $location, $modalInstance, parameters, TOTVSEvent,
							helper, parameterFactory, legend, potencialityFactory, publicFactory, prfvBandFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.model = undefined;
		this.editMode = false;

		this.potentialities = [];
		this.publics = [];
		this.bands = [];

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

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.getPotentialities = function (value) {
			if (!value || value === '') { return []; }

			var filter = { property: 'nom_potencd',  value: helper.parseStrictValue(value) };

			potencialityFactory.typeahead(filter, undefined, function (result) {
				CRMControl.potentialities = result;
			});
		};

		this.getPublics = function (value) {
			if (!value || value === '') { return []; }

			var filter = { property: 'nom_public_alvo',  value: helper.parseStrictValue(value) };

			publicFactory.typeahead(filter, undefined, function (result) {
				CRMControl.publics = result;
			});
		};

		this.getPRFVBands = function (value) {
			if (!value || value === '') { return []; }

			var filter = { property: 'des_faixa_prfv',  value: helper.parseStrictValue(value) };

			prfvBandFactory.typeahead(filter, undefined, function (result) {
				CRMControl.bands = result;
			});
		};

		this.onChangeFrequency = function () {
			this.model.qti_sema = undefined;
		}

		this.loadDefaults = function () {

			if (this.editMode) {
				if (this.model.idi_tip_calc_prfv > 0) {
					this.model.ttTipoPRFV = this.types[this.model.idi_tip_calc_prfv - 1];
				}

				if (this.model.idi_fonte_prfv > 0) {
					this.model.ttFontePRFV = this.sources[this.model.idi_fonte_prfv - 1];
				}

				if (this.model.idi_calc_freq > 0) {
					this.model.ttFrequencia = this.frequencies[this.model.idi_calc_freq - 1];
				}

			} else {
				this.model.ttTipoPRFV = this.types[0];
				this.model.ttFontePRFV = this.sources[0];
				this.model.ttFrequencia = this.frequencies[0];
				this.model.qti_recenc_poster_a = 1;
				this.model.qti_freq_poster_a = 1;
				this.model.qti_val_poster_a = 1;
				this.model.dat_recenc_poster_a = new Date();
				this.model.dat_freq_poster_a = new Date();
				this.model.dat_val_poster_a = new Date();
			}

		};

		this.validadeParameterModel = function () {

			var model = this.model || {};

			this.editMode = (model.num_id > 0);
			this.loadDefaults();
		};

		this.save = function () {

			if (CRMControl.isInvalidForm()) { return; }

			var vo = CRMControl.convertToSave();

			if (!vo) { return; }

			if (CRMControl.editMode === true) {
				parameterFactory.updateRecord(vo.num_id, vo, function (result) {
					if (!result) {
						return;
					}
					CRMControl.afterSave(result);
				});
			} else {
				parameterFactory.saveRecord(vo, function (result) {
					if (!result) {
						return;
					}
					CRMControl.afterSave(result);
				});
			}
		};

		this.cancel = function (parameter) {

			if ($modalInstance) {
				if (parameter) {
					$modalInstance.close(parameter);
				} else {
					$modalInstance.dismiss('cancel');
				}
			}
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model;

			if (!model.des_prfv || model.des_prfv.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-name');
			}

			if (!model.ttPRFVFaixa || model.ttPRFVFaixa.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-prfv-band');
			}

			if (!model.ttTipoPRFV || model.ttTipoPRFV.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-prfv-evaluate-type');
			}

			if (!model.ttPublico || model.ttPublico.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-public');
			}

			if (!model.ttFontePRFV || model.ttFontePRFV.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-font');
			}

			if (!model.ttPotencialidade || model.ttPotencialidade.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-potential');
			}

			if (!model.qti_recenc_poster_a || model.qti_recenc_poster_a < 1) {
				isInvalidForm = true;
				messages.push('l-recency-weight');
			}

			if (!model.dat_recenc_poster_a) {
				isInvalidForm = true;
				messages.push('l-posterior-recency');
			}

			if (!model.dat_freq_poster_a) {
				isInvalidForm = true;
				messages.push('l-posterior-frequency');
			}

			if (!model.ttFrequencia || model.ttFrequencia.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-frequency');
			}

			if ((model.ttFrequencia && model.ttFrequencia.num_id === 1) && (!model.qti_sema || model.qti_sema < 1)) {
				isInvalidForm = true;
				messages.push('l-weeks');
			}

			if (!model.qti_freq_poster_a || model.qti_freq_poster_a < 1) {
				isInvalidForm = true;
				messages.push('l-frequency-weight');
			}

			if (!model.qti_val_poster_a || model.qti_val_poster_a < 1) {
				isInvalidForm = true;
				messages.push('l-value-weight');
			}

			if (!model.dat_val_poster_a) {
				isInvalidForm = true;
				messages.push('l-posterior-value');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('nav-prfv-parameter', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {},
				model = CRMControl.model;

			vo.num_id = model.num_id;
			vo.des_prfv = model.des_prfv;
			vo.dat_recenc_poster_a = model.dat_recenc_poster_a;
			vo.qti_recenc_poster_a = model.qti_recenc_poster_a;
			vo.qti_freq_poster_a = model.qti_freq_poster_a;
			vo.qti_val_poster_a = model.qti_val_poster_a;
			vo.dat_freq_poster_a = model.dat_freq_poster_a;
			vo.dat_val_poster_a = model.dat_val_poster_a;
			vo.num_dias_atraso = model.num_dias_atraso;
			vo.qti_sema = model.qti_sema;

			if (model.ttFontePRFV) {
				vo.idi_fonte_prfv = model.ttFontePRFV.num_id;
			}
			if (model.ttTipoPRFV) {
				vo.idi_tip_calc_prfv = model.ttTipoPRFV.num_id;
			}
			if (model.ttPRFVFaixa) {
				vo.num_id_faixa = model.ttPRFVFaixa.num_id;
			}
			if (model.ttPublico) {
				vo.num_id_public = model.ttPublico.num_id;
			}
			if (model.ttPotencialidade) {
				vo.num_id_potencd = model.ttPotencialidade.num_id;
			}
			if (model.ttFrequencia) {
				vo.idi_calc_freq = model.ttFrequencia.num_id;
			}

			return vo;
		};

		this.afterSave = function (parameter) {

			if (!parameter) { return; }

			var message;

			if (CRMControl.editMode) {
				message = 'msg-update-generic';
			} else {
				message = 'msg-save-generic';
			}

			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'success',
				title: $rootScope.i18n('nav-prfv-parameter', [], 'dts/crm'),
				detail: $rootScope.i18n(message, [
					$rootScope.i18n('nav-prfv-parameter', [], 'dts/crm'),
					parameter.des_prfv
				], 'dts/crm')
			});

			$modalInstance.close(parameter);

			if (CRMControl.editMode === false) {
				$location.path('/dts/crm/prfv-parameter/detail/' + parameter.num_id);
			}
		};

		this.init = function () {
			this.validadeParameterModel();
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.model = parameters.parameter ? angular.copy(parameters.parameter) : {};

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControl = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			$modalInstance.dismiss('cancel');
		});
	};

	controller.$inject = [
		'$rootScope', '$scope', '$location', '$modalInstance', 'parameters', 'TOTVSEvent', 'crm.helper',
		'crm.crm_param_prfv.factory', 'crm.legend', 'crm.crm_potencd.factory', 'crm.crm_public.factory', 'crm.crm_prfv_faixa_cabec.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.prfv-parameter.modal.edit', modal);
	index.register.controller('crm.prfv-parameter.edit.control', controller);
});

