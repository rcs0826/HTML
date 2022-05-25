/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/html/user/user-services.js',
	'/dts/crm/js/api/fchcrm1000.js',
	'/dts/crm/js/api/fchcrm1001.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1003.js',
	'/dts/crm/js/api/fchcrm1005.js',
	'/dts/crm/js/api/fchcrm1006.js',
	'/dts/crm/js/api/fchcrm1007.js',
	'/dts/crm/js/api/fchcrm1009.js',
	'/dts/crm/js/api/fchcrm1054.js',
	'/dts/crm/js/api/fchcrm1056.js',
	'/dts/crm/js/api/fchcrm1058.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/js/zoom/crm_pessoa.js',
	'/dts/crm/js/zoom/crm_campanha.js',
	'/dts/crm/js/zoom/crm_ocor.js',
	'/dts/crm/js/zoom/crm_tar.js',
	'/dts/crm/js/zoom/crm_oportun_vda.js',
	'/dts/crm/js/zoom/crm_histor_acao.js'
], function (index) {

	'use strict';

	var modalRemoveProcessAdvancedSearch,
		controllerRemoveProcessAdvancedSearch;

	// *************************************************************************************
	// *** MODAL ADVANCED SEARCH
	// *************************************************************************************

	modalRemoveProcessAdvancedSearch = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/remove-process/remove-process.advanced.search.html',
				controller: 'crm.remove-process.advanced.search.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};

	modalRemoveProcessAdvancedSearch.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER ADVANCED SEARCH
	// *************************************************************************************

	controllerRemoveProcessAdvancedSearch = function ($rootScope, $scope, $modalInstance, TOTVSEvent, parameters,
													   filterHelper, helper, accountFactory, contactFactory,
													   userFactory, campaignFactory, historyFactory, ticketFactory,
													   opportunityFactory, taskFactory, legend, segmentationFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlRemoveProcessAdvancedSearch = this;

		this.disclaimers = undefined;
		this.model = undefined;

		this.processName = undefined;

		this.users = [];
		this.contacts = [];
		this.accounts = [];
		this.campaigns = [];
		this.histories = [];
		this.tickets = [];
		this.opportunities = [];
		this.tasks = [];
		this.strategies = [];
		this.segmentations = [];
		this.actions = [];

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

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.apply = function (selectedProcess) {
			var closeObj = {},
				processName = '',
				disclaimers;

			this.parseModelToDisclaimers();

			parameters.fixedDisclaimers = parameters.fixedDisclaimers || [];

			disclaimers = parameters.fixedDisclaimers.concat(this.disclaimers);

			disclaimers = filterHelper.clearDisclaimersModel(disclaimers);

			closeObj.disclaimers = disclaimers;
			closeObj.fixedDisclaimers = parameters.fixedDisclaimers;
			closeObj.apply = true;

			$modalInstance.close(closeObj);

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
					model.cod_pessoa_erp = CRMControlRemoveProcessAdvancedSearch.validateAsterisk(model.cod_pessoa_erp);
				}

				for (i = 0; i < disclaimers.length; i++) {
					if (disclaimers[i].property === "custom.idi_tip_cta") {
						if (CRMUtil.isUndefined(model.idi_tip_cta)) {
							model.idi_tip_cta = [];
						}
						model.idi_tip_cta.push(CRMControlRemoveProcessAdvancedSearch.accountTypes[(parseInt(disclaimers[i].value, 10) - 1)]);
					}
				}

				CRMControlRemoveProcessAdvancedSearch.model = model;
				CRMControlRemoveProcessAdvancedSearch.disclaimers = disclaimers;
			});

		};

		this.parseModelToDisclaimers = function () {

			var i,
				key,
				model,
				fixed,
				propertyName = '',
				propertyValue,
				param1,
				item;

			this.disclaimers = [];

			for (key in this.model) {

				if (this.model.hasOwnProperty(key)) {

					model = this.model[key];

					if (CRMUtil.isUndefined(model)) { continue; }

					if (key === 'num_id') {

						this.disclaimers.push({
							property: 'num_id',
							value: model,
							title: $rootScope.i18n('l-code', [], 'dts/crm') + ': ' + model,
							model: {property: 'num_id', value: model}
						});

					} else if (key === 'cod_livre_1') {

						this.disclaimers.push({
							property: 'cod_livre_1',
							value: model,
							title: $rootScope.i18n('l-code', [], 'dts/crm') + ': ' + model,
							model: {property: 'cod_livre_1', value: model}
						});

					} else if (key === 'num_id_pessoa') {

						if (CRMControlRemoveProcessAdvancedSearch.processName === 'attachment') {
							propertyName = 'crm_pessoa.num_id_pessoa';
						} else if (CRMControlRemoveProcessAdvancedSearch.processName === 'account') {
							propertyName = 'num_id';
						} else {
							propertyName = 'num_id_pessoa';
						}

						this.disclaimers.push({
							property: propertyName,
							value: model.num_id,
							title: $rootScope.i18n('l-account', [], 'dts/crm') + ': ' + model.nom_razao_social,
							model: {property: 'num_id_pessoa', value: model}
						});

					} else if (key === 'num_id_contat') {

						propertyName = 'num_id_contat';

						if (CRMControlRemoveProcessAdvancedSearch.processName === 'account') {
							this.disclaimers.push({
								property: 'contact.num_id_contat',
								value: model.num_id,
								title: $rootScope.i18n('l-contact', [], 'dts/crm') + ': ' + model.nom_razao_social,
								model: {
									property: "num_id_contat",
									value: model
								}
							});

						} else {
							this.disclaimers.push({
								property: propertyName,
								value: model.num_id,
								title: $rootScope.i18n('l-contact', [], 'dts/crm') + ': ' + model.nom_razao_social,
								model: {property: 'num_id_contat', value: model}
							});
						}

					} else if (key === 'num_id_usuar_respons') {

						propertyName  = 'num_id_usuar_respons';
						propertyValue = model.num_id;

						if (CRMControlRemoveProcessAdvancedSearch.processName === 'task') {
							propertyName = 'num_id_respons';
						} else if (CRMControlRemoveProcessAdvancedSearch.processName === 'ticket') {
							propertyName = 'num_id_recur';
							propertyValue = model.num_id_recur;
						}

						this.disclaimers.push({
							property: propertyName,
							value: propertyValue,
							title: $rootScope.i18n('l-user-responsible', [], 'dts/crm') + ': ' + model.nom_usuar,
							model: {property: 'num_id_usuar_respons', value: model}
						});

					} else if (key === 'num_id_usuar') {

						propertyName = 'num_id_usuar';

						if (CRMControlRemoveProcessAdvancedSearch.processName === 'ticket') {
							propertyName = 'num_id_usuar_abert';
						}

						this.disclaimers.push({
							property: propertyName,
							value: model.num_id,
							title: $rootScope.i18n('l-user-open', [], 'dts/crm') + ': ' + model.nom_usuar,
							model: {property: 'num_id_usuar', value: model}
						});

					} else if (key === 'num_id_estrateg_vda') {

						this.disclaimers.push({
							property: 'num_id_estrateg_vda',
							value: model.num_id,
							title: $rootScope.i18n('l-sales-strategy', [], 'dts/crm') + ': ' + model.des_estrateg_vda,
							model: {property: 'num_id_estrateg_vda', value: model}
						});

					} else if (key === 'num_id_usr_fechto') {

						this.disclaimers.push({
							property: 'num_id_usr_fechto',
							value: model.num_id,
							title: $rootScope.i18n('l-user-close', [], 'dts/crm') + ': ' + model.nom_usuar,
							model: {property: 'num_id_usr_fechto', value: model}
						});

					} else if (key === 'num_id_acao') {

						this.disclaimers.push({
							property: 'num_id_acao',
							value: model.num_id,
							title: $rootScope.i18n('l-action', [], 'dts/crm') + ': ' + model.nom_acao,
							model: {property: 'num_id_acao', value: model}
						});

					} else if (key === 'num_id_campanha') {

						if (CRMControlRemoveProcessAdvancedSearch.processName === 'attachment') {
							propertyName = 'crm_campanha.num_id_campanha';
						} else if (CRMControlRemoveProcessAdvancedSearch.processName === 'campaign') {
							propertyName = 'num_id';
						} else {
							propertyName = 'num_id_campanha';
						}

						this.disclaimers.push({
							property: propertyName,
							value: model.num_id,
							title: $rootScope.i18n('l-campaign', [], 'dts/crm') + ': ' + model.nom_campanha,
							model: {property: 'num_id_campanha', value: model}
						});

					} else if (key === 'num_id_historico') {

						this.disclaimers.push({
							property: 'crm_histor_acao.num_id_historico',
							value: model.num_id,
							title: $rootScope.i18n('l-history', [], 'dts/crm') + ': ' + model.ttAcao.nom_acao,
							model: {property: 'num_id_historico', value: model}
						});

					} else if (key === 'num_id_ocor') {

						this.disclaimers.push({
							property: 'crm_ocor.num_id_ocor',
							value: model.num_id,
							title: $rootScope.i18n('l-ticket', [], 'dts/crm') + ': ' + model.nom_ocor,
							model: {property: 'num_id_ocor', value: model}
						});

					} else if (key === 'num_id_oportun_vda') {

						this.disclaimers.push({
							property: 'crm_oportun_vda.num_id_oportun_vda',
							value: model.num_id,
							title: $rootScope.i18n('l-opportunity', [], 'dts/crm') + ': ' + model.des_oportun_vda,
							model: {property: 'num_id_oportun_vda', value: model}
						});

					} else if (key === 'cod_pessoa_erp') {

						this.disclaimers.push({
							property: 'cod_pessoa_erp',
							value: helper.parseStrictValue(model),
							title: $rootScope.i18n('l-code-erp', [], 'dts/crm') + ': ' + model
						});

					} else if (key === 'num_id_tar') {

						this.disclaimers.push({
							property: 'crm_tar.num_id_tar',
							value: model.num_id,
							title: $rootScope.i18n('l-task', [], 'dts/crm') + ': ' + model.ttAcao.nom_acao,
							model: {property: 'num_id_tar', value: model}
						});

					} else if (key === 'num_id_segmtcao') {

						this.disclaimers.push({
							property: 'num_id_segmtcao',
							value: model.num_id,
							title: $rootScope.i18n('l-segmentation', [], 'dts/crm') + ': ' + model.nom_segmtcao_public,
							model: {property: 'num_id_segmtcao', value: model}
						});

					} else if (key === 'dat_cadastro' && CRMUtil.isDefined(model.start)) {
						this.disclaimers.push(helper.parseDateRangeToDisclaimer(model, 'dat_cadastro', 'l-date-create'));
					} else if (key === 'dat_atualiz' && CRMUtil.isDefined(model.start)) {
						this.disclaimers.push(helper.parseDateRangeToDisclaimer(model, 'dat_atualiz', 'l-date-update'));
					} else if (key === 'dat_inic' && CRMUtil.isDefined(model.start)) {
						this.disclaimers.push(helper.parseDateRangeToDisclaimer(model, 'dat_inic', 'l-date-start'));
					} else if (key === 'idi_tip_cta') {
						if (angular.isArray(model)) {
							for (i = 0; i < model.length; i++) {
								item = model[i];

								switch (item.num_id) {
								case 1:
									param1 = $rootScope.i18n('l-lead', [], 'dts/crm');
									break;
								case 2:
									param1 = $rootScope.i18n('l-client', [], 'dts/crm');
									break;
								case 3:
									param1 = $rootScope.i18n('l-contact', [], 'dts/crm');
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

								this.disclaimers.push({
									property: 'custom.idi_tip_cta',
									value: item.num_id,
									title: param1 + ": " + $rootScope.i18n('l-yes', [], 'dts/crm')
								});
							}
						}
					} else if (key === 'idi_tip_cta_lead' && model === true) {

						this.disclaimers.push({
							property: 'custom.idi_tip_cta',
							value: legend.accountType.ID.LEAD,
							title: $rootScope.i18n('l-lead', [], 'dts/crm') + ": " + $rootScope.i18n('l-yes', [], 'dts/crm'),
							model: {property: 'idi_tip_cta_lead', value: true}
						});

					} else if (key === 'idi_tip_cta_client' && model === true) {

						this.disclaimers.push({
							property: 'custom.idi_tip_cta',
							value: legend.accountType.ID.CLIENT,
							title: $rootScope.i18n('l-client', [], 'dts/crm') + ": " + $rootScope.i18n('l-yes', [], 'dts/crm'),
							model: { property: 'idi_tip_cta_client', value: true }
						});

					} else if (key === 'idi_tip_cta_contact' && model === true) {

						this.disclaimers.push({
							property: 'custom.idi_tip_cta',
							value: legend.accountType.ID.CONTACT,
							title: $rootScope.i18n('l-contact', [], 'dts/crm') + ": " + $rootScope.i18n('l-yes', [], 'dts/crm'),
							model: { property: 'idi_tip_cta_contact', value: true }
						});

					} else if (key === 'idi_tip_cta_provider' && model === true) {

						this.disclaimers.push({
							property: 'custom.idi_tip_cta',
							value: legend.accountType.ID.PROVIDER,
							title: $rootScope.i18n('l-provider', [], 'dts/crm') + ": " + $rootScope.i18n('l-yes', [], 'dts/crm'),
							model: { property: 'idi_tip_cta_provider', value: true }
						});

					} else if (key === 'idi_tip_cta_client_provider' && model === true) {

						this.disclaimers.push({
							property: 'custom.idi_tip_cta',
							value: legend.accountType.ID.CLIENT_PROVIDER,
							title: $rootScope.i18n('l-client-provider', [], 'dts/crm') + ": " + $rootScope.i18n('l-yes', [], 'dts/crm'),
							model: { property: 'idi_tip_cta_client_provider', value: true }
						});

					} else if (key === 'idi_tip_cta_client_contact' && model === true) {

						this.disclaimers.push({
							property: 'custom.idi_tip_cta',
							value: legend.accountType.ID.CLIENT_CONTACT,
							title: $rootScope.i18n('l-client-contact', [], 'dts/crm') + ": " + $rootScope.i18n('l-yes', [], 'dts/crm'),
							model: { property: 'idi_tip_cta_client_contact', value: true }
						});

					}
				}
			}

		};

		this.getSegmentations = function () {
			segmentationFactory.getAllSegmentations(function (result) {
				if (!result) { return; }
				CRMControlRemoveProcessAdvancedSearch.segmentations = result;
			}, true);
		};

		this.getStrategies = function () {
			opportunityFactory.getAllStrategies(function (result) {
				if (!result) { return; }
				CRMControlRemoveProcessAdvancedSearch.strategies = result;
			}, true);
		};

		this.getContacts = function (value) {
			var model = CRMControlRemoveProcessAdvancedSearch.model,
				filter,
				idAccount;

			if (parameters.num_id_pessoa > 0 || (model && model.num_id_pessoa && model.num_id_pessoa.num_id > 0)) {

				if (value && value.length > 0) { return CRMControlRemoveProcessAdvancedSearch.contacts; }

				idAccount = parameters.num_id_pessoa || CRMControlRemoveProcessAdvancedSearch.model.num_id_pessoa.num_id;

				accountFactory.getContacts(idAccount, function (result) {
					if (!result) { return; }
					CRMControlRemoveProcessAdvancedSearch.contacts = result;
				});

			} else {
				if (!value || value === '') { return []; }

				filter = { property: 'nom_razao_social', value: helper.parseStrictValue(value) };

				contactFactory.typeahead(filter, {entity: 2}, function (result) {
					CRMControlRemoveProcessAdvancedSearch.contacts = result;
				});
			}
		};

		this.getUsers = function (value) {
			if (!value || value === '') { return []; }

			value = helper.parseStrictValue(value);
			var filter = { property: 'nom_usuar',  value: value };

			userFactory.findRecords(filter, undefined, function (result) {
				CRMControlRemoveProcessAdvancedSearch.users = result;
			});
		};

		this.getAccounts = function (value) {
			if (!value || value === '') { return []; }

			CRMControlRemoveProcessAdvancedSearch.contacts = [];

			value = helper.parseStrictValue(value);
			var filter = { property: 'nom_razao_social', value: value };

			accountFactory.typeahead(filter, undefined, function (result) {
				CRMControlRemoveProcessAdvancedSearch.accounts = result;
			});
		};

		this.getCampaigns = function (value) {
			if (!value || value === '') { return []; }

			value = helper.parseStrictValue(value);
			var filter = { property: 'nom_campanha', value: value };

			campaignFactory.typeahead(filter, undefined, function (result) {
				CRMControlRemoveProcessAdvancedSearch.campaigns = result;
			});
		};

		this.getHistories = function (value) {
			if (!value || value === '') { return []; }

			value = helper.parseStrictValue(value);
			var filter = { property: 'crm_acao.nom_acao', value: value };

			historyFactory.typeahead(filter, undefined, function (result) {
				CRMControlRemoveProcessAdvancedSearch.histories = result || [];
			});
		};

		this.getTickets = function (value) {
			if (!value || value === '') { return []; }

			value = helper.parseStrictValue(value);
			var filter = { property: 'nom_ocor', value: value };

			ticketFactory.typeahead(filter, undefined, function (result) {
				CRMControlRemoveProcessAdvancedSearch.tickets = result;
			});
		};

		this.getOpportunities = function (value) {
			if (!value || value === '') { return []; }

			value = helper.parseStrictValue(value);
			var filter = { property: 'des_oportun_vda', value: value };

			opportunityFactory.typeahead(filter, undefined, function (result) {
				CRMControlRemoveProcessAdvancedSearch.opportunities = result;
			});
		};

		this.getTasks = function (value) {
			if (!value || value === '') { return []; }

			value = helper.parseStrictValue(value);
			var filter = { property: 'crm_acao.nom_acao', value: value };

			taskFactory.typeahead(filter, undefined, function (result) {
				CRMControlRemoveProcessAdvancedSearch.tasks = result;
			});
		};

		this.getAllActions = function (isClearAction) {
			var campaignId;

			if (CRMUtil.isDefined(CRMControlRemoveProcessAdvancedSearch.model.num_id_campanha)) {
				campaignId = CRMControlRemoveProcessAdvancedSearch.model.num_id_campanha.num_id;

				if (isClearAction) {
					CRMControlRemoveProcessAdvancedSearch.model.num_id_acao = undefined;
				}
			}

			campaignFactory.getAllActions(campaignId, undefined, function (result) {
				if (!result) { return; }
				CRMControlRemoveProcessAdvancedSearch.actions = result;
			});
		};

		this.onChangeAccount = function (selected) {
			if (selected) {
				CRMControlRemoveProcessAdvancedSearch.model.num_id_pessoa = selected;
			}

			if (!parameters.num_id_pessoa || parameters.num_id_pessoa <= 0) {
				CRMControlRemoveProcessAdvancedSearch.contacts = [];
				this.model.num_id_contat = undefined;
				this.getContacts(undefined);
			}
		};

		this.onChangeCampaign = function (selected) {
			var processName = CRMControlRemoveProcessAdvancedSearch.processName;

			if (processName === 'task' || processName === 'history') {
				if (selected && CRMUtil.isDefined(selected.num_id)) {
					CRMControlRemoveProcessAdvancedSearch.model.num_id_campanha = selected;
				}

				CRMControlRemoveProcessAdvancedSearch.getAllActions(true);
			}
		};

		// *************************************************************************************
		// *** INITIALIZE
		// *************************************************************************************

		this.init = function () {
			CRMControlRemoveProcessAdvancedSearch.parseDisclaimersToModel();

			if (parameters && CRMUtil.isDefined(parameters.processName)) {
				CRMControlRemoveProcessAdvancedSearch.processName = parameters.processName;

				if (parameters.processName === 'opportunity') {
					CRMControlRemoveProcessAdvancedSearch.getStrategies();
				} else if (parameters.processName === 'target') {
					CRMControlRemoveProcessAdvancedSearch.getSegmentations();
				} else if (parameters.processName === 'history') {
					CRMControlRemoveProcessAdvancedSearch.getAllActions(false);
				} else if (parameters.processName === 'task') {
					CRMControlRemoveProcessAdvancedSearch.getAllActions(false);
				}
			}
		};

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlRemoveProcessAdvancedSearch = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};

	controllerRemoveProcessAdvancedSearch.$inject = [
		'$rootScope', '$scope', '$modalInstance', 'TOTVSEvent', 'parameters',
		'crm.filter.helper', 'crm.helper', 'crm.crm_pessoa.conta.factory', 'crm.crm_pessoa.contato.factory',
		'crm.crm_usuar.factory', 'crm.crm_campanha.factory', 'crm.crm_histor_acao.factory',
		'crm.crm_ocor.factory', 'crm.crm_oportun_vda.factory', 'crm.crm_tar.factory', 'crm.legend',
		'crm.crm_segmtcao.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.remove-process.modal.advanced.search', modalRemoveProcessAdvancedSearch);

	index.register.controller('crm.remove-process.advanced.search.control', controllerRemoveProcessAdvancedSearch);
});
