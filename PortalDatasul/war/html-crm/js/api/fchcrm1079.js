/*globals index, define, angular, CRMUtil, CRMRestService */
define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryAnwserAnalyzer;

	// *************************************************************************************
	// *** FACTORY
	// *************************************************************************************

	factoryAnwserAnalyzer = function ($totvsresource, ReportService) {

		var factory = $totvsresource.REST(CRMRestService + '1079/:method/:id');

		factory.getDataByPage = function (script, filter, callback) {

			filter = filter || {};

			if (CRMUtil.isDefined(filter.end)) {
				filter.end = new Date(filter.end);
				filter.end.setDate(filter.end.getDate() + 1);
				filter.end = filter.end.getTime();
			}

			return this.TOTVSQuery({ id: script, page: filter.page, start: filter.start, end: filter.end }, function (result) {

				if (result && result.length > 0) {

					result = result[0];

					if (result.hasOwnProperty('ttPagina')) {

						if (result.ttPagina.length > 0) {
							result = angular.copy(result.ttPagina[0]);
						} else {
							result = undefined;
						}
					} else {
						result = undefined;
					}
				} else {
					result = undefined;
				}

				if (callback) { callback(result); }
			});
		};

		factory.getSummary = function (script, filter, callback) {

			filter = filter || {};

			if (CRMUtil.isDefined(filter.end)) {
				filter.end = new Date(filter.end);
				filter.end.setDate(filter.end.getDate() + 1);
				filter.end = filter.end.getTime();
			}

			return this.TOTVSQuery({ method: 'summary', id: script, start: filter.start, end: filter.end }, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.exportData = function (script, range, callback) {

			if (CRMUtil.isUndefined(script)) { return; }

			range = range || {};

			if (CRMUtil.isDefined(range.end)) {
				range.end = new Date(range.end);
				range.end.setDate(range.end.getDate() + 1);
				range.end = range.end.getTime();
			}

			var now = new Date(),
				name;

			name = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
			name = name + '_' + now.getHours() + '-' + now.getMinutes() + '-' + now.getSeconds();
			name = name + ' - ' + script.nom_script;

			return ReportService.run('crm/rel_script_export', {
				program: '/report/crm/crm0002',
				resultFileName: name,
				format: 'XLSX',
				i_id: script.num_id,
				d_start: range.start,
				d_end: range.end
			}, {}, callback);
		};

		return factory;
	};

	factoryAnwserAnalyzer.$inject = ['$totvsresource', 'ReportService'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_script_respos.analyzer.factory', factoryAnwserAnalyzer);

});
