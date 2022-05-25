/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1000.js',
	'/dts/crm/js/api/fchcrm1001.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1003.js',
	'/dts/crm/js/api/fchcrm1005.js',
	'/dts/crm/js/api/fchcrm1009.js',
    '/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/js/zoom/crm_pessoa.js',
	'/dts/crm/html/task/task-services.advanced-search.js',
	'/dts/crm/html/task/task-services.calendar.js',
	'/dts/crm/html/task/task-services.detail.js',
	'/dts/crm/html/task/task-services.edit.js',
	'/dts/crm/html/task/task-services.list.js',
	'/dts/crm/html/account/account-services.list.js',
	'/dts/crm/html/account/account-services.detail.js',
	'/dts/crm/html/account/account-services.edit.js',
	'/dts/crm/html/account/account-services.advanced-search.js',
	'/dts/crm/html/attachment/attachment-services.js',
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
	var modalHistoryAdvancedSearch,
		controllerHistoryAdvancedSearch;

	// *************************************************************************************
	// *** MODAL ADVANCED SEARCH
	// *************************************************************************************
	modalHistoryAdvancedSearch = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/history/history.advanced.search.html',
				controller: 'crm.history.advanced.search.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};

	modalHistoryAdvancedSearch.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER ADVANCED SEARCH
	// *************************************************************************************

	controllerHistoryAdvancedSearch = function ($rootScope, $scope, $modalInstance, TOTVSEvent, parameters,
											 helper, campaignFactory, userFactory, accountFactory,
											 contactFactory, historyHelper, filterHelper, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlHistoryAdvancedSearch = this;

		this.disclaimers = undefined;
		this.model = undefined;
		this.isChild = false;
		this.isHideAccount = false;
        
        this.accessRestriction = undefined;

		this.campaigns = undefined;
		this.actions = undefined;
		this.medias = undefined;
		this.results = undefined;
		this.details = undefined;
		this.accounts = undefined;
		this.contacts = undefined;
		this.users = undefined;
		this.customFilterList = undefined;

		//filtroCustom
		this.isEdit = false;
		this.customFilter = {};

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.hideAccount = function () {
			var i,
				prop;

			if (this.isAddEditMode !== true && this.isChild === true) {
				for (i = 0; i < CRMControlHistoryAdvancedSearch.disclaimers.length; i++) {
					prop = CRMControlHistoryAdvancedSearch.disclaimers[i].property;

					if (prop === 'num_id_pessoa' || prop === 'num_id_ocor') {
						this.isHideAccount = true;
						break;
					}
				}
			}
		};

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
					title: CRMControlHistoryAdvancedSearch.customFilter.title,
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
				message,
				isPlural,
				messages = [],
				isValidDate,
				isInvalidForm = false;

			if (disclaimers.length <= 0) {

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n('l-history', [], 'dts/crm'),
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
					title:  $rootScope.i18n('l-history', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [fields], 'dts/crm')
				});
			}

			if (CRMControlHistoryAdvancedSearch.isEdit !== true && isInvalidForm === false) {
				for (i = 0; i < CRMControlHistoryAdvancedSearch.customFilterList.length; i++) {
					if (CRMControlHistoryAdvancedSearch.customFilterList[i].title === this.customFilter.title) {
						isInvalidForm = true;
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type:   'error',
							title:  $rootScope.i18n('l-history', [], 'dts/crm'),
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
						title:  $rootScope.i18n('l-history', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-period-before-record', [], 'dts/crm')
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
				CRMControlHistoryAdvancedSearch.model = model;
				CRMControlHistoryAdvancedSearch.disclaimers = disclaimers;
			});
		};

		this.parseModelToDisclaimers = function () {

			var i,
				key,
				model,
				fixed;

			this.disclaimers = [];

			for (key in this.model) {
				if (this.model.hasOwnProperty(key)) {

					model = this.model[key];

					if (CRMUtil.isUndefined(model)) {
						if (key !== 'num_id_usuar') {
							continue;
						}
					}

					if (key === 'num_id_usuar') {

						fixed = undefined;

						parameters.fixedDisclaimers = parameters.fixedDisclaimers || [];

						for (i = 0; i < parameters.fixedDisclaimers.length; i++) {
							if (parameters.fixedDisclaimers[i].property === 'num_id_usuar') {
								fixed = parameters.fixedDisclaimers[i];
								break;
							}
						}

						if (fixed && model) {

							fixed.value = model.num_id;
							fixed.title = $rootScope.i18n('l-user-open', [], 'dts/crm') + ': ' + model.nom_usuar;
							fixed.model = { value: model };

						} else if (model) {

							this.disclaimers.push({
								property: 'num_id_usuar',
								value: model.num_id,
								title: $rootScope.i18n('l-user-open', [], 'dts/crm') + ': ' + model.nom_usuar,
								model: { value: model }
							});
						}

					} else if (key === 'num_id_pessoa') {

						if (model.num_id) {
							this.disclaimers.push({
								property: 'num_id_pessoa',
								value: model.num_id,
								title: $rootScope.i18n('l-account', [], 'dts/crm') + ': ' + model.nom_razao_social +
									(model.cod_pessoa_erp ? ' (' + model.cod_pessoa_erp + ')' : ''),
								model: { value: model }
							});
						}

					} else if (key === 'num_id_contat') {

						this.disclaimers.push({
							property: 'num_id_contat',
							value: model.num_id,
							title: $rootScope.i18n('l-contact', [], 'dts/crm') + ': ' + model.nom_razao_social,
							model: { value: model }
						});

					} else if (key === 'num_id_campanha') {

						this.disclaimers.push({
							property: 'num_id_campanha',
							value: model.num_id,
							title: $rootScope.i18n('l-campaign', [], 'dts/crm') + ': ' + model.nom_campanha,
							model: { value: model }
						});

					} else if (key === 'num_id_acao') {

						this.disclaimers.push({
							property: 'num_id_acao',
							value: model.num_id,
							title: $rootScope.i18n('l-action', [], 'dts/crm') + ': ' + model.nom_acao,
							model: { value: model }
						});

					} else if (key === 'num_id_mid') {

						this.disclaimers.push({
							property: 'num_id_mid',
							value: model.num_id,
							title: $rootScope.i18n('l-media', [], 'dts/crm') + ': ' + model.nom_mid_relacto,
							model: { value: model }
						});

					} else if (key === 'num_id_restdo') {

						this.disclaimers.push({
							property: 'num_id_restdo',
							value: model.num_id,
							title: $rootScope.i18n('l-result', [], 'dts/crm') + ': ' + model.nom_restdo,
							model: { value: model }
						});

					} else if (key === 'num_id_detmnto') {

						this.disclaimers.push({
							property: 'num_id_detmnto',
							value: model.num_id,
							title: $rootScope.i18n('l-detailing', [], 'dts/crm') + ': ' + model.nom_detmnto_restdo,
							model: { value: model }
						});

					} else if (key === 'dat_cadastro' && CRMUtil.isDefined(model.start)) {

						this.disclaimers.push(helper.parseDateRangeToDisclaimer(model, 'dat_cadastro', 'l-date-create'));

					} else if (key === 'dat_inic' && CRMUtil.isDefined(model.start)) {

						this.disclaimers.push(helper.parseDateRangeToDisclaimer(model, 'dat_inic', 'l-date-start'));

					} else if (key === 'dat_fim' && CRMUtil.isDefined(model.start)) {

						this.disclaimers.push(helper.parseDateRangeToDisclaimer(model, 'dat_fim', 'l-date-close'));

					}
				}
			}
		};

		this.getAccounts = function (value) {
			if (!value || value === '') { return []; }
			var filter = { property: 'nom_razao_social', value: helper.parseStrictValue(value) };
			accountFactory.typeahead(filter, undefined, function (result) {
				CRMControlHistoryAdvancedSearch.accounts = result;
			});
		};

		this.getContacts = function (value) {

			var filter,
				idAccount;

			if (parameters.num_id_pessoa > 0
					|| (this.model && this.model.num_id_pessoa && this.model.num_id_pessoa.num_id > 0)) {

				if (value && value.length > 0) { return CRMControlHistoryAdvancedSearch.contacts; }

				idAccount = parameters.num_id_pessoa || this.model.num_id_pessoa.num_id;
				accountFactory.getContacts(idAccount, function (result) {
					if (!result) { return; }
					CRMControlHistoryAdvancedSearch.contacts = result;
				});

			} else {
				if (!value || value === '') { return []; }
				filter = { property: 'nom_razao_social', value: helper.parseStrictValue(value) };
				contactFactory.typeahead(filter, {entity: 2}, function (result) {
					CRMControlHistoryAdvancedSearch.contacts = result;
				});
			}
		};

		this.getUsers = function (value) {
			if (!value || value === '') { return []; }
			var filter = { property: 'nom_usuar', value: helper.parseStrictValue(value) };
			userFactory.typeahead(filter, undefined, function (result) {
				CRMControlHistoryAdvancedSearch.users = result;
			});
		};

		this.getAllCampaigns = function () {
			campaignFactory.getAllCampaigns(false, undefined, function (result) {
				if (!result) { return; }
				CRMControlHistoryAdvancedSearch.campaigns = result;
			});
		};

		this.getAllActions = function (idCampaign) {
			campaignFactory.getAllActions(idCampaign, undefined, function (result) {
				if (!result) { return; }
				CRMControlHistoryAdvancedSearch.actions = result;
			});
		};

		this.getAllMedias = function (idCampaign, idAction) {
			campaignFactory.getAllMedias(idCampaign, idAction, function (result) {
				if (!result) { return; }
				CRMControlHistoryAdvancedSearch.medias = result;
			});
		};

		this.getAllResults = function (idCampaign, idAction) {
			campaignFactory.getAllResults(idCampaign, idAction, function (result) {
				if (!result) { return; }
				CRMControlHistoryAdvancedSearch.results = result;
			});
		};

		this.getAllDetails = function (idResult) {
			campaignFactory.getAllDetails(idResult, function (result) {
				if (!result) { return; }
				CRMControlHistoryAdvancedSearch.details = result || [];
			});
		};

		this.onCampaignChange = function () {

			CRMControlHistoryAdvancedSearch.actions = [];
			this.model.num_id_acao = undefined;

			var campaign = (this.model && this.model.num_id_campanha ? this.model.num_id_campanha : undefined);

			if (campaign && campaign.num_id) {
				this.getAllActions(campaign.num_id);
			} else {
				this.getAllActions();
				this.onActionChange();
			}
		};

		this.onActionChange = function () {

			var action,
				campaign;


			CRMControlHistoryAdvancedSearch.objectives = [];

			this.model.num_id_mid = undefined;
			this.model.num_id_restdo = undefined;

			campaign = (this.model && this.model.num_id_campanha ? this.model.num_id_campanha : undefined);
			action = (this.model && this.model.num_id_acao ? this.model.num_id_acao : undefined);

			if (campaign && campaign.num_id && action && action.num_id) {
				this.getAllMedias(campaign.num_id, action.num_id);
				this.getAllResults(campaign.num_id, action.num_id);
			} else if (!(campaign && campaign.num_id)) {
				this.getAllMedias();
				this.getAllResults();
			}
		};

		this.onAccountChange = function (selected) {
			if (selected) {
				this.model.num_id_pessoa = selected;
			}

			if (!parameters.num_id_pessoa || parameters.num_id_pessoa <= 0) {
				CRMControlHistoryAdvancedSearch.contacts = [];
				this.model.num_id_contat = undefined;
				this.getContacts();
			}
		};

		this.onResultChange = function () {

			CRMControlHistoryAdvancedSearch.details = [];
			this.model.num_id_detmnto = undefined;

			var result = (this.model && this.model.num_id_restdo ? this.model.num_id_restdo : undefined);

			if (result && result.num_id) {
				this.getAllDetails(result.num_id);
			} else {
				this.getAllDetails();
			}
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.isAddEditMode = parameters.isAddEditMode || false;
		this.customFilter = parameters.customFilter || {};
		this.isChild = parameters.isChild || false;
		this.customFilterList = parameters.customFilterList || [];

		this.init = function () {
            
			accessRestrictionFactory.getUserRestrictions('history.advanced.search', $rootScope.currentuser.login, function (result) {
				CRMControlHistoryAdvancedSearch.accessRestriction = result || {};
			});


			if (this.isAddEditMode === true && this.customFilter) {

				if (CRMUtil.isDefined(this.customFilter.title)) {
					this.isEdit = true;
				}

				this.parseDisclaimersToModel(filterHelper.parseToDisclaimers(this.customFilter.value));

			} else {
				this.parseDisclaimersToModel();
			}

			this.getAllCampaigns();
			this.getAllActions();
			this.getAllMedias();
			this.getAllResults();
			this.getAllDetails();
			this.getContacts();
			this.hideAccount();
		};

		this.init();


		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlHistoryAdvancedSearch = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};
	controllerHistoryAdvancedSearch.$inject = [
		'$rootScope', '$scope', '$modalInstance', 'TOTVSEvent', 'parameters',
		'crm.helper', 'crm.crm_campanha.factory', 'crm.crm_usuar.factory',
		'crm.crm_pessoa.conta.factory', 'crm.crm_pessoa.contato.factory', 'crm.history.helper',
		'crm.filter.helper', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.history.modal.advanced.search', modalHistoryAdvancedSearch);
	index.register.controller('crm.history.advanced.search.control', controllerHistoryAdvancedSearch);
});
