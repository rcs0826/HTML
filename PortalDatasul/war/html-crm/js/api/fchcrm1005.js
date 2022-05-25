/*globals index, define, angular, CRMURL, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-factories.js',
	'/dts/crm/js/api/fchcrm1004.js'
], function (index) {

	'use strict';

	var helperHistory,
		factoryHistory;

	// *************************************************************************************
	// *** HELPER
	// *************************************************************************************

	helperHistory = function () {

		this.filtersGroup = 'totvs.crm.portal.histories.filters';

		this.parseRelatedTo = function (history) {

			if (!history || history.dsl_rel) { return; }

			var hasAccess = (history.ttConta && history.ttConta.log_acesso === true);

			if (history.ttOcorrenciaOrigem && history.ttOcorrenciaOrigem.num_id) {
				history.idi_rel_a = 'l-ticket';
				if (hasAccess) {
					history.dsl_rel = '<a href="#/dts/crm/ticket/detail/' + history.ttOcorrenciaOrigem.num_id + '">' + history.ttOcorrenciaOrigem.cod_livre_1 + ' - ' + history.ttOcorrenciaOrigem.nom_ocor + '</a>';
				} else {
					history.dsl_rel = '<span>' + history.ttOcorrenciaOrigem.cod_livre_1 + ' - ' + history.ttOcorrenciaOrigem.nom_ocor + '</span>';
				}

			} else if (history.ttOportunidadeOrigem && history.ttOportunidadeOrigem.num_id) {
				history.idi_rel_a = 'l-opportunity';
				if (hasAccess) {
					history.dsl_rel = '<a href="#/dts/crm/opportunity/detail/' + history.ttOportunidadeOrigem.num_id + '">' + history.ttOportunidadeOrigem.des_oportun_vda + '</a>';
				} else {
					history.dsl_rel = '<span>' + history.ttOportunidadeOrigem.des_oportun_vda + '</span>';
				}
			} else if (history.ttTarefaOrigem && history.ttTarefaOrigem.num_id) {
				history.idi_rel_a = 'l-task';
				if (hasAccess) {
					history.dsl_rel = '<a href="#/dts/crm/task/detail/' + history.ttTarefaOrigem.num_id + '">' + history.ttTarefaOrigem.num_id + ' - ' + history.ttTarefaOrigem.nom_acao + '</a>';
				} else {
					history.dsl_rel = '<span>' + history.ttTarefaOrigem.num_id + ' - ' + history.ttTarefaOrigem.nom_acao + '</span>';
				}
			}
		};
	};
	helperHistory.$inject = [];

	// *************************************************************************************
	// *** FACTORY
	// *************************************************************************************

	factoryHistory = function ($totvsresource, $cacheFactory, factoryGeneric,
							factoryPreference, factoryGenericZoom,
							factoryGenericTypeahead, factoryGenericCreateUpdate,
							factoryGenericDetail, ReportService, factoryGenericDelete) {

		var cache = $cacheFactory('crm.history.Cache'),
			factory = $totvsresource.REST(
				CRMURL.historyService + ':method/:account/:id',
				undefined,
				factoryGenericCreateUpdate.customActions
			);	
		
		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericTypeahead);
		angular.extend(factory, factoryGenericCreateUpdate);
		angular.extend(factory, factoryGenericDelete);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			if (!options.orderBy) { options.orderBy =  ['num_id']; }
			if (CRMUtil.isUndefined(options.asc)) { options.asc =  [false]; }

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getUpdateStatusTicket = function (idTicket, idCampanha, idAcao, idRestdo, callback) {
			return this.TOTVSGet({method: 'update_status_ticket', id: idTicket, campanha: idCampanha, acao: idAcao, resultado: idRestdo}, function (data) {
				if (callback) { callback(data); }
			});
		};

		factory.getDescription = function (id, callback) {

			var result;

			//N pode usar cache por conta da alteracao do texto
			//if (isCache == true) { result = cache.get(id);}

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSGet({method: 'description', id: id}, function (data) {
					//cache.put(id, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getEmailsByProcess = function (idAccount, idContant, idTask, callback) {

			return this.TOTVSQuery({method: 'emails_by_process', i_account: idAccount, i_contact: idContant, i_task: idTask}, function (data) {
				if (callback) { callback(data); }
			});
		};

		factory.removeDescriptionCache = function (id) {
			cache.remove(id);
		};

		factory.isAllowedRetroactiveHistory = function (callback) {
			return factoryPreference.getPreferenceAsBoolean('ACAO_RETROATIVA', callback);
		};

		factory.canEditHistory = function (callback) {
			return factoryPreference.getPreferenceAsBoolean('LOG_EDIT_HIST', callback);
		};

		factory.canRemoveHistory = function (callback) {
			return factoryPreference.getPreferenceAsBoolean('LOG_DEL_HIST', callback);
		};

		factory.hasCampaignPermission = function (campaignId, actionId, callback) {
			return this.TOTVSGet({method: 'has_campaign_permission', campaignId: campaignId, actionId: actionId}, function (data) {
				var value = false;

				if (data && data.isOk) {
					value = data.isOk;
				}

				if (callback) { callback(value); }
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
			name = name + '_CRM_HISTORICO';

			if (angular.isUndefined(filters)) {
				filters = [];
			} else if (!angular.isArray(filters)) {
				filters = [ filters ];
			}

			for (i = 0; i < filters.length; i++) {
				properties.push(filters[i].property);
				values.push(filters[i].value);
			}

			return ReportService.run('crm/rel_history_export', {
				program: '/report/crm/crm0005',
				format: 'XLSX',
				download: isOnline,
				publish: publish,
				resultFileName: name,
				c_properties: properties,
				c_values: values
			}, {}, callback);
		};

		factory.persist = function (model, callback) {

			if ((model.hasOwnProperty('dsl_recipients')) && (model.dsl_recipients.length > 0)){
				return this.DTSPost({method:'persist_history_with_notification'}, model, function (result) {
					if (callback) {
						callback((result && result.length > 0 ? result[0] : undefined));
					}
				});
			} else {
				return this.saveRecord(model, callback);
			}

			//return factoryPreference.getPreferenceAsBoolean('LOG_EDIT_HIST', callback);
		};
        
		factory.persistBatch = function (publicId, model, callback) {
            
            return this.DTSPost({method:'persist_history_batch', public_id: publicId}, model, function (result) {
                
                if (callback) {
                    callback((result ? result : undefined));
                }
            });
            
		};    
		
		factory.update_v1 = function (id, model, callback) {

			if (!model.dsl_recipients || model.dsl_recipients.length <= 0) {
				model.dsl_recipients = ['']; //necessario para n dar erro no progress
			}
            
            return this.DTSPut({method:'v1', id: id}, model, function (result) {
                
                if (callback) {
                    callback((result ? result : undefined));
                }
            });
            
		};
		
		factory.create_v1 = function (model, callback) {

			if (!model.dsl_recipients || model.dsl_recipients.length <= 0) {
				model.dsl_recipients = ['']; //necessario para n dar erro no progress
			}
            
            return this.DTSPost({method:'v1'}, model, function (result) {
                
                if (callback) {
                    callback((result ? result : undefined));
                }
            });
            
		};		

		return factory;
	}; // factoryHistory
	factoryHistory.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory',
		'crm.crm_param.factory', 'crm.generic.zoom.factory',
		'crm.generic.typeahead.factory', 'crm.generic.create.update.factory',
		'crm.generic.detail.factory', 'ReportService', 'crm.generic.delete.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.history.helper', helperHistory);

	index.register.factory('crm.crm_histor_acao.factory', factoryHistory);

});
