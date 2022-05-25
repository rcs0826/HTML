/*globals index, define, angular, CRMURL, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-factories.js',
	'/dts/crm/js/api/fchcrm1004.js',
	'/dts/crm/js/api/fchcrm1047.js'
], function (index) {

	'use strict';
	var helperOpportunity,
		factoryOpportunity,
		helperSalesOrderOpportunity;
	// *************************************************************************************
	// *** HELPER
	// *************************************************************************************

	helperOpportunity = function (legend) {

		this.funnelColors = [
			{ num_id: 1, nom_cor: "#FFE30D"}, //&glob val1 Amarelo "#FFFF00"
			{ num_id: 2, nom_cor: "#E87C0C"}, //&glob val2 Laranja "#FF6600"
			{ num_id: 3, nom_cor: "#E8140C"}, //&glob val3 Vermelho "#FF0000"
			{ num_id: 4, nom_cor: "#FA98FF"}, //&glob val4 Rosa "#FF33CC"
			{ num_id: 5, nom_cor: "#28597F"}, //&glob val5 Azul Escuro "#0000FF"
			{ num_id: 6, nom_cor: "#50B3FF"}, //&glob val6 Azul Claro "#00CCFF"
			{ num_id: 7, nom_cor: "#397F34"}, //&glob val7 Verde "#336600"
			{ num_id: 8, nom_cor: "#7F3D0F"}, //&glob val8 Marron "#663300"
			{ num_id: 9, nom_cor: "#000000"}, //&glob val9 Preto "#000000"
			{ num_id: 10, nom_cor: "#D3D5D7"}, //&glob val10 Cinza "#888888"
			{ num_id: 11, nom_cor: "#EEEEEE"}, //&glob val11 Branco "#EEEEEE"
			{ num_id: 12, nom_cor: "#6600FF"}  //&glob val12 Roxo "#6600FF"
		];

		this.filtersGroup = 'totvs.crm.portal.opportunities.filters';

		this.funnelConfig = 'totvs.crm.portal.opportunities.funnel.config';

		this.rankingConfig = 'totvs.crm.portal.opportunities.ranking.config';

		this.parseOpportunityColor = function (opportunity) {

			if (opportunity.log_suspenso === true) {
				opportunity.nom_cor = 'crm-opportunity-dark';
				opportunity.nom_cor_qtip = 'qtip-dark';
			} else {
				if (opportunity.dat_fechto_oportun) {
					opportunity.nom_cor = 'crm-opportunity-green';
					opportunity.nom_cor_qtip = 'qtip-green';
				} else {
					opportunity.nom_cor = 'crm-opportunity-yellow';
					opportunity.nom_cor_qtip = 'qtip-yellow';
				}
			}
		};

	};
	helperOpportunity.$inject = ['crm.legend'];


	helperSalesOrderOpportunity = function (legend) {
		this.parseSalesOrder = function (orders) {
			var i;
			if (!angular.isArray(orders)) {
				orders = [orders];
			}
			for (i = 0; orders.length > i; i++) {
				orders[i].nom_situation = legend.salesOrderSituation.NAME(orders[i].situation);
			}
		};
	};
	helperSalesOrderOpportunity.$inject = ['crm.legend'];
	// *************************************************************************************
	// *** FACTORY
	// *************************************************************************************

	factoryOpportunity = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericZoom,
								 factoryGenericTypeahead, factoryGenericDetail, factoryGenericCreateUpdate,
								 factoryGenericDelete, factoryPreference, factoryCurrency, ReportService) {



		var factory = $totvsresource.REST(
				CRMURL.opportunityService + ':method/:id',
				undefined,
				factoryGenericCreateUpdate.customActions
			),
			cache = $cacheFactory('crm.opportunity.Cache');

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericTypeahead);
		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericCreateUpdate);
		angular.extend(factory, factoryGenericDelete);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			if (!options.orderBy) { options.orderBy =  ['num_id']; }
			if (CRMUtil.isUndefined(options.asc)) { options.asc =  [false]; }

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getDescription = function (id, callback) {

			return this.TOTVSGet({method: 'description', id: id}, function (data) {
				if (callback) { callback(data); }
			});

		};

		// Produtos da Oportunidade
		factory.getProducts = function (idOpportunity, callback) {
			return this.TOTVSQuery({method: 'product', opportunity: idOpportunity}, function (result) {
				if (result) { result.reverse(); }
				if (callback) { callback(result); }
			});
		};

		factory.getOpportunityProduct = function (idOpportunityProduct, callback) {
			return this.TOTVSQuery({method: 'opportunity_product', opportunity_product: idOpportunityProduct}, function (result) {
				if (result) { result.reverse(); }
				if (callback) { callback(result); }
			});
		};

		factory.addProduct = function (idOpportunity, model, callback) {
			return this.DTSPost({method: 'product', opportunity: idOpportunity}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.updateProduct = function (idOpportunity, idProduct, model, callback) {
			return this.DTSPut({method: 'product', opportunity: idOpportunity, product: idProduct}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.deleteProduct = function (idOpportunity, callback) {
			return this.TOTVSRemove({method: 'product', opportunity: idOpportunity}, callback);
		};

		// Motivos de Ganho e Perda da Oportunidade
		factory.getGainLosses = function (idOpportunity, callback) {
			return this.TOTVSQuery({method: 'gain_loss', opportunity: idOpportunity}, function (result) {
				if (result) { result.reverse(); }
				if (callback) { callback(result); }
			});
		};

		factory.addGainLoss = function (idOpportunity, model, callback) {
			return this.DTSPost({method: 'gain_loss', opportunity: idOpportunity}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.deleteGainLoss = function (idOpportunityGainLoss, callback) {
			return this.TOTVSRemove({method: 'gain_loss', opportunity_gain_loss: idOpportunityGainLoss}, callback);
		};

		// Ponto Forte e Fraco da Oportunidade
		factory.getStrongWeaks = function (idOpportunity, callback) {
			return this.TOTVSQuery({method: 'strong_weak', opportunity: idOpportunity}, function (result) {
				if (result) { result.reverse(); }
				if (callback) { callback(result); }
			});
		};

		factory.addStrongWeak = function (idOpportunity, model, callback) {
			return this.DTSPost({method: 'strong_weak', opportunity: idOpportunity}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.deleteStrongWeak = function (idOpportunityStrongWeak, callback) {
			return this.TOTVSRemove({method: 'strong_weak', opportunity_strong_weak: idOpportunityStrongWeak}, callback);
		};

		// Revendas da Oportunidade
		factory.getResales = function (idOpportunity, callback) {
			return this.TOTVSQuery({method: 'resale', opportunity: idOpportunity}, function (result) {
				if (result) { result.reverse(); }
				if (callback) { callback(result); }
			});
		};

		factory.addResale = function (idOpportunity, model, callback) {
			return this.DTSPost({method: 'resale', opportunity: idOpportunity}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.deleteResale = function (idOpportunity, callback) {
			return this.TOTVSRemove({method: 'resale', opportunity: idOpportunity}, callback);
		};

		// Concorrentes da Oportunidade
		factory.getCompetitors = function (idOpportunity, callback) {
			return this.TOTVSQuery({method: 'competitor', opportunity: idOpportunity}, function (result) {
				if (result) { result.reverse(); }
				if (callback) { callback(result); }
			});
		};

		factory.getOpportunityCompetitor = function (idOpportunityCompetitor, callback) {
			return this.TOTVSQuery({method: 'opportunity_competitor', opportunity_competitor: idOpportunityCompetitor}, function (result) {
				if (result) { result.reverse(); }
				if (callback) { callback(result); }
			});
		};

		factory.addCompetitor = function (idOpportunity, model, callback) {
			return this.DTSPost({method: 'competitor', opportunity: idOpportunity}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.updateCompetitor = function (idOpportunity, idCompetitor, model, callback) {
			return this.DTSPut({method: 'competitor', opportunity: idOpportunity, competitor: idCompetitor}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.deleteCompetitor = function (idOpportunity, callback) {
			return this.TOTVSRemove({method: 'competitor', opportunity: idOpportunity}, callback);
		};

		// Contatos da Oportunidade
		factory.getContacts = function (idOpportunity, callback) {
			return this.TOTVSQuery({method: 'contact', opportunity: idOpportunity}, function (result) {
				if (result) { result.reverse(); }
				if (callback) { callback(result); }
			});
		};

		factory.addContact = function (idOpportunity, model, callback) {
			return this.DTSPost({method: 'contact', opportunity: idOpportunity}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.deleteContact = function (idOpportunity, callback) {
			return this.TOTVSRemove({method: 'contact', opportunity: idOpportunity}, callback);
		};

		// Pedidos/Cotação

		factory.calculateSalesOrder = function (idOpportunity, idSalesorder, callback) {
			return this.TOTVSQuery({method: 'salesorder_calculate', opportunity: idOpportunity, salesorder: idSalesorder}, function (data) {
				if (callback) { callback(data); }
			});
		};

		factory.getSalesOrder = function (idOpportunity, callback) {

			return this.TOTVSQuery({method: 'salesorder', opportunity: idOpportunity}, function (data) {
				if (callback) { callback(data); }
			});
		};

		factory.generateSalesOrder = function (idOpportunity, isQuotation, establishmentId, orderNumber, orderCliNumber, deliveryDate, callback) {
			return this.TOTVSQuery({method: 'generatesalesorder', opportunity: idOpportunity, establishment: establishmentId, quotation: isQuotation,
										orderNumber: orderNumber, orderCliNumber: orderCliNumber, deliveryDate: deliveryDate}, function (data) {
				if (callback) { callback(data); }
			});
		};

		factory.getAllStrategies = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'strategies',
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'strategies', only_valid: false}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getAllValidStrategies = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'validStrategies',
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'strategies', only_valid: true}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getStrategy = function (idStrategy, callback) {

			return this.TOTVSQuery({method: 'strategy', strategy: idStrategy}, function (data) {
				if (callback) { callback(data); }
			});
		};

		factory.getPhaseDev = function (idPhaseDev, callback) {

			return this.TOTVSQuery({method: 'phase_dev', phase_dev: idPhaseDev}, function (data) {
				if (callback) { callback(data); }
			});
		};

		factory.getAllPhases = function (idStrategy, callback) {

			return this.TOTVSQuery({method: 'phase', strategy: idStrategy}, function (data) {
				if (callback) { callback(data); }
			});

		};

		factory.getAllProbabilities = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'probabilities',
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'probability'}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getCurrencyDefault = function (callback) {
			factoryPreference.getPreference('MOEDA_DEFAULT', function (result) {
				if (callback) {
					if (result && result.dsl_param_crm && result.dsl_param_crm > 0) {
						factoryCurrency.getCurrency(result.dsl_param_crm, function (currency) {
							callback(currency);
						});
					} else {
						callback();
					}
				}
			});
		};

		factory.getResponsible = function (account, callback) {
			return this.TOTVSQuery({method: 'responsible', account: account}, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.getOpportunityRanking = function (max, dtStart, dtEnd, suspended, strategyId,
												  campaignId, phaseId, responsibleId, accountId,
												  type, callback) {
			return this.TOTVSQuery({method: 'getopportunityranking', max: max, dtStart: dtStart, dtEnd: dtEnd,
									suspended: suspended, strategyId: strategyId, campaignId: campaignId,
									phaseId: phaseId, responsibleId: responsibleId, accountId: accountId,
									iType: type}, function (data) {
				if (callback) { callback(data); }
			});
		};

		factory.validateEstrategy = function (strategyId, callback) {
			return this.TOTVSGet({method: 'validateestrategy', strategyId: strategyId}, function (data) {
				if (callback) { callback(data); }
			});
		};

		factory.getOpportunityFunnel = function (dtPrevStart, dtPrevEnd, dtCloseStart, dtCloseEnd, dtRegistStart,
												 dtRegistEnd, funnelType, suspended, strategyId, campaignId,
												 responsibleId, overallGoals, accountId, callback) {
			return this.TOTVSQuery({method: 'getopportunityfunnel',
								   dtPrevStart: dtPrevStart, dtPrevEnd: dtPrevEnd, dtCloseStart: dtCloseStart,
								   dtCloseEnd: dtCloseEnd, dtRegistStart: dtRegistStart, dtRegistEnd: dtRegistEnd,
								   funnelType: funnelType, suspended: suspended, strategyId: strategyId,
								   campaignId: campaignId, responsibleId: responsibleId, overallGoals: overallGoals,
								   accountId: accountId}, function (data) {
				if (callback) { callback(data); }
			});
		};

		factory.toogleSuspendOpportunity = function (idOpportunity, callback) {
			return this.DTSPost({ method: 'tooglesuspend', id: idOpportunity }, {}, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.lostOpportunity = function (idOpportunity, callback) {
			return this.DTSPost({ method: 'lostopportunity', id: idOpportunity }, {}, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.isIntegratedWithGP = function (callback) {
			factoryPreference.isIntegratedWithGP(function (result) {
				callback(result);
			});
		};

		factory.getDefaultEstablishmentPD0301 = function (callback) {
			return this.TOTVSGet({method: 'default_establishment_pd0301'}, function (data) {
				if (callback) {
					callback(data.i_id); }
			});
		};

		factory.getDefaultCityCif = function (nomeAbrev, callback) {
			return this.TOTVSGet({method: 'default_city_cif', nomeAbrev: nomeAbrev}, function (data) {
				if (callback) {
					callback(data.c_cidade); }
			});
		};

		factory.getConfigSalesOrder = function (user, callback) {
			var result, idCache = 'getConfigSalesOrder-' + user;

			result = cache.get(idCache);

			if (result) {
				if (callback) { callback(result); }
			} else {			
				return this.TOTVSGet({method: 'config_sales_order'}, function (data) {
					cache.put(idCache, data);
					if (callback) {
						callback(data);
					}
				});
			}
		}

		factory.exportSearch = function (filters, isOnline, callback) {

			var i,
				name,
				now = new Date(),
				properties = [],
				values = [],
				publish = (isOnline !== true);

			name = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
			name = name + '_' + now.getHours() + '-' + now.getMinutes() + '-' + now.getSeconds();
			name = name + '_CRM_OPORTUNIDADES';

			if (angular.isUndefined(filters)) {
				filters = [];
			} else if (!angular.isArray(filters)) {
				filters = [ filters ];
			}

			for (i = 0; i < filters.length; i++) {
				properties.push(filters[i].property);
				values.push(filters[i].value);
			}

			return ReportService.run('crm/rel_opportunity_export', {
				program: '/report/crm/crm0007',
				format: 'XLSX',
				download: isOnline,
				publish: publish,
				resultFileName: name,
				c_properties: properties,
				c_values: values
			}, {}, callback);
		};

		return factory;
	}; // factoryOpportunity
	factoryOpportunity.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory', 'crm.generic.zoom.factory',
		'crm.generic.typeahead.factory', 'crm.generic.detail.factory', 'crm.generic.create.update.factory',
		'crm.generic.delete.factory', 'crm.crm_param.factory', 'crm.crm_erp_moed.factory', 'ReportService'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.opportunity.helper', helperOpportunity);
	index.register.service('crm.opportunity-sales-order.helper', helperSalesOrderOpportunity);

	index.register.factory('crm.crm_oportun_vda.factory', factoryOpportunity);

});
