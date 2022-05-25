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
	'/dts/crm/html/attribute/attribute-services.tab.js',
	'/dts/crm/html/expense/expense-services.tab.js',
	'/dts/crm/html/ticket/product/ticket-product-services.js',
	'/dts/crm/html/ticket/product/ticket-product-services.edit.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerTicketDetail;

		// *************************************************************************************
	// *** CONTROLLER DETAIL
	// *************************************************************************************

	controllerTicketDetail = function ($rootScope, $scope, $stateParams, $filter, TOTVSEvent, appViewService,
								  ticketHelper, ticketFactory, modalAccountSummary,
								  helper, modalUserSummary, $timeout, modalTicketEdit, accountAddressHelper,
								  accountHelper, $location, accountFactory, modalHistoryEdit, modalTaskEdit,
								  modalEmailEdit, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlTicketDetail = this;

		this.model = undefined;

		this.groupAccountOpen = undefined;

		this.groupContactOpen = undefined;

		this.groupOcorrenciaOrigemOpen = undefined;

		this.isDeleteAvailable = false; // PARAM: LOG_RESTRICT_DEL_OCORR

		this.loadedAccountContent = false;

		this.loadedContactContent = false;

		this.group = {attribute : {open : true}}; // carrega o painel de campos personalizado aberto.

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.load = function (id) {
			var i;

			ticketFactory.getRecord(id, function (result) {

				if (result) {
					CRMControlTicketDetail.model = result;

					ticketHelper.parseTicketStatus(CRMControlTicketDetail.model);

					if (CRMControlTicketDetail.model.ttConta && CRMControlTicketDetail.model.ttConta.ttContaTelefone) {
						for (i = 0; i < CRMControlTicketDetail.model.ttConta.ttContaTelefone.length; i++) {
							accountHelper.parsePhoneIcon(CRMControlTicketDetail.model.ttConta.ttContaTelefone[i]);
						}
					}

					if (CRMControlTicketDetail.model.ttContato && CRMControlTicketDetail.model.ttContato.ttContatoTelefone) {
						for (i = 0; i < CRMControlTicketDetail.model.ttContato.ttContatoTelefone.length; i++) {
							accountHelper.parsePhoneIcon(CRMControlTicketDetail.model.ttContato.ttContatoTelefone[i]);
						}
					}

					if (CRMControlTicketDetail.model.ttConta && CRMControlTicketDetail.model.ttConta.ttContaEndereco) {
						for (i = 0; i < CRMControlTicketDetail.model.ttConta.ttContaEndereco.length; i++) {
							accountAddressHelper.parseType(CRMControlTicketDetail.model.ttConta.ttContaEndereco[i]);
						}
					}

					$timeout(function () {
						$scope.$broadcast(CRMEvent.scopeLoadTicket, result);
					});

					CRMControlTicketDetail.getTexts(result);
				}
			});
		};

		this.getTexts = function (ticket) {

			ticketFactory.getSituation(CRMControlTicketDetail.model.num_id, function (result) {
				if (result) { CRMControlTicketDetail.model.dsl_sit = result.dsl_sit; }
			});

			if (ticket.dat_fechto) {
				ticketFactory.getSolution(CRMControlTicketDetail.model.num_id, function (result) {
					if (result) { CRMControlTicketDetail.model.dsl_soluc = result.dsl_soluc; }
				});
			}
		};

		this.loadAccountContactSummary = function (isContact) {

			if (isContact === false && CRMControlTicketDetail.loadedAccountContent !== false) { return; }
			if (isContact === true && CRMControlTicketDetail.loadedContactContent !== false) { return; }

			var key = isContact === true ? CRMControlTicketDetail.model.ttContato.num_id : CRMControlTicketDetail.model.ttConta.num_id;

			accountFactory.getSummary(key, function (result) {
				if (result) {
					if (isContact === true) {
						CRMControlTicketDetail.loadedContactContent = true;
						CRMControlTicketDetail.model.ttContato = result;
					} else {
						CRMControlTicketDetail.loadedAccountContent = true;
						CRMControlTicketDetail.model.ttConta = result;
					}
				}
			});
		};

		this.loadPreferences = function () {
			ticketFactory.isDeleteAvailable(function (result) {
				if (!result) { return; }
				CRMControlTicketDetail.isDeleteAvailable = result.l_ok;
			});
		};

		this.openUserSummary = function (user) {
			if (user && user.num_id) {
				modalUserSummary.open({
					model: user,
					isResource: (user.num_id_usuar > 0) ? true : false
				});
			}
		};

		this.openAccountSummary = function (model, isAccount) {
			if (model && model.num_id) {
				modalAccountSummary.open({
					model: model,
					isAccount: isAccount
				});
			}
		};

		this.openContactSummary = function () {
			if (this.model.ttContato) {
				modalAccountSummary.open({
					model			 : this.model.ttContato,
					isAccount		 : false,
					idAccount		 : this.model.ttConta.num_id,
					canChangeContact : true
				}).then(function (result) {

					var contact = (result ? result.contact : {}),
						vo = { num_id_contat: undefined };

					if (!CRMControlTicketDetail.model.ttContato || CRMControlTicketDetail.model.ttContato.num_id !== contact.num_id) {
						vo.num_id_contat = contact.num_id;
					}

					ticketFactory.updateRecord(CRMControlTicketDetail.model.num_id, vo, function (result) {
						CRMControlTicketDetail.model.ttContato = contact;
					});
				});
			}
		};

		this.onEdit = function () {

			var ticket = CRMControlTicketDetail.model,
				param = (ticket ? {ticket: ticket, editMode: true} : {});

			modalTicketEdit.open(param).then(function (result) {
				$scope.$broadcast(CRMEvent.scopeLoadTicket, result);
			});
		};

		this.add = function () {
			if (!this.model) { return; }

			var ticket = this.model;

			modalTicketEdit.open({
				ticket: {
					ttOcorrenciaOrigem : ticket,
					canOverrideAccount: true
				}
			}).then(function (ticket) {
				if (CRMUtil.isUndefined(ticket)) { return; }

				$location.path('/dts/crm/ticket/detail/' + ticket.num_id);
			});
		};

		this.duplicate = function () {

			var ticket = CRMControlTicketDetail.model,
				param = (ticket ? {ticket: ticket, duplicateMode: true} : undefined);

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('l-confirm-duplicate', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
				text: $rootScope.i18n('msg-confirm-duplicate-ticket', [
					ticket.num_id
				], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (!isPositiveResult) { return; }

					modalTicketEdit.open(param).then(function (result) {
						if (!result) { return; }
						$location.path('/dts/crm/ticket/detail/' + ticket.num_id);
					});
				}
			});

		};
		//change method name to remove
		this.remove = function () {

			var ticket = CRMControlTicketDetail.model;

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('l-confirm-delete', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
				text: $rootScope.i18n('msg-confirm-delete-ticket', [
					ticket.num_id
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }
					ticketFactory.deleteRecord(ticket.num_id, function (result) {

						if (result.$hasError === true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-ticket', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						$location.path('/dts/crm/ticket/');
					});
				}
			});
		};

		this.reopen = function () {

			var ticket = CRMControlTicketDetail.model;

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('l-confirm-reopen', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
				text: $rootScope.i18n('msg-confirm-reopen', [
					ticket.num_id, ticket.nom_ocor
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					ticketFactory.reopenTicket(ticket.num_id, ticket.num_id_recur, function (result) {

						if (!result) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-ticket', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-success-ticket-reopen', [], 'dts/crm')
						});

						if (result.num_id === CRMControlTicketDetail.model.num_id) {
							ticketHelper.parseTicketStatus(result);
							CRMControlTicketDetail.model =  result;
						}

					});
				}
			});
		};

		this.detailLink = function (id, model, $event) {
			$event.preventDefault();
			$event.stopPropagation();
			$location.path('/dts/crm/' + model + '/detail/' + id);
		};

		this.sendEmail = function (ticket) {
			modalEmailEdit.open({ model: { ttOcorrenciaOrigem: ticket } });
		};

		this.print = ticketFactory.print;

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.groupAccountOpen = false;

		this.groupContactOpen = false;

		this.groupOcorrenciaOrigemOpen = false;

		this.init = function () {
			accessRestrictionFactory.getUserRestrictions('ticket.detail', $rootScope.currentuser.login, function (result) {
				CRMControlTicketDetail.accessRestriction = result || {};

				helper.loadCRMContext(function () {
					appViewService.startView($rootScope.i18n('nav-ticket', [], 'dts/crm'), 'crm.ticket.detail.control', CRMControlTicketDetail);
					CRMControlTicketDetail.model = undefined;

					if ($stateParams && $stateParams.id) {
						CRMControlTicketDetail.loadPreferences();
						CRMControlTicketDetail.load($stateParams.id);
					}
				});
			});

		};

		if ($rootScope.currentuserLoaded) { this.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on(CRMEvent.scopeSaveHistoryOnChangeTicketStatus, function (event, ticket) {
			if (ticket) {
				ticketFactory.getRecord(ticket.num_id, function (newTicket) {
					ticketHelper.parseTicketStatus(newTicket);
					CRMControlTicketDetail.model = newTicket;
					CRMControlTicketDetail.getTexts(CRMControlTicketDetail.model);
				});
			}
		});

		$scope.$on(CRMEvent.scopeSaveTicket, function (event, ticket) {
			if (ticket) {
				if (CRMControlTicketDetail.model.num_id === ticket.num_id) {
					ticketHelper.parseTicketStatus(ticket);
					CRMControlTicketDetail.model = ticket;
					CRMControlTicketDetail.getTexts(CRMControlTicketDetail.model);
				}
			}
		});

		$scope.$on('$destroy', function () {
			CRMControlTicketDetail = undefined;
		});

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControlTicketDetail.init();
		});
	};
	controllerTicketDetail.$inject = [
		'$rootScope', '$scope', '$stateParams', '$filter', 'TOTVSEvent', 'totvs.app-main-view.Service',
		'crm.ticket.helper', 'crm.crm_ocor.factory', 'crm.account.modal.summary', 'crm.helper',
		'crm.user.modal.summary', '$timeout', 'crm.ticket.modal.edit', 'crm.account-address.helper',
		'crm.account.helper', '$location', 'crm.crm_pessoa.conta.factory', 'crm.history.modal.edit', 'crm.task.modal.edit', 'crm.send-email.modal', 'crm.crm_acess_portal.factory'
	];


	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.controller('crm.ticket.detail.control', controllerTicketDetail);

});
