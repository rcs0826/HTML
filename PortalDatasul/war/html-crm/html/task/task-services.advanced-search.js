/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1000.js',
	'/dts/crm/js/api/fchcrm1001.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1009.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/api/fchcrm1046.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/js/zoom/crm_pessoa.js',
	'/dts/crm/js/zoom/crm_tar.js',
	'/dts/crm/js/zoom/crm_ocor.js',
	'/dts/crm/js/zoom/crm_histor_acao.js',
	'/dts/crm/js/zoom/crm_oportun_vda.js',
	'/dts/crm/js/crm-calendar-proxy.js',
	'/dts/crm/html/account/account-services.list.js',
	'/dts/crm/html/account/account-services.detail.js',
	'/dts/crm/html/account/account-services.edit.js',
	'/dts/crm/html/account/account-services.advanced-search.js',
	'/dts/crm/html/history/history-services.list.js',
	'/dts/crm/html/history/history-services.detail.js',
	'/dts/crm/html/history/history-services.advanced-search.js',
	'/dts/crm/html/history/history-services.edit.js',
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

	var modalTaskAdvancedSearch,
		controllerTaskAdvancedSearch;

	// *************************************************************************************
	// *** MODAL ADVANCED SEARCH
	// *************************************************************************************

	modalTaskAdvancedSearch = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/task/task.advanced.search.html',
				controller: 'crm.task.advanced.search.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
	modalTaskAdvancedSearch.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER ADVANCED SEARCH
	// *************************************************************************************

	controllerTaskAdvancedSearch = function ($rootScope, $scope, $modalInstance, TOTVSEvent,
										  parameters, legend, helper, taskHelper, campaignFactory,
										  userFactory, accountFactory, contactFactory,
										  filterHelper, taskFactory, groupUserFactory, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlTaskAdvancedSearch = this;

		this.disclaimers = undefined;
		this.model = undefined;
		this.isHideAccount = false;
		this.isChild = false;
		this.isActiveUserGroup = false;

		this.campaigns = [];
		this.actions = [];
		this.objectives = [];
		this.accounts = [];
		this.contacts = [];
		this.users = [];
		this.groups = [];

		this.status = angular.copy(taskHelper.virtualStatus);
		//this.status.unshift(taskHelper.status[0]);

		this.isEdit = false;
		this.customFilter = {};

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.apply = function (doApply) {

			var i,
				closeObj = {},
				disclaimers;

			this.parseModelToDisclaimers();

			parameters.fixedDisclaimers = parameters.fixedDisclaimers || [];

			if (parameters.fixedDisclaimers.length > 0) {
				for (i = 0; i < this.disclaimers.length; i += 1) {
					if (this.disclaimers[i].property === 'custom.num_id_respons') {
						parameters.fixedDisclaimers.splice(i, 1);
						break;
					}
				}
			}

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
					title: CRMControlTaskAdvancedSearch.customFilter.title,
					value: disclaimers
				});
			}

			closeObj.fixedDisclaimers = parameters.fixedDisclaimers;

			closeObj.apply = doApply;

			$modalInstance.close(closeObj);
		};

		this.isInvalidForm = function (disclaimers) {

			var messages = [],
				isInvalidForm = false,
				fields = '',
				isPlural = messages.length > 1,
				message,
				i,
				isValidDate;

			if (disclaimers.length <= 0) {

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n('l-task', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-form-validation-disclaimers', [], 'dts/crm')
				});

				return true;
			}

			if (!this.customFilter.title || this.customFilter.title.trim().length <= 0) {
				isInvalidForm = true;
				messages.push('l-title');
			}

			if (isInvalidForm) {

				message = 'msg-form-validation' + (isPlural ? '-plural' : '');

				for (i = 0; i < messages.length; i += 1) {
					fields += $rootScope.i18n(messages[i], [], 'dts/crm');
					if (isPlural && i !== (messages.length - 1)) {
						fields += ', ';
					}
				}

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n('l-task', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [fields], 'dts/crm')
				});
			}

			if (CRMControlTaskAdvancedSearch.isEdit !== true && !isInvalidForm) {
				for (i = 0; i < CRMControlTaskAdvancedSearch.customFilterList.length; i++) {
					if (CRMControlTaskAdvancedSearch.customFilterList[i].title === this.customFilter.title) {
						isInvalidForm = true;
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type:   'error',
							title:  $rootScope.i18n('l-task', [], 'dts/crm'),
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
						title:  $rootScope.i18n('l-task', [], 'dts/crm'),
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
			var i;
			disclaimers = disclaimers || parameters.disclaimers;

			helper.parseDisclaimersToModel(disclaimers, function (model, disclaimers) {
				for (i = 0; i < disclaimers.length; i++) {
					if (disclaimers[i].property === 'custom.num_id_respons') {

						if (CRMUtil.isUndefined(model.num_id_respons)) {
							model.num_id_respons = {};
							model.num_id_respons.objSelected = [];
						}

						model.num_id_respons.objSelected.push(disclaimers[i].model);
					}
				}

				CRMControlTaskAdvancedSearch.model = model;
				CRMControlTaskAdvancedSearch.disclaimers = disclaimers;
			});
		};

		this.parseModelToDisclaimers = function () {

			var i,
				key,
				model,
				property;

			this.disclaimers = [];

			for (key in this.model) {

				if (this.model.hasOwnProperty(key)) {

					model = this.model[key];

					if (CRMUtil.isUndefined(model)) {
						if (key !== 'num_id_respons') {
							continue;
						}
					}

					if (key === 'num_id') {

						this.disclaimers.push({
							property: 'num_id',
							value: model,
							title: $rootScope.i18n('l-code', [], 'dts/crm') + ': ' + model
						});

					} else if (key === 'num_id_respons') {

						if (model) {

							if (model.objSelected) {
								for (i = 0; i < model.objSelected.length; i++) {
									this.disclaimers.push({
										property: 'custom.num_id_respons',
										value: model.objSelected[i].num_id,
										title: $rootScope.i18n('l-user-responsible', [], 'dts/crm') + ': ' + model.objSelected[i].nom_usuar,
										model: model.objSelected[i]
									});
								}
							} else {
								this.disclaimers.push({
									property: 'custom.num_id_respons',
									value: model.num_id,
									title: $rootScope.i18n('l-user-responsible', [], 'dts/crm') + ': ' + model.nom_usuar,
									model: model
								});
							}
						}

					} else if (key === 'num_id_usuar') {

						this.disclaimers.push({
							property: 'num_id_usuar',
							value: model.num_id,
							title: $rootScope.i18n('l-user-open', [], 'dts/crm') + ': ' + model.nom_usuar,
							model: { value: model }
						});

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

					} else if (key === 'idi_status_tar') {

						switch (model.vId) {
						case 10:
							property = 'idi_status_tar';
							break;
						case 11:
							property = 'custom.onTime';
							break;
						case 20:
							property = 'idi_status_tar';
							break;
						case 30:
							property = 'idi_status_tar';
							break;
						case 12:
							property = 'custom.future';
							break;
						case 13:
							property = 'custom.late';
							break;
						default:
							property = 'idi_status_tar';
						}

						this.disclaimers.push({
							property: property,
							value: model.num_id,
							title: $rootScope.i18n('l-status', [], 'dts/crm') + ': ' + model.nom_status,
							model: {property: 'idi_status_tar', value: model }
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

					} else if (key === 'num_id_objet') {

						this.disclaimers.push({
							property: 'num_id_objet',
							value: model.num_id,
							title: $rootScope.i18n('l-objective', [], 'dts/crm') + ': ' + model.nom_objet_acao,
							model: { value: model }
						});

					} else if (key === 'num_id_grp_usuar') {

						this.disclaimers.push({
							property: 'num_id_grp_usuar',
							value: model.num_id,
							title: $rootScope.i18n('l-group-user', [], 'dts/crm') + ': ' + model.nom_grp_usuar,
							model: { value: model }
						});

					} else if (CRMControlTaskAdvancedSearch.isCalendar !== true) {

						if (key === 'dat_cadastro' && CRMUtil.isDefined(model.start)) {

							this.disclaimers.push(helper.parseDateRangeToDisclaimer(model, 'dat_cadastro', 'l-date-create'));

						} else if (key === 'dat_exec' && CRMUtil.isDefined(model.start)) {

							this.disclaimers.push(helper.parseDateRangeToDisclaimer(model, 'dat_exec', 'l-date-execution'));

						} else if (key === 'dat_inic' && CRMUtil.isDefined(model.start)) {

							this.disclaimers.push(helper.parseDateRangeToDisclaimer(model, 'dat_inic', 'l-date-start'));

						} else if (key === 'dat_fim' && CRMUtil.isDefined(model.start)) {

							this.disclaimers.push(helper.parseDateRangeToDisclaimer(model, 'dat_fim', 'l-date-close'));

						}
					}
				}
			}
		};

		this.getAccounts = function (value) {
			if (!value || value === '') { return []; }
			var filter = { property: 'nom_razao_social', value: helper.parseStrictValue(value) };
			accountFactory.typeahead(filter, undefined, function (result) {
				CRMControlTaskAdvancedSearch.accounts = result;
			});
		};

		this.getContacts = function (value) {

			var idAccount, filter;

			if (parameters.num_id_pessoa > 0 || (this.model && this.model.num_id_pessoa && this.model.num_id_pessoa.num_id > 0)) {

				if (value && value.length > 0) { return CRMControlTaskAdvancedSearch.contacts; }

				idAccount = parameters.num_id_pessoa || this.model.num_id_pessoa.num_id;

				accountFactory.getContacts(idAccount, function (result) {
					if (!result) { return; }
					CRMControlTaskAdvancedSearch.contacts = result;
				});

			} else {
				if (!value || value === '') { return []; }
				filter = { property: 'nom_razao_social', value: helper.parseStrictValue(value) };
				contactFactory.typeahead(filter, {entity: 2}, function (result) {
					CRMControlTaskAdvancedSearch.contacts = result;
				});
			}
		};

		this.getUsers = function (value, group) {
			if (!value || value === '') { return []; }

			var filter = [{ property: 'nom_usuar', value: helper.parseStrictValue(value) }];

			if (group && group.num_id && group.num_id > 0) {
				filter.push({ property: 'crm_grp_usuar_usuar.num_id_grp_usuar', value: group.num_id });
			}

			userFactory.typeahead(filter, undefined, function (result) {
				CRMControlTaskAdvancedSearch.users = result;
			});
		};

		this.getAllCampaigns = function () {
			campaignFactory.getAllCampaigns(false, undefined, function (result) {
				if (!result) { return; }
				CRMControlTaskAdvancedSearch.campaigns = result;
			});
		};

		this.getAllActions = function (idCampaign) {
			campaignFactory.getAllActions(idCampaign, undefined, function (result) {
				if (!result) { return; }
				CRMControlTaskAdvancedSearch.actions = result;
			});
		};

		this.getAllObjectives = function (idCampaign, idAction) {
			campaignFactory.getAllObjectives(idCampaign, idAction, function (result) {
				if (!result) { return; }
				CRMControlTaskAdvancedSearch.objectives = result;
			});
		};

		this.getGroups = function (idUser) {
			if (idUser) {
				groupUserFactory.getGroupsByUser(idUser, function (result) {
					if (!result) { return; }
					CRMControlTaskAdvancedSearch.groups = result;
				}, true);
			} else {
				groupUserFactory.getAllGroups(function (result) {
					if (!result) { return; }
					CRMControlTaskAdvancedSearch.groups = result;
				}, true);
			}
		};

		this.onCampaignChange = function () {

			CRMControlTaskAdvancedSearch.actions = [];
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

			var campaign, action;

			CRMControlTaskAdvancedSearch.objectives = [];
			this.model.num_id_objet = undefined;

			campaign = (this.model && this.model.num_id_campanha ? this.model.num_id_campanha : undefined);
			action = (this.model && this.model.num_id_acao ? this.model.num_id_acao : undefined);

			if (campaign && campaign.num_id && action && action.num_id) {
				this.getAllObjectives(campaign.num_id, action.num_id);
			} else if (!(campaign && campaign.num_id)) {
				this.getAllObjectives();
			}
		};

		this.onAccountChange = function (selected) {
			if (selected) {
				CRMControlTaskAdvancedSearch.model.num_id_pessoa = selected;
			}
			if (!parameters.num_id_pessoa || parameters.num_id_pessoa <= 0) {
				CRMControlTaskAdvancedSearch.contacts = [];
				this.model.num_id_contat = undefined;
				this.getContacts(undefined);
			}
		};

		this.onGroupChange = function () {
			this.model.num_id_respons = undefined;
			this.users = [];
		};

		this.hideAccount = function () {
			var i,
				prop;

			if (this.isAddEditMode !== true && this.isChild === true) {
				for (i = 0; i < CRMControlTaskAdvancedSearch.disclaimers.length; i++) {
					prop = CRMControlTaskAdvancedSearch.disclaimers[i].property;

					if (prop === 'num_id_pessoa' || prop === 'num_id_ocor') {
						this.isHideAccount = true;
						break;
					}
				}
			}
		};

		this.parseUsersSelected = function (users) {
			if (CRMUtil.isUndefined(users)) { return undefined; }

			if (users.objSelected) {

				if (users.objSelected.length === 1) {
					return users.objSelected[0].nom_usuar;

				} else {
					if (users.objSelected.length > 0) {
						return $rootScope.i18n('l-responsible-selected', [users.objSelected.length], 'dts/crm');
					}
				}

			} else {
				return users.nom_usuar;
			}
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.isCalendar = parameters.isCalendar;
		this.isAddEditMode = parameters.isAddEditMode || false;
		this.customFilter  = parameters.customFilter || {};
		this.customFilterList = parameters.customFilterList || [];
		this.isChild = parameters.isChild || false;

		this.loadPreferences = function () {
			taskFactory.isActiveUserGroup(function (result) {
				CRMControlTaskAdvancedSearch.isActiveUserGroup = result;
			});
		};

		this.init = function () {
			this.loadPreferences();

			accessRestrictionFactory.getUserRestrictions('task.advanced.search', $rootScope.currentuser.login, function (result) {
				CRMControlTaskAdvancedSearch.accessRestriction = result || {};
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
			this.getAllObjectives();
			this.getContacts();
			this.getGroups($rootScope.currentuser.idCRM);
			this.hideAccount();

		};

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlTaskAdvancedSearch = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};
	controllerTaskAdvancedSearch.$inject = [
		'$rootScope', '$scope', '$modalInstance', 'TOTVSEvent', 'parameters',
		'crm.legend', 'crm.helper', 'crm.task.helper', 'crm.crm_campanha.factory',
		'crm.crm_usuar.factory', 'crm.crm_pessoa.conta.factory', 'crm.crm_pessoa.contato.factory',
		'crm.filter.helper', 'crm.crm_tar.factory', 'crm.crm_grp_usuar.factory', 'crm.crm_acess_portal.factory'
	];



	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.task.modal.advanced.search', modalTaskAdvancedSearch);
	index.register.controller('crm.task.advanced.search.control', controllerTaskAdvancedSearch);
});
