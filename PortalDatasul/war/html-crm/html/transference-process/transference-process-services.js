/*globals index, define, angular, TOTVSEvent, CRMUtil */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/js/zoom/crm_pessoa.js',
	'/dts/crm/js/zoom/crm_ocor.js',
	'/dts/crm/js/api/fchcrm1000.js',
	'/dts/crm/js/api/fchcrm1003.js',
	'/dts/crm/js/api/fchcrm1091.js',
	'/dts/crm/js/api/fchcrm1006.js',
	'/dts/crm/js/api/fchcrm1007.js'
], function (index) {

	'use strict';

	var controller;

	// *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************
	controller = function ($scope, $rootScope, TOTVSEvent, helper, userFactory, legend, accountFactory, accountHelper, transferenceFactory, ticketFactory, ticketHelper, opportunityFactory, opportunityHelper, taskFactory, taskHelper) {
		var CRMControl = this;

		this.users = [];

		this.usersDestination = [];

		this.accounts = [];

		this.listOfAccounts = [];

		this.selectedAccounts = [];

		this.pageIndex = 0;

		this.model = {};

		this.disclaimers = [];

		this.lastPage = 5;

		this.listOfTickets = [];

		this.selectedTickets = [];

		this.listOfOpportunity = [];

		this.selectedOpportunities = [];

		this.listOfTasks = [];

		this.selectedTasks = [];

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

		this.groups = {
			account : { open : false },
			ticket : { open: false },
			opportunity: {open: false}
		};

		this.dateTimeBase = new Date().getTime();

		this.isHideAccount = false;

		// *********************************************************************************
		// *** Initialize
		// *********************************************************************************
		this.init = function () {

			var viewName = $rootScope.i18n('nav-transference-process', [], 'dts/crm'),
				viewController = 'crm.transference-process.list.control';

			helper.loadCRMContext(function () {
				helper.startView(viewName, viewController, CRMControl);
			});
		};

		this.getUsers = function (value, isDestination) {
			if (!value || value === '') {
				return [];
			}

			var filter = { property: 'nom_usuar', value: helper.parseStrictValue(value) };
			userFactory.typeahead(filter, undefined, function (result) {
				if (isDestination) {
					CRMControl.usersDestination = result;
				} else {
					CRMControl.users = result;
				}
			});
		};

		this.alertResource = function () {
			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type:   'info',
				title:  $rootScope.i18n('nav-transference-process', [], 'dts/crm'),
				detail: $rootScope.i18n('msg-user-not-resource', [], 'dts/crm')
			});
		};

		this.previousPage = function () {
			if (CRMControl.pageIndex !== 0) {

				if (CRMControl.pageIndex === 3) {
					if (CRMControl.model.num_id_usuar_respons_destino.num_id_recur === 0) {
						CRMControl.pageIndex = CRMControl.pageIndex - 1;
						CRMControl.alertResource();
					}
				}

				CRMControl.pageIndex = CRMControl.pageIndex - 1;
			}
		};

		this.nextPage = function () {
			/* Última página */
			if (CRMControl.pageIndex !== CRMControl.lastPage) {

				if (!CRMControl.isInvalidForm(CRMControl.pageIndex)) {

					if (CRMControl.pageIndex === 0) {

						CRMControl.disclaimers = [];

						CRMControl.disclaimers.push({
							property: 'num_id_usuar_respons',
							value: CRMControl.model.num_id_usuar_respons.num_id,
							title: $rootScope.i18n('l-user-responsible', [], 'dts/crm') + ': ' + CRMControl.model.num_id_usuar_respons.nom_usuar,
							model: CRMControl.model.num_id_usuar_respons,
							fixed: true
						});
					} else if (CRMControl.pageIndex === 1) {
						CRMControl.getSelectedAccounts();
						CRMControl.accounts = [];

						if (CRMControl.model.num_id_usuar_respons_destino.num_id_recur === 0) {
							CRMControl.pageIndex = CRMControl.pageIndex + 1;

							CRMControl.alertResource();
						}

					} else if (CRMControl.pageIndex === 2) {
						CRMControl.getSelectedTickets();
					} else if (CRMControl.pageIndex === 3) {
						CRMControl.getSelectedOpportunities();
					} else if (CRMControl.pageIndex === 4) {
						CRMControl.getSelectedTasks();
					}

					CRMControl.pageIndex = CRMControl.pageIndex + 1;
				}
			}

			if (CRMControl.pageIndex === CRMControl.lastPage) {
				if (CRMControl.selectedAccounts.length === 0 && CRMControl.selectedTickets.length === 0 && CRMControl.selectedOpportunities.length === 0 && CRMControl.selectedTasks.length === 0) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type:   'error',
						title:  $rootScope.i18n('nav-transference-process', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-undefined-selected-process', [], 'dts/crm')
					});
					CRMControl.pageIndex = CRMControl.pageIndex - 1;
					return;
				}
			}

		};

		this.onAccountChange = function (selected) {
			if (selected) {
				selected.$selected = false;
				CRMControl.addAccountInList(selected);
			} else if (CRMControl.model.num_id_pessoa) {
				CRMControl.addAccountInList(CRMControl.model.num_id_pessoa);
			}

			CRMControl.clearAccount();
		};

		this.getAccounts = function (value) {
			var filters = [],
				options = {};

			options.start = 0;
			options.end = 10;
			options.entity = 1;

			if (!value || value === '') {
				return [];
			}

			filters.push({
				property: 'nom_razao_social',
				value: helper.parseStrictValue(value)
			});

			filters.push({
				property: 'num_id_usuar_respons',
				value: CRMControl.model.num_id_usuar_respons.num_id
			});

			accountFactory.findRecords(filters, options, function (result) {
				CRMControl.accounts = result;
			});
		};

		this.onChangeResponsible = function (selected) {
			CRMControl.listOfAccounts = [];
			CRMControl.listOfTickets = [];
			CRMControl.listOfOpportunity = [];
			CRMControl.listOfTasks = [];
			CRMControl.clearAccount();
			CRMControl.clearTicket();
			CRMControl.clearOpportunity();
			CRMControl.clearTask();
		};

		this.clearAccount = function () {
			CRMControl.model.num_id_pessoa = undefined;
			CRMControl.isHideAccount = true;
			CRMControl.isHideAccount = false;
		};

		this.clearTicket = function () {
			CRMControl.model.num_id_pessoa_ocor = undefined;
			CRMControl.model.cod_livre_1 = "";
			CRMControl.model.dat_abert_ocor = {
				start: undefined,
				end: undefined
			};
		};

		this.clearOpportunity = function () {
			CRMControl.model.num_id_pessoa_opp = undefined;
			CRMControl.model.num_id_opp = undefined;
			CRMControl.model.dat_cadastro_opp = {
				start: undefined,
				end: undefined
			};
		};

		this.clearTask = function () {
			CRMControl.model.num_id_pessoa_task = undefined;
			CRMControl.model.num_id_opp_task = undefined;
			CRMControl.model.dat_cadastro_task = {
				start: undefined,
				end: undefined
			};
		};

		this.searchTickets = function () {
			var i,
				filters = [],
				options = {};

			CRMControl.listOfTickets = [];
			options.start = 0;
			options.end = 9999999;

			filters.push({
				property: 'custom.addTicketGp',
				value: true
			});

			filters.push({
				property: 'num_id_recur',
				value: CRMControl.model.num_id_usuar_respons.num_id_recur
			});

			filters.push({
				property: 'custom.dat_fechto',
				value: 'open'
			});

			if (CRMControl.model.cod_livre_1) {
				filters.push({
					property: 'cod_livre_1',
					value: CRMControl.model.cod_livre_1
				});
			}

			if (CRMControl.model.num_id_pessoa_ocor) {
				filters.push({
					property: 'num_id_pessoa',
					value: CRMControl.model.num_id_pessoa_ocor.num_id
				});
			}

			if (CRMControl.model.dat_abert_ocor && CRMControl.model.dat_abert_ocor.start) {
				filters.push(
					helper.parseDateRangeToDisclaimer(CRMControl.model.dat_abert_ocor, 'dat_abert', 'l-date-create')
				);
			}

			ticketFactory.findRecords(filters, options, function (result) {
				if (result) {
					for (i = 0; i < result.length; i++) {
						CRMControl.addTicketInList(result[i]);
					}
				}
			});
		};

		this.searchOpportunities = function () {
			var i,
				filters = [],
				options = {};

			CRMControl.listOfOpportunity = [];
			options.start = 0;
			options.end = 9999999;

			filters.push({
				property: 'num_id_usuar_respons',
				value: CRMControl.model.num_id_usuar_respons.num_id
			});

			filters.push({
				property: 'custom.dat_fechto_oportun',
				value: 'open'
			});

			if (CRMControl.model.num_id_opp) {
				filters.push({
					property: 'num_id',
					value: CRMControl.model.num_id_opp
				});
			}

			if (CRMControl.model.num_id_pessoa_opp) {
				filters.push({
					property: 'num_id_pessoa',
					value: CRMControl.model.num_id_pessoa_opp.num_id
				});
			}

			if (CRMControl.model.dat_cadastro_opp && CRMControl.model.dat_cadastro_opp.start) {
				filters.push(
					helper.parseDateRangeToDisclaimer(CRMControl.model.dat_cadastro_opp, 'dat_cadastro', 'l-date-create')
				);
			}

			opportunityFactory.findRecords(filters, options, function (result) {
				if (result) {
					for (i = 0; i < result.length; i++) {
						CRMControl.addOpportunityInList(result[i]);
					}
				}
			});
		};

		this.searchTasks = function () {
			var i,
				filters = [],
				options = {};

			CRMControl.listOfTasks = [];
			options.start = 0;
			options.end = 9999999;

			filters.push({
				property: 'num_id_respons',
				value: CRMControl.model.num_id_usuar_respons.num_id
			});

			filters.push({
				property: 'custom.tasktransfproc',
				value: 'open'
			});

			if (CRMControl.model.num_id_task) {
				filters.push({
					property: 'num_id',
					value: CRMControl.model.num_id_task
				});
			}

			if (CRMControl.model.num_id_pessoa_task) {
				filters.push({
					property: 'num_id_pessoa',
					value: CRMControl.model.num_id_pessoa_task.num_id
				});
			}

			if (CRMControl.model.dat_cadastro_task && CRMControl.model.dat_cadastro_task.start) {
				filters.push(
					helper.parseDateRangeToDisclaimer(CRMControl.model.dat_cadastro_task, 'dat_cadastro', 'l-date-create')
				);
			}

			taskFactory.findRecords(filters, options, function (result) {
				if (result) {
					for (i = 0; i < result.length; i++) {
						CRMControl.addTaskInList(result[i]);
					}
				}
			});
		};

		this.addTicketInList = function (ticket) {
			ticketHelper.parseTicketStatus(ticket);

			CRMControl.listOfTickets.push(ticket);
		};

		this.addOpportunityInList = function (opp) {
			opportunityHelper.parseOpportunityColor(opp);

			CRMControl.listOfOpportunity.push(opp);
		};

		this.addTaskInList = function (task) {
			taskHelper.parseTaskColor(task);
			taskHelper.parseRelatedTo(task);
			CRMControl.listOfTasks.push(task);
		};

		this.searchAccounts = function () {
			var i,
				filters = [],
				options = {};

			CRMControl.listOfAccounts = [];

			options.start = 0;
			options.end = 9999999;

			filters.push({
				property: 'num_id_usuar_respons',
				value: CRMControl.model.num_id_usuar_respons.num_id
			});

			if (CRMControl.model.idi_tip_cta) {
				for (i = 0; i < CRMControl.model.idi_tip_cta.length; i++) {
					filters.push({
						property: 'custom.idi_tip_cta',
						value: CRMControl.model.idi_tip_cta[i].num_id
					});
				}
			}

			if (CRMControl.model.num_id_pessoa) {
				CRMControl.model.idi_tip_cta = [];

				filters = {
					property: 'num_id',
					value: CRMControl.model.num_id_pessoa.num_id
				};
			}

			accountFactory.findRecords(filters, options, function (result) {
				if (result) {
					for (i = 0; i < result.length; i++) {
						CRMControl.addAccountInList(result[i]);
					}
				}
			});
		};

		this.addAccountInList = function (account) {
			if (CRMControl.listOfAccounts.indexOf(account) === -1) {
				CRMControl.listOfAccounts.push(account);
				accountHelper.parsePersonType(account);
				accountHelper.parseAccountType(account);
				accountHelper.parseAccountColor(account);
			}
		};

		this.getSelectedAccounts = function () {
			var i;

			CRMControl.selectedAccounts = [];

			for (i = 0; i < CRMControl.listOfAccounts.length; i++) {
				if (CRMControl.listOfAccounts[i].$selected) {
					CRMControl.selectedAccounts.push(CRMControl.listOfAccounts[i]);
				}
			}
		};

		this.getSelectedTickets = function () {
			var i;

			CRMControl.selectedTickets = [];

			for (i = 0; i < CRMControl.listOfTickets.length; i++) {
				if (CRMControl.listOfTickets[i].$selected) {
					CRMControl.selectedTickets.push(CRMControl.listOfTickets[i]);
				}
			}
		};

		this.getSelectedOpportunities = function () {
			var i;

			CRMControl.selectedOpportunities = [];

			for (i = 0; i < CRMControl.listOfOpportunity.length; i++) {
				if (CRMControl.listOfOpportunity[i].$selected) {
					CRMControl.selectedOpportunities.push(CRMControl.listOfOpportunity[i]);
				}
			}
		};

		this.getSelectedTasks = function () {
			var i;

			CRMControl.selectedTasks = [];

			for (i = 0; i < CRMControl.listOfTasks.length; i++) {
				if (CRMControl.listOfTasks[i].$selected) {
					CRMControl.selectedTasks.push(CRMControl.listOfTasks[i]);
				}
			}
		};

		this.transfer = function () {
			var i,
				vo = { ttParametrosVO : {}, ttContasVO : [], ttOcorrenciasVO : [], ttOportunidadesVO: [], ttTarefasVO: []};

			if (CRMControl.model.num_id_usuar_respons) {
				vo.ttParametrosVO.num_id_usuar = CRMControl.model.num_id_usuar_respons.num_id;
			}

			if (CRMControl.model.num_id_usuar_respons_destino) {
				vo.ttParametrosVO.num_id_usuar_respons = CRMControl.model.num_id_usuar_respons_destino.num_id;
			}

			if (CRMControl.model.dat_valid && (CRMControl.model.dat_valid.start && CRMControl.model.dat_valid.end)) {
				vo.ttParametrosVO.dat_inic = CRMControl.model.dat_valid.start;
				vo.ttParametrosVO.dat_fim = CRMControl.model.dat_valid.end;
			}

			if (CRMControl.model.motivo) {
				vo.ttParametrosVO.des_motivo = CRMControl.model.motivo;
			}

			for (i = 0; i < CRMControl.selectedAccounts.length; i++) {
				vo.ttContasVO.push({
					num_id: CRMControl.selectedAccounts[i].num_id
				});
			}

			for (i = 0; i < CRMControl.selectedTickets.length; i++) {
				vo.ttOcorrenciasVO.push({
					num_id: CRMControl.selectedTickets[i].num_id
				});
			}

			for (i = 0; i < CRMControl.selectedOpportunities.length; i++) {
				vo.ttOportunidadesVO.push({
					num_id: CRMControl.selectedOpportunities[i].num_id
				});
			}

			for (i = 0; i < CRMControl.selectedTasks.length; i++) {
				vo.ttTarefasVO.push({
					num_id: CRMControl.selectedTasks[i].num_id
				});
			}

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-attention',
				cancelLabel: 'l-no',
				confirmLabel: 'l-yes',
				text: $rootScope.i18n('msg-transfer-process', [
					CRMControl.model.num_id_usuar_respons.nom_usuar,
					CRMControl.model.num_id_usuar_respons_destino.nom_usuar
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) {
						return;
					}

					transferenceFactory.transfer(vo, function (result) {
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type:   'warning',
							title:  $rootScope.i18n('nav-transference-process', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-transference-generate', [], 'dts/crm')
						});
					});

					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type:   'info',
						title:  $rootScope.i18n('nav-transference-process', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-save-transference', [], 'dts/crm')
					});

					CRMControl.clearModel();
				}
			});
		};

		this.clearModel = function () {
			CRMControl.model.num_id_usuar_respons = {};
			CRMControl.model.num_id_usuar_respons_destino = {};
			CRMControl.model = {};
			CRMControl.pageIndex = 0;
			CRMControl.disclaimers = [];
			CRMControl.listOfAccounts = [];
			CRMControl.listOfTickets = [];
			CRMControl.listOfOpportunity = [];
			CRMControl.listOfTasks = [];
		};

		this.isInvalidForm = function (pageIndex) {
			var messages = [],
				isInvalidForm = false,
				fields,
				isPlural,
				message,
				i;

			if (pageIndex === 0) {
				if (!CRMControl.model.num_id_usuar_respons) {
					isInvalidForm = true;
					messages.push('l-user-responsible');
				}

				if (!CRMControl.model.num_id_usuar_respons_destino) {
					isInvalidForm = true;
					messages.push('l-user-responsible-destination');
				}

				if (!CRMControl.model.dat_valid || (!CRMControl.model.dat_valid.start || !CRMControl.model.dat_valid.end)) {
					isInvalidForm = true;
					messages.push('l-expiration-date');
				}

				if (!CRMControl.model.motivo) {
					isInvalidForm = true;
					messages.push('l-reason-transference');
				}

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
					title:  $rootScope.i18n('nav-transference-process', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [fields], 'dts/crm')
				});

			} else {

				if (CRMControl.model.num_id_usuar_respons.num_id === CRMControl.model.num_id_usuar_respons_destino.num_id) {
					isInvalidForm = true;
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type:   'error',
						title:  $rootScope.i18n('nav-transference-process', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-different-responsibles', [], 'dts/crm')
					});
				}
                
                if (CRMControl.model.num_id_usuar_respons_destino && CRMControl.model.num_id_usuar_respons_destino.log_suspenso === true) {
					isInvalidForm = true;
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type:   'error',
						title:  $rootScope.i18n('nav-transference-process', [], 'dts/crm'),
						detail: $rootScope.i18n('l-user-suspended', [], 'dts/crm')
					});
				}

			}

			return isInvalidForm;
		};

		this.init();

	};

	controller.$inject = [
		'$scope', '$rootScope', 'TOTVSEvent', 'crm.helper', 'crm.crm_usuar.factory', 'crm.legend', 'crm.crm_pessoa.conta.factory', 'crm.account.helper', 'crm.crm_log_transf.factory', 'crm.crm_ocor.factory', 'crm.ticket.helper', 'crm.crm_oportun_vda.factory', 'crm.opportunity.helper', 'crm.crm_tar.factory', 'crm.task.helper'
	];

	// ########################################################
	// ### Register
	// ########################################################
	index.register.controller('crm.transference-process.list.control', controller);

});
