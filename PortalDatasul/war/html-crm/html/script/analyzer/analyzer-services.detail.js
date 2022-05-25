/*globals index, angular, define, TOTVSEvent, CRMUtil */
/*jslint plusplus:true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1068.js',
	'/dts/crm/js/api/fchcrm1079.js',
	'/dts/crm/js/zoom/crm_script.js',
	'/dts/crm/html/script/analyzer/page/page-services.tab.js',
	'/dts/crm/html/script/analyzer/page/question/question-services.tab.js'
], function (index) {

	'use strict';

	var controller;

	// *************************************************************************************
	// *** CONTROLLER DETAIL
	// *************************************************************************************

	controller = function ($rootScope, $scope, $stateParams, $state, TOTVSEvent, appViewService,
							$location, legend, helper, factory, scriptHelper, analyzerFactory,
							serviceScriptAnalyzerPageTab, serviceScriptAnalyzerPageQuestionTab) {

		var CRMControl = this;

		this.model = undefined;
		this.selectedScript = undefined;
		this.selectedPage = undefined;
		this.message = 'msg-script-not-selected';

		angular.extend(this, serviceScriptAnalyzerPageTab);
		angular.extend(this, serviceScriptAnalyzerPageQuestionTab);

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.onChangeScript = function (value) {
			scriptHelper.parseScriptType(value);
			CRMControl.model = undefined;
		};

		this.getScripts = function (value) {
			if (!value || value === '') { return []; }

			var filter = [{property: 'nom_script', value: helper.parseStrictValue(value)},
						  {property: 'custom.status', value: 2},
						  {property: 'custom.status', value: 3}],
				i;
			factory.typeahead(filter, undefined, function (result) {

				CRMControl.scripts = result;

				for (i = 0; i < CRMControl.scripts.length; i++) {
					scriptHelper.parseScriptType(CRMControl.scripts[i]);
				}
			});
		};

		this.apply = function () {

			if (CRMControl.filterScript === undefined) { return; }

			var parameters;

			parameters = {
				id: CRMControl.filterScript.num_id
			};

			if (CRMControl.filterRange && CRMControl.filterRange.start > 0) {
				parameters.start = CRMControl.filterRange.start;
			} else {
				parameters.start = null;
			}

			if (CRMControl.filterRange && CRMControl.filterRange.end > 0) {
				parameters.end = CRMControl.filterRange.end;
			} else {
				parameters.end = null;
			}

			$state.go('dts/crm/script.analyzer', parameters, {reload: true, location: true});

		};

		this.load = function (id) {

			var filter, data;

			factory.getRecord(id, function (result) {

				if (!CRMUtil.isDefined(result)) { return; }

				CRMControl.model = result;

				if (CRMControl.model.num_livre_1 === 1) {
					CRMControl.model = undefined;
					CRMControl.message = 'msg-script-not-ready-analyzer';
					return;
				}

				scriptHelper.parseScriptColor(CRMControl.model);
				scriptHelper.parseScriptType(CRMControl.model);

				filter = {
					start: undefined,
					end: undefined
				};

				if (CRMUtil.isDefined(CRMControl.filterRange)) {
					filter.start = CRMControl.filterRange.start;
					filter.end = CRMControl.filterRange.end;
				}

				analyzerFactory.getSummary(id, filter, function (result) {

					if (CRMUtil.isUndefined(result)) { return; }

					if (result.num_total_respostas > 0) {
						data =
							[{
								category: $rootScope.i18n('l-anwser-pending', [], 'dts/crm'),
								value: (result.num_total_pendente / result.num_total_respostas * 100).toFixed(2),
								total: result.num_total_pendente,
								color: "#4474ED"
							}, {
								category: $rootScope.i18n('l-anwser-parcial', [], 'dts/crm'),
								value: (result.num_total_parcial / result.num_total_respostas * 100).toFixed(2),
								total: result.num_total_parcial,
								color: "#F0CA38"
							}, {
								category: $rootScope.i18n('l-anwser-finished', [], 'dts/crm'),
								value: (result.num_total_finalizado / result.num_total_respostas * 100).toFixed(2),
								total: result.num_total_finalizado,
								color: "#5F9653"
							}];
					} else {
						data = [];
					}

					result.$selected = true;
					result.nom_pag = $rootScope.i18n("l-summary", [], 'dts/crm');
					result.options = {
						legend: {
							position: "bottom"
						},
						valueAxis: {
							majorUnit: 1
						},
						seriesDefaults: {
							labels: {
								visible: true,
								background: "transparent",
								template: "#= category #: \n #= value #%"
							}
						},
						tooltip: {
							visible: true,
							template: function (dataItem) {
								return dataItem.dataItem.total +  " - " + dataItem.dataItem.category;
							}
						},
						series: [{
							data: data,
							type: "pie"
						}]
					};

					CRMControl.model.ttQuestionarioPagina.unshift(result);
					CRMControl.selectPage(CRMControl.model.ttQuestionarioPagina[0]);

				});

				if (CRMUtil.isDefined(CRMControl.model)) {
					CRMControl.filterScript = {
						num_id: CRMControl.model.num_id,
						nom_script: CRMControl.model.nom_script,
						idi_tip_script: CRMControl.model.idi_tip_script,
						nom_tip_script: CRMControl.model.nom_tip_script
					};
				}
				CRMControl.filterRangeControl = true;

			});
		};

		this.exportData = analyzerFactory.exportData;

		// *************************************************************************************
		// *** INIT
		// *************************************************************************************

		this.init = function () {

			var viewName = $rootScope.i18n('nav-script-analyzer', [], 'dts/crm'),
				viewController = 'crm.script-analyzer.detail.control',
				rangeParam = {},
				rangeFilter;

			helper.loadCRMContext(function () {

				CRMControl.model = undefined;
				CRMControl.filterRangeControl = false;

				helper.startView(viewName, viewController, CRMControl);

				if ($stateParams && $stateParams.id) {

					rangeFilter = $state.params;

					if (rangeFilter.start && parseInt(rangeFilter.start, 10) > 0) {
						rangeParam.start = parseInt(rangeFilter.start, 10);
					}

					if (rangeFilter.start && parseInt(rangeFilter.end, 10) > 0) {
						rangeParam.end = parseInt(rangeFilter.end, 10);
					}

					if (rangeParam.end > 0 || rangeParam.start > 0) {
						CRMControl.filterRange = rangeParam;
					} else if (rangeFilter.start === undefined && rangeFilter.end === undefined) {
						CRMControl.filterRange = undefined;
					}

					CRMControl.load($stateParams.id);
				}

			});
		};

		if ($rootScope.currentuserLoaded) { this.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControl = undefined;
		});

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			CRMControl.init();
		});
	};

	controller.$inject = [
		'$rootScope',
		'$scope',
		'$stateParams',
		'$state',
		'TOTVSEvent',
		'totvs.app-main-view.Service',
		'$location',
		'crm.legend',
		'crm.helper',
		'crm.crm_script.factory',
		'crm.script.helper',
		'crm.crm_script_respos.analyzer.factory',
		'crm.script-analyzer-page.tab.service',
		'crm.script-analyzer-page-question.tab.service'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.script-analyzer.detail.control', controller);

});
