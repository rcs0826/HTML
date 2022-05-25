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

	var controllerTaskDetail;

	// *************************************************************************************
	// *** CONTROLLER DETAIL
	// *************************************************************************************

	controllerTaskDetail = function ($rootScope, $scope, $stateParams, $filter, TOTVSEvent, appViewService,
								  taskHelper, taskFactory, modalAccountSummary,
								  modalTaskEdit, modalTaskReopen, helper, $timeout,
								  modalHistoryEdit, $location, accountFactory, historyFactory,
								  modalEmailEdit, preferenceFactory, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlTaskDetail = this;

		this.model = undefined;

		this.groupContactOpen = false;

		this.loadContactContent = false;

		this.groupAccountOpen = false;

		this.loadAccountContent = false;

		this.isHistoryActionRequiredAfterExecution = undefined;

		this.isActiveUserGroup = false;
		this.isShowPhoneInTask = false;
		this.campDefTask = 0;
		this.actionCampDefTask = 0;
		this.resultDefTask = 0;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.load = function (id) {

			taskFactory.getRecord(id, function (result) {

				if (result) {

					taskHelper.parseTaskColor(result);
					taskHelper.parseRelatedTo(result);
					taskHelper.parseStatus(result);

					CRMControlTaskDetail.model = result;

					$timeout(function () {
						$scope.$broadcast(CRMEvent.scopeLoadTask, result);
					});

					taskFactory.getDescription(id, function (result) {
						if (result) {
							CRMControlTaskDetail.model.dsl_motivo = result.dsl_motivo;
						}
					});
				}
			});
		};

		this.loadAccountSummary = function () {

			if (this.loadAccountContent !== false) { return; }

			accountFactory.getSummary(this.model.ttConta.num_id, function (result) {
				if (result) {
					CRMControlTaskDetail.model.ttConta = result;
					CRMControlTaskDetail.loadAccountContent = true;
				}
			});
		};

		this.detailLink = function (id, model, $event) {
			/*Faz não disparar o evento do accordion que está por trás*/
			$event.preventDefault();
			$event.stopPropagation();
			$location.path('/dts/crm/' + model + '/detail/' + id);
		};

		this.loadPreferences = function () {
			taskFactory.isHistoryActionRequiredAfterExecution(function (result) {
				CRMControlTaskDetail.isHistoryActionRequiredAfterExecution = result;
			});

			taskFactory.isActiveUserGroup(function (result) {
				CRMControlTaskDetail.isActiveUserGroup = result;
			});

			taskFactory.isShowPhoneInTask(function (result) {
				CRMControlTaskDetail.isShowPhoneInTask = result;
			});
		};

		this.paramDefaultEditTask = function (callback) {
			var count = 0,
				total = 3;

			preferenceFactory.getPreferenceAsInteger('CAMP_DEF_TAR', function (result) {
				CRMControlTaskDetail.campDefTask = result || 0;
				if (++count === total && callback) { callback(); }
			});
			preferenceFactory.getPreferenceAsInteger('ACAO_CAMP_DEF_TAR', function (result) {
				CRMControlTaskDetail.actionCampDefTask = result || 0;
				if (++count === total && callback) { callback(); }
			});
			preferenceFactory.getPreferenceAsInteger('RESTDO_DEF_TAR', function (result) {
				CRMControlTaskDetail.resultDefTask = result || 0;
				if (++count === total && callback) { callback(); }
			});
		};

		this.onEdit = function () {
			CRMControlTaskDetail.paramDefaultEditTask(function () {
				if (CRMControlTaskDetail.campDefTask > 0 && CRMControlTaskDetail.actionCampDefTask > 0 && CRMControlTaskDetail.resultDefTask > 0) {
					modalTaskEdit.open({
						task: CRMControlTaskDetail.model
					}).then(function (result) {

						taskHelper.parseTaskColor(result);
						taskHelper.parseRelatedTo(result);
						taskHelper.parseStatus(result);

						if (CRMControlTaskDetail.model.ttStatus.num_id !== result.ttStatus.num_id) {
							$scope.$broadcast(CRMEvent.scopeChangeTask, result);
						}

						CRMControlTaskDetail.model = result;

						if (result && result.num_id_histor_update) {
							historyFactory.getRecord(result.num_id_histor_update, function (history) {
								if (history) {
									$rootScope.$broadcast(CRMEvent.scopeSaveHistoryOnEditTask, history);
								}
							});
						}
					});
				} else {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type:   'error',
						title:  $rootScope.i18n('l-task', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-form-validation-param-default-action', [], 'dts/crm')
					});
				}
			});
		};

		this.execute = function () {

			var executeTask = function () {

				taskFactory.execute(CRMControlTaskDetail.model.num_id, function (result) {

					if (!result) { return; }

					if (CRMControlTaskDetail.model.idi_status_tar !== 3
							&& result.idi_status_tar === 3) {

						CRMControlTaskDetail.parseTaskAfterExecute(result);

						$scope.$broadcast(CRMEvent.scopeChangeTask, CRMControlTaskDetail.model);
					}
				});
			};

			if (CRMControlTaskDetail.isHistoryActionRequiredAfterExecution === true) {
				modalHistoryEdit.open({
					history: {
						ttTarefaOrigem: CRMControlTaskDetail.model,
						ttHistoricoOrigem : CRMControlTaskDetail.model.ttHistoricoOrigem,
						ttOcorrenciaOrigem : CRMControlTaskDetail.model.ttOcorrenciaOrigem,
						ttOportunidadeOrigem : CRMControlTaskDetail.model.ttOportunidadeOrigem
					},
					canOverrideAction: false
				}).then(function (history) {
					if (CRMUtil.isDefined(history)) {
						$rootScope.$broadcast(CRMEvent.scopeSaveHistoryOnExecuteTask, history);
					}
				});
			} else {
				executeTask();
			}
		};

		this.assume = function (task) {
			var vo = {},
				persist;

			persist = function () {
				vo.num_id_respons = $rootScope.currentuser.idCRM;
				vo.num_id = task.num_id;
				vo.idi_status_tar = task.idi_status_tar;
				vo.dsl_justif_alter = $rootScope.i18n('msg-user-took-over-task', [$rootScope.currentuser['user-desc']], 'dts/crm');

				taskFactory.updateRecord(vo.num_id, vo, function (result) {
					if (!result) { return; }

					task.num_id_respons = result.num_id_respons;
					task.ttResponsavel  = result.ttResponsavel;

					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'success',
						title: $rootScope.i18n('l-task', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-update-responsible-task',
												[result.num_id.toString() + ' - ' + result.ttAcao.nom_acao], 'dts/crm')
					});

					$rootScope.$broadcast(CRMEvent.scopeSaveTask, result);

					if (result.num_id_histor_update) {
						historyFactory.getRecord(result.num_id_histor_update, function (history) {
							if (history) {
								$rootScope.$broadcast(CRMEvent.scopeSaveHistoryOnEditTask, history);
							}
						});
					}

				});
			};

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('l-confirm-to-assume', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
				text:  $rootScope.i18n('msg-confirm-assume-task', [task.num_id.toString() + ' - ' + task.ttAcao.nom_acao], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (isPositiveResult) {
						persist();
					}
				}
			});

		};

		this.reopen = function () {

			var taskToReopen = angular.copy(CRMControlTaskDetail.model);
			taskToReopen.idi_status_tar = 1;

			modalTaskReopen.open({
				task: taskToReopen
			}).then(function (result) {
				if (CRMUtil.isDefined(result)) {
					taskHelper.parseStatus(result);
					CRMControlTaskDetail.model = result;
					$scope.$broadcast(CRMEvent.scopeChangeTask, CRMControlTaskDetail.model);
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
					canChangeContact : true
				}).then(function (result) {

					var vo = { num_id_contat: undefined },
						contact = (result ? result.contact : {});


					if (!CRMControlTaskDetail.model.ttContato
							|| CRMControlTaskDetail.model.ttContato.num_id !== contact.num_id) {
						vo.num_id_contat = contact.num_id;
					}

					taskFactory.updateRecord(CRMControlTaskDetail.model.num_id, vo, function (result) {
						CRMControlTaskDetail.model.ttContato = contact;
					});
				});
			}
		};

		this.registerTask = function () {

			// O sistema trabalha por restrição, quando informado default, desabilita-se o campo.
			// Neste caso, por exceção remove-se a campanha do registro para que não posicione o registro na modal.
			var taskCopy = angular.copy(CRMControlTaskDetail.model);

			delete taskCopy.ttCampanha;

			modalTaskEdit.open({
				task: {
					ttTarefaOrigem : taskCopy
				},
				defaults: {
					ttConta: taskCopy.ttConta
				},
				canOverrideAccount: false,
				canOverrideCampaign: true
			}).then(function (result) {
				if (CRMUtil.isDefined(result)) {
					// TODO: Perguntar ao usuário se ele quer ir até o novo registro.
					// TOOD: Adicionar tab de tarefas, quando criar uma nova adicionar o novo registro na lista.
					$location.path("dts/crm/task/detail/" + result.num_id);
				}
			});
		};

		this.parseTaskAfterExecute = function (result) {

			CRMControlTaskDetail.model.idi_status_tar = result.idi_status_tar;
			CRMControlTaskDetail.model.dat_exec = result.dat_exec;
			CRMControlTaskDetail.model.hra_exec = result.hra_exec;
			CRMControlTaskDetail.model.log_executa = false;

			taskHelper.parseTaskColor(CRMControlTaskDetail.model);
			taskHelper.parseRelatedTo(CRMControlTaskDetail.model);
			taskHelper.parseStatus(CRMControlTaskDetail.model);

			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'success',
				title: $rootScope.i18n('l-task', [], 'dts/crm'),
				detail: $rootScope.i18n('msg-execute-task', [
					CRMControlTaskDetail.model.num_id,
					CRMControlTaskDetail.model.ttAcao.nom_acao
				], 'dts/crm')
			});
		};

		this.sendEmail = function (task) {
			modalEmailEdit.open({
				model: {
					ttTarefaOrigem: task
				}
			}).then(function (email) {
				// TODO: ?
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {

			helper.loadCRMContext(function () {

				accessRestrictionFactory.getUserRestrictions('task.detail', $rootScope.currentuser.login, function (result) {
					CRMControlTaskDetail.accessRestriction = result || {};

					appViewService.startView($rootScope.i18n('nav-task', [], 'dts/crm'), 'crm.task.detail.control', CRMControlTaskDetail);
					CRMControlTaskDetail.model = undefined;
					CRMControlTaskDetail.loadPreferences();

					if ($stateParams && $stateParams.id) {
						CRMControlTaskDetail.load($stateParams.id);
					}
				});

			});
		};

		if ($rootScope.currentuserLoaded) { this.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlTaskDetail = undefined;
		});

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			CRMControlTaskDetail.init();
		});

		$scope.$on(CRMEvent.scopeSaveHistory, function (event, history) {

			if (history && history.ttTarefaOrigem && history.ttTarefaOrigem.num_id === CRMControlTaskDetail.model.num_id) {

				if (history.ttResultado.log_finaliza === true && CRMControlTaskDetail.model.idi_status_tar !== 3) {

					var now = new Date();

					CRMControlTaskDetail.parseTaskAfterExecute({
						idi_status_tar: 3,
						dat_exec: now.getTime(),
						hra_exec: $filter('date')(now, 'HH:mm')
					});

					$scope.$broadcast(CRMEvent.scopeChangeTask, CRMControlTaskDetail.model);
				}
			}
		});
	};
	controllerTaskDetail.$inject = [
		'$rootScope', '$scope', '$stateParams', '$filter', 'TOTVSEvent', 'totvs.app-main-view.Service',
		'crm.task.helper', 'crm.crm_tar.factory', 'crm.account.modal.summary',
		'crm.task.modal.edit', 'crm.task.modal.reopen', 'crm.helper', '$timeout',
		'crm.history.modal.edit', '$location', 'crm.crm_pessoa.conta.factory', 'crm.crm_histor_acao.factory',
		'crm.send-email.modal', 'crm.crm_param.factory', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.task.detail.control', controllerTaskDetail);
});
