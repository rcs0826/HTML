/*globals angular, index, define, CRMUtil, CRMURL */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-factories.js',
	'/dts/crm/js/api/fchcrm1004.js'
], function (index) {

	'use strict';

	var factoryReport,
		helperReport;

	// *************************************************************************************
	// *** HELPER
	// *************************************************************************************

	helperReport = function (legend) {

		this.parameterTypes = [
			{ num_id: 1, nom_tipo: legend.reportParameterType.NAME(1) },
			{ num_id: 2, nom_tipo: legend.reportParameterType.NAME(2) },
			// { num_id: 3, nom_tipo: legend.reportParameterType.NAME(3) }, Tipo Zoom comentado devido a não estar completamente implementado
			{ num_id: 4, nom_tipo: legend.reportParameterType.NAME(4) },
			{ num_id: 5, nom_tipo: legend.reportParameterType.NAME(5) },
			{ num_id: 6, nom_tipo: legend.reportParameterType.NAME(6) }
		];

		this.parseParameterType = function (parameters) {

			parameters = parameters || [];

			if (!angular.isArray(parameters)) {
				parameters = [parameters];
			}

			var i, parameter;
            

			for (i = 0; i < parameters.length; i++) {

				parameter = parameters[i];

                switch (parameter.idi_tip_campo) {
                case 1:
                    parameter.ttTipo = this.parameterTypes[0];
                    break;
                case 2:
                    parameter.ttTipo = this.parameterTypes[1];
                    break;
                case 4:
                    parameter.ttTipo = this.parameterTypes[2];
                    break;
                case 5:
                    parameter.ttTipo = this.parameterTypes[3];
                    break;
                case 6:
                    parameter.ttTipo = this.parameterTypes[4];
                    break;
                }

				/*if (parameter) { quando o tipo zoom = 3 for implementado o trecho abaixo pode substituir o switch acima
					parameter.ttTipo = this.parameterTypes[parameter.idi_tip_campo - 1];
				}*/
			}

			return parameters;
		};
	};

	helperReport.$inject = ['crm.legend'];

	// *************************************************************************************
	// *** FACTORY
	// *************************************************************************************

	factoryReport = function ($totvsresource, factoryGeneric,
							  factoryGenericZoom, factoryGenericTypeahead,
							  factoryGenericCreateUpdate, factoryGenericDetail,
							  factoryGenericDelete, factoryPreference, legend) {

		var factory = $totvsresource.REST(CRMURL.reportService + ':method/:id',
			undefined, factoryGenericCreateUpdate.customActions);

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericDelete);
		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericTypeahead);
		angular.extend(factory, factoryGenericCreateUpdate);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			if (!options.orderBy) { options.orderBy =  ['num_id']; }
			if (CRMUtil.isUndefined(options.asc)) { options.asc =  [false]; }

			return factoryGeneric.findRecords(parameters, options, callback, this, options.cache);
		};

		factory.addUsers = function (idReport, users, callback) {
			return this.DTSPost({ method: 'report_user', id: idReport }, users, callback);
		};

		factory.deleteUser = function (idUser, callback) {
			return this.TOTVSRemove({method: 'report_user', id: idUser}, callback);
		};

		factory.addParameter = function (idReport, model, callback) {
			return this.DTSPost({method: 'report_parameter', report: idReport}, model, function (result) {
				if (result && result.length > 0) {
					result = result[0];
					if (result.hasOwnProperty("ttRelParamAtrib")) {
						result.ttParametroAtributo = angular.copy(result.ttRelParamAtrib);
						delete result.ttRelParamAtrib;
					}
				} else {
					result = undefined;
				}

				if (callback) { callback(result); }
			});
		};

		factory.updateParameter = function (id, idReport, model, callback) {
			return this.DTSPut({method: 'report_parameter', id: id, report: idReport}, model, function (result) {
				if (result && result.length > 0) {
					result = result[0];
					if (result.hasOwnProperty("ttRelParamAtrib")) {
						result.ttParametroAtributo = angular.copy(result.ttRelParamAtrib);
						delete result.ttRelParamAtrib;
					}
				} else {
					result = undefined;
				}

				if (callback) { callback(result); }
			});
		};

		factory.deleteParameter = function (idParameter, callback) {
			return this.TOTVSRemove({method: 'report_parameter', id: idParameter}, callback);
		};

		factory.getAvailableReports = function (idModule, callback) {

			var filters = [], options;

			if (idModule && idModule > 0) {
				filters.push({ property: 'idi_modul_crm', value: idModule + "|" + legend.crmModules.ID.GENERAL });
			}

			filters.push({ property: 'crm_usuar_relat_web.num_id_usuar', value: 'availables' });

			options = { start: 0, end: 500, type: 5, cache: true};

			return factory.findRecords(filters, options, callback);
		};

		factory.findZoomData = function (idParameter, value, callback) {
			return this.TOTVSQuery({method: 'report_zoom_data', id: idParameter, value: value}, callback);
		};

		factory.getBirtDatabaseType = function (callback) {
			return factoryPreference.getPreference('BIRT_DATABASE', callback);
		};

		factory.getBirtDatabaseDateFromat = function (callback) {
			return factoryPreference.getPreference('BIRT_DATABASE_DATE', callback);
		};

		factory.getBirtURLPath = function (callback) {
			return factoryPreference.getPreference('BIRT_CRM', callback);
		};

		factory.getBirtExternalURL = function (callback) {
			return factoryPreference.getPreference('BIRT_EXTERNAL_SERVER_URL', callback);
		};

		return factory;
	};

	factoryReport.$inject = [
		'$totvsresource', 'crm.generic.factory', 'crm.generic.zoom.factory',
		'crm.generic.typeahead.factory', 'crm.generic.create.update.factory',
		'crm.generic.detail.factory', 'crm.generic.delete.factory',
		'crm.crm_param.factory', 'crm.legend'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.service('crm.report.helper', helperReport);

	index.register.factory('crm.crm_relat_web.factory', factoryReport);

});
