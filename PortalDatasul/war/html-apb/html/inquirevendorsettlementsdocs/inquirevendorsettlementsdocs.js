define(['index',
	'/dts/apb/js/userpreference.js',
	'/dts/apb/js/apb-factories.js',
	'/dts/apb/js/api/inquirevendorsettlementsdocs.js',
	'/dts/apb/js/apb-components.js',
	'/dts/apb/html/inquirevendordocdetail/inquirevendordocdetail-services.param.js'
], function (index) {

	index.stateProvider

		.state('dts/apb/inquirevendorsettlementsdocs', {
			abstract: true,
			template: '<ui-view/>'
		})
		.state('dts/apb/inquirevendorsettlementsdocs.start', {
			url: '/dts/apb/inquirevendorsettlementsdocs',
			controller: 'apb.inquirevendorsettlementsdocs.Controller',
			controllerAs: 'controller',
			templateUrl: '/dts/apb/html/inquirevendorsettlementsdocs/inquirevendorsettlementsdocs.html'
		});

	inquireVendorSettlementsDocsController.$inject = ['$rootScope',
		'$scope',
		'$location',
		'apb.inquirevendorsettlementsdocs.Factory',
		'userPreference',
		'totvs.app-main-view.Service',
		'$filter',
		'$q',
		'$modal',
		'TOTVSEvent',
		'apb.inquirevendordocdetail.param-service'];

	function inquireVendorSettlementsDocsController($rootScope,
		$scope,
		$location,
		service,
		userPreference,
		appViewService,
		$filter,
		$q,
		$modal,
		TOTVSEvent,
		serviceInquireVendorDocDetailParam) {

		var controller = this,
			i18n = $filter('i18n'),
			date = $filter('date');

		this.disclaimers = [];
		this.advancedSearch = {};
		this.listResult = [];
		this.totalRecords = 0;
		this.listShow = true;
		this.chartShow = false;
		this.documentResume = {
			settlementsAmount: 0,
			discountAmount: 0,
			writeOffAmount: 0,
			interestAmount: 0,
			penaltyAmount: 0
		};
		
		controller.currency = { nom_prefix_moeda: 'R$' };
				
		controller.tamGrafico = window.innerWidth - 275;
		controller.tamGraficoH = window.innerHeight - 275;

		controller.advancedSearch.numTipoPagamento = 0;
		controller.advancedSearch.desTipoPagamento = [
			{ value: 0, label: i18n('l-all') },
			{ value: 1, label: i18n('l-normal') },
			{ value: 2, label: i18n('l-antecipation') },
			{ value: 3, label: i18n('l-imposto-retido') },
			{ value: 4, label: i18n('l-imposto-taxado') },
			{ value: 5, label: i18n('l-extra-fornecedor') }
		];

		controller.advancedSearch.numModoPagamento = 0;
		controller.advancedSearch.desModoPagamento = [
			{ value: 0, label: i18n('l-all') },
			{ value: 1, label: i18n('l-cheque') },
			{ value: 2, label: i18n('l-bordero') },
			{ value: 3, label: i18n('l-dinheiro') },
			{ value: 4, label: i18n('l-escritural') },
			{ value: 5, label: i18n('l-cartao-credito') }
		];

		controller.advancedSearch.codIndicEcon = 0;
		controller.advancedSearch.desIndicEcon = [
			{ value: 0, label: i18n('l-all') }
		];

		this.formatCurrency = function (value) {
			return $filter('currency')(value, controller.currency.nom_prefix_moeda, 2);
		};

		// *********************************************************************************
    	// *** Inicialização da Tela
		// *********************************************************************************

		controller.init = function(){

			if (appViewService.startView(i18n('l-inquire-vendor-settlements-docs'), 'apb.inquirevendorsettlementsdocs.Controller', this)) {

				$q.all([userPreference.getPreference('inquireVendorSettlementsDocs.datVenctoTitApbIni'),
						userPreference.getPreference('inquireVendorSettlementsDocs.datVenctoTitApbFim'),
						userPreference.getPreference('inquireVendorSettlementsDocs.numTipoPagamento'),
						userPreference.getPreference('inquireVendorSettlementsDocs.numModoPagamento')])
					.then(function (results) {

					var dtIni = new Date();
					var dtFim = new Date();

					if (results && results[0].prefValue) {
						dtIni = new Date(parseFloat(results[0].prefValue));
					} else {
						dtIni.setMonth(dtIni.getMonth() - 1);
					}
					if (results && results[1].prefValue) {
						dtFim = new Date(parseFloat(results[1].prefValue));
					}
					if (results && results[2].prefValue) {
						controller.advancedSearch.numTipoPagamento = Number(results[2].prefValue);
					}
					if (results && results[3].prefValue) {
						controller.advancedSearch.numModoPagamento = Number(results[3].prefValue);
					}

					controller.advancedSearch.datVenctoTitApbIni = dtIni.getTime();
					controller.advancedSearch.datVenctoTitApbFim = dtFim.getTime();					
					
					controller.addDisclaimers();
					controller.loadData(false);

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
			controller.optionsTotal = [];
			controller.series = [];
			var i,
				startAt = 0,
				series1 = [],
				newCurrency = false;

			if (controller.quickSearchText) {
				controller.addDisclaimers();
				controller.addDisclaimer('simpleFilter', controller.quickSearchText, i18n('l-code') + ': ' + controller.quickSearchText);
			}

			startAt = controller.listResult.length;

			var UnitMatrixParam = [];
			if(controller.advancedSearch.itemsMatrix){
				controller.advancedSearch.itemsMatrix.forEach(function(value){
					UnitMatrixParam.push({
						'vendorID': value.vendorID,
						'shortName': value.shortName,
						'matrixStatus': value.matrixStatus,
						'visibleStatus': value.visibleStatus
					});
				});
			};

			if (controller.advancedSearch.codIndicEcon == undefined) {
				controller.advancedSearch.codIndicEcon = 0;
			}

			var parameters = {
				'ttParameters': {
					'numStart': startAt,
					'numEnd': 50,
					'datVenctoTitApbIni': controller.advancedSearch.datVenctoTitApbIni == undefined ? 0 : controller.advancedSearch.datVenctoTitApbIni,
					'datVenctoTitApbFim': controller.advancedSearch.datVenctoTitApbFim == undefined ? 0 : controller.advancedSearch.datVenctoTitApbFim,
					'codIndicEcon': controller.advancedSearch.codIndicEcon == 0 ? "" : controller.advancedSearch.desIndicEcon[controller.advancedSearch.codIndicEcon].label,
					'numTipoPagamento': controller.advancedSearch.numTipoPagamento == undefined ? 0 : controller.advancedSearch.numTipoPagamento,
					'numModoPagamento': controller.advancedSearch.numModoPagamento == undefined ? 0 : controller.advancedSearch.numModoPagamento,
					'codBuscaRapida': controller.quickSearchText == undefined ? '' : controller.quickSearchText
				},
				'UnitMatrixParam' : UnitMatrixParam
			}

			service.getDocumentList(parameters, function (result) {

				if (result) {
					
					if (result.SettlementsDoctsVendorAux) {

						controller.totalRecords = result.totalRecords;
						controller.listResult = result.SettlementsDoctsVendorAux;

					}
					
					if (result.SettlementsDoctsVendorResume) {

						controller.documentResume.settlementsAmount = 0;
						controller.documentResume.discountAmount = 0;
						controller.documentResume.writeOffAmount = 0;
						controller.documentResume.interestAmount = 0;
						controller.documentResume.penaltyAmount = 0;

						controller.tooltipHelp = $rootScope.i18n('l-values', [], 'dts/apb');

						controller.dataTotal = [];

						if (controller.advancedSearch.codIndicEcon == 0) {

							newCurrency = true;
							controller.advancedSearch.desIndicEcon = [
								{ value: 0, label: i18n('l-all') }
							];

						}
						
						for (i = 0; i < result.SettlementsDoctsVendorResume.length; i += 1) {

							series1 = parseFloat(result.SettlementsDoctsVendorResume[i].valorMovto);

							// Resgate de Totais (Resumo)
							controller.documentResume.settlementsAmount = controller.documentResume.settlementsAmount + series1;
							controller.documentResume.discountAmount = controller.documentResume.discountAmount + result.SettlementsDoctsVendorResume[i].valorDesconto;
							controller.documentResume.writeOffAmount = controller.documentResume.writeOffAmount + result.SettlementsDoctsVendorResume[i].valorAbatimento;
							controller.documentResume.interestAmount = controller.documentResume.interestAmount + result.SettlementsDoctsVendorResume[i].valorJuros;
							controller.documentResume.penaltyAmount = controller.documentResume.penaltyAmount + result.SettlementsDoctsVendorResume[i].valorMulta;
							
							if (series1 > 0) {
								controller.dataTotal.push({
									category: $rootScope.i18n('l-vendor', [], 'dts/apb') + 
											': ' + 
											result.SettlementsDoctsVendorResume[i].cdnFornecedor +
											' \n ' + 
											$rootScope.i18n('l-currency', [], 'dts/apb') + 
											': ' + 
											result.SettlementsDoctsVendorResume[i].codIndicEcon +
											' \n ',
									value: series1.toString(),
									total: series1
								});
							}

							// Resgate dos indicadores econômicos contidos nos títulos 
							if (newCurrency) {
								controller.advancedSearch.desIndicEcon.push({
									value: i + 1,
									label: result.SettlementsDoctsVendorResume[i].codIndicEcon
								});
							}

						}

						newCurrency = false;

						controller.optionsTotal = {
							legend: {
								position: "bottom",
								visible: false
							},
							seriesDefaults: { 
								labels: { 
									visible: true, 
									background: "transparent", 
									template : function (dataItem) {
										return dataItem.dataItem.category + controller.formatCurrency(dataItem.dataItem.total);
									}
								} 
							},
							tooltip: {
								visible: true,
								template: function (dataItem) {
									return dataItem.dataItem.category + " : " +  controller.formatCurrency(dataItem.dataItem.total);
								}
							},
							series: [{
								overlay: {
									gradient: "roundedBevel"
								},
								startAngle: 180,
								data: controller.dataTotal,
								type: "pie"
							}]
						};

					}
				}			
			});

			controller.applyConfig();

		};

		this.getResume = function (result) {

			var i;

			for (i = 0; i < result.length; i++) {
					
				if (result[i].valorMovto) {
					controller.documentResume.settlementsAmount = controller.documentResume.settlementsAmount + result[i].valorMovto;
				}
				if (result[i].valorDesconto) {
					controller.documentResume.discountAmount = controller.documentResume.discountAmount + result[i].valorDesconto;
				}
				if (result[i].valorAbatimento) {
					controller.documentResume.writeOffAmount = controller.documentResume.writeOffAmount + result[i].valorAbatimento;
				}
				if (result[i].valorJuros) {
					controller.documentResume.interestAmount = controller.documentResume.interestAmount + result[i].valorJuros;
				}
				if (result[i].valorMulta) {
					controller.documentResume.penaltyAmount = controller.documentResume.penaltyAmount + result[i].valorMulta;
				}

			}
			
		};

		// *********************************************************************************
    	// *** Tradução de Campos
		// *********************************************************************************

		this.traduzTipoPagamento = function (numTipoPagamento) {
			
			var tradTipoPagamento = '';

			switch (numTipoPagamento) {
				case 1:
					tradTipoPagamento = 'l-normal';
					break;
				case 2:
					tradTipoPagamento = 'l-antecipation';
					break;
				case 3:
					tradTipoPagamento = 'l-imposto-retido';
					break;
				case 4:
					tradTipoPagamento = 'l-imposto-taxado';
					break;
				case 5:
					tradTipoPagamento = 'l-extra-fornecedor';
					break;
				case "Normal":
					tradTipoPagamento = 'l-normal';
					break;
				case "Antecipação":
					tradTipoPagamento = 'l-antecipation';
					break;
				case "Imposto Retido":
					tradTipoPagamento = 'l-imposto-retido';
					break;
				case "Imposto Taxado":
					tradTipoPagamento = 'l-imposto-taxado';
					break;
				case "Extra Fornecedor":
					tradTipoPagamento = 'l-extra-fornecedor';
					break;
				default:
					tradTipoPagamento = '';
			}

			return $rootScope.i18n(tradTipoPagamento, [], 'dts/apb');

		}		
		
		this.traduzModoPagamento = function (numModoPagamento) {
			
			var tradModoPagamento = '';

			switch (numModoPagamento) {
				case 1:
					tradModoPagamento = 'l-cheque';
					break;
				case 2:
					tradModoPagamento = 'l-bordero';
					break;
				case 3:
					tradModoPagamento = 'l-dinheiro';
					break;
				case 4:
					tradModoPagamento = 'l-escritural';
					break;
				case 5:
					tradModoPagamento = 'l-cartao-credito';
					break;
				default:
					tradModoPagamento = '';
			}

			return $rootScope.i18n(tradModoPagamento, [], 'dts/apb');

		}

		// *********************************************************************************
    	// *** Abrir Pesquisa Avançada
		// *********************************************************************************
	
		this.openAdvancedSearch = function () {
			var modalInstance = $modal.open({
				templateUrl: '/dts/apb/html/inquirevendorsettlementsdocs/inquirevendorsettlementsdocs-adv-search.html',
				controller: 'apb.inquirevendorsettlementsdocs.adv-search.Controller as controller',
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

		this.openResume = function () {
			var modalInstance = $modal.open({
				templateUrl: '/dts/apb/html/inquirevendorsettlementsdocs/inquirevendorsettlementsdocs-resume.html',
				controller: 'apb.inquirevendorsettlementsdocs.resume.Controller as controller',
				size: 'sm',
				resolve: {
					modalParams: function () {
						return {
							documentResume: controller.documentResume
						}
					}
				}
			});

		}

		this.applyConfig = function () {

			$q.all([userPreference.setPreference('inquireVendorSettlementsDocs.datVenctoTitApbIni', new Date(controller.advancedSearch.datVenctoTitApbIni).getTime()),
					userPreference.setPreference('inquireVendorSettlementsDocs.datVenctoTitApbFim', new Date(controller.advancedSearch.datVenctoTitApbFim).getTime()),
					userPreference.setPreference('inquireVendorSettlementsDocs.numTipoPagamento', controller.advancedSearch.numTipoPagamento),
					userPreference.setPreference('inquireVendorSettlementsDocs.numModoPagamento', controller.advancedSearch.numModoPagamento)]);

		};

		// *********************************************************************************
    	// *** Abrir Tela de Detalhe
		// *********************************************************************************

		this.openDetail = function (site, vendorID, documentClass, documentSeries, documentCode, documentParcel) {
			var url = '/dts/apb/inquirevendordocdetail',
				disclaimers = [];

			if (documentCode == undefined | documentCode == "") { 
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('l-document', [], 'dts/apb'),
					detail: $rootScope.i18n('documento-sem-codigo', [], 'dts/apb')
				});

				return;
			}

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

			switch (key) {
				case "CHEQUE":
					controller.advancedSearch.numModoPagamento = 1;
					break;
				case "BORDERO":
					controller.advancedSearch.numModoPagamento = 2;
					break;
				case "DINHEIRO":
					controller.advancedSearch.numModoPagamento = 3;
					break;
				case "ESCRITURAL":
					controller.advancedSearch.numModoPagamento = 4;
					break;
				case "CARTAOCREDITO":
					controller.advancedSearch.numModoPagamento = 5;
					break;
			}			

			controller.addDisclaimers();
			controller.loadData(false);
			
		}

		this.addDisclaimers = function () {

			controller.disclaimers = [];

			if (controller.advancedSearch.datVenctoTitApbIni) {
				controller.addDisclaimer('datVenctoTitApbIni', controller.advancedSearch.datVenctoTitApbIni, i18n('l-initial-payment-date') + ': ' + date(controller.advancedSearch.datVenctoTitApbIni, 'shortDate'));
			}
			if (controller.advancedSearch.datVenctoTitApbFim) {
				controller.addDisclaimer('datVenctoTitApbFim', controller.advancedSearch.datVenctoTitApbFim, i18n('l-final-payment-date') + ': ' + date(controller.advancedSearch.datVenctoTitApbFim, 'shortDate'));
			}
			if (controller.advancedSearch.numTipoPagamento) {
				controller.addDisclaimer('numTipoPagamento', controller.advancedSearch.numTipoPagamento, i18n('l-tipo-pagamento') + ': ' + controller.traduzTipoPagamento(controller.advancedSearch.numTipoPagamento));
			}
			if (controller.advancedSearch.numModoPagamento) {
				controller.addDisclaimer('numModoPagamento', controller.advancedSearch.numModoPagamento, i18n('l-modo-pagamento') + ': ' + controller.traduzModoPagamento(controller.advancedSearch.numModoPagamento));
			}
			if (controller.advancedSearch.itemsMatrix) {
				controller.advancedSearch.itemsMatrix.forEach(function(value){
					controller.addDisclaimer('UnitMatrixParam', value.vendorID, i18n('l-unit-matrix') + ': ' + value.shortName);
				});
			}
			if (controller.advancedSearch.codIndicEcon) {
				controller.addDisclaimer('codIndicEcon', controller.advancedSearch.codIndicEcon, i18n('l-currency') + ': ' + controller.advancedSearch.desIndicEcon[controller.advancedSearch.codIndicEcon].label);
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
			if (disclaimer.property == "datVenctoTitApbIni") {
				controller.advancedSearch.datVenctoTitApbIni = undefined;
			}
			if (disclaimer.property == "datVenctoTitApbFim") {
				controller.advancedSearch.datVenctoTitApbFim = undefined;
			}
			if (disclaimer.property == "codIndicEcon") {
				controller.advancedSearch.codIndicEcon = undefined;
			}
			if (disclaimer.property == 'UnitMatrixParam') {
				controller.advancedSearch.itemsMatrix.splice(controller.advancedSearch.itemsMatrix.indexOf(disclaimer.value), 1);
			}
			if (disclaimer.property == "numTipoPagamento") {
				controller.advancedSearch.numTipoPagamento = undefined;
			}
			if (disclaimer.property == "numModoPagamento") {
				controller.advancedSearch.numModoPagamento = undefined;
			}
			
			controller.loadData();
			
		}

		if ($rootScope.currentuserLoaded) { this.init(); }

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			controller.init();
		});

	} // function inquireVendorSettlementsDocsController(loadedModules) 
	index.register.controller('apb.inquirevendorsettlementsdocs.Controller', inquireVendorSettlementsDocsController);

	// *********************************************************************************
    // *** Controller Pesquisa Avançada
    // *********************************************************************************

	inquireVendorSettlementsDocsAdvSearchController.$inject = ['$modalInstance', 'model', 'apb.inquirevendorsettlementsdocs.Factory'];
	function inquireVendorSettlementsDocsAdvSearchController($modalInstance, model, service) {
		
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
	index.register.controller('apb.inquirevendorsettlementsdocs.adv-search.Controller', inquireVendorSettlementsDocsAdvSearchController);

	inquireDocumentsResume.$inject = ['$modalInstance', 'modalParams'];
	function inquireDocumentsResume($modalInstance, modalParams) {

		var controller = this;

		controller.documentResume = modalParams.documentResume;

		this.close = function () {
			$modalInstance.dismiss();
		}

	}
	index.register.controller('apb.inquirevendorsettlementsdocs.resume.Controller', inquireDocumentsResume);

});
