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
	'/dts/crm/html/attachment/attachment-type-services.select.js',
	'/dts/crm/html/history/history-services.list.js',
	'/dts/crm/html/history/history-services.detail.js',
	'/dts/crm/html/history/history-services.advanced-search.js',
	'/dts/crm/html/history/history-services.edit.js',
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
	var modalTaskEdit,
		modalTaskReopen,
		modalTaskNextAction,
		modalTaskExecute,
		controllerTaskEdit,
		controllerTaskExecute;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************

	modalTaskEdit = function ($rootScope, $modal) {
		this.open = function (params) {

			var scope = $rootScope.$new();

			scope.isModal = true;
			scope.parameters = params;

			scope.$modalInstance = $modal.open({
				templateUrl: '/dts/crm/html/task/task.edit.html',
				controller: 'crm.task.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				scope: scope,
				resolve: { parameters: function () { return params; } }
			});

			return scope.$modalInstance.result;
		};
	};
	modalTaskEdit.$inject = ['$rootScope', '$modal'];

	// *************************************************************************************
	// *** MODAL REOPEN TASK
	// *************************************************************************************

	modalTaskReopen = function ($rootScope, $modal) {
		this.open = function (params) {

			params = params || {};

			params.isReopen = true;

			var scope = $rootScope.$new();

			scope.isModal = true;
			scope.parameters = params;

			scope.$modalInstance = $modal.open({
				templateUrl: '/dts/crm/html/task/task.reopen.html',
				controller: 'crm.task.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				scope: scope,
				resolve: { parameters: function () { return params; } }
			});

			return scope.$modalInstance.result;
		};
	};
	modalTaskReopen.$inject = ['$rootScope', '$modal'];

	// *************************************************************************************
	// *** MODAL TASK NEXT ACTION
	// *************************************************************************************

	modalTaskNextAction = function ($rootScope, $modal) {
		this.open = function (params) {

			params = params || {};

			params.isNextAction = true;

			var scope = $rootScope.$new();

			scope.isModal = true;
			scope.parameters = params;

			scope.$modalInstance = $modal.open({
				templateUrl: '/dts/crm/html/task/task.next.html',
				controller: 'crm.task.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				scope: scope,
				resolve: { parameters: function () { return params; } }
			});

			return scope.$modalInstance.result;
		};
	};
	modalTaskNextAction.$inject = ['$rootScope', '$modal'];

	// *************************************************************************************
	// *** MODAL REOPEN TASK
	// *************************************************************************************

	modalTaskExecute = function ($rootScope, $modal) {
		this.open = function (params) {

			params = params || {};

			var scope = $rootScope.$new();

			scope.isModal = true;
			scope.parameters = params;

			scope.$modalInstance = $modal.open({
				templateUrl: '/dts/crm/html/task/task.execute.html',
				controller: 'crm.task.execute.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				scope: scope,
				resolve: { parameters: function () { return params; } }
			});

			return scope.$modalInstance.result;
		};
	};
	modalTaskExecute.$inject = ['$rootScope', '$modal'];

	// *************************************************************************************
	// *** CONTROLLER EDIT
	// *************************************************************************************

	controllerTaskEdit = function ($rootScope, $scope, $filter, $location, TOTVSEvent, appViewService,
								legend, taskFactory, campaignFactory, userFactory,
								accountFactory, helper, taskHelper, attachmentFactory,
								modalContactEdit, historyFactory, opportunityFactory, preferenceFactory, modalAttachmentTypeSelect,
								attachmentHelper, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlTaskEdit = this,
			parameters = $scope.parameters || {},
			$modalInstance = $scope.$modalInstance || undefined;

		this.model = undefined;
		this.defaults = undefined;
		this.editMode = false;

		this.recipients = undefined;

		this.campaigns = [];
		this.actions = [];
		this.objectives = [];

		this.accounts = [];
		this.contacts = [];
		this.users = [];
		this.groups = [];
		this.phoneList = [];

		this.tasks = [];
		this.tickets = [];
		this.histories = [];
		this.opportunities = [];

		this.status = angular.copy(taskHelper.status) || [];

		// Remove o último status (Executada)
		if (this.status.length === 3) {
			this.status.pop();
		}

		this.canOverrideStatus = false;
		this.canOverrideAccount = true;
		this.canOverrideCampaign = true;
		this.canOverrideAction = true;
		this.canOverrideObjective = true;
		this.canOverrideDescription = true;
		this.canOverrideJustification = true;

		this.isReopen = false;
		this.isNextAction = false;

		this.isAutoNotify = false;
		this.isToNotifyClient = false;
		this.isHierarchyAvailableInTask = false;
		this.isActiveUserGroup = false;
		this.isShowPhoneInTask = false;
		this.disableUser = true;

		this.isModal = $scope.isModal === true;
		this.files = [];
		this.fileSizeLimit = 0;
		this.isAttachmentType = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.save = function () {

			if (CRMControlTaskEdit.isInvalidForm()) { return; }

			var i,
				vo = CRMControlTaskEdit.convertToSave(),
				taskPostPersist,
                hasTaskAccess;

			if (!vo) { return; }

			if (CRMControlTaskEdit.isAutoNotify || CRMControlTaskEdit.showRecipients) {
				if (CRMControlTaskEdit.showRecipients === false) {
					CRMControlTaskEdit.reloadRecipients();
				}

				vo.log_notifica = true;
				vo.dsl_recipientes = CRMControlTaskEdit.recipients;
			}

			taskPostPersist = function (result) {

				if (CRMControlTaskEdit.model.files) {

					if (CRMControlTaskEdit.model.files.length > 0) {

						result.log_anexo = true;

						for (i = 0; i < CRMControlTaskEdit.model.files.length; i++) {
							attachmentFactory.upload(4, result.num_id, CRMControlTaskEdit.model.files[i], CRMControlTaskEdit.model.files[i]);
						}
					}
				}

				CRMControlTaskEdit.afterSave(result);
			};

			if (CRMControlTaskEdit.editMode) {
				taskFactory.updateRecord(vo.num_id, vo, function (result) {
					if (!result) { return; }
					taskPostPersist(result);
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'success',
						title: $rootScope.i18n('l-task', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-update-task', [
							result.num_id, result.ttAcao.nom_acao
						], 'dts/crm')
					});
				});
			} else {
				taskFactory.saveRecord(vo, function (result) {
					if (!result) { return; }

                    if (result.num_id > 0 && result.ttAcao !== undefined) {
                        hasTaskAccess = true;
                        taskPostPersist(result);
					    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'success',
                            title: $rootScope.i18n('l-task', [], 'dts/crm'),
                            detail: $rootScope.i18n('msg-save-task', [
                                result.num_id, result.ttAcao.nom_acao
                            ], 'dts/crm')
					    });
                    } else if (result.num_id > 0 && result.ttAcao === undefined) {
                        hasTaskAccess = false;
                        taskPostPersist(result);
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'success',
                            title: $rootScope.i18n('l-task', [], 'dts/crm'),
                            detail: $rootScope.i18n('msg-save-task-no-access', [
                                result.num_id
                            ], 'dts/crm')
                        });
                    }
				});
			}
		};

		this.cancel = function () {

			if (CRMControlTaskEdit.isNextAction !== true) {
				CRMControlTaskEdit.closeView();
			} else {

				var i,
					action,
					fields,
					message,
					isPlural,
					messages = [],
					pending = false;

				for (i = 0; i < CRMControlTaskEdit.actions.length; i += 1) {

					action = CRMControlTaskEdit.actions[i];

					if (action.log_livre_1 === true) {
						pending = true;
						messages.push(action.nom_acao);
					}
				}

				if (pending) {

					isPlural = messages.length > 1;

					message	= 'msg-next-action-required' + (isPlural ? '-plural' : '');

					fields  = [];

					for (i = 0; i < messages.length; i += 1) {
						fields += messages[i];
						if (isPlural && i !== (messages.length - 1)) {
							fields += ', ';
						}
					}

					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('l-next-action', [], 'dts/crm'),
						detail: $rootScope.i18n(message, [fields], 'dts/crm')
					});

				} else {
					CRMControlTaskEdit.closeView();
				}
			}
		};

		this.closeView = function (task) {
			if ($modalInstance) {
				if (task) {
					$modalInstance.close(task);
				} else {
					$modalInstance.dismiss('cancel');
				}
			} else {

				// Legacy...
				var view = {
					active: true,
					name: $rootScope.i18n('nav-task', [], 'dts/crm'),
					url: $location.url()
				};

				if (angular.isFunction(appViewService.getPageActive)) {
					view = appViewService.getPageActive();
				}

				appViewService.removeView(view);
			}
		};

		this.validadeParameterModel = function () {

			var now,
				task = CRMControlTaskEdit.model || {},
				related,
				rootRelated;

			CRMControlTaskEdit.editMode = (task.num_id > 0);

			if (CRMControlTaskEdit.editMode) {
				taskFactory.getDescription(task.num_id, function (result) {
					task.dsl_motivo = result.dsl_motivo;
				});
			}

			if (CRMControlTaskEdit.editMode && task.hra_inic && task.hra_fim) {
				task.initialHour = {
					start: task.hra_inic,
					end: task.hra_fim
				};
			} else {

				task.initialHour = {};

				now = new Date();

				now.setMinutes(now.getMinutes() + 10);
				task.initialHour.start = $filter('date')(now, 'HH:mm');

				now.setHours(now.getHours() + 1);
				task.initialHour.end = $filter('date')(now, 'HH:mm');
			}

			if (CRMControlTaskEdit.editMode && task.dat_inic && task.dat_fim) {
				task.initialDate = {
					start	: task.dat_inic,
					end		: task.dat_fim
				};
			} else {
				task.initialDate = {
					start	: new Date().getTime(),
					end		: new Date().getTime()
				};
			}

			task.initialDateChanged = false;
			task.finalDateChanged = false;

			CRMControlTaskEdit.initialStateModel = {
				dat_inic: task.dat_inic,
				dat_fim: task.dat_fim
			};

			task.dateTimeBase = new Date();
			task.idi_status_tar = task.idi_status_tar || 1;
			task.ttStatus = CRMControlTaskEdit.status[task.idi_status_tar - 1];

			if (!CRMControlTaskEdit.editMode) { // START - Parse Relateds

				rootRelated = task.ttOcorrenciaOrigem || task.ttOportunidadeOrigem || {};

				related = task.ttHistoricoOrigem || task.ttTarefaOrigem || undefined;

				if (CRMUtil.isUndefined(related)) {
					related = rootRelated;
				}

				if (!(task.ttConta && task.ttConta.num_id)) {
					task.ttConta = related.ttConta;
				}

				task.ttContato = related.ttContato;

				task.ttCampanha = related.ttCampanha;

				if (task.ttCampanha && CRMControlTaskEdit.isNextAction !== true) {
					task.ttAcao = related.ttAcao;
				}

				parameters = parameters || {};

				if (CRMUtil.isUndefined(parameters.canOverrideAccount)) {
					parameters.canOverrideAccount = !(task.ttConta && task.ttConta.num_id);
				}

				if (CRMUtil.isUndefined(parameters.canOverrideCampaign)) {
					parameters.canOverrideCampaign = !(task.ttCampanha && task.ttCampanha.num_id);
				}

			} // END - Parse Relateds

			if (task.ttConta && task.ttConta.num_id) {
				CRMControlTaskEdit.defaults.num_id_pessoa = task.ttConta.num_id;
			}

			if (task.ttContato && task.ttContato.num_id) {
				CRMControlTaskEdit.defaults.num_id_contat = task.ttContato.num_id;
			}

			if (task.ttCampanha && task.ttCampanha.num_id) {

				CRMControlTaskEdit.defaults.num_id_campanha = task.ttCampanha.num_id;

				if (CRMControlTaskEdit.isNextAction !== true) {

					if (task.ttAcao && task.ttAcao.num_id) {
						CRMControlTaskEdit.defaults.num_id_acao = task.ttAcao.num_id;
					}

					if (task.ttObjetivo && task.ttObjetivo.num_id) {
						CRMControlTaskEdit.defaults.num_id_objet = task.ttObjetivo.num_id;
					}

				} else if (parameters.resultActions && parameters.resultActions.length > 0) {
					task.ttAcao = parameters.resultActions[0];
					CRMControlTaskEdit.defaults.num_id_acao = parameters.resultActions[0].num_id;
				}
			}

			if (task.ttResponsavel && task.ttResponsavel.num_id) {
				CRMControlTaskEdit.defaults.num_id_respons = task.ttResponsavel.num_id;
			}

			if (task.ttGrupoUsuario && task.ttGrupoUsuario.num_id) {
				CRMControlTaskEdit.defaults.num_id_grp_usuar = task.ttGrupoUsuario.num_id;
			}

			if (task.ttConta && task.ttConta.num_id) {
				CRMControlTaskEdit.getPhonesToContact();
			}
		};

		this.validateParameters = function () {

			if (CRMControlTaskEdit.editMode === true) {

				if (CRMUtil.isDefined(parameters.canOverrideStatus)) {
					CRMControlTaskEdit.canOverrideStatus = parameters.canOverrideStatus === true;
				} else {
					CRMControlTaskEdit.canOverrideStatus = CRMControlTaskEdit.model.idi_status_tar !== 3;
				}

				if (CRMUtil.isDefined(parameters.canOverrideAccount)) {
					CRMControlTaskEdit.canOverrideAccount = parameters.canOverrideAccount === true;
				} else {
					CRMControlTaskEdit.canOverrideAccount = false;
				}

				if (CRMUtil.isDefined(parameters.canOverrideCampaign)) {
					CRMControlTaskEdit.canOverrideCampaign = parameters.canOverrideCampaign === true;
				} else {
					CRMControlTaskEdit.canOverrideCampaign = false;
				}

				if (CRMUtil.isDefined(parameters.canOverrideDescription)) {
					CRMControlTaskEdit.canOverrideDescription = parameters.canOverrideDescription === true;
				} else {
					CRMControlTaskEdit.canOverrideDescription = false;
				}

				if (CRMUtil.isDefined(parameters.canOverrideJustification)) {
					CRMControlTaskEdit.canOverrideJustification = parameters.canOverrideJustification === true;
				} else {
					CRMControlTaskEdit.canOverrideJustification = true;
				}

			} else {

				CRMControlTaskEdit.canOverrideStatus = false;
				CRMControlTaskEdit.canOverrideDescription = true;
				CRMControlTaskEdit.canOverrideJustification = false;

				if (CRMControlTaskEdit.defaults.num_id_pessoa) {
					CRMControlTaskEdit.canOverrideAccount = CRMControlTaskEdit.defaults.num_id_pessoa <= 0;
				} else {
					CRMControlTaskEdit.canOverrideAccount = parameters.canOverrideAccount || true;
				}

				if (CRMControlTaskEdit.defaults.num_id_campanha) {
					CRMControlTaskEdit.canOverrideCampaign = CRMControlTaskEdit.defaults.num_id_campanha <= 0;
				} else {
					CRMControlTaskEdit.canOverrideCampaign = parameters.canOverrideCampaign || true;
				}
			}

			if (CRMUtil.isDefined(parameters.canOverrideAction)) {
				CRMControlTaskEdit.canOverrideAction = parameters.canOverrideAction === true;
			} else {
				CRMControlTaskEdit.canOverrideAction = true;
			}

			if (CRMUtil.isDefined(parameters.canOverrideObjective)) {
				CRMControlTaskEdit.canOverrideObjective = parameters.canOverrideObjective === true;
			} else {
				CRMControlTaskEdit.canOverrideObjective = true;
			}

			if (CRMControlTaskEdit.isNextAction === true && parameters.resultActions) {
				CRMControlTaskEdit.actions = parameters.resultActions;
			}
		};

		this.loadPreferences = function (callback) {

			var count = 0,
				total = 7;

			taskFactory.isHierarchyAvailableInTask(function (result) {
				CRMControlTaskEdit.isHierarchyAvailableInTask = result;
				if (++count === total && callback) { callback(); }
			});

			taskFactory.isToNotifyClient(function (result) {
				CRMControlTaskEdit.isToNotifyClient = result;
				if (++count === total && callback) { callback(); }
			});

			taskFactory.isAutoNotify(function (result) {
				CRMControlTaskEdit.isAutoNotify = result;
				if (++count === total && callback) { callback(); }
			});

			taskFactory.isActiveUserGroup(function (result) {
				CRMControlTaskEdit.isActiveUserGroup = result;
				if (++count === total && callback) { callback(); }
			});

			taskFactory.isShowPhoneInTask(function (result) {
				CRMControlTaskEdit.isShowPhoneInTask = result;
				if (++count === total && callback) { callback(); }
			});

			attachmentFactory.getParamSizeLimit(function (result) {
				CRMControlTaskEdit.fileSizeLimit = result || 0;
				if (++count === total && callback) { callback(); }
			});

			attachmentFactory.isAttachmentType(function (result) {
				CRMControlTaskEdit.isAttachmentType = result;
				if (++count === total && callback) { callback(); }
			});
		};

		this.getAccounts = function (value) {
			if (!value || value === '') { return []; }
			var filter = { property: 'nom_razao_social', value: helper.parseStrictValue(value) };
			accountFactory.typeahead(filter, undefined, function (result) {
				CRMControlTaskEdit.accounts = result;
			});
		};

		this.getContacts = function () {

			CRMControlTaskEdit.model.ttContato = undefined;

			if (!CRMControlTaskEdit.model.ttConta) { return []; }

			accountFactory.getContacts(CRMControlTaskEdit.model.ttConta.num_id, function (result) {

				CRMControlTaskEdit.contacts = result || [];

				var i, contact, contactDefault, contactToSelect;

				for (i = 0; i < CRMControlTaskEdit.contacts.length; i += 1) {

					contact = CRMControlTaskEdit.contacts[i];

					if (CRMControlTaskEdit.defaults.num_id_contat > 0 &&
							CRMControlTaskEdit.defaults.num_id_contat === contact.num_id) {
						contactToSelect = contact;
						break;
					}

					if (CRMControlTaskEdit.editMode === false) {

						if (CRMControlTaskEdit.contacts.length === 1) {
							contactToSelect = contact;
							break;
						}

						if (contact.log_default === true) {
							contactDefault = contact;
						}
					}
				}

				CRMControlTaskEdit.model.ttContato = contactToSelect || contactDefault;

				if (CRMControlTaskEdit.model.ttContato) {
					CRMControlTaskEdit.reloadRecipients();
				}
			});
		};

		this.getCampaigns = function () {
			var i,
				campaignToSelect;

			campaignFactory.getAllCampaigns(true, undefined, function (result) {

				CRMControlTaskEdit.campaigns = result || [];

				if (!result || result.length === 0) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'warning',
						title: $rootScope.i18n('l-task', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-not-found-campaign', [], 'dts/crm')
					});
					return;
				}

				campaignToSelect = undefined;

				for (i = 0; i < CRMControlTaskEdit.campaigns.length; i += 1) {

					var campaign = CRMControlTaskEdit.campaigns[i];

					if (CRMControlTaskEdit.defaults.num_id_campanha > 0) {
						if (CRMControlTaskEdit.defaults.num_id_campanha === campaign.num_id) {
							campaignToSelect = campaign;
							break;
						}
					} else if (CRMControlTaskEdit.campaigns.length === 1) {
						campaignToSelect = campaign;
						break;
					}
				}

				if (campaignToSelect) {
					CRMControlTaskEdit.model.ttCampanha = campaignToSelect;
					CRMControlTaskEdit.onChangeCampaign();
				} else if (CRMControlTaskEdit.defaults.num_id_campanha > 0) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'warning',
						title: $rootScope.i18n('l-task', [], 'dts/crm'),
						detail: 'Usuário não possui acesso a campanha ou a mesma encontra-se encerrada!'
					});
					return;
				}
			});
		};

		this.getActions = function () {

			CRMControlTaskEdit.model.ttAcao = undefined;
			CRMControlTaskEdit.model.ttObjetivo = undefined;
			CRMControlTaskEdit.model.ttResponsavel = undefined;
			CRMControlTaskEdit.model.ttGrupoUsuario = undefined;

			if (CRMControlTaskEdit.isNextAction === true) { return CRMControlTaskEdit.actions; }

			if (!CRMControlTaskEdit.model.ttCampanha) { return []; }

			campaignFactory.getAllActions(CRMControlTaskEdit.model.ttCampanha.num_id, undefined, function (result) {

				CRMControlTaskEdit.actions = result || [];

				var i,
					action,
					actionToSelect;

				for (i = 0; i < CRMControlTaskEdit.actions.length; i += 1) {

					action = CRMControlTaskEdit.actions[i];

					if (CRMControlTaskEdit.defaults.num_id_acao > 0) {
						if (CRMControlTaskEdit.defaults.num_id_acao === action.num_id) {
							actionToSelect = action;
							break;
						}
					} else if (action.log_acao_default === true  || CRMControlTaskEdit.actions.length === 1) {
						actionToSelect = action;
						break;
					}
				}

				if (actionToSelect) {
					CRMControlTaskEdit.model.ttAcao = actionToSelect;
					CRMControlTaskEdit.onChangeAction();
				}
			});
		};

		this.getObjectives = function () {

			CRMControlTaskEdit.model.ttObjetivo = undefined;

			if (!CRMControlTaskEdit.model.ttCampanha || !CRMControlTaskEdit.model.ttAcao) { return []; }

			campaignFactory.getAllObjectives(CRMControlTaskEdit.model.ttCampanha.num_id, CRMControlTaskEdit.model.ttAcao.num_id, function (result) {

				CRMControlTaskEdit.objectives = result || [];

				var i,
					objective,
					objectiveToSelect;

				for (i = 0; i < CRMControlTaskEdit.objectives.length; i += 1) {

					objective = CRMControlTaskEdit.objectives[i];

					if (CRMControlTaskEdit.defaults.num_id_objet > 0) {
						if (CRMControlTaskEdit.defaults.num_id_objet === objective.num_id) {
							objectiveToSelect = objective;
							break;
						}
					} else if (objective.log_objet_default === true || CRMControlTaskEdit.objectives.length === 1) {
						objectiveToSelect = objective;
						break;
					}
				}

				if (objectiveToSelect) {
					CRMControlTaskEdit.model.ttObjetivo = objectiveToSelect;
				}
			});
		};

		this.onChangeGroup = function (group) {
			var x,
				user,
				userToSelect;

			CRMControlTaskEdit.users = [];
			CRMControlTaskEdit.model.ttResponsavel = undefined;

			if (group && group.ttUsuario && angular.isArray(group.ttUsuario)) {
				CRMControlTaskEdit.users = group.ttUsuario;

				for (x = 0; x < group.ttUsuario.length; x += 1) {
					user = group.ttUsuario[x];

					if (group.num_id_usuar && group.num_id_usuar > 0) { /* responsavel grupo */
						if (group.num_id_usuar === user.num_id) {
							userToSelect  = user;
							break;
						}
					} else if (user.num_id === $rootScope.currentuser.idCRM) { /* default logado */
						userToSelect = user;
						break;
					} else if (group.ttUsuario.length === 1) { /* somente 1 usuario */
						userToSelect = user;
						break;
					}
				}
			}

			if (userToSelect) {
				CRMControlTaskEdit.model.ttResponsavel = userToSelect;
			}

			CRMControlTaskEdit.reloadRecipients();
		};

		this.getUsers = function () {

			var i,
				x,
				group,
				user,
				model = CRMControlTaskEdit.model,
				loadUsers,
				idAccount,
				userDefault,
				userToSelect,
				groupToSelect;

			model.ttResponsavel = undefined;
			model.ttGrupoUsuario = undefined;

			loadUsers = function (campaignId, actionId, accountId, callback) {
				if (CRMControlTaskEdit.isActiveUserGroup === true) {

					campaignFactory.getAllActionsUsersAndGroupUser(campaignId, actionId, accountId, function (result) {
						if (callback) { callback(result); }
					});

				} else {

					campaignFactory.getAllActionsUsers(campaignId, actionId, accountId, function (result) {
						if (callback) { callback(result); }
					});

				}
			};

			if (!model.ttCampanha || !model.ttAcao) { return []; }

			idAccount = undefined;

			if (CRMControlTaskEdit.isHierarchyAvailableInTask === true) {

				if (model.ttConta) {
					idAccount = model.ttConta.num_id;
				}

				if (!idAccount) { return; }

				CRMControlTaskEdit.disableUser = !(model.ttAcao && model.ttConta);
			} else {
				CRMControlTaskEdit.disableUser = !(model.ttAcao);
			}

			loadUsers(model.ttCampanha.num_id, model.ttAcao.num_id, idAccount, function (result) {

				CRMControlTaskEdit.groups = [];
				CRMControlTaskEdit.users  = [];

				if (angular.isArray(result) && result.length > 0) {

					if (CRMControlTaskEdit.defaults.num_id_respons && CRMControlTaskEdit.defaults.num_id_respons > 0) {
						userDefault = CRMControlTaskEdit.defaults.num_id_respons;
					} else {
						userDefault = $rootScope.currentuser.idCRM;
					}

					if (result[0].nom_grp_usuar) {
						CRMControlTaskEdit.groups = result || [];

						for (i = 0; i < CRMControlTaskEdit.groups.length; i += 1) {
							group = CRMControlTaskEdit.groups[i];

							if (group.ttUsuario && angular.isArray(group.ttUsuario) && userToSelect === undefined) {

								for (x = 0; x < group.ttUsuario.length; x += 1) {
									user = group.ttUsuario[x];

									if (CRMControlTaskEdit.defaults.num_id_respons > 0) { /* responsavel tarefa */
										if (CRMControlTaskEdit.defaults.num_id_respons === user.num_id) {
											userToSelect  = user;
											break;
										}
									} else if (user.num_id === $rootScope.currentuser.idCRM) { /* default logado */
										userToSelect = user;
										break;
									} else if (CRMControlTaskEdit.groups.length === 1 && group.ttUsuario.length === 1) { /* somente 1 grupo com 1 unico usuario */
										userToSelect = user;
										break;
									}
								}
							}

							if (CRMControlTaskEdit.defaults.num_id_grp_usuar > 0) {
								if (group.num_id === CRMControlTaskEdit.defaults.num_id_grp_usuar) {
									groupToSelect = group; /* grupo informado na tarefa */
									CRMControlTaskEdit.users = groupToSelect.ttUsuario || [];
								}
							} else if (userToSelect && userToSelect.num_id_grp_usuar === group.num_id) {
								groupToSelect = group; /* grupo default do usuario */
								CRMControlTaskEdit.users = groupToSelect.ttUsuario || [];
							} else if (CRMControlTaskEdit.groups.length === 1) {
								groupToSelect = group; /* somente 1 grupo */
								CRMControlTaskEdit.users = groupToSelect.ttUsuario || [];
							}

							if (groupToSelect && userToSelect) { break; }

						}

					} else {
						CRMControlTaskEdit.users = result || [];

						for (i = 0; i < CRMControlTaskEdit.users.length; i += 1) {

							user = CRMControlTaskEdit.users[i];

							if (CRMControlTaskEdit.defaults.num_id_respons > 0) {
								if (CRMControlTaskEdit.defaults.num_id_respons === user.num_id) {
									userToSelect = user;
									break;
								}
							} else if (user.num_id === $rootScope.currentuser.idCRM || CRMControlTaskEdit.users.length === 1) {
								userToSelect = user;
								break;
							}
						}
					}

				}

				if (CRMControlTaskEdit.isHierarchyAvailableInTask === true) {
					if (CRMUtil.isDefined(CRMControlTaskEdit.users) && CRMControlTaskEdit.users.length === 0) {
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'warning',
							title: $rootScope.i18n('l-task', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-not-found-campaign-user-hierarchy', [
								model.ttAcao.nom_acao, model.ttConta.nom_razao_social
							], 'dts/crm')
						});
					}
				}

				if (groupToSelect) {
					CRMControlTaskEdit.model.ttGrupoUsuario = groupToSelect;
				}

				if (userToSelect) {
					CRMControlTaskEdit.model.ttResponsavel = userToSelect;
					CRMControlTaskEdit.reloadRecipients();
				}
			});
		};

		this.getTasks = function (value) {
			if (value) { value = value.replace(/d+/, ''); }
			if (!value || value === '') { return []; }
			var filter = { property: 'id', value: value };
			taskFactory.typeahead(filter, { end: 1 }, function (result) {
				CRMControlTaskEdit.tasks = result || [];
			});
		};

		this.getHistories = function (value) {
			if (value) { value = value.replace(/d+/, ''); }
			if (!value || value === '') { return []; }
			var filter = { property: 'id', value: value };
			historyFactory.typeahead(filter, { end: 1 }, function (result) {
				CRMControlTaskEdit.histories = result || [];
			});
		};

		this.getSupports = function (value) {
			if (!value || value === '') { return []; }
			var filter = { property: 'nom_ocor', value: helper.parseStrictValue(value) };
			opportunityFactory.typeahead(filter, undefined, function (result) {
				CRMControlTaskEdit.supports = result || [];
			});
		};

		this.getOpportunities = function (value) {
			if (!value || value === '') { return []; }
			var filter = { property: 'des_oportun_vda', value: helper.parseStrictValue(value) };
			opportunityFactory.typeahead(filter, undefined, function (result) {
				CRMControlTaskEdit.opportunities = result || [];
			});
		};

		this.getPhonesToContact = function (isNewContact) {

			if (CRMControlTaskEdit.isShowPhoneInTask !== true) { return; }

			CRMControlTaskEdit.model.ttTelefone = undefined;
			CRMControlTaskEdit.phoneList = [];

			if (!CRMControlTaskEdit.model.ttConta || !CRMControlTaskEdit.model.ttConta.num_id) { return; }

			var i,
				model = CRMControlTaskEdit.model,
				accountId = model.ttConta.num_id,
				contactId = ((model.ttContato && model.ttContato.num_id) ? model.ttContato.num_id : 0);

			taskFactory.getPhonesToContact(accountId, contactId, isNewContact, function (result) {

				CRMControlTaskEdit.phoneList = result || [];

				if (CRMControlTaskEdit.phoneList.length === 0) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'warning',
						title: $rootScope.i18n('l-task', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-not-found-phone-account-contact', [], 'dts/crm')
					});
					return;
				}

				if (CRMUtil.isUndefined(model.nom_telefone)) { return; }

				for (i = 0; i < CRMControlTaskEdit.phoneList.length; i += 1) {

					var phone = CRMControlTaskEdit.phoneList[i];

					if (phone.nom_telefone === model.nom_telefone) {
						model.ttTelefone = phone;
						break;
					}
				}

			}, true);
		};

		this.onChangeAccount = function (selected) {
			if (selected) {
				CRMControlTaskEdit.model.ttConta = selected;
			}

			CRMControlTaskEdit.getContacts();

			if (CRMControlTaskEdit.isHierarchyAvailableInTask === true
					&& CRMControlTaskEdit.model.ttConta
					&& CRMControlTaskEdit.model.ttAcao) {
				CRMControlTaskEdit.getUsers();
			}

			CRMControlTaskEdit.reloadRecipients();
			CRMControlTaskEdit.getPhonesToContact();
		};

		this.onChangeContact = function (isNewContact) {
			CRMControlTaskEdit.reloadRecipients();
			CRMControlTaskEdit.getPhonesToContact(isNewContact);
		};

		this.onChangeCampaign = function () {
			CRMControlTaskEdit.getActions();
		};

		this.onChangeAction = function () {
			CRMControlTaskEdit.getUsers();
			CRMControlTaskEdit.getObjectives();
		};

		this.onChangeComplement = function (complement) {

			CRMControlTaskEdit.model.num_id_orig			= 0;
			CRMControlTaskEdit.model.num_id_ocor			= 0;
			CRMControlTaskEdit.model.num_id_oportun		= 0;
			CRMControlTaskEdit.model.num_id_histor_acao	= 0;

			if (complement === 'ttOcorrenciaOrigem') {
				CRMControlTaskEdit.tasks = [];
				CRMControlTaskEdit.histories = [];
				CRMControlTaskEdit.opportunities = [];
			} else if (complement === 'ttOportunidadeOrigem') {
				CRMControlTaskEdit.tasks = [];
				CRMControlTaskEdit.tickets = [];
				CRMControlTaskEdit.histories = [];
			} else if (complement === 'ttTarefaOrigem') {
				CRMControlTaskEdit.tickets = [];
				CRMControlTaskEdit.histories = [];
				CRMControlTaskEdit.opportunities = [];
			} else if (complement === 'ttHistoricoOrigem') {
				CRMControlTaskEdit.tasks = [];
				CRMControlTaskEdit.tickets = [];
				CRMControlTaskEdit.opportunities = [];
			}
		};

		this.reloadRecipients = function () {

			if (CRMControlTaskEdit.isAutoNotify || CRMControlTaskEdit.showRecipients) {

				var i,
					contact,
					listOfRecipients = [];

				if (CRMControlTaskEdit.isToNotifyClient) {
					// Verifica o contato da tarefa.
					if (CRMControlTaskEdit.model.ttContato) {
						if (CRMControlTaskEdit.model.ttContato.nom_email_1) {
							listOfRecipients.push(CRMControlTaskEdit.model.ttContato.nom_email_1);
						} else if (CRMControlTaskEdit.model.ttContato.nom_email_2) {
							listOfRecipients.push(CRMControlTaskEdit.model.ttContato.nom_email_2);
						}
					}

					// Verifica o contato focal da conta da tarefa.
					if (listOfRecipients.length === 0 && CRMControlTaskEdit.model.ttConta && CRMControlTaskEdit.contacts) {
						for (i = 0; i < CRMControlTaskEdit.contacts.length; i += 1) {
							contact = CRMControlTaskEdit.contacts[i];
							if (contact.log_default === true) {
								if (contact.nom_email_1) {
									listOfRecipients.push(contact.nom_email_1);
								} else if (contact.nom_email_2) {
									listOfRecipients.push(contact.nom_email_2);
								}
								break;
							}
						}
					}

					// Verifica a conta da tarefa.
					if (listOfRecipients.length === 0 && CRMControlTaskEdit.model.ttConta) {
						if (CRMControlTaskEdit.model.ttConta.nom_email_1) {
							listOfRecipients.push(CRMControlTaskEdit.model.ttConta.nom_email_1);
						} else if (CRMControlTaskEdit.model.ttConta.nom_email_2) {
							listOfRecipients.push(CRMControlTaskEdit.model.ttConta.nom_email_2);
						}
					}
				}

				if ($rootScope.currentuser.email) {
					listOfRecipients.push($rootScope.currentuser.email);
				}

				if (CRMControlTaskEdit.model.ttResponsavel) {
					if (CRMControlTaskEdit.model.ttResponsavel.num_id !== $rootScope.currentuser.idCRM) {
						listOfRecipients.push(CRMControlTaskEdit.model.ttResponsavel.nom_email);
					}
				}

				CRMControlTaskEdit.recipients = '';
				for (i = 0; i < listOfRecipients.length; i += 1) {
					if (listOfRecipients[i]
							&& listOfRecipients[i].length > 0) {
						CRMControlTaskEdit.recipients += listOfRecipients[i] + ';';
					}
				}
			} else {
				CRMControlTaskEdit.recipients = undefined;
			}

		};

		this.checkChangeInitialDate = function () {
			var dates = CRMControlTaskEdit.model.initialDate;

			if (CRMControlTaskEdit.initialStateModel.dat_inic !== dates.dat_inic) {
				CRMControlTaskEdit.initialDateChanged = true;
			}
			if (CRMControlTaskEdit.initialStateModel.dat_fim !== dates.dat_fim) {
				CRMControlTaskEdit.finalDateChanged = true;
			}
		};

		this.isInvalidForm = function () {

			var baseTime,
				message,
				messages = [],
				isInvalidForm = false,
				isValidTimeRange;

			if (!CRMControlTaskEdit.model.initialDate) {
				isInvalidForm = true;
				messages.push('l-date');
			}

			if (CRMControlTaskEdit.model.initialDate && !CRMControlTaskEdit.model.initialDate.start) {
				isInvalidForm = true;
				messages.push('l-date-start');
			}

			if (CRMControlTaskEdit.model.initialDate && !CRMControlTaskEdit.model.initialDate.end) {
				isInvalidForm = true;
				messages.push('l-date-end');
			}

			if (!CRMControlTaskEdit.model.initialHour) {
				isInvalidForm = true;
				messages.push('l-time');
			}

			if ((CRMControlTaskEdit.model.initialHour && !CRMControlTaskEdit.model.initialHour.start)
					|| CRMControlTaskEdit.model.initialHour.start.length === 0) {
				isInvalidForm = true;
				messages.push('l-time');
			}

			if ((CRMControlTaskEdit.model.initialHour && !CRMControlTaskEdit.model.initialHour.end)
					|| CRMControlTaskEdit.model.initialHour.end.length === 0) {
				isInvalidForm = true;
				messages.push('l-time');
			}

			if (!CRMControlTaskEdit.model.dsl_motivo || CRMControlTaskEdit.model.dsl_motivo.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-description');
			}

			if (!CRMControlTaskEdit.model.ttConta) {
				isInvalidForm = true;
				messages.push('l-account');
			}

			if (!CRMControlTaskEdit.model.ttCampanha) {
				isInvalidForm = true;
				messages.push('l-campaign');
			}

			if (!CRMControlTaskEdit.model.ttAcao) {
				isInvalidForm = true;
				messages.push('l-action');
			}

			if (!CRMControlTaskEdit.model.ttObjetivo) {
				isInvalidForm = true;
				messages.push('l-objective');
			}

			if (!CRMControlTaskEdit.model.ttResponsavel) {
				isInvalidForm = true;
				messages.push('l-user-responsible');
			}

			if (CRMControlTaskEdit.isActiveUserGroup === true && !CRMControlTaskEdit.model.ttGrupoUsuario) {
				isInvalidForm = true;
				messages.push('l-group-user');
			}
			if ((CRMControlTaskEdit.editMode === true && CRMUtil.isUndefined(CRMControlTaskEdit.model.dsl_justif_alter))
					|| (CRMControlTaskEdit.model.dsl_justif_alter && CRMControlTaskEdit.model.dsl_justif_alter.trim().length === 0)) {
				isInvalidForm = true;
				messages.push('l-justification');
			}

			if ((CRMControlTaskEdit.editMode === true && (!CRMControlTaskEdit.model.ttStatus || CRMControlTaskEdit.model.ttStatus.num_id < 1))) {
				isInvalidForm = true;
				messages.push('l-status');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-task', messages);
			}

			if (!isInvalidForm) {

				baseTime = CRMControlTaskEdit.model.dateTimeBase || new Date();

				if (CRMControlTaskEdit.editMode === true && CRMControlTaskEdit.model.initialDateChanged !== true) {
					baseTime = new Date(CRMControlTaskEdit.model.dat_inic);
				}

				isValidTimeRange = helper.validateTimeRange(CRMControlTaskEdit.model.initialDate, CRMControlTaskEdit.model.initialHour, baseTime);

				if (isValidTimeRange > 0) {

					isInvalidForm = true;

					if (isValidTimeRange === 1) {
						message = 'msg-period-start-after-end';
					} else if (isValidTimeRange === 2) {
						message = 'msg-period-end-before-start';
					}

					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type:   'error',
						title:  $rootScope.i18n('l-task', [], 'dts/crm'),
						detail: $rootScope.i18n(message, [], 'dts/crm')
					});
				}
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {};

			if (CRMControlTaskEdit.model.num_id && CRMControlTaskEdit.model.num_id > 0) {
				vo.num_id = CRMControlTaskEdit.model.num_id;
			}

			if (CRMControlTaskEdit.model.ttStatus) {
				vo.idi_status_tar = CRMControlTaskEdit.model.ttStatus.num_id;
			} else {
				vo.idi_status_tar = 1;
			}

			vo.dat_inic = CRMControlTaskEdit.model.initialDate.start;
			vo.hra_inic = CRMControlTaskEdit.model.initialHour.start;

			vo.dat_fim  = CRMControlTaskEdit.model.initialDate.end;
			vo.hra_fim  = CRMControlTaskEdit.model.initialHour.end;

			if (CRMControlTaskEdit.model.dateTimeBase) {
				vo.dat_cadastro = CRMControlTaskEdit.model.dateTimeBase.getTime();
				vo.hra_cadastro = $filter('date')(CRMControlTaskEdit.model.dateTimeBase, 'HH:mm');
			} else {
				vo.dat_cadastro = CRMControlTaskEdit.model.dat_cadastro;
				vo.hra_cadastro = CRMControlTaskEdit.model.hra_cadastro;
			}

			vo.num_id_usuar = $rootScope.currentuser.idCRM;
			vo.log_integrad_outlook = CRMControlTaskEdit.model.log_integrad_outlook;

			vo.dsl_motivo = CRMControlTaskEdit.model.dsl_motivo;
			vo.dsl_justif_alter = CRMControlTaskEdit.model.dsl_justif_alter;

			if (CRMControlTaskEdit.model.ttConta) {
				vo.num_id_pessoa = CRMControlTaskEdit.model.ttConta.num_id;
			}

			if (CRMControlTaskEdit.model.ttContato) {
				vo.num_id_contat = CRMControlTaskEdit.model.ttContato.num_id;
			}

			if (CRMControlTaskEdit.model.ttCampanha) {
				vo.num_id_campanha = CRMControlTaskEdit.model.ttCampanha.num_id;
			}

			if (CRMControlTaskEdit.model.ttAcao) {
				vo.num_id_acao = CRMControlTaskEdit.model.ttAcao.num_id;
			}

			if (CRMControlTaskEdit.model.ttObjetivo) {
				vo.num_id_objet = CRMControlTaskEdit.model.ttObjetivo.num_id;
			}

			if (CRMControlTaskEdit.model.ttResponsavel) {
				vo.num_id_respons = CRMControlTaskEdit.model.ttResponsavel.num_id;
			}

			if (CRMControlTaskEdit.model.ttOcorrenciaOrigem) {
				vo.num_id_ocor = CRMControlTaskEdit.model.ttOcorrenciaOrigem.num_id;
			}

			if (CRMControlTaskEdit.model.ttTarefaOrigem) {
				vo.num_id_orig = CRMControlTaskEdit.model.ttTarefaOrigem.num_id;
			}

			if (CRMControlTaskEdit.model.ttHistoricoOrigem) {
				vo.num_id_histor_acao = CRMControlTaskEdit.model.ttHistoricoOrigem.num_id;
			}

			if (CRMControlTaskEdit.model.ttOportunidadeOrigem) {
				vo.num_id_oportun = CRMControlTaskEdit.model.ttOportunidadeOrigem.num_id;
			}

			if (CRMControlTaskEdit.model.ttGrupoUsuario) {
				vo.num_id_grp_usuar = CRMControlTaskEdit.model.ttGrupoUsuario.num_id;
			}

			if (CRMControlTaskEdit.isShowPhoneInTask === true && CRMControlTaskEdit.model.ttTelefone) {
				vo.nom_telefone = CRMControlTaskEdit.model.ttTelefone.nom_telefone;
			}

			return vo;
		};

		this.afterSave = function (task) {

            taskHelper.parseTaskColor(task);
            taskHelper.parseRelatedTo(task);
            $rootScope.$broadcast(CRMEvent.scopeSaveTask, task);

            if (CRMControlTaskEdit.isNextAction !== true) {
                CRMControlTaskEdit.closeView(task);
            } else {
                CRMControlTaskEdit.proceedToNextAction(task);
            }
		};

		this.proceedToNextAction = function (task) {

			var i,
				index;

			$rootScope.$broadcast(CRMEvent.scopeSaveNextTask, task);

			for (i = 0; i < CRMControlTaskEdit.actions.length; i += 1) {
				if (CRMControlTaskEdit.actions[i].num_id === task.num_id_acao) {
					index = i;
					break;
				}
			}

			if (index >= 0) { CRMControlTaskEdit.actions.splice(index, 1); }

			if (CRMControlTaskEdit.actions.length === 0) {
				$modalInstance.close(task);
			} else {

				CRMControlTaskEdit.model.num_id = undefined;
				CRMControlTaskEdit.model.dsl_motivo = '';
				CRMControlTaskEdit.model.dsl_justif_alter = undefined;
				CRMControlTaskEdit.model.log_integrad_outlook = undefined;
				CRMControlTaskEdit.model.files = undefined;

				CRMControlTaskEdit.model.ttAcao = CRMControlTaskEdit.actions[0];
				CRMControlTaskEdit.onChangeAction();
			}
		};

		this.newAccountContact = function () {
			modalContactEdit.open({
				related: CRMControlTaskEdit.model.ttConta
			}).then(function (result) {
				if (CRMUtil.isDefined(result)) {
					CRMControlTaskEdit.contacts = CRMControlTaskEdit.contacts || [];
					CRMControlTaskEdit.contacts.push(result);
					CRMControlTaskEdit.model.ttContato = result;
					CRMControlTaskEdit.onChangeContact(true);
				}
			});
		};

		this.onSelectFiles = function ($files) {

			var	file,
				i,
				canUpload;

			if (!CRMControlTaskEdit.model.files) {
				CRMControlTaskEdit.model.files = [];
			}

			for (i = 0; i < $files.length; i += 1) {
				file = $files[i];
				canUpload = true;
				if (attachmentHelper.fileAlreadyExistInSelectedList(CRMControlTaskEdit.model.files, file.name)) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'warning',
						title: $rootScope.i18n('nav-task', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-file-already-exist', [file.name], 'dts/crm')
					});
					canUpload = false;
				} else if (CRMControlTaskEdit.fileSizeLimit > 0) {
					canUpload = helper.validateUploadLimitFileSize('nav-task', file.name, file.size, CRMControlTaskEdit.fileSizeLimit);
				}
				if (canUpload) {
					CRMControlTaskEdit.model.files.push(file);
				} else {
					CRMControlTaskEdit.model.file = null;
				}
			}

			if (CRMControlTaskEdit.isAttachmentType && $files.length > 0) {
				modalAttachmentTypeSelect.open(
					CRMControlTaskEdit.model.files
				).then(function (result) {

					CRMControlTaskEdit.model.files = result.selectedFiles;

				});
			}
		};


		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		CRMControlTaskEdit.model = parameters.task ? angular.copy(parameters.task) : {};
		CRMControlTaskEdit.defaults = parameters.defaults || {};

		$rootScope.$broadcast(CRMEvent.scopeFileSelectAddUpdTask, false);

		CRMControlTaskEdit.isReopen = CRMUtil.isDefined(parameters.isReopen)     ? parameters.isReopen     : false;
		CRMControlTaskEdit.isNextAction = CRMUtil.isDefined(parameters.isNextAction) ? parameters.isNextAction : false;

		CRMControlTaskEdit.validadeParameterModel();
		CRMControlTaskEdit.validateParameters();

		if (CRMControlTaskEdit.isModal !== true) {
			appViewService.startView($rootScope.i18n('nav-task', [], 'dts/crm'), 'crm.task.edit.control', CRMControlTaskEdit);
		}

		helper.loadCRMContext(function () {

			accessRestrictionFactory.getUserRestrictions('task.edit', $rootScope.currentuser.login, function (result) {
				CRMControlTaskEdit.accessRestriction = result || {};
			});

			if (CRMControlTaskEdit.isReopen === false) {

				CRMControlTaskEdit.getContacts();

				CRMControlTaskEdit.loadPreferences(function () {

					if (CRMControlTaskEdit.editMode !== true && CRMControlTaskEdit.isNextAction !== true) {

						CRMControlTaskEdit.getCampaigns();

					} else if (CRMControlTaskEdit.isNextAction === true) {
						CRMControlTaskEdit.onChangeAction();
					} else if (CRMControlTaskEdit.editMode === true) {
						CRMControlTaskEdit.getUsers();
					}

					if (CRMControlTaskEdit.model.ttConta && CRMControlTaskEdit.model.ttConta.num_id) {
						CRMControlTaskEdit.getPhonesToContact();
					}

				});
			}

		});

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			$rootScope.$broadcast(CRMEvent.scopeFileSelectAddUpdTask, true);
			CRMControlTaskEdit = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance && CRMControlTaskEdit.isNextAction !== true) {
				$modalInstance.dismiss('cancel');
			}
		});
	};
	controllerTaskEdit.$inject = [
		'$rootScope', '$scope', '$filter', '$location', 'TOTVSEvent', 'totvs.app-main-view.Service',
		'crm.legend', 'crm.crm_tar.factory', 'crm.crm_campanha.factory',
		'crm.crm_usuar.factory', 'crm.crm_pessoa.conta.factory', 'crm.helper', 'crm.task.helper',
		'crm.crm_anexo.factory', 'crm.account-contact.modal.edit', 'crm.crm_histor_acao.factory',
		'crm.crm_oportun_vda.factory', 'crm.crm_param.factory', 'crm.attachment-type.select.modal.control',
		'crm.attachment.helper', 'crm.crm_acess_portal.factory'
	];

	controllerTaskExecute = function ($rootScope, $scope, $filter, $location, TOTVSEvent, appViewService,
								legend, helper, taskHelper, taskFactory, campaignFactory, historyFactory, preferenceFactory, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlTaskExecute = this,
			parameters = $scope.parameters || {},
			$modalInstance = $scope.$modalInstance || undefined;

		this.model = undefined;

		this.results = [];
		this.total;

		this.isAllowedRetroactiveHistory = false;

		this.isModal = $scope.isModal === true;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.save = function () {

			if (CRMControlTaskExecute.isInvalidForm()) { return; }

			var vo = CRMControlTaskExecute.convertToSave();

			if (!vo) { return; }

			taskFactory.executeTaskList(vo, function (result) {

				if (!result) { return; }

				CRMControlTaskExecute.afterSave(result);

				if (CRMUtil.isDefined(result) && result.isOk == true) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'success',
						title: $rootScope.i18n('l-task', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-execute-task-list-sucess', [
						], 'dts/crm')
					});
				}
			});
		};

		this.cancel = function () {
			CRMControlTaskExecute.closeView();
		};

		this.closeView = function (task) {
			if ($modalInstance) {
				if (task) {
					$modalInstance.close(task);
				} else {
					$modalInstance.dismiss('cancel');
				}
			} else {

				// Legacy...
				var view = {
					active: true,
					name: $rootScope.i18n('nav-task', [], 'dts/crm'),
					url: $location.url()
				};

				if (angular.isFunction(appViewService.getPageActive)) {
					view = appViewService.getPageActive();
				}

				appViewService.removeView(view);
			}
		};

		this.loadPreferences = function (callback) {

			var count = 0,
				total = 1;

			historyFactory.isAllowedRetroactiveHistory(function (result) {
				CRMControlTaskExecute.isAllowedRetroactiveHistory = result;
				if (++count === total && callback) { callback(); }
			});

		};


		this.isInvalidForm = function () {

			var baseTime,
				message,
				messages = [],
				isInvalidForm = false,
				isValidTimeRange;

			if (!CRMControlTaskExecute.model.dsl_histor_acao || CRMControlTaskExecute.model.dsl_histor_acao.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-description');
			}

			if (!CRMControlTaskExecute.model.ttMidia) {
				isInvalidForm = true;
				messages.push('l-media');
			}

			if (!CRMControlTaskExecute.model.ttResultado) {
				isInvalidForm = true;
				messages.push('l-result');
			}


			if (isInvalidForm === true) {
				helper.showInvalidFormMessage('l-task', messages);
			} else {

				isValidTimeRange = helper.validateTimeRange(
					CRMControlTaskExecute.model.initialDate,
					CRMControlTaskExecute.model.initialHour,
					CRMControlTaskExecute.model.dateTimeBase || new Date()
				);

				if (isValidTimeRange > -1) {

					if (isValidTimeRange === 1) {
						message = 'msg-period-start-after-end';
						isInvalidForm = true;
					} else if (isValidTimeRange === 2) {
						message = 'msg-period-end-before-start';
						isInvalidForm = true;
					}
				}

				if (message) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type:   'error',
						title:  $rootScope.i18n('l-history', [], 'dts/crm'),
						detail: $rootScope.i18n(message, [], 'dts/crm')
					});
				}

			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var model = CRMControlTaskExecute.model,
				i = 0,
				list = [],
				vo = {};

			for (i = 0; i < CRMControlTaskExecute.taskList.length; i++) {
				list.push({
					num_id_tar: CRMControlTaskExecute.taskList[i].num_id
				});
			}

			vo.ttTask = list;

			vo.dsl_histor_acao = model.dsl_histor_acao;

			vo.num_id_campanha = model.ttCampanha ? model.ttCampanha.num_id : 0;
			vo.num_id_acao = model.ttAcao ? model.ttAcao.num_id : 0;
			vo.num_id_restdo = model.ttResultado ? model.ttResultado.num_id : 0;
			vo.num_id_mid = model.ttMidia ? model.ttMidia.num_id : 0;
			vo.num_id_detmnto = model.ttDetalhamento ? model.ttDetalhamento.num_id : 0;
			vo.log_mov_ticket = true;

			if (model.initialDate && model.initialDate.start) {
				vo.dat_inic = model.initialDate.start;
				vo.dat_fim  = model.initialDate.end;
			}

			if (model.initialHour && model.initialHour.start) {
				vo.hra_inic = model.initialHour.start;
				vo.hra_fim  = model.initialHour.end;
			}

			return vo;
		};

		this.afterSave = function (result) {
			CRMControlTaskExecute.closeView(result);
			/*
			taskHelper.parseTaskColor(task);
			taskHelper.parseRelatedTo(task);
			$rootScope.$broadcast(CRMEvent.scopeSaveTask, task);
			CRMControlTaskExecute.closeView(task);
			*/
		};

		this.onChangeResult = function () {
			CRMControlTaskExecute.getResultDetails();
		};

		this.getMedias = function () {

			CRMControlTaskExecute.model.ttMidia = undefined;

			if (!CRMControlTaskExecute.model.ttCampanha || !CRMControlTaskExecute.model.ttAcao) { return []; }

			campaignFactory.getAllMedias(CRMControlTaskExecute.model.ttCampanha.num_id, CRMControlTaskExecute.model.ttAcao.num_id, function (result) {

				CRMControlTaskExecute.medias = result || [];

				var i,
					media,
					mediaToSelect;

				for (i = 0; i < CRMControlTaskExecute.medias.length; i++) {

					media = CRMControlTaskExecute.medias[i];

					if (media.log_mid_default === true || CRMControlTaskExecute.medias.length === 1) {
						mediaToSelect = media;
						break;
					}
				}

				if (mediaToSelect) {
					CRMControlTaskExecute.model.ttMidia = mediaToSelect;
				}
			});
		};

		this.getResults = function () {

			CRMControlTaskExecute.model.ttResultado = undefined;

			if (!CRMControlTaskExecute.model.ttCampanha || !CRMControlTaskExecute.model.ttAcao) { return []; }

			campaignFactory.getAllResults(CRMControlTaskExecute.model.ttCampanha.num_id, CRMControlTaskExecute.model.ttAcao.num_id, function (data) {

				CRMControlTaskExecute.results = data || [];

				var i,
					result,
					resultToSelect;

				for (i = 0; i < CRMControlTaskExecute.results.length; i++) {

					result = CRMControlTaskExecute.results[i];

					if (result.log_restdo_default === true || CRMControlTaskExecute.results.length === 1) {
						resultToSelect = result;
						break;
					}

				}

				if (resultToSelect) {
					CRMControlTaskExecute.model.ttResultado = resultToSelect;
					CRMControlTaskExecute.onChangeResult();
				} else if (CRMControlTaskExecute.results && CRMControlTaskExecute.results.length > 0) {
					CRMControlTaskExecute.model.ttResultado = CRMControlTaskExecute.results[0];
					CRMControlTaskExecute.onChangeResult();
				}
			});
		};

		this.getResultDetails = function () {

			CRMControlTaskExecute.model.ttDetalhamento = undefined;

			if (!CRMControlTaskExecute.model.ttResultado) { return []; }

			campaignFactory.getAllDetails(CRMControlTaskExecute.model.ttResultado.num_id, function (result) {

				CRMControlTaskExecute.details = result || [];

				if (CRMControlTaskExecute.details.length === 1) {
					CRMControlTaskExecute.model.ttDetalhamento = CRMControlTaskExecute.details[0];
				}
			});
		};


		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		CRMControlTaskExecute.model = {};
		CRMControlTaskExecute.taskList = parameters.taskList ? angular.copy(parameters.taskList) : [];

		if (CRMControlTaskExecute.isModal !== true) {
			appViewService.startView($rootScope.i18n('nav-task', [], 'dts/crm'), 'crm.task.execute.control', CRMControlTaskExecute);
		}

		this.init = function () {
			var now;

			CRMControlTaskExecute.total = CRMControlTaskExecute.taskList.length;

			if (CRMControlTaskExecute.total && CRMControlTaskExecute.total > 0) {
				CRMControlTaskExecute.model = CRMControlTaskExecute.taskList[0];
			}

			CRMControlTaskExecute.model.initialHour = {};

			now = new Date();

			CRMControlTaskExecute.model.initialHour.start = $filter('date')(now, 'HH:mm');

			now.setHours(now.getHours() + 1);
			CRMControlTaskExecute.model.initialHour.end = $filter('date')(now, 'HH:mm');

			CRMControlTaskExecute.model.initialDate = {
				start	: new Date().getTime(),
				end		: new Date().getTime()
			};

			CRMControlTaskExecute.model.dateTimeBase = new Date();

			CRMControlTaskExecute.model.dateEnd = CRMControlTaskExecute.model.dateTimeBase;

			CRMControlTaskExecute.loadPreferences(function () {

				if (CRMControlTaskExecute.isAllowedRetroactiveHistory !== true) {
					CRMControlTaskExecute.model.dateStart = CRMControlTaskExecute.model.dateTimeBase;
				}

			});

			CRMControlTaskExecute.getResults();
			CRMControlTaskExecute.getMedias();

		};

		helper.loadCRMContext(function () {

			accessRestrictionFactory.getUserRestrictions('history.edit', $rootScope.currentuser.login, function (result) {
				CRMControlTaskExecute.accessRestriction = result || {};
				CRMControlTaskExecute.init();
			});

		});

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance && CRMControlTaskExecute.isNextAction !== true) {
				$modalInstance.dismiss('cancel');
			}
		});
	};
	controllerTaskExecute.$inject = [
		'$rootScope', '$scope', '$filter', '$location', 'TOTVSEvent', 'totvs.app-main-view.Service',
		'crm.legend', 'crm.helper', 'crm.task.helper', 'crm.crm_tar.factory', 'crm.crm_campanha.factory', 'crm.crm_histor_acao.factory', 'crm.crm_param.factory', 'crm.crm_acess_portal.factory'
	];


	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.task.modal.edit', modalTaskEdit);
	index.register.service('crm.task.modal.reopen', modalTaskReopen);
	index.register.service('crm.task.modal.next.action', modalTaskNextAction);
	index.register.service('crm.task.modal.execute', modalTaskExecute);

	index.register.controller('crm.task.execute.control', controllerTaskExecute);
	index.register.controller('crm.task.edit.control', controllerTaskEdit);
});
