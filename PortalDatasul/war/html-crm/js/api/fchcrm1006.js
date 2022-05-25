/*globals index, define, angular, CRMURL, CRMUtil*/
/*jslint plusplus: true */
define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-factories.js',
	'/dts/crm/js/api/fchcrm1004.js'
], function (index) {

	'use strict';

	var helperTicket,
		factoryTicket;

	// *************************************************************************************
	// *** HELPER
	// *************************************************************************************

	helperTicket = function () {

		this.filtersGroup = 'totvs.crm.portal.tickets.filters';
        
		this.openTicketClosedConfig = 'totvs.crm.portal.open.ticket.closed.config';
        
        this.ticketSummaryConfig = 'totvs.crm.portal.tickets.ticket-summary.config';

		this.parseTicketStatus = function (ticket) {
			if (ticket) {
				if (ticket.dat_fechto !== null) {
					ticket.nom_cor = 'crm-ticket-green';
				} else {
					ticket.nom_cor = 'crm-ticket-yellow';
				}
			}
		};
	};

	helperTicket.$inject = [];

	// *************************************************************************************
	// *** FACTORY
	// *************************************************************************************

	factoryTicket = function ($totvsresource, factoryGeneric, factoryPreference,
						   factoryGenericZoom, factoryGenericTypeahead, factoryGenericDetail,
						   factoryGenericCreateUpdate, factoryGenericDelete, ReportService) {

		var factory = $totvsresource.REST(CRMURL.ticketService + ':method/:id',
			undefined,  factoryGenericCreateUpdate.customActions);

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericTypeahead);
		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericCreateUpdate);
		angular.extend(factory, factoryGenericDelete);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			if (!options.orderBy) { options.orderBy = ['dat_abert', 'num_id']; }
			if (CRMUtil.isUndefined(options.asc)) { options.asc =  [false, false]; }

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getCode = function (callback) {
			return this.TOTVSGet({method: 'code'}, callback);
		};

		factory.getSituation = function (id, callback) {
			return this.TOTVSGet({method: 'situation', id: id}, callback);
		};

		factory.getSolution = function (id, callback) {
			return this.TOTVSGet({method: 'solution', id: id}, callback);
		};

		factory.isRatecAvailable = function (callback) {
			return factoryPreference.getPreferenceAsBoolean('VIPAL_LOG_SHOW_FIELDS_RATEC', callback);
		};

		factory.isDeleteAvailable = function (callback) {
			return this.TOTVSGet({method: 'candelete'}, callback);
		};

		factory.isSubjectSupport = function (callback) {
			return factoryPreference.getPreferenceAsBoolean('LOG_OCCURRENCE_SUBJECT', callback);
		};

		factory.getTypes = function (callback) {
			return this.TOTVSQuery({method: 'type'}, callback);
		};

		factory.getPriorities = function (callback) {
			return this.TOTVSQuery({method: 'priority'}, callback);
		};

		factory.getOrigins = function (callback) {
			return this.TOTVSQuery({method: 'origin'}, callback);
		};

		factory.getStatus = function (callback) {
			return this.TOTVSQuery({method: 'status'}, callback);
		};
        
        factory.getResources = function (callback) {
			return this.TOTVSQuery({method: 'resources'}, callback);
		};
        
        factory.getPriorities = function (callback) {
			return this.TOTVSQuery({method: 'priority'}, callback);
		};

		factory.getTags = function (idTicket, callback) {
			return this.TOTVSQuery({method: 'tag', ticket: idTicket}, callback);
		};

		factory.getSymptoms = function (idTicket, callback) {
			return this.TOTVSQuery({method: 'symptom', ticket: idTicket}, callback);
		};

		factory.addTags = function (idTicket, models, callback) {
			return this.DTSPost({method: 'tag', ticket: idTicket}, models, callback);
		};

		factory.addSymptoms = function (idTicket, models, callback) {
			return this.DTSPost({method: 'symptom', ticket: idTicket}, models, callback);
		};
        
        factory.addProduct = function (idTicket, models, callback) {
            return this.DTSPost({method: 'product', ticket: idTicket}, models, callback);
        };
        
        factory.updateProduct = function (id, idTicket, model, callback) {
            return this.DTSPut({method: 'product', id: id, ticket: idTicket}, model, function (result) {
                if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
            });
        };
        
        factory.updatePhone = function (id, idAccount, model, callback) {
			return this.DTSPut({method: 'phone', id: id, account: idAccount}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

        
        factory.removeProduct = function (id, callback) {
			return this.TOTVSRemove({method: 'product', id: id}, callback);
		};

		factory.removeTag = function (id, callback) {
			return this.TOTVSRemove({method: 'tag', id: id}, callback);
		};

		factory.removeSymptom = function (id, callback) {
			return this.TOTVSRemove({method: 'symptom', id: id}, callback);
		};

		factory.reopenTicket = function (id, resource, callback) {
			return this.DTSPost({method: 'reopen', id: id, resource: resource}, {}, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.getHistoryActionDefaults = function (id, isUpdate, callback) {
			return this.TOTVSQuery({method: 'history_action_defaults', id: id, update: isUpdate}, callback);
		};

		factory.genarateId = function (callback) {
			return this.TOTVSQuery({method: 'generateid'}, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.getOpenTicketxClosedTicket = function (code, account, callback) {
			return this.TOTVSQuery({method: 'getopenticketxclosedticket', code: code, account: account}, function (data) {
				if (callback) { callback(data); }
			});
		};
        
        factory.getProducts = function (idTicket, callback) {
			return this.TOTVSQuery({method: 'products', ticket: idTicket}, callback);
		};

		factory.getForecastClosingTicket = function (idPriorid, idFlow, idFlowStatus, idResource, callback) {
			return this.TOTVSGet({method: 'forecastclosingticket', priorid: idPriorid, flow: idFlow, flow_status: idFlowStatus, resource: idResource}, callback);
		};
        
        factory.verifyTicketProduct = function () {
            return this.TOTVSGet({ method: 'verifyticketproduct'});
        };

		factory.print = function (id, callback) {
			return ReportService.run('crm/rel_ocorrencia', {
				program: '/report/crm/crm0001',
				resultFileName: 'crm_ocorrencia_' + id,
				num_id_ocor: id
			}, {}, callback);
		};
        
        factory.getTicketSummary = function (parameters, callback) {
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

			parameters = { method: 'ticketsummary', properties: properties, values: values };

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
			name = name + '_CRM_OCORRENCIAS';

			if (angular.isUndefined(filters)) {
				filters = [];
			} else if (!angular.isArray(filters)) {
				filters = [ filters ];
			}

			for (i = 0; i < filters.length; i++) {
				properties.push(filters[i].property);
				values.push(filters[i].value);
			}

			return ReportService.run('crm/rel_ticket_export', {
				program: '/report/crm/crm0006',
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

	factoryTicket.$inject = [
		'$totvsresource', 'crm.generic.factory', 'crm.crm_param.factory',
		'crm.generic.zoom.factory', 'crm.generic.typeahead.factory', 'crm.generic.detail.factory',
		'crm.generic.create.update.factory', 'crm.generic.delete.factory', 'ReportService'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.ticket.helper', helperTicket);

	index.register.factory('crm.crm_ocor.factory', factoryTicket);

});
