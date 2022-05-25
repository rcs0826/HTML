/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil, APP_BASE_URL*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1000.js',
	'/dts/crm/js/api/fchcrm1001.js',
	'/dts/crm/js/api/fchcrm1002.js',
    '/dts/crm/js/api/fchcrm1004.js',
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
	'/dts/crm/html/task/task-services.param.js',
	'/dts/crm/html/user/user-services.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerTaskList;

	// *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************

	controllerTaskList = function ($rootScope, $scope, TOTVSEvent, taskFactory, taskHelper,
								modalTaskAdvancedSearch, modalTaskEdit, modalTaskReopen,
								helper, modalHistoryEdit, $filter, $injector,
								modalTaskCalendarSummary, filterHelper, $location,
								modalUserSummary, modalEmailEdit, preferenceFactory,
								modalReportAvailable, userPreferenceModal, serviceTaskParam,
								accessRestrictionFactory, modalTaskExecute, customizationService) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlTaskList = this;

		this.listOfTask = [];
		this.listOfTaskCount = 0;
		this.listOfTaskAsEvents = [];

		this.disclaimers = [];
		this.fixedDisclaimers = [];

		this.isHistoryActionRequiredAfterExecution = undefined;
		this.isActiveUserGroup = false;
		this.isShowPhoneInTask = false;
		this.isActiveMultipleSelection = false;
		this.countSelected = 0;

		this.parent = undefined;
		this.isEnabled = true;
		this.campDefTask = 0;
		this.actionCampDefTask = 0;
		this.resultDefTask = 0;

		this.selectedOrderBy = undefined;
		this.listOfOrderBy = undefined;

		this.userLoggedId = 0;

		/*this.listOfOrderBy = [
			{title: $rootScope.i18n('l-date-create', [], 'dts/crm'), property: 'dat_cadastro'},
			{title: $rootScope.i18n('l-account', [], 'dts/crm'), property: 'num_id_pessoa'},
			{title: $rootScope.i18n('l-action', [], 'dts/crm'), property: 'num_id_acao'},
			{title: $rootScope.i18n('l-user-responsible', [], 'dts/crm'), property: 'num_id_respons'},
			{title: $rootScope.i18n('l-objective', [], 'dts/crm'), property: 'num_id_objet'}
		];*/

		this.listOfCustomFilters = [];

		this.quickFilters = [];

		this.removeResponsibleFilter = false;

		this.isPortal = typeof (APP_BASE_URL) !== "undefined" ? (APP_BASE_URL.indexOf('/portal/') >= 0) : false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.removeCustomFilter = function (filter) {
			filterHelper.remove('nav-task', taskHelper.filtersGroup, filter, function () {
				filterHelper.get(taskHelper.filtersGroup, undefined, function (result) {
					CRMControlTaskList.listOfCustomFilters = result || [];
				});
			});
		};

		this.saveCustomFilter = function (filter) {
			filterHelper.save('nav-task', taskHelper.filtersGroup, filter, function () {
				filterHelper.get(taskHelper.filtersGroup, undefined, function (result) {
					CRMControlTaskList.listOfCustomFilters = result || [];
				});
			});
		};

		this.addEditCustomFilters = function (filter) {

			modalTaskAdvancedSearch.open({
				fixedDisclaimers: angular.copy(CRMControlTaskList.fixedDisclaimers),
				customFilter: filter,
				isAddEditMode: true,
				customFilterList: CRMControlTaskList.listOfCustomFilters
			}).then(function (result) {

				if (!result) { return; }

				CRMControlTaskList.saveCustomFilter(result.customFilter);

				if (result.apply === true) {

					CRMControlTaskList.quickSearchText = undefined;

					CRMControlTaskList.disclaimers = result.disclaimers;
					CRMControlTaskList.fixedDisclaimers = result.fixedDisclaimers;

					CRMControlTaskList.search(false);
				}
			});
		};

		this.selectOrderBy = function (order) {

			if (!order) { return; }

			CRMControlTaskList.selectedOrderBy = order;

			CRMControlTaskList.search(false);
		};

		this.selectQuickFilter = function (filters) {
			var i,
				index = -1,
				notApplyFilterByUser,
				datInic;

			for (i = 0; i < CRMControlTaskList.disclaimers.length; i++) {
				if (CRMControlTaskList.disclaimers[i].property === "dat_inic") {
					datInic = CRMControlTaskList.disclaimers[i];
					break;
				}
			}

			if (!angular.isArray(filters)) {
				if (filters.property === "custom.num_id_grp_usuar") {
					notApplyFilterByUser = true;
					CRMControlTaskList.disclaimers = [];
				}
			} else {
				for (i = 0; i < filters.length; i += 1) {
					if (filters[i].property === "custom.num_id_grp_usuar") {
						notApplyFilterByUser = true;
						CRMControlTaskList.disclaimers = [];
						break;
					}
				}
			}

			filterHelper.selectQuickFilter(filters, CRMControlTaskList.disclaimers, CRMControlTaskList.fixedDisclaimers, function (newDisclaimers) {

				if (notApplyFilterByUser === true) {
					for (i = 0; i < newDisclaimers.disclaimers.length; i += 1) {
						if (newDisclaimers.disclaimers[i].property === "num_id_respons") {
							index = i;
							break;
						}
					}

					if (index !== -1) {
						newDisclaimers.disclaimers.splice(index, 1);
					}
				}

				if (CRMUtil.isDefined(datInic)) {
					newDisclaimers.disclaimers.push(datInic);
				}

				CRMControlTaskList.disclaimers = newDisclaimers.disclaimers;
				CRMControlTaskList.fixedDisclaimers = newDisclaimers.fixedDisclaimers;
				CRMControlTaskList.quickSearchText = undefined;
				CRMControlTaskList.search(false);
			});
		};

		this.loadPreferences = function (callback) {
			var count = 0,
				total = 5;
						
			preferenceFactory.getPreferenceAsBoolean('REG_ACAO_FIM_TAR',  function (result) {
				CRMControlTaskList.isHistoryActionRequiredAfterExecution = result;
				$rootScope.loadedPreferences = true;
				if (++count === total && callback) { callback(); }
			});
			
			preferenceFactory.getPreferenceAsBoolean('LOG_TAR_GRP_USUAR',  function (result) {
				CRMControlTaskList.isActiveUserGroup = result;
				$rootScope.loadedPreferences = true;
				if (++count === total && callback) { callback(); }
			});

			preferenceFactory.getPreferenceAsBoolean('LOG_SHOW_FIELD_TELEF_TAR',  function (result) {
				CRMControlTaskList.isShowPhoneInTask = result;
				$rootScope.loadedPreferences = true;
				if (++count === total && callback) { callback(); }
			});

			preferenceFactory.getPreferenceAsBoolean('LOG_HAB_REM_RESP_TAR',  function (result) {
				CRMControlTaskList.removeResponsibleFilter = result;
				$rootScope.loadedPreferences = true;
				if (++count === total && callback) { callback(); }
			});
			
			preferenceFactory.getPreferenceAsBoolean('LOG_HAB_SEL_MULT_TAR',  function (result) {
				CRMControlTaskList.isActiveMultipleSelection = result;
				$rootScope.loadedPreferences = true;
				if (++count === total && callback) { callback(); }
			});
			
		};

		this.loadDefaults = function (disclaimers) {
			var i;

			if (disclaimers) {
				if (!angular.isArray(disclaimers)) {
					disclaimers = [disclaimers];
				}

				this.disclaimers = [];

				for (i = 0; i < disclaimers.length; i++) {
					if (disclaimers[i].fixed === true) {
						this.fixedDisclaimers.push(disclaimers[i]);
					} else {
						this.disclaimers.push(disclaimers[i]);
					}
				}
			}

			this.disclaimers = this.fixedDisclaimers.concat(this.disclaimers);

		};

		this.openAdvancedSearch = function () {
			modalTaskAdvancedSearch.open({
				disclaimers: CRMControlTaskList.disclaimers,
				fixedDisclaimers: CRMControlTaskList.fixedDisclaimers,
				isCalendar: CRMControlTaskList.isCalendar,
				isChild: CRMControlTaskList.parent ? true : false
			}).then(function (result) {

				CRMControlTaskList.quickSearchText = undefined;
				CRMControlTaskList.disclaimers = result.disclaimers;
				CRMControlTaskList.fixedDisclaimers = result.fixedDisclaimers;

				if (CRMControlTaskList.isCalendar === true) {
					CRMControlTaskList.addCalendarFilterTo(CRMControlTaskList.disclaimers);
				}

				CRMControlTaskList.search(false);

			});
		};

		this.removeDisclaimer = function (disclaimer) {

			var index, i, startDate = new Date(), endDate = new Date(), fixedDisclaimer = {};

			index = CRMControlTaskList.disclaimers.indexOf(disclaimer);

			if (index !== -1) {
				CRMControlTaskList.disclaimers.splice(index, 1);
				for (i = 0; i < CRMControlTaskList.fixedDisclaimers.length; i += 1) {
					if ((CRMControlTaskList.fixedDisclaimers[i].property === disclaimer.property
							|| disclaimer.property === "custom.num_id_grp_usuar"
							|| disclaimer.property === "custom.tasksummary")
							&& CRMControlTaskList.disclaimers.length === 0) {
						CRMControlTaskList.disclaimers.push(CRMControlTaskList.fixedDisclaimers[i]);
						break;
					}
				}
				if (CRMControlTaskList.disclaimers.length === 0 && !CRMControlTaskList.isCalendar) {
					if (!CRMControlTaskList.removeResponsibleFilter) {
						fixedDisclaimer = {
							property: 'custom.num_id_respons',
							value: $rootScope.currentuser.idCRM,
							title: $rootScope.i18n('l-user-responsible', [], 'dts/crm') + ': ' + $rootScope.currentuser['user-desc'],
							fixed: true,
							model: {
								num_id: $rootScope.currentuser.idCRM,
								nom_usuar: $rootScope.currentuser['user-desc'],
								cod_usuario: $rootScope.currentuser.login
							}
						};

						CRMControlTaskList.fixedDisclaimers.push(fixedDisclaimer);
						CRMControlTaskList.disclaimers.push(fixedDisclaimer);

					} else {

						startDate.setMonth(startDate.getMonth() - 10);
						endDate.setMonth(endDate.getMonth() + 2);

						disclaimer = helper.parseDateRangeToDisclaimer({
							start: startDate.getTime(),
							end: endDate.getTime()
						}, 'dat_inic', 'l-date-start', 'l-at');

						disclaimer.fixed = false;

						CRMControlTaskList.disclaimers.push(disclaimer);
					}
				}

				CRMControlTaskList.search(false);
			}
		};

		this.loadItemDetail = function (task) {
			taskFactory.getDescription(task.num_id, function (result) {
				task.dsl_motivo = result.dsl_motivo;
			});
		};

		this.search = function (isMore) {

			var options, filters = [];

			if (CRMControlTaskList.isPendingListSearch === true) {
				return;
			}

			CRMControlTaskList.listOfTaskCount = 0;

			if (!isMore) {
				CRMControlTaskList.listOfTask = [];
				CRMControlTaskList.updateEventSource(true);
			}

			options = {
				start: CRMControlTaskList.listOfTask.length,
				end: (CRMControlTaskList.isChild === true ? 10 : 50)
			};

			if (CRMControlTaskList.isCalendar === true) {
				options.end = 999999;
				options.type = 4;
			}

			if (CRMControlTaskList.selectedOrderBy) {
				options.orderBy = CRMControlTaskList.selectedOrderBy.property;
				options.asc = CRMControlTaskList.selectedOrderBy.asc;
			}

			CRMControlTaskList.parseQuickFilter(filters);

			filters = filters.concat(CRMControlTaskList.disclaimers);

			CRMControlTaskList.isPendingListSearch = true;
			CRMControlTaskList.countSelected = 0;
			taskFactory.findRecords(filters, options, function (result) {
				CRMControlTaskList.addTaskInList(result);
				CRMControlTaskList.isPendingListSearch = false;
			});

		};

		this.parseQuickFilter = function (filters) {

			if (CRMUtil.isDefined(CRMControlTaskList.quickSearchText)
					&& CRMControlTaskList.quickSearchText.toString().trim().length > 0) {

				CRMControlTaskList.disclaimers = [];
				CRMControlTaskList.loadDefaults();

				filters.push({
					property: "custom.quick_search",
					value:  helper.parseStrictValue(CRMControlTaskList.quickSearchText)
				});

			}

		};

		this.onClickSelected = function (index) {
			// TODO: Ajustar a seleção do checkbox, ao clicar no meio da caixa, é selecionado duas vezes

			CRMControlTaskList.listOfTask[index].$selected = !CRMControlTaskList.listOfTask[index].$selected;
			CRMControlTaskList.listOfTask[index].checked = CRMControlTaskList.listOfTask[index].$selected;

			CRMControlTaskList.onChangeSelected(index);
		};

		this.onChangeSelected = function (index) {
			var selected, task, i, countSelected = 0;

			if (CRMControlTaskList.listOfTask && CRMControlTaskList.listOfTask[index]) {

				selected = CRMControlTaskList.listOfTask[index];

				for (i = 0; i < CRMControlTaskList.listOfTask.length; i++) {

					task = CRMControlTaskList.listOfTask[i];

					if (task.$selected === true && (task.num_id_campanha !== selected.num_id_campanha || task.num_id_acao !== selected.num_id_acao)) {
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'error',
							title: $rootScope.i18n('l-task', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-validate-select-task', [], 'dts/crm')
						});

						CRMControlTaskList.listOfTask[index].$selected = false;
						CRMControlTaskList.listOfTask[index].checked = false;

						return;
					} else if (task.$selected === true) {
						countSelected++;
					}
				}

				CRMControlTaskList.countSelected = countSelected;

			}

		};

		this.executeTaskList = function () {
			var task, i, taskList = [];

			for (i = 0; i < CRMControlTaskList.listOfTask.length; i++) {
				task = CRMControlTaskList.listOfTask[i];
				if (task.$selected === true) {
					taskList.push(task);
				}
			}

			if (taskList.length > 1) {
				modalTaskExecute.open({
					taskList: taskList
				}).then(function (result) {
					if (CRMUtil.isDefined(result) && result.isOk === true) {
						CRMControlTaskList.countSelected = 0;
						CRMControlTaskList.search(false);
					}
				});
			} else if (taskList.length === 1) {
				CRMControlTaskList.execute(taskList[0]);
			}

		};

		this.execute = function (task) {

			var executeTask = function () {
				taskFactory.execute(task.num_id, function (result) {

					if (!result) { return; }

					CRMControlTaskList.countSelected = 0;

					if (CRMControlTaskList.isChild === true) {
						CRMControlTaskList.search(false);

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-task', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-execute-task', [
								task.num_id, task.ttAcao.nom_acao
							], 'dts/crm')
						});
					} else if (task.idi_status_tar !== 3 && result.idi_status_tar === 3) {

						task.idi_status_tar	= result.idi_status_tar;
						task.dat_exec		= result.dat_exec;
						task.hra_exec		= result.hra_exec;
						task.log_executa	= false;

						CRMControlTaskList.updateTaskInList(result, task);

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-task', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-execute-task', [
								task.num_id, task.ttAcao.nom_acao
							], 'dts/crm')
						});
					}
				});
			};

			if (CRMControlTaskList.isHistoryActionRequiredAfterExecution === true) {
				modalHistoryEdit.open({
					history: {
						ttTarefaOrigem: task,
						ttHistoricoOrigem : task.ttHistoricoOrigem,
						ttOcorrenciaOrigem : task.ttOcorrenciaOrigem,
						ttOportunidadeOrigem : task.ttOportunidadeOrigem
					},
					canOverrideAction: false
				}).then(function (history) {

					if (CRMUtil.isDefined(history)) {

						if (CRMControlTaskList.isChild === true) {
							CRMControlTaskList.search(false);

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('l-task', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-execute-task', [
									task.num_id, task.ttAcao.nom_acao
								], 'dts/crm')
							});							
						} else if (CRMUtil.isDefined(history.ttTarefaOrigem)
							&& (history.ttTarefaOrigem.idi_status_tar === 3
							&& task.idi_status_tar  !== 3)) {

							task.idi_status_tar	= history.ttTarefaOrigem.idi_status_tar;
							task.dat_exec		= history.ttTarefaOrigem.dat_exec;
							task.hra_exec		= history.ttTarefaOrigem.hra_exec;
							task.log_executa	= false;

							CRMControlTaskList.updateTaskInList(task, task);

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('l-task', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-execute-task', [
									task.num_id, task.ttAcao.nom_acao
								], 'dts/crm')
							});
						}

						$rootScope.$broadcast(CRMEvent.scopeSaveHistoryOnExecuteTask, history);
					} else {
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'error',
								title: $rootScope.i18n('l-task', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-history-required', [
									task.num_id, task.ttAcao.nom_acao
								], 'dts/crm')
							});					
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
				vo.num_id_grp_usuar = task.num_id_grp_usuar || 0;
				vo.num_id = task.num_id;
				vo.idi_status_tar = task.idi_status_tar;
				vo.dsl_justif_alter = $rootScope.i18n('msg-user-took-over-task', [$rootScope.currentuser['user-desc']], 'dts/crm');

				taskFactory.updateRecord(vo.num_id, vo, function (result) {
					if (!result) { return; }

					task.num_id_respons = result.num_id_respons;
					task.ttResponsavel  = result.ttResponsavel;

					CRMControlTaskList.updateTaskInList(result, task);

					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'success',
						title: $rootScope.i18n('l-task', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-update-responsible-task',
												[result.num_id.toString() + ' - ' + result.ttAcao.nom_acao], 'dts/crm')
					});

					$rootScope.$broadcast(CRMEvent.scopeSaveTask, task);
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

		this.reopen = function (task) {

			var taskToReopen = angular.copy(task);
			taskToReopen.idi_status_tar = 1;

			modalTaskReopen.open({
				task: taskToReopen
			}).then(function (result) {
				if (CRMUtil.isDefined(result)) {
					CRMControlTaskList.updateTaskInList(result, task);
				}
			});
		};

		this.paramDefaultEditTask = function (callback) {
			var count = 0,
				total = 3;

			preferenceFactory.getPreferenceAsInteger('CAMP_DEF_TAR', function (result) {
				CRMControlTaskList.campDefTask = result || 0;
				if (++count === total && callback) { callback(); }
			});
			preferenceFactory.getPreferenceAsInteger('ACAO_CAMP_DEF_TAR', function (result) {
				CRMControlTaskList.actionCampDefTask = result || 0;
				if (++count === total && callback) { callback(); }
			});
			preferenceFactory.getPreferenceAsInteger('RESTDO_DEF_TAR', function (result) {
				CRMControlTaskList.resultDefTask = result || 0;
				if (++count === total && callback) { callback(); }
			});
		};

		this.addEdit = function (task) {

			var openModal = function () {
				modalTaskEdit.open({
					task: (CRMControlTaskList.isChild === true && task === undefined ? CRMControlTaskList.parent : task)
				}).then(function (result) {
					if (result !== undefined) {
                        if (result.num_id > 0 && result.ttAcao !== undefined) {
                            if (task !== undefined) {
                                CRMControlTaskList.updateTaskInList(result, task);
                            } else {
                                CRMControlTaskList.addTaskInList(result, true);
                            }
                        }
					}
				});
			};

			if (CRMUtil.isUndefined(task) || CRMUtil.isUndefined(task.num_id)) {
				openModal();
			} else {
				CRMControlTaskList.paramDefaultEditTask(function () {

					if (CRMControlTaskList.campDefTask > 0
							&& CRMControlTaskList.actionCampDefTask > 0
							&& CRMControlTaskList.resultDefTask > 0) {
						openModal();
					} else {
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type:   'error',
							title:  $rootScope.i18n('l-task', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-form-validation-param-default-action', [], 'dts/crm')
						});
					}
				});
			}

		};

		this.registerTask = function (task) {
			// O sistema trabalha por restrição, quando informado default, desabilita-se o campo.
			// Neste caso, por exceção remove-se a campanha do registro para que não posicione o registro na modal.
			var taskCopy = angular.copy(task);

			delete taskCopy.ttCampanha;

			modalTaskEdit.open({
				task: {
					ttTarefaOrigem : taskCopy
				},
				defaults: {
					ttConta: task.ttConta
				},
				canOverrideAccount: false,
				canOverrideCampaign: true
			}).then(function (result) {
				if (CRMUtil.isDefined(result)) {
					$location.path("dts/crm/task/detail/" + result.num_id);
				}
			});
		};

		this.registerHistory = function (task) {
			modalHistoryEdit.open({
				history: {
					ttTarefaOrigem: task,
					ttHistoricoOrigem : task.ttHistoricoOrigem,
					ttOcorrenciaOrigem : task.ttOcorrenciaOrigem,
					ttOportunidadeOrigem : task.ttOportunidadeOrigem
				}
			}).then(function (history) {
				if (CRMUtil.isDefined(history)) {

					if (history.ttResultado.log_finaliza === true && task.idi_status_tar !== 3) {

						var now = new Date();

						task.idi_status_tar = 3;
						task.dat_exec		= now.getTime();
						task.hra_exec		= $filter('date')(now, 'HH:mm');
						task.log_executa	= false;
					}

					CRMControlTaskList.updateTaskInList(task, task);
				}
			});
		};

		this.formatTaskToDisplay = function (task) {

			if (!task) { return; }

			taskHelper.parseTaskColor(task);
			taskHelper.parseRelatedTo(task);

			return task;
		};

		this.updateTaskInList = function (task, oldTask) {

			oldTask = oldTask || task;

			this.formatTaskToDisplay(task);

			var index = this.listOfTask.indexOf(oldTask);

			if (task.$selected && task.$selected === true) {
				task.$selected = false;
				CRMControlTaskList.countSelected = CRMControlTaskList.countSelected > 0 ? CRMControlTaskList.countSelected - 1 : 0;
			}

			this.listOfTask[index] = task;
			this.updateTaskEvent(task);
		};

		this.addTaskInList = function (tasks, isNew) {

			var task, i;

			if (!tasks) { return; }

			if (!angular.isArray(tasks)) {
				tasks = [tasks];
				CRMControlTaskList.listOfTaskCount += 1;
			}

			for (i = 0; i < tasks.length; i += 1) {

				task = tasks[i];

				taskFactory.removeDescriptionCache(task.num_id);

				if (task && task.$length) {
					CRMControlTaskList.listOfTaskCount = task.$length;
				}

				CRMControlTaskList.formatTaskToDisplay(task);

				if (isNew !== true) {
					CRMControlTaskList.listOfTask.push(task);
				} else {
					CRMControlTaskList.listOfTask.unshift(task);
				}

				CRMControlTaskList.addTaskEvent(task);
			}

			CRMControlTaskList.updateEventSource();
		};

		this.deleteTaskInList = function (task) {
			var index = CRMControlTaskList.listOfTask.indexOf(task);
			CRMControlTaskList.listOfTask.splice(index, 1);
			CRMControlTaskList.listOfTaskCount--;
		};

		this.sendEmail = function (task) {
			modalEmailEdit.open({ model: { ttTarefaOrigem: task } });
		};

		this.showReports = function () {
			modalReportAvailable.open({ num_id: 6, nom_modul_crm: 'l-module-relationship' });
		};

		// *********************************************************************************
		// *** Calendar Functions
		// *********************************************************************************

		this.loadCalendar = function (isNewTab) {

			CRMControlTaskList.calendarConfig = {
				defaultView: CRMControlTaskList.lastViewType || 'agendaDay',
				header: {
					left: 'prev,next today',
					center: 'title',
					right: 'month,agendaWeek,agendaDay'
				},
				titleFormat: {
					month: 'MMMM YYYY',
					week: 'DD MMMM YYYY',
					day: 'DD MMMM YYYY'
				},
				columnFormat: {
					week: 'ddd D/M'
				},
				eventLimit: true,
				eventLimitText: $rootScope.i18n('l-calendar-more', [], 'dts/crm'),
				editable: false,
				disableDragging: true,
				axisFormat: 'HH:mm',
				timeFormat: 'HH:mm',
				allDayText: $rootScope.i18n('l-all-day', [], 'dts/crm'),
				buttonText: {
					today: $rootScope.i18n('l-today', [], 'dts/crm'),
					month: $rootScope.i18n('l-month', [], 'dts/crm'),
					week: $rootScope.i18n('l-week', [], 'dts/crm'),
					day: $rootScope.i18n('l-day', [], 'dts/crm')
				},
				viewRender: function (view, element) {

					CRMControlTaskList.lastViewType = view.type;

					// Quando for uma nova tab deve disparar a primeira consulta, caso contrário
					// apenas atualizar o calendário.
					if (isNewTab === true || CRMUtil.isUndefined(isNewTab)) {
						isNewTab = undefined;
						CRMControlTaskList.addCalendarFilterTo(CRMControlTaskList.disclaimers);
					}

					CRMControlTaskList.search(false);
				},
				eventClick: function (taskEvent, event, view) {
					modalTaskCalendarSummary.open({
						task: taskEvent.task,
						func: {
							execute	: CRMControlTaskList.execute,
							reopen	: CRMControlTaskList.reopen,
							addEdit	: CRMControlTaskList.addEdit,
							assume  : CRMControlTaskList.assume
						}
					});
				}
			};
		};

		this.getCalendarConfig = function () {

			if (CRMControlTaskList.isCalendar === true) {
				CRMControlTaskList.uiCalendarConfig = $injector.get('uiCalendarConfig');
			}

			return CRMControlTaskList.uiCalendarConfig;
		};

		this.addCalendarFilterTo = function (disclaimers) {

			disclaimers = disclaimers || [];

			var calendar = CRMControlTaskList.getCalendarConfig().calendars.tasksCalendar,
				momentToday = calendar.fullCalendar('getDate'),
				view = calendar.fullCalendar('getView'),
				disclaimer,
				startAt,
				endsAt,
				index,
				i;

			if (view.name === 'agendaDay' || view.name === 'basicDay') {
				startAt = new Date(momentToday.format('L'));
			} else if (view.name === 'agendaWeek' || view.name === 'basicWeek') {
				startAt = new Date(momentToday.startOf('week').format('L'));
				endsAt = new Date(momentToday.endOf('week').format('L'));
			} else if (view.name === 'month') {
				startAt = new Date(momentToday.startOf('month').format('L'));
				endsAt = new Date(momentToday.endOf('month').format('L'));
			}

			disclaimer = helper.parseDateRangeToDisclaimer({
				start: startAt.getTime(),
				end: (endsAt ? endsAt.getTime() : undefined)
			}, 'dat_inic', 'l-date-start', 'l-at');

			disclaimer.fixed = true;
			disclaimer.isCalendar = true;

			index = undefined;

			for (i = 0; i < disclaimers.length; i += 1) {
				if (disclaimers[i].property === 'dat_inic') {
					index = i;
					break;
				}
			}

			if (index >= 0) {
				disclaimers[index] = disclaimer;
			} else {
				disclaimers.push(disclaimer);
			}
		};

		this.addTaskEvent = function (task) {

			if (CRMControlTaskList.isCalendar !== true) { return; }

			CRMControlTaskList.listOfTaskAsEvents.push(CRMControlTaskList.parseTaskToEvent(task));
		};

		this.updateTaskEvent = function (task) {

			if (CRMControlTaskList.isCalendar !== true) { return; }

			var i,
				events = angular.copy(CRMControlTaskList.listOfTaskAsEvents);

			CRMControlTaskList.updateEventSource(true);

			for (i = 0; i < events.length; i += 1) {
				if (events[i].task.num_id === task.num_id) {
					events[i] = CRMControlTaskList.parseTaskToEvent(task);
					break;
				}
			}

			CRMControlTaskList.listOfTaskAsEvents = events;
			CRMControlTaskList.updateEventSource();
		};

		this.parseTaskToEvent = function (task) {
			customizationService.callEvent('dts.crm.task', 'parseTaskToEvent', task);
			return {
				task : task,
				title : task.customTitle || taskHelper.formatTitleToEvent(task),
				start : taskHelper.formatDateToEvent(task.dat_inic, task.hra_inic),
				end : taskHelper.formatDateToEvent(task.dat_fim,  task.hra_fim),
				allDay : false,
				className : task.nom_cor
			};
		};

		this.updateEventSource = function (clear) {

			if (CRMControlTaskList.isCalendar !== true) { return; }

			var calendar = CRMControlTaskList.getCalendarConfig().calendars.tasksCalendar;

			calendar.fullCalendar('removeEventSource', CRMControlTaskList.listOfTaskAsEvents);

			if (clear) {
				CRMControlTaskList.listOfTaskAsEvents = [];
			} else {
				calendar.fullCalendar('addEventSource', CRMControlTaskList.listOfTaskAsEvents);
			}
		};

		this.loadCustomFilters = function () {
			filterHelper.get(taskHelper.filtersGroup, undefined, function (result) {
				CRMControlTaskList.listOfCustomFilters = result || [];
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

		this.userSettings = function () {
			userPreferenceModal.open({ context: 'task.list' });
		};

		this.exportSearch = function () {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('l-attention', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('l-no', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('l-yes', [], 'dts/crm'),
				text: $rootScope.i18n('msg-export-report', [], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					var filters = [];

					CRMControlTaskList.parseQuickFilter(filters);
					filters = filters.concat(CRMControlTaskList.disclaimers);

					taskFactory.exportSearch(filters, isPositiveResult);
				}
			});
		};
		
		this.startQuickFilters = function() {
			CRMControlTaskList.quickFilters = [{
				property: 'num_id_respons',
				title: $rootScope.i18n('l-task-filter-mine', [], 'dts/crm'),
				value: $rootScope.currentuser.idCRM,
				fixed: false,
				model: {
					value : {
						num_id: $rootScope.currentuser.idCRM,
						nom_usuar: $rootScope.currentuser['user-desc'],
						cod_usuario: $rootScope.currentuser.login
					}
				}
			}, {
				property: 'idi_status_tar',
				value: 1, //idi para tatus abertas.
				title: $rootScope.i18n('l-task-filter-open', [], 'dts/crm'),
				fixed: false,
				model: {
					property: 'idi_status_tar',
					value: angular.copy(taskHelper.virtualStatus[0])
				}
			}, {
				property: 'custom.onTime',
				value: 1, //idi para tatus abertas (NO PRAZO).
				title: $rootScope.i18n('l-task-filter-on-time', [], 'dts/crm'),
				fixed: false,
				model: {
					property: 'idi_status_tar',
					value: angular.copy(taskHelper.virtualStatus[1])
				}
			}, {
				property: 'idi_status_tar',
				value: 2, //idi para tatus suspensas.
				title: $rootScope.i18n('l-task-filter-suspended', [], 'dts/crm'),
				fixed: false,
				model: {
					property: 'idi_status_tar',
					value: angular.copy(taskHelper.virtualStatus[2])
				}
			}, {
				property: 'idi_status_tar',
				value: 3, //idi para tatus executadas.
				title: $rootScope.i18n('l-task-filter-executed', [], 'dts/crm'),
				fixed: false,
				model: {
					property: 'idi_status_tar',
					value: angular.copy(taskHelper.virtualStatus[3])
				}
			}, {
				property: 'custom.future',
				value: 4, //idi para tatus abertas (FUTURA).
				title: $rootScope.i18n('l-task-filter-future', [], 'dts/crm'),
				fixed: false,
				model: {
					property: 'idi_status_tar',
					value: angular.copy(taskHelper.virtualStatus[4])
				}
			}, {
				property: 'custom.late',
				value: 5, //idi para tatus abertas (ATRASADAS).
				title: $rootScope.i18n('l-task-filter-late', [], 'dts/crm'),
				fixed: false,
				model: {
					property: 'idi_status_tar',
					value: angular.copy(taskHelper.virtualStatus[5])
				}
			}];
		};		

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function (disclaimers, parent, isEnabled) {

			helper.loadCRMContext(function () {

				var start,
					controlName,
					viewName,
					startView,
					viewController;

				CRMControlTaskList.countSelected = 0;

				if (CRMControlTaskList.isCalendar === true) {
					controlName = 'task.calendar';
				/*
				} else if (CRMControlTaskList.isChild) {
					controlName = 'task.tab';
				*/
				} else {
					controlName = 'task.list';
				}

				accessRestrictionFactory.getUserRestrictions(controlName, $rootScope.currentuser.login, function (result) {
					CRMControlTaskList.accessRestriction = result || {};
				});

				CRMControlTaskList.userLoggedId = $rootScope.currentuser.idCRM;

				CRMControlTaskList.startQuickFilters();

				start = function () {
					if (CRMControlTaskList.isChild !== true) {

						viewController = 'crm.task.list.control';
	
						if (CRMControlTaskList.isCalendar === true) {
							viewName = $rootScope.i18n('nav-calendar', [], 'dts/crm');
						} else {
							viewName = $rootScope.i18n('nav-task', [], 'dts/crm');
						}
	
						startView = helper.startView(viewName, viewController, CRMControlTaskList);
	
							if (startView.isNewTab === true) {
								CRMControlTaskList.loadDefaults([{
									property: 'custom.num_id_respons',
									value: $rootScope.currentuser.idCRM,
									title: $rootScope.i18n('l-user-responsible', [], 'dts/crm') + ': ' + $rootScope.currentuser['user-desc'],
									fixed: !CRMControlTaskList.removeResponsibleFilter,
									model: {
										num_id: $rootScope.currentuser.idCRM,
										nom_usuar: $rootScope.currentuser['user-desc'],
										cod_usuario: $rootScope.currentuser.login
									}
								}]);
							}
	
							CRMControlTaskList.loadCustomFilters();
	
							if (CRMUtil.isDefined(serviceTaskParam.paramOpp)) {
								CRMControlTaskList.disclaimers = angular.copy(serviceTaskParam.paramOpp);
								serviceTaskParam.paramOpp = undefined;
							}
	
							if (CRMControlTaskList.isCalendar === true) {
								CRMControlTaskList.listOfOrderBy = undefined;
								CRMControlTaskList.loadCalendar(startView.isNewContext);
							} else if (startView.isNewContext) {
								CRMControlTaskList.search(false);
							}
	
					} else if (disclaimers) {
	
						CRMControlTaskList.parent = parent;
						CRMControlTaskList.isEnabled = (isEnabled !== false);
	
						CRMControlTaskList.loadCustomFilters();
						CRMControlTaskList.loadDefaults(disclaimers);
						CRMControlTaskList.search(false);
					}
				};

				CRMControlTaskList.loadPreferences(function () {
					if (CRMControlTaskList.isActiveUserGroup === true) {
						CRMControlTaskList.quickFilters.push({
							property: 'custom.num_id_grp_usuar',
							value: $rootScope.currentuser.idCRM,
							title: $rootScope.i18n('l-task-filter-my-goups', [], 'dts/crm'),
							fixed: false,
							model: {
								value : {
									num_id_usuar: $rootScope.currentuser.idCRM
								}
							}
						});
					}

					start();
				});

			});
		};

		if ($rootScope.currentuserLoaded && !$rootScope.accountDetailModeLoading) { this.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlTaskList = undefined;
		});

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			CRMControlTaskList.init();
		});

		$scope.$on(CRMEvent.scopeLoadHistory, function (event, history) {
			CRMControlTaskList.init([{
				property: 'num_id_histor_acao',
				value: history.num_id,
				title: $rootScope.i18n('l-history', [], 'dts/crm') + ': ' + history.num_id + ' - ' + history.ttAcao.nom_acao,
				fixed: true
			}], {ttHistoricoOrigem: history});
		});

		$scope.$on(CRMEvent.scopeLoadOpportunity, function (event, opportunity) {
			CRMControlTaskList.init([{
				property: 'num_id_oportun',
				value: opportunity.num_id,
				title: $rootScope.i18n('l-opportunity', [], 'dts/crm') + ': ' + opportunity.num_id + ' - ' + opportunity.des_oportun_vda,
				fixed: true
			}, {
				property: 'num_id_pessoa',
				value: opportunity.num_id_pessoa,
				title: $rootScope.i18n('l-account', [], 'dts/crm') + ': ' + opportunity.num_id_pessoa + ' - ' + opportunity.ttConta.nom_razao_social,
				fixed: true
			}], {ttOportunidadeOrigem: opportunity});
		});

		$scope.$on(CRMEvent.scopeLoadTicket, function (event, ticket) {
			CRMControlTaskList.init([{
				property: 'num_id_ocor',
				value: ticket.num_id,
				title: $rootScope.i18n('l-ticket', [], 'dts/crm') + ': ' + ticket.num_id + ' - ' + ticket.nom_ocor,
				fixed: true
			}], {ttOcorrenciaOrigem: ticket});
		});

		$scope.$on(CRMEvent.scopeLoadAccount, function (event, account) {
			CRMControlTaskList.init([{
				property: 'num_id_pessoa',
				value: account.num_id,
				title: $rootScope.i18n('l-account', [], 'dts/crm') + ': ' + account.num_id + ' - ' + account.nom_razao_social +
					(account.cod_pessoa_erp ? ' (' + account.cod_pessoa_erp + ')' : ''),
				fixed: true
			}], {ttConta: account});
		});

		$scope.$on(CRMEvent.scopeSaveNextTask, function (event, task) {

			if (task) {

				if (CRMControlTaskList.isChild === true) {

					var equals = false,
						parent = CRMControlTaskList.parent;

					if (parent.ttOcorrenciaOrigem) {
						if (task.ttOcorrenciaOrigem && task.ttOcorrenciaOrigem.num_id) {
							equals = (parent.ttOcorrenciaOrigem.num_id === task.ttOcorrenciaOrigem.num_id);
						}
					} else if (parent.ttOportunidadeOrigem) {
						if (task.ttOportunidadeOrigem && task.ttOportunidadeOrigem.num_id) {
							equals = (parent.ttOportunidadeOrigem.num_id === task.ttOportunidadeOrigem.num_id);
						}
					} else if (parent.ttTarefaOrigem) {
						if (task.ttTarefaOrigem && task.ttTarefaOrigem.num_id) {
							equals = (parent.ttTarefaOrigem.num_id === task.ttTarefaOrigem.num_id);
						}
					} else if (parent.ttHistoricoOrigem) {
						if (task.ttHistoricoOrigem && task.ttHistoricoOrigem.num_id) {
							equals = (parent.ttHistoricoOrigem.num_id === task.ttHistoricoOrigem.num_id);
						}
					} else if (parent.ttConta) {
						if (task.ttConta && task.ttConta.num_id) {
							equals = (parent.ttConta.num_id === task.ttConta.num_id);
						}
					}

					if (equals) { CRMControlTaskList.addTaskInList(task, true); }

				} else {
					CRMControlTaskList.addTaskInList(task, true);
				}
			}
		});

		$scope.$on(CRMEvent.scopeDeleteTaskRemoveProcess, function (event, listProcess) {
			if (!listProcess || !angular.isArray(listProcess)) { return; }

			var i;
			for (i = 0; i < listProcess.length; i++) {
				if (listProcess[i].processo === 'task') {
					CRMControlTaskList.deleteTaskInList(listProcess[i]);
				}
			}
		});

		$scope.$on(CRMEvent.scopeSaveHistoryOnChangeTicketStatus, function (event, ticket) {
			if (CRMUtil.isDefined(ticket) && CRMControlTaskList.isChild === true) {
				CRMControlTaskList.search(false);
			}
		});

		$scope.$on(CRMEvent.scopeLoadTaskIsChild, function (event) {
			if (CRMControlTaskList.isChild === true) {
				CRMControlTaskList.search(false);
			}
		});		
	};

	controllerTaskList.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.crm_tar.factory',
		'crm.task.helper', 'crm.task.modal.advanced.search', 'crm.task.modal.edit',
		'crm.task.modal.reopen', 'crm.helper', 'crm.history.modal.edit', '$filter',
		'$injector', 'crm.task.modal.calendar.summary', 'crm.filter.helper', '$location',
		'crm.user.modal.summary', 'crm.send-email.modal', 'crm.crm_param.factory',
		'crm.report.modal.available', 'crm.user.modal.preference', 'crm.task.param-service',
		'crm.crm_acess_portal.factory', 'crm.task.modal.execute',
		/* Serviço de customização*/
		'customization.generic.Factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.task.list.control', controllerTaskList);
});
