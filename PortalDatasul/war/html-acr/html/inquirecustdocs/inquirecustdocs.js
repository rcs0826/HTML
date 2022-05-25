define(['index',
	'/dts/acr/js/userpreference.js',
	'/dts/acr/js/acr-factories.js',
	'/dts/acr/js/api/inquirecustdocs.js',
	'/dts/acr/js/acr-components.js',
	'/dts/acr/html/inquirecustdocs/inquirecustdocs-services.param.js',
	'/dts/acr/html/inquiredocdetail/inquiredocdetail-services.param.js'
], function (index) {

	index.stateProvider

		.state('dts/acr/inquirecustdocs', {
			abstract: true,
			template: '<ui-view/>'
		})
		.state('dts/acr/inquirecustdocs.start', {
			url: '/dts/acr/inquirecustdocs',
			controller: 'acr.inquirecustdocs.Controller',
			controllerAs: 'controller',
			templateUrl: '/dts/acr/html/inquirecustdocs/inquirecustdocs.html'
		});

	inquireCustDocsController.$inject = ['$rootScope',
		'$scope',
		'$location',
		'acr.inquirecustdocs.Factory',
		'userPreference',
		'totvs.app-main-view.Service',
		'acr.generic.Controller',
		'$filter',
		'$q',
		'$modal',
		'TOTVSEvent',
		'acr.inquirecustdocs.param-service',
		'acr.inquiredocdetail.param-service'];

	function inquireCustDocsController($rootScope,
		$scope,
		$location,
		service,
		userPreference,
		appViewService,
		genericController,
		$filter,
		$q,
		$modal,
		TOTVSEvent,
		serviceInquireCustDocsParam,
		serviceInquireDocDetailParam) {


		var controller = this,
			i18n = $filter('i18n'),
			date = $filter('date'),
			situacao = "",
			dtEmis,
			dtVenc,
			faixa = 0;

		this.listResult = [];
		this.resultChart = [];
		this.totalRecords = 0;
		this.logVenc = true;
		this.logAvenc = true;
		this.logAntecip = true;
		this.chartParameter = false;
		this.chartVenc = true;
		this.chartAvenc = true;

		controller.seriesVencidos = [];
		controller.seriesAvencer = [];
		controller.series = [];
		controller.seriesAvenc = [];
		controller.vencidos = undefined;
		controller.aVencer = undefined;
		controller.currency = { nom_prefix_moeda: 'R$' };

		genericController.decorate(this, service);

		this.advancedSearch = { model: {} };

		controller.advancedSearch.model.periodoVenc = 0;
		controller.advancedSearch.periodoVencimento = [
			{ value: 0, label: i18n('l-filter-bill-all') },
			{ value: 1, label: i18n('l-filter-bill-30-days') },
			{ value: 2, label: i18n('l-filter-bill-31-to-60') },
			{ value: 3, label: i18n('l-filter-bill-61-to-90') },
			{ value: 4, label: i18n('l-filter-bill-91-to-120') },
			{ value: 5, label: i18n('l-filter-bill-more-than-120') }
		];

		this.init = function () {

			appViewService.startView(i18n('l-inquire-cust-docs'), 'acr.inquirecustdocs.Controller', this);

			if (AcrUtil.isDefined(serviceInquireCustDocsParam.paramOpp)) {

				if (serviceInquireCustDocsParam.paramOpp[0]) {
					dtEmis = serviceInquireCustDocsParam.paramOpp[0].value;
				}
				if (serviceInquireCustDocsParam.paramOpp[1]) {
					dtVenc = serviceInquireCustDocsParam.paramOpp[1].value;
				}
				if (serviceInquireCustDocsParam.paramOpp[2]) {
					situacao = serviceInquireCustDocsParam.paramOpp[2].title;
				}
				if (serviceInquireCustDocsParam.paramOpp[3]) {
					faixa = serviceInquireCustDocsParam.paramOpp[3].value;
				}

				controller.advancedSearch.model.dtEmis = dtEmis;
				controller.advancedSearch.model.dtVenc = dtVenc;
				controller.advancedSearch.model.periodoVenc = faixa;
				
				controller.setQuickFilter(situacao);

				serviceInquireCustDocsParam.paramOpp = undefined;

			} else {

				$q.all([userPreference.getPreference('inquireCustDocs.dataemis'),
						userPreference.getPreference('inquireCustDocs.datavenc'),
						userPreference.getPreference('inquireCustDocs.periodovenc'),
						userPreference.getPreference('inquireCustDocs.logvenc'),
						userPreference.getPreference('inquireCustDocs.logavenc'),
						userPreference.getPreference('inquireCustDocs.logantecip')])
					.then(function (results) {

						var dtIni = undefined;
						var dtFim = undefined;
						var periodoVenc = undefined;
						var logVenc = undefined;
						var logAvenc = undefined;
						var logAntecip = undefined;

						if (results && results[0].prefValue) {
							dtIni = new Date(parseFloat(results[0].prefValue));
						} else {
							dtIni.setMonth(dtIni.getMonth() - 1);
						}

						if (results && results[1].prefValue) {
							dtFim = new Date(parseFloat(results[1].prefValue));
						}

						if (results && results[2].prefValue) {
							periodoVenc = results[2].prefValue;
						}

						if (results && results[3].prefValue) {
							logVenc = results[3].prefValue;
						}

						if (results && results[4].prefValue) {
							logAvenc = results[4].prefValue;
						}

						if (results && results[5].prefValue) {
							logAntecip = results[5].prefValue;
						}

						controller.advancedSearch.model.dtEmis = dtIni.getTime();
						controller.advancedSearch.model.dtVenc = dtFim.getTime();
						controller.advancedSearch.model.periodoVenc = Number(periodoVenc);
						controller.logVenc = (logVenc === "true");
						controller.logAvenc = (logAvenc === "true");
						controller.logAntecip = (logAntecip === "true");

						controller.vencidos = undefined;
						controller.aVencer = undefined;

						controller.addFilters(true);
						controller.setQuickFilter(undefined);

					});		
			}

		}

		this.formatCurrency = function (value) {
			return $filter('currency')(value, controller.currency.nom_prefix_moeda, 2);
		};

		this.search = function () {
			this.clearDefaultData(true, this);
			this.addFilters(true);
			this.loadData(false);
		}

		this.removeSelectedFilter = function (filter) {

			controller.removeFilter(filter);

			if (filter.property == "periodoVenc") {
				controller.advancedSearch.model.periodoVenc = 0;
			}
			if (filter.property == "simpleFilter") {
				controller.quickSearchText = '';
			}
			if (filter.property == "aVencer") {
				controller.logAvenc = true;
			}
			if (filter.property == "vencidos") {
				controller.logVenc = true;
			}
			if (filter.property == "antecipados") {
				controller.logAntecip = true;
			}
			if (filter.property == "dtVenc") {
				controller.advancedSearch.model.dtVenc = undefined;
			}
			if (filter.property == "dtEmis") {
				controller.advancedSearch.model.dtEmis = undefined;
			}

			controller.loadData(false);
		}

		controller.loadData = function (isMore) {

			if (!isMore) {
				controller.listResult = [];
			}

			controller.categories = [];
			controller.resultChart = [];
			controller.totalRecords = 0;
			options = {};
			var i,
				dValue,
				series1 = [],
				series2 = [],
				series3 = [],
				series4 = [],
				series5 = [],
				seriesAvenc1 = [],
				seriesAvenc2 = [],
				seriesAvenc3 = [],
				seriesAvenc4 = [],
				seriesAvenc5 = [];

			options = {
				start: controller.listResult.length,
				end: 50
			};

			var parameters = {
				'numStart': options.start,
				'numEnd': options.end,
				'datEmis': controller.advancedSearch.model.dtEmis,
				'datVenc': controller.advancedSearch.model.dtVenc,
				'numPeriodVenc': controller.advancedSearch.model.periodoVenc,
				'logVenc': controller.logVenc,
				'logAvenc': controller.logAvenc,
				'logAntecip': controller.logAntecip,
				'codSearchText': controller.quickSearchText == undefined ? "" : controller.quickSearchText
			}

			controller.applyConfig();

			service.getDocumentList(parameters, function (result) {

				if (result) {

					controller.totalRecords = result.totalRecords;

					if (result.ttTitulosAbertoClien_aux) {
						angular.forEach(result.ttTitulosAbertoClien_aux, function (value) {
							controller.listResult.push(value);
						});
					}

					if (result.ttTotTitAbertoPeriod) {

						if (controller.chartParameter) {
							
							controller.vencidos = 0;
							controller.aVencer = 0;

							angular.forEach(result.ttTotTitAbertoPeriod, function (value) {
								if (controller.chartVenc) {
									controller.vencidos = value.valSdoVencid;
								}
								if (controller.chartAvenc){
									controller.aVencer = value.valSdoAvencer;
								}
							});

						} else {

							angular.forEach(result.ttTotTitAbertoPeriod, function (value) {
								controller.vencidos = value.valSdoVencid;
								controller.aVencer = value.valSdoAvencer;
							});

						}
						
					}

					if (result.ttTotTitAbertoFaixaVencto) {

						angular.forEach(result.ttTotTitAbertoFaixaVencto, function (value) {
							controller.resultChart.push(value);
						});

						controller.tooltipHelp = $rootScope.i18n('l-value', [], 'dts/acr');

						if (controller.chartParameter) {

							for (i = 0; i < result.ttTotTitAbertoFaixaVencto.length; i += 1) {
								dValue = parseFloat(result.ttTotTitAbertoFaixaVencto[i].valSdoFaixaVencto);
	
								if (result.ttTotTitAbertoFaixaVencto[i].numFaixaVencto == 1) {
									if (result.ttTotTitAbertoFaixaVencto[i].numSituacao == 1 && controller.chartVenc) {
										series1.push(dValue);
									} else if (result.ttTotTitAbertoFaixaVencto[i].numSituacao == 2 && controller.chartAvenc) {
										seriesAvenc1.push(dValue);
									}
								}
	
								if (result.ttTotTitAbertoFaixaVencto[i].numFaixaVencto == 2) {
									if (result.ttTotTitAbertoFaixaVencto[i].numSituacao == 1 && controller.chartVenc) {
										series2.push(dValue);
									} else if (result.ttTotTitAbertoFaixaVencto[i].numSituacao == 2 && controller.chartAvenc) {
										seriesAvenc2.push(dValue);
									}
								}
	
								if (result.ttTotTitAbertoFaixaVencto[i].numFaixaVencto == 3) {
									if (result.ttTotTitAbertoFaixaVencto[i].numSituacao == 1 && controller.chartVenc) {
										series3.push(dValue);
									} else if (result.ttTotTitAbertoFaixaVencto[i].numSituacao == 2 && controller.chartAvenc) {
										seriesAvenc3.push(dValue);
									}
								}
	
								if (result.ttTotTitAbertoFaixaVencto[i].numFaixaVencto == 4) {
									if (result.ttTotTitAbertoFaixaVencto[i].numSituacao == 1 && controller.chartVenc) {
										series4.push(dValue);
									} else if (result.ttTotTitAbertoFaixaVencto[i].numSituacao == 2 && controller.chartAvenc) {
										seriesAvenc4.push(dValue);
									}
								}
	
								if (result.ttTotTitAbertoFaixaVencto[i].numFaixaVencto == 5) {
									if (result.ttTotTitAbertoFaixaVencto[i].numSituacao == 1 && controller.chartVenc) {
										series5.push(dValue);
									} else if (result.ttTotTitAbertoFaixaVencto[i].numSituacao == 2 && controller.chartAvenc) {
										seriesAvenc5.push(dValue);
									}
								}

							}

							controller.chartParameter = false;
						
						} else {

							for (i = 0; i < result.ttTotTitAbertoFaixaVencto.length; i += 1) {
								dValue = parseFloat(result.ttTotTitAbertoFaixaVencto[i].valSdoFaixaVencto);
	
								if (result.ttTotTitAbertoFaixaVencto[i].numFaixaVencto == 1) {
									if (result.ttTotTitAbertoFaixaVencto[i].numSituacao == 1) {
										series1.push(dValue);
									} else {
										seriesAvenc1.push(dValue);
									}
								}
	
								if (result.ttTotTitAbertoFaixaVencto[i].numFaixaVencto == 2) {
									if (result.ttTotTitAbertoFaixaVencto[i].numSituacao == 1) {
										series2.push(dValue);
									} else {
										seriesAvenc2.push(dValue);
									}
								}
	
								if (result.ttTotTitAbertoFaixaVencto[i].numFaixaVencto == 3) {
									if (result.ttTotTitAbertoFaixaVencto[i].numSituacao == 1) {
										series3.push(dValue);
									} else {
										seriesAvenc3.push(dValue);
									}
								}
	
								if (result.ttTotTitAbertoFaixaVencto[i].numFaixaVencto == 4) {
									if (result.ttTotTitAbertoFaixaVencto[i].numSituacao == 1) {
										series4.push(dValue);
									} else {
										seriesAvenc4.push(dValue);
									}
								}
	
								if (result.ttTotTitAbertoFaixaVencto[i].numFaixaVencto == 5) {
									if (result.ttTotTitAbertoFaixaVencto[i].numSituacao == 1) {
										series5.push(dValue);
									} else {
										seriesAvenc5.push(dValue);
									}
								}
							}

						}

						controller.series = [
							{ id: 1, name: controller.traduzFaixa(1), data: series1, tooltip: { template: "R$ " + "#=kendo.toString(value, 'n2')#" } },
							{ id: 1, name: controller.traduzFaixa(2), data: series2, tooltip: { template: "R$ " + "#=kendo.toString(value, 'n2')#" } },
							{ id: 1, name: controller.traduzFaixa(3), data: series3, tooltip: { template: "R$ " + "#=kendo.toString(value, 'n2')#" } },
							{ id: 1, name: controller.traduzFaixa(4), data: series4, tooltip: { template: "R$ " + "#=kendo.toString(value, 'n2')#" } },
							{ id: 1, name: controller.traduzFaixa(5), data: series5, tooltip: { template: "R$ " + "#=kendo.toString(value, 'n2')#" } }
						];

						controller.seriesAvenc = [
							{ id: 2, name: controller.traduzFaixa(1), data: seriesAvenc1, tooltip: { template: "R$ " + "#=kendo.toString(value, 'n2')#" } },
							{ id: 2, name: controller.traduzFaixa(2), data: seriesAvenc2, tooltip: { template: "R$ " + "#=kendo.toString(value, 'n2')#" } },
							{ id: 2, name: controller.traduzFaixa(3), data: seriesAvenc3, tooltip: { template: "R$ " + "#=kendo.toString(value, 'n2')#" } },
							{ id: 2, name: controller.traduzFaixa(4), data: seriesAvenc4, tooltip: { template: "R$ " + "#=kendo.toString(value, 'n2')#" } },
							{ id: 2, name: controller.traduzFaixa(5), data: seriesAvenc5, tooltip: { template: "R$ " + "#=kendo.toString(value, 'n2')#" } }
						];

					}

				}

			});

		}

		this.filteredChart = function () {

			controller.chartParameter = false;


		}

		this.onClick = function (event) {

			if (!event) {
				return;
			}

			controller.chartParameter = true;
			controller.listShow = true;
			controller.chartShow = false;

			switch (event.series.id) {

				case 1:
					controller.chartVenc = true;
					controller.chartAvenc = false;
				
					controller.logVenc = true;
					controller.logAvenc = false;
					controller.logAntecip = false;
                    break;

				case 2:
					controller.chartVenc = false;
					controller.chartAvenc = true;
					
					controller.logVenc = false;
					controller.logAvenc = true;
					controller.logAntecip = false;
                    break;

            }

			switch (event.series.name) {

                case $rootScope.i18n('l-30-days', [], 'dts/acr'):
                    controller.advancedSearch.model.periodoVenc = 1;
                    break;

                case $rootScope.i18n('l-31-to-60-days', [], 'dts/acr'):
					controller.advancedSearch.model.periodoVenc = 2;
                    break;

                case $rootScope.i18n('l-61-to-90-days', [], 'dts/acr'):
					controller.advancedSearch.model.periodoVenc = 3;
                    break;
                
                case $rootScope.i18n('l-91-to-120-days', [], 'dts/acr'):
					controller.advancedSearch.model.periodoVenc = 4;
                    break;

                case $rootScope.i18n('l-more-then-120-days', [], 'dts/acr'):
					controller.advancedSearch.model.periodoVenc = 5;
                    break;

            }

			controller.addFilters(true);
			controller.loadData(false);
		}

		this.reload = function (situation) {

			controller.chartParameter = true;
			controller.listShow = true;
			controller.chartShow = false;

			switch (situation) {

				case 1:
					controller.chartVenc = true;
					controller.chartAvenc = false;

					controller.logVenc = true;
					controller.logAvenc = false;
					controller.logAntecip = false;
                    break;

				case 2:
					controller.chartVenc = false;
					controller.chartAvenc = true;

					controller.logVenc = false;
					controller.logAvenc = true;
					controller.logAntecip = false;
                    break;

			}
			
			controller.addFilters(true);
			controller.loadData(false);

		}

		this.openDetail = function (documentCode, documentParcel, site, documentSeries, documentClass) {
			var url = '/dts/acr/inquiredocdetail',
				disclaimers = [];

			if (documentCode != undefined) {
				disclaimers.push({
					property: 'codTitAcr',
					value: documentCode,
					model: { property: 'codTitAcr', value: documentCode }
				});
			}

			if (documentParcel != undefined) {
				disclaimers.push({
					property: 'codParcela',
					value: documentParcel,
					model: { property: 'codParcela', value: documentParcel }
				});
			}

			if (site != undefined) {
				disclaimers.push({
					property: 'codEstab',
					value: site,
					model: { property: 'codEstab', value: site }
				});
			}

			if (documentSeries != undefined) {
				disclaimers.push({
					property: 'codSerDocto',
					value: documentSeries,
					model: { property: 'codSerDocto', value: documentSeries }
				});
			}

			if (documentClass != undefined) {
				disclaimers.push({
					property: 'codEspecDocto',
					value: documentClass,
					model: { property: 'codEspecDocto', value: documentClass }
				});
			}

			serviceInquireDocDetailParam.setParamOpp(disclaimers, function () {
				$scope.safeApply(function () {
					$location.path(url);
				});
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

		controller.addFilters = function (isToClear) {

			if (isToClear == true) { controller.clearFilter(); }

			if (controller.advancedSearch.model.dtEmis) {
				controller.addFilter('dtEmis', controller.advancedSearch.model.dtEmis, '', i18n('l-print-date') + ': ' + date(controller.advancedSearch.model.dtEmis, 'shortDate'));
			}

			if (controller.advancedSearch.model.dtVenc) {
				controller.addFilter('dtVenc', controller.advancedSearch.model.dtVenc, '', i18n('l-due-date') + ': ' + date(controller.advancedSearch.model.dtVenc, 'shortDate'));
			}

			if (controller.advancedSearch.model.periodoVenc) {
				controller.addFilter('periodoVenc', controller.advancedSearch.model.periodoVenc, '', i18n('l-due-date-range') + ': ' + controller.traduzFaixa(controller.advancedSearch.model.periodoVenc));
			}

			if (controller.logVenc == true) {
				controller.addFilter('vencidos', controller.logAvenc, "", i18n('l-overdue') + " " + i18n('l-yes'));
			} else {
				controller.addFilter('vencidos', controller.logAvenc, "", i18n('l-overdue') + " " + i18n('l-no'));
			}

			if (controller.logAvenc == true) {
				controller.addFilter('aVencer', controller.logAvenc, "", i18n('l-ondue') + " " + i18n('l-yes'));
			} else {
				controller.addFilter('aVencer', controller.logAvenc, "", i18n('l-ondue') + " " + i18n('l-no'));
			}

			if (controller.logAntecip == true) {
				controller.addFilter('antecipados', controller.logAvenc, "", i18n('l-antecipation') + " " + i18n('l-yes'));
			} else {
				controller.addFilter('antecipados', controller.logAvenc, "", i18n('l-antecipation') + " " + i18n('l-no'));
			}

			if (controller.quickSearchText) {
				controller.addFilter('simpleFilter', controller.quickSearchText, '', i18n('l-code') + ': ' + controller.quickSearchText, controller.quickSearchText);
			}

		}

		this.traduzFaixa = function (faixaVencto) {

			var sentence = '';

			var faixaVencto = Number(faixaVencto);

			switch (faixaVencto) {
				case 1:
					sentence = 'l-30-days';
					break;
				case 2:
					sentence = 'l-31-to-60-days';
					break;
				case 3:
					sentence = 'l-61-to-90-days';
					break;
				case 4:
					sentence = 'l-91-to-120-days';
					break;
				case 5:
					sentence = 'l-more-then-120-days';
					break;
				default:
					sentence = '';
			}
			return $rootScope.i18n(sentence, [], 'dts/acr');
		}

		this.traduzSituacao = function (numSituacao) {

			var sentence = '';

			switch (numSituacao) {
				case 1:
					sentence = 'l-overdue';
					break;
				case 2:
					sentence = 'l-ondue';
					break;
				case 3:
					sentence = 'l-antecipation';
					break;
				default:
					sentence = '';
			}
			return $rootScope.i18n(sentence, [], 'dts/acr');
		}

		this.openAdvancedSearch = function () {

			var modalInstance = $modal.open({
				templateUrl: '/dts/acr/html/inquirecustdocs/inquirecustdocs-adv-search.html',
				controller: 'acr.inquirecustdocs.adv-search.Controller as controller',
				backdrop: 'static',
				keyboard: true,
				size: 'lg',
				resolve: {
					model: function () {
						return controller.advancedSearch;
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
				controller.addFilters(true);
				controller.loadData();
			});

		}

		controller.setQuickFilter = function (key) {

			if (key != undefined) {
				
				controller.logAntecip = false;
				controller.logVenc = false;
				controller.logAvenc = false;

				switch (key) {
					case "ANTECIPADOS":
						controller.logAvenc = false;
						controller.logVenc = false;
						controller.logAntecip = true;
						break;
					case "VENCIDOS":
						controller.logAvenc = false;
						controller.logVenc = true;
						controller.logAntecip = false;
						break;
					case "AVENCER":
						controller.logAvenc = true;
						controller.logVenc = false;
						controller.logAntecip = false;
						break;
					default:
						controller.logAntecip = true;
						controller.logVenc = true;
						controller.logAvenc = true;
				}
			}

			controller.addFilters(true);
			controller.loadData(false);

		}

		this.applyConfig = function () {

			$q.all([userPreference.setPreference('inquireCustDocs.dataemis', new Date(controller.advancedSearch.model.dtEmis).getTime()),
					userPreference.setPreference('inquireCustDocs.datavenc', new Date(controller.advancedSearch.model.dtVenc).getTime()),
					userPreference.setPreference('inquireCustDocs.periodovenc', controller.advancedSearch.model.periodoVenc),
					userPreference.setPreference('inquireCustDocs.logvenc', controller.logVenc),
					userPreference.setPreference('inquireCustDocs.logavenc', controller.logAvenc),
					userPreference.setPreference('inquireCustDocs.logantecip', controller.logAntecip)]);

		};

		this.showList = function () {
			this.listShow = true;
			this.chartShow = false;
		}

		this.showChart = function () {
			this.listShow = false;
			this.chartShow = true;
		}

		this.listShow = true;
		this.chartShow = false;

		if ($rootScope.currentuserLoaded) { this.init(); }

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			controller.init();
		});


	}

	index.register.controller('acr.inquirecustdocs.Controller', inquireCustDocsController);

	inquireCustDocsAdvSearchController.$inject = ['$modalInstance', 'model'];
	function inquireCustDocsAdvSearchController($modalInstance, model) {

		this.advancedSearch = model;

		this.search = function () {
			$modalInstance.close();
		}

		this.close = function () {
			$modalInstance.dismiss();
		}

	}
	index.register.controller('acr.inquirecustdocs.adv-search.Controller', inquireCustDocsAdvSearchController);

});
