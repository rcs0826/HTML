define(['index', '/dts/mpd/js/api/fchdis0055.js', '/dts/mpd/html/rulesoperations/rulesoperations-services.js', '/dts/dts-utils/js/lodash-angular.js'], function (index) {

	index.stateProvider

		.state('dts/mpd/rulesoperationhistory', {
			abstract: true,
			template: '<ui-view/>'
		})
		.state('dts/mpd/rulesoperationhistory.start', {
			url: '/dts/mpd/rulesoperationhistory/:rId',
			controller: 'salesorder.rulesOperationHistory.Controller',
			controllerAs: 'controller',
			templateUrl: '/dts/mpd/html/rulesoperationhistory/rulesoperationhistory.html'
		});

	rulesOperationHistoryCtrl.$inject = ['totvs.app-main-view.Service', '$q', '$filter', '$stateParams', 'mpd.rulesoperations.modal.note', 'mpd.fchdis0055.Factory', 'orderByFilter'];

	function rulesOperationHistoryCtrl(appViewService, $q, $filter, $stateParams, modalNote, fchdis0055, orderByFilter) {

		var vm = this;
		vm.optionView = true;
		vm.date = $filter('date');
		vm.i18n = $filter('i18n');		
		vm.rulehistoryfields= [];
		vm.ruleHistoryDataList = [];
		vm.ruleHistoryDataGrid = [];
		vm.helpControl = false;
		vm.help="Células preenchidas com 'Não considerado' indicam que o campo em questão não estava habilitado no momento da criação ou alteração da regra"

		vm.startDataView = function init() {			
			vm.ctrlRulesId = $stateParams.rId;
			vm.rulehistoryfields= [];
			vm.ruleHistoryDataList = [];
			vm.ruleHistoryDataGrid = [];
			vm.ruleHistoryGridOptions = vm.getGridOptions;			
		}

		// Definição da grade para histórico de regras da natureza de operações
		vm.getGridOptions = function () {
			vm.deferredGridRules = $q.defer();
			vm.prepareColumns();							
			return vm.deferredGridRules.promise;
		}

		// Prepara as colunas para o grid
		vm.prepareColumns = function () {
			fchdis0055.getHistorFieldSugestNat({}, function (result) {
				vm.columnsGridRules = [];
				
				/* Colunas fixas */
				
				var templateBtn = '<span><span #= (!data.hasOwnProperty("note") || data.note == "?") ? "disabled=disabled" : "ng-click=controller.openNoteWindown(dataItem)" # style="padding: 2px 6px; padding-top: 0px; padding-bottom: 0px;" class="btn btn-default"><span class="glyphicon glyphicon-edit"></span>';
				vm.columnsGridRules.push({ field: 'note', title: 'Observação de histórico da regra', width: 55, editable: false, template: templateBtn })

				vm.columnsGridRules.push({ field: "cdd-id-regra-histor", title: "ID Histórico", width: 50});
				vm.columnsGridRules.push({ field: "cdn-tip-ped", title: "Tipo Operação Venda", width: 100 });
				vm.columnsGridRules.push({ field: "nat-estadual", title: "Nat Operação Estadual", width: 100 });
				vm.columnsGridRules.push({ field: "nat-interestadual", title: "Nat Operação Interestadual", width: 100 });
				vm.columnsGridRules.push({ field: "nat_export", title: "Nat Operação Exportação", width: 100 });
				vm.columnsGridRules.push({ field: "dat-histor", title: "Data", width: 80 });
				vm.columnsGridRules.push({ field: "hra-histor", title: "Hora", width: 80 });
				vm.columnsGridRules.push({ field: "usuario", title: "Usuário", width: 120 });

				// Ordena as colunas conforme prioridade da tela Campos para Regra da Natureza de Operação
				angular.forEach(orderByFilter(result, 'prioridade', true), function (obj, key) {
					if (!vm.columnsGridRules.find(o => o.field === obj['nom-campo'])) {
						vm.columnsGridRules.push({ field: obj['nom-campo'], title: obj['des-label-campo'], width: 150 });
					}
				});			

				fchdis0055.getHistorSugestNat({ rulesId: vm.ctrlRulesId }, function (result) {
					vm.rulehistoryfields = result;					
		
					// Inclui a coluna para apresentação de valores de campos que foram eliminados da tela Campos para Regra da Natureza de Operação
					angular.forEach(orderByFilter(vm.rulehistoryfields, 'prioridade', true), function (historyIdObj, key) {
						if (!vm.columnsGridRules.find(o => o.field === historyIdObj['nom-campo']) &&
							historyIdObj['nom-campo'] != "note") {
							vm.columnsGridRules.push({ field: historyIdObj['nom-campo'], title: historyIdObj['des-label-campo'], width: 150 });
						}
					});			
		
					// Opções de definição do grid
					vm.optsGridRules = {
						reorderable: true,
						sortable: true,
						columns: angular.copy(vm.columnsGridRules)
					};		
					
					vm.setData();
	
					vm.deferredGridRules.resolve(vm.optsGridRules)
				});				
			});							
		}

		vm.setData = function () {
			var objectHistoryId = {
				'ruleid': '',
				'nat-estadual': '',
				'nat-interestadual': '',
				'nat-export': '',
				'cdn-tip-ped': '',
				'usuario': '',
				'dat-histor': '',
				'hra-histor': '',
				'cdd-id-regra-histor': '',
				'prioridade': ''
			};

			vm.columnsFields = [];
			vm.objctHistoryIds = [];

			// Colunas variáveis
			angular.forEach(orderByFilter(vm.rulehistoryfields, 'prioridade', true), function (historyIdObj, key) {
				if (!vm.columnsFields.find(o => o.field === historyIdObj['nom-campo'])) {
					vm.columnsFields.push({field: historyIdObj['nom-campo']});
				}
			});	

			// Recupera os ids dos históricos
			angular.forEach(vm.rulehistoryfields, function (historyfield, key) {
				var hasId = false;

				angular.forEach(vm.objctHistoryIds, function (historyId, key) {
					if (historyfield['cdd-id-regra-histor'] == historyId['ruleid']) {
						hasId = true;
					}
				});

				if (hasId == false) {
					objectHistoryId['ruleid'] = historyfield['cdd-id-regra-histor'];
					objectHistoryId['nat-estadual'] = historyfield['nat-estadual'];
					objectHistoryId['nat-interestadual'] = historyfield['nat-interestadual'];
					objectHistoryId['nat-export'] = historyfield['nat-export'];
					objectHistoryId['cdn-tip-ped'] = historyfield['cdn-tip-ped'];
					objectHistoryId['usuario'] = historyfield['usuario'];
					objectHistoryId['hra-histor'] = historyfield['hra-histor'];
					objectHistoryId['dat-histor'] = historyfield['dat-histor'];
					objectHistoryId['cdd-id-regra-histor'] = historyfield['cdd-id-regra-histor'];
					objectHistoryId['prioridade'] = historyfield['prioridade'];

					vm.objctHistoryIds.push(angular.copy(objectHistoryId));
				}
			});

			// Monta objeto de histórico
			angular.forEach(vm.objctHistoryIds, function (historyIdObj, key) {				
				// Trata o campo de data de alteração da regra
				historyIdObj['dat-histor'] = vm.date(historyIdObj['dat-histor'], 'shortDate');

				// Prepara os dados para a lista
				var strDataHistory = "";		

				strDataHistory = '{"cod-valor":"' + vm.getUrlEncode(historyIdObj['cdd-id-regra-histor']) + '","nom-campo":"cdd-id-regra-histor"' + ',"des-label-campo":"ID Histórico"}';
				strDataHistory = strDataHistory + ',{"cod-valor":"' + vm.getUrlEncode(historyIdObj['cdn-tip-ped']) + '","nom-campo":"cdn-tip-ped"' + ',"des-label-campo":"Tipo Operação Venda"}';
				strDataHistory = strDataHistory + ',{"cod-valor":"' + vm.getUrlEncode(historyIdObj['nat-estadual']) + '","nom-campo":"nat-estadual"' + ',"des-label-campo":"Nat Operação Estadual"}';
				strDataHistory = strDataHistory + ',{"cod-valor":"' + vm.getUrlEncode(historyIdObj['nat-interestadual']) + '","nom-campo":"nat-interestadual"' + ',"des-label-campo":"Nat Operação Interestadual"}';
				strDataHistory = strDataHistory + ',{"cod-valor":"' + vm.getUrlEncode(historyIdObj['nat-export']) + '","nom-campo":"nat-export"' + ',"des-label-campo":"Nat Operação Exportação"}';
				strDataHistory = strDataHistory + ',{"cod-valor":"' + historyIdObj['dat-histor'] + '","nom-campo":"dat-histor"' + ',"des-label-campo":"Data"}';
				strDataHistory = strDataHistory + ',{"cod-valor":"' + historyIdObj['hra-histor'] + '","nom-campo":"hra-histor"' + ',"des-label-campo":"Hora"}';
				strDataHistory = strDataHistory + ',{"cod-valor":"' + vm.getUrlEncode(historyIdObj['usuario']) + '","nom-campo":"usuario"' + ',"des-label-campo":"Usuário"}';

				angular.forEach(orderByFilter(vm.rulehistoryfields, 'prioridade', true), function (historyfield, key) {

					if (historyfield['cdd-id-regra-histor'] == historyIdObj['ruleid']) {
						if (historyfield['cod-tipo-format-campo'] != 'logical') {
							strDataHistory = strDataHistory + ',{"cod-valor":"' + vm.getUrlEncode(historyfield['cod-valor']) + '","nom-campo":"' + vm.getUrlEncode(historyfield['nom-campo']) + '","prioridade":"' + vm.getUrlEncode(historyfield['prioridade']) + '","cod-tipo-format-campo":"' + vm.getUrlEncode(historyfield['cod-tipo-format-campo']) + '","nom-tabela":"' + vm.getUrlEncode(historyfield['nom-tabela']) + '","des-label-campo":"' + vm.getUrlEncode(historyfield['des-label-campo']) + '"}';
						} else {
							strDataHistory = strDataHistory + ',{"cod-valor":"' + vm.getUrlEncode(historyfield['cod-valor']) + '","nom-campo":"' + vm.getUrlEncode(historyfield['nom-campo']) + '","prioridade":"' + vm.getUrlEncode(historyfield['prioridade']) + '","cod-tipo-format-campo":"' + vm.getUrlEncode(historyfield['cod-tipo-format-campo']) + '","nom-tabela":"' + vm.getUrlEncode(historyfield['nom-tabela']) + '","des-label-campo":"' + vm.getUrlEncode(historyfield['des-label-campo']) + '"}';
						}
					}
				});

				strDataHistory = '[' + strDataHistory + ']';

				var jsonAux = JSON.parse(strDataHistory);

				angular.forEach(jsonAux, function (field, key) {

					if (field['cod-valor'] != null && field['cod-valor'] != '' && field['cod-valor'] != 'null') {
						field['cod-valor'] = vm.getUrldecode(field['cod-valor']);
					} else {
						field['cod-valor'] = '?';
					}

					if (field['prioridade'] > 0) {
						field['des-label-campo'] = vm.getUrldecode(field['des-label-campo'] + ' (' + field['prioridade'] + ')');
					} else {
						field['des-label-campo'] = vm.getUrldecode(field['des-label-campo']);
					}

				});

				vm.ruleHistoryDataList.push(jsonAux);

				// Prepara os dados para o grid
				strDataHistory = "";
				strDataHistory = '{"cdd-id-regra-histor":"' + historyIdObj['cdd-id-regra-histor'] + '"';
				strDataHistory = strDataHistory + ',"cdn-tip-ped":"' + historyIdObj['cdn-tip-ped'] + '"';
				strDataHistory = strDataHistory + ',"nat-estadual":"' + historyIdObj['nat-estadual'] + '"';
				strDataHistory = strDataHistory + ',"nat-interestadual":"' + historyIdObj['nat-interestadual'] + '"';
				strDataHistory = strDataHistory + ',"nat_export":"' + historyIdObj['nat-export'] + '"';
				strDataHistory = strDataHistory + ',"dat-histor":"' + historyIdObj['dat-histor'] + '"';
				strDataHistory = strDataHistory + ',"hra-histor":"' + historyIdObj['hra-histor'] + '"';
				strDataHistory = strDataHistory + ',"usuario":"' + historyIdObj['usuario'] + '"';		

				angular.forEach(orderByFilter(vm.rulehistoryfields, 'prioridade', true), function (historyfield, key) {
					if (historyfield['cdd-id-regra-histor'] == historyIdObj['ruleid']) {
						strDataHistory = strDataHistory + ',"' + historyfield['nom-campo'] + '":"' + vm.getUrlEncode(historyfield['cod-valor']) + '"';
					}
				});

				for (var i = 0; i < vm.columnsFields.length; i++) {
					if (strDataHistory.indexOf(vm.columnsFields[i]['field']) == -1 && vm.columnsFields[i]['field'] != "note") {
						vm.helpControl = true; /* Habita o help em tela */
						strDataHistory = strDataHistory + ',"' + vm.columnsFields[i]['field'] + '":"Não considerado"';
					}
				}

				strDataHistory = strDataHistory + '}';

				jsonAux = JSON.parse(strDataHistory);

				angular.forEach(jsonAux, function (historyfield, key) {

					if (jsonAux[key] != null && jsonAux[key] != '' && jsonAux[key] != 'null') {
						jsonAux[key] = vm.getUrldecode(jsonAux[key]);
					} else {
						jsonAux[key] = '?';
					}		
					
					/* Altera de null para '' */
					if (historyfield === null || historyfield === 'null') {
						jsonAux[key] = "?";
					}

					if(jsonAux[key] === 'true')
						jsonAux[key] = vm.i18n('l-yes');
					
					if(jsonAux[key] === 'false')
						jsonAux[key] = vm.i18n('l-no');					

					if (key === "char-1,133,1") {
						switch (jsonAux[key]) {
							case "0":
								jsonAux[key] = vm.i18n('l-mercoria-revenda', [], 'dts/mpd/');
								break;
							case "1":
								jsonAux[key] = vm.i18n('l-materia-prima', [], 'dts/mpd/');
								break;
							case "2":
								jsonAux[key] = vm.i18n('l-embalagem', [], 'dts/mpd/');
								break;
							case "3":
								jsonAux[key] = vm.i18n('l-produto-processo', [], 'dts/mpd/');
								break;
							case "4":
								jsonAux[key] = vm.i18n('l-produto-acabado', [], 'dts/mpd/');
								break;
							case "5":
								jsonAux[key] = vm.i18n('l-subproduto', [], 'dts/mpd/');
								break;
							case "6":
								jsonAux[key] = vm.i18n('l-produto-intermediario', [], 'dts/mpd/');
								break;
							case "7":
								jsonAux[key] = vm.i18n('l-material-uso-consumo', [], 'dts/mpd/');
								break;
							case "8":
								jsonAux[key] = vm.i18n('l-ativo-imobilizado', [], 'dts/mpd/');
								break;
							case "9":
								jsonAux[key] = vm.i18n('l-servicos', [], 'dts/mpd/');
								break;
							case "10":
								jsonAux[key] = vm.i18n('l-outros-insumos', [], 'dts/mpd/');
								break;
							case "99":
								jsonAux[key] = vm.i18n('l-outras', [], 'dts/mpd/');
								break;
							default:
								break;
						}
					}

					if (key === "natureza") {
						switch (jsonAux[key]) {
							case "1":
								jsonAux[key] = vm.i18n('l-pessoa-fisica', [], 'dts/mpd/');
								break;
							case "2":
								jsonAux[key] = vm.i18n('l-pessoa-juridica', [], 'dts/mpd/');
								break;
							case "3":
								jsonAux[key] = vm.i18n('l-foreign', [], 'dts/mpd/');
								break;
							case "4":
								jsonAux[key] = vm.i18n('l-trading', [], 'dts/mpd/');
								break;
							default:
								break;
						}
					}

					if (key === "cod-des-merc") {
						switch (jsonAux[key]) {
							case "1":
								jsonAux[key] = vm.i18n('l-business-industry', [], 'dts/mpd/');
								break;
							case "2":
								jsonAux[key] = vm.i18n('l-own-propertie', [], 'dts/mpd/');
								break;
							default:							
								break;
						}
					}

					if(key === 'compr-fabric'){
						switch (jsonAux[key]) {
							case "1":
								jsonAux[key] = vm.i18n('l-comprado', [], 'dts/mpd/');
								break;
							case "2":
								jsonAux[key] = vm.i18n('l-fabricado', [], 'dts/mpd/');
								break;
							default:							
								break;
						}					
					}
		
					if(key === 'cd-trib-icm'){
						switch (jsonAux[key]) {
							case "1":
								jsonAux[key] = vm.i18n('l-tributado', [], 'dts/mpd/');
								break;
							case "2":
								jsonAux[key] = vm.i18n('l-isento', [], 'dts/mpd/');
								break;
							case "3":
								jsonAux[key] = vm.i18n('l-outros', [], 'dts/mpd/');
								break;
							case "4":
								jsonAux[key] = vm.i18n('l-reduzido', [], 'dts/mpd/');
								break;		
							default:							
								break;
						}						
					}
				});

				vm.ruleHistoryDataGrid.push(jsonAux);				
			});							
		}		
		
		vm.openNoteWindown = function (dataItem) {
			var instanceModalNote = modalNote.open({
				note: dataItem["note"]				
			});		
		}			

		vm.changeView = function (value) {
			vm.optionView = value;
		};

		vm.getUrlEncode = function (value) {
			if (value != true || value != false) {
				value = window.encodeURIComponent(value);
				value = vm.replaceAllString(value, '.', '%2E');
			}
			return value;
		};

		vm.getUrldecode = function (value) {
			if (value != true || value != false) {
				value = window.decodeURIComponent(value);
				value = vm.replaceAllString(value, '%2E', '.');
			}
			return value;
		};

		vm.replaceAllString = function (str, find, replace) {
			return str.replace(find, replace);
		}

		if (appViewService.startView($filter('i18n')('Histórico da Regra') + " " + vm.rulesId, 'salesorder.rulesOperationHistory.Controller', this)) {
			vm.startDataView();
		} else {
			vm.startDataView();
		}
	}

	index.register.controller('salesorder.rulesOperationHistory.Controller', rulesOperationHistoryCtrl);

});
