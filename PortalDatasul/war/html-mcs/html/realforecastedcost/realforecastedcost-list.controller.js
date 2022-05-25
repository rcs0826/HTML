define(['index'], function(index) {
	
	/**
	 * Controller List
	 */
	realforecastedcostCtrl.$inject = [
		'$rootScope', 
		'$scope', 
		'$filter',
		'i18nFilter',
		'totvs.app-main-view.Service',
		'$stateParams',
		'$location',		
		'mpd.estabelec.zoom',		
		'fchmcs.fchmcs0002.Factory',
		'fchmcs.fchmcs0003.Factory',		
		'helperRealforecastedcost',
		'$modal',		
	];
	
	function realforecastedcostCtrl($rootScope,
										  $scope,										  
										  $filter,
										  i18n,
										  appViewService,
										  $stateParams,
										  $location,										  
										  serviceSiteZoom,										  
										  fchmcs0002Factory,
										  fchmcs0003Factory,
										  helperRealforecastedcost,
										  $modal) {
		var controller = this; 

		controller.serviceSiteZoom = serviceSiteZoom;
		controller.quickSearchTextItems = "";
		controller.model = {initialPeriod: new Date(),
							finalPeriod:  new Date()};
		controller.listofitems = [];
		
		controller.advancedSearch = {
			itemCodRange: {
				start: "",
				end: "ZZZZZZZZZZZZZZZZ"
			},
			geCodRange: {
				start: 0,
				end: 99
			},
			fmCodRange: {
				start: "",
				end: "ZZZZZZZZ"
			},
			variation: {
				start: -999.99,
				end: 999.99
			},
			showItemsWithoutVariation: true
		};

		
		controller.init = function() {
			createTab = appViewService.startView($rootScope.i18n('l-real-forecasted-cost'), 'mcs.realforecastedcost-list.controller', controller);
			previousView = appViewService.previousView;

			if ($stateParams && $stateParams.site && $stateParams.date) {
				if (helperRealforecastedcost == undefined ||
					helperRealforecastedcost.data.site == undefined ||
					helperRealforecastedcost.data.site != $stateParams.site) {
						controller.model.finalPeriod = parseInt($stateParams.date);
						controller.model.site = $stateParams.site;

						controller.listofitems = [];
					}				
			}							
			
			if (controller.model.site == undefined || controller.model.site == "*" ) {
				fchmcs0002Factory.productiveSite( function(result){
					if (result && result.pCodEstabel) {
						controller.model.site = result.pCodEstabel;
						controller.listofitems = [];
					}
				});
			}

			if (controller.model.site && controller.model.finalPeriod) {
				controller.listItens();
			}
		}

		controller.addDisclaimers = function() {

			//zerar os disclaimers
			controller.disclaimers = [];
			

			for (key in controller.advancedSearch) {
				
				var localdisclaimer = controller.advancedSearch[key];
				
				if(localdisclaimer == undefined) continue;

				switch(key) {
					case 'itemCodRange':
						if (controller.advancedSearch[key].start == "" && 
							controller.advancedSearch[key].end == "ZZZZZZZZZZZZZZZZ") continue;
							controller.disclaimers.push({
							property: 'itemCodRange',
							value: controller.advancedSearch[key],
							title: $rootScope.i18n('l-item', [], 'dts/mcs') + ': ' + (controller.advancedSearch[key].start || "") + ' ' +
									$rootScope.i18n('l-to', [], 'dts/mcs') + ' ' + (controller.advancedSearch[key].end || "")
						})
					break;
					case 'fmCodRange':
						if (controller.advancedSearch[key].start == "" && 
							controller.advancedSearch[key].end == "ZZZZZZZZ") continue;										
							controller.disclaimers.push({
							property: 'fmCodRange',
							value: controller.advancedSearch[key],
							title: $rootScope.i18n('l-family', [], 'dts/mcs') + ': ' + (controller.advancedSearch[key].start || "") + ' ' +
									$rootScope.i18n('l-to', [], 'dts/mcs') + ' ' + (controller.advancedSearch[key].end || "")
						})						
					break;
					case 'geCodRange':
						if ((controller.advancedSearch[key].start == "" || 
							controller.advancedSearch[key].start == "0" ||
						    controller.advancedSearch[key].start == null) && 
							controller.advancedSearch[key].end == "99") continue;
							controller.disclaimers.push({
							property: 'geCodRange',
							value: controller.advancedSearch[key],
							title: $rootScope.i18n('l-stock-group', [], 'dts/mcs') + ': ' + (controller.advancedSearch[key].start || "") + ' ' +
									$rootScope.i18n('l-to', [], 'dts/mcs') + ' ' + (controller.advancedSearch[key].end || "")
						})
					break;
					case 'variation':
						if (controller.advancedSearch[key].start == -999.99 && 
							controller.advancedSearch[key].end == 999.99) continue;
							controller.disclaimers.push({
							property: 'variation',
							value: controller.advancedSearch[key],
							title: $rootScope.i18n('l-variation', [], 'dts/mcs') + ': ' + controller.advancedSearch[key].start + ' ' +
									$rootScope.i18n('l-to', [], 'dts/mcs') + ' ' + controller.advancedSearch[key].end
						})
					break;
					case 'showItemsWithoutVariation':
						if (controller.advancedSearch[key] == true) continue;
							controller.disclaimers.push({
							property: 'showItemsWithoutVariation',
							value: controller.advancedSearch[key],
							title: $rootScope.i18n('l-print-zero-variance', [], 'dts/mcs') + ': ' + $rootScope.i18n('l-no', [], 'dts/mcs')
						})
					break;
					
				}
			}
		}		

		controller.removeDisclaimer = function (disclaimer) {
			// pesquisa e remove o disclaimer do array
			
			var index = controller.disclaimers.indexOf(disclaimer);
			
			if (index != -1) {
				controller.disclaimers.splice(index, 1);
			};
			
			if (disclaimer.property == 'itemCodRange') {
				controller.advancedSearch.itemCodRange.start = '';
				controller.advancedSearch.itemCodRange.end = 'ZZZZZZZZZZZZZZZZ';
			};
			if (disclaimer.property == 'fmCodRange') {
				controller.advancedSearch.fmCodRange.start = '';
				controller.advancedSearch.fmCodRange.end = 'ZZZZZZZZ';
			};
			if (disclaimer.property == 'geCodRange') {
				controller.advancedSearch.geCodRange.start = 0;
				controller.advancedSearch.geCodRange.end = 99;
			};
			if (disclaimer.property == 'variation') {
				controller.advancedSearch.variation.start = -999.99;
				controller.advancedSearch.variation.end = 999.99;
			};
			if (disclaimer.property == 'showItemsWithoutVariation') {
				controller.advancedSearch.showItemsWithoutVariation = true;
			};

			// recarrega os dados quando remove um disclaimer
			controller.listItens();
		};

		controller.onChangeSite = function() {

			var parameters = {
				site: controller.model.site
			}

			fchmcs0002Factory.period(parameters, function(result){

				if (result) {
					controller.model.finalPeriod      = new Date(result.pDtFimPer);
				} else {
					controller.model.finalPeriod      = new Date();
				}
			});
		}

		controller.listItens = function() {
			var parameters = {
				estab: controller.model.site,				
				finalPeriod: controller.model.finalPeriod,
				codItem: (controller.quickSearchTextItems === undefined) ? '' : controller.quickSearchTextItems,
				codItemIni: (controller.advancedSearch.itemCodRange.start === undefined) ? '' : controller.advancedSearch.itemCodRange.start,
				codItemFim: (controller.advancedSearch.itemCodRange.end === undefined) ? '' : controller.advancedSearch.itemCodRange.end,
				geCodigoIni: (controller.advancedSearch.geCodRange.start === undefined) ? 0 : controller.advancedSearch.geCodRange.start,
				geCodigoFim: (controller.advancedSearch.geCodRange.end === undefined) ? 0 : controller.advancedSearch.geCodRange.end,
				familiaIni: (controller.advancedSearch.fmCodRange.start === undefined) ? '' : controller.advancedSearch.fmCodRange.start,
				familiaFim: (controller.advancedSearch.fmCodRange.end === undefined) ? '' : controller.advancedSearch.fmCodRange.end,
				variacaoIni: (controller.advancedSearch.variation.start === undefined) ? 0 : controller.advancedSearch.variation.start,
				variacaoFim: (controller.advancedSearch.variation.end === undefined) ? 0 : controller.advancedSearch.variation.end,
				mostrarItensSemVariacao: controller.advancedSearch.showItemsWithoutVariation
			}
			
			fchmcs0003Factory.listitems (parameters, function(result) {

				if (result){
					controller.listofitems = result;	
				}

			});
		}

		controller.exportListCsv = function() {
			

			var parameters = {
				estab: controller.model.site,				
				finalPeriod: controller.model.finalPeriod,
				codItem: (controller.quickSearchTextItems === undefined) ? '' : controller.quickSearchTextItems,
				codItemIni: (controller.advancedSearch.itemCodRange.start === undefined) ? '' : controller.advancedSearch.itemCodRange.start,
				codItemFim: (controller.advancedSearch.itemCodRange.end === undefined) ? '' : controller.advancedSearch.itemCodRange.end,
				geCodigoIni: (controller.advancedSearch.geCodRange.start === undefined) ? 0 : controller.advancedSearch.geCodRange.start,
				geCodigoFim: (controller.advancedSearch.geCodRange.end === undefined) ? 0 : controller.advancedSearch.geCodRange.end,
				familiaIni: (controller.advancedSearch.fmCodRange.start === undefined) ? '' : controller.advancedSearch.fmCodRange.start,
				familiaFim: (controller.advancedSearch.fmCodRange.end === undefined) ? '' : controller.advancedSearch.fmCodRange.end,
				variacaoIni: (controller.advancedSearch.variation.start === undefined) ? 0 : controller.advancedSearch.variation.start,
				variacaoFim: (controller.advancedSearch.variation.end === undefined) ? 0 : controller.advancedSearch.variation.end,
				mostrarItensSemVariacao: controller.advancedSearch.showItemsWithoutVariation
			}

			//Busca os itens do cenário selecionado
			fchmcs0003Factory.listItemscsv(parameters, function(result){

				if (result && result.csv != "") {
					var ie = navigator.userAgent.match(/MSIE\s([\d.]+)/),
						ie11 = navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/rv:11/),
						ieEDGE = navigator.userAgent.match(/Edge/g),
						ieVer=(ie ? ie[1] : (ie11 ? 11 : (ieEDGE ? 12 : -1)));

					if (ie && ieVer<10) {
						console.log("No blobs on IE ver<10");
						return;
					}
		
					var textFileAsBlob = new Blob([result.csv], {type: 'text/plain'});
					var fileName = 
						i18n('l-real-forecasted-cost', [], 'dts/mcs') + " - " + i18n('l-site', [], 'dts/mcs') + " - " + controller.model.site + '.csv';


					if (ieVer>-1) {
						window.navigator.msSaveBlob(textFileAsBlob, fileName);
					} else {
						var alink         = document.createElement('a');
						alink.href        = 'data:attachment/csv,' +  encodeURIComponent(result.csv);
						alink.target      = '_blank';
						alink.download    = fileName;

						document.body.appendChild(alink);

						setTimeout(function() {
							alink.click();	
						}, 100);							
						
					}
				}
			});
		}

		controller.openComparative = function() {
						
			if (controller.selectedItem){
				var path = "dts/mcs/comparativeRealStandard/" 
					+ controller.selectedItem["cod-estabel"] + "/"
					+ controller.selectedItem["it-codigo"] + "/"
					+ controller.selectedItem["dat-period"];

				$location.path(path);

			}
			

		}

		controller.openAdvancedSearch = function() {
			var modalInstance = $modal.open({
				templateUrl: '/dts/mcs/html/realforecastedcost/realforecastedcost-advancedsearch.html',
				controller: 'mcs.realforecastedcost.advancedsearch.controller as controller',
				size: 'md',
				resolve: {
				  model: function () {
					// passa o objeto com os dados da pesquisa avançada para o modal
					return controller.advancedSearch;
				  }
				}
			});
			
			modalInstance.result.then(function (model) {
				
				controller.advancedSearch = model;
				
				controller.addDisclaimers();
				controller.listItens();
			});
		}
		
		$scope.$on('$destroy', function () {
	            helperRealforecastedcost.data = {
	                site: $stateParams.site,
	                dtTrans: $stateParams.date
	            };

	            controller = undefined;
		});
		
		controller.init();
	}
	
	index.register.service('helperRealforecastedcost', function() {
		return {
			data: {}
		};
	});

	index.register.controller('mcs.realforecastedcost-list.controller', realforecastedcostCtrl);
			
});