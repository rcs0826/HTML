/*globals angular, index, define, TOTVSEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1007.js',
    '/dts/crm/js/api/fchcrm1004.js',
	'/dts/crm/js/api/fchcrm1003.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1001.js',
	'/dts/crm/js/api/fchcrm1076.js',
    '/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/html/dashboard/sales-funnel-parameters.js',
	'/dts/crm/html/opportunity/opportunity-services.detail.js',
	'/dts/crm/html/opportunity/opportunity-services.list.js',
    '/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerSalesFunnel;

	// *************************************************************************************
	// *** CONTROLLER
	// *************************************************************************************
	controllerSalesFunnel = function ($rootScope, $scope, $filter, $location, $totvsprofile,
									  TOTVSEvent, helper, helperOpportunity, opportunityFactory,
									  serviceOpportunityParam, modalParametersEdit,
									   modalOpportunityEdit, accountFactory, strategyFactory, preferenceFactory, 
                                       userFactory, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControllerSalesFunnel = this;

        this.accessRestriction = undefined;
		this.series = [];
		this.seriesColumn = [];
		this.optionsColumn = {};
		this.optionsFunnel = {};
		this.categories = [];
		this.currency = { nom_prefix_moeda: 'R$' };
		this.config = undefined;
		this.isFunnelMode = true;
		this.isIntegratedWithGP = false;
		this.tooltip = undefined;
		this.hasDetail = false;
		this.funnelType = 0;
        this.isUserPortfolio = false;
        
		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.formatCurrency = function (value) {
			return $filter('currency')(value, CRMControllerSalesFunnel.currency.nom_prefix_moeda, 2);
		};

		this.onClickChangeChart = function () {
			CRMControllerSalesFunnel.isFunnelMode = !CRMControllerSalesFunnel.isFunnelMode;
			/*
			CRMControllerSalesFunnel.config.isFunnelMode = CRMControllerSalesFunnel.isFunnelMode;

			$totvsprofile.remote.set(helperOpportunity.funnelConfig, {
				dataValue: CRMControllerSalesFunnel.config
			});
			*/
		};

		this.onClickData = function (e) {
			if (CRMUtil.isUndefined(e.dataItem) || CRMUtil.isUndefined(e.dataItem.phase)) { return; }

			var param = CRMControllerSalesFunnel.getParam(e.dataItem, false);

			serviceOpportunityParam.setParamOpp(param, function (callback) {
				$scope.safeApply(function () {
					$location.path('/dts/crm/opportunity/');
				});
			});

		};

		this.onClickDetail = function () {
			if (CRMControllerSalesFunnel.hasDetail !== true) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('l-opportunity-funnel', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-no-data-detail', [], 'dts/crm')
				});
				return;
			}

			var param,
				series = CRMControllerSalesFunnel.series;

			if (!series || series.length < 1 || CRMUtil.isUndefined(series[0].data) || series[0].data.length < 1) {
				return;
			}

			param = CRMControllerSalesFunnel.getParam(CRMControllerSalesFunnel.series[0].data[0], true);

			serviceOpportunityParam.setParamOpp(param, function (callback) {
				$scope.safeApply(function () {
					$location.path('/dts/crm/opportunity/');
				});
			});
		};

		this.showConfig = function () {
			modalParametersEdit.open({
				config: CRMControllerSalesFunnel.config,
                isUserPortfolio: CRMControllerSalesFunnel.isUserPortfolio
			}).then(function (result) {
				if (!result) {
					return;
				}

				CRMControllerSalesFunnel.config = result.customFilter;
				CRMControllerSalesFunnel.apply(result.apply);
			});
		};

		this.refresh = function () {
			CRMControllerSalesFunnel.getConfig(function (config) {
				CRMControllerSalesFunnel.apply(false);
			});
		};

		this.apply = function (isPersitConfig) {
            var filters = [],
                getData = function () {
                    if (CRMControllerSalesFunnel.isUserPortfolio) {
                        filters.push({property: 'num_id', value: $rootScope.currentuser.idCRM});

                        userFactory.findRecords(filters, {}, function (user) {
                            CRMControllerSalesFunnel.config.ttResponsavel = user[0];
                            CRMControllerSalesFunnel.loadData();
                        });
                    } else {
                        CRMControllerSalesFunnel.loadData();
                    }
                };

			if (CRMControllerSalesFunnel.isInvalidForm()) { return; }

			if (isPersitConfig === true) {
				CRMControllerSalesFunnel.saveConfig(CRMControllerSalesFunnel.config, getData());
			} else {
				getData();
			}
		};

		this.saveConfig = function (config, callback) {
			$totvsprofile.remote.set(helperOpportunity.funnelConfig, {dataValue: config}, callback);
		};

		this.formatNumber = function (value) {
			return $filter('number')(value, 2);
		};

		this.getParam = function (data, allDetail) {

			var filters = {},
				param;

			if (CRMUtil.isDefined(data.strategy) && CRMUtil.isDefined(data.strategy.num_id)) {
				filters.num_id_estrateg_vda = data.strategy.num_id;
			}

			if (allDetail === false && CRMUtil.isDefined(data.phase) && CRMUtil.isDefined(data.phase.num_id)) {
				filters.num_id_fase = data.phase.num_id;
			}

			if (CRMUtil.isDefined(data.responsible) && CRMUtil.isDefined(data.responsible.num_id)) {
				filters.num_id_usuar_respons = data.responsible.num_id;
			}

			if (CRMUtil.isDefined(data.campaign) && CRMUtil.isDefined(data.campaign.num_id)) {
				filters.num_id_campanha = data.campaign.num_id;
			}

			if (CRMUtil.isDefined(data.num_id_pessoa)) {
				filters.num_id_pessoa = data.num_id_pessoa;
			}

			// padrao n considerar suspenso
			if (CRMUtil.isDefined(data.considerSuspended) && data.considerSuspended === true) {
				filters.considerSuspended = data.considerSuspended;
			}

			if (CRMUtil.isDefined(data.overallGoals)) {
				filters.overallGoals = data.overallGoals;
			}

			if ((CRMUtil.isDefined(data.dat_cadastro)) && (CRMUtil.isDefined(data.dat_cadastro.start) || CRMUtil.isDefined(data.dat_cadastro.end))) {
				filters.dat_cadastro_start = data.dat_cadastro.start;
				filters.dat_cadastro_end = data.dat_cadastro.end;
			}

			if ((CRMUtil.isDefined(data.dat_prev_fechto)) && (CRMUtil.isDefined(data.dat_prev_fechto.start) || CRMUtil.isDefined(data.dat_prev_fechto.end))) {
				filters.dat_prev_fechto_start = data.dat_prev_fechto.start;
				filters.dat_prev_fechto_end = data.dat_prev_fechto.end;
			}

			if ((CRMUtil.isDefined(data.dat_fechto_oportun)) && (CRMUtil.isDefined(data.dat_fechto_oportun.start) || CRMUtil.isDefined(data.dat_fechto_oportun.end))) {
				filters.dat_fechto_oportun_start = data.dat_fechto_oportun.start;
				filters.dat_fechto_oportun_end = data.dat_fechto_oportun.end;
			}

			param = [{
				source : 'l-widget-opportunity-funnel',
				value : {
					dsFunnelFilter : {
						ttFunnelFilter : [filters]
					}
				}
			}];

			return param;
		};

		this.getConfig = function (callback) {
			$totvsprofile.remote.get(helperOpportunity.funnelConfig, undefined, function (result) {

				if (result && angular.isArray(result)) {
					result = result[0];
				}

				if (result && result.dataValue) {
					result = result.dataValue;
					//CRMControllerSalesFunnel.isFunnelMode = result.isFunnelMode;
				} else {
					result = {
						log_suspenso: false,
						log_meta_geral: false,
						ttTipoFunil: {
							num_id: 1,
							nom_tipo: $rootScope.i18n('l-value', [], 'dts/crm')
						}
					};
				}

				CRMControllerSalesFunnel.config = result;
				if (callback) { callback(); }
			});
		};

		this.loadConfig = function () {
			var count = 0,
				total = 3,
				afterLoad;

			afterLoad = function () {
				count += 1;
				if (count === total) { CRMControllerSalesFunnel.apply(false); }
			};

			CRMControllerSalesFunnel.getConfig(function (config) {
				afterLoad();
			});

			CRMControllerSalesFunnel.getCurrencyDefault(function (currency) {
				afterLoad();
			});
            
            preferenceFactory.getPreferenceAsBoolean('LOG_CARTEIRA_USU', function (result) {
                CRMControllerSalesFunnel.isUserPortfolio = result || false;
                afterLoad();
            });

		};

		this.getPhasesOmitted = function (strategyId, callback) {
			if (strategyId === undefined) { return; }

			strategyFactory.getPhasesOmitted(strategyId, function (result) {
				if (callback) { callback(result); }
			});
		};

		this.loadData = function () {

			var i,
				j,
				item,
				dValue,
				template,
				accountId,
				load,
				dtRegister,
				dtRegisterStart = '',
				dtRegisterEnd = '',
				dtCloseForecast,
				dtCloseForecastStart = '',
				dtCloseForecastEnd = '',
				dtClose,
				currencyPrefix = '',
				dtCloseStart = '',
				dtCloseEnd = '',
				funnelData = [],
				realizedData = [],
				previousData = [],
				phaseName = [],
				phasesOmitted,
				msgPhasesOmitted = '',
				responsible  = CRMControllerSalesFunnel.config.ttResponsavel || {},
				responsibleId  = responsible.num_id || 0,
				strategy = CRMControllerSalesFunnel.config.ttEstrategia || {},
				strategyId = strategy.num_id || 0,
				campaign = CRMControllerSalesFunnel.config.ttCampanha || {},
				campaignId = campaign.num_id || 0,
				considerSuspended = CRMControllerSalesFunnel.config.log_suspenso || false,
				overallGoals = false,
				dateFormat = $rootScope.i18n('l-date-format', [], 'dts/crm');

			if (CRMControllerSalesFunnel.isPendingListSearch === true) { return; }

			CRMControllerSalesFunnel.funnelType = (CRMControllerSalesFunnel.config.ttTipoFunil ? CRMControllerSalesFunnel.config.ttTipoFunil.num_id : 1);
			CRMControllerSalesFunnel.hasDetail = false;
			CRMControllerSalesFunnel.series = [];
			CRMControllerSalesFunnel.optionsFunnel = undefined;
			CRMControllerSalesFunnel.optionsColumn = undefined;
			CRMControllerSalesFunnel.seriesColumn = [];
			CRMControllerSalesFunnel.categories = [];

			load = function () {

				CRMControllerSalesFunnel.isPendingListSearch = true;

				CRMControllerSalesFunnel.getPhasesOmitted(CRMControllerSalesFunnel.config.ttEstrategia.num_id, function (phasesOmitted) {
					if (phasesOmitted && phasesOmitted.length > 0) {
						for (i = 0; i < phasesOmitted.length; i++) {
							msgPhasesOmitted = msgPhasesOmitted + phasesOmitted[i].des_fase + ", ";
						}
						CRMControllerSalesFunnel.tooltipAlert = $rootScope.i18n('msg-alert-omit-phase-funnel',
																				[msgPhasesOmitted], 'dts/crm');
					}
				});

				opportunityFactory.getOpportunityFunnel(dtCloseForecastStart, dtCloseForecastEnd, dtCloseStart, dtCloseEnd, dtRegisterStart, dtRegisterEnd, CRMControllerSalesFunnel.funnelType, considerSuspended, strategyId, campaignId, responsibleId, overallGoals, accountId, function (result) {

					CRMControllerSalesFunnel.isPendingListSearch = false;

					if (!result) { return; }

					if (CRMUtil.isUndefined(CRMControllerSalesFunnel)) { return; }

					CRMControllerSalesFunnel.optionsFunnel = {
						series: CRMControllerSalesFunnel.series,
						chartArea: {
							height: 300
						}
					};

					CRMControllerSalesFunnel.optionsColumn = {
						series: CRMControllerSalesFunnel.seriesColumn,
						chartArea: {
							height: 300
						}
					};

					for (i = 0; i < result.length; i += 1) {
						item = result[i];

						dValue = parseFloat(item.realizedValue, 10);

						if (dValue > 0) {
							CRMControllerSalesFunnel.hasDetail = true;

							// funnel - realizado
							funnelData.push({
								category: item.phaseName,
								value: dValue,
								color: item.phaseColor,
								phase: {num_id: item.phaseId, des_fase: item.phaseName},
								strategy: strategy,
								responsible: responsible,
								campaign: campaign,
								dat_cadastro: dtRegister,
								dat_fechto_oportun: dtClose,
								dat_prev_fechto: dtCloseForecast,
								considerSuspended: considerSuspended,
								overallGoals: overallGoals,
								num_id_pessoa: accountId
							});
						}

						// bar - realizado
						realizedData.push({
							value: [dValue],
							valueColor: item.phaseColor,
							phase: {num_id: item.phaseId, des_fase: item.phaseName},
							strategy: strategy,
							responsible: responsible,
							campaign: campaign,
							dat_cadastro: dtRegister,
							dat_fechto_oportun: dtClose,
							dat_prev_fechto: dtCloseForecast,
							considerSuspended: considerSuspended,
							overallGoals: overallGoals,
							num_id_pessoa: accountId
						});

						// bar - previsto
						dValue = parseInt(item.phaseValue, 10);

						previousData.push({
							name: item.phaseName,
							value: [dValue]
							//valueColor: "#36648B"
						});

						phaseName.push(item.phaseName);
					}

					CRMControllerSalesFunnel.categories = phaseName;

					if (funnelData && funnelData.length > 0) {

						CRMControllerSalesFunnel.tooltipHelp = $rootScope.i18n('msg-help-opportunity-currency', [CRMControllerSalesFunnel.currency.nom_moeda], 'dts/crm');

						if (CRMControllerSalesFunnel.funnelType === 1) {
							currencyPrefix = CRMControllerSalesFunnel.currency.nom_prefix_moeda + ' ';
						}

						CRMControllerSalesFunnel.series = [{
							type: "funnel",
							segmentSpacing: 2,
							data: funnelData,
							tooltip: {
								visible: true,
								template: "#=category#<br/>" + currencyPrefix + "#=kendo.toString(value, 'n2')#"
							}
						}];

						// revisar qndo sair commit definitivo no frame
						CRMControllerSalesFunnel.optionsFunnel = {
							series: CRMControllerSalesFunnel.series,
							chartArea: {
								height: 300
							},
							labels: {
								visible: false,
								template: "#= category #",
								align: "center",
								position: "center"
							}
						};
					}

					if (previousData && previousData.length > 0) {
						CRMControllerSalesFunnel.seriesColumn = [{
							type: "column",
							zIndex: 1,
							color: "#36648B",
							tooltip: {
								visible: true,
								template: $rootScope.i18n('l-estimated', [], 'dts/crm') + "<br/>" + currencyPrefix + "#=kendo.toString(value[0], 'n2')#"
								//template: ($rootScope.i18n('l-estimated', [], 'dts/crm') + ": " + (funnelType === 1 ? CRMControllerSalesFunnel.currency.nom_prefix_moeda : '') + " #= value # ")
							},
							data: previousData
						}];
					}

					if (realizedData && realizedData.length > 0) {
						CRMControllerSalesFunnel.seriesColumn.push({
							type: "column",
							zIndex: 1,
							colorField: "valueColor",
							tooltip: {
								visible: true,
								template: $rootScope.i18n('l-realized', [], 'dts/crm') + "<br/>" + currencyPrefix + "#=kendo.toString(value[0], 'n2')#"
								//template: ($rootScope.i18n('l-realized', [], 'dts/crm') + ": " + (funnelType === 1 ? CRMControllerSalesFunnel.currency.nom_prefix_moeda : '') + " #= value # ")
							},
							data: realizedData
						});
					}

					if (CRMControllerSalesFunnel.seriesColumn.length > 0) {
						// revisar qndo sair commit definitivo no frame
						CRMControllerSalesFunnel.optionsColumn = {
							series: CRMControllerSalesFunnel.seriesColumn,
							chartArea: {
								height: 300
							}
						};
					}

				});
			};

			if (responsibleId > 0) {
				overallGoals = CRMControllerSalesFunnel.config.log_meta_geral || false;
			}

			if (CRMControllerSalesFunnel.config.dat_cadastro) {
				dtRegister = CRMControllerSalesFunnel.config.dat_cadastro;

				if (CRMControllerSalesFunnel.config.dat_cadastro.start) {
					dtRegisterStart = $filter('date')(CRMControllerSalesFunnel.config.dat_cadastro.start, dateFormat).toString();
				}

				if (dtRegister.end) {
					dtRegisterEnd = $filter('date')(CRMControllerSalesFunnel.config.dat_cadastro.end, dateFormat).toString();
				}
			}

			if (CRMControllerSalesFunnel.config.dat_prev_fechto) {
				dtCloseForecast = CRMControllerSalesFunnel.config.dat_prev_fechto;

				if (CRMControllerSalesFunnel.config.dat_prev_fechto.start) {
					dtCloseForecastStart = $filter('date')(CRMControllerSalesFunnel.config.dat_prev_fechto.start, dateFormat).toString();
				}

				if (dtCloseForecast.end) {
					dtCloseForecastEnd = $filter('date')(CRMControllerSalesFunnel.config.dat_prev_fechto.end, dateFormat).toString();
				}
			}

			if (CRMControllerSalesFunnel.config.dat_fechto_oportun) {
				dtClose = CRMControllerSalesFunnel.config.dat_fechto_oportun;

				if (CRMControllerSalesFunnel.config.dat_fechto_oportun.start) {
					dtCloseStart = $filter('date')(CRMControllerSalesFunnel.config.dat_fechto_oportun.start, dateFormat).toString();
				}

				if (dtClose.end) {
					dtCloseEnd = $filter('date')(CRMControllerSalesFunnel.config.dat_fechto_oportun.end, dateFormat).toString();
				}
			}

			CRMControllerSalesFunnel.tooltipAlert = undefined;


			accountId = CRMControllerSalesFunnel.accountSelected ? CRMControllerSalesFunnel.accountSelected.num_id : undefined;

			load();

			/*
			$timeout(function() {
				CRMControllerSalesFunnel.optionsFunnel.tooltip = {
					visible: true,
					template: "#=category#<br/>" + currencyPrefix + "#=kendo.toString(value, 'n2')#"
				};
			}, 1000);
			*/
		};

		this.isInvalidForm = function (notShowMessages) {

			var messages = [],
				isInvalidForm = false,
				fields = '',
				message = '',
				isPlural,
				i;

			if (!CRMControllerSalesFunnel.config.ttEstrategia) {
				isInvalidForm = true;
				messages.push('l-sales-strategy');
			}

			if (!CRMControllerSalesFunnel.config.ttTipoFunil) {
				isInvalidForm = true;
				messages.push('l-type');
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
					title:  $rootScope.i18n('l-opportunity-funnel', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [fields], 'dts/crm')
				});
			}

			return isInvalidForm;
		};

		this.getCurrencyDefault = function (callback) {
			opportunityFactory.getCurrencyDefault(function (result) {
				if (CRMUtil.isUndefined(result)) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'info',
						title: $rootScope.i18n('l-opportunity-funnel', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-default-currency-not-found', [], 'dts/crm')
					});
					return;
				} else {
					CRMControllerSalesFunnel.currency = angular.copy(result);
				}

				if (callback) { callback(); }
			});
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

		this.openOpportunity = function () {
			var fnOpen = function (account) {
				modalOpportunityEdit.open({ opportunity: { ttConta: account } });
			};

			fnOpen(CRMControllerSalesFunnel.accountSelected);
		};

		/* posiciona cliente */
		this.onSelectAccountCrm = function (callback) {
			var account = $scope.selectedAccountCRM;

			CRMControllerSalesFunnel.accountSelected = account;
			CRMControllerSalesFunnel.parseToolTip(account);

			if (callback) { callback(); }
		};

		this.onSelectCustomer = function (callback) {
			var selected = $scope.selectedcustomer, applyConfig;

			if (CRMControllerSalesFunnel.accountSelected && selected) {
				if (this.accountSelected.cod_pessoa_erp === selected['cod-emitente'].toString()) {
					return; //ja esta posicionado na conta
				}
			}

			applyConfig = function (account) {
				CRMControllerSalesFunnel.accountSelected = account;
				CRMControllerSalesFunnel.parseToolTip(account);

				if (callback) { callback(); }
			};

			if (selected !== undefined) {
				CRMControllerSalesFunnel.getAccountByERPCode($scope.selectedcustomer['cod-emitente'], function (account) {
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
			CRMControllerSalesFunnel.tooltip = "";

			if (account && account.num_id) {
				CRMControllerSalesFunnel.tooltip = "<b>" + $rootScope.i18n('l-selected-customer', [], 'dts/mpd/') + "</b>: " + account.nom_razao_social + " (" + account.cod_pessoa_erp + ")";
			}

		};
		/* posiciona cliente */

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {
			helper.loadCRMContext(function () {
                
                accessRestrictionFactory.getUserRestrictions('opportunity.list', $rootScope.currentuser.login, function (result) {
                    CRMControllerSalesFunnel.accessRestriction = result || {};
                });

				CRMControllerSalesFunnel.loadConfig();
			});
		};

		if ($rootScope.currentuserLoaded) { CRMControllerSalesFunnel.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControllerSalesFunnel = undefined;
		});

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControllerSalesFunnel.init();
		});


		$scope.$on('selectedaccountcrm', function (event, account) {
			CRMControllerSalesFunnel.apply();
		});

		$scope.$on('selectedcustomer', function (event) {
			if ($scope.selectedAccountCRM) { return; }
			if (CRMControllerSalesFunnel.accountSelected === $scope.selectedCustomer) { return; }
			CRMControllerSalesFunnel.onSelectCustomer(CRMControllerSalesFunnel.apply);
		});

		$scope.$watch(function () {
			return $rootScope.selectedAccountCRM;
		}, function (data, oldData) {
			if (data === undefined && oldData === data) { return; }
			CRMControllerSalesFunnel.onSelectAccountCrm(CRMControllerSalesFunnel.apply);
		}, true);

		$scope.$on('$killyourself', function (identifiers) {
			if (!angular.isArray(identifiers)) { return; }

			var i;

			for (i = 0; i < identifiers.length; i += 1) {
				if (CRMUtil.isDefined(identifiers[i].widgetMenuName) && identifiers[i].widgetMenuName === "html-crm.dashboard.sales-funnel") {
					CRMControllerSalesFunnel = undefined;
				}
			}
		});
	};

	controllerSalesFunnel.$inject = [
		'$rootScope',
		'$scope',
		'$filter',
		'$location',
		'$totvsprofile',
		'TOTVSEvent',
		'crm.helper',
		'crm.opportunity.helper',
		'crm.crm_oportun_vda.factory',
		'crm.opportunity.param-service',
		'crm.dashboard.sales-funnel.modal.parameter',
		'crm.opportunity.modal.edit',
		'crm.crm_pessoa.conta.factory',
		'crm.crm_estrateg_vda.factory',
        'crm.crm_param.factory',
        'crm.crm_usuar.factory',
        'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.dashboard.sales-funnel.controller', controllerSalesFunnel);
});
