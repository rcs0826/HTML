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
	'/dts/crm/html/expense/expense-services.tab.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerHistoryDetail;

	// *************************************************************************************
	// *** CONTROLLER DETAIL
	// *************************************************************************************

	controllerHistoryDetail = function ($rootScope, $scope, $stateParams, $filter, TOTVSEvent, appViewService,
									 historyHelper, historyFactory, modalAccountSummary, $location,
									 helper, $timeout, accountFactory, modalEmailEdit, modalHistoryEdit, accessRestrictionFactory) {
		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlHistoryDetail = this;

		this.accessRestriction = undefined;

		this.model = undefined;
		this.groupContactOpen = false;
		this.groupAccountOpen = false;
		this.loadAccountContent = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.detailLink = function (id, model, $event) {
			/*Faz não disparar o evento do accordion que está por trás*/
			$event.preventDefault();
			$event.stopPropagation();
			$location.path('/dts/crm/' + model + '/detail/' + id);
		};

		this.load = function (id) {

			historyFactory.getRecord(id, function (result) {

				if (result) {

					historyHelper.parseRelatedTo(result);

					CRMControlHistoryDetail.model = result;

					$timeout(function () {
						$scope.$broadcast(CRMEvent.scopeLoadHistory, result);
					});

					historyFactory.getDescription(id, function (result) {
						if (result) {
							CRMControlHistoryDetail.model.dsl_histor_acao = result.dsl_histor_acao || '';
						}
					});
				}
			});
		};

		this.loadAccountSummary = function () {

			if (CRMControlHistoryDetail.loadAccountContent !== false) { return; }

			accountFactory.getSummary(this.model.ttConta.num_id, function (result) {
				if (result) {
					CRMControlHistoryDetail.model.ttConta = result;
					CRMControlHistoryDetail.loadAccountContent = true;
				}
			});
		};

		this.openAccountSummary = function () {
			if (this.model.ttConta) {
				modalAccountSummary.open({model: this.model.ttConta, isAccount: true});
			}
		};

		this.openContactSummary = function () {
			if (this.model.ttContato) {
				modalAccountSummary.open({
					model			 : this.model.ttContato,
					isAccount		 : false,
					idAccount		 : this.model.ttConta.num_id,
					canChangeContact : false
				});
			}
		};

		this.sendEmail = function (history) {
			modalEmailEdit.open({
				model: {
					ttAcaoOrigem: history
				}
			}).then(function (email) {
				// TODO: ?
			});
		};

		this.onEdit = function () {

			var history = CRMControlHistoryDetail.model;

			if (history.log_acumul_restdo && history.log_acumul_restdo === true) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-history', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-not-change-histories-accumulate', [
						history.num_id, history.ttAcao.nom_acao
					], 'dts/crm')
				});

				return;
			}

			modalHistoryEdit.open({
				history: history
			}).then(function (result) {
				if (CRMUtil.isDefined(result)) {
					history.dsl_histor_acao = result.dsl_histor_acao;
					history.num_id_detmnto  = result.num_id_detmnto;
					history.num_id_mid      = result.num_id_mid;
					history.num_id_contat   = result.num_id_contat;
					history.hra_inic        = result.hra_inic;
					history.hra_fim         = result.hra_fim;
					history.dat_inic        = result.dat_inic;
					history.dat_fim         = result.dat_fim;
					history.ttDetalhamento  = result.ttDetalhamento;
					history.ttMidia         = result.ttMidia;
					history.ttContato       = result.ttContato;
				}
			});
		};

		this.loadPreferences = function (callback) {
			var count = 0,
				total = 2;

			historyFactory.canEditHistory(function (result) {
				CRMControlHistoryDetail.canEditHistory = result;
				if (++count === total && callback) { callback(); }
			});

			historyFactory.canRemoveHistory(function (result) {
				CRMControlHistoryDetail.canRemoveHistory = result;
				if (++count === total && callback) { callback(); }
			});
		};

		this.onRemove = function () {

			var msg = '', history = CRMControlHistoryDetail.model;

			if (history.log_acumul_restdo === true) {
				msg = $rootScope.i18n('msg-confirm-delete-accumulated-history', [], 'dts/crm');
				msg = '<div class="alert alert-warning crm-alert" role="alert"><span aria-hidden="true">' + msg + '</span></div>';
			}

			msg = msg + $rootScope.i18n('msg-confirm-delete', [$rootScope.i18n('l-action', [], 'dts/crm').toLowerCase(), (history.num_id + " - " + history.ttAcao.nom_acao)], 'dts/crm');

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('l-confirm-delete', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
				text: msg,
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					historyFactory.deleteRecord(history.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$location.path('/dts/crm/history/');

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-history', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});
					});
				}
			});

		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {
			helper.loadCRMContext(function () {

				accessRestrictionFactory.getUserRestrictions('history.detail', $rootScope.currentuser.login, function (result) {
					CRMControlHistoryDetail.accessRestriction = result || {};

					appViewService.startView($rootScope.i18n('nav-history', [], 'dts/crm'), 'crm.history.detail.control', CRMControlHistoryDetail);
					CRMControlHistoryDetail.model = undefined;

					if ($stateParams && $stateParams.id) {
						CRMControlHistoryDetail.load($stateParams.id);
						CRMControlHistoryDetail.loadPreferences();
					}
				});

			});
		};

		if ($rootScope.currentuserLoaded) { this.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlHistoryDetail = undefined;
		});

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControlHistoryDetail.init();
		});
	};
	controllerHistoryDetail.$inject = [
		'$rootScope', '$scope', '$stateParams', '$filter', 'TOTVSEvent', 'totvs.app-main-view.Service',
		'crm.history.helper', 'crm.crm_histor_acao.factory', 'crm.account.modal.summary', '$location',
		'crm.helper', '$timeout', 'crm.crm_pessoa.conta.factory', 'crm.send-email.modal', 'crm.history.modal.edit', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.controller('crm.history.detail.control',	controllerHistoryDetail);
});
