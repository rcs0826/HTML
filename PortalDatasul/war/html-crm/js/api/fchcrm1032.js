/*global $, index, angular, define, TOTVSEvent, CRMURL*/
define([
	'index',
	'/dts/crm/js/crm-factories.js',
	'/dts/crm/js/api/fchcrm1004.js'
], function (index) {

	'use strict';

	var factoryTicketType;

	factoryTicketType = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericZoom,
							   factoryGenericTypeahead, factoryGenericCreateUpdate, factoryGenericDetail,
							   factoryGenericDelete, ReportService) {

		var cache = $cacheFactory('crm.ticket-type.Cache'),
			actions = angular.copy(factoryGenericCreateUpdate.customActions),
			factory;

		actions.DTSPostNoCountRequest = {
			method: 'POST',
			isArray: true,
			headers: {noCountRequest: true}
		};

		factory = $totvsresource.REST(
			CRMURL.ticketTypeService + ':method/:id',
			undefined,
			factoryGenericCreateUpdate.customActions
		);

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericTypeahead);
		angular.extend(factory, factoryGenericDelete);
		angular.extend(factory, factoryGenericCreateUpdate);

		factory.findRecords = function (parameters, options, callback) {
			options = options || {};

			if (!options.orderBy) { options.orderBy =  ['nom_tip_ocor']; }
			if (options.asc === undefined) { options.asc = [true]; }

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getAll = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'ticket-type-getAll',
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

		factory.getTicketTypes = function (active, callback, isAllowedCache) {

			//isAllowedCache = isAllowedCache !== false;
			//var idCache = 'ticket-type';
			var result; //var result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'ticketTypes', active: active}, function (data) {
					//cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getTypesBySubject = function (subjectId, callback, isAllowedCache) {

			//isAllowedCache = isAllowedCache !== false;
			//var idCache = 'ticket-type-by-subject';
			var result; //var result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'ticketTypesBySubject', subjectId: subjectId}, function (data) {
					//cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};


		factory.getSubjectsByTicketType = function (idTicketType, callback, typeResult) {
			if (!typeResult) { typeResult = 0; }
			return this.TOTVSQuery({method: 'subjects', ticketType: idTicketType, typeResult: typeResult}, callback);
		};
        
        //categoria = tipo de ocorrencia
		factory.saveSubject = function (idTicketType, model, callback) {
			return this.DTSPost({
                method: 'subject', 
                ticketType: idTicketType
            }, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
        };
        
        //motivos da categoria = assuntos associados ao tipo de ocorrencia
		factory.updateSubject = function (idTicketType, idSubject, model, callback) {
			return this.DTSPut({
				method: 'subject',
                ticketType: idTicketType,
				idSubject: idSubject
			}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});            
		};         

		factory.addSubjectsByTicketType = function (idTicketType, models, callback) {
			return this.DTSPost({method: 'subjects', ticketType: idTicketType}, models, callback);
		};

		factory.removeSubjectByTicketType = function (id, callback) {
			return this.TOTVSRemove({method: 'subject', id: id}, callback);
		};
		
		factory.exportSearch = function (isIntegratedWithGP, isActiveRestrictSubject, filters, isOnline, callback) {
			var i,
				name,
				now = new Date(),
				properties = [],
				values = [],
				publish = (isOnline !== true);
			name = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
			name = name + '_' + now.getHours() + '-' + now.getMinutes() + '-' + now.getSeconds();
			name = name + '_CRM_TIPOS';
			if (angular.isUndefined(filters)) {
				filters = [];
			} else if (!angular.isArray(filters)) {
				filters = [ filters ];
			}
			for (i = 0; i < filters.length; i++) {
				properties.push(filters[i].property);
				values.push(filters[i].value);
			}
			if (isIntegratedWithGP && isActiveRestrictSubject) {
				return ReportService.run('crm/rel_ticket_type_gp_export', {
					program: '/report/crm/crm0012',
					format: 'XLSX',
					download: isOnline,
					publish: publish,
					resultFileName: name,
					c_properties: properties,
					c_values: values
				}, {}, callback);
			} else {
				return ReportService.run('crm/rel_ticket_type_export', {
					program: '/report/crm/crm0012',
					format: 'XLSX',
					download: isOnline,
					publish: publish,
					resultFileName: name,
					c_properties: properties,
					c_values: values
				}, {}, callback);
			}
		};

		return factory;
	}; // factoryTicketType
	factoryTicketType.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory', 'crm.generic.zoom.factory',
		'crm.generic.typeahead.factory', 'crm.generic.create.update.factory', 'crm.generic.detail.factory',
		'crm.generic.delete.factory', 'ReportService'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_tip_ocor.factory', factoryTicketType);

});
