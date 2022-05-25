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
	'/dts/crm/js/api/fchcrm1004.js',
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
	'/dts/crm/html/attachment/attachment-type-services.select.js',
	'/dts/crm/html/e-mail/e-mail-services.js',
	'/dts/crm/html/history/history.e-mail.recipient.service.select.js',
	'/dts/crm/html/report/report-services.list.js',
	'/dts/crm/html/report/report-services.edit.js',
	'/dts/crm/html/report/report-services.detail.js',
	'/dts/crm/html/report/report-services.available.js',
	'/dts/crm/html/report/report-services.parameter.js',
	'/dts/crm/html/report/report-services.advanced-search.js',
	'/dts/crm/html/user/user-services.js',
	'/dts/crm/html/expense/expense-services.edit.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';
	var modalHistoryEdit,
		controllerHistoryEdit,
		controllerHistoryEditText;

		// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************

	modalHistoryEdit = function ($rootScope, $modal) {
		this.open = function (params) {

			var scope = $rootScope.$new();

			scope.isModal = true;
			scope.parameters = params;

			if (params && params.history && CRMUtil.isDefined(params.history.num_id)) { // edicao texto e detalhamento
				scope.$modalInstance = $modal.open({
					templateUrl: '/dts/crm/html/history/history.edit.html',
					controller: 'crm.history.edit.text.control as controller',
					backdrop: 'static',
					keyboard: false,
					size: 'lg',
					scope: scope,
					resolve: { parameters: function () { return params; } }
				});
			} else { // registrar acao
				scope.$modalInstance = $modal.open({
					templateUrl: '/dts/crm/html/history/history.edit.html',
					controller: 'crm.history.edit.control as controller',
					backdrop: 'static',
					keyboard: false,
					size: 'lg',
					scope: scope,
					resolve: { parameters: function () { return params; } }
				});
			}

			return scope.$modalInstance.result;
		};
	};
	modalHistoryEdit.$inject = ['$rootScope', '$modal'];

	// *************************************************************************************
	// *** CONTROLLER EDIT
	// *************************************************************************************

	controllerHistoryEdit = function ($rootScope, $scope, $filter, TOTVSEvent, appViewService, $location,
									   historyFactory, campaignFactory, userFactory, accountFactory,
									   helper, historyHelper, attachmentFactory, modalTaskNextAction,
									   modalContactEdit, ticketFactory, modalExpenseEdit, modalRecipientProcessEmail, preferenceFactory, modalAttachmentTypeSelect,
									   attachmentHelper, accessRestrictionFactory, taskFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlHistoryEdit = this,
			parameters = $scope.parameters || {},
			$modalInstance = $scope.$modalInstance || undefined;

		this.name = 'edit';
		this.model = undefined;
		this.defaults = undefined;
		this.accessRestriction = undefined;

		this.campaigns = [];
		this.actions = [];
		this.objectives = [];
		this.results = [];
		this.medias = [];

		this.accounts = [];
		this.contacts = [];
		this.users = [];
		//TODO: Remover;
		this.historys = [];
		this.tickets = [];
		this.opportunities = [];

		this.canOverrideAccount = true;
		this.canOverrideCampaign = true;
		this.canOverrideAction = true;

		this.isAllowedRetroactiveHistory    = false;

		this.isModal = $scope.isModal === true;

		this.group = {
			expenses : { open : false }
		};

		this.files = [];
		this.fileSizeLimit = 0;
		this.isAttachmentType = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.save = function () {

			if (CRMControlHistoryEdit.isInvalidForm()) { return; }

			var i,
				vo = CRMControlHistoryEdit.convertToSave(),
				ttOcorrenciaOrigem,
				historyPostPersist;

			if (!vo) { return; }

			historyPostPersist = function (result) {

				if (!result) { return; }

				if (CRMControlHistoryEdit.model.files) {

					if (CRMControlHistoryEdit.model.files.length > 0) {

						result.log_anexo = true;

						for (i = 0; i < CRMControlHistoryEdit.model.files.length; i++) {
							attachmentFactory.upload(5, result.num_id, CRMControlHistoryEdit.model.files[i]);
						}
					}
				}

				CRMControlHistoryEdit.afterSave(result);
			};

			ttOcorrenciaOrigem = CRMControlHistoryEdit.model.ttOcorrenciaOrigem;
			if (ttOcorrenciaOrigem) {
				historyFactory.getUpdateStatusTicket(ttOcorrenciaOrigem.num_id,
													 vo.ttHistoricoVO.num_id_campanha,
													 vo.ttHistoricoVO.num_id_acao,
													 vo.ttHistoricoVO.num_id_restdo, function (result) {
						if (result.$hasError === true) { return; }

						if (result.l_ok === true) {
							CRMControlHistoryEdit.updateChangeTicketStatus = true;
						}
					});
			}

			historyFactory.create_v1(vo, function (result) {
				if (result && result.length > 0){
					result = result[0];
				}

				result.ttResultado = CRMControlHistoryEdit.model.ttResultado || result.ttResultado;

				for(i=0; i < vo.ttTextoVO.length; i++) {
					result.dsl_histor_acao = result.dsl_histor_acao + vo.ttTextoVO[i].dsl_histor_acao;
				}

				historyPostPersist(result);

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-history', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-save-history', [
						result.num_id, result.ttAcao.nom_acao
					], 'dts/crm')
				});
			});

		};

		this.cancel = function () {
			CRMControlHistoryEdit.closeView();
		};

		this.closeView = function (history) {
			if ($modalInstance) {
				if (history) {
					$modalInstance.close(history);
				} else {
					$modalInstance.dismiss('cancel');
				}
			} else {

				// Legacy...
				var view = {
					active: true,
					name: $rootScope.i18n('nav-history', [], 'dts/crm'),
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
				related,
				rootRelated,
				history = CRMControlHistoryEdit.model || {};

			history.initialHour = {};

			now = new Date();

			history.initialHour.start = $filter('date')(now, 'HH:mm');

			now.setHours(now.getHours() + 1);
			history.initialHour.end = $filter('date')(now, 'HH:mm');

			history.initialDate = {
				start	: new Date().getTime(),
				end		: new Date().getTime()
			};

			history.dateTimeBase = new Date();

			history.dateEnd = history.dateTimeBase;

			if (CRMControlHistoryEdit.isAllowedRetroactiveHistory !== true) {
				history.dateStart = history.dateTimeBase;
			}

			// START - Parse Relateds

			rootRelated = history.ttOcorrenciaOrigem || history.ttOportunidadeOrigem || {};

			related = history.ttTarefaOrigem || history.ttHistoricoOrigem || undefined;

			if (CRMUtil.isUndefined(related)) {
				related = rootRelated;
			}

			if (!(history.ttConta && history.ttConta.num_id)) {
				history.ttConta = related.ttConta;
			}

			history.ttContato = related.ttContato;

			history.ttCampanha = related.ttCampanha;
			history.ttAcao = related.ttAcao;

			parameters = parameters || {};

			if (CRMUtil.isUndefined(parameters.canOverrideAccount)) {
				parameters.canOverrideAccount = !(history.ttConta && history.ttConta.num_id);
			}

			if (CRMUtil.isUndefined(parameters.canOverrideCampaign)) {
				parameters.canOverrideCampaign = !(history.ttCampanha && history.ttCampanha.num_id);
			}
            
			if (CRMUtil.isUndefined(parameters.canOverrideTicket)) {
				parameters.canOverrideTicket = true;
			}            

			// END - Parse Relateds

			if (history.ttConta && history.ttConta.num_id) {
				CRMControlHistoryEdit.defaults.num_id_pessoa = history.ttConta.num_id;
			}

			if (history.ttContato && history.ttContato.num_id) {
				CRMControlHistoryEdit.defaults.num_id_contat = history.ttContato.num_id;
			}

			if (history.ttCampanha && history.ttCampanha.num_id) {

				CRMControlHistoryEdit.defaults.num_id_campanha = history.ttCampanha.num_id;

				if (history.ttAcao && history.ttAcao.num_id) {
					CRMControlHistoryEdit.defaults.num_id_acao = history.ttAcao.num_id;
				}

				if (history.ttResultado && history.ttResultado.num_id) {
					CRMControlHistoryEdit.defaults.num_id_restdo = history.ttResultado.num_id;
				}

				if (history.ttMidia && history.ttMidia.num_id) {
					CRMControlHistoryEdit.defaults.num_id_mid = history.ttMidia.num_id;
				}
			}

			//valida permissao campanha
			if (related.ttCampanha && related.ttAcao) {
				historyFactory.hasCampaignPermission(related.ttCampanha.num_id, related.ttAcao.num_id, function (result) {
					if (result == false && parameters.canOverrideCampaign == false){
						// usuario n tem permissao a campanha e n pode alterar a campanha, entao n pode registrar a acao

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'error',
							title: $rootScope.i18n('l-history', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-error-permission-campaign-history', [
							], 'dts/crm')
						});

						CRMControlHistoryEdit.closeView();
					}
				});
			}

		};

		this.validateParameters = function () {

			if (CRMControlHistoryEdit.defaults.num_id_pessoa) {
				CRMControlHistoryEdit.canOverrideAccount = CRMControlHistoryEdit.defaults.num_id_pessoa <= 0;
			} else {
				CRMControlHistoryEdit.canOverrideAccount = parameters.canOverrideAccount || true;
			}

			if (CRMControlHistoryEdit.defaults.num_id_campanha) {
				CRMControlHistoryEdit.canOverrideCampaign = CRMControlHistoryEdit.defaults.num_id_campanha <= 0;
			} else {
				CRMControlHistoryEdit.canOverrideCampaign = parameters.canOverrideCampaign || true;
			}

			if (CRMUtil.isDefined(parameters.canOverrideAction)) {
				CRMControlHistoryEdit.canOverrideAction = parameters.canOverrideAction === true;
			} else {
				CRMControlHistoryEdit.canOverrideAction = true;
			}

			if (CRMControlHistoryEdit.defaults.dsl_histor_acao && CRMControlHistoryEdit.defaults.dsl_histor_acao.length > 0) {
				CRMControlHistoryEdit.model.dsl_histor_acao = CRMControlHistoryEdit.defaults.dsl_histor_acao;
			}
            
            CRMControlHistoryEdit.canOverrideTicket = parameters.canOverrideTicket || true;
		};

		this.loadPreferences = function (callback) {

			var count = 0,
				total = 3;

			historyFactory.isAllowedRetroactiveHistory(function (result) {
				CRMControlHistoryEdit.isAllowedRetroactiveHistory = result;
				if (++count === total && callback) { callback(); }
			});

			attachmentFactory.getParamSizeLimit(function (result) {
				CRMControlHistoryEdit.fileSizeLimit = result || 0;
				if (++count === total && callback) { callback(); }
			});

			attachmentFactory.isAttachmentType(function (result) {
				CRMControlHistoryEdit.isAttachmentType = result;
				if (++count === total && callback) { callback(); }
			});
		};

		this.getAccounts = function (value) {
			if (!value || value === '') { return []; }
			var filter = { property: 'nom_razao_social', value: helper.parseStrictValue(value) };
			accountFactory.typeahead(filter, undefined, function (result) {
				CRMControlHistoryEdit.accounts = result;
			});
		};

		this.getContacts = function () {

			CRMControlHistoryEdit.model.ttContato = undefined;

			if (!CRMControlHistoryEdit.model.ttConta) { return []; }

			accountFactory.getContacts(CRMControlHistoryEdit.model.ttConta.num_id, function (result) {

				CRMControlHistoryEdit.contacts = result || [];

				var i, contact, contactDefault, contactToSelect;

				for (i = 0; i < CRMControlHistoryEdit.contacts.length; i++) {

					contact = CRMControlHistoryEdit.contacts[i];

					if (CRMControlHistoryEdit.defaults.num_id_contat > 0
							&& CRMControlHistoryEdit.defaults.num_id_contat === contact.num_id) {
						contactToSelect = contact;
						break;
					}

					if (CRMControlHistoryEdit.contacts.length === 1) {
						contactToSelect = contact;
						break;
					}

					if (contact.log_default === true) {
						contactDefault = contact;
					}
				}

				CRMControlHistoryEdit.model.ttContato = contactToSelect || contactDefault;
			});
		};

		this.getCampaigns = function () {

			campaignFactory.getAllCampaigns(true, $rootScope.currentuser.idCRM, function (result) {

				CRMControlHistoryEdit.campaigns = result || [];

				if (!result || result.length === 0) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'warning',
						title: $rootScope.i18n('l-history', [], 'dts/crm'),
						detail: 'Usuário não possui acesso a nehuma campanha!'
					});
					return;
				}

				var i,
					campaign,
					campaignToSelect;

				for (i = 0; i < CRMControlHistoryEdit.campaigns.length; i++) {

					campaign = CRMControlHistoryEdit.campaigns[i];

					if (CRMControlHistoryEdit.defaults.num_id_campanha > 0) {
						if (CRMControlHistoryEdit.defaults.num_id_campanha === campaign.num_id) {
							campaignToSelect = campaign;
							break;
						}
					} else if (CRMControlHistoryEdit.campaigns.length === 1) {
						campaignToSelect = campaign;
						break;
					}
				}

				if (campaignToSelect) {
					CRMControlHistoryEdit.model.ttCampanha = campaignToSelect;
					CRMControlHistoryEdit.onChangeCampaign();
				} else if (CRMControlHistoryEdit.defaults.num_id_campanha > 0) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'warning',
						title: $rootScope.i18n('l-history', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-not-found-campaign-user', [], 'dts/crm')
					});
					return;
				}
			});

		};

		this.getActions = function () {

			CRMControlHistoryEdit.model.ttAcao = undefined;
			CRMControlHistoryEdit.model.ttResultado = undefined;
			CRMControlHistoryEdit.model.ttMidia = undefined;

			if (!CRMControlHistoryEdit.model.ttCampanha) { return []; }

			campaignFactory.getAllActions(CRMControlHistoryEdit.model.ttCampanha.num_id,
										  $rootScope.currentuser.idCRM,
										  function (result) {

					CRMControlHistoryEdit.actions = result || [];

					var i,
						action,
						actionToSelect;

					for (i = 0; i < CRMControlHistoryEdit.actions.length; i++) {

						action = CRMControlHistoryEdit.actions[i];

						if (CRMControlHistoryEdit.defaults.num_id_acao > 0) {
							if (CRMControlHistoryEdit.defaults.num_id_acao === action.num_id) {
								actionToSelect = action;
								break;
							}
						} else if (action.log_acao_default === true  || CRMControlHistoryEdit.actions.length === 1) {
							actionToSelect = action;
							break;
						}
					}

					if (actionToSelect) {
						CRMControlHistoryEdit.model.ttAcao = actionToSelect;
						CRMControlHistoryEdit.onChangeAction();
					}
				});
		};

		this.getMedias = function () {

			CRMControlHistoryEdit.model.ttMidia = undefined;

			if (!CRMControlHistoryEdit.model.ttCampanha || !CRMControlHistoryEdit.model.ttAcao) { return []; }

			campaignFactory.getAllMedias(CRMControlHistoryEdit.model.ttCampanha.num_id, CRMControlHistoryEdit.model.ttAcao.num_id, function (result) {

				CRMControlHistoryEdit.medias = result || [];

				var i,
					media,
					mediaToSelect;

				for (i = 0; i < CRMControlHistoryEdit.medias.length; i++) {

					media = CRMControlHistoryEdit.medias[i];

					if (CRMControlHistoryEdit.defaults.num_id_mid > 0) {
						if (CRMControlHistoryEdit.defaults.num_id_mid === media.num_id) {
							mediaToSelect = media;
							break;
						}
					} else if (media.log_mid_default === true || CRMControlHistoryEdit.medias.length === 1) {
						mediaToSelect = media;
						break;
					}
				}

				if (mediaToSelect) {
					CRMControlHistoryEdit.model.ttMidia = mediaToSelect;
				}
			});
		};

		this.getResults = function () {

			CRMControlHistoryEdit.model.ttResultado = undefined;

			if (!CRMControlHistoryEdit.model.ttCampanha || !CRMControlHistoryEdit.model.ttAcao) { return []; }

			campaignFactory.getAllResults(CRMControlHistoryEdit.model.ttCampanha.num_id, CRMControlHistoryEdit.model.ttAcao.num_id, function (data) {

				CRMControlHistoryEdit.results = data || [];

				var i,
					result,
					resultToSelect;

				for (i = 0; i < CRMControlHistoryEdit.results.length; i++) {

					result = CRMControlHistoryEdit.results[i];

					if (CRMControlHistoryEdit.defaults.num_id_restdo > 0) {
						if (CRMControlHistoryEdit.defaults.num_id_restdo === result.num_id) {
							resultToSelect = result;
							break;
						}
					} else if (result.log_restdo_default === true || CRMControlHistoryEdit.results.length === 1) {
						resultToSelect = result;
						break;
					}
				}

				if (resultToSelect) {
					CRMControlHistoryEdit.model.ttResultado = resultToSelect;
					CRMControlHistoryEdit.onChangeResult();
				}
			});
		};

		this.getResultDetails = function () {

			CRMControlHistoryEdit.model.ttDetalhamento = undefined;

			if (!CRMControlHistoryEdit.model.ttResultado) { return []; }

			campaignFactory.getAllDetails(CRMControlHistoryEdit.model.ttResultado.num_id, function (result) {

				CRMControlHistoryEdit.details = result || [];

				if (CRMControlHistoryEdit.details.length === 1) {
					CRMControlHistoryEdit.model.ttDetalhamento = CRMControlHistoryEdit.details[0];
				}
			});
		};

		this.onChangeAccount = function (selected) {
			if (selected) {
				CRMControlHistoryEdit.model.ttConta = selected;
			}
			CRMControlHistoryEdit.getContacts();
		};

		this.onChangeCampaign = function () {
			CRMControlHistoryEdit.model.ttAcaoTipDespes = [];

			CRMControlHistoryEdit.getActions();
		};

		this.onChangeAction = function () {
			CRMControlHistoryEdit.model.ttAcaoTipDespes = [];

			CRMControlHistoryEdit.getResults();
			CRMControlHistoryEdit.getMedias();
		};

		this.onChangeResult = function () {
			CRMControlHistoryEdit.getResultDetails();
		};

		this.isInvalidForm = function () {

			var i,
				expenseDate,
				startDate,
				endDate,
				expenses,
				message,
				messages = [],
				isInvalidForm = false,
				isValidTimeRange;

			if (!CRMControlHistoryEdit.model.initialDate) {
				isInvalidForm = true;
				messages.push('l-date');
			}

			if (CRMControlHistoryEdit.model.initialDate && !CRMControlHistoryEdit.model.initialDate.start) {
				isInvalidForm = true;
				messages.push('l-date-start');
			}

			if (CRMControlHistoryEdit.model.initialDate && !CRMControlHistoryEdit.model.initialDate.end) {
				isInvalidForm = true;
				messages.push('l-date-end');
			}

			if (!CRMControlHistoryEdit.model.initialHour) {
				isInvalidForm = true;
				messages.push('l-time');
			}

			if ((CRMControlHistoryEdit.model.initialHour && !CRMControlHistoryEdit.model.initialHour.start)
					|| (CRMControlHistoryEdit.model.initialHour.start.length === 0)) {
				isInvalidForm = true;
				messages.push('l-time');
			}

			if ((CRMControlHistoryEdit.model.initialHour && !CRMControlHistoryEdit.model.initialHour.end)
					|| CRMControlHistoryEdit.model.initialHour.end.length === 0) {
				isInvalidForm = true;
				messages.push('l-time');
			}

			if (!CRMControlHistoryEdit.model.dsl_histor_acao || CRMControlHistoryEdit.model.dsl_histor_acao.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-description');
			}

			if (!CRMControlHistoryEdit.model.ttConta) {
				isInvalidForm = true;
				messages.push('l-account');
			}

			if (!CRMControlHistoryEdit.model.ttCampanha) {
				isInvalidForm = true;
				messages.push('l-campaign');
			}

			if (!CRMControlHistoryEdit.model.ttAcao) {
				isInvalidForm = true;
				messages.push('l-action');
			}

			if (!CRMControlHistoryEdit.model.ttMidia) {
				isInvalidForm = true;
				messages.push('l-media');
			}

			if (!CRMControlHistoryEdit.model.ttResultado) {
				isInvalidForm = true;
				messages.push('l-result');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-history', messages);
			}

			if (!isInvalidForm) {

				isValidTimeRange = helper.validateTimeRange(
					CRMControlHistoryEdit.model.initialDate,
					CRMControlHistoryEdit.model.initialHour,
					CRMControlHistoryEdit.model.dateTimeBase || new Date()
				);

				if (isValidTimeRange > -1) {

					/*Conforme conversado com o analista, no resgistro de ação deve considerar somente a data, o horario pode ser retroativo marcado o parametro ou não.*/
					/*if (isValidTimeRange === 0 && CRMControlHistoryEdit.isAllowedRetroactiveHistory !== true) {
						message = 'msg-period-before-record';
					} else */

					if (isValidTimeRange === 1) {
						message = 'msg-period-start-after-end';
						isInvalidForm = true;
					} else if (isValidTimeRange === 2) {
						message = 'msg-period-end-before-start';
						isInvalidForm = true;
					}
				}
			}

			if (!isInvalidForm && CRMUtil.isDefined(CRMControlHistoryEdit.model.ttAcaoTipDespes)) {
				expenses = this.convertToSaveExpense(CRMControlHistoryEdit.model.ttAcaoTipDespes);

				startDate = new Date(CRMControlHistoryEdit.model.initialDate.start);
				endDate = new Date(CRMControlHistoryEdit.model.initialDate.end);

				for (i = 0; i < expenses.length; i++) {
					expenseDate = new Date(expenses[i].dat_livre_1);

					if (helper.equalsDate(expenseDate, startDate, true) === -1) {
						message = 'msg-expanse-date-less-than-start-date';
						isInvalidForm = true;
						break;
					}

					if (helper.equalsDate(endDate, expenseDate, true) === -1) {
						message = 'msg-expanse-date-excced-end-date';
						isInvalidForm = true;
						break;
					}
				}
			}

			if (message) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n('l-history', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [], 'dts/crm')
				});
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var i, start = 0, count = 1, limit = 2000,
				vo = {
					ttHistoricoVO: {},
					ttTextoVO: [],
					dsl_recipients: [],
					dsl_mail_body: {}
				};

			while (start < CRMControlHistoryEdit.model.dsl_histor_acao.length) {
				if ((CRMControlHistoryEdit.model.dsl_histor_acao.length - start) > limit) {
					vo.ttTextoVO.push({
						dsl_histor_acao: CRMControlHistoryEdit.model.dsl_histor_acao.substr(start, limit),
						seq: count
					});
				} else {
					vo.ttTextoVO.push({
						dsl_histor_acao: CRMControlHistoryEdit.model.dsl_histor_acao.substr(start),
						seq: count
					});	
				}
				count++;
				start = start + limit;
			};				

			vo.ttHistoricoVO.dat_inic = CRMControlHistoryEdit.model.initialDate.start;
			vo.ttHistoricoVO.hra_inic = CRMControlHistoryEdit.model.initialHour.start;

			vo.ttHistoricoVO.dat_fim  = CRMControlHistoryEdit.model.initialDate.end;
			vo.ttHistoricoVO.hra_fim  = CRMControlHistoryEdit.model.initialHour.end;

			if (CRMControlHistoryEdit.model.dateTimeBase) {
				vo.ttHistoricoVO.dat_cadastro = CRMControlHistoryEdit.model.dateTimeBase.getTime();
				vo.ttHistoricoVO.hra_cadastro = $filter('date')(CRMControlHistoryEdit.model.dateTimeBase, 'HH:mm');
			} else {
				vo.ttHistoricoVO.dat_cadastro = CRMControlHistoryEdit.model.dat_cadastro;
				vo.ttHistoricoVO.hra_cadastro = CRMControlHistoryEdit.model.hra_cadastro;
			}

			vo.ttHistoricoVO.num_id_usuar = $rootScope.currentuser.idCRM;

			if (CRMControlHistoryEdit.model.ttConta) {
				vo.ttHistoricoVO.num_id_pessoa = CRMControlHistoryEdit.model.ttConta.num_id;
			}

			if (CRMControlHistoryEdit.model.ttContato) {
				vo.ttHistoricoVO.num_id_contat = CRMControlHistoryEdit.model.ttContato.num_id;
			}

			if (CRMControlHistoryEdit.model.ttCampanha) {
				vo.ttHistoricoVO.num_id_campanha = CRMControlHistoryEdit.model.ttCampanha.num_id;
			}

			if (CRMControlHistoryEdit.model.ttAcao) {
				vo.ttHistoricoVO.num_id_acao = CRMControlHistoryEdit.model.ttAcao.num_id;
			}

			if (CRMControlHistoryEdit.model.ttMidia) {
				vo.ttHistoricoVO.num_id_mid = CRMControlHistoryEdit.model.ttMidia.num_id;
			}

			if (CRMControlHistoryEdit.model.ttResultado) {
				vo.ttHistoricoVO.num_id_restdo = CRMControlHistoryEdit.model.ttResultado.num_id;
			}

			if (CRMControlHistoryEdit.model.ttDetalhamento) {
				vo.ttHistoricoVO.num_id_detmnto = CRMControlHistoryEdit.model.ttDetalhamento.num_id;
			}

			if (CRMControlHistoryEdit.model.ttOcorrenciaOrigem) {
				vo.ttHistoricoVO.num_id_ocor = CRMControlHistoryEdit.model.ttOcorrenciaOrigem.num_id;
			}

			if (CRMControlHistoryEdit.model.ttTarefaOrigem) {
				vo.ttHistoricoVO.num_id_tar = CRMControlHistoryEdit.model.ttTarefaOrigem.num_id;
			}

			if (CRMControlHistoryEdit.model.ttOportunidadeOrigem) {
				vo.ttHistoricoVO.num_id_oportun = CRMControlHistoryEdit.model.ttOportunidadeOrigem.num_id;
			}

			vo.ttHistoricoVO.log_mov_ticket = true;

			/* Despesas realizadas */
			vo.ttAcaoTipDespesVO = this.convertToSaveExpense(CRMControlHistoryEdit.model.ttAcaoTipDespes);

			/* notificacao email */


			if (angular.isArray(CRMControlHistoryEdit.model.to) && !CRMControlHistoryEdit.model.num_id) {
				vo.dsl_recipients = [];
				vo.dsl_mail_body = '';
				for (i = 0; CRMControlHistoryEdit.model.to.length > i; i++) {
					vo.dsl_recipients.push(CRMControlHistoryEdit.model.to[i].nom_email);
				}
			}

			return vo;
		};

		this.convertToSaveExpense = function (expenses) {
			if (expenses === undefined || expenses.length < 1) { return []; }

			var i,
				ttExpenseVO = [];

			for (i = 0; i < expenses.length; i++) {
				ttExpenseVO.push(expenses[i].vo);
			}

			return ttExpenseVO;
		};

		this.afterSave = function (history) {
			var ttOcorrenciaOrigem,
				ttOportunidadeOrigem,
				afterNextActions = function(isLoadTask) {
					if (isLoadTask === true){
						$rootScope.$broadcast(CRMEvent.scopeLoadTaskIsChild);
					}
				};
	

			$rootScope.$broadcast(CRMEvent.scopeSaveHistory, history);

			ttOcorrenciaOrigem = CRMControlHistoryEdit.model.ttOcorrenciaOrigem;

			if (CRMControlHistoryEdit.updateChangeTicketStatus === true) {
				$rootScope.$broadcast(CRMEvent.scopeSaveHistoryOnChangeTicketStatus, ttOcorrenciaOrigem);
			}

			if (ttOcorrenciaOrigem) {
				if (ttOcorrenciaOrigem.isNew === true) { $rootScope.$broadcast(CRMEvent.scopeSaveHistoryOnPersistTicket, history); }
			}

			ttOportunidadeOrigem = CRMControlHistoryEdit.model.ttOportunidadeOrigem;
			if (ttOportunidadeOrigem) {
				$rootScope.$broadcast(CRMEvent.scopeSaveHistoryOpportunity, ttOportunidadeOrigem.num_id);
			}

			campaignFactory.getAllResultActions(history.num_id_campanha, history.num_id_acao,
												history.num_id_restdo, function (result) {

					var loadTasks = result ? result.hasAutomaticNextAction : false;

					if (!result || !result.ttProximaAcao || result.ttProximaAcao.length === 0) {
						CRMControlHistoryEdit.closeView(history, result.hasAutomaticNextAction);
						afterNextActions(loadTasks);
					} else {

						result.ttProximaAcao = result.ttProximaAcao.sort(function (item1, item2) {
							return item1.num_ord_acao - item2.num_ord_acao;
						});

						modalTaskNextAction.open({
							task : {
								ttHistoricoOrigem : history,
								ttTarefaOrigem : history.ttTarefaOrigem,
								ttOcorrenciaOrigem : history.ttOcorrenciaOrigem,
								ttOportunidadeOrigem : history.ttOportunidadeOrigem
							},
							resultActions : angular.copy(result.ttProximaAcao)
						});
						
						afterNextActions(loadTasks);
						CRMControlHistoryEdit.closeView(history);

					}
				});
		};

		this.newAccountContact = function () {
			modalContactEdit.open({
				related: CRMControlHistoryEdit.model.ttConta
			}).then(function (result) {
				if (CRMUtil.isDefined(result)) {
					CRMControlHistoryEdit.contacts = CRMControlHistoryEdit.contacts || [];
					CRMControlHistoryEdit.contacts.push(result);
					CRMControlHistoryEdit.model.ttContato = result;
				}
			});
		};

		this.addExpense = function () {
			var listOfExpense = CRMControlHistoryEdit.model.ttAcaoTipDespes || [],
				campaign = CRMControlHistoryEdit.model.ttCampanha,
				action = CRMControlHistoryEdit.model.ttAcao,
				period = {};

			if ((CRMUtil.isUndefined(campaign) || CRMUtil.isUndefined(campaign.num_id)) || (CRMUtil.isUndefined(action) || CRMUtil.isUndefined(action.num_id))) {
				return;
			}

			if (CRMControlHistoryEdit.model.initialDate && CRMControlHistoryEdit.model.initialDate.start) {
				period.startDate = CRMControlHistoryEdit.model.initialDate.start;
			}

			if (CRMControlHistoryEdit.model.initialDate && CRMControlHistoryEdit.model.initialDate.end) {
				period.endDate = CRMControlHistoryEdit.model.initialDate.end;
			}

			modalExpenseEdit.open({
				campaignId: campaign.num_id,
				actionId: action.num_id,
				period: period,
				notPersist: true,
				expense: {idi_status_despes: 2} // 1 previsto, 2 realizado
			}).then(function (results) {
				results = results || [];
				listOfExpense = listOfExpense.concat(results);
				CRMControlHistoryEdit.model.ttAcaoTipDespes = listOfExpense;
			});
		};

		this.removeExpense = function (index) {
			if (index >= 0) {
				CRMControlHistoryEdit.model.ttAcaoTipDespes.splice(index, 1);
			}
		};

		this.addEmailsSugestion = function () {

			var historyAction = this.model;

			modalRecipientProcessEmail.open({
				model: historyAction
			}).then(function (result) {

				if (!result || result.length === 0) { return; }

				historyAction.to = result;

			});
		};

		this.addEmail = function (email) {
			var emailPattern = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

			if (emailPattern.test(email.nom_email)) {
				return true;
			} else {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n('l-history', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-invalid-email', [email.nom_email], 'dts/crm')
				});
				return false;
			}
		};

		CRMControlHistoryEdit.onSelectFiles = function ($files) {

			var	file,
				i,
				canUpload;

			if (!CRMControlHistoryEdit.model.files) {
				CRMControlHistoryEdit.model.files = [];
			}

			for (i = 0; i < $files.length; i += 1) {
				file = $files[i];
				canUpload = true;

				if (attachmentHelper.fileAlreadyExistInSelectedList(CRMControlHistoryEdit.model.files, file.name)) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'warning',
						title: $rootScope.i18n('nav-history', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-file-already-exist', [file.name], 'dts/crm')
					});
					canUpload = false;
				} else if (CRMControlHistoryEdit.fileSizeLimit > 0) {
					canUpload = helper.validateUploadLimitFileSize('nav-history', file.name, file.size, CRMControlHistoryEdit.fileSizeLimit);
				}
				if (canUpload) {
					CRMControlHistoryEdit.model.files.push(file);
				} else {
					CRMControlHistoryEdit.model.file = null;
				}
			}

			if (CRMControlHistoryEdit.isAttachmentType && $files.length > 0) {
				modalAttachmentTypeSelect.open(
					CRMControlHistoryEdit.model.files
				).then(function (result) {

					CRMControlHistoryEdit.model.files = result.selectedFiles;

				});
			}
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		CRMControlHistoryEdit.model = parameters.history ? angular.copy(parameters.history) : {};
		CRMControlHistoryEdit.defaults = parameters.defaults || {};

		$rootScope.$broadcast(CRMEvent.scopeFileSelectAddUpdHistory, false);

		if (CRMControlHistoryEdit.isModal !== true) {
			appViewService.startView($rootScope.i18n('nav-history', [], 'dts/crm'), 'crm.history.edit.control', CRMControlHistoryEdit);
		}

		helper.loadCRMContext(function () {

			accessRestrictionFactory.getUserRestrictions('history.edit', $rootScope.currentuser.login, function (result) {
				CRMControlHistoryEdit.accessRestriction = result || {};

				CRMControlHistoryEdit.loadPreferences(function () {

					CRMControlHistoryEdit.validadeParameterModel();
					CRMControlHistoryEdit.validateParameters();

					if (CRMControlHistoryEdit.canOverrideCampaign !== true && CRMControlHistoryEdit.canOverrideAction !== true) {
						CRMControlHistoryEdit.onChangeAction();
					} else {
						CRMControlHistoryEdit.getCampaigns();
					}

					CRMControlHistoryEdit.getContacts();
				});
			});

		});

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			$rootScope.$broadcast(CRMEvent.scopeFileSelectAddUpdHistory, true);
			CRMControlHistoryEdit = undefined;
		});

	};
	controllerHistoryEdit.$inject = [
		'$rootScope', '$scope', '$filter', 'TOTVSEvent', 'totvs.app-main-view.Service', '$location',
		'crm.crm_histor_acao.factory', 'crm.crm_campanha.factory', 'crm.crm_usuar.factory',
		'crm.crm_pessoa.conta.factory', 'crm.helper', 'crm.history.helper', 'crm.crm_anexo.factory',
		'crm.task.modal.next.action', 'crm.account-contact.modal.edit', 'crm.crm_ocor.factory',
		'crm.expense.modal.edit', 'crm.recipient-process-email.modal', 'crm.crm_param.factory',
		'crm.attachment-type.select.modal.control', 'crm.attachment.helper', 'crm.crm_acess_portal.factory',
		'crm.crm_tar.factory'
	];

	controllerHistoryEditText = function ($rootScope, $scope, $filter, TOTVSEvent, appViewService, $location,
										   historyFactory, campaignFactory, userFactory, accountFactory, helper,
										   historyHelper, modalContactEdit, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlHistoryEditText = this,
			parameters = $scope.parameters || {},
			$modalInstance = $scope.$modalInstance || undefined;

		this.accessRestriction = undefined;
		this.name = 'edit text';
		this.model = undefined;
		this.isModal = $scope.isModal === true;

		this.medias = [];
		this.contacts = [];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.save = function () {

			if (CRMControlHistoryEditText.isInvalidForm()) { return; }

			var i, vo = CRMControlHistoryEditText.convertToSave(),
				historyPostPersist;

			if (!vo || !vo.ttHistoricoVO) { return; }

			historyPostPersist = function (result) {
				if (!result) { return; }
				CRMControlHistoryEditText.afterSave(result);
			};
			
			historyFactory.update_v1(vo.ttHistoricoVO.num_id, vo, function (result) {
				if (result && result.length > 0){
					result = result[0];
				}

				for(i=0; i < vo.ttTextoVO.length; i++) {
					result.dsl_histor_acao = result.dsl_histor_acao + vo.ttTextoVO[i].dsl_histor_acao;
				}

				historyPostPersist(result);

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-history', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-update-history', [
						result.num_id, result.ttAcao.nom_acao
					], 'dts/crm')
				});
			});

		};

		this.cancel = function () {
			CRMControlHistoryEditText.closeView();
		};

		this.closeView = function (history) {
			if ($modalInstance) {
				if (history) {
					$modalInstance.close(history);
				} else {
					$modalInstance.dismiss('cancel');
				}
			} else {

				// Legacy...
				var view = {
					active: true,
					name: $rootScope.i18n('nav-history', [], 'dts/crm'),
					url: $location.url()
				};

				if (angular.isFunction(appViewService.getPageActive)) {
					view = appViewService.getPageActive();
				}

				appViewService.removeView(view);
			}
		};

		this.getResultDetails = function () {
			var i;

			if (!CRMControlHistoryEditText.model.ttResultado) { return []; }

			campaignFactory.getAllDetails(CRMControlHistoryEditText.model.ttResultado.num_id, function (result) {

				CRMControlHistoryEditText.details = result || [];

				if (CRMControlHistoryEditText.model.num_id_detmnto > 0) {
					for (i = 0; i < CRMControlHistoryEditText.details.length; i++) {
						if (CRMControlHistoryEditText.details[i].num_id === CRMControlHistoryEditText.model.num_id_detmnto) {
							CRMControlHistoryEditText.model.ttDetalhamento = CRMControlHistoryEditText.details[i];
							break;
						}
					}
				}
			});
		};

		this.getMedias = function () {

			CRMControlHistoryEditText.model.ttMidia = undefined;

			if (!CRMControlHistoryEditText.model.ttCampanha || !CRMControlHistoryEditText.model.ttAcao) { return []; }

			campaignFactory.getAllMedias(CRMControlHistoryEditText.model.ttCampanha.num_id, CRMControlHistoryEditText.model.ttAcao.num_id, function (result) {

				CRMControlHistoryEditText.medias = result || [];

				var i;

				if (CRMControlHistoryEditText.model.num_id_mid > 0) {
					for (i = 0; i < CRMControlHistoryEditText.medias.length; i++) {
						if (CRMControlHistoryEditText.model.num_id_mid === CRMControlHistoryEditText.medias[i].num_id) {
							CRMControlHistoryEditText.model.ttMidia = CRMControlHistoryEditText.medias[i];
							break;
						}
					}
				}
			});
		};

		/*
		this.getContact = function () {
			if (!CRMControlHistoryEditText.model.num_id_contat) { return []; }

			accountFactory.getSummary(CRMControlHistoryEditText.model.num_id_contat, function (result) {
				CRMControlHistoryEditText.ttContato = result || {};
			});
		};
		*/
		this.getDescription = function () {
			historyFactory.getDescription(CRMControlHistoryEditText.model.num_id, function (result) {
				CRMControlHistoryEditText.model.dsl_histor_acao = result.dsl_histor_acao;
			});
		};

		this.getAccountContacts = function () {

			//CRMControlHistoryEditText.model.ttContato = undefined;

			if (!CRMControlHistoryEditText.model.ttConta) { return []; }

			accountFactory.getContacts(CRMControlHistoryEditText.model.ttConta.num_id, function (result) {

				CRMControlHistoryEditText.contacts = result || [];

				var i;

				if (CRMControlHistoryEditText.model.num_id_contat > 0) {
					for (i = 0; i < CRMControlHistoryEditText.contacts.length; i++) {
						if (CRMControlHistoryEditText.model.num_id_contat === CRMControlHistoryEditText.contacts[i].num_id) {
							CRMControlHistoryEditText.ttContato = CRMControlHistoryEditText.contacts[i];
							break;
						}
					}
				}

				//console.log(CRMControlHistoryEditText.ttContato, CRMControlHistoryEditText.contacts, CRMControlHistoryEditText.model.num_id_contat);
			});
		};

		this.newAccountContact = function () {
			modalContactEdit.open({
				related: CRMControlHistoryEditText.model.ttConta
			}).then(function (result) {
				if (CRMUtil.isDefined(result)) {
					CRMControlHistoryEditText.contacts = CRMControlHistoryEditText.contacts || [];
					CRMControlHistoryEditText.contacts.push(result);
					CRMControlHistoryEditText.model.ttContato = result;
				}
			});
		};

		this.isInvalidForm = function () {
			var message,
				messages = [],
				isInvalidForm = false,
				isValidTimeRange;

			if (!CRMControlHistoryEditText.model.dsl_histor_acao || CRMControlHistoryEditText.model.dsl_histor_acao.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-description');
			}

			if (!CRMControlHistoryEditText.model.ttMidia) {
				isInvalidForm = true;
				messages.push('l-media');
			}

			if (!CRMControlHistoryEditText.model.initialDate) {
				isInvalidForm = true;
				messages.push('l-date');
			}

			if (CRMControlHistoryEditText.model.initialDate && !CRMControlHistoryEditText.model.initialDate.start) {
				isInvalidForm = true;
				messages.push('l-date-start');
			}

			if (CRMControlHistoryEditText.model.initialDate && !CRMControlHistoryEditText.model.initialDate.end) {
				isInvalidForm = true;
				messages.push('l-date-end');
			}

			if (!CRMControlHistoryEditText.model.initialHour) {
				isInvalidForm = true;
				messages.push('l-time');
			}

			if ((CRMControlHistoryEditText.model.initialHour && !CRMControlHistoryEditText.model.initialHour.start)
					|| (CRMControlHistoryEditText.model.initialHour.start.length === 0)) {
				isInvalidForm = true;
				messages.push('l-time');
			}

			if ((CRMControlHistoryEditText.model.initialHour && !CRMControlHistoryEditText.model.initialHour.end)
					|| CRMControlHistoryEditText.model.initialHour.end.length === 0) {
				isInvalidForm = true;
				messages.push('l-time');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-history', messages);
			}

			if (!isInvalidForm) {

				isValidTimeRange = helper.validateTimeRange(
					CRMControlHistoryEditText.model.initialDate,
					CRMControlHistoryEditText.model.initialHour,
					CRMControlHistoryEditText.model.dateTimeBase || new Date()
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

			}

			if (message) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n('l-history', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [], 'dts/crm')
				});
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var start = 0, count = 1, limit = 2000,
				vo = {
					ttHistoricoVO: {},
					ttTextoVO: []
				};

			while (start < CRMControlHistoryEditText.model.dsl_histor_acao.length) {
				if ((CRMControlHistoryEditText.model.dsl_histor_acao.length - start) > limit) {
					vo.ttTextoVO.push({
						dsl_histor_acao: CRMControlHistoryEditText.model.dsl_histor_acao.substr(start, limit),
						seq: count
					});
				} else {
					vo.ttTextoVO.push({
						dsl_histor_acao: CRMControlHistoryEditText.model.dsl_histor_acao.substr(start),
						seq: count
					});	
				}
				count++;
				start = start + limit;
			};

			vo.ttHistoricoVO.num_id   = CRMControlHistoryEditText.model.num_id;
			vo.ttHistoricoVO.dat_inic = CRMControlHistoryEditText.model.dat_inic;
			vo.ttHistoricoVO.hra_inic = CRMControlHistoryEditText.model.hra_inic;
			vo.ttHistoricoVO.dat_fim  = CRMControlHistoryEditText.model.dat_fim;
			vo.ttHistoricoVO.hra_fim  = CRMControlHistoryEditText.model.hra_fim;
			vo.ttHistoricoVO.dat_cadastro = CRMControlHistoryEditText.model.dat_cadastro;
			vo.ttHistoricoVO.hra_cadastro = CRMControlHistoryEditText.model.hra_cadastro;
			vo.ttHistoricoVO.num_id_pessoa = CRMControlHistoryEditText.model.num_id_pessoa;
			vo.ttHistoricoVO.num_id_contat = CRMControlHistoryEditText.model.num_id_contat;
			vo.ttHistoricoVO.num_id_campanha = CRMControlHistoryEditText.model.num_id_campanha;
			vo.ttHistoricoVO.num_id_acao = CRMControlHistoryEditText.model.num_id_acao;
			vo.ttHistoricoVO.num_id_mid = CRMControlHistoryEditText.model.num_id_mid;
			vo.ttHistoricoVO.num_id_restdo = CRMControlHistoryEditText.model.num_id_restdo;
			vo.ttHistoricoVO.num_id_ocor = CRMControlHistoryEditText.model.num_id_ocor;
			vo.ttHistoricoVO.num_id_tar = CRMControlHistoryEditText.model.num_id_tar;
			vo.ttHistoricoVO.num_id_oportun = CRMControlHistoryEditText.model.num_id_oportun;
			vo.ttHistoricoVO.num_id_usuar = CRMControlHistoryEditText.model.num_id_usuar;
			vo.ttHistoricoVO.num_id_detmnto = CRMControlHistoryEditText.model.num_id_detmnto;
			vo.ttHistoricoVO.num_id_detmnto = CRMControlHistoryEditText.model.ttDetalhamento ? CRMControlHistoryEditText.model.ttDetalhamento.num_id : 0;
			vo.ttHistoricoVO.num_id_contat = CRMControlHistoryEditText.model.ttContato ? CRMControlHistoryEditText.model.ttContato.num_id : 0;

			if (CRMControlHistoryEditText.model.ttMidia) {
				vo.ttHistoricoVO.num_id_mid = CRMControlHistoryEditText.model.ttMidia.num_id;
			}

			if (CRMControlHistoryEditText.model.initialDate && CRMControlHistoryEditText.model.initialDate.start) {
				vo.ttHistoricoVO.dat_inic = CRMControlHistoryEditText.model.initialDate.start;
				vo.ttHistoricoVO.dat_fim  = CRMControlHistoryEditText.model.initialDate.end;
			}

			if (CRMControlHistoryEditText.model.initialHour && CRMControlHistoryEditText.model.initialHour.start) {
				vo.ttHistoricoVO.hra_inic = CRMControlHistoryEditText.model.initialHour.start;
				vo.ttHistoricoVO.hra_fim  = CRMControlHistoryEditText.model.initialHour.end;
			}

			return vo;
		};

		this.validadeParameterModel = function () {

			var history = CRMControlHistoryEditText.model || {};

			history.initialHour = {};

			if (history.dat_inic && history.dat_fim) {
				history.initialDate = {
					start	: history.dat_inic,
					end		: history.dat_fim
				};
			} else {
				history.initialDate = {
					start	: new Date().getTime(),
					end		: new Date().getTime()
				};
			}

			if (history.hra_inic && history.hra_fim) {
				history.initialHour.start = history.hra_inic;
				history.initialHour.end = history.hra_fim;
			}

			if (CRMControlHistoryEditText.isAllowedRetroactiveHistory !== true) {
				history.dateStart = history.dat_inic;
			}

			history.dateTimeBase = new Date(history.dat_fim);
			history.dateEnd = new Date(history.dat_fim);
		};

		this.loadPreferences = function (callback) {
			var count = 0,
				total = 2;

			historyFactory.isAllowedRetroactiveHistory(function (result) {
				CRMControlHistoryEditText.isAllowedRetroactiveHistory = result;
				if (++count === total && callback) { callback(); }
			});

		};

		this.afterSave = function (history) {
			historyFactory.removeDescriptionCache(history.num_id);
			$rootScope.$broadcast(CRMEvent.scopeChangeHistory, history);
			CRMControlHistoryEditText.closeView(history);
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		CRMControlHistoryEditText.model = parameters.history ? angular.copy(parameters.history) : {};
        CRMControlHistoryEditText.canOverrideTicket = parameters.canOverrideTicket || true;

		if (CRMControlHistoryEditText.isModal !== true) {
			appViewService.startView($rootScope.i18n('nav-history', [], 'dts/crm'), 'crm.history.edit.text.control', CRMControlHistoryEditText);
		}

		helper.loadCRMContext(function () {

			accessRestrictionFactory.getUserRestrictions('history.edit', $rootScope.currentuser.login, function (result) {
				CRMControlHistoryEditText.accessRestriction = result || {};
			});

			CRMControlHistoryEditText.loadPreferences(function () {
				CRMControlHistoryEditText.validadeParameterModel();
			});

			CRMControlHistoryEditText.getMedias();
			CRMControlHistoryEditText.getResultDetails();
			CRMControlHistoryEditText.getAccountContacts();
			CRMControlHistoryEditText.getDescription();
		});

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlHistoryEditText = undefined;
		});

	};
	controllerHistoryEditText.$inject = [
		'$rootScope', '$scope', '$filter', 'TOTVSEvent', 'totvs.app-main-view.Service', '$location', 'crm.crm_histor_acao.factory', 'crm.crm_campanha.factory', 'crm.crm_usuar.factory', 'crm.crm_pessoa.conta.factory', 'crm.helper', 'crm.history.helper', 'crm.account-contact.modal.edit', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.history.modal.edit', modalHistoryEdit);
	index.register.controller('crm.history.edit.control', controllerHistoryEdit);
	index.register.controller('crm.history.edit.text.control', controllerHistoryEditText);
});
