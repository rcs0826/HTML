/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1006.js',
	'/dts/crm/js/api/fchcrm1009.js',
	'/dts/crm/js/api/fchcrm1019.js',
	'/dts/crm/js/api/fchcrm1021.js',
	'/dts/crm/js/api/fchcrm1022.js',
	'/dts/crm/js/api/fchcrm1028.js',
	'/dts/crm/js/api/fchcrm1031.js',
	'/dts/crm/js/api/fchcrm1032.js',
	'/dts/crm/js/api/fchcrm1033.js',
	'/dts/crm/js/api/fchcrm1034.js',
	'/dts/crm/js/api/fchcrm1035.js',
	'/dts/crm/js/api/fchcrm1036.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/api/fchcrm1083.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/js/zoom/crm_pessoa.js',
	'/dts/crm/html/user/user-services.js',
	'/dts/crm/html/account/account-services.list.js',
	'/dts/crm/html/account/account-services.detail.js',
	'/dts/crm/html/account/account-services.edit.js',
	'/dts/crm/html/account/account-services.advanced-search.js',
	'/dts/crm/html/attachment/attachment-services.js',
	'/dts/crm/html/ticket/tag/tag-services.js',
	'/dts/crm/html/ticket/symptom/symptom-services.js',
	'/dts/crm/html/e-mail/e-mail-services.js',
	'/dts/crm/html/report/report-services.list.js',
	'/dts/crm/html/report/report-services.edit.js',
	'/dts/crm/html/report/report-services.detail.js',
	'/dts/crm/html/report/report-services.available.js',
	'/dts/crm/html/report/report-services.parameter.js',
	'/dts/crm/html/report/report-services.advanced-search.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var modalTicketAdvancedSearch,
		controllerTicketAdvancedSearch;

	// *************************************************************************************
	// *** MODAL ADVANCED SEARCH
	// *************************************************************************************

	modalTicketAdvancedSearch = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/ticket/ticket.advanced.search.html',
				controller: 'crm.ticket.advanced.search.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
	modalTicketAdvancedSearch.$inject = ['$modal'];
	// *************************************************************************************
	// *** ADVANCED SERACH
	// *************************************************************************************
	controllerTicketAdvancedSearch = function ($rootScope, $scope, $modalInstance, TOTVSEvent, parameters, legend,
												helper, ticketFactory, $filter, accountFactory, contactFactory, userFactory, $location, ticketHelper, filterHelper, attributeHelper, attributeFactory, causeFactory, accessRestrictionFactory) {
		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlTicketAdvancedSearch = this;

		this.disclaimers = [];
		this.model = undefined;
		this.isChild = false;

		this.isHideAccount = undefined;

		this.accounts = [];
		this.contacts = [];
		this.users = [];
		this.ticketsType = [];
		this.ticketsPriority = [];
		this.origins = [];
		this.status = [];
		this.tags = [];
		this.listOfCauses = [];

		// filtroCustom
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
					title: CRMControlTicketAdvancedSearch.customFilter.title,
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
					title:  $rootScope.i18n('nav-ticket', [], 'dts/crm'),
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
					title:  $rootScope.i18n('nav-ticket', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [fields], 'dts/crm')
				});
			}

			if (CRMControlTicketAdvancedSearch.isEdit !== true && !isInvalidForm) {
				for (i = 0; i < CRMControlTicketAdvancedSearch.customFilterList.length; i++) {
					if (CRMControlTicketAdvancedSearch.customFilterList[i].title === this.customFilter.title) {
						isInvalidForm = true;
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type:   'error',
							title:  $rootScope.i18n('l-ticket', [], 'dts/crm'),
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
						title:  $rootScope.i18n('nav-ticket', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-ticket-close-before-record', [], 'dts/crm')
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
				CRMControlTicketAdvancedSearch.model = model;
				CRMControlTicketAdvancedSearch.disclaimers = disclaimers;
				CRMControlTicketAdvancedSearch.hideAccount();
			});
		};

		this.parseModelToDisclaimers = function () {

			var i,
				key,
				model,
				fixed,
				customDisclaimers;

			this.disclaimers = [];

			for (key in this.model) {
				if (this.model.hasOwnProperty(key)) {
					model = this.model[key];

					if (key === 'num_id_palavra_chave' && CRMUtil.isDefined(model)) {
						this.disclaimers.push({
							property: 'crm_ocor_palavra_chave.num_id_palavra_chave',
							value: model.num_id,
							title: $rootScope.i18n('l-tag', [], 'dts/crm') + ': ' + model.nom_palavra_chave,
							model: {
								property: 'num_id_palavra_chave',
								value: model
							}
						});

					} else if (key === 'num_id_status_ocor' && CRMUtil.isDefined(model)) {
						this.disclaimers.push({
							property: 'crm_status_ocor.num_id_status_ocor', //usa pra fazer a pesquisa
							value: model.num_id,
							title: $rootScope.i18n('l-status', [], 'dts/crm') + ': ' + model.nom_status_ocor,
							model: {
								property: 'num_id_status_ocor', //usa para atualizar o model
								value: model
							}
						});

					} else if (key === 'num_id_orig' && CRMUtil.isDefined(model)) {
						this.disclaimers.push({
							property: 'num_id_orig',
							value: model.num_id,
							title: $rootScope.i18n('l-origin', [], 'dts/crm') + ': ' + model.nom_orig_ocor,
							model: { value: model }
						});

					} else if (key === 'num_id_priorid_ocor' && CRMUtil.isDefined(model)) {
						this.disclaimers.push({
							property: 'num_id_priorid_ocor',
							value: model.num_id,
							title: $rootScope.i18n('l-priority', [], 'dts/crm') + ': ' + model.nom_priorid_ocor,
							model: { value: model }
						});

					} else if (key === 'num_id_tip_ocor' && CRMUtil.isDefined(model)) {
						this.disclaimers.push({
							property: 'num_id_tip_ocor',
							value: model.num_id,
							title: $rootScope.i18n('l-type', [], 'dts/crm') + ': ' + model.nom_tip_ocor,
							model: { value: model }
						});

					} else if (key === 'num_id_usr_fechto' && CRMUtil.isDefined(model)) {
						this.disclaimers.push({
							property: 'num_id_usr_fechto',
							value: model.num_id,
							title: $rootScope.i18n('l-user-close', [], 'dts/crm') + ': ' + model.nom_usuar,
							model: { value: model }
						});

					} else if (key === 'num_id_recur' && CRMUtil.isDefined(model)) {
						this.disclaimers.push({
							property: 'num_id_recur',
							value: model.num_id_recur,
							title: $rootScope.i18n('l-user-responsible', [], 'dts/crm') + ': ' + model.nom_usuar,
							model: { value: model }
						});

					} else if (key === 'num_id_usuar_abert' && CRMUtil.isDefined(model)) {
						this.disclaimers.push({
							property: 'num_id_usuar_abert',
							value: model.num_id,
							title: $rootScope.i18n('l-user-open', [], 'dts/crm') + ': ' + model.nom_usuar,
							model: { value: model }
						});

					} else if (key === 'num_id_contat' && CRMUtil.isDefined(model)) {
						this.disclaimers.push({
							property: 'num_id_contat',
							value: model.num_id,
							title: $rootScope.i18n('l-contact', [], 'dts/crm') + ': ' + model.nom_razao_social,
							model: { value: model }
						});

					} else if (key === 'num_id_pessoa' && CRMUtil.isDefined(model) && this.isHideAccount !== true) {
						fixed = undefined;

						parameters.fixedDisclaimers = parameters.fixedDisclaimers || [];

						for (i = 0; i < parameters.fixedDisclaimers.length; i++) {
							if (parameters.fixedDisclaimers[i].property === 'num_id_pessoa') {
								fixed = parameters.fixedDisclaimers[i];
								break;
							}
						}

						if (fixed && model) {

							fixed.value = model.num_id;
							fixed.title = $rootScope.i18n('l-account', [], 'dts/crm') + ': ' + model.nom_razao_social;
							fixed.model = { value: model };

						} else if (model) {
							this.disclaimers.push({
								property: 'num_id_pessoa',
								value: model.num_id,
								title: $rootScope.i18n('l-account', [], 'dts/crm') + ': ' + model.nom_razao_social +
									(model.cod_pessoa_erp ? ' (' + model.cod_pessoa_erp + ')' : ''),
								model: { value: model }
							});
						}

					} else if ((key === 'dat_abert') && CRMUtil.isDefined(model.start)) {

						this.disclaimers.push(
							helper.parseDateRangeToDisclaimer(model, 'dat_abert', 'l-date-opening')
						);

					} else if ((key === 'dat_fechto') && CRMUtil.isDefined(model.start)) {

						this.disclaimers.push(
							helper.parseDateRangeToDisclaimer(model, 'dat_fechto', 'l-date-close')
						);

					} else if (key === 'num_id_causa_ocor' && CRMUtil.isDefined(model)) {
						this.disclaimers.push({
							property: 'num_id_causa_ocor',
							value: model.num_id,
							title: $rootScope.i18n('l-cause-ticket', [], 'dts/crm') + ': ' + model.nom_causa,
							model: { value: model }
						});

					} else if (key === 'cod_nota_fisc' && CRMUtil.isDefined(model)) {
						this.disclaimers.push({
							property: 'cod_nota_fisc',
							value: model,
							title: $rootScope.i18n('l-invoice-number', [], 'dts/crm') + ': ' + model
						});

					} else if (key === 'cod_ped_clien' && CRMUtil.isDefined(model)) {
						this.disclaimers.push({
							property: 'cod_ped_clien',
							value: model,
							title: $rootScope.i18n('l-sales-order', [], 'dts/crm') + ': ' + model
						});
					}
				}
			}

			customDisclaimers = attributeHelper.parseAttributeToDisclaimers(this.customFields);

			this.disclaimers = this.disclaimers.concat(customDisclaimers);
		};

		this.hideAccount = function () {
			var i;
			if (this.isAddEditMode !== true && this.isChild === true) {
				for (i = 0; i < CRMControlTicketAdvancedSearch.disclaimers.length; i++) {
					if (CRMControlTicketAdvancedSearch.disclaimers[i].property === 'num_id_pessoa') {
						this.isHideAccount = true;
						break;
					}
				}
			}
		};

		this.onChangeAccount = function (selected) {
			if (selected) {
				CRMControlTicketAdvancedSearch.model.num_id_pessoa = selected;
			}
			if (!parameters.num_id_pessoa || parameters.num_id_pessoa <= 0) {
				CRMControlTicketAdvancedSearch.contacts = [];
				this.model.num_id_contat = undefined;
				this.getContacts(undefined);
			}
		};

		this.getAccounts = function (value) {
			if (!value || value === '') {
				return [];
			}
			var filter = { property: 'nom_razao_social', value: helper.parseStrictValue(value) };
			accountFactory.typeahead(filter, undefined, function (result) {
				CRMControlTicketAdvancedSearch.accounts = result;
			});
		};

		this.getContacts = function (value) {

			var filter,
				idAccount;

			if (parameters.num_id_pessoa > 0 || (this.model && this.model.num_id_pessoa && this.model.num_id_pessoa.num_id > 0)) {

				if (value && value.length > 0) { return CRMControlTicketAdvancedSearch.contacts; }

				idAccount = parameters.num_id_pessoa || this.model.num_id_pessoa.num_id;

				accountFactory.getContacts(idAccount, function (result) {
					if (!result) { return; }
					CRMControlTicketAdvancedSearch.contacts = result;
				});

			} else {
				if (!value || value === '') {
					return [];
				}
				filter = { property: 'nom_razao_social', value: helper.parseStrictValue(value) };
				contactFactory.typeahead(filter, {entity: 2}, function (result) {
					CRMControlTicketAdvancedSearch.contacts = result;
				});
			}
		};

		this.getUsers = function (value) {
			if (!value || value === '') {
				return [];
			}
			var filter = { property: 'nom_usuar', value: helper.parseStrictValue(value) };
			userFactory.findRecords(filter, undefined, function (result) {
				CRMControlTicketAdvancedSearch.users = result;
			});
		};

		this.getTicketsType = function () {
			this.ticketsType = [];
			ticketFactory.getTypes(function (data) {
				if (data) {
					CRMControlTicketAdvancedSearch.ticketsType = data;
				}
			});
		};

		this.getTicketsPriority = function () {
			this.ticketsPriority = [];
			ticketFactory.getPriorities(function (data) {
				if (data) {
					CRMControlTicketAdvancedSearch.ticketsPriority = data;
				}
			});
		};

		this.getOrigins = function () {
			this.origins = [];
			ticketFactory.getOrigins(function (data) {
				if (data) {
					CRMControlTicketAdvancedSearch.origins = data;
				}
			});
		};

		this.getStatus = function () {
			this.status = [];
			ticketFactory.getStatus(function (data) {
				if (data) {
					CRMControlTicketAdvancedSearch.status = data;
				}
			});
		};

		this.getTags = function () {
			this.tags = [];
			ticketFactory.getTags(undefined, function (result) {
				if (result) {
					CRMControlTicketAdvancedSearch.tags = result;
				}
			});
		};

		this.getCustomFields = function (customFields, fn) {
			var i;

			attributeFactory.getCustomFields(3, 0, function (result) {

				if (!result) {
					return;
				}

				CRMControlTicketAdvancedSearch.customFields = result;

				for (i = 0; i < CRMControlTicketAdvancedSearch.customFields.length; i++) {
					attributeHelper.parseAttribute(CRMControlTicketAdvancedSearch.customFields[i], true, true);
				}

				if (fn) {
					fn(CRMControlTicketAdvancedSearch.customFields);
				}

			});
		};

		this.getCauses = function (value) {
			if (!value || value === '') { return []; }
			var filter = { property: 'nom_causa', value: '*' + value + '*' };
			causeFactory.typeahead(filter, undefined, function (result) {
				CRMControlTicketAdvancedSearch.listOfCauses = result;
				if (CRMControlTicketAdvancedSearch.listOfCauses.length === 1) {
					CRMControlTicketAdvancedSearch.model.ttCausa = CRMControlTicketAdvancedSearch.listOfCauses[0];
				}
			});
		};

		this.parseDisclaimersToCustomFields = function (disclaimers, customFields) {

			attributeHelper.parseDisclaimersToCustomFields(disclaimers, customFields, function (model) {
				CRMControlTicketAdvancedSearch.customFields = model;
			});

		};

	// *************************************************************************************
	// *** INITIALIZE
	// *************************************************************************************
		this.isAddEditMode = parameters.isAddEditMode || false;
		this.customFilter = parameters.customFilter || {};
		this.customFilterList = parameters.customFilterList || [];
		this.isChild =  parameters.isChild || false;

		this.init = function () {

			accessRestrictionFactory.getUserRestrictions('ticket.advanced.search', $rootScope.currentuser.login, function (result) {
				CRMControlTicketAdvancedSearch.accessRestriction = result || {};
			});

			this.getCustomFields(this.customFields, function (customFields) {
				CRMControlTicketAdvancedSearch.parseDisclaimersToCustomFields(CRMControlTicketAdvancedSearch.disclaimers, customFields);
			});

			if (this.isAddEditMode === true && this.customFilter) {

				if (CRMUtil.isDefined(this.customFilter.title)) {
					this.isEdit = true;
				}

				this.parseDisclaimersToModel(filterHelper.parseToDisclaimers(this.customFilter.value));

			} else {
				this.parseDisclaimersToModel();
			}

			this.getTicketsType();
			this.getTicketsPriority();
			this.getStatus();
			this.getOrigins();
			this.getTags();
		};

		this.init();

	};

	controllerTicketAdvancedSearch.$inject = [
		'$rootScope',
		'$scope',
		'$modalInstance',
		'TOTVSEvent',
		'parameters',
		'crm.legend',
		'crm.helper',
		'crm.crm_ocor.factory',
		'$filter',
		'crm.crm_pessoa.conta.factory',
		'crm.crm_pessoa.contato.factory',
		'crm.crm_usuar.factory',
		'$location',
		'crm.ticket.helper',
		'crm.filter.helper',
		'crm.attribute.helper',
		'crm.crm_atrib.factory',
		'crm.crm_causa_ocor.factory',
		'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.ticket.modal.advanced.search', modalTicketAdvancedSearch);
	index.register.controller('crm.ticket.advanced.search.control', controllerTicketAdvancedSearch);

});
