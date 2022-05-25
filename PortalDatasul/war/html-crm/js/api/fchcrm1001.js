/*globals index, define, angular, CRMURL, CRMUtil, CRMRestService*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryCampaign;

	factoryCampaign = function ($totvsresource, $cacheFactory, factoryGeneric,
								 factoryGenericCreateUpdate, factoryGenericDetail, factoryGenericDelete, factoryGenericZoom,
								 factoryGenericTypeahead, ReportService) {

		var factory,
			actions = angular.copy(factoryGenericCreateUpdate.customActions),
			cache = $cacheFactory('crm.campaign.Cache');

		actions.DTSGetCustom = {
			method: 'GET',
			isArray: false
		};			

		factory = $totvsresource.REST(
			CRMRestService + '1001/:method/:id/:campaign/:action/:objective/:media/:result/:action_result/:result_action/:detail/:user/:group/:price_table/:price_table_item',
			undefined,
			actions
		);

		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericDelete);
		angular.extend(factory, factoryGenericCreateUpdate);
		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericTypeahead);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			if (!options.orderBy) {
				options.orderBy	= ['nom_campanha'];
				options.asc		= [true];
			}

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getAllCampaignTypes = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'campaign-types',
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({ method: 'all_types' }, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getAllCampaigns = function (onlyValid, idUser, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'campaigns-' + onlyValid + '-' + idUser,
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'all', valid: onlyValid, i_user: idUser}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getAllActions = function (idCampaign, idUser, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'actions-' + (idCampaign || 'none') + '-' + (idUser || 'none'),
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'action', i_campaign: idCampaign, i_user: idUser}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getCampaignActions = function (idCampaign, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'campaign-actions-' + (idCampaign || 'none'),
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'campaign_actions', i_campaign: idCampaign}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getAllObjectives = function (idCampaign, idAction, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = "objectives-" + (idCampaign || "none") + "-" + (idAction || "none"),
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({
					method: 'objective',
					i_campaign: idCampaign,
					i_action: idAction
				}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getAllMedias = function (idCampaign, idAction, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = "medias-" + (idCampaign || "none") + "-" + (idAction || "none"),
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({
					method: 'media',
					i_campaign: idCampaign,
					i_action: idAction
				}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getAllResults = function (idCampaign, idAction, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = "results-" + (idCampaign || "none") + "-" + (idAction || "none"),
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({
					method: 'result',
					i_campaign: idCampaign,
					i_action: idAction
				}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getAllDetails = function (idResult, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = (idResult ? 'details-' + idResult : 'allDetails'),
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'resultdetail', i_result: idResult}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getAllActionsUsers = function (idCampaign, idAction, idAccount, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = (idCampaign && idAction
						   ? 'actionsUsers-' + idCampaign + '-' + idAction + '-' + idAccount
						   : 'allActionsUsers'),
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({
					method: 'action_user',
					i_campaign: idCampaign,
					i_action: idAction,
					i_account: idAccount
				}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getAllActionsUsers01 = function (idCampaign, idAction, idAccount, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = (idCampaign && idAction
						   ? 'actionsUsers01-' + idCampaign + '-' + idAction + '-' + idAccount
						   : 'allActionsUsers01'),
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({
					method: 'action_user01',
					i_campaign: idCampaign,
					i_action: idAction,
					i_account: idAccount
				}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getAllActionsUsersAndGroupUser = function (idCampaign, idAction, idAccount, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = (idCampaign && idAction
						   ? 'groupUsersActionsUsers-' + idCampaign + '-' + idAction + '-' + idAccount
						   : 'groupUsersActionsUsers'),
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({
					method: 'group_users_action_users',
					i_campaign: idCampaign,
					i_action: idAction,
					i_account: idAccount
				}, function (data) {

					if (CRMUtil.isDefined(data)) {

						var i;

						for (i = 0; i < data.length; i++) {
							if (data[i].hasOwnProperty('ttUsuario01')) {
								data[i].ttUsuario = data[i].ttUsuario01;
								delete data[i].ttUsuario01;
							}
						}
					}

					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getAllActionsUsersAndGroupUser01 = function (idCampaign, idAction, idAccount, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = (idCampaign && idAction
						   ? 'groupUsersActionsUsers01-' + idCampaign + '-' + idAction + '-' + idAccount
						   : 'groupUsersActionsUsers01'),
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({
					method: 'group_users_action_users01',
					i_campaign: idCampaign,
					i_action: idAction,
					i_account: idAccount
				}, function (data) {

					if (CRMUtil.isDefined(data)) {

						var i;

						for (i = 0; i < data.length; i++) {
							if (data[i].hasOwnProperty('ttUsuario01')) {
								data[i].ttUsuario = data[i].ttUsuario01;
								delete data[i].ttUsuario01;
							}
						}
					}

					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getAllResultActions = function (idCampaign, idAction, idResult, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'result.actions-' + (idCampaign || 'none') +
				'-' + (idAction || 'none') + '-' + (idResult || 'none'),
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.DTSGetCustom({
					method: 'resultaction_v1',
					isArray: false,
					i_campaign: idCampaign,
					i_action: idAction,
					i_result: idResult
				}, function (data) {

					if (data && data.lcOutput) {
						data = JSON.parse(data.lcOutput);
						cache.put(idCache, data);
						if (callback) { callback(data); }
					} else {
						if (callback) { callback(); }
					}
					
				});
			}
		};

		/* ********************************************
		 * INI - CAMPAIGN PRICE TABLE
		 * ********************************************
		factory.addCampaignPriceTable = function (idCampaign, model, callback) {
			return this.DTSPost({ method: 'priceTable', campaign: idCampaign }, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.updateCampaignPriceTable = function (idCampaign, idPriceTable, model, callback) {
			return this.DTSPut({
				method: 'priceTable',
				campaign: idCampaign,
				price_table: idPriceTable
			}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.deleteCampaignPriceTable = function (idPriceTable, callback) {
			return this.TOTVSRemove({ method: 'priceTable', price_table: idPriceTable }, callback);
		};

		factory.addCampaignPriceTableItem = function (idPriceTable, model, callback) {
			return this.DTSPost({ method: 'priceTableItem', price_table: idPriceTable }, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.updateCampaignPriceTableItem = function (idPriceTable, idPriceTableItem, model, callback) {
			return this.DTSPut({
				method: 'priceTableItem',
				price_table: idPriceTable,
				price_table_item: idPriceTableItem
			}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.deleteCampaignPriceTableItem = function (idPriceTableItem, callback) {
			return this.TOTVSRemove({ method: 'priceTableItem', price_table_item: idPriceTableItem }, callback);
		};
		* ********************************************
		* END - CAMPAIGN PRICE TABLE
		* ******************************************** */

		// CAMPANHA > ACAO
		factory.addCampaignAction = function (idCampaign, model, callback) {
			return this.DTSPost({ method: 'action', campaign: idCampaign }, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.updateCampaignAction = function (idCampaign, idAction, model, callback) {
			return this.DTSPut({
				method: 'action',
				campaign: idCampaign,
				action: idAction
			}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.deleteCampaignAction = function (idAction, callback) {
			return this.TOTVSRemove({ method: 'action', action: idAction }, callback);
		};

		factory.setCampaignActionAsDefault = function (idAction, callback) {
			return this.TOTVSUpdate({ method: 'action_default', action: idAction }, undefined, callback);
		};

		factory.setCampaignActionUserDefault = function (idUser, callback) {
			return this.TOTVSUpdate({ method: 'user_default', user: idUser }, undefined, callback);
		};

		factory.setCampaignActionGroupDefault = function (idGroup, callback) {
			return this.TOTVSUpdate({ method: 'group_default', group: idGroup }, undefined, callback);
		};

		factory.reorderCampaignActions = function (idActions, callback) {
			return this.TOTVSUpdate({ method: 'action_order', actions: idActions }, { method: 'action_order' }, callback);
		};

		// CAMPANHA > ACAO > OBJETIVO
		factory.addCampaignActionObjective = function (idAction, model, callback) {
			return this.DTSPost({ method: 'objective', action: idAction }, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.updateCampaignActionObjective = function (idAction, idObjective, model, callback) {
			return this.DTSPut({
				method: 'objective',
				action: idAction,
				objective: idObjective
			}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.addCampaignActionObjectives = function (idAction, idObjectives, callback) {
			return this.DTSPost({
				method: 'objective_batch',
				action: idAction,
				objectives: idObjectives
			},  { method: 'objective_batch' }, callback);
		};

		factory.deleteCampaignActionObjective = function (idObjective, callback) {
			return this.TOTVSRemove({ method: 'objective', objective: idObjective }, callback);
		};

		factory.setCampaignActionObjectiveAsDefault = function (idObjective, callback) {
			return this.TOTVSUpdate({ method: 'objective_default', objective: idObjective }, undefined, callback);
		};

		// CAMPANHA > ACAO > MIDIA
		factory.addCampaignActionMedia = function (idAction, model, callback) {
			return this.DTSPost({ method: 'media', action: idAction }, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.updateCampaignActionMedia = function (idAction, idMedia, model, callback) {
			return this.DTSPut({
				method: 'media',
				action: idAction,
				media: idMedia
			}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.addCampaignActionMedias = function (idAction, idMedias, callback) {
			return this.DTSPost({
				method: 'media_batch',
				action: idAction,
				medias: idMedias
			}, { method: 'media_batch' }, callback);
		};

		factory.deleteCampaignActionMedia = function (idMedia, callback) {
			return this.TOTVSRemove({ method: 'media', media: idMedia }, callback);
		};

		factory.setCampaignActionMediaAsDefault = function (idMedia, callback) {
			return this.TOTVSUpdate({ method: 'media_default', media: idMedia }, undefined, callback);
		};

		// CAMPANHA > ACAO > USUARIO
		factory.addCampaignActionUser = function (idAction, model, callback) {
			return this.DTSPost({ method: 'user', action: idAction }, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.updateCampaignActionUser = function (idAction, idUser, model, callback) {
			return this.DTSPut({
				method: 'user',
				action: idAction,
				user: idUser
			}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.addCampaignActionUsers = function (idAction, idUsers, callback) {
			return this.DTSPost({
				method: 'user_batch',
				action: idAction,
				users: idUsers
			}, { method: 'user_batch' }, callback);
		};

		factory.deleteCampaignActionUser = function (idUser, callback) {
			return this.TOTVSRemove({ method: 'user', user: idUser }, callback);
		};

		// CAMPANHA > ACAO > GRUPO
		factory.addCampaignActionGroup = function (idAction, model, callback) {
			return this.DTSPost({ method: 'group', action: idAction }, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.updateCampaignActionGroup = function (idAction, idGroup, model, callback) {
			return this.DTSPut({
				method: 'group',
				action: idAction,
				group: idGroup
			}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.addCampaignActionGroups = function (idAction, idGroups, callback) {
			return this.DTSPost({
				method: 'group_batch',
				action: idAction,
				groups: idGroups
			}, { method: 'group_batch' }, callback);
		};

		factory.deleteCampaignActionGroup = function (idGroup, callback) {
			return this.TOTVSRemove({ method: 'group', group: idGroup }, callback);
		};

		// CAMPANHA > ACAO > RESULTADO
		factory.addCampaignActionResult = function (idAction, model, callback) {
			return this.DTSPost({ method: 'result', action: idAction }, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.updateCampaignActionResult = function (idAction, idResult, model, callback) {
			return this.DTSPut({
				method: 'result',
				action: idAction,
				result: idResult
			}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.deleteCampaignActionResult = function (idResult, callback) {
			return this.TOTVSRemove({ method: 'result', result: idResult }, callback);
		};

		factory.setCampaignActionResultAsDefault = function (idResult, callback) {
			return this.TOTVSUpdate({ method: 'result_default', result: idResult }, undefined, callback);
		};

		// CAMPANHA > ACAO > RESULTADO > ACAO
		factory.addCampaignActionResultActions = function (idActionResult, idActions, callback) {
			return this.DTSPost({
				method: 'result_action_batch',
				action_result: idActionResult,
				result_actions: idActions
			}, { method: 'result_action_batch' }, callback);
		};

		factory.addActionResultAction = function (model, callback) {
			return this.DTSPost({
				method: 'action_result_action'
			}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.updateActionResultAction = function (id, model, callback) {
			return this.DTSPut({
				method: 'action_result_action',
				id: id
			}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};		

		factory.deleteCampaignActionResultAction = function (idResultAction, callback) {
			return this.TOTVSRemove({ method: 'result_action', result_action: idResultAction }, callback);
		};

		factory.setCampaignActionResultActionAsRequired = function (idResultAction, callback) {
			return this.TOTVSUpdate({ method: 'result_action_required', result_action: idResultAction }, undefined, callback);
		};

		factory.setCampaignActionResultActionAsAutomatic = function (idResultAction, callback) {
			return this.TOTVSUpdate({ method: 'result_action_automatic', result_action: idResultAction }, undefined, callback);
		};

		factory.reorderCampaignActionResultAction = function (idActions, callback) {
			return this.TOTVSUpdate({ method: 'result_action_order', result_actions: idActions }, { method: 'result_action_order' }, callback);
		};

		// Workflows...
		factory.getAllWorkflowProcess = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'workflow-process',
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({ method: 'workflow' }, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
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
			name = name + '_CRM_CAMPANHAS';
			if (angular.isUndefined(filters)) {
				filters = [];
			} else if (!angular.isArray(filters)) {
				filters = [ filters ];
			}
			for (i = 0; i < filters.length; i++) {
				properties.push(filters[i].property);
				values.push(filters[i].value);
			}
			return ReportService.run('crm/rel_campaign_export', {
				program: '/report/crm/crm0010',
				format: 'XLSX',
				download: isOnline,
				publish: publish,
				resultFileName: name,
				c_properties: properties,
				c_values: values
			}, {}, callback);
		};
		// Despesas da campanha
		factory.saveCampaignExpense = function (campaign, model, callback) {
			return this.DTSPost({method: 'expense', campaign: campaign}, model, function (result) {
				if (callback) { callback(result); }
			});
		};

		factory.updateCampaignExpense = function (campaign, id, model, callback) {
			return this.DTSPut({method: 'expense', campaign: campaign, id: id}, model, function (result) {
				if (callback) { callback(result); }
			});
		};

		factory.deleteCampaignExpense = function (idAction, callback) {
			return this.TOTVSRemove({ method: 'campaignExpense', action: idAction }, callback);
		};
		// Despesas da campanha

		// Despesas da acao da campanha
		factory.saveActionExpense = function (action, model, callback) {
			return this.DTSPost({method: 'actionExpense', action: action}, model, function (result) {
				if (callback) { callback(result); }
			});
		};

		factory.updateActionExpense = function (action, id, model, callback) {
			return this.DTSPut({method: 'actionExpense', action: action, id: id}, model, function (result) {
				if (callback) { callback(result); }
			});
		};

		factory.deleteActionExpense = function (idAction, callback) {
			return this.TOTVSRemove({ method: 'actionExpense', action: idAction }, callback);
		};
		// Despesas da acao da campanha

		return factory;
	};

	factoryCampaign.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory', 'crm.generic.create.update.factory',
		'crm.generic.detail.factory', 'crm.generic.delete.factory', 'crm.generic.zoom.factory', 'crm.generic.typeahead.factory', 'ReportService'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_campanha.factory', factoryCampaign);

});
