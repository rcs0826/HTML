/*globals angular, define, CRMUtil, kendo */
/*jslint plusplus: true*/
/*jslint es5: true */

/***************************************
### Portal CRM - Components
***************************************/
define([
	'index',
	'totvs-html-framework',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-calendar-proxy.js'
], function (index) {

	'use strict';

	// ########################################################
	// ### FILTER: GROUP BY
	// ########################################################

	index.register.filter('groupBy', ['$parse', function ($parse) {
		return function (list, groupBy) {

			var filtered = [],
				isGroupChanged = false,
				newField = 'isNewGroup',
				previousItem,
				i,
				j,
				item;

			list = list || [];

			// loop through each item in the list
			for (i = 0; i < list.length; i++) {

				isGroupChanged = false;

				item = list[i];

				// if not the first item
				if (CRMUtil.isDefined(previousItem)) {

					// check if any of the group by field changed

					// force groupBy into Array
					groupBy = angular.isArray(groupBy) ? groupBy : [groupBy];

					// check each group by parameter
					for (j = 0; j < groupBy.length; j++) {
						if ($parse(groupBy[j])(previousItem) !== $parse(groupBy[j])(item)) {
							isGroupChanged = true;
						}
					}


				} else { // otherwise we have the first item in the list which is new
					isGroupChanged = true;
				}

				// this is a field which is added to each item to indicate a new group in the list
				if (isGroupChanged) {
					item[newField] = true;
				} else {
					item[newField] = false;
				}

				filtered.push(item);
				previousItem = item;
			}

			return filtered;
		};
	}]);

	// ########################################################
	// ### FILTER: TRUST HTML
	// ########################################################

	index.register.filter('trustAsHtml', ['$sce', function ($sce) {
		return function (value) {
			if (angular.isString(value)) {
				return $sce.trustAsHtml(value);
			} else {
				return value;
			}
		};
	}]);

	// ########################################################
	// ### FILTER: IS DEFINED
	// ########################################################

	index.register.filter('isDefined', function () {
		return function (value) {
			return CRMUtil.isDefined(value);
		};
	});

	// ########################################################
	// ### FILTER: IS UNDEFINED
	// ########################################################

	index.register.filter('isUndefined', function () {
		return function (value) {
			return CRMUtil.isUndefined(value);
		};
	});

	// ########################################################
	// ### FILTER: SECONDS TO DATE TIME
	// ########################################################

	index.register.filter('secondsToDateTime', function () {
		return function (seconds) {
			return new Date(1970, 0, 1).setSeconds(seconds);
		};
	});

	// ########################################################
	// ### DIRECTIVE: SINGLE CLICK
	// ########################################################

	index.register.directive('singleClick', ['$parse', '$timeout', function ($parse, $timeout) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {

				var delay = 200,
					clicks = 0,
					timer,
					fn = $parse(attrs.singleClick);

				element.on('click', function (event) {

					clicks++;

					if (clicks === 1) {
						timer = $timeout(function () {
							scope.$apply(function () {
								fn(scope, { $event: event });
							});
							clicks = 0;
						}, delay);
					} else {
						if (timer) {
							$timeout.cancel(timer);
						}
						clicks = 0;
					}
				});
			}
		};
	}]);

	// ########################################################
	// ### CUSTOM - FRAMEWORK - TOTVS CHART
	// ########################################################

	index.register.directive('crmTotvsChart', function () {

		var directive = {
			template: '<div kendo-chart class="crm-totvs-chart" k-options="chart"></div>' +
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

	// ########################################################
	// ### CUSTOM - FRAMEWORK - TOTVS WIDGET HEADER
	// ########################################################

	index.register.directive('crmTotvsWidgetHeader', ['$window', function ($window) {

		var directive = {
			template:
				'<div class="panel-heading">' +
					'<div class="row">' +
						'<div class="col-xs-12">' +
							'<h3 class="panel-title" style="display:inline">{{title}}</h3>&nbsp;' +
							'<span ng-transclude></span>' +
							'<span class="pull-right">' +
							'<span ng-show="showRefresh" ng-if="hasRefresh && !help" class="clickable glyphicon glyphicon-refresh" ' +
								'aria-hidden="true" ng-click="callRefresh()">&nbsp;</span>' +
							'<span ng-show="showSettings" ng-if="hasSettings && !help" class="clickable glyphicon glyphicon-cog" ' +
								'aria-hidden="true" ng-click="callSettings()"></span>' +
							'<span ng-if="!hasSettings && !hasRefresh && help" class="clickable glyphicon glyphicon-question-sign" ' +
								'aria-hidden="true" ng-click="callHelp()"></span>' +
							'<div ng-if="hasSettings && hasRefresh && help" class="clickable dropdown-toggle" data-toggle="dropdown" aria-hidden="true">' +
								'<span class="caret" aria-hidden="true"></span>' +
							'</div>' +
							'<ul class="dropdown-menu" role="menu" aria-labelledby="widget-actions-dropdown">' +
								'<li role="presentation"><a role="menuitem" tabindex="-1" ng-show="showRefresh" ng-click="callRefresh()">{{ "l-refresh" | i18n }}</a></li>' +
								'<li role="presentation"><a role="menuitem" tabindex="-1" ng-show="showSettigns" ng-click="callSettings()">{{ "l-settings" | i18n }}</a></li>' +
								'<li role="presentation"><a role="menuitem" tabindex="-1" ng-click="callHelp()">{{ "l-help" | i18n }}</a></li>' +
							'</ul>' +
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
				refresh: '&?',
				showRefresh: '=?',
				help: '@'
			},
			compile: function () {

				return function postLink(scope, element, attrs) {

					scope.hasRefresh = attrs.$attr.hasOwnProperty('refresh');
					scope.hasSettings = attrs.$attr.hasOwnProperty('settings');

					if (angular.isUndefined(scope.showSettigns)) {
						scope.showSettings = true;
					}

					if (angular.isUndefined(scope.showRefresh)) {
						scope.showRefresh = true;
					}

					scope.callHelp = function () {
						$window.open(scope.help);
					};

					scope.callSettings = function () {
						scope.settings();
					};

					if (angular.isFunction(scope.refresh)) {
						scope.callRefresh = function () {
							scope.refresh();
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

	index.register.directive('crmTotvsWidgetFooterActions', [function () {

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
								'<a class="cliclable" role="button">{{ "nav-action" | i18n : [] : "dts/crm/" }}&nbsp;' +
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
	// ### CRM - QUICK SEARCH
	// ########################################################

	index.register.directive('crmQuickSearch', ['$rootScope', 'TOTVSEvent', function ($rootScope, TOTVSEvent) {

		var directive = {
			template:
				'<div class="col-lg-5 col-md-5 col-sm-5 col-xs-12">' +
				'    <div class="filters">' +
				'			<div class="" style="position: relative;top: 8px;float: left;left: -10px;"' +
				'				 ng-if="hideInfo === false">' +
				'				<i class="glyphicon glyphicon-info-sign"' +
				'                  tooltip-placement="bottom"' +
				'                  tooltip-html="infoMessage">' +
				'               </i>' +
				'			</div>' +
				'		<div class="input-group" ng-class="{ \'pull-right\': hideSearch === true }">' +
				'			<div class="input-group-btn"' +
				'			     ng-if="hideSearch === false && attributes.length > 0">' +
				'				<button type="button"' +
				'						class="btn btn-default dropdown-toggle"' +
				'						data-toggle="dropdown">' +
				'					{{ ngModel.name }}' +
				'					<span class="caret"></span>' +
				'				</button>' +
				'				<ul class="dropdown-menu">' +
				'					<li ng-repeat="property in attributes track by $index">' +
				'						<a class="clickable"' +
				'						   ng-click="selectProperty(property);">' +
				'							{{ property.name }}' +
				'						</a>' +
				'					</li>' +
				'				</ul>' +
				'			</div>' +
				'			<input type="text"' +
				'				   class="form-control"' +
				'				   autofocus' +
				'				   ng-if="hideSearch === false"' +
				'				   placeholder="{{ ngModel.placeholder }}"' +
				'				   ng-model="ngModel.value"' +
				'				   on-key-enter="search();">' +
				'			<div ng-class="{ \'input-group-btn\': hideSearch === false, \'btn-group\': hideSearch === true }">' +
				'				<button class="btn btn-default"' +
				'				        ng-if="hideSearch === false"' +
				'						ng-click="callCleanSearch();">' +
				'					<span class="glyphicon glyphicon-remove"></span>' +
				'				</button>' +
				'				<button class="btn btn-default"' +
				'				        ng-if="hideSearch === false"' +
				'						ng-click="search();">' +
				'					<span class="glyphicon glyphicon-filter"></span>' +
				'				</button>' +
				'				<button class="btn btn-default"' +
				'						ng-class="{ \'pull-right\': hideSearch === true }"' +
				'						ng-if="hasAdvancedSearch"' +
				'						ng-click="openAdvancedSearch();">' +
				'					{{ "btn-advanced" | i18n : [] : "dts/crm" }}' +
				'				</button>' +
				'			</div>' +
				'		</div>' +
				'	</div>' +
				'</div>',
			restrict: 'E',
			replace: true,
			scope: {
				ngSubmit:       '&',
				advancedSearch: '&',
				placeholder:    '@',
				hideSearch:     '=',
				attributes:     '=',
				hideInfo:		'=',
				infoMessage:	'=',
				ngModel:        '='
			},
			link: function (scope, element, attrs) {

				var i,
					headerOperationAction = element.parent() ? element.parent().find('.container-operations') : {};

				if (angular.isDefined(scope.attributes)) {
					for (i = 0; i < scope.attributes.length; i++) {
						if (scope.attributes[i].default === true) {
							scope.ngModel = scope.attributes[i];
							break;
						}
					}
				} else {
					scope.ngModel = {
						property: 'custom.quick_search',
						placeholder: scope.placeholder
					};
				}

				scope.$watchCollection('attributes', function (newValue, oldValue) {

					if (angular.isUndefined(newValue) || newValue === oldValue) { return; }

					for (i = 0; i < newValue.length; i++) {
						if (newValue[i].default === true) {
							scope.selectProperty(newValue[i]);
							break;
						}
					}
				}, true);

				if (angular.isFunction(scope.advancedSearch()) === true) {
					scope.hasAdvancedSearch = true;
					headerOperationAction.addClass('col-md-7 col-sm-7 col-lg-7');
				} else {
					scope.hasAdvancedSearch = false;
					headerOperationAction.addClass('col-md-8 col-sm-8 col-lg-8');
				}

				scope.callCleanSearch = function () {
					if (angular.isUndefined(scope.ngModel)) {
						scope.ngModel = { property: 'custom.quick_search' };
					}
					scope.ngModel.value = undefined;
                };
				
				scope.openAdvancedSearch = function () {
					scope.advancedSearch()();
				};

				scope.search = function () {

					if (angular.isUndefined(scope.ngModel)) {
						scope.ngModel = { property: 'custom.quick_search' };
					}
                    
                    if (scope.ngModel && scope.ngModel.property !== 'custom.nom_telef') {
                        scope.ngSubmit()();
                    } else {
                        if (!scope.ngModel.value || (scope.ngModel.value && scope.ngModel.value.trim().length > 4)) {
                            scope.ngSubmit()();
                        } else {
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type:   'error',
                                title:  $rootScope.i18n('l-account', [], 'dts/crm'),
                                detail: $rootScope.i18n('l-phone-message', [5], 'dts/crm')
                            });
                        }
                    }

					
				};

				scope.selectProperty = function (property) {

					if (angular.isDefined(scope.ngModel)) {
						scope.ngModel.value = undefined;
					}

					scope.ngModel = property;

					if (angular.isDefined(scope.ngModel)) {
						if (angular.isUndefined(scope.ngModel.placeholder)) {
							scope.ngModel.placeholder = scope.ngModel.name;
						}
					}
				};
			}
		};

		return directive;
	}]);
    
    
    // ########################################################
	// ### CUSTOM - TREE VIEW
	// ########################################################

    index.register.directive('crmTreeView', function () {
        var directive = {
			template:
                    '<script type="text/ng-template" id="nodes_renderer.html">' +
                    '   <div style="word-break: break-all;" id="node{{node.id}}"ui-tree-handle class="tree-node tree-node-content" ng-click="nodeClick(node)">' +
                    '       <a class="btn btn-success btn-xs" ng-if="node.nodes && node.nodes.length > 0" data-nodrag ng-click="toggle(this)">' +
                    '          <span class="glyphicon"' +
                    '                ng-class="{\'glyphicon-chevron-right\': collapsed, \'glyphicon-chevron-down\': !collapsed}">' +
                    '          </span></a>' +
                    '       {{node.title}}' +
//                    '       <a class="pull-right btn btn-danger btn-xs" data-nodrag ng-click="remove(this)"><span' +
//                    '          class="glyphicon glyphicon-remove"></span></a>' +
//                    '       <a class="pull-right btn btn-primary btn-xs" data-nodrag ng-click="newNode(node)" style="margin-right: 8px;"><span' +
//                    '          class="glyphicon glyphicon-plus"></span></a>' +
                    '   </div>' +
                    '   <ol ui-tree-nodes="" ng-model="node.nodes" ng-class="{hidden: collapsed}">' +
                    '       <li ng-repeat="node in node.nodes" ui-tree-node ng-include="\'nodes_renderer.html\'">' +
                    '       </li>' +
                    '   </ol>' +
                    '</script>' +
                    '<div class="row">' +
//                    '   <div class="col-sm-12" ng-if="nodes && nodes.length > 0">' +
//                    '       <button class="btn btn-primary" ng-click="expandAll()">Expandir Todos</button>' +
//                    '       <button class="btn btn-default" ng-click="collapseAll()">Fechar Todos</button>' +
//                    '   </div>' +
                    '</div>' +
                    '<div class="row">' +
                    '   <div class="col-sm-12" style="padding-left: 5px;">' +
                    '       <div ng-if="nodes && nodes.length > 0" ui-tree id="tree-root" data-drag-enabled="false">' +
                    '           <ol ui-tree-nodes ng-model="nodes">' +
                    '               <div ng-repeat="node in nodes">' +
                    '                   <li ui-tree-node ng-include="\'nodes_renderer.html\'"></li>' +
                    '               </div>' +
                    '           </ol>' +
                    '       </div>' +
                    '   </div>' +
                    '</div>' +
                    '<br/>',
//                    '<totvs-page-alert ng-if="nodes && nodes.length === 0" type="danger" message="Não foram encontrados níveis para a hierarquia">' +
//                    '</totvs-page-alert>',
			restrict: 'E',
			replace: false,
			scope: {
                showUsers: '&',
                addNode: '&',
                remove: '&',
				ngModel: '=',
                nodes: '='
			},
			link: function (scope, element, attrs) {
                scope.collapseAll = function () {
                    scope.$broadcast('angular-ui-tree:collapse-all');
                };

                scope.expandAll = function () {
                    scope.$broadcast('angular-ui-tree:expand-all');
                };
                
                scope.nodeClick = function (node) {
                    scope.showUsers()(node);
                };
                
                scope.newNode = function (node) {
                    scope.addNode()(node);
                };
                
                scope.remove = function (node) {
                    scope.removeNode()(node);
                };
            }
		};

		return directive;
    });
    
	// ########################################################
	// ### 
	// ########################################################
    index.register.directive('bindHtmlCompile', ['$compile', function ($compile) {
        var directive = {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(function () {
                    return scope.$eval(attrs.bindHtmlCompile);
                }, function (value) {
                    element.html(value && value.toString());
            
                    var compileScope = scope;
                    if (attrs.bindHtmlScope) {
                        compileScope = scope.$eval(attrs.bindHtmlScope);
                    }
                    $compile(element.contents())(compileScope);
                });
            }
        };
        
        return directive;
    }]);

	// ########################################################
	// ### FILTER: COUNT PER PAGE
	// ########################################################

	index.register.filter('countPerPage', [function () {
		return function (value, pageSize, realValue) {

			var temp = 0,
				displayCount = 0;

			if (angular.isUndefined(pageSize)) {
				pageSize = 50;
			}

			value = parseInt(value, 10);

			if (value < pageSize) {
				displayCount = value;
			} else {
				if (realValue >= pageSize) {
					temp = value - 1;
					if ((temp % pageSize) === 0) {
						displayCount = (value - 1) + "+";
					} else {
						displayCount = value;
					}
				} else {
					displayCount = value;
				}
			}

			return displayCount;

		};
	}]);

});
