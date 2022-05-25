/*globals index, define, angular, CRMURL, CRMUtil*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-factories.js',
	'/dts/crm/js/api/fchcrm1004.js'
], function (index) {

	'use strict';

	// *************************************************************************************
	// *** HELPER
	// *************************************************************************************

	var helperTask,
		factoryTask;

	helperTask = function (legend) {

		this.filtersGroup = 'totvs.crm.portal.tasks.filters';

		this.taskSummaryConfig = 'totvs.crm.portal.tasks.task-summary.config';

		this.status = [
			{num_id: 1, nom_status: legend.taskStatus.NAME(1), vId: 10},
			{num_id: 2, nom_status: legend.taskStatus.NAME(2), vId: 20},
			{num_id: 3, nom_status: legend.taskStatus.NAME(3), vId: 30}
		];

		this.virtualStatus = [
			{num_id: 1, nom_status: legend.taskStatus.NAME(1),        vId: 10, cor: 'crm-label-yellow'},
			{num_id: 1, nom_status: legend.taskVirtualStatus.NAME(1), vId: 11, cor: 'crm-label-yellow'},
			{num_id: 2, nom_status: legend.taskVirtualStatus.NAME(2), vId: 20, cor: 'crm-label-dark'},
			{num_id: 3, nom_status: legend.taskVirtualStatus.NAME(3), vId: 30, cor: 'crm-label-green'},
			{num_id: 4, nom_status: legend.taskVirtualStatus.NAME(4), vId: 12, cor: 'crm-label-blue'},
			{num_id: 5, nom_status: legend.taskVirtualStatus.NAME(5), vId: 13, cor: 'crm-label-red'}
		];

		this.parseStatus = function (task) {
			if (task) {
				task.idi_status_tar = task.idi_status_tar || 1;
				task.ttStatus = this.status[task.idi_status_tar - 1];

				this.parseVirtualStatus(task);
			}
		};

		this.parseVirtualStatus = function (task) {
			var startAt,
				endsAt;

			if (task.idi_status_tar === 3) {
				task.virtualStatus = angular.copy(this.virtualStatus[3]);
			} else if (task.idi_status_tar === 2) {
				task.virtualStatus = angular.copy(this.virtualStatus[2]);
			} else {
				task.virtualStatus = angular.copy(this.virtualStatus[1]);

				startAt = this.formatDateToEvent(task.dat_inic, task.hra_inic);

				if (startAt > new Date()) {
					task.virtualStatus = angular.copy(this.virtualStatus[4]);
				} else {

					endsAt = this.formatDateToEvent(task.dat_fim, task.hra_fim);

					if (endsAt <= new Date()) {
						task.virtualStatus = angular.copy(this.virtualStatus[5]);
					}
				}
			}
		};

		this.parseRelatedTo = function (task) {

			if (!task || task.dsl_rel) { return; }

			if (task.ttOcorrenciaOrigem && task.ttOcorrenciaOrigem.num_id) {

				task.idi_rel_a = 'l-ticket';
				task.dsl_rel = '<a href="#/dts/crm/ticket/detail/' + task.ttOcorrenciaOrigem.num_id + '">' +
					task.ttOcorrenciaOrigem.cod_livre_1 + ' - ' + task.ttOcorrenciaOrigem.nom_ocor + '</a>';

			} else if (task.ttOportunidadeOrigem && task.ttOportunidadeOrigem.num_id) {

				task.idi_rel_a = 'l-opportunity';
				task.dsl_rel = '<a href="#/dts/crm/opportunity/detail/' + task.ttOportunidadeOrigem.num_id + '">' +
					task.ttOportunidadeOrigem.num_id + ' - ' + task.ttOportunidadeOrigem.des_oportun_vda + '</a>';

			} else if (task.ttTarefaOrigem && task.ttTarefaOrigem.num_id) {

				task.idi_rel_a = 'l-task';
				task.dsl_rel = '<a href="#/dts/crm/task/detail/' + task.ttTarefaOrigem.num_id + '">' +
					task.ttTarefaOrigem.num_id + ' - ' + task.ttTarefaOrigem.nom_acao + '</a>';

			} else if (task.ttHistoricoOrigem && task.ttHistoricoOrigem.num_id) {

				task.idi_rel_a = 'l-history';
				task.dsl_rel = '<a href="#/dts/crm/history/detail/' + task.ttHistoricoOrigem.num_id + '">' +
					task.ttHistoricoOrigem.num_id + ' - ' + task.ttHistoricoOrigem.nom_acao + '</a>';

			}
		};

		this.parseTaskColor = function (task) {

			task.nom_cor = 'crm-task-blue';

			var startAt,
				endsAt;

			if (task.idi_status_tar === 3) {
				task.nom_cor = 'crm-task-green';
			} else if (task.idi_status_tar === 2) {
				task.nom_cor = 'crm-task-dark';
			} else {
				startAt = this.formatDateToEvent(task.dat_inic, task.hra_inic);

				if (startAt > new Date()) {
					task.nom_cor = 'crm-task-blue';
				} else {

					endsAt = this.formatDateToEvent(task.dat_fim, task.hra_fim);

					if (endsAt > new Date()) {
						task.nom_cor = 'crm-task-yellow';
					} else {
						task.nom_cor = 'crm-task-red';
					}
				}
			}
		};

		this.formatDateToEvent = function (date, time) {

			if (!date) { return; }

			if (angular.isString(date) || angular.isNumber(date)) {
				date = new Date(date);
			}

			time = time.split(':');

			var start, end;

			if (time.length > 0) {

				start = time[0].trim();

				if (start.length < 2) {
					start = '0' + start;
				}
			}

			if (time.length > 1) {

				end = time[1].trim();

				if (end.length < 2) {
					end = '0' + end;
				}
			}

			return new Date(date.getFullYear(), date.getMonth(), date.getDate(), start, end);
		};

		this.formatTitleToEvent = function (task) {

			var title = task.num_id;

			if (task.ttAcao) {
				title += ' - ' + task.ttAcao.nom_acao;
			}

			return title;
		};
	};
	helperTask.$inject = ['crm.legend'];

	// *************************************************************************************
	// *** FACTORY
	// *************************************************************************************


	factoryTask = function ($totvsresource, $cacheFactory, factoryGeneric, factoryPreference,
							 factoryGenericZoom, factoryGenericTypeahead, factoryGenericCreateUpdate, factoryGenericDetail, ReportService) {

		var factory,
			cache = $cacheFactory('crm.task.Cache'),
			actions = angular.copy(factoryGenericCreateUpdate.customActions);

		actions.DTSExecuteTaskList = {
			method: 'POST',
			isArray: false,
			url: CRMURL.taskService + ':method/:id/' /*,
			headers: { noCountRequest: true }*/
		};

		factory = $totvsresource.REST(CRMURL.taskService + ':method/:id/:task/:history/:campaign/:action/:result',
			undefined,  actions);

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericTypeahead);
		angular.extend(factory, factoryGenericCreateUpdate);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			if (!options.orderBy) { options.orderBy =  ['num_id']; }
			if (CRMUtil.isUndefined(options.asc)) { options.asc =  [false]; }

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getDescription = function (id, callback) {

			var result = cache.get(id);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSGet({method: 'description', id: id}, function (data) {
					cache.put(id, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.removeDescriptionCache = function (id) {
			cache.remove(id);
		};

		factory.getPhonesToContact = function (accountId, contactId, isNewContact, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'phonesToContact-' + (accountId || 'none') + '-' + (contactId || 'none'),
				result = (isAllowedCache ? cache.get(idCache) : undefined);
				
			if (isNewContact) {
				cache.remove(idCache);
			}

			if (result && !isNewContact) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'phonestocontact', account: accountId, contact: contactId}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.execute = function (id, callback) {
			return this.DTSPost({method: 'execute', id: id}, {}, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.executeTaskList = function (model, callback) {
			return this.DTSExecuteTaskList({method: 'executetasklist'}, model, function (result) {
				if (callback) { callback(result); }
			});
		};


		factory.createAutomaticActions = function (task, history, campaign, action, result, callback) {
			return this.DTSPost({method: 'createautomaticactions', task: task, history: history, campaign: campaign, action: action, result: result}, {}, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.isToNotifyClient = function (callback) {
			return factoryPreference.getPreferenceAsBoolean('LOG_NOTIFICA_CLIENTE', callback);
		};

		factory.isAutoNotify = function (callback) {
			return factoryPreference.getPreferenceAsBoolean('LOG_OBRG_NTFC_TAR', callback);
		};

		factory.isHierarchyAvailableInTask = function (callback) {
			return factoryPreference.getPreferenceAsBoolean('VALID_TIME_TAR', callback);
		};

		factory.isOnlyResponsibleExecuteTask = function (callback, noCache) {
			return factoryPreference.getPreferenceAsBoolean('LOG_RESP_EXEC_TAR', callback, noCache);
		};

		factory.isHistoryActionRequiredAfterExecution = function (callback) {
			return factoryPreference.getPreferenceAsBoolean('REG_ACAO_FIM_TAR', callback);
		};

		factory.canChangeActionTaskExecution = function (callback) {
			return factoryPreference.getPreferenceAsBoolean('LOG_ALTER_ACAO_EXEC_TAR', callback);
		};

		factory.isActiveUserGroup = function (callback) {
			return factoryPreference.getPreferenceAsBoolean('LOG_TAR_GRP_USUAR', callback);
		};

		factory.isShowPhoneInTask = function (callback) {
			return factoryPreference.getPreferenceAsBoolean('LOG_SHOW_FIELD_TELEF_TAR', callback);
		};

		factory.isActiveMultipleSelection = function (callback) {
			return factoryPreference.getPreferenceAsBoolean('LOG_HAB_SEL_MULT_TAR', callback);
		};

		factory.removeResponsibleFilter = function (callback) {
			return factoryPreference.getPreferenceAsBoolean('LOG_HAB_REM_RESP_TAR', callback);
		};

		factory.getTaskSummary = function (parameters, callback) {

			var i, properties = [], values = [];

			if (parameters) {
				if (parameters instanceof Array) {
					for (i = 0; i < parameters.length; i++) {
						properties.push(parameters[i].property);
						values.push(parameters[i].value);
					}
				} else if (parameters.property) {
					properties.push(parameters.property);
					values.push(parameters.value);
				}
			}

			parameters = { method: 'tasksummary', properties: properties, values: values };

			return this.TOTVSQuery(parameters, function (result) {
				if (callback) {
					callback((result && result.length > 0 ? result : undefined));
				}
			});
		};

		factory.exportSearch = function (filters, isOnline, callback) {
			var i,
				name,
				now = new Date(),
				properties = [],
				values = [],
				publish = (isOnline !== true);

			name = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
			name = name + '_' + now.getHours() + '-' + now.getMinutes() + '-' + now.getSeconds();
			name = name + '_CRM_TAREFA';

			if (angular.isUndefined(filters)) {
				filters = [];
			} else if (!angular.isArray(filters)) {
				filters = [ filters ];
			}

			for (i = 0; i < filters.length; i++) {
				properties.push(filters[i].property);
				values.push(filters[i].value);
			}

			return ReportService.run('crm/rel_task_export', {
				program: '/report/crm/crm0009',
				format: 'XLSX',
				download: isOnline,
				publish: publish,
				resultFileName: name,
				c_properties: properties,
				c_values: values
			}, {}, callback);
		};

		return factory;
	};
	// factoryTask
	factoryTask.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory',
		'crm.crm_param.factory', 'crm.generic.zoom.factory',
		'crm.generic.typeahead.factory', 'crm.generic.create.update.factory',
		'crm.generic.detail.factory', 'ReportService'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.service('crm.task.helper', helperTask);

	index.register.factory('crm.crm_tar.factory', factoryTask);

});
