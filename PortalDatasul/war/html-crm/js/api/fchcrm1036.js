/*global $, index, angular, define, TOTVSEvent, CRMURL*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';
	var factoryTicketFlow,
		ticketFlowHelper;

	ticketFlowHelper = function (legend, $rootScope, TOTVSEvent) {
		var helper = this;

		this.changePermissions = [
			{ id: 1, name: "l-all" },
			{ id: 2, name: "l-only-reponsible" },
			{ id: 3, name: "l-none" }
		];

		this.parseStatusChangePermission = function (flow) {
			if (flow.ttFluxoStatus && flow.ttFluxoStatus.length > 0) {
				flow.ttFluxoStatus.map(function (status) {
					status.ttChangePermission = helper.changePermissions[status.num_livre_1 - 1];
				});
			}
		};

	};

	ticketFlowHelper.$inject = ['crm.legend', '$rootScope', 'TOTVSEvent'];

	factoryTicketFlow = function ($totvsresource, factoryGeneric, factoryGenericZoom, $cacheFactory, factoryGenericCreateUpdate, factoryGenericDetail, factoryGenericDelete) {

		var factory = $totvsresource.REST(CRMURL.ticketFlowService + ':method/:id/:flow/:status', undefined,
										  factoryGenericCreateUpdate.customActions),
			cache = $cacheFactory('crm.ticket-flow.Cache');

		angular.extend(factory, factoryGeneric);
		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericDelete);
		angular.extend(factory, factoryGenericCreateUpdate);

		factory.getFlow = function (idOrigem, idTipo, idPrioridade, idVersao, callback, isAllowedCache) {
			isAllowedCache = isAllowedCache !== false;

			var idCache = 'ticket-flow-' + idOrigem + "-" + idTipo + "-" + idPrioridade + (idVersao ? "-" + idVersao : ""),
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'flow', origem: idOrigem, tipo: idTipo, prioridade: idPrioridade, versao: idVersao}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getAll = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'all-ticket-rating',
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'all'}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getResponsible = function (idFluxo, idStatus, idConta, callback, isAllowedCache) {
			isAllowedCache = isAllowedCache !== false;

			var idCache = 'ticket-flow-responsibles-' + idFluxo + "-" + idStatus + "-" + (idConta || ''),
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'responsible', fluxo: idFluxo, estado: idStatus, conta: idConta}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getStatus = function (idFluxo, idStatus, callback, isAllowedCache) {
			isAllowedCache = isAllowedCache !== false;

			var idCache = 'ticket-flow-status-' + idFluxo + (idStatus ? "-" + idStatus : ""),
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'status', fluxo: idFluxo, estado: idStatus}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			if (!options.orderBy) {
				options.orderBy	= ['nom_ocor_fluxo'];
				options.asc		= [true];
			}

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.addTicketFlowStatus = function (idFlow, model, callback) {
			return this.DTSPost({ method: 'status', flow: idFlow }, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.updateTicketFlowStatus = function (idFlow, idStatus, model, callback) {
			return this.DTSPut({
				method: 'status',
				flow: idFlow,
				status: idStatus
			}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.deleteTicketFlowStatus = function (idStatus, callback) {
			return this.TOTVSRemove({ method: 'status', status: idStatus }, callback);
		};

		factory.reorderTicketFlowStatus = function (idStatus, callback) {
			return this.TOTVSUpdate({ method: 'status_order', flow_status: idStatus }, { method: 'status_order' }, callback);
		};

		return factory;
	}; // factoryTicketFlow
	factoryTicketFlow.$inject = [
		'$totvsresource', 'crm.generic.factory', 'crm.generic.zoom.factory', '$cacheFactory', 'crm.generic.create.update.factory', 'crm.generic.detail.factory', 'crm.generic.delete.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_ocor_fluxo.factory', factoryTicketFlow);
	index.register.service('crm.ticket-flow.helper', ticketFlowHelper);
});
