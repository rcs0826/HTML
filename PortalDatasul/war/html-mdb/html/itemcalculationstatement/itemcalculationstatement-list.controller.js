define(['index'], function(index) {
	
	/**
	 * Controller List
	 */
	itemCalculationStatementCtrl.$inject = [
		'$rootScope', 
		'$scope',
		'$timeout',
		'$modal',
		'$filter',
		'totvs.app-main-view.Service',
		'fchmdb.fchmdb0001.Factory',
		'$location',
		'$stateParams',
		'helperItemDetail',
	];
	
	function itemCalculationStatementCtrl($rootScope,
										  $scope,
										  $timeout,
										  $modal,
										  $filter,
										  appViewService,
										  fchmdb0001Factory,
										  $location,
										  $stateParams,
										  helperItemDetail) {
		var controller = this; 

		controller.items = [];
		controller.scenarios = [];
		controller.selectedScenario = '';
		controller.selectedSimulation = '';
		controller.multiEstab = false;
		controller.listCombo = [];
		controller.listSimulScenario = [];
		controller.userScenario = "";
		controller.dateCenario = "";
		controller.stageScenario = "";
		controller.quickSearchTextItems = "";
		controller.hasMore = false;		
		controller.advancedSearch = {"itemCodRange": { "start":"", "end": "ZZZZZZZZZZZZZZZZ"},
									"refCodRange": {"start":"", "end": "ZZZZZZZZ"}, 
									"fmCodRange": {"start":"", "end":"ZZZZZZZZ"},
									"geCodRange": {"start":"0", "end":"99"},
									"cdPlanejRange": {"start":"", "end":"ZZZZZZZZZZZZ"},
									"codComprRange": {"start":"", "end":"ZZZZZZZZZZZZ"},
									"logcomprado": true,
									"logfabricado": true,
									"perfixo": true,
									"loteeconomi": true,
									"ordem": true,
									"nivelsuperior": true,
									"configurado": true,
									"realconsumo": true,
									"logestseg": false,
									"percestseg": "0.00",
									"logperda": true,
									};

		controller.init = function() {
			createTab = appViewService.startView($rootScope.i18n('l-item-calculation-statement'), 'mdb.itemcalculationstatement-list.controller', controller);
			previousView = appViewService.previousView;	
			controller.listCombo = controller.listComboCenario();
		}

		//retorna a lista de cenários no padrão de combo-box do THF
		controller.listComboCenario = function() {
			//Array a ser retornado
			var options = [];
			var scenarios = [];

			fchmdb0001Factory.scenarioList(function(result){
                if (result && result[0]) {
					scenarios = result;
					//Carrego objeto no contexto do controller para não precisar ir no progress novamente.
					controller.scenarios = scenarios;

					
					for (var index = 0; index < scenarios.length; index++) {
						var option = {};

						option.label = scenarios[index]['cod-cenario'] + " - " + scenarios[index]['des-cenario'];
						option.value = scenarios[index]['cod-cenario'];

						options.push(option);
					}

					if ($stateParams.scenario != null && $stateParams.scenario != "") {
						controller.selectedScenario = $stateParams.scenario;
						controller.onChangeScenario();
						controller.selectedSimulation = $stateParams.simulation;
					}
                }
			});
			return options;
		}

		//retorna a lista de cenários no padrão de combo-box do THF
		controller.listSimulation = function() {
			setTimeout(function() {
				if (controller.selectedScenario != null){
					for (var index = 0; index < controller.scenarios.length; index++) {

						if (controller.scenarios[index]['cod-cenario'] == controller.selectedScenario){

							var objSim = controller.scenarios[index]['tt-lista-simulacao'];

							controller.listComboSimulation = [];
							for (var index2 = 0; index2 < objSim.length; index2++) {

								if (controller.selectedSimulation == ''){
									controller.selectedSimulation = objSim[index2]['idi-simulacao'];
								}

								var optSimulation = {};
								optSimulation.label = objSim[index2]['idi-simulacao'];
								optSimulation.value = objSim[index2]['idi-simulacao'];

								controller.listComboSimulation.push(optSimulation);
							}
						};
					};
					if ($stateParams.simulation != null && $stateParams.scenario != ""){
						controller.selectedSimulation = parseInt($stateParams.simulation);
					}
				}
			},0);
		}

		controller.onChangeScenario = function() {
			//limpa itens que estão em tela
			controller.items 				= [];
			controller.hasMore 				= false;
			controller.multiEstab 			= false;
			controller.userScenario 		= "";
			controller.dateScenario 		= "";
			controller.stageScenario		= "";

			controller.listComboSimulation = [];
			controller.selectedSimulation = '';

			controller.listSimulation();
			controller.loadItemsFilter(false);
		}

		controller.onChangeSimulation = function() {
			//limpa itens que estão em tela
			controller.items 				= [];
			controller.hasMore 				= false;
			controller.multiEstab 			= false;
			controller.userScenario 		= "";
			controller.dateScenario 		= "";
			controller.stageScenario		= "";

			controller.loadItemsFilter(false);
		}		

		controller.loadItemsFilter = function(started) {
			setTimeout(function() {
				var lastItem 	= ""
					referStart 	= ""
					num_simulac = 1;

				//Limpa a lista de itens
				if (started == false) {
					controller.items = [];
				}

				controller.hasMore = false;

				 //Chama o progress apenas quando o cenário é diferente de null (Caso do limpar o combo-box)
				if (controller.selectedScenario !== null) {
					
					//Pego o item que será iniciado a busca e referência
					//caso o item seja o mesmo considera a referência na fachada
					if (started && controller.items && controller.items[0]){
						lastItem = controller.items[controller.items.length - 1]['it-codigo'];
						referStart = controller.items[controller.items.length - 1]['cod-refer'];
					}

					//Foi mantido essa regra pois pode acontecer de não retornar informação 
					//na próxima requisição. Ex.: se o cálculo for reiniciado na etapa de planejamento, que não persiste dados
					for (var index = 0; index < controller.scenarios.length; index++) {
						if (controller.scenarios[index]['cod-cenario'] == controller.selectedScenario){
							for (var index2 = 0; index2 < controller.scenarios[index]['tt-lista-simulacao'].length; index2++){
								if (controller.scenarios[index]['tt-lista-simulacao'][index2]['idi-simulacao'] == controller.selectedSimulation){
									controller.multiEstab 		= controller.scenarios[index]['log-multi-estab'];
									controller.userScenario 	= controller.scenarios[index]['tt-lista-simulacao'][index2]['user-calculo'];
									controller.dateScenario 	= controller.scenarios[index]['tt-lista-simulacao'][index2]['dtm-exec-calc'];
									controller.stageScenario	= controller.scenarios[index]['tt-lista-simulacao'][index2]['desc-idi-fase-calc'];
									num_simulac = controller.selectedSimulation;
								}
							}
						}
					}

					if (!controller.quickSearchTextItems)
						controller.quickSearchTextItems = "";

					var parameters = controller.preLoader();

					/* Informações que são carregadas em branco na preLoader */
					parameters.start = lastItem;
					parameters.referStart = referStart;
					parameters.idi_simulacao = num_simulac;

					//Busca os itens do cenário selecionado
					fchmdb0001Factory.calculatedItemsList(parameters, function(result){

						if(result && result['tt-lista-cenario']) {
							var scenarios = result['tt-lista-cenario'];

							if (scenarios[0]['cod-cenario'] == controller.selectedScenario){
								controller.multiEstab 		= scenarios[0]['log-multi-estab'];
								controller.userScenario 	= scenarios[0]['user-calculo'];
								controller.dateScenario 	= scenarios[0]['dtm-exec-calc'];
								controller.stageScenario	= scenarios[0]['desc-idi-fase-calc'];
							}
						}

						if (result && result['DSestoq'] && result['DSestoq']['tt-lista-item']) {
							for (var index = 0; index < result['DSestoq']['tt-lista-item'].length; index++) {
								controller.items.push(result['DSestoq']['tt-lista-item'][index]);
							}
							controller.hasMore = result.hasMore;
						} else {
							controller.items = [];
						}
					});
				}
			},0);

		}

		controller.openItemDetail = function (item) {		

            var path = "dts/mdb/itemcalculationstatement/detail/" +
			    encodeURIComponent(controller.selectedScenario) + "/" +
                controller.advancedSearch.logperda + "/" +
                encodeURIComponent(item['it-codigo']) + "/" +
		        encodeURIComponent(item['cod-refer']) + "/" +
				controller.selectedSimulation;				
            
                $location.path(path);
			
		}

 		controller.openAdvancedSearchItem = function () {
			var modalInstance = $modal.open({
				templateUrl: '/dts/mdb/html/itemcalculationstatement/itemcalculationstatement.search.html',
				controller: 'mdb.itemcalculationstatement.SearchCtrl as controller',
				size: 'lg',
				resolve: {
				  model: function () {
					// passa o objeto com os dados da pesquisa avançada para o modal
					return controller.advancedSearch;					
					
				  }
				}
			});
			
			// quando o usuario clicar em pesquisar:
			modalInstance.result.then(function (model) {			

                controller.advancedSearch = model;
				
				// cria os disclaimers
				controller.addDisclaimers();
				// e chama o busca dos dados
				controller.loadItemsFilter(false);
			});
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
							title: $rootScope.i18n('l-item', [], 'dts/mdb') + ': ' + (controller.advancedSearch[key].start || "") + ' ' +
									$rootScope.i18n('l-to', [], 'dts/mdb') + ' ' + (controller.advancedSearch[key].end || "")
						})						
					break;
					case 'refCodRange':
						if (controller.advancedSearch[key].start == "" && 
							controller.advancedSearch[key].end == "ZZZZZZZZ") continue;										
							controller.disclaimers.push({
							property: 'refCodRange',
							value: controller.advancedSearch[key],
							title: $rootScope.i18n('l-reference', [], 'dts/mdb') + ': ' + (controller.advancedSearch[key].start || "") + ' ' +
									$rootScope.i18n('l-to', [], 'dts/mdb') + ' ' + (controller.advancedSearch[key].end || "")
						})						
					break;
					case 'fmCodRange':
						if (controller.advancedSearch[key].start == "" && 
							controller.advancedSearch[key].end == "ZZZZZZZZ") continue;										
							controller.disclaimers.push({
							property: 'fmCodRange',
							value: controller.advancedSearch[key],
							title: $rootScope.i18n('l-family', [], 'dts/mdb') + ': ' + (controller.advancedSearch[key].start || "") + ' ' +
									$rootScope.i18n('l-to', [], 'dts/mdb') + ' ' + (controller.advancedSearch[key].end || "")
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
							title: $rootScope.i18n('l-stock-group', [], 'dts/mdb') + ': ' + (controller.advancedSearch[key].start || "") + ' ' +
									$rootScope.i18n('l-to', [], 'dts/mdb') + ' ' + (controller.advancedSearch[key].end || "")
						})						
					break;											
					case 'cdPlanejRange':
						if ((controller.advancedSearch[key].start == "") && 
							controller.advancedSearch[key].end == "ZZZZZZZZZZZZ") continue;										
							controller.disclaimers.push({
							property: 'cdPlanejRange',
							value: controller.advancedSearch[key],
							title: $rootScope.i18n('l-planner', [], 'dts/mdb') + ': ' + (controller.advancedSearch[key].start || "") + ' ' +
									$rootScope.i18n('l-to', [], 'dts/mdb') + ' ' + (controller.advancedSearch[key].end || "")
						})						
					break;	
					case 'codComprRange':
						if ((controller.advancedSearch[key].start == "") && 
							controller.advancedSearch[key].end == "ZZZZZZZZZZZZ") continue;	
							controller.disclaimers.push({
							property: 'codComprRange',
							value: controller.advancedSearch[key],
							title: $rootScope.i18n('l-buyer', [], 'dts/mdb') + ': ' + (controller.advancedSearch[key].start || "") + ' ' +
									$rootScope.i18n('l-to', [], 'dts/mdb') + ' ' + (controller.advancedSearch[key].end || "")
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
            if (disclaimer.property == 'refCodRange') {
            	controller.advancedSearch.refCodRange.start = '';
                controller.advancedSearch.refCodRange.end = 'ZZZZZZZZ';
			};
            if (disclaimer.property == 'fmCodRange') {
            	controller.advancedSearch.fmCodRange.start = '';
                controller.advancedSearch.fmCodRange.end = 'ZZZZZZZZ';
			};						
            if (disclaimer.property == 'geCodRange') {
            	controller.advancedSearch.geCodRange.start = '0';
                controller.advancedSearch.geCodRange.end = '99';
			};
			if (disclaimer.property == 'cdPlanejRange') {
            	controller.advancedSearch.cdPlanejRange.start = '';
                controller.advancedSearch.cdPlanejRange.end = 'ZZZZZZZZZZZZ';
			};
			if (disclaimer.property == 'codComprRange') {
            	controller.advancedSearch.codComprRange.start = '';
                controller.advancedSearch.codComprRange.end = 'ZZZZZZZZZZZZ';
			};

            // recarrega os dados quando remove um disclaimer			
			controller.loadItemsFilter(false);
		};

		controller.preLoader = function() {
			/* Função criada para carregar os parametros sem necessidade de repetir código. */
			var parameters = {cCodigoItem: controller.quickSearchTextItems,
				cCodigoCenario: controller.selectedScenario,
				dataType: "1",
				start: "",
				referStart: "",
				limit: 20,
				it_codigo_ini: controller.advancedSearch.itemCodRange.start || "",
				it_codigo_fim: controller.advancedSearch.itemCodRange.end || "",
				cod_ref_ini: controller.advancedSearch.refCodRange.start || "",
				cod_ref_fim: controller.advancedSearch.refCodRange.end || "",
				fm_codigo_ini: controller.advancedSearch.fmCodRange.start || "",
				fm_codigo_fim: controller.advancedSearch.fmCodRange.end || "",
				ge_codigo_ini: controller.advancedSearch.geCodRange.start,
				ge_codigo_fim: controller.advancedSearch.geCodRange.end,
				cd_planejad_ini: controller.advancedSearch.cdPlanejRange.start || "",
				cd_planejad_fim: controller.advancedSearch.cdPlanejRange.end || "",
				cod_comprado_ini: controller.advancedSearch.codComprRange.start || "",
				cod_comprado_fim: controller.advancedSearch.codComprRange.end || "",
				log_comprado: controller.advancedSearch.logcomprado,
				log_fabricado: controller.advancedSearch.logfabricado,
				log_per_fixo: controller.advancedSearch.perfixo,
				log_lote_economi: controller.advancedSearch.loteeconomi,
				log_ordem: controller.advancedSearch.ordem,
				log_niv_superior: controller.advancedSearch.nivelsuperior,
				log_configurado: controller.advancedSearch.configurado,
				log_real_consum: controller.advancedSearch.realconsumo,
				log_est_seg: controller.advancedSearch.logestseg,
				perc_est_seg: controller.advancedSearch.percestseg,
				log_perda: controller.advancedSearch.logperda,
				idi_simulacao: controller.selectedSimulation
			};

			return parameters;
		}

		controller.exportListCsv = function() {

			setTimeout(function() {
				var parameters = controller.preLoader();

				/* Passa o limite para 0, pois assim não utiliza limite por busca */
				parameters.limit = 0;

				//Busca os itens do cenário selecionado
				fchmdb0001Factory.calculatedItemsCsv(parameters, function(result){

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
						var fileName = $rootScope.i18n('l-item-calculation-statement', [], 'dts/mdb') + " - " + $rootScope.i18n('l-scenar', [], 'dts/mdb') + " - " + controller.selectedScenario + '.csv';
	
						if (ieVer>-1) {
							window.navigator.msSaveBlob(textFileAsBlob, fileName);
						} else {
							var a         = document.createElement('a');
							a.href        = 'data:attachment/csv,' +  encodeURIComponent(result.csv);
							a.target      = '_blank';
							a.download    = fileName;
	
							document.body.appendChild(a);
							a.click();
						}
					}
				});
			},0);
		}
		controller.init();
	}
	index.register.controller('mdb.itemcalculationstatement-list.controller', itemCalculationStatementCtrl);
});