/*global $, index, angular, define, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define(['index',
		'/dts/crm/js/crm-services.js',
        '/dts/crm/js/api/fchcrm1002.js',
		'/dts/crm/js/api/fchcrm1003.js',
        '/dts/crm/js/api/fchcrm1004.js',
		'/dts/crm/js/api/fchcrm1007.js',
        '/dts/crm/js/api/fchcrm1045.js',
		'/dts/crm/html/dashboard/opportunity-ranking-parameters.js',
		'/dts/crm/html/opportunity/opportunity-services.list.js',
        '/dts/dts-utils/js/lodash-angular.js'
	   ], function (index) {

	'use strict';

	var opportunityRankingCtrl;

	opportunityRankingCtrl = function ($rootScope, $scope, $location, $filter, $totvsprofile,
										TOTVSEvent, helper, helperOpportunity, opportunityFactory,
										serviceOpportunityParam, modalParametersEdit,
										modalOpportunityEdit, accountFactory, preferenceFactory, userFactory, accessRestrictionFactory) {

		var CRMControllerRanking = this;

        this.accessRestriction = undefined;
		this.series = undefined;
		this.currency = { nom_prefix_moeda: 'R$' };
		this.config = undefined;
		this.tooltip = undefined;
		this.hasDetail = false;
		this.options = {};
        this.isUserPortfolio = false;
        
		// functions
		this.formatCurrency = function (value) {
			return $filter('currency')(value, CRMControllerRanking.currency.nom_prefix_moeda, 2);
		};

		this.onClick = function (e) {
			if (!e.series || CRMUtil.isUndefined(e.series.opportunityId)) { return; }

			$scope.safeApply(function () {
				$location.path('/dts/crm/opportunity/detail/' + e.series.opportunityId);
			});
		};

		this.refresh = function () {
			CRMControllerRanking.getConfig(function (config) {
				CRMControllerRanking.apply(false);
			});
		};

		this.detailRanking = function () {
			if (CRMControllerRanking.hasDetail !== true) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('l-opportunity-ranking', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-no-data-detail', [], 'dts/crm')
				});
				return;
			}

			var i = 0,
				param = [{source: 'l-widget-opportunity-ranking'}];

			if (CRMUtil.isUndefined(CRMControllerRanking.series)) { return; }

			for (i = 0; i < CRMControllerRanking.series.length; i++) {
				param.push({num_id: CRMControllerRanking.series[i].opportunityId});
			}

			serviceOpportunityParam.setParamOpp(param, function (callback) {
				$scope.safeApply(function () {
					$location.path('/dts/crm/opportunity/');
				});
			});
		};

		this.showConfig = function () {
			modalParametersEdit.open({
				config: CRMControllerRanking.config,
                isUserPortfolio: CRMControllerRanking.isUserPortfolio
			}).then(function (result) {
				if (!result) {
					return;
				}

				CRMControllerRanking.config = result.customFilter;
				CRMControllerRanking.apply(result.apply);
			});

		};

		this.loadData  = function () {

			var i,
				load,
				cValue,
				dValue,
				accountId,
				start = '',
				end = '',
				series = [],
				responsible = 0,
				strategy = 0,
				phase = 0,
				campaign = 0,
				max = 5,
				type = 1,
				template = "",
				suspended = false;

			if (CRMControllerRanking.isPendingListSearch === true) { return; }

			CRMControllerRanking.series = [];
			CRMControllerRanking.options = undefined;
			CRMControllerRanking.hasDetail = false;

			load = function () {
				CRMControllerRanking.isPendingListSearch = true;

				opportunityFactory.getOpportunityRanking(max, start, end, suspended, strategy, campaign, phase, responsible, accountId, type, function (result) {

					CRMControllerRanking.isPendingListSearch = false;

					if (!result || result.length < 1) { return; }

					if (CRMUtil.isUndefined(CRMControllerRanking)) { return; }

					// revisar qndo sair commit definitivo no frame
					CRMControllerRanking.options = {
						series: series,
						chartArea: {
							height: 300
						}
					};

					CRMControllerRanking.hasDetail = true;
					CRMControllerRanking.tooltipHelp = $rootScope.i18n('msg-help-opportunity-currency', [CRMControllerRanking.currency.nom_moeda], 'dts/crm');

					if (type < 3) {
						template = CRMControllerRanking.currency.nom_prefix_moeda + " #=kendo.toString(value, 'n2')#";
					} else {
						template = " #=kendo.toString(value, 'n2')#";
					}

					for (i = 0; i < result.length; i += 1) {

						dValue = parseFloat(result[i].dValue);
						cValue = type < 3 ? CRMControllerRanking.formatCurrency(dValue) : dValue;

						series.push({
							name: result[i].accountName,
							data: [dValue],
							tooltip: {
								visible: true,
								//format: CRMControllerRanking.currency.nom_prefix_moeda + " {0}",
								template: template
							},
							opportunityId: result[i].id
						});
					}

					CRMControllerRanking.series = series;

					// revisar qndo sair commit definitivo no frame
					CRMControllerRanking.options = {
						series: series,
						chartArea: {
							height: 300
						},
						labels: {
							visible: false,
							template: template
						}
					};
				});
			};

			if (CRMUtil.isDefined(CRMControllerRanking.config)) {
				responsible = (CRMControllerRanking.config.ttResponsavel ? CRMControllerRanking.config.ttResponsavel.num_id : 0);
				strategy = (CRMControllerRanking.config.ttEstrategia ? CRMControllerRanking.config.ttEstrategia.num_id : 0);
				phase = (CRMControllerRanking.config.ttFaseDesenvolvimento ? CRMControllerRanking.config.ttFaseDesenvolvimento.num_id : 0);
				campaign = (CRMControllerRanking.config.ttCampanha ? CRMControllerRanking.config.ttCampanha.num_id : 0);
				max = (CRMControllerRanking.config.num_max ? Number(CRMControllerRanking.config.num_max) : 5);
				suspended = (CRMControllerRanking.config.log_suspenso ? true : false);
				type = (CRMControllerRanking.config.rankingType ? CRMControllerRanking.config.rankingType.id : 1);

				if (CRMControllerRanking.config.dat_cadastro && CRMControllerRanking.config.dat_cadastro.start) {
					start = $filter('date')(CRMControllerRanking.config.dat_cadastro.start, $rootScope.i18n('l-date-format', [], 'dts/crm')).toString();
				}

				if (CRMControllerRanking.config.dat_cadastro && CRMControllerRanking.config.dat_cadastro.end) {
					end = $filter('date')(CRMControllerRanking.config.dat_cadastro.end, $rootScope.i18n('l-date-format', [], 'dts/crm')).toString();
				}
			}

			accountId = CRMControllerRanking.accountSelected ? CRMControllerRanking.accountSelected.num_id : undefined;

			load();
		};

		this.getConfig = function (callback) {
			$totvsprofile.remote.get(helperOpportunity.rankingConfig, undefined, function (result) {

				if (result && angular.isArray(result)) {
					result = result[0];
				}

				if (result && result.dataValue) {
					result = result.dataValue;
				} else {
					result = {
						num_max: 5,
						dat_cadastro: {
							start: new Date(),
							end: new Date()
						}
					};
				}

				CRMControllerRanking.config = result;
				if (callback) { callback(); }
			});

		};

		this.getCurrencyDefault = function (callback) {
			opportunityFactory.getCurrencyDefault(function (result) {

				if (CRMUtil.isUndefined(result)) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'info',
						title: $rootScope.i18n('l-opportunity-ranking', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-default-currency-not-found', [], 'dts/crm')
					});
					return;
				} else {
					CRMControllerRanking.currency = angular.copy(result);
				}

				if (callback) { callback(); }
			});
		};

		this.loadConfig = function () {
			var count = 0,
				total = 3,
				afterLoad;

			afterLoad = function () {
				count += 1;
				if (count === total) { CRMControllerRanking.apply(false); }
			};

			CRMControllerRanking.getConfig(function (config) {
				afterLoad();
			});

			CRMControllerRanking.getCurrencyDefault(function (currency) {
				afterLoad();
			});
            
            preferenceFactory.getPreferenceAsBoolean('LOG_CARTEIRA_USU', function (result) {
				CRMControllerRanking.isUserPortfolio = result || false;
                afterLoad();
            });
		};

		this.apply = function (isPersitConfig) {
            var filters = [],
                getData = function () {
                    if (CRMControllerRanking.isUserPortfolio) {
                        filters.push({property: 'num_id', value: $rootScope.currentuser.idCRM});

                        userFactory.findRecords(filters, {}, function (user) {
                            CRMControllerRanking.config.ttResponsavel = user[0];
                            CRMControllerRanking.loadData();
                        });
                    } else {
                        CRMControllerRanking.loadData();
                    }
                };
            
            if (CRMControllerRanking.isInvalidForm()) { return; }


			if (isPersitConfig === true) {
				CRMControllerRanking.saveConfig(CRMControllerRanking.config, getData());
			} else {
				getData();
			}
		};

		this.saveConfig = function (config, callback) {
			$totvsprofile.remote.set(helperOpportunity.rankingConfig, {dataValue: config}, callback);
		};

		this.isInvalidForm = function (notShowMessages) {

			var messages = [],
				isInvalidForm = false,
				fields = '',
				message = '',
				isPlural,
				i;

			if (!CRMControllerRanking.config.dat_cadastro || !CRMControllerRanking.config.dat_cadastro.start) {
				isInvalidForm = true;
				messages.push('l-date-create');
			}

			if (!CRMControllerRanking.config.num_max || CRMControllerRanking.config.num_max < 1) {
				isInvalidForm = true;
				messages.push('l-quantity');
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
					title:  $rootScope.i18n('l-opportunity-ranking', [], 'dts/crm'),
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

		this.openOpportunity = function () {
			var fnOpen = function (account) {
				modalOpportunityEdit.open({ opportunity: { ttConta: account } });
			};

			fnOpen(CRMControllerRanking.accountSelected);
		};

		/* posiciona cliente */
		this.onSelectAccountCrm = function (callback) {
			var account = $scope.selectedAccountCRM;

			CRMControllerRanking.parseToolTip(account);
			CRMControllerRanking.accountSelected = account;

			if (callback) { callback(); }
		};

		this.onSelectCustomer = function (callback) {
			var customer = $scope.selectedcustomer, applyConfig;

			if (CRMControllerRanking.accountSelected && customer) {
				if (this.accountSelected.cod_pessoa_erp === customer['cod-emitente'].toString()) {
					return; //ja esta posicionado na conta
				}
			}

			applyConfig = function (account) {
				CRMControllerRanking.accountSelected = account;
				CRMControllerRanking.parseToolTip(account);

				if (callback) { callback(); }
			};

			if (customer !== undefined) {
				CRMControllerRanking.getAccountByERPCode($scope.selectedcustomer['cod-emitente'], function (account) {
					if (CRMUtil.isUndefined(account)) { return; }

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
			CRMControllerRanking.tooltip = "";

			if (account && account.num_id) {
				CRMControllerRanking.tooltip = "<b>" + $rootScope.i18n('l-selected-customer', [], 'dts/mpd/') + "</b>: " + account.nom_razao_social + " (" + account.cod_pessoa_erp + ")";
			}
		};
		/* posiciona cliente */

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {
			helper.loadCRMContext(function () { 
            
                accessRestrictionFactory.getUserRestrictions('opportunity.list', $rootScope.currentuser.login, function (result) {
                    CRMControllerRanking.accessRestriction = result || {};
                });
                
                CRMControllerRanking.loadConfig(); 
            });
		};

		if ($rootScope.currentuserLoaded) { CRMControllerRanking.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControllerRanking = undefined;
		});

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControllerRanking.init();
		});

		$scope.$on('selectedcustomer', function (event) {
			if ($scope.selectedAccountCRM) { return; }
			if (CRMControllerRanking.accountSelected === $scope.selectedCustomer) { return; }
			CRMControllerRanking.onSelectCustomer(CRMControllerRanking.apply);
		});

		$scope.$watch(function () {
			return $rootScope.selectedAccountCRM;
		}, function (data, oldData) {
			if (data === undefined && oldData === data) { return; }
			CRMControllerRanking.onSelectAccountCrm(CRMControllerRanking.apply);
		}, true);

		$scope.$on('$killyourself', function (identifiers) {
			if (!angular.isArray(identifiers)) { return; }

			var i;

			for (i = 0; i < identifiers.length; i += 1) {
				if (CRMUtil.isDefined(identifiers[i].widgetMenuName) && identifiers[i].widgetMenuName === "html-crm.dashboard.opportunity-ranking") {
					CRMControllerRanking = undefined;
				}
			}
		});

	}; //function opportunityRankingCtrl()

	opportunityRankingCtrl.$inject = [
		'$rootScope', '$scope', '$location', '$filter', '$totvsprofile', 'TOTVSEvent', 'crm.helper',
		'crm.opportunity.helper', 'crm.crm_oportun_vda.factory', 'crm.opportunity.param-service',
		'crm.dashboard.opportunity-ranking.modal.parameter', 'crm.opportunity.modal.edit', 'crm.crm_pessoa.conta.factory', 'crm.crm_param.factory', 'crm.crm_usuar.factory', 'crm.crm_acess_portal.factory'
	];

	index.register.controller('crm.dashboard.opportunity-ranking.controller', opportunityRankingCtrl);

});
