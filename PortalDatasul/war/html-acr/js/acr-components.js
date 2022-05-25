/*globals angular, define, ACRUtil, kendo */
/*jslint plusplus: true*/
/*jslint es5: true */

/***************************************
### ACR - Components
***************************************/
define([
	'index',
	'totvs-html-framework',
	'/dts/acr/js/acr-utils.js'
], function (index) {

	'use strict';

	// ########################################################
	// ### CUSTOM - FRAMEWORK - TOTVS WIDGET HEADER
	// ########################################################

	index.register.directive('acrTotvsWidgetHeader', ['$window', function ($window) {

		var directive = {
			template:
				'<div class="panel-heading">' +
					'<div class="row">' +
						'<div class="col-xs-12">' +
							'<h3 class="panel-title" style="display:inline">{{title}}</h3>&nbsp;' +
							'<span class="pull-right">' +
							'<span ng-show="showList" ng-if="hasList" class="clickable glyphicon glyphicon-list" ' +
								'aria-hidden="true" ng-click="callList()">&nbsp;</span>' +
							'<span ng-show="showCharts" ng-if="hasCharts" class="clickable glyphicon glyphicon-stats" ' +
								'aria-hidden="true" ng-click="callCharts()">&nbsp;</span>' +
							'<span ng-show="showSettings" ng-if="hasSettings" class="clickable glyphicon glyphicon-cog" ' +
								'aria-hidden="true" ng-click="callSettings()"></span>' +
						  '</span>' +
						'</div>' +
					'</div>' +
				'</div>',
			restrict: 'E',
			transclude: true,
			replace: true,
			scope: {
				title: '@',
				settings: '&',
				showSettings: '=?',
				list: '&',
				showList: '=?',
				charts: '&',
				showCharts: '=?'
			},
			compile: function () {

				return function postLink(scope, element, attrs) {

					scope.hasList = attrs.$attr.hasOwnProperty('list');
					scope.hasSettings = attrs.$attr.hasOwnProperty('settings');
					scope.hasCharts = attrs.$attr.hasOwnProperty('charts');

					if (angular.isUndefined(scope.showSettigns)) {
						scope.showSettings = true;
					}

					if (angular.isUndefined(scope.showList)) {
						scope.showList = true;
					}

					if (angular.isUndefined(scope.showCharts)) {
						scope.showCharts = true;
					}

					scope.callSettings = function () {
						scope.settings();
					};

					if (angular.isFunction(scope.list)) {
						scope.callList = function () {
							scope.list();
						};
					}

					if (angular.isFunction(scope.charts)) {
						scope.callCharts = function () {
							scope.charts();
						};
					}
				};

			}
		};

		return directive;
	}]);

	// ########################################################
	// ### CUSTOM - FRAMEWORK - TOTVS WIDGET FOOTER ACTIONS
	// ########################################################

	index.register.directive('acrTotvsWidgetFooterActions', [function () {

		var directive = {
			restrict: 'E',
			compile: function (element) {

				var actions = element.children('action').clone() || [],
					actionsTemplate = '',
					listContainer,
					action,
					parse,
					item,
					i;

				element.html('<span class="actions"></span>');

				parse = function (el, action) {

					var link = action.attr('link'),
						ngClick = action.attr('ng-click');

					el.append(action.text());

					if (link) {
						el.attr('href', link);
					} else if (ngClick) {
						el.addClass('clickable');
						el.attr('ng-click', ngClick);
					}
				};

				if (actions.length > 1) {
					actionsTemplate = angular.element(
						'<span class="pull-right dropup">' +
							'<span class="widget-details clickable dropdown-toggle" id="widget-detail-dropdown" ' +
								'data-toggle="dropdown" aria-expanded="true">' +
								'<a class="cliclable" role="button">{{ "nav-action" | i18n : [] : "dts/acr/" }}&nbsp;' +
									'<span class="caret"></span>' +
								'</a>' +
							'</span>' +
							'<ul class="dropdown-menu" role="menu" aria-labelledby="widget-detail-dropdown"></ul>' +
							'<span>'
					);

					listContainer = actionsTemplate.find('ul');

					for (i = 0; i < actions.length; i++) {
						action = angular.element(actions[i]);
						item = angular.element('<li role="presentation"><a role="menuitem" tabindex="-1"></a></li>');
						parse(item.children('a'), action);
						listContainer.append(item);
					}
				}

				if (actions.length === 1) {
					actionsTemplate = angular.element(
						'<span class="pull-right">' +
							'<a class="btn btn-link" role="menuitem" tabindex="-1"></a>' +
							'<span>'
					);

					action = angular.element(actions[0]);
					parse(actionsTemplate.children('a'), action);
				}

				element.find('.actions').append(actionsTemplate);
			}
		};

		return directive;
	}]);

	// ########################################################
	// ### CUSTOM - FRAMEWORK - TOTVS CHART
	// ########################################################

	index.register.directive('acrTotvsChart', function () {

		var directive = {
			template: '<div kendo-chart class="acr-totvs-chart" k-options="chart"></div>' +
				'<div class="totvs-chart-no-data" ng-show="!tSeries || !tSeries.length"><div>Sem dados</div></div>',
			restrict: 'E',
			scope: {
				tTitle: '@',
				tTitlePosition: '@',
				tTypeChart: '@',
				tSeries: '=',
				tCategories: '=',
				tCategoryField: '=',
				tValueMax: '=',
				tValueMin: '=',
				tRemoteData: '=',
				tHeight: '=',
				tWidth: '=',
				tOnClick: '&',
				tOnHover: '&',
				tSetExport: '&',
				tChartTooltip: '=?',
				tOptions: '=?'
			},
			link: function (scope, element, attrs) {

				var chart, exports;

				function getKendoChart() {
					if (chart) { return chart; }
					chart = element.find('[kendo-chart]').getKendoChart();
					return chart;
				}

				function getChartName(title) {
					var name = title || 'chart';
					return name;
				}

				function exportToPng() {
					getKendoChart().exportImage().done(function (data) {
						var chartName = getChartName(scope.tTitle) + '.png';
						kendo.saveAs({
							dataURI: data,
							fileName: chartName
						});
					});
				}

				function exportToPdf() {
					getKendoChart().exportPDF({ paperSize: 'A5', landscape: true }).done(function (data) {
						var chartName = getChartName(scope.tTitle) + '.pdf';
						kendo.saveAs({
							dataURI: data,
							fileName: chartName
						});
					});
				}

				scope.$watch('tSeries', function (newValue, oldValue) {
					if (newValue !== oldValue) {
						getKendoChart().options.series = newValue;
						getKendoChart().refresh();
					}
				});

				scope.$watch('tCategories', function (newValue, oldValue) {
					if (newValue !== oldValue) {
						getKendoChart().options.categoryAxis.categories = newValue;
						getKendoChart().refresh();
					}
				});

				scope.$watch('tTypeChart', function (newValue, oldValue) {
					if (newValue !== oldValue) {
						var i, size = getKendoChart().options.series.length;
						for (i = 0; i < size; i += 1) {
							getKendoChart().options.series[i].type = newValue;
						}

						getKendoChart().refresh();
					}
				});

				scope.$watch('tOptions', function (newValue, oldValue) {
					if (newValue !== oldValue) {
						if (angular.isDefined(newValue)) {
							angular.extend(getKendoChart().options, newValue);
							getKendoChart().refresh();
						}
					}
				});

				if (attrs.tSetExport) {
					exports = { pdf: exportToPdf, png: exportToPng };
					scope.tSetExport()(exports);
				}

				if (!attrs.tChartTooltip) {
					scope.tChartTooltip = { visible: true };
				}

				scope.chart = {
					theme: 'bootstrap',
					legend: {
						position: 'bottom'
					},
					title: {
						position: scope.tTitlePosition,
						text: scope.tTitle,
						font: '18px Arial,Helvetica,sans-serif'
					},
					seriesDefaults: {
						type: scope.tTypeChart
					},
					dataSource: {
						transport: {
							read: {
								url: scope.tRemoteData,
								dataType: 'json'
							}
						}
					},
					series: scope.tSeries,
					valueAxis: {
						max: scope.tValueMax,
						min: scope.tValueMin,
						line: {
							visible: true
						},
						minorGridLines: {
							visible: false
						}
					},
					chartArea: {
						width: scope.tWidth,
						height: scope.tHeight
					},
					categoryAxis: {
						field: scope.tCategoryField,
						labels: {
							rotation: 'auto'
						},
						categories: scope.tCategories,
						majorGridLines: {
							visible: true
						}
					},
					tooltip: scope.tChartTooltip,
					seriesHover: function (e) {
						if (attrs.tOnHover) {
							e.id = attrs.tId;
							scope.tOnHover()(e);
						}
					},
					seriesClick: function (e) {
						if (attrs.tOnClick) {
							e.id = attrs.tId;
							scope.tOnClick()(e);
						}
					}
				};

				if (angular.isDefined(scope.tOptions)) {
					angular.extend(scope.chart, scope.tOptions);
				}
			}
		};

		return directive;
	});

});
