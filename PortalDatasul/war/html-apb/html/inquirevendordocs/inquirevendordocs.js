define(['index',
	'/dts/apb/js/userpreference.js',
	'/dts/apb/js/apb-factories.js',
	'/dts/apb/js/api/inquirevendordocs.js',
	'/dts/apb/js/apb-components.js',
	'/dts/apb/html/inquirevendordocs/inquirevendordocs-services.param.js',
	'/dts/apb/html/inquirevendordocdetail/inquirevendordocdetail-services.param.js'
], function (index) {

	index.stateProvider

		.state('dts/apb/inquirevendordocs', {
			abstract: true,
			template: '<ui-view/>'
		})
		.state('dts/apb/inquirevendordocs.start', {
			url: '/dts/apb/inquirevendordocs',
			controller: 'apb.inquirevendordocs.Controller',
			controllerAs: 'controller',
			templateUrl: '/dts/apb/html/inquirevendordocs/inquirevendordocs.html'
		});

	inquireVendorDocsController.$inject = ['$rootScope',
		'$scope',
		'$location',
		'apb.inquirevendordocs.Factory',
		'userPreference',
		'totvs.app-main-view.Service',
		'$filter',
		'$q',
		'$modal',
		'TOTVSEvent',
		'apb.inquirevendordocs.param-service',
		'apb.inquirevendordocdetail.param-service'];

	function inquireVendorDocsController($rootScope,
		$scope,
		$location,
		service,
		userPreference,
		appViewService,
		$filter,
		$q,
		$modal,
		TOTVSEvent,
		serviceInquireVendorDocsParam,
		serviceInquireVendorDocDetailParam) {

		var controller = this,
			i18n = $filter('i18n'),
			date = $filter('date'),
			faixa = '',
			situacao = '',
			dtEmis,
			dtVenc;

		this.disclaimers = [];
		this.advancedSearch = {};
		this.listResult = [];
		this.resultChart = [];
		this.totalRecords = 0;
		this.listShow = true;
		this.chartShow = false;
		this.logVencid = true;
		this.logAvencer = true;
		this.logAntecipados = true;
		this.chartParameter = false;
		this.chartVenc = true;
		this.chartAvenc = true;

		controller.currency = { nom_prefix_moeda: 'R$' };
		
		controller.tamGrafico = window.innerWidth - 100;

		controller.advancedSearch.periodoVenc = 0;
		controller.advancedSearch.periodoVencimento = [
			{ value: 0, label: i18n('l-filter-bill-all') },
			{ value: 1, label: i18n('l-filter-bill-30-days') },
			{ value: 2, label: i18n('l-filter-bill-31-to-60') },
			{ value: 3, label: i18n('l-filter-bill-61-to-90') },
			{ value: 4, label: i18n('l-filter-bill-91-to-120') },
			{ value: 5, label: i18n('l-filter-bill-more-than-120') }
		];

		this.formatCurrency = function (value) {
			return $filter('currency')(value, controller.currency.nom_prefix_moeda, 2);
		};

		// *********************************************************************************
    	// *** Inicialização da Tela
		// *********************************************************************************

		controller.init = function(){

			appViewService.startView(i18n('l-inquire-vendor-docs'), 'apb.inquirevendordocs.Controller', this);

			/* Caso seja chamado pelo Dashboard, deverá abrir posicionado */
			if (ApbUtil.isDefined(serviceInquireVendorDocsParam.paramOpp)) {
				
				if (serviceInquireVendorDocsParam.paramOpp[0]) {
					dtEmis = serviceInquireVendorDocsParam.paramOpp[0].value;
				}
				if (serviceInquireVendorDocsParam.paramOpp[1]) {
					dtVenc = serviceInquireVendorDocsParam.paramOpp[1].value;
				}
				if (serviceInquireVendorDocsParam.paramOpp[2]) {
					situacao = serviceInquireVendorDocsParam.paramOpp[2].title;
				}
				if (serviceInquireVendorDocsParam.paramOpp[3]) {
					faixa = serviceInquireVendorDocsParam.paramOpp[3].value;
				}

				controller.advancedSearch.periodoVenc = faixa;
				controller.advancedSearch.dtEmis = dtEmis;
				controller.advancedSearch.dtVenc = dtVenc;
				
				controller.setQuickFilter(situacao);
				
				serviceInquireVendorDocsParam.paramOpp = undefined;

			} else {

				$q.all([userPreference.getPreference('inquireVendorDocs.dtEmis'),
						userPreference.getPreference('inquireVendorDocs.dtVenc'),
						userPreference.getPreference('inquireVendorDocs.periodoVenc'),
						userPreference.getPreference('inquireVendorDocs.logVencid'),
						userPreference.getPreference('inquireVendorDocs.logAvencer'),
						userPreference.getPreference('inquireVendorDocs.logAntecipados')])
					.then(function (results) {

					var dtIni = new Date(),
						dtFim = new Date(),
						logVencid = undefined,
						logAvencer = undefined,
						logAntecipados = undefined;

					controller.advancedSearch.periodoVenc = 0;

					if (results && results[0].prefValue) {
						dtIni = new Date(parseFloat(results[0].prefValue));
					} else {
						dtIni.setMonth(dtIni.getMonth() - 1);
					}
					if (results && results[1].prefValue) {
						dtFim = new Date(parseFloat(results[1].prefValue));
					}
					if (results && results[2].prefValue) {
						controller.advancedSearch.periodoVenc = Number(results[2].prefValue);
					}
					if (results && results[3].prefValue) {
						logVencid = results[3].prefValue;
					}
					if (results && results[4].prefValue) {
						logAvencer = results[4].prefValue;
					}
					if (results && results[5].prefValue) {
						logAntecipados = results[5].prefValue;
					}

					controller.logVencid = (logVencid === "true")
					controller.logAvencer = (logAvencer === "true")
					controller.logAntecipados = (logAntecipados === "true")
					controller.advancedSearch.dtEmis = dtIni.getTime();
					controller.advancedSearch.dtVenc = dtFim.getTime();			

					controller.addDisclaimers();
					controller.loadData();

				});

			}

		}

		// *********************************************************************************
    	// *** Carregar Dados
		// *********************************************************************************

		controller.loadData = function (isMore) {

			if (!isMore) {
				controller.listResult = [];
				controller.totalRecords = 0;
			}
			controller.vencidos = undefined;
			controller.aVencer = undefined;
			controller.categories = [];
			controller.series = [];
			var i,
				dValueVencidos,
				dValueAVencer,
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

			if (controller.quickSearchText != undefined && controller.quickSearchText != "") {
				controller.addDisclaimers();
				controller.addDisclaimer('simpleFilter', controller.quickSearchText, i18n('l-code') + ': ' + controller.quickSearchText);
			}

			startAt = controller.listResult.length;

			var UnitMatrixParam = [];
			if(controller.advancedSearch.itemsMatrix){
				controller.advancedSearch.itemsMatrix.forEach(function(value){
					UnitMatrixParam.push({
					'vendorID':value.vendorID,
					'shortName':value.shortName,
					'matrixStatus':value.matrixStatus,
					'visibleStatus':value.visibleStatus});
				});
			};

			var parameters = {
				'ttParameters': {
					'numStart': startAt,
					'numEnd': 25,
					'datEmis': controller.advancedSearch.dtEmis == undefined ? 0 : controller.advancedSearch.dtEmis,
					'datVenc': controller.advancedSearch.dtVenc == undefined ? 0 : controller.advancedSearch.dtVenc,
					'numPeriodoVenc': controller.advancedSearch.periodoVenc == undefined ? 0 : controller.advancedSearch.periodoVenc,
					'logVenc': controller.logVencid,
					'logAvenc': controller.logAvencer,
					'logAntecip': controller.logAntecipados,
					'codBuscaRapida': controller.quickSearchText == undefined ? '' : controller.quickSearchText
				},
				'UnitMatrixParam' : UnitMatrixParam
			}

			controller.applyConfig();

			service.getDocumentList(parameters, function (result) {

				if(result){

					controller.totalRecords = result.totalRecords;

					if(result.OpenDoctsVendorAux) {
						angular.forEach(result.OpenDoctsVendorAux, function (value) {
							controller.listResult.push(value);
						});
					}

					if(result.OpenDoctsVendorResume) {

						controller.tooltipHelp = $rootScope.i18n('l-value', [], 'dts/apb');

						if (controller.chartParameter) {

							dValueVencidos = 0;
							dValueAVencer = 0;

							for (i = 0; i < result.OpenDoctsVendorResume.length; i += 1) {

								dValue = parseFloat(result.OpenDoctsVendorResume[i].valSdoFaixaVencto);

								switch (result.OpenDoctsVendorResume[i].numFaixaVencto) {

									case 1:
										if (result.OpenDoctsVendorResume[i].numSituacao == 1 && controller.chartVenc) {
											
											if  (series1[0] == null) { series1.push(dValue); } else { series1[0] = series1[0] + dValue; }

											dValueVencidos = dValueVencidos + parseFloat(result.OpenDoctsVendorResume[i].valSdoFaixaVencto);

										} else if (result.OpenDoctsVendorResume[i].numSituacao == 2 && controller.chartAvenc) {
											
											if  (seriesAvenc1[0] == null) { seriesAvenc1.push(dValue); } else { seriesAvenc1[0] = seriesAvenc1[0] + dValue; }

											dValueAVencer = dValueAVencer + parseFloat(result.OpenDoctsVendorResume[i].valSdoFaixaVencto);
										}
										break;

									case 2:
										if (result.OpenDoctsVendorResume[i].numSituacao == 1 && controller.chartVenc) {

											if  (series2[0] == null) { series2.push(dValue); } else { series2[0] = series2[0] + dValue; }

											dValueVencidos = dValueVencidos + parseFloat(result.OpenDoctsVendorResume[i].valSdoFaixaVencto);

										} else if (result.OpenDoctsVendorResume[i].numSituacao == 2 && controller.chartAvenc) {

											if  (seriesAvenc2[0] == null) { seriesAvenc2.push(dValue); } else { seriesAvenc2[0] = seriesAvenc2[0] + dValue; }

											dValueAVencer = dValueAVencer + parseFloat(result.OpenDoctsVendorResume[i].valSdoFaixaVencto);
										}
										break;
									
									case 3:
										if (result.OpenDoctsVendorResume[i].numSituacao == 1 && controller.chartVenc) {

											if  (series3[0] == null) { series3.push(dValue); } else { series3[0] = series3[0] + dValue; }

											dValueVencidos = dValueVencidos + parseFloat(result.OpenDoctsVendorResume[i].valSdoFaixaVencto);

										} else if (result.OpenDoctsVendorResume[i].numSituacao == 2 && controller.chartAvenc) {

											if  (seriesAvenc3[0] == null) { seriesAvenc3.push(dValue); } else { seriesAvenc3[0] = seriesAvenc3[0] + dValue; }

											dValueAVencer = dValueAVencer + parseFloat(result.OpenDoctsVendorResume[i].valSdoFaixaVencto);
										}
										break;

									case 4:
										if (result.OpenDoctsVendorResume[i].numSituacao == 1 && controller.chartVenc) {
											
											if  (series4[0] == null) { series4.push(dValue); } else { series4[0] = series4[0] + dValue; }
											
											dValueVencidos = dValueVencidos + parseFloat(result.OpenDoctsVendorResume[i].valSdoFaixaVencto);

										} else if (result.OpenDoctsVendorResume[i].numSituacao == 2 && controller.chartAvenc) {

											if  (seriesAvenc4[0] == null) { seriesAvenc4.push(dValue); } else { seriesAvenc4[0] = seriesAvenc4[0] + dValue; }
											
											dValueAVencer = dValueAVencer + parseFloat(result.OpenDoctsVendorResume[i].valSdoFaixaVencto);
										}
										break;
										
									case 5:
										if (result.OpenDoctsVendorResume[i].numSituacao == 1 && controller.chartVenc) {

											if  (series5[0] == null) { series5.push(dValue); } else { series5[0] = series5[0] + dValue; }

											dValueVencidos = dValueVencidos + parseFloat(result.OpenDoctsVendorResume[i].valSdoFaixaVencto);

										} else if (result.OpenDoctsVendorResume[i].numSituacao == 2 && controller.chartAvenc) {

											if  (seriesAvenc5[0] == null) { seriesAvenc5.push(dValue); } else { seriesAvenc5[0] = seriesAvenc5[0] + dValue; }

											dValueAVencer = dValueAVencer + parseFloat(result.OpenDoctsVendorResume[i].valSdoFaixaVencto);
										}
										break;
								}

							}

							controller.chartParameter = false;

						} else {

							dValueVencidos = 0;
							dValueAVencer = 0;

							for (i = 0; i < result.OpenDoctsVendorResume.length; i += 1) {

								dValue = parseFloat(result.OpenDoctsVendorResume[i].valSdoFaixaVencto);

								switch (result.OpenDoctsVendorResume[i].numFaixaVencto) {

									case 1:
										if (result.OpenDoctsVendorResume[i].numSituacao == 1) {

											if  (series1[0] == null) { series1.push(dValue); } else { series1[0] = series1[0] + dValue; }

											dValueVencidos = dValueVencidos + parseFloat(result.OpenDoctsVendorResume[i].valSdoFaixaVencto);

										} else if (result.OpenDoctsVendorResume[i].numSituacao == 2) {

											if  (seriesAvenc1[0] == null) { seriesAvenc1.push(dValue); } else { seriesAvenc1[0] = seriesAvenc1[0] + dValue; }

											dValueAVencer = dValueAVencer + parseFloat(result.OpenDoctsVendorResume[i].valSdoFaixaVencto);
										}
										break;

									case 2:
										if (result.OpenDoctsVendorResume[i].numSituacao == 1) {

											if  (series2[0] == null) { series2.push(dValue); } else { series2[0] = series2[0] + dValue; }

											dValueVencidos = dValueVencidos + parseFloat(result.OpenDoctsVendorResume[i].valSdoFaixaVencto);

										} else if (result.OpenDoctsVendorResume[i].numSituacao == 2) {

											if  (seriesAvenc2[0] == null) { seriesAvenc2.push(dValue); } else { seriesAvenc2[0] = seriesAvenc2[0] + dValue; }

											dValueAVencer = dValueAVencer + parseFloat(result.OpenDoctsVendorResume[i].valSdoFaixaVencto);
										}
										break;
									
									case 3:
										if (result.OpenDoctsVendorResume[i].numSituacao == 1) {

											if  (series3[0] == null) { series3.push(dValue); } else { series3[0] = series3[0] + dValue; }

											dValueVencidos = dValueVencidos + parseFloat(result.OpenDoctsVendorResume[i].valSdoFaixaVencto);

										} else if (result.OpenDoctsVendorResume[i].numSituacao == 2) {

											if  (seriesAvenc3[0] == null) { seriesAvenc3.push(dValue); } else { seriesAvenc3[0] = seriesAvenc3[0] + dValue; }
											
											dValueAVencer = dValueAVencer + parseFloat(result.OpenDoctsVendorResume[i].valSdoFaixaVencto);
										}
										break;

									case 4:
										if (result.OpenDoctsVendorResume[i].numSituacao == 1) {

											if  (series4[0] == null) { series4.push(dValue); } else { series4[0] = series4[0] + dValue; }

											dValueVencidos = dValueVencidos + parseFloat(result.OpenDoctsVendorResume[i].valSdoFaixaVencto);

										} else if (result.OpenDoctsVendorResume[i].numSituacao == 2) {

											if  (seriesAvenc4[0] == null) { seriesAvenc4.push(dValue); } else { seriesAvenc4[0] = seriesAvenc4[0] + dValue; }

											dValueAVencer = dValueAVencer + parseFloat(result.OpenDoctsVendorResume[i].valSdoFaixaVencto);
										}
										break;
										
									case 5:
										if (result.OpenDoctsVendorResume[i].numSituacao == 1) {

											if  (series5[0] == null) { series5.push(dValue); } else { series5[0] = series5[0] + dValue; }

											dValueVencidos = dValueVencidos + parseFloat(result.OpenDoctsVendorResume[i].valSdoFaixaVencto);
											
										} else if (result.OpenDoctsVendorResume[i].numSituacao == 2) {
											
											if  (seriesAvenc5[0] == null) { seriesAvenc5.push(dValue); } else { seriesAvenc5[0] = seriesAvenc5[0] + dValue; }
											
											dValueAVencer = dValueAVencer + parseFloat(result.OpenDoctsVendorResume[i].valSdoFaixaVencto);
										}
										break;
								}
								
							}
							
						}

						controller.vencidos = dValueVencidos;
						controller.aVencer = dValueAVencer;

						controller.series = [
							{ id: 1, name: controller.traduzFaixa(1), data: series1, tooltip: {template: $rootScope.i18n('l-currency-format', [], 'dts/apb') + "#=kendo.toString(value, 'n2')#" } },
							{ id: 1, name: controller.traduzFaixa(2), data: series2, tooltip: {template: $rootScope.i18n('l-currency-format', [], 'dts/apb') + "#=kendo.toString(value, 'n2')#" } },
							{ id: 1, name: controller.traduzFaixa(3), data: series3, tooltip: {template: $rootScope.i18n('l-currency-format', [], 'dts/apb') + "#=kendo.toString(value, 'n2')#" } },
							{ id: 1, name: controller.traduzFaixa(4), data: series4, tooltip: {template: $rootScope.i18n('l-currency-format', [], 'dts/apb') + "#=kendo.toString(value, 'n2')#" } },
							{ id: 1, name: controller.traduzFaixa(5), data: series5, tooltip: {template: $rootScope.i18n('l-currency-format', [], 'dts/apb') + "#=kendo.toString(value, 'n2')#" } }
						];

						controller.seriesAvenc = [
							{ id: 2, name: controller.traduzFaixa(1), data: seriesAvenc1, tooltip: {template: $rootScope.i18n('l-currency-format', [], 'dts/apb') + "#=kendo.toString(value, 'n2')#" } },
							{ id: 2, name: controller.traduzFaixa(2), data: seriesAvenc2, tooltip: {template: $rootScope.i18n('l-currency-format', [], 'dts/apb') + "#=kendo.toString(value, 'n2')#" } },
							{ id: 2, name: controller.traduzFaixa(3), data: seriesAvenc3, tooltip: {template: $rootScope.i18n('l-currency-format', [], 'dts/apb') + "#=kendo.toString(value, 'n2')#" } },
							{ id: 2, name: controller.traduzFaixa(4), data: seriesAvenc4, tooltip: {template: $rootScope.i18n('l-currency-format', [], 'dts/apb') + "#=kendo.toString(value, 'n2')#" } },
							{ id: 2, name: controller.traduzFaixa(5), data: seriesAvenc5, tooltip: {template: $rootScope.i18n('l-currency-format', [], 'dts/apb') + "#=kendo.toString(value, 'n2')#" } }
						];

						controller.categories = [
							$rootScope.i18n('l-expired', [], 'dts/apb'), 
							$rootScope.i18n('l-not-expired', [], 'dts/apb')
						]; 
					}	
				}			
			});			
		};

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

					controller.logVencid = true;
					controller.logAvencer = false;
					controller.logAntecipados = false;
                    break;

				case 2:
					controller.chartVenc = false;
					controller.chartAvenc = true;
					
					controller.logVencid = false;
					controller.logAvencer = true;
					controller.logAntecipados = false;
                    break;

            }

			switch (event.series.name) {

                case $rootScope.i18n('l-30-days', [], 'dts/acr'):
					controller.advancedSearch.periodoVenc = 1;
                    break;

                case $rootScope.i18n('l-31-to-60-days', [], 'dts/acr'):
					controller.advancedSearch.periodoVenc = 2;
                    break;

                case $rootScope.i18n('l-61-to-90-days', [], 'dts/acr'):
					controller.advancedSearch.periodoVenc = 3;
                    break;
                
                case $rootScope.i18n('l-91-to-120-days', [], 'dts/acr'):
					controller.advancedSearch.periodoVenc = 4;
                    break;

                case $rootScope.i18n('l-more-then-120-days', [], 'dts/acr'):
					controller.advancedSearch.periodoVenc = 5;
                    break;

            }

			controller.addDisclaimers();
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

					controller.logVencid = true;
					controller.logAvencer = false;
					controller.logAntecipados = false;
                    break;

				case 2:
					controller.chartVenc = false;
					controller.chartAvenc = true;
					
					controller.logVencid = false;
					controller.logAvencer = true;
					controller.logAntecipados = false;
                    break;

			}
			
			controller.addDisclaimers();
			controller.loadData(false);

		}

		// *********************************************************************************
    	// *** Tradução de Campos
		// *********************************************************************************

		this.traduzFaixa = function (numFaixaVencto) {
			
			var tradFaixa = '';

			switch (numFaixaVencto) {
				case 1:
					tradFaixa = 'l-30-days';
					break;
				case 2:
					tradFaixa = 'l-31-to-60-days';
					break;
				case 3:
					tradFaixa = 'l-61-to-90-days';
					break;
				case 4:
					tradFaixa = 'l-91-to-120-days';
					break;
				case 5:
					tradFaixa = 'l-more-then-120-days';
					break;
				default:
					tradFaixa = '';
			}

			return $rootScope.i18n(tradFaixa, [], 'dts/apb');

		}
		
		this.traduzSituacao = function (numSituacao) {
			
			var tradSituacao = '';

			switch (numSituacao) {
				case 1:
					tradSituacao = 'l-overdue';
					break;
				case 2:
					tradSituacao = 'l-ondue';
					break;
				case 3:
					tradSituacao = 'l-antecipation';
					break;
				default:
					tradSituacao = '';
			}

			return $rootScope.i18n(tradSituacao, [], 'dts/apb');

		}

		// *********************************************************************************
    	// *** Abrir Pesquisa Avançada
		// *********************************************************************************
	
		this.openAdvancedSearch = function () {
			var modalInstance = $modal.open({
				templateUrl: '/dts/apb/html/inquirevendordocs/inquirevendordocs-adv-search.html',
				controller: 'apb.inquirevendordocs.adv-search.Controller as controller',
				size: 'lg',
				backdrop: 'static',
				keyboard: true,
				resolve: {
					model: function () {
						return controller.advancedSearch;
					}
				}
			});		

			modalInstance.result.then(function () {
				controller.addDisclaimers();
				controller.loadData(false);
			});

		}

		this.applyConfig = function () {

			$q.all([userPreference.setPreference('inquireVendorDocs.dtEmis', new Date(controller.advancedSearch.dtEmis).getTime()),
					userPreference.setPreference('inquireVendorDocs.dtVenc', new Date(controller.advancedSearch.dtVenc).getTime()),
					userPreference.setPreference('inquireVendorDocs.periodoVenc', controller.advancedSearch.periodoVenc),
					userPreference.setPreference('inquireVendorDocs.logVencid', controller.logVencid),
					userPreference.setPreference('inquireVendorDocs.logAvencer', controller.logAvencer),
					userPreference.setPreference('inquireVendorDocs.logAntecipados', controller.logAntecipados)]);
		};

		// *********************************************************************************
    	// *** Abrir Tela de Detalhe
		// *********************************************************************************

		this.openDetail = function (site, vendorID, documentClass, documentSeries, documentCode, documentParcel) {
			var url = '/dts/apb/inquirevendordocdetail',
				disclaimers = [];

			if (site != undefined) {
				disclaimers.push({
					property: 'codEstab',
					value: site,
					model: { property: 'codEstab', value: site }
				});
			}

			if (vendorID != undefined) {
				disclaimers.push({
					property: 'cdnFornecedor',
					value: vendorID,
					model: { property: 'cdnFornecedor', value: vendorID }
				});
			}

			if (documentClass != undefined) {
				disclaimers.push({
					property: 'codEspecDocto',
					value: documentClass,
					model: { property: 'codEspecDocto', value: documentClass }
				});
			}

			if (documentSeries != undefined) {
				disclaimers.push({
					property: 'codSerDocto',
					value: documentSeries,
					model: { property: 'codSerDocto', value: documentSeries }
				});
			}

			if (documentCode != undefined) {
				disclaimers.push({
					property: 'codTitApb',
					value: documentCode,
					model: { property: 'codTitApb', value: documentCode }
				});
			}

			if (documentParcel != undefined) {
				disclaimers.push({
					property: 'codParcela',
					value: documentParcel,
					model: { property: 'codParcela', value: documentParcel }
				});
			}

			serviceInquireVendorDocDetailParam.setParamOpp(disclaimers, function () {
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

		// *********************************************************************************
    	// *** Troca de Visualização entre Lista e Gráfico
		// *********************************************************************************

		this.showList = function () {
			this.listShow = true;
			this.chartShow = false;
		}

		this.showChart = function () {
			this.listShow = false;
			this.chartShow = true;
		}

		// *********************************************************************************
    	// *** Filtros de Busca
		// *********************************************************************************
	
		controller.setQuickFilter = function (key) {

			if (key != undefined) {

				controller.logVencid = false;
				controller.logAvencer = false;
				controller.logAntecipados = false;

				switch (key) {

					case "ANTECIPADOS":
						controller.logVencid = false;
						controller.logAvencer = false;
						controller.logAntecipados = true;
						break;

					case "VENCIDOS":
						controller.logVencid = true;
						controller.logAvencer = false;
						controller.logAntecipados = false;
						break;
						
					case "AVENCER":
						controller.logVencid = false;
						controller.logAntecipados = false;
						controller.logAvencer = true;
						break;

					default:
						controller.logVencid = true;
						controller.logAvencer = true;
						controller.logAntecipados = true;
				}
			}

			controller.addDisclaimers();
			controller.loadData(false);
			
		}

		this.addDisclaimers = function () {

			controller.disclaimers = [];

			if (controller.advancedSearch.dtEmis) {
				controller.addDisclaimer('dtEmis', controller.advancedSearch.dtEmis, i18n('l-print-date') + ': ' + date(controller.advancedSearch.dtEmis, 'shortDate'));
			}
			if (controller.advancedSearch.dtVenc) {
				controller.addDisclaimer('dtVenc', controller.advancedSearch.dtVenc, i18n('l-due-date') + ': ' + date(controller.advancedSearch.dtVenc, 'shortDate'));
			}
			if (controller.advancedSearch.periodoVenc) {
				controller.addDisclaimer('periodoVenc', controller.advancedSearch.periodoVenc, i18n('l-due-date-range') + ': ' + controller.traduzFaixa(controller.advancedSearch.periodoVenc));
			}
			if (controller.advancedSearch.itemsMatrix) {
				controller.advancedSearch.itemsMatrix.forEach(function(value){
					controller.addDisclaimer('UnitMatrixParam', value.vendorID, i18n('l-unit-matrix') + ': ' + value.shortName);
				});
			}
			if (controller.logVencid) {
				controller.addDisclaimer("vencidos", true, i18n('l-overdue') + " " + i18n('l-yes'));
			} else {
				controller.addDisclaimer("vencidos", false, i18n('l-overdue') + " " + i18n('l-no'));
			}
			if (controller.logAvencer) {
				controller.addDisclaimer("aVencer", true, i18n('l-ondue') + " " + i18n('l-yes'));
			} else {
				controller.addDisclaimer("aVencer", false, i18n('l-ondue') + " " + i18n('l-no'));
			}
			if (controller.logAntecipados) {
				controller.addDisclaimer("antecipados", true, i18n('l-antecipation') + " " + i18n('l-yes'));
			} else {
				controller.addDisclaimer("antecipados", false, i18n('l-antecipation') + " " + i18n('l-no'));
			}

		}

		this.addDisclaimer = function (property, value, label) {
			controller.disclaimers.push({
				property: property,
				value: value,
				title: label
			});
		}

		this.removeDisclaimer = function (disclaimer) {

			var index = controller.disclaimers.indexOf(disclaimer);
			if (index != -1) {
				controller.disclaimers.splice(index, 1);
			}

			if (disclaimer.property == "simpleFilter") {
				controller.quickSearchText = '';
			}
			if (disclaimer.property == "dtEmis") {
				controller.advancedSearch.dtEmis = undefined;
			}
			if (disclaimer.property == "dtVenc") {
				controller.advancedSearch.dtVenc = undefined;
			}
			if (disclaimer.property == "periodoVenc") {
				controller.advancedSearch.periodoVenc = undefined;
			}
			if (disclaimer.property == 'UnitMatrixParam') {
				controller.advancedSearch.itemsMatrix.splice(controller.advancedSearch.itemsMatrix.indexOf(disclaimer.value), 1);
			}
			if (disclaimer.property == "vencidos") {
				controller.logVencid = true;
			}
			if (disclaimer.property == "aVencer") {
				controller.logAvencer = true;
			}
			if (disclaimer.property == "antecipados") {
				controller.logAntecipados = true;
			}

			controller.loadData(false);
			
		}

		if ($rootScope.currentuserLoaded) { this.init(); }

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			controller.init();
		});

	} // function inquireVendorDocsController(loadedModules) 
	index.register.controller('apb.inquirevendordocs.Controller', inquireVendorDocsController);

	// *********************************************************************************
    // *** Controller Pesquisa Avançada
    // *********************************************************************************

	inquireVendorDocsAdvSearchController.$inject = ['$modalInstance', 'model', 'apb.inquirevendordocs.Factory'];
	function inquireVendorDocsAdvSearchController($modalInstance, model, service) {
		
		// recebe os dados de pesquisa atuais e coloca no controller
		this.advancedSearch = model;
		var ctrl = this;
		ctrl.unitMatrix = [];
		
		service.getUnitMatrix(function (result) {
			if (result) {
				angular.forEach(result, function (value) {
					// adicionar os fornecedores da matriz no filtro para seleção
					ctrl.unitMatrix.push(value);
				});
			}
		});

		this.search = function () {
			$modalInstance.close();
		}		

		this.close = function () {
			$modalInstance.dismiss();
		}

	}
	index.register.controller('apb.inquirevendordocs.adv-search.Controller', inquireVendorDocsAdvSearchController);

});
