/*global angular, define, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1004.js',
	'/dts/crm/js/api/fchcrm1014.js',
	'/dts/crm/js/api/fchcrm1015.js',
	'/dts/crm/js/api/fchcrm1020.js',
	'/dts/crm/js/api/fchcrm1037.js',
	'/dts/crm/js/api/fchcrm1039.js',
	'/dts/crm/js/api/fchcrm1040.js',
	'/dts/crm/js/api/fchcrm1041.js',
	'/dts/crm/js/api/fchcrm1066.js',
	'/dts/crm/js/api/fchcrm1069.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/js/zoom/crm_repres.js',
	'/dts/crm/js/zoom/crm_erp_portad.js',
	'/dts/crm/js/zoom/crm_transpdor.js',
	'/dts/crm/js/zoom/crm_tab_preco.js',
	'/dts/crm/js/zoom/crm_erp_cond_pagto.js'
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
				templateUrl: '/dts/crm/html/customer-group/customer-group.edit.html',
				controller: 'crm.customer-group.edit.control as controller',
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
							helper, groupFactory, legend, ratingFactory,
							carrierFactory, activityLineFactory, representativeFactory, userFactory,
							paymentConditionFactory, bearerFactory, priceTableFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.model = undefined;
		this.editMode = false;

		this.types = undefined;
		this.ratings = [];
		this.representatives = [];
		this.carriers = [];
		this.users = [];
		this.bearers = [];
		this.paymentConditions = [];
		this.priceTables = [];
		this.isIntegrated = false;

		this.personTypes = [
			{num_id: 1, nom_tipo: legend.personalType.NAME(1)},
			{num_id: 2, nom_tipo: legend.personalType.NAME(2)},
			{num_id: 3, nom_tipo: legend.personalType.NAME(3)},
			{num_id: 4, nom_tipo: legend.personalType.NAME(4)}
		];

		this.accesses = [
			{num_id: 1, nom_niv_aces: $rootScope.i18n('l-access-general', [], 'dts/crm')},
			{num_id: 2, nom_niv_aces: $rootScope.i18n('l-access-limited', [], 'dts/crm')}
		];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.getRatings = function () {
			ratingFactory.getAll(function (result) {
				CRMControl.ratings = result;
			}, true);
		};

		this.getCarriers = function (value) {
			if (!value || value === '') {
				return [];
			}

			var filter = { property: 'nom_transpdor', value: helper.parseStrictValue(value) };

			carrierFactory.typeahead(filter, undefined, function (result) {
				CRMControl.carriers = result;
			});
		};

		this.getActivities = function (value) {
			if (!value || value === '') { return []; }

			var filter = { property: 'nom_ramo_ativid',  value: helper.parseStrictValue(value) };

			activityLineFactory.typeahead(filter, undefined, function (result) {
				CRMControl.activities = result;
			});
		};

		this.getRepresentatives = function (value) {
			if (!value || value === '') {
				return [];
			}

			var filter = { property: 'nom_repres', value: helper.parseStrictValue(value) };

			representativeFactory.typeahead(filter, undefined, function (result) {
				CRMControl.representatives = result;
			});
		};

		this.getUsers = function (value) {
			if (!value || value === '') { return []; }
			var filter = { property: 'nom_usuar', value: helper.parseStrictValue(value) };
			userFactory.typeahead(filter, undefined, function (result) {
				CRMControl.users = result;
			});
		};

		this.getPaymentConditions = function (value) {
			if (!value || value === '') {
				return [];
			}

			var filter = { property: 'nom_cond_pagto', value: helper.parseStrictValue(value) };

			paymentConditionFactory.typeahead(filter, undefined, function (result) {
				CRMControl.paymentConditions = result;
			});
		};

		this.getBearers = function (value) {
			if (!value || value === '') {
				return [];
			}

			var filter = { property: 'nom_portador', value: helper.parseStrictValue(value) };

			bearerFactory.typeahead(filter, undefined, function (result) {
				CRMControl.bearers = result;
			});
		};

		this.getPriceTables = function (value) {
			if (!value || value === '') {
				return [];
			}

			var filter = { property: 'nom_tab_preco', value: helper.parseStrictValue(value) };

			priceTableFactory.typeahead(filter, undefined, function (result) {
				CRMControl.priceTables = result;
			});
		};

		this.loadDefaults = function () {
			this.getRatings();
			this.getCarriers();
			this.getActivities();
			this.getRepresentatives();
			this.getUsers();
			this.getPaymentConditions();

			if (this.model.idi_niv_aces > 0) {
				this.model.ttNivelAcesso = this.accesses[this.model.idi_niv_aces - 1];
			}

			if (this.model.idi_natur_clien > 0) {
				this.model.ttTipoPessoa = this.personTypes[this.model.idi_natur_clien - 1];
			}
			this.isIntegrated = (this.model.log_integrad_erp === true || (this.model.cod_grp_clien_erp && this.model.cod_grp_clien_erp.length > 0));
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
				groupFactory.updateRecord(vo.num_id, vo, function (result) {
					if (!result) {
						return;
					}
					CRMControl.afterSave(result);
				});
			} else {
				groupFactory.saveRecord(vo, function (result) {
					if (!result) {
						return;
					}
					CRMControl.afterSave(result);
				});
			}
		};

		this.cancel = function (group) {

			if ($modalInstance) {
				if (group) {
					$modalInstance.close(group);
				} else {
					$modalInstance.dismiss('cancel');
				}
			}
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model;

			if (!model.nom_grp_clien || model.nom_grp_clien.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-name');
			}

			if (!model.ttTipoPessoa || model.ttTipoPessoa.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-nature');
			}

			if (!model.ttClassificacao || model.ttClassificacao.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-classification');
			}

			if (!model.ttTransportadora || model.ttTransportadora.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-carrier');
			}

			if (!model.ttRamoAtividade || model.ttRamoAtividade.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-activity-line');
			}

			if (!model.ttRepresentante || model.ttRepresentante.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-seller');
			}

			if (!model.ttNivelAcesso || model.ttNivelAcesso.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-access-level');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('nav-customer-group', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {},
				model = CRMControl.model;

			vo.num_id = model.num_id;
			vo.nom_grp_clien = model.nom_grp_clien;
			vo.nom_categ_clien = model.nom_categ_clien;
			vo.log_suspenso = model.log_suspenso;
			vo.num_meses_inativ = model.num_meses_inativ;
			vo.num_period_cheq_devolv = model.num_period_cheq_devolv;
			vo.num_atraso_max = model.num_atraso_max;
			vo.val_perc_max_faturam_ped = model.val_perc_max_faturam_ped;
			vo.val_max_cheq_devolv = model.val_max_cheq_devolv;
			vo.num_max_cheq_devolv = model.num_max_cheq_devolv;
			vo.num_period_atraso = model.num_period_atraso;
			vo.val_perc_bonifi = model.val_perc_bonifi;
			vo.val_perc_cancel_quant = model.val_perc_cancel_quant;
			vo.num_dias_atraso = model.num_dias_atraso;
			vo.val_perc_min_faturam_ped = model.val_perc_min_faturam_ped;

			if (model.ttTipoPessoa) {
				vo.idi_natur_clien = model.ttTipoPessoa.num_id;
			}
			if (model.ttClassificacao) {
				vo.num_id_classif = model.ttClassificacao.num_id;
			}
			if (model.ttTransportadora) {
				vo.num_id_transport = model.ttTransportadora.num_id;
			}
			if (model.ttRamoAtividade) {
				vo.num_id_ramo_ativid = model.ttRamoAtividade.num_id;
			}
			if (model.ttRepresentante) {
				vo.num_id_repres = model.ttRepresentante.num_id;
			}
			if (model.ttNivelAcesso) {
				vo.idi_niv_aces = model.ttNivelAcesso.num_id;
			}
			if (model.ttResponsavel) {
				vo.num_id_usuar_respons = model.ttResponsavel.num_id;
			}
			if (model.ttCondicaoPagamento) {
				vo.num_id_cond_pagto = model.ttCondicaoPagamento.num_id;
			}
			if (model.ttPortador) {
				vo.num_id_portad = model.ttPortador.num_id;
			}
			if (model.ttTabelaPreco) {
				vo.num_id_tab_preco = model.ttTabelaPreco.num_id;
			}

			return vo;
		};

		this.afterSave = function (group) {

			if (!group) { return; }

			var message;

			if (CRMControl.editMode) {
				message = 'msg-update-generic';
			} else {
				message = 'msg-save-generic';
			}

			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'success',
				title: $rootScope.i18n('nav-customer-group', [], 'dts/crm'),
				detail: $rootScope.i18n(message, [
					$rootScope.i18n('nav-customer-group', [], 'dts/crm'),
					group.nom_grp_clien
				], 'dts/crm')
			});

			$modalInstance.close(group);

			if (CRMControl.editMode === false) {
				$location.path('/dts/crm/customer-group/detail/' + group.num_id);
			}
		};

		this.init = function () {
			this.validadeParameterModel();
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.model = parameters.group ? angular.copy(parameters.group) : {};

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
		'crm.crm_grp_clien.factory', 'crm.legend', 'crm.crm_clas.factory',
		'crm.crm_transpdor.factory', 'crm.crm_ramo_ativid.factory', 'crm.crm_repres.factory', 'crm.crm_usuar.factory',
		'crm.crm_erp_cond_pagto.factory', 'crm.crm_erp_portad.factory', 'crm.crm_tab_preco.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.customer-group.modal.edit', modal);
	index.register.controller('crm.customer-group.edit.control', controller);
});
