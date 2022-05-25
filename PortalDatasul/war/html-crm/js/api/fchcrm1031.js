/*global $, index, angular, define, TOTVSEvent, CRMURL*/
define([
	'index',
	'/dts/crm/js/crm-factories.js',
	'/dts/crm/js/api/fchcrm1004.js'
], function (index) {
	'use strict';

	var ticketSubjectHelper,
		factoryTicketSubject;
	// *************************************************************************************
	// *** HELPER
	// *************************************************************************************


	ticketSubjectHelper = function (legend) {

		this.filtersGroup = 'totvs.crm.portal.accounts.filters';

		this.parseSubjectType = function (subject) {
			if (subject && subject.idi_tip_assunto_ocor) {
				subject.nom_tipo = legend.subjectType.NAME(subject.idi_tip_assunto_ocor);
				subject.ttType = {
					num_id : subject.idi_tip_assunto_ocor,
					nom_tipo : subject.nom_tipo
				};
			}
		};
        
        this.parseManifestationType = function (subject) {
			if (subject && subject.idi_tip_manif != undefined) {
				subject.ttManifestationType = {
					num_id : subject.idi_tip_manif,
					nom_tipo : legend.manifestationType.NAME(subject.idi_tip_manif)
				};
			}
		};
        
        this.parseServiceCategory = function (subject) {
			if (subject && subject.idi_categ_atendim) {
				subject.ttServiceCategory = {
					num_id : subject.idi_categ_atendim,
					nom_tipo : legend.serviceCategory.NAME(subject.idi_categ_atendim)
				};
			}
		};

	};
	ticketSubjectHelper.$inject = ['crm.legend'];
	// *************************************************************************************
	// *** FACTORY
	// *************************************************************************************


	factoryTicketSubject = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericZoom,
							   factoryGenericTypeahead, factoryGenericCreateUpdate, factoryGenericDetail,
							   factoryGenericDelete,  ReportService) {

		var cache = $cacheFactory('crm.ticket-subject.Cache'),
			actions = angular.copy(factoryGenericCreateUpdate.customActions),
			factory;

		actions.DTSPostNoCountRequest = {
			method: 'POST',
			isArray: true,
			headers: {noCountRequest: true}
		};

		factory = $totvsresource.REST(
			CRMURL.ticketSubjectService + ':method/:id',
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

			if (!options.orderBy) { options.orderBy =  ['nom_assunto_ocor']; }
			if (options.asc === undefined) { options.asc = [true]; }

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getAll = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'ticket-subject-getAll',
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

		factory.getSubjects = function (callback, isAllowedCache, active) {

			//isAllowedCache = isAllowedCache !== false;
			var result; //var idCache = 'ticket-subject';
			//var result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'subjects', active: active}, function (data) {
					//cache.put(idCache, data);
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
			name = name + '_CRM_ASSUNTOS';
			if (angular.isUndefined(filters)) {
				filters = [];
			} else if (!angular.isArray(filters)) {
				filters = [ filters ];
			}
			for (i = 0; i < filters.length; i++) {
				properties.push(filters[i].property);
				values.push(filters[i].value);
			}
			return ReportService.run('crm/rel_ticket_subject_export', {
				program: '/report/crm/crm0011',
				format: 'XLSX',
				download: isOnline,
				publish: publish,
				resultFileName: name,
				c_properties: properties,
				c_values: values
			}, {}, callback);
		};

		return factory;
	}; // factorySubject
	factoryTicketSubject.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory', 'crm.generic.zoom.factory',
		'crm.generic.typeahead.factory', 'crm.generic.create.update.factory', 'crm.generic.detail.factory',
		'crm.generic.delete.factory',  'ReportService'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.ticket-subject.helper',    ticketSubjectHelper);

	index.register.factory('crm.crm_assunto_ocor.factory', factoryTicketSubject);

});
