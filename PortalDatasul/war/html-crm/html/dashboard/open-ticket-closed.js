/*globals angular, index, define, TOTVSEvent, CRMUtil*/
/*jslint continue: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1003.js',
    '/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/html/dashboard/open-ticket-closed-parameters.js',
	'/dts/crm/html/ticket/ticket-services.list.js',
    '/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerOpenTicketClosed;

	// *************************************************************************************
	// *** CONTROLLER
	// *************************************************************************************
	controllerOpenTicketClosed = function ($rootScope, $scope, $filter, $location, $totvsprofile,
											TOTVSEvent, helper, helperTicket, ticketFactory,
											serviceTicketParam, modalParametersEdit, modalTicketEdit,
										   accountFactory, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControllerOpenTicketClose = this;

        this.accessRestriction = undefined;
		this.series = [];
		this.options = {};
		this.categories = [];
		this.title = '';
		this.tooltip = undefined;
		this.hasDetail = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.onClickData = function (e) {

			if (CRMUtil.isUndefined(e.dataItem) || e.dataItem.value === 0) { return; }

			var account = {},
				param;

			if (CRMUtil.isDefined(CRMControllerOpenTicketClose.series[0].account)) {
				account.num_id = CRMControllerOpenTicketClose.series[0].account.num_id;
			}

			param = [{
				source : 'l-widget-ticket-open-closed',
				value : helperTicket.openTicketClosedConfig,
				startDate: e.dataItem.startDate,
				endDate: e.dataItem.endDate,
				lineId: e.dataItem.lineId,
				num_id_pessoa: account.num_id
			}];

			// as linhas se cruzam no mesmo ponto, nao ha como diferenciar o click
			if (CRMUtil.isDefined(e.dataItem.openValue) && e.dataItem.openValue === e.dataItem.value) {
				param[0].lineId = 'open-closed';
			}

			serviceTicketParam.setParamTicket(param, function (callback) {
				$scope.safeApply(function () {
					$location.path('/dts/crm/ticket/');
				});
			});
		};

		this.onClickDetail = function () {

			if (CRMControllerOpenTicketClose.hasDetail !== true) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('l-ticket-open-closed', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-no-data-detail', [], 'dts/crm')
				});
				return;
			}

			var account = {},
				param;

			if (CRMUtil.isDefined(CRMControllerOpenTicketClose.series[0].account)) {
				account.num_id = CRMControllerOpenTicketClose.series[0].account.num_id;
			}

			param = [{
				source : 'l-widget-ticket-open-closed',
				value : helperTicket.openTicketClosedConfig,
				num_id_pessoa: account.num_id
			}];

			serviceTicketParam.setParamTicket(param, function (callback) {
				$scope.safeApply(function () {
					$location.path('/dts/crm/ticket/');
				});
			});
		};

		this.showConfig = function () {
			modalParametersEdit.open({
				config: CRMControllerOpenTicketClose.config
			}).then(function (result) {
				if (!result) {
					return;
				}

				CRMControllerOpenTicketClose.config = result.customFilter;
				CRMControllerOpenTicketClose.apply(result.apply);
			});
		};

		this.refresh = function () {
			CRMControllerOpenTicketClose.getConfig(function (config) {
				CRMControllerOpenTicketClose.apply(false);
			});
		};

		this.apply = function (isPersitConfig) {
			var i,
				item,
				config = angular.copy(CRMControllerOpenTicketClose.config),
				getData,
				filter;

			if (CRMControllerOpenTicketClose.isInvalidForm() || !config) { return; }

			getData = function () {
				CRMControllerOpenTicketClose.loadData();
			};

			if (isPersitConfig === true) {
				filter = {
					ttPeriodType: [],
					ttDisplayType: [],
					ttRating: [],
					ttOrigin: [],
					ttPriority: [],
					ttResponsible: [],
					ttType: [],
					ttFlow: []
				};

				if (CRMUtil.isDefined(config.ttPeriodType)) {
					filter.ttPeriodType.push(config.ttPeriodType);
				} else {
					filter.ttPeriodType.push({id: 1, name: $rootScope.i18n('l-day', [], 'dts/crm')});
				}

				if (CRMUtil.isDefined(config.ttDisplayType)) {
					filter.ttDisplayType.push(config.ttDisplayType);
				} else {
					filter.ttDisplayType.push({id: 1, name: $rootScope.i18n('l-day', [], 'dts/crm')});
				}

				if (CRMUtil.isDefined(config.ttRating) && angular.isArray(config.ttRating)) {
					for (i = 0; i < config.ttRating.length; i += 1) {
						item = config.ttRating[i];
						if (item && CRMUtil.isDefined(item.num_id)) {
							filter.ttRating.push({num_id: item.num_id, nom_classif_ocor: item.nom_classif_ocor});
						}
					}
				}

				if (CRMUtil.isDefined(config.ttOrigin) && angular.isArray(config.ttOrigin)) {
					for (i = 0; i < config.ttOrigin.length; i += 1) {
						item = config.ttOrigin[i];
						if (item && CRMUtil.isDefined(item.num_id)) {
							filter.ttOrigin.push({num_id: item.num_id, nom_orig_ocor: item.nom_orig_ocor});
						}
					}
				}

				if (CRMUtil.isDefined(config.ttPriority) && angular.isArray(config.ttPriority)) {
					for (i = 0; i < config.ttPriority.length; i += 1) {
						item = config.ttPriority[i];
						if (item && CRMUtil.isDefined(item.num_id)) {
							filter.ttPriority.push({num_id: item.num_id, nom_priorid_ocor: item.nom_priorid_ocor});
						}
					}
				}

				if (CRMUtil.isDefined(config.ttResponsible) && angular.isArray(config.ttResponsible)) {
					for (i = 0; i < config.ttResponsible.length; i += 1) {
						item = config.ttResponsible[i];
						if (item && CRMUtil.isDefined(item.num_id)) {
							filter.ttResponsible.push({num_id: item.num_id, nom_usuar: item.nom_usuar});
						}
					}
				}

				if (CRMUtil.isDefined(config.ttType) && angular.isArray(config.ttType)) {
					for (i = 0; i < config.ttType.length; i += 1) {
						item = config.ttType[i];
						if (item && CRMUtil.isDefined(item.num_id)) {
							filter.ttType.push({num_id: item.num_id, nom_tip_ocor: item.nom_tip_ocor});
						}
					}
				}

				if (CRMUtil.isDefined(config.ttFlow) && angular.isArray(config.ttFlow)) {
					for (i = 0; i < config.ttFlow.length; i += 1) {
						item = config.ttFlow[i];
						if (item && CRMUtil.isDefined(item.num_id)) {
							filter.ttFlow.push({num_id: item.num_id, nom_ocor_fluxo: item.nom_ocor_fluxo});
						}
					}
				}

				filter = {dsConfigur: filter};

				CRMControllerOpenTicketClose.saveConfig(filter, getData());
				/*
				$totvsprofile.remote.set(helperTicket.openTicketClosedConfig, {
					dataValue: { dsConfigur: filter }
				}, function (result) {
					getData(false);
				});
				*/
			} else {
				getData();
			}
		};

		this.saveConfig = function (config, callback) {
			$totvsprofile.remote.set(helperTicket.openTicketClosedConfig, {dataValue: config}, callback);
		};

		this.getConfig = function (callback) {
			$totvsprofile.remote.get(helperTicket.openTicketClosedConfig, undefined, function (result) {
				var configur = CRMControllerOpenTicketClose.config;

				if (result && angular.isArray(result) && result.length > 0 && result[0].dataValue) {
					configur = result[0].dataValue.dsConfigur;
				}

				if (configur) {
					if (configur.ttPeriodType && angular.isArray(configur.ttPeriodType) && configur.ttPeriodType.length > 0) {
						configur.ttPeriodType = configur.ttPeriodType[0];
					}
					if (configur.ttDisplayType && angular.isArray(configur.ttDisplayType) && configur.ttDisplayType.length > 0) {
						configur.ttDisplayType = configur.ttDisplayType[0];
					}
					if (configur.ttRating) {
						CRMControllerOpenTicketClose.listOfRating = configur.ttRating;
					}
					if (configur.ttOrigin) {
						CRMControllerOpenTicketClose.listOfOrigin = configur.ttOrigin;
					}
					if (configur.ttPriority) {
						CRMControllerOpenTicketClose.listOfPriority = configur.ttPriority;
					}
					if (configur.ttResponsible) {
						CRMControllerOpenTicketClose.listOfResponsible = configur.ttResponsible;
					}
					if (configur.ttType) {
						CRMControllerOpenTicketClose.listOfType = configur.ttType;
					}
					if (configur.ttFlow) {
						CRMControllerOpenTicketClose.listOfFlow = configur.ttFlow;
					}

					CRMControllerOpenTicketClose.config = configur;

				} else {

					CRMControllerOpenTicketClose.config = {
						ttPeriodType: {
							id: 1,
							name: $rootScope.i18n('l-day', [], 'dts/crm')
						},
						ttDisplayType: {
							id: 1,
							name: $rootScope.i18n('l-day', [], 'dts/crm')
						},
						ttRating: [],
						ttOrigin: [],
						ttPriority: [],
						ttResponsible: [],
						ttType: [],
						ttFlow: []
					};
				}

				if (callback) { callback(); }
			});

		};

		this.loadData = function () {
			var i,
				load,
				accountId,
				listOfOpenTicketValue = [],
				listOfClosedTicketValue = [],
				displayType = {},
				dateFormat = $rootScope.i18n('l-date-format', [], 'dts/crm');

			if (CRMControllerOpenTicketClose.isPendingListSearch === true) { return; }

			CRMControllerOpenTicketClose.hasDetail = false;
			CRMControllerOpenTicketClose.series = [];
			CRMControllerOpenTicketClose.options = undefined;
			CRMControllerOpenTicketClose.categories = [];
			CRMControllerOpenTicketClose.title = '';

			load = function () {

				CRMControllerOpenTicketClose.isPendingListSearch = true;

				ticketFactory.getOpenTicketxClosedTicket(helperTicket.openTicketClosedConfig, accountId, function (result) {
					CRMControllerOpenTicketClose.isPendingListSearch = false;

					if (!result) { return; }

					if (CRMUtil.isUndefined(CRMControllerOpenTicketClose)) { return; }

					CRMControllerOpenTicketClose.options = {
						series: CRMControllerOpenTicketClose.series,
						chartArea: {
							height: 282
						}

					};

					if (CRMUtil.isDefined(CRMControllerOpenTicketClose.config.ttDisplayType)) {
						switch (CRMControllerOpenTicketClose.config.ttDisplayType.id) {
						case 7:
							displayType.title = $rootScope.i18n('l-weekly', [], 'dts/crm');
							break;
						case 30:
							displayType.title = $rootScope.i18n('l-monthly', [], 'dts/crm');
							break;
						default:
							displayType.title = $rootScope.i18n('l-daily', [], 'dts/crm');
						}
					}

					if (angular.isArray(result) && result.length > 0) {
						displayType.startDate = $filter('date')(result[0].startDate, dateFormat).toString();

						for (i = 0; i < result.length; i += 1) {
							CRMControllerOpenTicketClose.categories.push(result[i].periodValue);
							listOfOpenTicketValue.push({value: result[i].totalOpen, startDate: result[i].startDate, endDate: result[i].endDate, closeValue: result[i].totalClosed, lineId: "open"});
							listOfClosedTicketValue.push({value: result[i].totalClosed, startDate: result[i].startDate, endDate: result[i].endDate, openValue: result[i].totalOpen, lineId: "closed"});

							if (result[i].totalOpen > 0 || result[i].totalClosed > 0) {
								CRMControllerOpenTicketClose.hasDetail = true;
							}
						}

						displayType.endDate = $filter('date')(result[result.length - 1].endDate, dateFormat).toString();
					}

					if (displayType.startDate === undefined || displayType.endDate === undefined) {
						displayType.title = $rootScope.i18n('l-no-parameterization', [], 'dts/crm');
					} else {
						displayType.title = displayType.title + ": " + $rootScope.i18n('l-from-to', [displayType.startDate, displayType.endDate], 'dts/crm');
					}


					CRMControllerOpenTicketClose.title = displayType.title;

					CRMControllerOpenTicketClose.series = [{
						type: "line",
						name: $rootScope.i18n('l-open-s', [], 'dts/crm'),
						data: listOfOpenTicketValue,
						color: "#F0CA38",
						account: {num_id: accountId}
					}];

					CRMControllerOpenTicketClose.series.push({
						type: "line",
						name: $rootScope.i18n('l-closed-s', [], 'dts/crm'),
						color: "#5F9653",
						data: listOfClosedTicketValue,
						account: {num_id: accountId}
					});

					// revisar qndo sair commit definitivo no frame
					CRMControllerOpenTicketClose.options = {
						series: CRMControllerOpenTicketClose.series,
						chartArea: {
							height: 282
						},
						tooltip: {
							visible: true,
							template: "#= series.name #: #= value #"
						}
					};
				});
			};

			accountId = CRMControllerOpenTicketClose.accountSelected ? CRMControllerOpenTicketClose.accountSelected.num_id : undefined;

			load();

		};

		this.isInvalidForm = function (notShowMessages) {
			var messages = [],
				isInvalidForm = false,
				fields = '',
				message = '',
				isPlural,
				i;

			if (!CRMControllerOpenTicketClose.config.ttPeriodType) {
				isInvalidForm = true;
				messages.push('l-opening-period');
			}

			if (!CRMControllerOpenTicketClose.config.ttDisplayType) {
				isInvalidForm = true;
				messages.push('l-display-type-chart');
			}

			if (isInvalidForm && notShowMessages !== false) {

				isPlural = messages.length > 1;

				message	 = 'msg-form-validation' + (isPlural ? '-plural' : '');

				for (i = 0; i < messages.length; i += 1) {
					fields += $rootScope.i18n(messages[i], [], 'dts/crm');
					if (isPlural && i !== (messages.length - 1)) {
						fields += ', ';
					}
				}

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n('l-ticket-open-closed', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [fields], 'dts/crm')
				});
			}

			return isInvalidForm;
		};

		$scope.safeApply = function (fn) {
			var phase = (this.$root ? this.$root.$$phase : undefined);

			if (phase === '$apply' || phase === '$digest') {
				if (fn && (typeof (fn) === 'function')) {
					fn();
				}
			} else {
				this.$apply(fn);
			}
		};

		this.openTicket = function () {

			var fnOpen = function (account) {
				modalTicketEdit.open({ ticket: { ttConta: account } });
			};

			fnOpen(CRMControllerOpenTicketClose.accountSelected);
		};

		/* posiciona cliente */
		this.onSelectAccountCrm = function (callback) {
			var account = $scope.selectedAccountCRM;

			CRMControllerOpenTicketClose.accountSelected = account;
			CRMControllerOpenTicketClose.parseToolTip(account);

			if (callback) { callback(); }
		};

		this.onSelectCustomer = function (callback) {
			var selected = $scope.selectedcustomer, applyConfig;

			if (CRMControllerOpenTicketClose.accountSelected && selected) {
				if (this.accountSelected.cod_pessoa_erp === selected['cod-emitente'].toString()) {
					return; //ja esta posicionado na conta
				}
			}

			applyConfig = function (account) {
				CRMControllerOpenTicketClose.accountSelected = account;
				CRMControllerOpenTicketClose.parseToolTip(account);

				if (callback) { callback(); }
			};

			if (selected !== undefined) {
				CRMControllerOpenTicketClose.getAccountByERPCode($scope.selectedcustomer['cod-emitente'], function (account) {
					if (CRMUtil.isUndefined(account)) {
						return;
					}

					applyConfig(account);
				});
			} else {
				applyConfig();
			}
		};

		this.getAccountByERPCode = function (codEmitente, callback) {
			accountFactory.getAccountByERPCode(codEmitente, function (result) {
				if (callback) { callback(result); }
			});
		};

		this.parseToolTip = function (account) {
			CRMControllerOpenTicketClose.tooltip = "";

			if (account && account.num_id) {
				CRMControllerOpenTicketClose.tooltip = "<b>" + $rootScope.i18n('l-selected-customer', [], 'dts/mpd/') + "</b>: " + account.nom_razao_social + " (" + account.cod_pessoa_erp + ")";
			}

		};
		/* posiciona cliente */

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {
			helper.loadCRMContext(function () {
                
                accessRestrictionFactory.getUserRestrictions('ticket.list', $rootScope.currentuser.login, function (result) {
                    CRMControllerOpenTicketClose.accessRestriction = result || {};
                });

                
				CRMControllerOpenTicketClose.getConfig(function (result) {
					CRMControllerOpenTicketClose.apply(false);
				});
			});
		};

		if ($rootScope.currentuserLoaded) { CRMControllerOpenTicketClose.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControllerOpenTicketClose = undefined;
		});

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControllerOpenTicketClose.init();
		});

		$scope.$on('selectedcustomer', function (event) {
			if ($scope.selectedAccountCRM) { return; }
			if (CRMControllerOpenTicketClose.accountSelected === $scope.selectedCustomer) { return; }
			CRMControllerOpenTicketClose.onSelectCustomer(CRMControllerOpenTicketClose.apply);
		});

		$scope.$watch(function () {
			return $rootScope.selectedAccountCRM;
		}, function (data, oldData) {
			if (data === undefined && oldData === data) { return; }
			CRMControllerOpenTicketClose.onSelectAccountCrm(CRMControllerOpenTicketClose.apply);
		}, true);

		$scope.$on('$killyourself', function (identifiers) {
			if (!angular.isArray(identifiers)) { return; }

			var i;

			for (i = 0; i < identifiers.length; i += 1) {
				if (CRMUtil.isDefined(identifiers[i].widgetMenuName) && identifiers[i].widgetMenuName === "html-crm.dashboard.open-ticket-closed") {
					CRMControllerOpenTicketClose = undefined;
				}
			}
		});
	};

	controllerOpenTicketClosed.$inject = [
		'$rootScope', '$scope', '$filter', '$location', '$totvsprofile', 'TOTVSEvent', 'crm.helper',
		'crm.ticket.helper', 'crm.crm_ocor.factory', 'crm.ticket.param-service',
		'crm.dashboard.open-ticket-closed.modal.parameter', 'crm.ticket.modal.edit', 'crm.crm_pessoa.conta.factory',
        'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.dashboard.open-ticket-closed.controller', controllerOpenTicketClosed);
});
