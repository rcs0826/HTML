/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1003.js',
	'/dts/crm/js/api/fchcrm1008.js',
	'/dts/crm/js/api/fchcrm1009.js',
	'/dts/crm/js/api/fchcrm1010.js',
	'/dts/crm/js/api/fchcrm1011.js',
	'/dts/crm/js/api/fchcrm1012.js',
	'/dts/crm/js/api/fchcrm1013.js',
	'/dts/crm/js/api/fchcrm1014.js',
	'/dts/crm/js/api/fchcrm1015.js',
	'/dts/crm/js/api/fchcrm1016.js',
	'/dts/crm/js/api/fchcrm1017.js',
	'/dts/crm/js/api/fchcrm1018.js',
	'/dts/crm/js/api/fchcrm1023.js',
	'/dts/crm/js/api/fchcrm1024.js',
	'/dts/crm/js/api/fchcrm1025.js',
	'/dts/crm/js/api/fchcrm1026.js',
	'/dts/crm/js/api/fchcrm1027.js',
	'/dts/crm/js/api/fchcrm1037.js',
	'/dts/crm/js/api/fchcrm1038.js',
	'/dts/crm/js/api/fchcrm1039.js',
	'/dts/crm/js/api/fchcrm1040.js',
	'/dts/crm/js/api/fchcrm1041.js',
	'/dts/crm/js/api/fchcrm1042.js',
	'/dts/crm/js/api/fchcrm1043.js',
	'/dts/crm/js/api/fchcrm1044.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/api/fchcrm1049.js',
	'/dts/crm/js/api/fchcrm1059.js',
	'/dts/crm/js/api/fchcrm1063.js',
	'/dts/crm/js/api/fchcrm1064.js',
	'/dts/crm/js/api/fchcrm1065.js',
	'/dts/crm/js/api/fchcrm1066.js',
	'/dts/crm/js/api/fchcrm1067.js',
	'/dts/crm/js/api/fchcrm1083.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/js/zoom/crm_pessoa.js',
	'/dts/crm/js/zoom/crm_repres.js',
	'/dts/crm/js/zoom/crm_regiao.js',
	'/dts/crm/js/zoom/crm_erp_portad.js',
	'/dts/crm/js/zoom/crm_transpdor.js',
	'/dts/crm/js/zoom/crm_erp_cond_pagto.js',
	'/dts/crm/js/zoom/crm_erp_natur_operac.js',
	'/dts/crm/html/prfv/prfv-services.list.js',
	'/dts/crm/html/prfv/prfv-services.summary.js',
	'/dts/crm/html/prfv/prfv-services.advanced-search.js',
	'/dts/crm/html/task/task-services.advanced-search.js',
	'/dts/crm/html/task/task-services.calendar.js',
	'/dts/crm/html/task/task-services.detail.js',
	'/dts/crm/html/task/task-services.edit.js',
	'/dts/crm/html/task/task-services.list.js',
	'/dts/crm/html/user/user-services.js',
	'/dts/crm/html/ticket/ticket-services.list.js',
	'/dts/crm/html/ticket/ticket-services.detail.js',
	'/dts/crm/html/ticket/ticket-services.edit.js',
	'/dts/crm/html/ticket/ticket-services.advanced-search.js',
	'/dts/crm/html/history/history-services.list.js',
	'/dts/crm/html/history/history-services.detail.js',
	'/dts/crm/html/history/history-services.advanced-search.js',
	'/dts/crm/html/history/history-services.edit.js',
	'/dts/crm/html/opportunity/opportunity-services.list.js',
	'/dts/crm/html/opportunity/opportunity-services.edit.js',
	'/dts/crm/html/opportunity/opportunity-services.detail.js',
	'/dts/crm/html/opportunity/opportunity-services.advanced-search.js',
	'/dts/crm/html/account/phone/phone-services.js',
	'/dts/crm/html/account/style/style-services.tab.js',
	'/dts/crm/html/account/style/style-services.selection.js',
	'/dts/crm/html/account/address/address-services.js',
	'/dts/crm/html/account/contact/contact-services.tab.js',
	'/dts/crm/html/account/contact/contact-services.edit.js',
	'/dts/crm/html/account/potential/potential-services.js',
	'/dts/crm/html/account/observation/observation-services.js',
	'/dts/crm/html/report/report-services.list.js',
	'/dts/crm/html/report/report-services.edit.js',
	'/dts/crm/html/report/report-services.detail.js',
	'/dts/crm/html/report/report-services.available.js',
	'/dts/crm/html/report/report-services.parameter.js',
	'/dts/crm/html/report/report-services.advanced-search.js',
	'/dts/crm/html/account/document/document-services.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var	modalAccountAdvancedSearch,
		controllerAccountAdvancedSearch;

	// *************************************************************************************
	// *** MODAL ADVANCED SEARCH
	// *************************************************************************************
	modalAccountAdvancedSearch = function ($modal) {

		this.open = function (params) {

			var instance = $modal.open({
				templateUrl: '/dts/crm/html/account/account.advanced.search.html',
				controller: 'crm.account.advanced.search.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});

			return instance.result;
		};
	};

	modalAccountAdvancedSearch.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER ADVANCED SEARCH
	// *************************************************************************************

	controllerAccountAdvancedSearch = function ($rootScope, $scope, $modalInstance, TOTVSEvent, parameters,
											 legend, helper, userFactory, contactFactory,
											 federationFactory, cityFactory, representativeFactory,
											 accountRatingFactory, sourceFactory, regionFactory,
											 clientTypeFactory, accountHelper, filterHelper, clientGroupFactory,
											 preferenceFactory, documentTypeFactory, educationalLevelFactory, treatmentFactory, activityLineFactory, maritalStatusFactory, attributeHelper, attributeFactory, accessRestrictionFactory, taskPreferenceFinancialFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlAccountAdvancedSearch = this;

		this.accessRestriction = undefined;

		this.disclaimers = undefined;
		this.model = undefined;

		this.users = [];
		this.clientTypes = [];
		this.clientGroups = [];
		this.representatives = [];
		this.sources = [];
		this.federations = [];
		this.cities = [];
		this.ratings = [];
		this.regions = [];
		this.documentTypes = [];
		this.isIntegratedWithGP = undefined;
		this.financialStatusLastExecution = undefined;

		this.financialSituationOptions = [
			{value: true, label: $rootScope.i18n('l-overdue', [])},
			{value: false, label: $rootScope.i18n('l-defaulter', [])}
		];

		this.accountTypes = [
			{num_id: 1, nom_tipo: legend.accountType.NAME(1)},
			{num_id: 2, nom_tipo: legend.accountType.NAME(2)},
			{num_id: 3, nom_tipo: legend.accountType.NAME(3)},
			{num_id: 4, nom_tipo: legend.accountType.NAME(4)},
			{num_id: 5, nom_tipo: legend.accountType.NAME(5)},
			{num_id: 6, nom_tipo: legend.accountType.NAME(6)},
			{num_id: 7, nom_tipo: legend.accountType.NAME(7)},
			{num_id: 8, nom_tipo: legend.accountType.NAME(8)}
		];

		this.personTypes = [
			{num_id: 1, nom_tipo: legend.personalType.NAME(1)},
			{num_id: 2, nom_tipo: legend.personalType.NAME(2)},
			{num_id: 3, nom_tipo: legend.personalType.NAME(3)},
			{num_id: 4, nom_tipo: legend.personalType.NAME(4)}
		];

		this.sexs = [
			{num_id: 1, nom_sex: $rootScope.i18n('l-male', [], 'dts/crm')},
			{num_id: 2, nom_sex: $rootScope.i18n('l-female', [], 'dts/crm')}
		];

		this.typeProviders = [
			{num_id: 1, nom_type_provider: $rootScope.i18n('l-doctor', [], 'dts/crm')},
			{num_id: 2, nom_type_provider: $rootScope.i18n('l-cooperative', [], 'dts/crm')}
		];

		this.status = [];

		//filtroCustom
		this.isEdit = false;
		this.customFilter = {};

		this.customFields = [];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.apply = function (doApply) {

			var closeObj = {},
				disclaimers;

			this.parseModelToDisclaimers();

			if (accountHelper.isPhoneFilterInvalid(this.disclaimers)) {
				return;
			}

			parameters.fixedDisclaimers = parameters.fixedDisclaimers || [];

			disclaimers = parameters.fixedDisclaimers.concat(this.disclaimers);

			disclaimers = filterHelper.clearDisclaimersModel(disclaimers);

			if (this.isAddEditMode !== true) {
				doApply = true;
			}

			closeObj.disclaimers = disclaimers;

			if (this.isAddEditMode === true) {

				if (this.isInvalidForm(this.disclaimers)) { return; }

				closeObj.customFilter = {};
				closeObj.customFilter = filterHelper.convertToCustomFilter({
					title: CRMControlAccountAdvancedSearch.customFilter.title,
					value: disclaimers
				});
			}

			closeObj.fixedDisclaimers = parameters.fixedDisclaimers;

			closeObj.apply = doApply;

			$modalInstance.close(closeObj);
		};

		this.isInvalidForm = function (disclaimers) {
			var i,
				messages = [],
				isInvalidForm = false,
				isInvalidDisclaimers = false,
				message,
				isValidDate,
				count,
				fields,
				isPlural;

			if (disclaimers.length <= 0) {

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n('l-account', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-form-validation-disclaimers', [], 'dts/crm')
				});
				return true;
			}

			if (!this.customFilter.title || this.customFilter.title.trim().length <= 0) {
				isInvalidForm = true;
				messages.push('l-title');
			}

			if (isInvalidForm) {
				fields = '';
				isPlural = messages.length > 1;

				message	 = 'msg-form-validation' + (isPlural ? '-plural' : '');

				for (i = 0; i < messages.length; i++) {
					fields += $rootScope.i18n(messages[i], [], 'dts/crm');
					if (isPlural && i !== (messages.length - 1)) {
						fields += ', ';
					}
				}

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n('l-account', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [fields], 'dts/crm')
				});
				return isInvalidForm;
			}

			if (CRMControlAccountAdvancedSearch.isEdit !== true && !isInvalidForm) {
				for (i = 0; i < CRMControlAccountAdvancedSearch.customFilterList.length; i++) {
					if (CRMControlAccountAdvancedSearch.customFilterList[i].title === this.customFilter.title) {
						isInvalidForm = true;
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type:   'error',
							title:  $rootScope.i18n('l-account', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-custom-filter-already-exists', [], 'dts/crm')
						});
						break;
					}
				}
			}

			if (!isInvalidForm) {

				isValidDate = helper.equalsDate(this.model.dat_prev_fechto, new Date(), true);

				if (isValidDate < 0) {

					isInvalidForm = true;

					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type:   'error',
						title:  $rootScope.i18n('l-account', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-period-before-record', [], 'dts/crm')
					});
				}
			}

			return isInvalidForm;
		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.validateAsterisk = function (value) {
			var count;

			if (!value) {
				return undefined;
			}

			count = value.length - 1;

			if (value.indexOf("*") === 0 && value.lastIndexOf("*") === count) {
				return value.substr(1, (count - 1));
			} else {
				return value;
			}
		};

		this.parseDisclaimersToModel = function (disclaimers) {
			var i;

			disclaimers = disclaimers || parameters.disclaimers;

			helper.parseDisclaimersToModel(disclaimers, function (model, disclaimers) {
				if (model.cod_pessoa_erp) {
					model.cod_pessoa_erp = CRMControlAccountAdvancedSearch.validateAsterisk(model.cod_pessoa_erp);
				}

				if (model.nom_abrev) {
					model.nom_abrev = CRMControlAccountAdvancedSearch.validateAsterisk(model.nom_abrev);
				}

				if (model.nom_cnpj) {
					model.nom_cnpj = CRMControlAccountAdvancedSearch.validateAsterisk(model.nom_cnpj);
				}

				if (model.nom_cpf) {
					model.nom_cpf = CRMControlAccountAdvancedSearch.validateAsterisk(model.nom_cpf);
				}

				if (model.nom_email_1) {
					model.nom_email_1 = CRMControlAccountAdvancedSearch.validateAsterisk(model.nom_email_1);
				}

				if (model.nom_infml) {
					model.nom_infml = CRMControlAccountAdvancedSearch.validateAsterisk(model.nom_infml);
				}

				if (model.nom_inscr_estad) {
					model.nom_inscr_estad = CRMControlAccountAdvancedSearch.validateAsterisk(model.nom_inscr_estad);
				}

				if (model.nom_razao_social) {
					model.nom_razao_social = CRMControlAccountAdvancedSearch.validateAsterisk(model.nom_razao_social);
				}

				if (model.nom_reg_geral) {
					model.nom_reg_geral = CRMControlAccountAdvancedSearch.validateAsterisk(model.nom_reg_geral);
				}

				if (model.nom_mae_pessoa_fisic) {
					model.nom_mae_pessoa_fisic = CRMControlAccountAdvancedSearch.validateAsterisk(model.nom_mae_pessoa_fisic);
				}

				if (model.cod_pessoa_gpl) {
					model.cod_pessoa_gpl = CRMControlAccountAdvancedSearch.validateAsterisk(model.cod_pessoa_gpl);
				}

				if (model.nom_orgao_emissor_identde) {
					model.nom_orgao_emissor_identde = CRMControlAccountAdvancedSearch.validateAsterisk(model.nom_orgao_emissor_identde);
				}

				for (i = 0; i < disclaimers.length; i++) {

					if (disclaimers[i].property === "log_inadimpte") {
						model.log_inadimpte = {
							"label": disclaimers[i].value ? $rootScope.i18n('l-overdue', [], 'dts/crm') : $rootScope.i18n('l-defaulter', [], 'dts/crm'),
							"value": disclaimers[i].value
						};
					}

					if (disclaimers[i].property === "custom.idi_tip_cta") {
						if (CRMUtil.isUndefined(model.idi_tip_cta)) {
							model.idi_tip_cta = [];
						}
						model.idi_tip_cta.push(CRMControlAccountAdvancedSearch.accountTypes[(parseInt(disclaimers[i].value, 10) - 1)]);
					}
				}

				CRMControlAccountAdvancedSearch.model = model;
				CRMControlAccountAdvancedSearch.disclaimers = disclaimers;
			});
		};

		this.parseModelToDisclaimers = function () {

			var i,
				key,
				fixed,
				model,
				label,
				iValue,
				status,
				param1,
				param2,
				hasConflict,
				item,
				integratedWith = this.isIntegratedWithGP === true ? '(GP)' : '(ERP)',
				customDisclaimers = [],
				title;

			this.disclaimers = [];

			for (key in this.model) {

				if (this.model.hasOwnProperty(key)) {

					model = this.model[key];

					if (CRMUtil.isUndefined(model)) {
						if (key !== 'num_id_usuar_respons') {
							continue;
						}
					}

					if ((key === 'idi_status' && model && model.num_id)) {
						label = 'l-active-status';

						if (model.num_id === 2) {
							label = 'l-inactive-status';
						} else if (model.num_id === 3) {
							label = 'l-not-integrated';

							if (CRMControlAccountAdvancedSearch.isIntegratedWithERP === true) {
								if (CRMUtil.isDefined(this.model.cod_pessoa_erp) && this.model.cod_pessoa_erp !== '') {
									param1 = $rootScope.i18n('l-status', [], 'dts/crm') + ' ' + $rootScope.i18n('l-not-integrated', [integratedWith], 'dts/crm');
									param2 = $rootScope.i18n('l-code-erp', [], 'dts/crm');

									$rootScope.$broadcast(TOTVSEvent.showNotification, {
										type:   'warning',
										title:  $rootScope.i18n('l-account', [], 'dts/crm'),
										detail: $rootScope.i18n('msg-filter-conflict', [param1, param2, param2], 'dts/crm')
									});

									continue;
								}
							} else if (CRMControlAccountAdvancedSearch.isIntegratedWithGP === true) {
								if (CRMUtil.isDefined(this.model.cod_pessoa_gpl) && this.model.cod_pessoa_gpl !== '') {
									param1 = $rootScope.i18n('l-status', [], 'dts/crm') + ' ' + $rootScope.i18n('l-not-integrated', [integratedWith], 'dts/crm');
									param2 = $rootScope.i18n('l-gpl-code', [], 'dts/crm');

									$rootScope.$broadcast(TOTVSEvent.showNotification, {
										type:   'warning',
										title:  $rootScope.i18n('l-account', [], 'dts/crm'),
										detail: $rootScope.i18n('msg-filter-conflict', [param1, param2, param2], 'dts/crm')
									});

									continue;
								}
							}
						}

						this.disclaimers.push({
							property: 'custom.idi_status',
							value: model.num_id,
							title: $rootScope.i18n('l-status', [], 'dts/crm') + ": " + $rootScope.i18n(label, [integratedWith], 'dts/crm'),
							model: { property: 'idi_status', value: model}
						});

					} else if (key === 'cod_pessoa_erp') {

						this.disclaimers.push({
							property: 'cod_pessoa_erp',
							value: helper.parseStrictValue(model),
							title: $rootScope.i18n('l-code-erp', [], 'dts/crm') + ': ' + model
						});

					} else if (key === 'nom_razao_social') {

						this.disclaimers.push({
							property: 'nom_razao_social',
							value: helper.parseStrictValue(model),
							title: $rootScope.i18n('l-name', [], 'dts/crm') + ': ' + model
						});

					} else if (key === 'nom_cnpj') {

						this.disclaimers.push({
							property: 'nom_cnpj',
							value: helper.parseStrictValue(model),
							title: $rootScope.i18n('l-cnpj', [], 'dts/crm') + ': ' + model
						});

					} else if (key === 'nom_cpf') {

						this.disclaimers.push({
							property: 'nom_cpf',
							value: helper.parseStrictValue(model),
							title: $rootScope.i18n('l-cpf', [], 'dts/crm') + ': ' + model
						});

					} else if (key === 'nom_abrev') {

						this.disclaimers.push({
							property: 'nom_abrev',
							value: helper.parseStrictValue(model),
							title: $rootScope.i18n('l-nick-name', [], 'dts/crm') + ': ' + model
						});

					} else if (key === 'nom_infml') {

						this.disclaimers.push({
							property: 'nom_infml',
							value: helper.parseStrictValue(model),
							title: $rootScope.i18n('l-informal-name', [], 'dts/crm') + ': ' + model
						});

					} else if (key === 'nom_reg_geral') {

						this.disclaimers.push({
							property: 'nom_reg_geral',
							value: helper.parseStrictValue(model),
							title: $rootScope.i18n('l-rg', [], 'dts/crm') + ': ' + model
						});

					} else if (key === 'nom_orgao_emissor_identde') {

						this.disclaimers.push({
							property: 'nom_orgao_emissor_identde',
							value: helper.parseStrictValue(model),
							title: $rootScope.i18n('l-emitting-organ', [], 'dts/crm') + ': ' + model
						});

					} else if (key === 'qti_depend') {

						iValue = parseInt(model, 10);

						if (iValue > 0) {
							this.disclaimers.push({
								property: 'qti_depend',
								value: model,
								title: $rootScope.i18n('l-number-dependents', [], 'dts/crm') + ': ' + model
							});
						}

					} else if (key === 'nom_mae_pessoa_fisic') {

						this.disclaimers.push({
							property: 'nom_mae_pessoa_fisic',
							value: helper.parseStrictValue(model),
							title: $rootScope.i18n('l-mother-name', [], 'dts/crm') + ': ' + model
						});

					} else if (key === 'log_estrang' && (model === true)) {

						this.disclaimers.push({
							property: 'log_estrang',
							value: model,
							title: $rootScope.i18n('l-foreign', [], 'dts/crm') + ': ' + $rootScope.i18n('l-yes', [], 'dts/crm')
						});

					} else if (key === 'log_concorrente' && (model === true)) {

						this.disclaimers.push({
							property: 'log_concorrente',
							value: model,
							title: $rootScope.i18n('l-competing-brand', [], 'dts/crm') + ': ' + $rootScope.i18n('l-yes', [], 'dts/crm')
						});

					} else if (key === 'log_trading' && (model === true)) {

						this.disclaimers.push({
							property: 'log_trading',
							value: model,
							title: $rootScope.i18n('l-trading', [], 'dts/crm') + ': ' + $rootScope.i18n('l-yes', [], 'dts/crm')
						});

					} else if (key === 'num_id_ramo_ativid') {

						this.disclaimers.push({
							property: 'num_id_ramo_ativid',
							value: model.num_id,
							title: $rootScope.i18n('l-activity-line', [], 'dts/crm') + ': ' + model.nom_ramo_ativid,
							model: { value: model }
						});

					} else if (key === 'num_id_instruc') {

						this.disclaimers.push({
							property: 'num_id_instruc',
							value: model.num_id,
							title: $rootScope.i18n('l-educational-level', [], 'dts/crm') + ': ' + model.nom_instruc,
							model: { value: model }
						});

					} else if (key === 'num_id_tratam') {

						this.disclaimers.push({
							property: 'num_id_tratam',
							value: model.num_id,
							title: $rootScope.i18n('l-treatment', [], 'dts/crm') + ': ' + model.nom_tratam,
							model: { value: model }
						});

					} else if (key === 'num_id_estado_civil') {

						this.disclaimers.push({
							property: 'num_id_estado_civil',
							value: model.num_id,
							title: $rootScope.i18n('l-civil-status', [], 'dts/crm') + ': ' + model.nom_estado_civil,
							model: { value: model }
						});

					} else if (key === 'cod_pessoa_gpl') {

						this.disclaimers.push({
							property: 'cod_pessoa_gpl',
							value: helper.parseStrictValue(model),
							title: $rootScope.i18n('l-gpl-code', [], 'dts/crm') + ': ' + model
						});

					} else if (key === 'idi_tip_prestdor') {

						this.disclaimers.push({
							property: 'idi_tip_prestdor',
							value: model.num_id,
							title: $rootScope.i18n('l-type-provider', [], 'dts/crm') + ': ' + model.nom_type_provider,
							model: { value: model }
						});

					} else if (key === 'nom_email_1') {

						this.disclaimers.push({
							property: 'nom_email_1',
							value: helper.parseStrictValue(model),
							title: $rootScope.i18n('l-email', [], 'dts/crm') + ': ' + model
						});

					} else if (key === 'nom_inscr_estad') {

						this.disclaimers.push({
							property: 'nom_inscr_estad',
							value: helper.parseStrictValue(model),
							title: $rootScope.i18n('l-state-registration', [], 'dts/crm') + ': ' + model
						});

					} else if (key === 'dat_cadastro' && CRMUtil.isDefined(model.start)) {
						this.disclaimers.push(helper.parseDateRangeToDisclaimer(model, 'dat_cadastro', 'l-date-create'));
					} else if (key === 'dat_nascimento' && CRMUtil.isDefined(model.start)) {
						this.disclaimers.push(helper.parseDateRangeToDisclaimer(model, 'dat_nascimento', 'l-date-birth'));
					} else if (key === 'idi_tip_cta') {

						if (angular.isArray(model)) {

							for (i = 0; i < model.length; i++) {
								hasConflict = false;
								item = model[i];

								switch (item.num_id) {
								case 1:
									param1 = $rootScope.i18n('l-lead', [], 'dts/crm');

									if (CRMControlAccountAdvancedSearch.isIntegratedWithERP === true) {
										if ((CRMUtil.isDefined(this.model.cod_pessoa_erp) && this.model.cod_pessoa_erp !== "")) {
											hasConflict = true;
											param2 = $rootScope.i18n('l-code-erp', [], 'dts/crm');

											$rootScope.$broadcast(TOTVSEvent.showNotification, {
												type:   'warning',
												title:  $rootScope.i18n('l-account', [], 'dts/crm'),
												detail: $rootScope.i18n('msg-filter-conflict', [param1, param2, param2], 'dts/crm')
											});
										} else if (CRMUtil.isDefined(this.model.idi_status) && (this.model.idi_status.num_id === 1 || this.model.idi_status.num_id === 2)) {

											hasConflict = true;
											status = this.model.idi_status.num_id === 1 ? 'l-active-status' : 'l-inactive-status';
											param2 = $rootScope.i18n('l-status', [], 'dts/crm') + ' ' + $rootScope.i18n(status, [integratedWith], 'dts/crm');

											$rootScope.$broadcast(TOTVSEvent.showNotification, {
												type:   'warning',
												title:  $rootScope.i18n('l-account', [], 'dts/crm'),
												detail: $rootScope.i18n('msg-filter-conflict', [param1, param2, param2], 'dts/crm')
											});
										}
									}

									break;
								case 2:
									param1 = $rootScope.i18n('l-client', [], 'dts/crm');
									break;
								case 3:
									param1 = $rootScope.i18n('l-contact', [], 'dts/crm');

									if (CRMControlAccountAdvancedSearch.isIntegratedWithERP === true) {
										if ((CRMUtil.isDefined(this.model.cod_pessoa_erp) && this.model.cod_pessoa_erp !== "")) {

											hasConflict = true; //conflito na combinacao de filtro
											param2 = $rootScope.i18n('l-code-erp', [], 'dts/crm');

											$rootScope.$broadcast(TOTVSEvent.showNotification, {
												type:   'warning',
												title:  $rootScope.i18n('l-account', [], 'dts/crm'),
												detail: $rootScope.i18n('msg-filter-conflict', [param1, param2, param2], 'dts/crm')
											});
										} else if (CRMUtil.isDefined(this.model.idi_status) && (this.model.idi_status.num_id === 1 || this.model.idi_status.num_id === 2)) {

											hasConflict = true; //conflito na combinacao de filtro
											status = this.model.idi_status.num_id === 1 ? 'l-active-status' : 'l-inactive-status';
											param2 = $rootScope.i18n('l-status', [integratedWith], 'dts/crm') + ' ' + $rootScope.i18n(status, [], 'dts/crm');

											$rootScope.$broadcast(TOTVSEvent.showNotification, {
												type:   'warning',
												title:  $rootScope.i18n('l-account', [], 'dts/crm'),
												detail: $rootScope.i18n('msg-filter-conflict', [param1, param2, param2], 'dts/crm')
											});

										}
									}

									break;
								case 4:
									param1 = $rootScope.i18n('l-provider', [], 'dts/crm');
									break;
								case 5:
									param1 = $rootScope.i18n('l-client-provider', [], 'dts/crm');
									break;
								case 6:
									param1 = $rootScope.i18n('l-client-contact', [], 'dts/crm');
									break;
								case 7:
									param1 = $rootScope.i18n('l-provider-contact', [], 'dts/crm');
									break;
								case 8:
									param1 = $rootScope.i18n('l-client-provider-contact', [], 'dts/crm');
									break;
								}

								if (hasConflict === false) {
									this.disclaimers.push({
										property: 'custom.idi_tip_cta',
										value: item.num_id,
										title: param1 + ": " + $rootScope.i18n('l-yes', [], 'dts/crm')
									});
								}
							}
						}

					} else if (key === 'idi_tip_pessoa') {

						this.disclaimers.push({
							property: 'idi_tip_pessoa',
							value: model.num_id,
							title: $rootScope.i18n('l-nature', [], 'dts/crm') + ': ' + model.nom_tipo,
							model: { value: model }
						});

					} else if (key === 'idi_sexo') {

						this.disclaimers.push({
							property: 'idi_sexo',
							value: model.num_id,
							title: $rootScope.i18n('l-sex', [], 'dts/crm') + ': ' + model.nom_sex,
							model: { value: model }
						});

					} else if (key === 'num_id_tip_clien') {

						this.disclaimers.push({
							property: 'num_id_tip_clien',
							value: model.num_id,
							title: $rootScope.i18n('l-type-client', [], 'dts/crm') + ': ' + model.nom_tip_clien,
							model: { value: model }
						});

					} else if (key === 'num_id_grp_clien') {

						this.disclaimers.push({
							property: 'num_id_grp_clien',
							value: model.num_id,
							title: $rootScope.i18n('l-group-client', [], 'dts/crm') + ': ' + model.nom_grp_clien,
							model: { value: model }
						});

					} else if (key === 'num_id_repres') {

						this.disclaimers.push({
							property: 'num_id_repres',
							value: model.num_id,
							title: $rootScope.i18n('l-seller', [], 'dts/crm') + ': ' + model.nom_repres,
							model: { value: model }
						});

					} else if (key === 'num_id_fonte') {

						this.disclaimers.push({
							property: 'num_id_fonte',
							value: model.num_id,
							title: $rootScope.i18n('l-font', [], 'dts/crm') + ': ' + model.nom_fonte,
							model: { value: model }
						});

					} else if (key === 'num_id_contat') {

						this.disclaimers.push({
							property: 'contact.num_id_contat',
							value: model.num_id,
							title: $rootScope.i18n('l-contact', [], 'dts/crm') + ': ' + model.nom_razao_social,
							model: {
								property: "num_id_contat",
								value: model
							}
						});

					} else if (key === 'num_id_usuar_respons') {

						fixed = undefined;

						parameters.fixedDisclaimers = parameters.fixedDisclaimers || [];

						for (i = 0; i < parameters.fixedDisclaimers.length; i++) {
							if (parameters.fixedDisclaimers[i].property === 'num_id_usuar_respons') {
								fixed = parameters.fixedDisclaimers[i];
								break;
							}
						}

						if (fixed && model) {

							fixed.value = model.num_id;
							fixed.title = $rootScope.i18n('l-user-responsible', [], 'dts/crm') + ': ' + model.nom_usuar;
							fixed.model = { value: model };

						} else if (model) {

							this.disclaimers.push({
								property: 'num_id_usuar_respons',
								value: model.num_id,
								title: $rootScope.i18n('l-user-responsible', [], 'dts/crm') + ': ' + model.nom_usuar,
								model: { value: model }
							});

						}

					} else if (key === 'num_id_usuar_cadastro') {

						this.disclaimers.push({
							property: 'num_id_usuar_cadastro',
							value: model.num_id,
							title: $rootScope.i18n('l-user-open', [], 'dts/crm') + ': ' + model.nom_usuar,
							model: { value: model }
						});

					} else if (key === 'num_id_uf') {

						this.disclaimers.push({
							property: 'address.num_id_uf',
							value: model.num_id,
							title: $rootScope.i18n('l-uf', [], 'dts/crm') + ': ' + model.nom_unid_federac,
							model: {
								property: 'num_id_uf',
								value: model
							}
						});

					} else if (key === 'num_id_cidad') {

						this.disclaimers.push({
							property: 'address.num_id_cidad',
							value: model.num_id,
							title: $rootScope.i18n('l-city', [], 'dts/crm') + ': ' + model.nom_cidade,
							model: {
								property: 'num_id_cidad',
								value: model
							}
						});

					} else if (key === 'num_id_regiao') {

						this.disclaimers.push({
							property: 'num_id_regiao',
							value: model.num_id,
							title: $rootScope.i18n('l-region', [], 'dts/crm') + ': ' + model.nom_regiao_atendim,
							model: { value: model }
						});

					} else if (key === 'num_id_classif') {

						this.disclaimers.push({
							property: 'num_id_classif',
							value: model.num_id,
							title: $rootScope.i18n('l-classification', [], 'dts/crm') + ': ' + model.nom_clas_clien,
							model: { value: model }
						});
					} else if (key === 'cod_docto_ident') {

						this.disclaimers.push({
							property: 'document.cod_docto_ident',
							value: helper.parseStrictValue(model),
							title: $rootScope.i18n('l-document', [], 'dts/crm') + ': ' + model,
							model: { property: 'cod_docto_ident', value: model }
						});

					} else if (key === 'num_id_tip_docto') {

						this.disclaimers.push({
							property: 'document.num_id_tip_docto',
							value: model.num_id,
							title: $rootScope.i18n('l-document-type', [], 'dts/crm') + ': ' + model.nom_tip_docto,
							model: { property: 'num_id_tip_docto', value: model }
						});
					} else if (key === 'nom_telef') {
						if (CRMUtil.isDefined(model) && model.trim().length > 0) {
							this.disclaimers.push({
								property: 'custom.nom_telef',
								value: helper.parseStrictValue(model),
								title: $rootScope.i18n('l-phone', [], 'dts/crm') + ': ' + model,
								model: { property: 'nom_telef', value: model }
							});
						}
					} else if (key === 'log_inadimpte') {

						if (CRMControlAccountAdvancedSearch.financialStatusLastExecution === undefined) {
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type:   'warning',
								title:  $rootScope.i18n('l-account', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-validation-financial-status', [], 'dts/crm')
							});
						} else {
							title = model.value ? $rootScope.i18n('l-financial-situation', [], 'dts/crm') + ': ' + $rootScope.i18n('l-overdue', [], 'dts/crm') : $rootScope.i18n('l-financial-situation', [], 'dts/crm') + ': ' + $rootScope.i18n('l-defaulter', [], 'dts/crm');

							this.disclaimers.push({
								property: 'log_inadimpte',
								value: model.value,
								title: title
							});
						}
					}
				}
			}

			customDisclaimers = attributeHelper.parseAttributeToDisclaimers(this.customFields);

			this.disclaimers = this.disclaimers.concat(customDisclaimers);

		};

		this.getClientTypes = function () {
			clientTypeFactory.getAll(undefined, function (result) {
				CRMControlAccountAdvancedSearch.clientTypes = result;
			});
		};

		this.getClientGroups = function () {
			clientGroupFactory.getAll(function (result) {
				CRMControlAccountAdvancedSearch.clientGroups = result;
			});
		};

		this.getRepresentatives = function (value) {
			if (!value || value === '') {
				return [];
			}

			var filter = { property: 'nom_repres', value: helper.parseStrictValue(value) };

			representativeFactory.typeahead(filter, undefined, function (result) {
				CRMControlAccountAdvancedSearch.representatives = result;
			});
		};

		this.getSources = function () {
			sourceFactory.getAll(function (result) {
				CRMControlAccountAdvancedSearch.sources = result;
			});
		};

		this.getContacts = function (value) {
			if (!value || value === '') {
				return [];
			}

			var filter = { property: 'nom_razao_social', value: helper.parseStrictValue(value) };

			contactFactory.typeahead(filter, undefined, function (result) {
				CRMControlAccountAdvancedSearch.contacts = result;
			});
		};

		this.getUsers = function (value) {
			if (!value || value === '') {
				return [];
			}

			var filter = { property: 'nom_usuar', value: helper.parseStrictValue(value) };

			userFactory.typeahead(filter, undefined, function (result) {
				CRMControlAccountAdvancedSearch.users = result;
			});
		};

		this.getFederations = function (value) {
			if (!value || value === '') {
				return [];
			}

			var filter = [
				{ property: 'or.nom_unid_federac', value: helper.parseStrictValue(value) },
				{ property: 'or.nom_complet_uf',   value: helper.parseStrictValue(value) }
			];

			federationFactory.typeahead(filter, undefined, function (result) {
				CRMControlAccountAdvancedSearch.federations = result;
			});
		};

		this.getCities = function (value) {

			if (!value || value === '') {
				return [];
			}

			var filter = [{ property: 'nom_cidade', value: helper.parseStrictValue(value) }];

			if (this.model.num_id_uf) {
				filter.unshift({ property: 'num_id_uf', value: this.model.num_id_uf.num_id || 0 });
			}

			cityFactory.typeahead(filter, undefined, function (result) {
				CRMControlAccountAdvancedSearch.cities = result;
			});
		};

		this.getRegions = function (value) {
			if (!value || value === '') {
				return [];
			}

			var filter = { property: 'nom_regiao_atendim',  value: helper.parseStrictValue(value) };

			regionFactory.typeahead(filter, undefined, function (result) {
				CRMControlAccountAdvancedSearch.regions = result;
			});
		};

		this.getRatings = function () {
			accountRatingFactory.getAll(function (result) {
				CRMControlAccountAdvancedSearch.ratings = result;
			});
		};

		this.getDocumentTypes = function () {
			documentTypeFactory.getAll(function (result) {
				CRMControlAccountAdvancedSearch.documentTypes = result;
			});

		};

		this.getTreatments = function () {
			treatmentFactory.getAll(function (result) {
				CRMControlAccountAdvancedSearch.treatments = result;
			}, true);
		};

		this.getEducationalLevels = function () {
			educationalLevelFactory.getAll(function (result) {
				CRMControlAccountAdvancedSearch.educationalLevels = result;
			}, true);
		};

		this.getMaritalStatus = function () {
			maritalStatusFactory.getAll(function (result) {
				CRMControlAccountAdvancedSearch.maritalStatus = result;
			}, true);
		};

		this.getActivities = function () {
			activityLineFactory.getAll(function (result) {
				CRMControlAccountAdvancedSearch.activities = result;
			}, true);
		};

		this.getStatus = function () {
			var integratedWith = this.isIntegratedWithGP === true ? '(GP)' : '(ERP)';

			CRMControlAccountAdvancedSearch.status = [
				{num_id: 1, nom_status_erp: $rootScope.i18n('l-active-status', [integratedWith], 'dts/crm')},
				{num_id: 2, nom_status_erp: $rootScope.i18n('l-inactive-status', [integratedWith], 'dts/crm')},
				{num_id: 3, nom_status_erp: $rootScope.i18n('l-not-integrated', [integratedWith], 'dts/crm')}
			];
		};

		this.getCustomFields = function (customFields, fn) {
			var i;

			attributeFactory.getCustomFields(1, 0, function (result) {

				if (!result) {
					return;
				}

				CRMControlAccountAdvancedSearch.customFields = result;

				for (i = 0; i < CRMControlAccountAdvancedSearch.customFields.length; i++) {
					attributeHelper.parseAttribute(CRMControlAccountAdvancedSearch.customFields[i], true, true);
				}

				if (fn) {
					fn(CRMControlAccountAdvancedSearch.customFields);
				}

			});
		};

		this.parseDisclaimersToCustomFields = function (disclaimers, customFields) {

			attributeHelper.parseDisclaimersToCustomFields(disclaimers, customFields, function (model) {
				CRMControlAccountAdvancedSearch.customFields = model;
			});

		};

		this.onFederationChange = function () {
			CRMControlAccountAdvancedSearch.cities = [];
			this.model.num_id_cidad = undefined;
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.isAddEditMode = parameters.isAddEditMode || false;
		this.customFilter = parameters.customFilter || {};
		this.customFilterList = parameters.customFilterList || [];
		this.isHideContact = parameters.isHideContact || false;

		this.loadPreferences = function (callback) {
			var icount  = 0,
				itotal  = 2;

			preferenceFactory.isIntegratedWithGP(function (result) {
				icount++;

				CRMControlAccountAdvancedSearch.isIntegratedWithGP = result;
				if (icount >= itotal) {
					callback();
				}
			});

			taskPreferenceFinancialFactory.lastExecution(function (result) {
				icount++;

				CRMControlAccountAdvancedSearch.financialStatusLastExecution = result;
				if (icount >= itotal) {
					callback();
				}
			});
		};

		this.init = function () {

			accessRestrictionFactory.getUserRestrictions('account.advanced.search', $rootScope.currentuser.login, function (result) {
				CRMControlAccountAdvancedSearch.accessRestriction = result || {};
			});

			this.loadPreferences(function () {
				
				CRMControlAccountAdvancedSearch.getStatus();

				CRMControlAccountAdvancedSearch.getCustomFields(CRMControlAccountAdvancedSearch.customFields, function (customFields) {
					CRMControlAccountAdvancedSearch.parseDisclaimersToCustomFields(CRMControlAccountAdvancedSearch.disclaimers, customFields);
				});

			});

			if (this.isAddEditMode === true && this.customFilter) {

				if (CRMUtil.isDefined(this.customFilter.title)) {
					this.isEdit = true;
				}

				this.parseDisclaimersToModel(filterHelper.parseToDisclaimers(this.customFilter.value));
			} else {
				this.parseDisclaimersToModel();
			}


			this.getClientTypes();
			this.getClientGroups();
			this.getRatings();
			this.getSources();
			this.getDocumentTypes();
			this.getTreatments();
			this.getEducationalLevels();
			this.getMaritalStatus();
			this.getActivities();		

		};

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlAccountAdvancedSearch = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};

	controllerAccountAdvancedSearch.$inject = [
		'$rootScope',
		'$scope',
		'$modalInstance',
		'TOTVSEvent',
		'parameters',
		'crm.legend',
		'crm.helper',
		'crm.crm_usuar.factory',
		'crm.crm_pessoa.contato.factory',
		'crm.crm_unid_federac.factory',
		'crm.crm_cidad.factory',
		'crm.crm_repres.factory',
		'crm.crm_clas.factory',
		'crm.crm_fonte.factory',
		'crm.crm_regiao.factory',
		'crm.crm_tip_clien.factory',
		'crm.account.helper',
		'crm.filter.helper',
		'crm.crm_grp_clien.factory',
		'crm.crm_param.factory',
		'crm.crm_tip_docto.factory',
		'crm.crm_instruc.factory',
		'crm.crm_tratam.factory',
		'crm.crm_ramo_ativid.factory',
		'crm.crm_estado_civil.factory',
		'crm.attribute.helper',
		'crm.crm_atrib.factory',
		'crm.crm_acess_portal.factory',
		'crm.crm_param_sit_financ.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.account.modal.advanced.search', modalAccountAdvancedSearch);
	index.register.controller('crm.account.advanced.search.control', controllerAccountAdvancedSearch);
});
