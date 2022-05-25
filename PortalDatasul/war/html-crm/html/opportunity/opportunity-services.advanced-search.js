/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1007.js',
	'/dts/crm/js/api/fchcrm1009.js',
	'/dts/crm/js/api/fchcrm1019.js',
	'/dts/crm/js/api/fchcrm1020.js',
	'/dts/crm/js/api/fchcrm1029.js',
	'/dts/crm/js/api/fchcrm1030.js',
	'/dts/crm/js/api/fchcrm1044.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/api/fchcrm1047.js',
	'/dts/crm/js/api/fchcrm1083.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/js/zoom/crm_pessoa.js',
	'/dts/crm/js/zoom/crm_produt.js',
	'/dts/crm/js/zoom/crm_tab_preco.js',
	'/dts/crm/js/zoom/crm_pessoa.js',
	'/dts/crm/html/task/task-services.advanced-search.js',
	'/dts/crm/html/task/task-services.calendar.js',
	'/dts/crm/html/task/task-services.detail.js',
	'/dts/crm/html/task/task-services.edit.js',
	'/dts/crm/html/task/task-services.list.js',
	'/dts/crm/html/history/history-services.list.js',
	'/dts/crm/html/history/history-services.detail.js',
	'/dts/crm/html/history/history-services.advanced-search.js',
	'/dts/crm/html/history/history-services.edit.js',
	'/dts/crm/html/account/account-services.list.js',
	'/dts/crm/html/account/account-services.detail.js',
	'/dts/crm/html/account/account-services.edit.js',
	'/dts/crm/html/account/account-services.advanced-search.js',
	'/dts/crm/html/attachment/attachment-services.js',
	'/dts/crm/html/opportunity/product/product-services.js',
	'/dts/crm/html/opportunity/gain-loss/gain-loss-services.js',
	'/dts/crm/html/opportunity/sales-order/sales-order-services.js',
	'/dts/crm/html/opportunity/strong-weak/strong-weak-services.js',
	'/dts/crm/html/opportunity/resale/resale-services.js',
	'/dts/crm/html/opportunity/competitor/competitor-services.js',
	'/dts/crm/html/opportunity/contact/contact-services.js',
	'/dts/crm/html/e-mail/e-mail-services.js',
	'/dts/crm/html/report/report-services.list.js',
	'/dts/crm/html/report/report-services.edit.js',
	'/dts/crm/html/report/report-services.detail.js',
	'/dts/crm/html/report/report-services.available.js',
	'/dts/crm/html/report/report-services.parameter.js',
	'/dts/crm/html/report/report-services.advanced-search.js',
	'/dts/crm/html/user/user-services.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var modalOpportunityAdvancedSearch,
		controllerOpportunityAdvancedSearch;
	// *************************************************************************************
	// *** MODAL ADVANCED SEARCH
	// *************************************************************************************
	modalOpportunityAdvancedSearch = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/opportunity/opportunity.advanced.search.html',
				controller: 'crm.opportunity.advanced.search.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
	modalOpportunityAdvancedSearch.$inject = ['$modal'];
	// *************************************************************************************
	// *** CONTROLLER ADVANCED SEARCH
	// *************************************************************************************

	controllerOpportunityAdvancedSearch = function ($rootScope, $scope, $modalInstance, TOTVSEvent, parameters,
										  userFactory, accountFactory, contactFactory,
										  helper, opportunityFactory, productFactory,
										  priceTableFactory, opportunityHelper, filterHelper,
										  campaignFactory, preferenceFactory, attributeHelper, attributeFactory, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlOpportunityAdvancedSearch = this;

		this.accessRestriction = undefined;

		this.disclaimers = undefined;
		this.model = undefined;
		this.isChild = false;
		this.isUserPortfolio = false;
		this.isIntegratedWithGP = false;

		this.accounts = [];
		this.contacts = [];
		this.users = [];
		this.tooltipMessage = $rootScope.i18n('msg-responsible-disabled', [], 'dts/crm');

		/*this.isHideAccount;
		this.campaigns;*/

		this.status = [
			{ num_id: 1, nom_status: $rootScope.i18n("l-opportunity-opening", []), nom_cor: "crm-opportunity-yellow" },
			{ num_id: 2, nom_status: $rootScope.i18n("l-opportunity-close", []), nom_cor: "crm-opportunity-green" },
			{ num_id: 3, nom_status: $rootScope.i18n("l-opportunity-suspended", []), nom_cor: "crm-opportunity-dark" }
		];

		//filtroCustom
		this.isEdit = false;
		this.customFilter = {};

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.apply = function (doApply) {

			var closeObj = {},
				disclaimers;

			this.parseModelToDisclaimers();

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
					title: CRMControlOpportunityAdvancedSearch.customFilter.title,
					value: disclaimers
				});
			}

			closeObj.fixedDisclaimers = parameters.fixedDisclaimers;

			closeObj.apply = doApply;

			$modalInstance.close(closeObj);
		};

		this.isInvalidForm = function (disclaimers) {
			var i,
				fields,
				isPlural,
				message,
				messages = [],
				isValidDate,
				isInvalidForm = false;

			if (disclaimers.length <= 0) {

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n('l-opportunity', [], 'dts/crm'),
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
				message = 'msg-form-validation' + (isPlural ? '-plural' : '');

				for (i = 0; i < messages.length; i++) {
					fields += $rootScope.i18n(messages[i], [], 'dts/crm');
					if (isPlural && i !== (messages.length - 1)) {
						fields += ', ';
					}
				}

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n('l-opportunity', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [fields], 'dts/crm')
				});
			}

			if (CRMControlOpportunityAdvancedSearch.isEdit !== true && isInvalidForm === false) {
				for (i = 0; i < CRMControlOpportunityAdvancedSearch.customFilterList.length; i++) {
					if (CRMControlOpportunityAdvancedSearch.customFilterList[i].title === this.customFilter.title) {
						isInvalidForm = true;
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type:   'error',
							title:  $rootScope.i18n('l-opportunity', [], 'dts/crm'),
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

					message = 'msg-period-before-record';

					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type:   'error',
						title:  $rootScope.i18n('l-opportunity', [], 'dts/crm'),
						detail: $rootScope.i18n(message, [], 'dts/crm')
					});
				}
			}


			return isInvalidForm;
		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.parseDisclaimersToModel = function (disclaimers) {

			disclaimers = disclaimers || parameters.disclaimers;

			helper.parseDisclaimersToModel(disclaimers, function (model, disclaimers) {

				CRMControlOpportunityAdvancedSearch.model = model;
				CRMControlOpportunityAdvancedSearch.disclaimers = disclaimers;
				CRMControlOpportunityAdvancedSearch.hideAccount();

				if (model.val_realzdo_simul !== undefined) {
					CRMControlOpportunityAdvancedSearch.model.val_realzdo_simul = {
						start: CRMControlOpportunityAdvancedSearch.parseDecimaltoModel(model.val_realzdo_simul.start),
						end: CRMControlOpportunityAdvancedSearch.parseDecimaltoModel(model.val_realzdo_simul.end)
					};
				}

				if (model.val_med_vida !== undefined) {
					CRMControlOpportunityAdvancedSearch.model.val_med_vida = {
						start: CRMControlOpportunityAdvancedSearch.parseDecimaltoModel(model.val_med_vida.start),
						end: CRMControlOpportunityAdvancedSearch.parseDecimaltoModel(model.val_med_vida.end)
					};
				}

			});
		};

		this.parseDecimaltoModel = function (value) {
			var replaceAll = function replaceAll(str, de, para) {
				var pos = str.indexOf(de);
				while (pos > -1) {
					str = str.replace(de, para);
					pos = str.indexOf(de);
				}
				return (str);
			};

			value = replaceAll(value, ".", "");
			value = replaceAll(value, ",", ".");
			return value;
		};

		this.parseDecimal = function (value) {
			var replaceAll = function replaceAll(str, de, para) {
				var pos = str.indexOf(de);
				while (pos > -1) {
					str = str.replace(de, para);
					pos = str.indexOf(de);
				}
				return (str);
			};

			value = replaceAll(value, ".", "");
			return value;
		};

		this.parseModelToDisclaimers = function () {

			var i,
				key,
				fixed,
				model,
				customDisclaimers;

			this.disclaimers = [];


			for (key in this.model) {

				if (this.model.hasOwnProperty(key)) {

					model = this.model[key];

					if (key === 'num_id' && CRMUtil.isDefined(model)) {

						this.disclaimers.push({
							property: 'num_id',
							value: model,
							title: $rootScope.i18n('l-code', [], 'dts/crm') + ': ' + model
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

						if ((!fixed) && model) {

							this.disclaimers.push({
								property: 'num_id_usuar_respons',
								value: model.num_id,
								title: $rootScope.i18n('l-user-responsible', [], 'dts/crm') + ': ' + model.nom_usuar,
								model: { value: model }
							});

						}

					} else if (key === 'num_id_usuar' && CRMUtil.isDefined(model)) {

						this.disclaimers.push({
							property: 'num_id_usuar',
							value: model.num_id,
							title: $rootScope.i18n('l-user-open', [], 'dts/crm') + ': ' + model.nom_usuar,
							model: { value: model }
						});

					} else if (key === 'num_id_pessoa' && CRMUtil.isDefined(model)) {


						fixed = undefined;

						parameters.fixedDisclaimers = parameters.fixedDisclaimers || [];

						for (i = 0; i < parameters.fixedDisclaimers.length; i++) {
							if (parameters.fixedDisclaimers[i].property === 'num_id_pessoa') {
								fixed = parameters.fixedDisclaimers[i];
								break;
							}
						}

						if ((!fixed) && model) {

							this.disclaimers.push({
								property: 'num_id_pessoa',
								value: model.num_id,
								title: $rootScope.i18n('l-account', [], 'dts/crm') + ': ' + model.nom_razao_social,
								model: { value: model }
							});

						}

					} else if (key === 'num_id_contat' && CRMUtil.isDefined(model)) {

						this.disclaimers.push({
							property: 'crm_oportun_contat.num_id_pessoa',
							value: model.num_id,
							title: $rootScope.i18n('l-contact', [], 'dts/crm') + ': ' + model.nom_razao_social,
							model: {
								property: 'num_id_contat',
								value: model
							}
						});

					} else if (key === 'num_id_estrateg_vda' && CRMUtil.isDefined(model)) {

						this.disclaimers.push({
							property: 'num_id_estrateg_vda',
							value: model.num_id,
							title: $rootScope.i18n('l-sales-strategy', [], 'dts/crm') + ': ' + model.des_estrateg_vda,
							model: { value: model }
						});

					} else if (key === 'num_id_fase' && CRMUtil.isDefined(model)) {

						this.disclaimers.push({
							property: 'num_id_fase',
							value: model.num_id,
							title: $rootScope.i18n('l-phase', [], 'dts/crm') + ': ' + model.des_fase,
							model: { value: model }
						});

					} else if (key === 'num_id_probab' && CRMUtil.isDefined(model)) {

						this.disclaimers.push({
							property: 'num_id_probab',
							value: model.num_id,
							title: $rootScope.i18n('l-probability-of-sale', [], 'dts/crm') + ': ' + model.des_probab_fechto,
							model: { value: model }
						});

					} else if (key === 'num_id_produt' && CRMUtil.isDefined(model)) {

						this.disclaimers.push({
							property: 'crm_oportun_produt.num_id_produt',
							value: model.num_id,
							title: $rootScope.i18n('l-product', [], 'dts/crm') + ': ' + model.nom_produt,
							model: {
								property: 'num_id_produt',
								value: model
							}
						});

					} else if (key === 'idi_status' && CRMUtil.isDefined(model)) {

						this.disclaimers.push({
							property: 'custom.myopportunities',
							value: model.num_id,
							title: $rootScope.i18n('l-status', [], 'dts/crm') + ': ' + model.nom_status,
							model: {
								property: 'idi_status',
								value: model
							}
						});

					} else if (key === 'num_id_tab_preco' && CRMUtil.isDefined(model)) {

						this.disclaimers.push({
							property: 'crm_oportun_produt.num_id_tab_preco',
							value: model.num_id,
							title: $rootScope.i18n('l-price-table', [], 'dts/crm') + ': ' + model.nom_tab_preco,
							model: {
								property: 'num_id_tab_preco',
								value: model
							}
						});

					} else if (key === 'num_id_campanha') {

						this.disclaimers.push({
							property: 'num_id_campanha',
							value: model.num_id,
							title: $rootScope.i18n('l-campaign', [], 'dts/crm') + ': ' + model.nom_campanha,
							model: { value: model }
						});

					} else if (key === 'dat_cadastro' && CRMUtil.isDefined(model.start)) {

						this.disclaimers.push(
							helper.parseDateRangeToDisclaimer(model, 'dat_cadastro', 'l-date-create')
						);

					} else if (key === 'dat_fechto_oportun' && CRMUtil.isDefined(model.start)) {

						this.disclaimers.push(
							helper.parseDateRangeToDisclaimer(model, 'dat_fechto_oportun', 'l-date-close')
						);

					} else if (key === 'dat_prev_fechto' && CRMUtil.isDefined(model.start)) {

						this.disclaimers.push(
							helper.parseDateRangeToDisclaimer(model, 'dat_prev_fechto', 'l-date-close-forecast')
						);
					} else if (key === 'val_realzdo_simul' && CRMUtil.isDefined(model.start)) {
						this.disclaimers.push({
							property: 'custom.val_realzdo_simul',
							value: CRMControlOpportunityAdvancedSearch.parseDecimal(model.start) + ";" + CRMControlOpportunityAdvancedSearch.parseDecimal(model.end),
							title: $rootScope.i18n('l-value-simulation', [], 'dts/crm') + ': ' + model.start + " " + $rootScope.i18n('l-to', [], 'dts/crm') + " " + model.end,
							model: {
								property: 'val_realzdo_simul',
								value: model
							}
						});

					} else if (key === 'val_med_vida' && CRMUtil.isDefined(model.start)) {

						this.disclaimers.push({
							property: 'custom.val_med_vida',
							value: CRMControlOpportunityAdvancedSearch.parseDecimal(model.start) + ";" + CRMControlOpportunityAdvancedSearch.parseDecimal(model.end),
							title: $rootScope.i18n('l-value-simulation', [], 'dts/crm') + ': ' + model.start + " " + $rootScope.i18n('l-to', [], 'dts/crm') + " " + model.end,
							model: {
								property: 'val_med_vida',
								value: model
							}
						});
					} else if (key === 'qti_nume_vida_realzdo' && CRMUtil.isDefined(model.start)) {

						this.disclaimers.push({
							property: 'custom.qti_nume_vida_realzdo',
							value: model.start.replace(/\D/g, "") + ";" + model.end.replace(/\D/g, ""),
							title: $rootScope.i18n('l-value-simulation', [], 'dts/crm') + ': ' + model.start + " " + $rootScope.i18n('l-to', [], 'dts/crm') + " " + model.end,
							model: {
								property: 'qti_nume_vida_realzdo',
								value: model
							}
						});
					} else if (key === 'qti_nume_vida' && CRMUtil.isDefined(model.start)) {

						this.disclaimers.push({
							property: 'custom.qti_nume_vida',
							value: model.start.replace(/\D/g, "") + ";" + model.end.replace(/\D/g, ""),
							title: $rootScope.i18n('l-number-of-lifes', [], 'dts/crm') + ': ' + model.start + " " + $rootScope.i18n('l-to', [], 'dts/crm') + " " + model.end,
							model: {
								property: 'qti_nume_vida',
								value: model
							}
						});
					}

				}
			}

			customDisclaimers = attributeHelper.parseAttributeToDisclaimers(this.customFields);

			this.disclaimers = this.disclaimers.concat(customDisclaimers);
		};

		this.getCustomFields = function (customFields, fn) {
			var i;

			attributeFactory.getCustomFields(4, 0, function (result) {

				if (!result) {
					return;
				}

				CRMControlOpportunityAdvancedSearch.customFields = result;

				for (i = 0; i < CRMControlOpportunityAdvancedSearch.customFields.length; i++) {
					attributeHelper.parseAttribute(CRMControlOpportunityAdvancedSearch.customFields[i], true, true);
				}

				if (fn) {
					fn(CRMControlOpportunityAdvancedSearch.customFields);
				}

			});
		};

		this.parseDisclaimersToCustomFields = function (disclaimers, customFields) {

			attributeHelper.parseDisclaimersToCustomFields(disclaimers, customFields, function (model) {
				CRMControlOpportunityAdvancedSearch.customFields = model;
			});

		};

		this.onChangeAccount = function (selected) {
			if (selected) {
				CRMControlOpportunityAdvancedSearch.model.num_id_pessoa = selected;
			}
			if (!parameters.num_id_pessoa || parameters.num_id_pessoa <= 0) {
				CRMControlOpportunityAdvancedSearch.contacts = [];
				this.model.num_id_contat = undefined;
				this.getContacts(undefined);
			}
		};

		this.getAccounts = function (value) {
			if (!value || value === '') { return []; }

			CRMControlOpportunityAdvancedSearch.contacts = [];

			var filter = { property: 'nom_razao_social', value: helper.parseStrictValue(value) };

			accountFactory.typeahead(filter, undefined, function (result) {
				CRMControlOpportunityAdvancedSearch.accounts = result;
			});
		};

		this.getContacts = function (value) {
			var model = CRMControlOpportunityAdvancedSearch.model,
				filter,
				idAccount;

			if (parameters.num_id_pessoa > 0 || (model && model.num_id_pessoa && model.num_id_pessoa.num_id > 0)) {

				if (value && value.length > 0) { return CRMControlOpportunityAdvancedSearch.contacts; }

				idAccount = parameters.num_id_pessoa || this.model.num_id_pessoa.num_id;

				accountFactory.getContacts(idAccount, function (result) {
					if (!result) { return; }
					CRMControlOpportunityAdvancedSearch.contacts = result;
				});

			} else {
				if (!value || value === '') { return []; }
				filter = { property: 'nom_razao_social', value: helper.parseStrictValue(value) };
				contactFactory.typeahead(filter, {entity: 2}, function (result) {
					CRMControlOpportunityAdvancedSearch.contacts = result;
				});
			}
		};

		this.getUsers = function (value) {
			if (!value || value === '') { return []; }
			var filter = { property: 'nom_usuar',  value: helper.parseStrictValue(value) };
			userFactory.typeahead(filter, undefined, function (result) {
				CRMControlOpportunityAdvancedSearch.users = result;
			});
		};

		this.getStrategies = function () {
			opportunityFactory.getAllStrategies(function (result) {
				if (!result) { return; }
				CRMControlOpportunityAdvancedSearch.strategies = result;
			}, true);
		};

		this.onChangeStrategy = function (strategy) {
			this.model.num_id_fase = undefined;
			if (CRMUtil.isUndefined(strategy)) {
				this.getPhases(undefined);
			} else {
				this.getPhases(strategy.num_id);
			}
		};

		this.getPhases = function (strategyId) {
			opportunityFactory.getAllPhases(strategyId, function (result) {
				if (!result) { return; }
				CRMControlOpportunityAdvancedSearch.phases = result;
			},   true);
		};

		this.getProbabilities = function () {
			opportunityFactory.getAllProbabilities(function (result) {
				if (!result) { return; }
				CRMControlOpportunityAdvancedSearch.probabilities = result;
			}, true);
		};

		this.onChangePriceTable = function (priceTable) {
			this.model.num_id_produt = undefined;
			if (CRMUtil.isUndefined(priceTable)) {
				CRMControlOpportunityAdvancedSearch.products = [];
			} else {
				productFactory.getAllProducts(priceTable.num_id, function (result) {
					if (!result) { return; }
					CRMControlOpportunityAdvancedSearch.products = result;
				}, true);
			}
		};

		this.getProducts = function (value) {
			if (CRMUtil.isUndefined(this.model.num_id_tab_preco)) {
				if (!value || value === '') { return []; }
				var filter = [{ property: 'nom_produt', value: helper.parseStrictValue(value) }];
				productFactory.typeahead(filter, undefined, function (result) {
					CRMControlOpportunityAdvancedSearch.products = result;
				});
			} else {
				return CRMControlOpportunityAdvancedSearch.products;
			}
		};

		this.getPriceTables = function (value) {
			if (!value || value === '') { return []; }
			var filter = { property: 'nom_tab_preco', value: helper.parseStrictValue(value) };
			priceTableFactory.typeahead(filter, undefined, function (result) {
				CRMControlOpportunityAdvancedSearch.priceTables = result;
			});
		};

		this.getAllCampaigns = function () {
			campaignFactory.getAllCampaigns(false, undefined, function (result) {
				if (!result) { return; }
				CRMControlOpportunityAdvancedSearch.campaigns = result;
			});
		};

		this.hideAccount = function () {
			var i;
			if (this.isAddEditMode !== true && this.isChild === true) {
				for (i = 0; i < CRMControlOpportunityAdvancedSearch.disclaimers.length; i++) {
					if (CRMControlOpportunityAdvancedSearch.disclaimers[i].property === 'num_id_pessoa') {
						this.isHideAccount = true;
						break;
					}
				}
			}
		};

		this.loadPreferences = function () {
			preferenceFactory.isIntegratedWithGP(function (result) {
				CRMControlOpportunityAdvancedSearch.isIntegratedWithGP = result;
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.isAddEditMode = parameters.isAddEditMode || false;
		this.customFilter = parameters.customFilter || {};
		this.isChild =  parameters.isChild || false;
		this.customFilterList = parameters.customFilterList || [];
		this.isUserPortfolio = parameters.isUserPortfolio || false;

		this.init = function () {

			accessRestrictionFactory.getUserRestrictions('opportunity.advanced.search', $rootScope.currentuser.login, function (result) {
				CRMControlOpportunityAdvancedSearch.accessRestriction = result || {};
			});

			this.getCustomFields(this.customFields, function (customFields) {
				CRMControlOpportunityAdvancedSearch.parseDisclaimersToCustomFields('crm.crm_acess_portal.factory', CRMControlOpportunityAdvancedSearch.disclaimers, customFields);
			});

			if (this.isAddEditMode === true && this.customFilter) {

				if (CRMUtil.isDefined(this.customFilter.title)) {
					this.isEdit = true;
				}

				this.parseDisclaimersToModel(filterHelper.parseToDisclaimers(this.customFilter.value));

			} else {
				this.parseDisclaimersToModel();
			}

			this.loadPreferences();
			this.getContacts();
			this.getStrategies();
			this.getPhases(undefined);
			this.getProbabilities();
			this.getAllCampaigns();
		};

		this.init();
		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlOpportunityAdvancedSearch = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};

	controllerOpportunityAdvancedSearch.$inject = [
		'$rootScope', '$scope', '$modalInstance', 'TOTVSEvent', 'parameters',
		'crm.crm_usuar.factory', 'crm.crm_pessoa.conta.factory', 'crm.crm_pessoa.contato.factory',
		'crm.helper', 'crm.crm_oportun_vda.factory', 'crm.crm_produt.factory',
		'crm.crm_tab_preco.factory', 'crm.opportunity.helper', 'crm.filter.helper',
		'crm.crm_campanha.factory', 'crm.crm_param.factory', 'crm.attribute.helper',
		'crm.crm_atrib.factory', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.opportunity.modal.advanced.search', modalOpportunityAdvancedSearch);

	index.register.controller('crm.opportunity.advanced.search.control', controllerOpportunityAdvancedSearch);
});
