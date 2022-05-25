define([
	'index',
	// undercore para template
	'/dts/dts-utils/js/lodash-angular.js',
	// tecinca de resize de elemento de acordo com a tela
	'/dts/dts-utils/js/resizer.js',
	'/dts/dts-utils/js/msg-utils.js',
	//Preferências de usuário
	'/dts/mpd/js/userpreference.js',
	//Fachada para regras de natureza de operação
	'/dts/mpd/js/api/fchdis0054.js',
	'/dts/mpd/js/api/fchdis0055.js',
	'/dts/mpd/js/mpd-components/mpd-components.js',
	// modal para selecionar opcoes de configuracao da execucao em rpw
	//'/dts/crm/html/rpw-schedule/rpw-schedule-services.js'
], function(index) {
	'use strict';

	rulesoperationsListController.$inject = [
		'$http',
		'$scope',
		'$rootScope',
		'userPreference',
		'totvs.app-main-view.Service',
		'$state',
		'$stateParams',
		'$filter',
		'$timeout',
		'mpd.rulesoperations.modal.advanced.search',
		'mpd.rulesoperations.modal.add.edit',
		'mpd.rulesoperations.modal.copy',
		'mpd.rulesoperations.modal.note',
		'$totvsprofile',
		'$q',
		'$location',
		'$modal',
		'$window',
		'TOTVSEvent',
		'mpd.fchdis0055.Factory',
		'orderByFilter',
		'mpd.rulesoperationshelper.helper',
		   'mpd.rulesoperationtype.Factory',
		'dts-utils.message.Service',
		'ReportService'
		//'crm.rpw-schedule.modal.edit'
	];
	function rulesoperationsListController(
		$http,
		$scope,
		$rootScope,
		userPreference,
		appViewService,
		$state,
		$stateParams,
		$filter,
		$timeout,
		modalAdvancedSearch,
		modalAddEdit,
		modalCopy,
		modalNote,
		$totvsprofile,
		$q,
		$location,
		$modal,
		$window,
		TOTVSEvent,
		fchdis0055,
		orderByFilter,
		helper,
		rulesOperationTypeFactory,
		messageUtils,
		ReportService
		//modalScheduler
		) {
		/*jshint validthis: true*/
		var vm = this;

		vm.i18n = $filter('i18n');
		vm.disclaimers = [];
		vm.quickFilters = [];
		vm.listOfCustomFilters = [];
		vm.orderList = [];
		vm.orderItems = {};

		vm.rulesOperationsData = [];

		//TESTE REMOVER
		vm.rulesoperationslistCount = 0;
		vm.maxitemspage = 25;

		vm.ProgramName = undefined; //nome do programa, se necessario agenda recorrente deve ser informado

		vm.helprule = "<p style='padding-left: 5px'>" + $rootScope.i18n('l-rules-operations-msg-01', [], 'dts/mpd/')  +
			"</p></br><p>" + $rootScope.i18n('l-rules-operations-msg-02', [], 'dts/mpd/') + "</p>";

		vm.helpexportrules = "<p style='padding-left: 5px'>" +  $rootScope.i18n('l-help-export-rules-grid') + "</p>";

		//Substitui todas ocorrencias de um character em uma variavel string
		vm.replaceAll = function(str, find, replace) {
			return str.replace(new RegExp(vm.escapeRegExp(find), 'g'), replace);
		}

		//Verifica se string contém valor
		vm.containsString = function(str, value){
			var ret = str.indexOf(value);
			if(ret > 0){
				return true;
			}else{
				return false;
			}
		}

		//Filtro para função replaceAll
		vm.escapeRegExp = function(str) {
			return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		}


		vm.getUrlEncode = function(value) {
			if(value != true || value != false){
				value = window.encodeURIComponent(value);
				value = vm.replaceAllString(value, '.', '%2E');
			}
			return value;
		};

		vm.getUrldecode = function(value) {
			if(value != true || value != false){
				value = window.decodeURIComponent(value);
				value = vm.replaceAllString(value, '%2E', '.');
			}
			return value;
		};

		vm.replaceAllString = function(str, find, replace) {
			return str.replace(find, replace);
		}

		//Definição da grade dinamica para regras de natureza de operações
		vm.getGridOptions = function() {
			vm.deferredGridRules = $q.defer();
			vm.getRulesFields();

			return vm.deferredGridRules.promise;
		}

		/**
		 * Remove um filtro (disclaimer)
		 * @param  {Object} disclaimer Disclaimer que será removido
		 * @return {}
		 */
		vm.removeDisclaimer = function removeDisclaimer(disclaimer) {

			var index = vm.disclaimers.indexOf(disclaimer);
			if (index >= 0) {
				vm.disclaimers.splice(index, 1);
			}
			vm.getOperationsRulesData();
		};

		//Retorna a definição dos campos da grade dinamica para regras de natureza de operações
		vm.getRulesFields = function(){

			fchdis0055.getCampSugesNat({}, function(data) {
				vm.rulesFields = data;

				vm.columnsGridRules = [];

				var fieldFilter = null;
				
				var templateBtn = '<span><span style="padding: 2px 6px; padding-top: 0px; padding-bottom: 0px;" class="btn btn-default" ng-click="controller.openNoteWindown(dataItem)"><span class="glyphicon glyphicon-edit"></span>';
					vm.columnsGridRules.push({ locked: true, field: 'btn-note', title: 'Observação para histórico da regra', width: 55, editable: false, editor: vm.logicalDropDownEditor, template: templateBtn })
				
				//Adicionar a lista de campos em um objeto para definir as colunas do grid
				angular.forEach(orderByFilter(vm.rulesFields, 'prioridade', true), function(field, key) {

					var fieldTitle = field['des-label-campo'] + " (" + field['prioridade']  + ")";
					var fieldId    = field['nom-campo'];
					
					/**somente colocar o id nos campos customizáveis */
					if (field['cdd-id-campo'] > 0){
						fieldId = "id"+ String(field['cdd-id-campo']) + fieldId; 
					}
					
					//Campos que terão a definição diferenciada dos demais campos na grade
					if(vm.containsString(field['nom-campo'], '&val-sugest-nat&cdd-id-regra') ||
					   vm.containsString(field['nom-campo'], '&regra-sugest-nat&nat-estadual') ||
					   vm.containsString(field['nom-campo'], '&regra-sugest-nat&nat-interestadual') ||
					   vm.containsString(field['nom-campo'], '&regra-sugest-nat&nat-export') ||
					   vm.containsString(field['nom-campo'], '&tip-ped-cia&cdn-tip-ped') ||
					   vm.containsString(field['nom-campo'], '&tip-ped-cia&descricao') ||
					   vm.containsString(field['nom-campo'], '&tot-campo&tot-campo') ||
						vm.containsString(field['nom-campo'], '&tot-peso&tot-peso') ||
						vm.containsString(field['nom-campo'], '&note&note')) {

						//Campo não editavel com largura de 120 pixels
						if(vm.containsString(field['nom-campo'], '&tip-ped-cia&descricao')){
							vm.columnsGridRules.push({field: fieldId, title: field['des-label-campo'], width: 250, editable:false, filter: fieldFilter});
						}else{
							//Campos não editaveis com largura de 60 pixels
							if(vm.containsString(field['nom-campo'], '&val-sugest-nat&cdd-id-regra') ||
							   vm.containsString(field['nom-campo'], '&tot-campo&tot-campo') ||
							   vm.containsString(field['nom-campo'], '&tot-peso&tot-peso')){
								if(vm.containsString(field['nom-campo'], '&val-sugest-nat&cdd-id-regra') ||
								   vm.containsString(field['nom-campo'], '&tot-campo&tot-campo') ||
								   vm.containsString(field['nom-campo'], '&tot-peso&tot-peso')){
									vm.columnsGridRules.push({field: fieldId, title: field['des-label-campo'], width: 64, editable:false, filter: fieldFilter});
								}else{
									vm.columnsGridRules.push({field: fieldId, title: field['des-label-campo'], width: 60, editable:true, filter: fieldFilter});
								}
							} else {
								if(!vm.containsString(field['nom-campo'], '&note&note')) {
									//Campos editaveis com largura de 150 pixels
									vm.columnsGridRules.push({ field: fieldId, title: field['des-label-campo'], width: 150, editable: true, filter: fieldFilter });
								}
							}
						}
					}else{
						//Definição padrão para os campos da grade de regras
						if(field['cod-tipo-format-campo'] === 'logical'){
								
							var templateField = '<span ng-bind=controller.logicalDropDownTemplate(dataItem,"' + vm.replaceAll(vm.replaceAll(fieldId, ",", "_________"), "-", "_")  + '")></span>';

							vm.columnsGridRules.push({field: fieldId, title: fieldTitle, width: 180, editable:true, editor: vm.logicalDropDownEditor, template: templateField});

						} else {

							if(vm.containsString(field['nom-campo'], '&emitente&natureza') ||
							   vm.containsString(field['nom-campo'], '&ped-venda&cod-des-merc') ||
							   vm.containsString(field['nom-campo'], '&item-uni-estab&char-1,133,1') ||
							   vm.containsString(field['nom-campo'], '&item&compr-fabric') ||
							   vm.containsString(field['nom-campo'], '&item&cd-trib-icm')) {

								 var templateSelectField = '<span ng-bind=controller.selectDropDownTemplate(dataItem,"' + fieldId + '")></span>';

								vm.columnsGridRules.push({ field: fieldId, title: fieldTitle, width: 190, editable: true, editor: vm.selectDropDownEditor, template: templateSelectField });
							} else {
								vm.columnsGridRules.push({ field: fieldId, title: fieldTitle, width: 190, editable: true, filter: fieldFilter });
							}
						}
					}
				});
				

				//Converte os caracteres "-" para "_" nas propriedades do objeto
				angular.forEach(vm.columnsGridRules, function(field, key) {
					field['field'] = vm.replaceAll(vm.replaceAll(field['field'], ",", "_________"), "-", "_");
				});
		

				//Opções de definição do grid
				vm.optsGridRules = {
					reorderable: true,
					sortable: true,
					columns: angular.copy(vm.columnsGridRules)
				};

				//Atualiza a definição das colunas do grid
				vm.deferredGridRules.resolve(vm.optsGridRules);
				
			});
		}

		vm.logicalDropDownEditor = function (container, options) {
			var fieldName = options.field;
			var opts = [{ name: "?", id: "?" },
						{ name: vm.i18n('l-yes'), id: "true" },
						{ name: vm.i18n('l-no'), id: "false" }];
			var input = angular.element('<input></input>');
				input.attr("data-bind", 'value:' + fieldName );

			input.appendTo(container);

			input.kendoDropDownList({
				dataValueField: "id",
				dataTextField: "name",
				dataSource: opts
			})
		}


		vm.logicalDropDownTemplate = function (dataItem, field) {
			var value;

			for(var key in dataItem) {
							
				if(key == field) {
					value = dataItem[key];
				}
			}				

			if (value == "true") {
				return vm.i18n("l-yes");
			} if (value == "false") {
				return vm.i18n("l-no");
			} else {
				return vm.i18n("?");
			}
		}



		vm.selectDropDownEditor = function (container, options) {
			var fieldName = options.field;

			if(vm.containsString(fieldName, 'mgcad&item_uni_estab&char_1_________133_________1')){
				var opts =    [{ name:  $rootScope.i18n("?", [], 'dts/mpd'), id: "?"},
							   { name:  $rootScope.i18n("l-mercoria-revenda", [], 'dts/mpd'), id: "0"},
							   { name:  $rootScope.i18n("l-materia-prima", [], 'dts/mpd'), id: "1"},
							   { name:  $rootScope.i18n("l-embalagem", [], 'dts/mpd'), id: "2"},
							   { name:  $rootScope.i18n("l-produto-processo", [], 'dts/mpd'), id: "3"},
							   { name:  $rootScope.i18n("l-produto-acabado", [], 'dts/mpd'), id: "4"},
							   { name:  $rootScope.i18n("l-subproduto", [], 'dts/mpd'), id: "5"},
							   { name:  $rootScope.i18n("l-produto-intermediario", [], 'dts/mpd'), id: "6"},
							   { name:  $rootScope.i18n("l-material-uso-consumo", [], 'dts/mpd'), id: "7"},
							   { name:  $rootScope.i18n("l-ativo-imobilizado", [], 'dts/mpd'), id: "8"},
							   { name:  $rootScope.i18n("l-servicos", [], 'dts/mpd'), id: "9"},
							   { name:  $rootScope.i18n("l-outros-insumos", [], 'dts/mpd'), id: "10"},
							   { name:  $rootScope.i18n("l-outras", [], 'dts/mpd'), id: "99"}]

			}


			if(vm.containsString(fieldName, '&emitente&natureza')){
				var opts = [{name: $rootScope.i18n("?", [], 'dts/mpd'), id: "?"},
							{name: $rootScope.i18n("l-pessoa-fisica", [], 'dts/mpd'), id: "1"},
							{name: $rootScope.i18n("l-pessoa-juridica", [], 'dts/mpd'), id: "2"},
							{name: $rootScope.i18n("l-foreign", [], 'dts/mpd'), id: "3"},
							{name: $rootScope.i18n("l-trading", [], 'dts/mpd'), id: "4"}]

			}


			if(vm.containsString(fieldName, '&ped_venda&cod_des_merc')){
				var opts = [{name: $rootScope.i18n("?", [], 'dts/mpd'), id: "?"},
							{name: $rootScope.i18n("l-business-industry", [], 'dts/mpd'), id: "1"},
							{name: $rootScope.i18n("l-own-propertie", [], 'dts/mpd'), id: "2"}]
			}

			if(vm.containsString(fieldName, '&item&compr_fabric')){
				var opts = [{name: $rootScope.i18n("?", [], 'dts/mpd'), id: "?"},
							{name: $rootScope.i18n("l-comprado", [], 'dts/mpd'), id: "1"},
							{name: $rootScope.i18n("l-fabricado", [], 'dts/mpd'), id: "2"}]
			}

			if(vm.containsString(fieldName, '&item&cd_trib_icm')){
				var opts = [{name: $rootScope.i18n("?", [], 'dts/mpd'), id: "?"},
							{name: $rootScope.i18n("l-tributado", [], 'dts/mpd'), id: "1"},
							{name: $rootScope.i18n("l-isento", [], 'dts/mpd'), id: "2"},
							{name: $rootScope.i18n("l-outros", [], 'dts/mpd'), id: "3"},
							{name: $rootScope.i18n("l-reduzido", [], 'dts/mpd'), id: "4"}]
			}

			var input = angular.element('<input></input>');
				input.attr("data-bind", 'value:' + fieldName );

			input.appendTo(container);

			input.kendoDropDownList({
				dataValueField: "id",
				dataTextField: "name",
				dataSource: opts
			})
		}


		vm.selectDropDownTemplate = function (dataItem, field) {
			var value;

			for(var key in dataItem) {
				if(vm.replaceAll(vm.replaceAll(key,"_________", ","), "_", "-") == field) {
					value = dataItem[key];
				}
			}

			if(vm.containsString(field, '&item-uni-estab&char-1,133,1')){
				switch(value){
					case '?' :
						return  $rootScope.i18n("?", [], 'dts/mpd');
					case '0' :
						return  $rootScope.i18n("l-mercoria-revenda", [], 'dts/mpd');
					case '1' :
						return  $rootScope.i18n("l-materia-prima", [], 'dts/mpd');
					case '2' :
						return  $rootScope.i18n("l-embalagem", [], 'dts/mpd');
					case '3' :
						return  $rootScope.i18n("l-produto-processo", [], 'dts/mpd');
					case '4' :
						return  $rootScope.i18n("l-produto-acabado", [], 'dts/mpd');
					case '5' :
						return  $rootScope.i18n("l-subproduto", [], 'dts/mpd');
					case '6' :
						return  $rootScope.i18n("l-produto-intermediario", [], 'dts/mpd');
					case '7' :
						return  $rootScope.i18n("l-material-uso-consumo", [], 'dts/mpd');
					case '8' :
						return  $rootScope.i18n("l-ativo-imobilizado", [], 'dts/mpd');
					case '9' :
						return  $rootScope.i18n("l-servicos", [], 'dts/mpd');
					case '10' :
						return  $rootScope.i18n("l-outros-insumos", [], 'dts/mpd');
					case '99' :
						return  $rootScope.i18n("l-outras", [], 'dts/mpd');
				}
			}

			if(vm.containsString(field, '&emitente&natureza')){
				switch(value){
					case '?' :
						return  $rootScope.i18n("?", [], 'dts/mpd');
					case '1' :
						return  $rootScope.i18n("l-pessoa-fisica", [], 'dts/mpd');
					case '2' :
						return  $rootScope.i18n("l-pessoa-juridica", [], 'dts/mpd');
					case '3' :
						return  $rootScope.i18n("l-foreign", [], 'dts/mpd');
					case '4' :
						return  $rootScope.i18n("l-trading", [], 'dts/mpd');
				}
			}

			if(vm.containsString(field, '&ped-venda&cod-des-merc')){
				switch(value){
					case '?' :
						return  $rootScope.i18n("?", [], 'dts/mpd');
					case '1' :
						return  $rootScope.i18n("l-business-industry", [], 'dts/mpd');
					case '2' :
						return  $rootScope.i18n("l-own-propertie", [], 'dts/mpd');
				}
			}

			if(vm.containsString(field, '&item&compr-fabric')){
				switch(value){
					case '?' :
						return  $rootScope.i18n("?", [], 'dts/mpd');
					case '1' :
						return  $rootScope.i18n("l-comprado", [], 'dts/mpd');
					case '2' :
						return  $rootScope.i18n("l-fabricado", [], 'dts/mpd');
				}
			}

			if(vm.containsString(field, '&item&cd-trib-icm')){
				switch(value){
					case '?' :
						return  $rootScope.i18n("?", [], 'dts/mpd');
					case '1' :
						return  $rootScope.i18n("l-tributado", [], 'dts/mpd');
					case '2' :
						return  $rootScope.i18n("l-isento", [], 'dts/mpd');
					case '3' :
						return  $rootScope.i18n("l-outros", [], 'dts/mpd');
					case '4' :
						return  $rootScope.i18n("l-reduzido", [], 'dts/mpd');
				}
			}
		}


		vm.itemsGridEdit = function(event, column) {

			$timeout(function () {
				var inputs = $(event.container).find("input:focus:text");
				if (inputs.length > 0) inputs[0].setSelectionRange(0,999);
			},50);

		}

		vm.openNoteWindown = function (dataItem) {
			var instanceModalNote = modalNote.open({
				note: dataItem["note&note&note"],
				edit: true
			});

			onCloseModalNote(instanceModalNote);
		}

		/**
		 * Função executada ao fechar a modal de inclusão e edição
		 * @param  {Promise}  instance      Instância da modal
		 * @param  {Boolean} isQuickFilter Identifica se é um filtro customizado
		 * @param  {Boolean} isFilterEdit  Identifica se é edição de um filtro customizado
		 * @param  {Object}  customFilter  Se for uma edição de filtro a função recebe o filtro que está sendo editado
		 * @return {}
		 */
		function onCloseModalNote(instance, isQuickFilter, isFilterEdit, customFilter) {
			instance.then(function (parameters) {
				vm.singleRulesOperationsSelected["note&note&note"] = parameters.note;
			});
		}

		//Retorna dados para listagem de regras na interface
		vm.getOperationsRulesData = function(isMore){

			var options, filters = [];

			vm.rulesoperationslistCount = 0;
			if (!isMore) {
				vm.list = [];
			}

			//Configurações de registros por página (botão carregar mais)
			options = {
				start: vm.list.length,
				max: vm.maxitemspage
			};

			// Parâmetros de pesquisa e paginção para a API
			angular.extend(options, helper.parseDisclaimersToParameters(vm.disclaimers));

			//Serviço que retorna os dados para interface (fch/fchdis/fchdis0055.p)
			fchdis0055.getRegraSugesNat(options, function(result) {

				//Total de registros de regras cadastrados
				if (result && result[0] && result[0].hasOwnProperty('$length')) {
					vm.rulesoperationslistCount = result[0].$length;
				}

				vm.list = vm.list.concat(result);

				vm.operationsRulesDataToGrid = [];
				
				//Processamento de dados das regras para exibição no componten de grade do THF
				angular.forEach(vm.list, function(operationRuleData, key) {
					var strfieldRuleData = "";
					
					angular.forEach(operationRuleData['ttValSugestNat'], function(fieldRuleData, key2) {
						var fieldId = fieldRuleData['nom-campo'];
						//campos de temp-tables com o characterer "-" (traço) serão alterado para "_" (underline) para permitir a leitura do objeto no grid do THF
						if (fieldRuleData['cdd-id-campo'] > 0){
							fieldId = "id"+ String(fieldRuleData['cdd-id-campo']) + fieldId;
						}

						if(strfieldRuleData != ""){
							strfieldRuleData = strfieldRuleData + ',"' + vm.replaceAll(vm.replaceAll(fieldId, ",", "_________"), "-", "_") + '":"' + vm.getUrlEncode(fieldRuleData['cod-valor']) + '"';
						}else{
							strfieldRuleData = '"' + vm.replaceAll(vm.replaceAll(fieldId, ",", "_________"), "-", "_") + '":"' + vm.getUrlEncode(fieldRuleData['cod-valor']) + '"';
						}
						
					});
	

					//Adiciona nome processado para o campo id da regra no objeto que será exibido na grade
					strfieldRuleData = '{"movdis&val_sugest_nat&cdd_id_regra":"' + operationRuleData['cdd-id-regra'] + '",'  + strfieldRuleData + '}';
					
					

					var jsonAux = JSON.parse(strfieldRuleData);
					
					
					angular.forEach(operationRuleData['ttValSugestNat'], function(fieldRuleData, key2) {
						var fieldId = fieldRuleData['nom-campo'];
						//campos de temp-tables com o characterer "-" (traço) serão alterado para "_" (underline) para permitir a leitura do objeto no grid do THF
						if (fieldRuleData['cdd-id-campo'] > 0){
							fieldId = "id"+ String(fieldRuleData['cdd-id-campo']) + fieldId;
						}
						jsonAux[vm.replaceAll(vm.replaceAll(fieldId, ",", "_________"), "-", "_")]  = vm.getUrldecode(jsonAux[vm.replaceAll(vm.replaceAll(fieldId, ",", "_________"), "-", "_")]);
					});
				
				
					vm.operationsRulesDataToGrid.push(jsonAux);
				});

				//Atualiza dados na grade
				vm.rulesOperationsData = vm.operationsRulesDataToGrid;

				//Copia objeto para validar se foi alterado na edição
				vm.rulesOperationsDataCopy = angular.copy(vm.rulesOperationsData);
			});

		}

		//Evento para recarregar os dados da grade de regras
		$rootScope.$on('mpd.rulesoperations.reloadlist', function(event) {
			vm.getOperationsRulesData();
		});


		//Processa os registros de regras selecionados na grade para serem gravados no banco de dados
		vm.copyOperationsRules = function(){

			//Validaçao para o usuário selecionar ao menos um registro na grade para cópia
			if(vm.multiRulesOperationsSelected.length < 1){
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
				   title: $rootScope.i18n('l-warning'),
				   detail: $rootScope.i18n('l-rules-operations-msg-03', [], 'dts/mpd/')
			   });
			}else{

				if(vm.multiRulesOperationsSelected.length > 25){
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
					   title: $rootScope.i18n('l-warning'),
					   detail: $rootScope.i18n('l-rules-operations-msg-04', [], 'dts/mpd/')
				   });
				}else{

					if (vm.multiRulesOperationsSelected.length >= 1) {
						vm.openModalCopy();
					} else {
						//Separa o registro de regra da grade em registros de campos, conforme esperado como parâmetro pelo serviço (gravação do registro no banco de dados separado por campo)
						vm.ruleToCopy = vm.processDataToServer(vm.multiRulesOperationsSelected, 'copy');

						//Remove os campos id da regra e destrição do tipo de operação de vendas (informações não utilizadas para cópia  - id da regra esta em todos os campo)
						angular.forEach(vm.ruleToCopy, function (field, key) {
							if ((field['nom-campo'] === "cdd-id-regra") && (field['nom-tabela'] === "val-sugest-nat")) {
								vm.ruleToCopy.splice(key, 1);
							}

							if ((field['nom-campo'] === "descricao") && (field['nom-tabela'] === "tip-ped-cia")) {
								vm.ruleToCopy.splice(key, 1);
							}
						});

						//Chamada de serviço para efetivar a cópia das regras no banco de dados
						fchdis0055.putRegraSugesNatCopy({}, vm.ruleToCopy, function (result) {
							if (!result.$hasError) {
								vm.getOperationsRulesData();
							}
						});
					}
				}
			}
		};

		//Processa os registros de regras selecionados na grade para serem excluídos no banco de dados
		vm.deleteOperationsRules = function(){

			//Validação para informar ao usuário a necessidade de seleção de registros na grade para exclusão
			if(vm.multiRulesOperationsSelected.length < 1){
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
				   title: $rootScope.i18n('l-warning'),
				   detail: $rootScope.i18n('l-rules-operations-msg-06', [], 'dts/mpd/')
			   });
			}else{

				messageUtils.question({
					title: 'Exclusão de Regras',
					text: $rootScope.i18n('Confirma?'),
					cancelLabel: 'Não',
					confirmLabel: 'Sim',
					defaultCancel: true,
					callback: function(isPositiveResult) {
						if (isPositiveResult) {

							//Separa o registro de regra da grade em registros de campos, conforme esperado como parâmetro pelo serviço (exclusão do registro no banco de dados separado por campo)
							vm.ruleToDelete = vm.processDataToServer(vm.multiRulesOperationsSelected, 'delete');

							//Remove os campos id da regra e destrição do tipo de operação de vendas (informações não utilizadas para exclusão - id da regra esta em todos os campo)
							angular.forEach(vm.ruleToDelete, function(field, key) {
								 if((field['nom-campo'] === "cdd-id-regra") && (field['nom-tabela'] === "val-sugest-nat")){
								   vm.ruleToDelete.splice(key, 1);
								 }

								if((field['nom-campo'] === "descricao") && (field['nom-tabela'] ==="tip-ped-cia")){
								   vm.ruleToDelete.splice(key, 1);
								 }
							});

							//Chamada de serviço para efetivar a exclusão das regras no banco de dados
							fchdis0055.deleteRegraSugesNat({}, vm.ruleToDelete, function(result) {
								if (!result.$hasError){
									vm.getOperationsRulesData();
								}
							});
						}
					}
				});
			}
		}

		vm.exportData = function(modeFull,callback){

			var i = 0,
			    regra = {},
			    model,
				ttRegras = [],
				ttValSugestNat = [];

			// Parâmetros de pesquisa e paginção para a API
			//angular.extend(options, helper.parseDisclaimersToParameters(vm.disclaimers));			

			if (modeFull == true) { //gerar planilha csv em rpw e enviar a central de documentos
				
				/* manter bkp se necessario mudar para rpw
				return vm.getSchedule(function(schedule) {
					if (schedule && schedule.RPWServer) {
						parameters = {
							properties: [],
							values: []
						}

						model = {
							rpwServer: schedule.RPWServer,
							executeDate: schedule.executeDate,
							initialHour: schedule.initialHour,
							isAutomaticCalendar: schedule.isAutomaticCalendar,
							programa: vm.programName
						};
					}
					return fchdis0055.postExportSugestNat(parameters, model, function(result) {
						console.warn('result', result);
						if (result && result.isOk == true) {
							//TODO: MSG PEDIDO DE EXECUCAO RPW SALVO COM SUCESSO
						}
					});
				});
				*/
				/* utilizar online ate q performance n seja mais satisfatoria */
				return fchdis0055.exportSugestNatOnline({}, {}, function(result) {
					if (result && result.cFileName) {
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							title: $rootScope.i18n('l-success'),
							detail: $rootScope.i18n('l-success-export', [result.cFileName], 'dts/mpd/')
						});
					}
				});				

			} else { //gerar a partir da grid
				for (i=0; i < vm.list.length; i++) {
					regra = vm.list[i];
					ttRegras.push({'cdd-id': regra['cdd-id'], 'cdd-id-regra': regra['cdd-id-regra']});
					ttValSugestNat = ttValSugestNat.concat(regra.ttValSugestNat);
				}

				model = {
					ttValSugestNat: ttValSugestNat,
					ttRegras: ttRegras
				}
		
				return fchdis0055.exportGrid({}, model, function(result) {
					if (result && result.cFileName) {
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							title: $rootScope.i18n('l-success'),
							detail: $rootScope.i18n('l-success-export', [result.cFileName], 'dts/mpd/')
						});
					}
				});	
			}

		}

		//Funcção para gerar planilha csv com execução em rpw
		/* foi declinado da opcao em rpw, caso haja necessidade voltar a avaliar, caso volte deve ser testado tbm no IE
		vm.getSchedule = function(callback) {
			vm.openModalScheduler(false, vm.ProgramName, function(schedule){
				if (schedule) {
					if (callback) { callback(schedule); }
				} else {
					if (callback) { callback(); }
				}				
			});
		}

		// abre a modal para selecionar configuracao rpw
		vm.openModalScheduler = function (isVisibleSchedule, programName, callback) {

			modalScheduler.open({
				programName: programName,
				isVisibleSchedule: isVisibleSchedule || false
			}).then(function (result) {
				if (callback) { callback(result); }
			});

		}	
		*/	

		//Função para abrir interface de histórico da regra
		vm.openHistory = function(){

			var hasWarning = false;

			if(vm.multiRulesOperationsSelected.length < 1){

				hasWarning = true;

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					title: $rootScope.i18n('l-warning'),
					detail: $rootScope.i18n('l-rules-operations-msg-07', [], 'dts/mpd/')
				});
			}

			if(vm.multiRulesOperationsSelected.length > 1){

				hasWarning = true;

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					title: $rootScope.i18n('l-warning'),
					detail: $rootScope.i18n('l-rules-operations-msg-08', [], 'dts/mpd/')
				});
			}

			if(!hasWarning){
				$location.url('/dts/mpd/rulesoperationhistory/' + vm.multiRulesOperationsSelected[0]['movdis&val_sugest_nat&cdd_id_regra']);
			}

		}

		//Descarta edições na grade de regras
		vm.discardEditedRulesOnGrid = function(){
			vm.rulesOperationsDataEdited = null;
			vm.getOperationsRulesData();
		}


		//Gravar edições na grade de regras
		vm.saveEditedRulesOnGrid = function(){

			var message = "";

			//Verifica se existe edição de regras na grade
			if (vm.rulesOperationsDataEdited != null && vm.rulesOperationsDataEdited.length > 0) {

				if(angular.equals(vm.rulesOperationsDataCopy, vm.rulesOperationsData)){
					//Informa ao usuário que os dados não foram alterados
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						title: $rootScope.i18n('l-warning'),
						detail: $rootScope.i18n('l-rules-operations-msg-09', [], 'dts/mpd/')
					});
				}else{

					angular.forEach(vm.rulesOperationsDataEdited, function (localDataRow, key) {

						if(!localDataRow.hasOwnProperty("note&note&note") ||
						localDataRow["note&note&note"] == undefined ||
						localDataRow["note&note&note"] == "")  {
							if(message == "") {
								message = message + ' ID: ' + localDataRow['movdis&val_sugest_nat&cdd_id_regra'];
							} else {
								message = message + ' e ' + localDataRow['movdis&val_sugest_nat&cdd_id_regra'];
							}
						}
					});

					if (message != "") {
						messageUtils.question({
							title: 'Observação não informada',
							text: 'As seguintes regras não possuem uma observação para histórico da regra: ' + message,
							cancelLabel: 'Cancelar',
							confirmLabel: 'Salvar sem informar',
							defaultConfirm: true,
							callback: function (isPositiveResult) {
								if (isPositiveResult) {

									//Separa o registro de regra da grade em registros de campos, conforme esperado como parâmetro pelo serviço (atualização do registro no banco de dados separado por campo)
									vm.ruleToSaveEditedOnGrid = vm.processDataToServer(vm.rulesOperationsDataEdited, 'edit');

									//Chamada de serviço para efetivar a atualização das regras no banco de dados
									fchdis0055.postRegraSugesNat({}, vm.ruleToSaveEditedOnGrid, function (result) {
										if (!result.$hasError) {
											vm.getOperationsRulesData();
										}
									});
								}
							}
						})
					} else {
						//Separa o registro de regra da grade em registros de campos, conforme esperado como parâmetro pelo serviço (atualização do registro no banco de dados separado por campo)
						vm.ruleToSaveEditedOnGrid = vm.processDataToServer(vm.rulesOperationsDataEdited, 'edit');

						//Chamada de serviço para efetivar a atualização das regras no banco de dados
						fchdis0055.postRegraSugesNat({}, vm.ruleToSaveEditedOnGrid, function (result) {
							if (!result.$hasError) {
								vm.getOperationsRulesData();
							}
						});
					}
				}
			} else {

				//Foi informado uma observação para regra
				if(vm.singleRulesOperationsSelected["note&note&note"] != undefined){

					var objWithNoteinRule = [];

					objWithNoteinRule.push(vm.singleRulesOperationsSelected);

					//Separa o registro de regra da grade em registros de campos, conforme esperado como parâmetro pelo serviço (atualização do registro no banco de dados separado por campo)
					vm.ruleToSaveEditedOnGrid = vm.processDataToServer(objWithNoteinRule, 'edit');

					//Chamada de serviço para efetivar a atualização das regras no banco de dados
					fchdis0055.postRegraSugesNat({}, vm.ruleToSaveEditedOnGrid, function (result) {
						if (!result.$hasError) {
							vm.getOperationsRulesData();
						}
					});

				}else{
					//Informa ao usuário que não há dados editados na interface para serem gravados
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						title: $rootScope.i18n('l-warning'),
						detail: $rootScope.i18n('l-rules-operations-msg-09', [], 'dts/mpd/')
					});
				}
			}
		}

		//Função para processar os dados da interface, e converter os registros das regras de natureza para formato gravado no banco de dados (registros separados por campos)
		vm.processDataToServer = function(dataToProcess, processType){

			var localDataToProcess = angular.copy(dataToProcess);

			var fieldRulesDataToCopy = {
										"cdd-id-val":"0",
										"cdd-id-regra":"0",
										"cdd-id-campo":"0",
										"nom-banco":"",
										"nom-tabela":"",
										"nom-campo":"",
										"nom-bco-corresp":"",
										"nom-tab-corresp":"",
										"nom-campo-corresp":"",
										"form-campo":"",
										"cod-tipo-format-campo":"",
										"cod-valor":"",
										"nom-campo-descr":"",
										"log-livre-1": false
									   };

			var dataProcessed = [];

			var autoIdRegra = 0;
			var idRule      = 0;

			vm.refreshFieldsRule = angular.copy(vm.rulesFields);

			angular.forEach(localDataToProcess, function(localDataRow, key){
				autoIdRegra = autoIdRegra + 1;
				idRule = localDataRow['movdis&val_sugest_nat&cdd_id_regra'];

				angular.forEach(vm.refreshFieldsRule, function(ruleField, key){
					
					var fieldId = ruleField['nom-campo'];
					//campos de temp-tables com o characterer "-" (traço) serão alterado para "_" (underline) para permitir a leitura do objeto no grid do THF
					if (ruleField['cdd-id-campo'] > 0){
						fieldId = "id"+ String(ruleField['cdd-id-campo']) + fieldId;
					}

					if (localDataRow.hasOwnProperty(vm.replaceAll(vm.replaceAll(fieldId, ",", "_________"), "-", "_"))) {

						var valueDataField = localDataRow[vm.replaceAll(vm.replaceAll(fieldId, ",", "_________"), "-", "_")];

						//Conforme o tipo do processamento é mantido ou criado novos ID de regras
						switch (processType){
							case 'add': //Quando adicionado apenas uma regra por vez, o id da regra é definido para 0 em todos os campos
								fieldRulesDataToCopy['cdd-id-regra'] = 0;
								break;
							case 'edit': //Edição de registro de regra, mantem o id original da regra para encontrar os campos para atualização do banco de dados
								fieldRulesDataToCopy['cdd-id-regra'] = idRule;
								break;
							case 'delete': //Exclusão de registro de regra, mantem o id original para encontras os campos para exclusão no banco de dados
								fieldRulesDataToCopy['cdd-id-regra'] = idRule;
								break;
							case 'copy': //Cópia, gera novos id de regra  de forma sequencial, para permitir a leitura dos campos das regras na api.
								fieldRulesDataToCopy['cdd-id-regra'] = autoIdRegra;
								break;
						}

						//remove o nome do banco e da tabela separados por & no nome do campo
						var strRuleFieldName = ruleField['nom-campo'];
						strRuleFieldName = strRuleFieldName.split('&');
						strRuleFieldName = strRuleFieldName[2];

						fieldRulesDataToCopy['cdd-id-campo']          = ruleField['cdd-id-campo'];
						fieldRulesDataToCopy['nom-banco']             = ruleField['nom-banco'];
						fieldRulesDataToCopy['nom-tabela']            = ruleField['nom-tabela'];
						fieldRulesDataToCopy['nom-bco-corresp']       = ruleField['nom-bco-corresp'];
						fieldRulesDataToCopy['nom-tab-corresp']       = ruleField['nom-tab-corresp'];
						fieldRulesDataToCopy['nom-campo-corresp']     = ruleField['nom-campo-corresp'];
						fieldRulesDataToCopy['cod-valor']             = ruleField['cod-valor'];
						fieldRulesDataToCopy['form-campo'] 			  = ruleField['form-campo'];
						fieldRulesDataToCopy['cod-tipo-format-campo'] = ruleField['cod-tipo-format-campo'];
						fieldRulesDataToCopy['nom-campo-descr']       = ruleField['nom-campo-descr'];
						fieldRulesDataToCopy['log-livre-1']           = ruleField['log-livre-1'];

						fieldRulesDataToCopy['nom-campo'] = strRuleFieldName;
						fieldRulesDataToCopy['cod-valor'] = valueDataField;
					
						dataProcessed.push(angular.copy(fieldRulesDataToCopy));

					}
				});

			});

			return dataProcessed;
		}

		//Realiza pesquisa simples por tipo de operação de vendas e natureza de operação
		vm.applySimpleFilter = function(){
			if(vm.quickSearch && vm.quickSearch.trim().length > 0){

				vm.disclaimers.forEach(function(tag) {
					var index = tag.property.indexOf('simpleFilterRO');
					if (index >= 0) {
						vm.disclaimers.splice(vm.disclaimers.indexOf(tag), 1);
					}
				});

				vm.disclaimers.push(helper.addFilter("simpleFilterRO", vm.quickSearch , $rootScope.i18n('l-simple-filter', [], 'dts/mpd/')));
			}else{
				vm.disclaimers.forEach(function(tag) {
					var index = tag.property.indexOf('simpleFilterRO');
					if (index >= 0) {
						vm.disclaimers.splice(vm.disclaimers.indexOf(tag), 1);
					}
				});
			}

			vm.getOperationsRulesData();
		}


		/**
		 * Abre a modal de pesquisa avançada
		 * @return {}
		 */
		vm.openAdvancedSearch = function openAdvancedSearch() {

			vm.refreshFieldsToAdvancedSearch = [];

			angular.forEach(orderByFilter(vm.rulesFields, 'prioridade', true), function (field, key) {
				if (field["nom-tabela"] != "tot-peso" &&
					field["nom-tabela"] != "tot-campo" &&
					field["nom-tabela"] != "note") {
					vm.refreshFieldsToAdvancedSearch.push(field);
				}
			});

			var instanceModalSearch = modalAdvancedSearch.open({
				'filters': vm.disclaimers,
				'isQuickFilter': false,
				'dataRuleFields': vm.refreshFieldsToAdvancedSearch
			});

			onCloseAdvancedSearch(instanceModalSearch);
		};

		/**
		 * Função executada ao fechar a modal de pesquisa avançada
		 * @param  {Promise}  instance      Instância da modal
		 * @param  {Boolean} isQuickFilter Identifica se é um filtro customizado
		 * @param  {Boolean} isFilterEdit  Identifica se é edição de um filtro customizado
		 * @param  {Object}  customFilter  Se for uma edição de filtro a função recebe o filtro que está sendo editado
		 * @return {}
		 */
		function onCloseAdvancedSearch(instance, isQuickFilter, isFilterEdit, customFilter) {

			instance.then(function(parameters) {

				if(parameters.dataAdvancedFilterRules){

					vm.disclaimers = [];

					if(vm.quickSearch && vm.quickSearch.trim().length > 0){
						vm.disclaimers.push(helper.addFilter("simpleFilterRO", vm.quickSearch , $rootScope.i18n('l-simple-filter', [], 'dts/mpd/')));
					}

					angular.forEach(parameters.dataAdvancedFilterRules, function(dataFilter, key){
						vm.disclaimers.push(helper.addFilter(dataFilter['filter'], dataFilter['value'], dataFilter['label']));
					});

					vm.getOperationsRulesData();

				}

			});
		}

		/**
		 * Abre a modal de inclusão e edição de regra
		 * @param {String} operation Definr operação de inclusão (add) ou edição (edit)
		 * @return {}
		 */
		vm.openModalAddEdit = function openModalAddEdit(operationAddEdit) {

			vm.refreshFieldsToAddEdit = [];
			var hasWarning = false;

			angular.forEach(orderByFilter(vm.rulesFields, 'prioridade', true), function(field, key) {
				vm.refreshFieldsToAddEdit.push(field);
			});


			if(vm.multiRulesOperationsSelected.length > 1 && (operationAddEdit === 'edit')){

				hasWarning = true;

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					title: $rootScope.i18n('l-warning'),
					detail: $rootScope.i18n('l-rules-operations-msg-08', [], 'dts/mpd/')
				});
			}


			if(vm.multiRulesOperationsSelected.length < 1 && operationAddEdit === 'simulator'){
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					title: $rootScope.i18n('l-warning'),
					detail: $rootScope.i18n('l-rules-operations-msg-10', [], 'dts/mpd/')
				});
			}


			if(vm.multiRulesOperationsSelected.length < 1 && (operationAddEdit === 'edit')){

				hasWarning = true;

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					title: $rootScope.i18n('l-warning'),
					detail: $rootScope.i18n('l-rules-operations-msg-07', [], 'dts/mpd/')
				});
			}


			if(!hasWarning){
				if(operationAddEdit === 'edit' || operationAddEdit === 'simulator'){
					vm.dataRuleToAddEdit = vm.processDataToServer(vm.multiRulesOperationsSelected, 'edit');
				}else{
					if(operationAddEdit === 'singlecopy'){
						vm.dataRuleToAddEdit = vm.processDataToServer(vm.multiRulesOperationsSelected, 'copy');
					}else{
						vm.dataRuleToAddEdit = [];
					}
				}

				var instanceModalAddEdit = modalAddEdit.open({
						'operation': operationAddEdit,
						'dataRule': vm.dataRuleToAddEdit,
						'dataRuleFields': vm.refreshFieldsToAddEdit,
						'columnsGridRulesSimulate': vm.columnsGridRules
					});

				onCloseModalAddEdit(instanceModalAddEdit);

			}
		};


		/**
		 * Função executada ao fechar a modal de inclusão e edição
		 * @param  {Promise}  instance      Instância da modal
		 * @param  {Boolean} isQuickFilter Identifica se é um filtro customizado
		 * @param  {Boolean} isFilterEdit  Identifica se é edição de um filtro customizado
		 * @param  {Object}  customFilter  Se for uma edição de filtro a função recebe o filtro que está sendo editado
		 * @return {}
		 */
		function onCloseModalAddEdit(instance, isQuickFilter, isFilterEdit, customFilter) {
			instance.then(function(parameters) {

				if(parameters.confirm){
					vm.getOperationsRulesData();
				}

			});
		}

		/**
		 * Abre a modal de cópia de regra
		 * @return {}
		 */
		vm.openModalCopy = function openModalCopy() {
			vm.columnsGridRulesCopy = [];

			var templateBtn = '<span><span style="padding: 2px 6px; padding-top: 0px; padding-bottom: 0px;" class="btn btn-default" ng-click="controller.duplicateRowToCopy(dataItem)"><span class="glyphicon glyphicon glyphicon-plus"></span></span><span style="padding: 2px 6px; padding-top: 0px; padding-bottom: 0px;" class="btn btn-default" ng-click="controller.removeRowToCopy(dataItem)"><span class="glyphicon glyphicon glyphicon-minus"></span></span></span';

			vm.columnsGridRulesCopy.push({ locked: true, field: 'btn-duplicate', title: 'Duplicar/Remover', width: 73, editable: false, editor: vm.logicalDropDownEditor, template: templateBtn })

			angular.forEach(vm.columnsGridRules, function (field, key) {
				if (field['field'] != "mgdis&tip_ped_cia&descricao" &&
					field['field'] != "tot_campo&tot_campo&tot_campo" &&
					field['field'] != "tot_peso&tot_peso&tot_peso" &&
					field['field'] != "note&note&note") {
					vm.columnsGridRulesCopy.push(field);
				}
			});

			var instanceModalCopy = modalCopy.open({
				'rulesFields': vm.rulesFields,
				'rulesOperationsDataCopy': vm.multiRulesOperationsSelected,
				'columnsGridRulesCopy': vm.columnsGridRulesCopy
			});

			onCloseModalCopy(instanceModalCopy);
		};

		/**
		 * Função executada ao fechar a modal de cópia
		 * @param  {Promise}  instance      Instância da modal
		 * @param  {Boolean} isQuickFilter Identifica se é um filtro customizado
		 * @param  {Boolean} isFilterEdit  Identifica se é edição de um filtro customizado
		 * @param  {Object}  customFilter  Se for uma edição de filtro a função recebe o filtro que está sendo editado
		 * @return {}
		 */
		function onCloseModalCopy(instance, isQuickFilter, isFilterEdit, customFilter) {
			instance.then(function (parameters) {

				if (parameters.confirm) {
					vm.getOperationsRulesData();
				}
			});
		}

		/**
		 * Inicialização do controller. Executa as lógicas iniciais necessárias.
		 * @return {}
		 */
		this.startDataView = function init() {
			var hasError = false;

			$timeout(function () {

				rulesOperationTypeFactory.getParameters(function (result) {
					angular.forEach(result, function (parameter, key) {
						if (parameter['cod-param'] == 'sugestao-natureza') {
							if (parameter['val-param'] == 'N') {
								$rootScope.$broadcast(TOTVSEvent.showNotification, {
									type: 'warning',
									title: $rootScope.i18n('l-warning'),
									detail: $rootScope.i18n('l-rules-operations-msg-12', [], 'dts/mpd/')
								});

								var pageActive = appViewService.getPageActive();
								appViewService.releaseConsume(pageActive);
								appViewService.removeView(pageActive);
								hasError = true;
						   }
						}
					});
				});
			}, 500);

			if(!hasError) {
				vm.gridRuplesOperactionsOptions = vm.getGridOptions;
				vm.getOperationsRulesData();
			}
		};

		$scope.$on('$destroy', function() {
			vm = undefined;
		});

		if (appViewService.startView(vm.i18n('l-rules-operations-title', [], 'dts/mpd/'), 'mpd.rulesoperations.list.control', this)) {
			vm.startDataView();
		} else {
			vm.startDataView();
		}

	}

	// *************************************************************************************
	// *** MODAL ADVANCED SEARCH
	// *************************************************************************************
	modalAdvancedSearch.$inject = ['$modal'];
	function modalAdvancedSearch($modal) {
		/* jshint validthis: true */

		/**
		 * Abre a modal de pesquisa avançada
		 * @param  {Object} params Parâmetros que deverão ser passados para o controller da modal
		 * @return {Promise}       Retorna a instância da modal
		 */
		this.open = function(params) {
			var instance = $modal.open({
				templateUrl: '/dts/mpd/html/rulesoperations/rulesoperations.advanced.search.html',
				controller: 'mpd.rulesoperations.advanced.search.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: {parameters: function() {
						return params;
					}}
			});

			return instance.result;
		};
	}

	// *************************************************************************************
	// *** CONTROLLER MODAL ADAVANCED SEARCH
	// *************************************************************************************
	rulesOperationsAdvancedSearchController.$inject = [
		'$modalInstance',
		'parameters',
		'$rootScope',
		'$totvsprofile',
		'TOTVSEvent'];
	function rulesOperationsAdvancedSearchController(
		$modalInstance,
		parameters,
		$rootScope,
		$totvsprofile,
		TOTVSEvent) {
		/* jshint validthis: true */

		var vm = this;
		vm.model = {};
		vm.filters        = parameters.filters;
		//vm.isQuickFilter  = parameters.isQuickFilter;
		vm.dataRuleFields = parameters.dataRuleFields;

		vm.dataToFilterRules = {};
		vm.objecDataToFilterRules = [];

		/**
		 * Limpa os campos da modal
		 * @return {}
		 */
		vm.clear = function clear() {
			vm.dataToFilterRules = {};
			vm.objecDataToFilterRules = [];
		};

		/**
		 * Fecha a modal
		 * @return {}
		 */
		vm.close = function close() {
			$modalInstance.dismiss('cancel');
		};

		/**
		 * Aplica a pesquisa
		 * @return {}
		 */
		vm.search = function search() {
			vm.processDataFilterRules();

			$modalInstance.close({
				confirmAdvancedFilter: true,
				dataAdvancedFilterRules: vm.objecDataToFilterRules
			});
		};

		//Processa os dados dos campos do filtro avançado para serem adicionados em objetos separados.
		vm.processDataFilterRules = function(){
			angular.forEach(vm.dataRuleFields, function(field, key) {

				var stringDataFilterStart = "";
				var stringDataFilterEnd = "";

				if(vm.dataToFilterRules[field['nom-campo'] + "&start&" + field['cod-tipo-format-campo']] != undefined){
					stringDataFilterStart = '{"filter":"' + field['nom-campo'] + '&start&' + field['cod-tipo-format-campo'] + '", "value":"' +  vm.dataToFilterRules[field['nom-campo'] + "&start&" + field['cod-tipo-format-campo']] + '", "label":"' +  field['des-label-campo'] + ' ' + $rootScope.i18n('l-started', [], 'dts/mpd/') + '"}';
					vm.objecDataToFilterRules.push(JSON.parse(stringDataFilterStart));
				}

				if(vm.dataToFilterRules[field['nom-campo'] + "&end&" + field['cod-tipo-format-campo']] != undefined){
					stringDataFilterEnd = '{"filter":"' + field['nom-campo'] + '&end&' + field['cod-tipo-format-campo'] + '", "value":"' +  vm.dataToFilterRules[field['nom-campo'] + "&end&" + field['cod-tipo-format-campo']] + '", "label":"' +  field['des-label-campo'] + ' ' + $rootScope.i18n('l-ended', [], 'dts/mpd/') + '"}';
					vm.objecDataToFilterRules.push(JSON.parse(stringDataFilterEnd));
				}

			});
		}


	}


	// *************************************************************************************
	// *** MODAL ADD EDIT
	// *************************************************************************************
	modalAddEdit.$inject = ['$modal'];
	function modalAddEdit($modal) {
		/* jshint validthis: true */

		/**
		 * Abre a modal de pesquisa avançada
		 * @param  {Object} params Parâmetros que deverão ser passados para o controller da modal
		 * @return {Promise}       Retorna a instância da modal
		 */
		this.open = function(params) {
			var instance = $modal.open({
				templateUrl: '/dts/mpd/html/rulesoperations/rulesoperations.add.edit.html',
				controller: 'mpd.rulesoperations.add.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: {parameters: function() {
						return params;
					}}
			});

			return instance.result;
		};
	}

	// *************************************************************************************
	// *** CONTROLLER MODAL ADD EDIT
	// *************************************************************************************
	rulesOperationsAddEditController.$inject = [
		'$modalInstance',
		'parameters',
		'$rootScope',
		'$totvsprofile',
		'TOTVSEvent',
		'orderByFilter',
		'mpd.fchdis0055.Factory',
		'mpd.rulesoperationshelper.helper',
		'dts-utils.message.Service',
		'$q',
		'$timeout'];
	function rulesOperationsAddEditController(
		$modalInstance,
		parameters,
		$rootScope,
		$totvsprofile,
		TOTVSEvent,
		orderByFilter,
		fchdis0055,
		helper,
		messageUtils,
		$q,
		$timeout) {
		/* jshint validthis: true */
		var vm = this;
		vm.model = {};
		vm.operation 	  = parameters.operation;
		vm.dataRule       = parameters.dataRule;
		vm.dataRuleCopy;
		vm.dataRuleFields = parameters.dataRuleFields;
		vm.rulesOperationsData = [];
		vm.dataRuleFieldsOrdered = [];
		vm.dataRuleOrdered = [];
		vm.list = [];

		//Verifica se string contém valor
		vm.containsString = function(str, value){
			var ret = str.indexOf(value);
			if(ret > 0){
				return true;
			}else{
				return false;
			}
		}

		var fieldRulesDataToAddEdit = {"cdd-id-val":"0",
									   "cdd-id-regra":"0",
									   "cdd-id-campo":"0",
									   "nom-banco":"",
									   "nom-tabela":"",
									   "nom-campo":"",
									   "nom-bco-corresp":"",
									   "nom-tab-corresp":"",
									   "nom-campo-corresp":"",
									   "form-campo":"",
									   "cod-tipo-format-campo":"",
									   "log-padrao":false,
									   "cod-valor":"?",
									   "nom-campo-descr":"",
									   "log-livre-1": false};

		//Processa os dados ao inicar a interface de inclusão e edição
		vm.startData = function(){


			angular.forEach(orderByFilter(vm.dataRuleFields, 'prioridade', true), function(field, key) {

				vm.dataRuleFieldsOrdered.push(field);

				//remove o nome do banco e da tabela separados por & no nome do campo
				var onlyFieldName = field['nom-campo'];
				onlyFieldName = onlyFieldName.split('&');
				onlyFieldName = onlyFieldName[2];

				if(vm.operation  == "add"){

					var dataRuleToAdd = angular.copy(fieldRulesDataToAddEdit);

					if (onlyFieldName == "cdn-tip-ped") dataRuleToAdd['cod-valor'] = "";
					if (onlyFieldName == "note") dataRuleToAdd['cod-valor'] = "";

					dataRuleToAdd['cdd-id-campo'] 		   = field['cdd-id-campo'];
					dataRuleToAdd['nom-banco']             = field['nom-banco'];
					dataRuleToAdd['nom-tabela']            = field['nom-tabela'];
					dataRuleToAdd['nom-campo']             = onlyFieldName;
					dataRuleToAdd['nom-bco-corresp']       = field['nom-bco-corresp'];
					dataRuleToAdd['nom-tab-corresp']       = field['nom-tab-corresp'];
					dataRuleToAdd['nom-campo-corresp']     = field['nom-campo-corresp'];
					dataRuleToAdd['form-campo'] 		   = field['form-campo'];
					dataRuleToAdd['cod-tipo-format-campo'] = field['cod-tipo-format-campo'];
					dataRuleToAdd['log-padrao']            = field['log-padrao'];
					dataRuleToAdd['nom-campo-descr']       = field['nom-campo-descr'];
					dataRuleToAdd['log-livre-1']           = field['log-livre-1'];

					vm.dataRuleOrdered.push(angular.copy(dataRuleToAdd));
				}

				if(vm.operation  == "edit" || vm.operation == "singlecopy"){

					var dataRuleToEdit = angular.copy(fieldRulesDataToAddEdit);
					if (onlyFieldName == "note") dataRuleToEdit['cod-valor'] = "";

					dataRuleToEdit['cdd-id-campo'] 		    = field['cdd-id-campo'];
					dataRuleToEdit['nom-banco']             = field['nom-banco'];
					dataRuleToEdit['nom-tabela']            = field['nom-tabela'];
					dataRuleToEdit['nom-campo']             = onlyFieldName;
					dataRuleToEdit['nom-bco-corresp']       = field['nom-bco-corresp'];
					dataRuleToEdit['nom-tab-corresp']       = field['nom-tab-corresp'];
					dataRuleToEdit['nom-campo-corresp']     = field['nom-campo-corresp'];
					dataRuleToEdit['form-campo'] 		    = field['form-campo'];
					dataRuleToEdit['cod-tipo-format-campo'] = field['cod-tipo-format-campo'];
					dataRuleToEdit['log-padrao']            = field['log-padrao'];
					dataRuleToEdit['nom-campo-descr']       = field['nom-campo-descr'];
					dataRuleToEdit['log-livre-1']           = field['log-livre-1'];

					angular.forEach(vm.dataRule, function(fieldData, key) {
						if((fieldData['nom-banco'] + "&" + fieldData['nom-tabela'] + "&" + fieldData['nom-campo']) ==  field['nom-campo']){
							dataRuleToEdit['cdd-id-regra'] = fieldData['cdd-id-regra'];

							if(fieldData['cod-tipo-format-campo'] == 'logical'){
								if(fieldData['cod-valor'] == 'true'){
									dataRuleToEdit['cod-valor'] = true;
								}else{
									if(fieldData['cod-valor'] != '?'){
										dataRuleToEdit['cod-valor'] = false;
									}
								}
							}else{
								dataRuleToEdit['cod-valor'] = fieldData['cod-valor'];
							}
						} else {
							if(field['nom-campo'] == 'note&note&note') {
								dataRuleToEdit['cdd-id-regra'] = fieldData['cdd-id-regra'];
							}
						}
					});

					vm.dataRuleOrdered.push(angular.copy(dataRuleToEdit));
				}

				if(vm.operation == "simulator") {
					var dataRuleToSimulate = angular.copy(fieldRulesDataToAddEdit);

					dataRuleToSimulate['cdd-id-campo'] 		    = field['cdd-id-campo'];
					dataRuleToSimulate['nom-banco']             = field['nom-banco'];
					dataRuleToSimulate['nom-tabela']            = field['nom-tabela'];
					dataRuleToSimulate['nom-campo']             = onlyFieldName;
					dataRuleToSimulate['nom-bco-corresp']       = field['nom-bco-corresp'];
					dataRuleToSimulate['nom-tab-corresp']       = field['nom-tab-corresp'];
					dataRuleToSimulate['nom-campo-corresp']     = field['nom-campo-corresp'];
					dataRuleToSimulate['form-campo'] 		    = field['form-campo'];
					dataRuleToSimulate['cod-tipo-format-campo'] = field['cod-tipo-format-campo'];
					dataRuleToSimulate['log-padrao']            = field['log-padrao'];
					dataRuleToSimulate['nom-campo-descr']       = field['nom-campo-descr'];
					dataRuleToSimulate['log-livre-1']           = field['log-livre-1'];

					angular.forEach(vm.dataRule, function(fieldData, key) {
						if((fieldData['nom-banco'] + "&" + fieldData['nom-tabela'] + "&" + fieldData['nom-campo']) ==  field['nom-campo']){

							if(fieldData['nom-campo'] == 'consum-final'||
							   fieldData['nom-campo'] == 'contrib-icms'){
								if(fieldData['cod-valor'] == 'true'){
									dataRuleToSimulate['cod-valor'] = true;
								}else{
									if(fieldData['cod-valor'] != '?'){
										dataRuleToSimulate['cod-valor'] = false;
									}
								}

							}else{
								dataRuleToSimulate['cod-valor'] = fieldData['cod-valor'];
							}
						}
					});

					// Limpa informações de campos que não devem fazer parte da query
					if (onlyFieldName == "note") dataRuleToSimulate['cod-valor'] = "";
					if (onlyFieldName == "cdd-id-regra") dataRuleToSimulate['cod-valor'] = "?";
					if (onlyFieldName == "tot-peso") dataRuleToSimulate['cod-valor'] = "?";
					if (onlyFieldName == "tot-campo") dataRuleToSimulate['cod-valor'] = "?";
					if (onlyFieldName == "descricao") dataRuleToSimulate['cod-valor'] = "?";
					if (onlyFieldName == "nat-estadual") dataRuleToSimulate['cod-valor'] = "?";
					if (onlyFieldName == "nat-interestadual") dataRuleToSimulate['cod-valor'] = "?";
					if (onlyFieldName == "nat-export") dataRuleToSimulate['cod-valor'] = "?";

					vm.dataRuleOrdered.push(angular.copy(dataRuleToSimulate));
				}

			});

			vm.dataRuleCopy = angular.copy(vm.dataRuleOrdered);
			vm.mainDataRules = {"dataRules": vm.dataRuleOrdered, "fields": vm.dataRuleFieldsOrdered, "cddidregradatabase":"movdis" , "checkContainsString": vm.containsString, "operation": vm.operation};
		}

		/**
		 * Efetua a busca pelos defaults conforme campo e valor
		 * @return {}
		 */

		vm.leaveField = function(fieldAndValue) {

			//Para não disparar leave no mesmo momento que limpar o campo pelo botão x
			$timeout(function () {
				if (fieldAndValue['nom-campo'] !== "" &&
					fieldAndValue['cod-valor'] !== "?") {

					var valueFieldAndValue = fieldAndValue['cod-valor'];

					if (valueFieldAndValue == "") valueFieldAndValue = " ";

					fchdis0055.leaveRegraSugesNat({leaveName: fieldAndValue['nom-campo'], fieldCode: valueFieldAndValue}, function(result) {
						if (!result.$hasError){
							angular.forEach(vm.dataRuleOrdered, function(fieldData, key1) {
								if (fieldData['log-padrao'] == true && (fieldData['cod-valor'] === "" || fieldData['cod-valor'] === "?")) {
									var resultado = $.grep(result, function(e){ return e['nom-campo'] == fieldData['nom-campo']; });

									if(resultado.length > 0) {
										fieldData['cod-valor'] = resultado[0]['cod-valor'];
									}
								}
							});
						};
					});
				}
			}, 500);
		};


		vm.changeField = function(fieldAndValue){
			if (fieldAndValue['log-padrao'] == true &&
				fieldAndValue['nom-tabela'] == "item" &&
				fieldAndValue['nom-campo'] == "it-codigo") {

				angular.forEach(vm.dataRuleOrdered, function(fieldData, key) {
					if(fieldData['nom-tabela'] == "ref-item" && fieldData['nom-campo'] == "cod-refer"){
						fieldData['cod-valor'] = "?";
					}
				});

			}

		}


		/**
		* Atualiza variavel com o código do item informado em tela para filtrar o zoom de referencia por item
		 * @return {}
		*/
		vm.filterToItemRef = function(fieldAndValue){
			vm.itemCodeToFilter = fieldAndValue['cod-valor'];
		}

		vm.beforeSave = function(saveAndNew) {

			var message = "";

			for (var index = 0; index < vm.dataRuleOrdered.length; index++) {
				var element = vm.dataRuleOrdered[index];

				if(element['nom-campo'] == "note" && element['cod-valor'] == "") {

					message = vm.operation.edit ? "alteração" : "criação";

					messageUtils.question({
						title: 'Observação não informada',
						text: 'Não foi informada uma observação para histórico da regra',
						cancelLabel: 'Cancelar',
						confirmLabel: 'Salvar sem informar',
						defaultConfirm: true,
						callback: function (isPositiveResult) {
							if (isPositiveResult) {
								if (saveAndNew) {
									vm.saveAndNew();
								} else {
									vm.save();
								}
							};
						}
					});

					break;
				}
			};

			if (message == "") {
				if (saveAndNew) {
					vm.saveAndNew();
				} else {
					vm.save();
				}
			}
		}

		/**
		 * Efetua gravação dos dados do formulário
		 * @return {}
		 */
		vm.save = function(){

			vm.dataRuleToSaveAddEdit = angular.copy(vm.dataRuleOrdered);

			angular.forEach(vm.dataRuleToSaveAddEdit, function(field, key) {

				 if((field['nom-campo'] === "cdd-id-regra") && (field['nom-tabela'] === "val-sugest-nat")){
				   vm.dataRuleToSaveAddEdit.splice(key, 1);
				 }

				if((field['nom-campo'] === "descricao") && (field['nom-tabela'] ==="tip-ped-cia")){
				   vm.dataRuleToSaveAddEdit.splice(key, 1);
				 }


				if(field['cod-tipo-format-campo'] == 'logical' && field['cod-valor'] == ""){
				   field['cod-valor'] = false;
				}
			});


			if(vm.operation == 'add' || vm.operation == 'singlecopy'){

				fchdis0055.putRegraSugesNat({}, vm.dataRuleToSaveAddEdit, function(result) {
					if (!result.$hasError){
						$modalInstance.close({
							confirm: true,
							operation: vm.operation,
							dataRuleToSave: vm.dataRuleToSaveAddEdit
						});
					}
				});
			}


			if(vm.operation == 'edit'){
				if(angular.equals(vm.dataRuleCopy, vm.dataRuleOrdered)){
					//Informa ao usuário que os dados não foram alterados
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						title: $rootScope.i18n('l-warning'),
						detail: $rootScope.i18n('l-rules-operations-msg-15', [], 'dts/mpd/')
					});
				}else{
					fchdis0055.postRegraSugesNat({}, vm.dataRuleToSaveAddEdit, function(result) {
						if (!result.$hasError){
							$modalInstance.close({
								confirm: true,
								operation: vm.operation,
								dataRuleToSave: vm.dataRuleToSaveAddEdit
							});
						}
					});
				}
			}

		}


		vm.saveAndNew = function(){
			vm.dataRuleToSaveAddEdit = angular.copy(vm.dataRuleOrdered);

			angular.forEach(vm.dataRuleToSaveAddEdit, function(field, key) {

				 if((field['nom-campo'] === "cdd-id-regra") && (field['nom-tabela'] === "val-sugest-nat")){
				   vm.dataRuleToSaveAddEdit.splice(key, 1);
				 }

				if((field['nom-campo'] === "descricao") && (field['nom-tabela'] ==="tip-ped-cia")){
				   vm.dataRuleToSaveAddEdit.splice(key, 1);
				 }


				if(field['cod-tipo-format-campo'] == 'logical' && field['cod-valor'] == ""){
				   field['cod-valor'] = false;
				}
			});


			if(vm.operation == 'add'){

				fchdis0055.putRegraSugesNat({}, vm.dataRuleToSaveAddEdit, function(result) {
					if (!result.$hasError){
						$rootScope.$broadcast('mpd.rulesoperations.reloadlist');

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							title: $rootScope.i18n('l-warning'),
							detail: $rootScope.i18n('l-rules-operations-msg-11', [], 'dts/mpd/')
						});
					}
				});
			}
		}


		/**
		 * Efetua simulação para sugestão de natureza de operação
		 * @return {}
		 */
		vm.simulate = function(isMore){

			var options = {},
				values = [],
				element;

			vm.rulesOperationslistCount = 0;
			vm.list = [];

			for (var index = 0; index < vm.dataRuleOrdered.length; index++) {

				element = vm.dataRuleOrdered[index];

				if (element["cod-valor"] && element["cod-valor"] != ""  && element["cod-valor"] != "?") {
					if (element["nom-campo"] == "cdn-tip-ped") {
						options.opetationType = parseInt(element["cod-valor"], 10);
					} else if (element["nom-campo"] != "tot-peso" && element["nom-campo"] != "tot-campo" && element["nom-campo"] != "note" && element["nom-campo"] != "cdd-id-regra" && element["nom-campo"] != "nat-estadual" && element["nom-campo"] != "nat-interestadual" && element["nom-campo"] != "nat-export") {
						values.push({
							"cdd-id-campo": element["cdd-id-campo"],
							"cod-valor": element["cod-valor"],
							"nom-campo": element["nom-campo"]
						})
					}
				}
			}

			if (!options.opetationType || options.opetationType < 1) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					title: $rootScope.i18n('l-warning'),
					detail: $rootScope.i18n('l-rules-operations-msg-14', [], 'dts/mpd/')
				});

				return;
			}

			if (!values || values.length < 1) {
				return;
			}

			fchdis0055.postSimulacaoRegraSugesNat(options, values, function(result) {

				if (!result.$hasError){

					//Total de registros de regras cadastrados
					if (result && result[0] && result[0].hasOwnProperty('$length')) {
						vm.rulesOperationslistCount = result[0].$length;
					}

					if(vm.rulesOperationslistCount == 0){
						 $rootScope.$broadcast(TOTVSEvent.showNotification, {
							   title: $rootScope.i18n('l-warning'),
							   detail: $rootScope.i18n('l-without-rule')
						   });
					}

					vm.list = vm.list.concat(result);
					vm.operationsRulesDataToGrid = [];

					//Processamento de dados das regras para exibição no componten de grade do THF
					angular.forEach(vm.list, function(operationRuleData, key) {
						var strfieldRuleData = "";

						angular.forEach(operationRuleData['ttValSugestNat'], function(fieldRuleData, key2) {
							var fieldId = fieldRuleData['nom-campo'];
							//colocar id da coluna nos campos customizaveis para evitar duplicidade com replace efetuado.
							if (fieldRuleData['cdd-id-campo'] > 0){
								fieldId = "id"+ String(fieldRuleData['cdd-id-campo']) + fieldId;
							}

							//campos de temp-tables com o characterer "-" (traço) serão alterado para "_" (underline) para permitir a leitura do objeto no grid do THF
							if(strfieldRuleData != ""){
								strfieldRuleData = strfieldRuleData + ',"' + vm.replaceAll(vm.replaceAll(fieldId, ",", "_________"), "-", "_") + '":"' + fieldRuleData['cod-valor'] + '"';
							}else{
								strfieldRuleData = '"'+ vm.replaceAll(vm.replaceAll(fieldId, ",", "_________"), "-", "_") + '":"' + fieldRuleData['cod-valor'] + '"';
							}
						});

						//Adiciona nome processado para o campo id da regra no objeto que será exibido na grade
						strfieldRuleData = '{"movdis&val_sugest_nat&cdd_id_regra":"' + operationRuleData['cdd-id-regra'] + '",'  + strfieldRuleData + '}';

						vm.operationsRulesDataToGrid.push(JSON.parse(strfieldRuleData));
					});

					//Atualiza dados na grade
					vm.rulesOperationsData = vm.operationsRulesDataToGrid;

				} // sem erro

			});
		}

		//Definição da grade dinamica para regras de natureza de operações
		vm.getGridOptionsSimulate = function() {
			vm.deferredGridRulesSimulate = $q.defer();

			vm.columnsGridRulesSimulate = angular.copy(parameters.columnsGridRulesSimulate);

			angular.forEach(vm.columnsGridRulesSimulate, function(field, key) {
				if(field["field"] == "btn_note") {
					vm.columnsGridRulesSimulate.splice(key, 1);
				}
			});

			vm.optsGridRulesSimulate = {
				reorderable: true,
				sortable: true,
				columns: angular.copy(vm.columnsGridRulesSimulate)
			};

			//Atualiza a definição das colunas do grid
			vm.deferredGridRulesSimulate.resolve(vm.optsGridRulesSimulate);
			
			return vm.deferredGridRulesSimulate.promise;
		}

		vm.logicalDropDownTemplate = function (dataItem, field) {
			var value;

			for (var key in dataItem) {
				if (vm.replaceAll(vm.replaceAll(key, "_________", ","), "_", "-") == field) {
					value = dataItem[key];
				}
			}

			if (value == "true") {
				return $rootScope.i18n("l-yes");
			}
			if (value == "false") {
				return $rootScope.i18n("l-no");
			} else {
				return $rootScope.i18n("?");
			}
		}

		vm.selectDropDownEditor = function (container, options) {
			var fieldName = options.field;

			if (vm.containsString(fieldName, 'mgcad&item_uni_estab&char_1_________133_________1')) {
				var opts = [{
						name: $rootScope.i18n("?", [], 'dts/mpd'),
						id: "?"
					},
					{
						name: $rootScope.i18n("l-mercoria-revenda", [], 'dts/mpd'),
						id: "0"
					},
					{
						name: $rootScope.i18n("l-materia-prima", [], 'dts/mpd'),
						id: "1"
					},
					{
						name: $rootScope.i18n("l-embalagem", [], 'dts/mpd'),
						id: "2"
					},
					{
						name: $rootScope.i18n("l-produto-processo", [], 'dts/mpd'),
						id: "3"
					},
					{
						name: $rootScope.i18n("l-produto-acabado", [], 'dts/mpd'),
						id: "4"
					},
					{
						name: $rootScope.i18n("l-subproduto", [], 'dts/mpd'),
						id: "5"
					},
					{
						name: $rootScope.i18n("l-produto-intermediario", [], 'dts/mpd'),
						id: "6"
					},
					{
						name: $rootScope.i18n("l-material-uso-consumo", [], 'dts/mpd'),
						id: "7"
					},
					{
						name: $rootScope.i18n("l-ativo-imobilizado", [], 'dts/mpd'),
						id: "8"
					},
					{
						name: $rootScope.i18n("l-servicos", [], 'dts/mpd'),
						id: "9"
					},
					{
						name: $rootScope.i18n("l-outros-insumos", [], 'dts/mpd'),
						id: "10"
					},
					{
						name: $rootScope.i18n("l-outras", [], 'dts/mpd'),
						id: "99"
					}]

			}

			if (vm.containsString(fieldName, '&emitente&natureza')) {
				var opts = [{
						name: $rootScope.i18n("?", [], 'dts/mpd'),
						id: "?"
					},
					{
						name: $rootScope.i18n("l-pessoa-fisica", [], 'dts/mpd'),
						id: "1"
					},
					{
						name: $rootScope.i18n("l-pessoa-juridica", [], 'dts/mpd'),
						id: "2"
					},
					{
						name: $rootScope.i18n("l-foreign", [], 'dts/mpd'),
						id: "3"
					},
					{
						name: $rootScope.i18n("l-trading", [], 'dts/mpd'),
						id: "4"
					}]

			}

			if (vm.containsString(fieldName, '&ped_venda&cod_des_merc')) {
				var opts = [{
						name: $rootScope.i18n("?", [], 'dts/mpd'),
						id: "?"
					},
					{
						name: $rootScope.i18n("l-business-industry", [], 'dts/mpd'),
						id: "1"
					},
					{
						name: $rootScope.i18n("l-own-propertie", [], 'dts/mpd'),
						id: "2"
					}]
			}

			if(vm.containsString(fieldName, '&item&compr_fabric')){
				var opts = [{name: $rootScope.i18n("?", [], 'dts/mpd'), id: "?"},
							{name: $rootScope.i18n("l-comprado", [], 'dts/mpd'), id: "1"},
							{name: $rootScope.i18n("l-fabricado", [], 'dts/mpd'), id: "2"}]
			}

			if(vm.containsString(fieldName, '&item&cd_trib_icm')){
				var opts = [{name: $rootScope.i18n("?", [], 'dts/mpd'), id: "?"},
							{name: $rootScope.i18n("l-tributado", [], 'dts/mpd'), id: "1"},
							{name: $rootScope.i18n("l-isento", [], 'dts/mpd'), id: "2"},
							{name: $rootScope.i18n("l-outros", [], 'dts/mpd'), id: "3"},
							{name: $rootScope.i18n("l-reduzido", [], 'dts/mpd'), id: "4"}]
			}

			var input = angular.element('<input></input>');
			input.attr("data-bind", 'value:' + fieldName);

			input.appendTo(container);

			input.kendoDropDownList({
				dataValueField: "id",
				dataTextField: "name",
				dataSource: opts
			})
		}

		vm.selectDropDownTemplate = function (dataItem, field) {
			var value;

			for (var key in dataItem) {
				if (vm.replaceAll(vm.replaceAll(key, "_________", ","), "_", "-") == field) {
					value = dataItem[key];
				}
			}

			if (vm.containsString(field, '&item-uni-estab&char-1,133,1')) {
				switch (value) {
					case '?':
						return $rootScope.i18n("?", [], 'dts/mpd');
					case '0':
						return $rootScope.i18n("l-mercoria-revenda", [], 'dts/mpd');
					case '1':
						return $rootScope.i18n("l-materia-prima", [], 'dts/mpd');
					case '2':
						return $rootScope.i18n("l-embalagem", [], 'dts/mpd');
					case '3':
						return $rootScope.i18n("l-produto-processo", [], 'dts/mpd');
					case '4':
						return $rootScope.i18n("l-produto-acabado", [], 'dts/mpd');
					case '5':
						return $rootScope.i18n("l-subproduto", [], 'dts/mpd');
					case '6':
						return $rootScope.i18n("l-produto-intermediario", [], 'dts/mpd');
					case '7':
						return $rootScope.i18n("l-material-uso-consumo", [], 'dts/mpd');
					case '8':
						return $rootScope.i18n("l-ativo-imobilizado", [], 'dts/mpd');
					case '9':
						return $rootScope.i18n("l-servicos", [], 'dts/mpd');
					case '10':
						return $rootScope.i18n("l-outros-insumos", [], 'dts/mpd');
					case '99':
						return $rootScope.i18n("l-outras", [], 'dts/mpd');
				}
			}

			if (vm.containsString(field, '&emitente&natureza')) {
				switch (value) {
					case '?':
						return $rootScope.i18n("?", [], 'dts/mpd');
					case '1':
						return $rootScope.i18n("l-pessoa-fisica", [], 'dts/mpd');
					case '2':
						return $rootScope.i18n("l-pessoa-juridica", [], 'dts/mpd');
					case '3':
						return $rootScope.i18n("l-foreign", [], 'dts/mpd');
					case '4':
						return $rootScope.i18n("l-trading", [], 'dts/mpd');
				}
			}

			if (vm.containsString(field, '&ped-venda&cod-des-merc')) {
				switch (value) {
					case '?':
						return $rootScope.i18n("?", [], 'dts/mpd');
					case '1':
						return $rootScope.i18n("l-business-industry", [], 'dts/mpd');
					case '2':
						return $rootScope.i18n("l-own-propertie", [], 'dts/mpd');
				}
			}

			if(vm.containsString(field, '&item&compr-fabric')){
				switch(value){
					case '?' :
						return  $rootScope.i18n("?", [], 'dts/mpd');
					case '1' :
						return  $rootScope.i18n("l-comprado", [], 'dts/mpd');
					case '2' :
						return  $rootScope.i18n("l-fabricado", [], 'dts/mpd');
				}
			}

			if(vm.containsString(field, '&item&cd-trib-icm')){
				switch(value){
					case '?' :
						return  $rootScope.i18n("?", [], 'dts/mpd');
					case '1' :
						return  $rootScope.i18n("l-tributado", [], 'dts/mpd');
					case '2' :
						return  $rootScope.i18n("l-isento", [], 'dts/mpd');
					case '3' :
						return  $rootScope.i18n("l-outros", [], 'dts/mpd');
					case '4' :
						return  $rootScope.i18n("l-reduzido", [], 'dts/mpd');
				}
			}
		}

		/**
		 * Limpa os campos da modal
		 * @return {}
		 */
		vm.clear = function clear() {
			angular.forEach(vm.dataRuleOrdered , function(field, key) {
				field['cod-valor'] = "";
			});
			vm.rulesOperationsData = [];
		};

		/**
		 * Fecha a modal
		 * @return {}
		 */
		vm.close = function close() {
			$modalInstance.dismiss('cancel');
		};
		//Substitui todas ocorrencias de um character em uma variavel string
		vm.replaceAll = function(str, find, replace) {
			return str.replace(new RegExp(vm.escapeRegExp(find), 'g'), replace);
		}

		//Filtro para função replaceAll
		vm.escapeRegExp = function(str) {
			return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		}

		vm.startData();

	}

	// *************************************************************************************
	// *** MODAL COPY
	// *************************************************************************************
	modalCopy.$inject = ['$modal'];

	function modalCopy($modal) {
		/* jshint validthis: true */

		/**
		 * Abre a modal de pesquisa avançada
		 * @param  {Object} params Parâmetros que deverão ser passados para o controller da modal
		 * @return {Promise}       Retorna a instância da modal
		 */
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/mpd/html/rulesoperations/rulesoperations.copy.html',
				controller: 'mpd.rulesoperations.copy.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: {
					parameters: function () {
						return params;
					}
				}
			});

			return instance.result;
		};
	}

	// *************************************************************************************
	// *** CONTROLLER MODAL COPY
	// *************************************************************************************
	rulesOperationsCopyController.$inject = [
		'$q',
		'$modalInstance',
		'$rootScope',
		'$filter',
		'$timeout',
		'parameters',
		'TOTVSEvent',
		'dts-utils.message.Service',
		'mpd.fchdis0055.Factory',
		'mpd.rulesoperations.modal.note'];

	function rulesOperationsCopyController(
		$q,
		$modalInstance,
		$rootScope,
		$filter,
		$timeout,
		parameters,
		TOTVSEvent,
		messageUtils,
		fchdis0055,
		modalNote) {
		/* jshint validthis: true */
		var vm = this;

		vm.i18n = $filter('i18n');
		vm.ruleToCopy = [];
		vm.deferredGridRulesCopy = [];
		vm.rulesOperationsDataCopy = angular.copy(parameters.rulesOperationsDataCopy);
		vm.rulesFields = angular.copy(parameters.rulesFields);

		vm.startData = function () {

		}

		vm.close = function close() {
			$modalInstance.dismiss('cancel');
		}

		vm.beforeCopy = function () {

			var message = "";

			$timeout(function () {
				if (vm.rulesOperationsDataEditedCopy.length == 0) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						title: $rootScope.i18n('l-warning'),
						detail: $rootScope.i18n('l-rules-operations-msg-13', [], 'dts/mpd/')
					});
				} else {
					if (vm.rulesOperationsDataCopy.length != vm.rulesOperationsDataEditedCopy.length) {
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							title: $rootScope.i18n('l-warning'),
							detail: $rootScope.i18n('Somente serão copiadas as regras que tiveram alguma alteração ', [], 'dts/mpd/')
						});
					}

					angular.forEach(vm.rulesOperationsDataEditedCopy, function (localDataRow, key) {

						if (!localDataRow.hasOwnProperty("note&note&note") ||
							localDataRow["note&note&note"] == undefined ||
							localDataRow["note&note&note"] == "") {
							message = "showMessage";
						}
					});

					if (message != "") {
						messageUtils.question({
							title: 'Observação não informada',
							text: 'Alguma regra selecionada para cópia não possui uma observação para histórico da regra',
							cancelLabel: 'Cancelar',
							confirmLabel: 'Salvar sem informar',
							defaultConfirm: true,
							callback: function (isPositiveResult) {
								if (isPositiveResult) {
									vm.copy();
								}
							}
						})
					}

					if (message == "") {
						vm.copy();
					}
				}
			}, 50);
		}

		vm.copy = function () {

			//Separa o registro de regra da grade em registros de campos, conforme esperado como parâmetro pelo serviço (gravação do registro no banco de dados separado por campo)
			vm.ruleToCopy = vm.processDataToServerCopy(vm.rulesOperationsDataEditedCopy, 'copy');

			//Remove os campos id da regra e destrição do tipo de operação de vendas (informações não utilizadas para cópia  - id da regra esta em todos os campo)
			angular.forEach(vm.ruleToCopy, function (field, key) {
				if ((field['nom-campo'] === "cdd-id-regra") && (field['nom-tabela'] === "val-sugest-nat")) {
					vm.ruleToCopy.splice(key, 1);
				}

				if ((field['nom-campo'] === "descricao") && (field['nom-tabela'] === "tip-ped-cia")) {
					vm.ruleToCopy.splice(key, 1);
				}
			});

			//Chamada de serviço para efetivar a cópia das regras no banco de dados
			fchdis0055.putRegraSugesNatCopy({}, vm.ruleToCopy, function (result) {
				if (!result.$hasError) {
					$modalInstance.close({
						confirm: true
					});
				}
			});
		}


		//Função para duplicar uma linha de cópia
		vm.duplicateRowToCopy = function(dataItem, $event){

			var dataToAdd = angular.copy(dataItem);

			var dateuid = new Date();
			var timeuid = dateuid.getTime();

			dataToAdd.uid = timeuid;

			vm.rulesOperationsDataCopy.push(dataToAdd);

			$(':focus').blur();
			//$(".k-grid-content").animate({ scrollTop: 99999}, 400);
		}

		//Função para remover uma linha de cópia
		vm.removeRowToCopy = function(dataItem, $event){
			angular.forEach(vm.rulesOperationsDataCopy, function (rulesOperationsRow, key) {
				if(rulesOperationsRow.uid == dataItem.uid){
					vm.rulesOperationsDataCopy.splice(key, 1);
				}
			});

			$(':focus').blur();
			//$(".k-grid-content").animate({ scrollTop: 99999}, 400);
		}

		vm.openNoteWindown = function (dataItem) {
			var instanceModalNote = modalNote.open({
				note: dataItem["note&note&note"],
				edit: true
			});

			onCloseModalNote(instanceModalNote);
		}

		/**
		 * Função executada ao fechar a modal de inclusão e edição
		 * @param  {Promise}  instance      Instância da modal
		 * @param  {Boolean} isQuickFilter Identifica se é um filtro customizado
		 * @param  {Boolean} isFilterEdit  Identifica se é edição de um filtro customizado
		 * @param  {Object}  customFilter  Se for uma edição de filtro a função recebe o filtro que está sendo editado
		 * @return {}
		 */
		function onCloseModalNote(instance, isQuickFilter, isFilterEdit, customFilter) {
			instance.then(function (parameters) {
				vm.singleRulesOperationsSelectedCopyGrid["note&note&note"] = parameters.note;
			});
		}

		//Função para processar os dados da interface, e converter os registros das regras de natureza para formato gravado no banco de dados (registros separados por campos)
		vm.processDataToServerCopy = function (dataToProcess, processType) {

			var localDataToProcess = angular.copy(dataToProcess);

			var fieldRulesDataToCopy = {
				"cdd-id-val": "0",
				"cdd-id-regra": "0",
				"cdd-id-campo": "0",
				"nom-banco": "",
				"nom-tabela": "",
				"nom-campo": "",
				"nom-bco-corresp": "",
				"nom-tab-corresp": "",
				"nom-campo-corresp": "",
				"form-campo": "",
				"cod-tipo-format-campo": "",
				"cod-valor": "",
				"nom-campo-descr": "",
				"log-livre-1": false
			};

			var dataProcessed = [];

			var autoIdRegra = 0;
			var idRule = 0;

			vm.refreshFieldsRule = angular.copy(vm.rulesFields);

			angular.forEach(localDataToProcess, function (localDataRow, key) {
				autoIdRegra = autoIdRegra + 1;
				idRule = localDataRow['movdis&val_sugest_nat&cdd_id_regra'];

				angular.forEach(vm.refreshFieldsRule, function (ruleField, key) {
					var fieldId = ruleField['nom-campo'];

					/**somente colocar o id nos campos customizáveis */
					if (ruleField['cdd-id-campo'] > 0){
						fieldId = "id"+ String(ruleField['cdd-id-campo']) + fieldId; 
					}

					if (localDataRow.hasOwnProperty(vm.replaceAll(vm.replaceAll(fieldId, ",", "_________"), "-", "_"))) {

						var valueDataField = localDataRow[vm.replaceAll(vm.replaceAll(fieldId, ",", "_________"), "-", "_")];

						//Conforme o tipo do processamento é mantido ou criado novos ID de regras
						switch (processType) {
							case 'add': //Quando adicionado apenas uma regra por vez, o id da regra é definido para 0 em todos os campos
								fieldRulesDataToCopy['cdd-id-regra'] = 0;
								break;
							case 'edit': //Edição de registro de regra, mantem o id original da regra para encontrar os campos para atualização do banco de dados
								fieldRulesDataToCopy['cdd-id-regra'] = idRule;
								break;
							case 'delete': //Exclusão de registro de regra, mantem o id original para encontras os campos para exclusão no banco de dados
								fieldRulesDataToCopy['cdd-id-regra'] = idRule;
								break;
							case 'copy': //Cópia, gera novos id de regra  de forma sequencial, para permitir a leitura dos campos das regras na api.
								fieldRulesDataToCopy['cdd-id-regra'] = autoIdRegra;
								break;
						}

						//remove o nome do banco e da tabela separados por & no nome do campo
						var strRuleFieldName = ruleField['nom-campo'];
						strRuleFieldName = strRuleFieldName.split('&');
						strRuleFieldName = strRuleFieldName[2];

						fieldRulesDataToCopy['cdd-id-campo'] = ruleField['cdd-id-campo'];
						fieldRulesDataToCopy['nom-banco'] = ruleField['nom-banco'];
						fieldRulesDataToCopy['nom-tabela'] = ruleField['nom-tabela'];
						fieldRulesDataToCopy['nom-bco-corresp'] = ruleField['nom-bco-corresp'];
						fieldRulesDataToCopy['nom-tab-corresp'] = ruleField['nom-tab-corresp'];
						fieldRulesDataToCopy['nom-campo-corresp'] = ruleField['nom-campo-corresp'];
						fieldRulesDataToCopy['cod-valor'] = ruleField['cod-valor'];
						fieldRulesDataToCopy['form-campo'] = ruleField['form-campo'];
						fieldRulesDataToCopy['cod-tipo-format-campo'] = ruleField['cod-tipo-format-campo'];
						fieldRulesDataToCopy['nom-campo-descr'] = ruleField['nom-campo-descr'];
						fieldRulesDataToCopy['log-livre-1'] = ruleField['log-livre-1'];

						fieldRulesDataToCopy['nom-campo'] = strRuleFieldName;
						fieldRulesDataToCopy['cod-valor'] = valueDataField;

						dataProcessed.push(angular.copy(fieldRulesDataToCopy));
					}
				});

			});

			return dataProcessed;
		}

		//Verifica se string contém valor
		vm.containsString = function (str, value) {
			var ret = str.indexOf(value);
			if (ret > 0) {
				return true;
			} else {
				return false;
			}
		}

		vm.replaceAll = function (str, find, replace) {
			return str.replace(new RegExp(vm.escapeRegExp(find), 'g'), replace);
		}

		vm.escapeRegExp = function (str) {
			return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		}

		vm.logicalDropDownEditor = function (container, options) {
			var fieldName = options.field;
			var opts = [{
					name: "?",
					id: "?"
				},
				{
					name: vm.i18n('l-yes'),
					id: "true"
				},
				{
					name: vm.i18n('l-no'),
					id: "false"
				}];
			var input = angular.element('<input></input>');
			input.attr("data-bind", 'value:' + fieldName);

			input.appendTo(container);

			input.kendoDropDownList({
				dataValueField: "id",
				dataTextField: "name",
				dataSource: opts
			})
		}

		vm.logicalDropDownTemplate = function (dataItem, field) {
			var value;

			for (var key in dataItem) {
				if (vm.replaceAll(vm.replaceAll(key, "_________", ","), "_", "-") == field) {
					value = dataItem[key];
				}
			}

			if (value == "true") {
				return vm.i18n("l-yes");
			}
			if (value == "false") {
				return vm.i18n("l-no");
			} else {
				return vm.i18n("?");
			}
		}

		vm.selectDropDownEditor = function (container, options) {
			var fieldName = options.field;

			if (vm.containsString(fieldName, 'mgcad&item_uni_estab&char_1_________133_________1')) {
				var opts = [{
						name: $rootScope.i18n("?", [], 'dts/mpd'),
						id: "?"
					},
					{
						name: $rootScope.i18n("l-mercoria-revenda", [], 'dts/mpd'),
						id: "0"
					},
					{
						name: $rootScope.i18n("l-materia-prima", [], 'dts/mpd'),
						id: "1"
					},
					{
						name: $rootScope.i18n("l-embalagem", [], 'dts/mpd'),
						id: "2"
					},
					{
						name: $rootScope.i18n("l-produto-processo", [], 'dts/mpd'),
						id: "3"
					},
					{
						name: $rootScope.i18n("l-produto-acabado", [], 'dts/mpd'),
						id: "4"
					},
					{
						name: $rootScope.i18n("l-subproduto", [], 'dts/mpd'),
						id: "5"
					},
					{
						name: $rootScope.i18n("l-produto-intermediario", [], 'dts/mpd'),
						id: "6"
					},
					{
						name: $rootScope.i18n("l-material-uso-consumo", [], 'dts/mpd'),
						id: "7"
					},
					{
						name: $rootScope.i18n("l-ativo-imobilizado", [], 'dts/mpd'),
						id: "8"
					},
					{
						name: $rootScope.i18n("l-servicos", [], 'dts/mpd'),
						id: "9"
					},
					{
						name: $rootScope.i18n("l-outros-insumos", [], 'dts/mpd'),
						id: "10"
					},
					{
						name: $rootScope.i18n("l-outras", [], 'dts/mpd'),
						id: "99"
					}]

			}

			if (vm.containsString(fieldName, '&emitente&natureza')) {
				var opts = [{
						name: $rootScope.i18n("?", [], 'dts/mpd'),
						id: "?"
					},
					{
						name: $rootScope.i18n("l-pessoa-fisica", [], 'dts/mpd'),
						id: "1"
					},
					{
						name: $rootScope.i18n("l-pessoa-juridica", [], 'dts/mpd'),
						id: "2"
					},
					{
						name: $rootScope.i18n("l-foreign", [], 'dts/mpd'),
						id: "3"
					},
					{
						name: $rootScope.i18n("l-trading", [], 'dts/mpd'),
						id: "4"
					}]

			}

			if (vm.containsString(fieldName, '&ped_venda&cod_des_merc')) {
				var opts = [{
						name: $rootScope.i18n("?", [], 'dts/mpd'),
						id: "?"
					},
					{
						name: $rootScope.i18n("l-business-industry", [], 'dts/mpd'),
						id: "1"
					},
					{
						name: $rootScope.i18n("l-own-propertie", [], 'dts/mpd'),
						id: "2"
					}]
			}

			if(vm.containsString(fieldName, '&item&compr_fabric')){
				var opts = [{name: $rootScope.i18n("?", [], 'dts/mpd'), id: "?"},
							{name: $rootScope.i18n("l-comprado", [], 'dts/mpd'), id: "1"},
							{name: $rootScope.i18n("l-fabricado", [], 'dts/mpd'), id: "2"}]
			}

			if(vm.containsString(fieldName, '&item&cd_trib_icm')){
				var opts = [{name: $rootScope.i18n("?", [], 'dts/mpd'), id: "?"},
							{name: $rootScope.i18n("l-tributado", [], 'dts/mpd'), id: "1"},
							{name: $rootScope.i18n("l-isento", [], 'dts/mpd'), id: "2"},
							{name: $rootScope.i18n("l-outros", [], 'dts/mpd'), id: "3"},
							{name: $rootScope.i18n("l-reduzido", [], 'dts/mpd'), id: "4"}]
			}

			var input = angular.element('<input></input>');
			input.attr("data-bind", 'value:' + fieldName);

			input.appendTo(container);

			input.kendoDropDownList({
				dataValueField: "id",
				dataTextField: "name",
				dataSource: opts
			})
		}

		vm.selectDropDownTemplate = function (dataItem, field) {
			var value;

			for (var key in dataItem) {
				if (vm.replaceAll(vm.replaceAll(key, "_________", ","), "_", "-") == field) {
					value = dataItem[key];
				}
			}

			if (vm.containsString(field, '&item-uni-estab&char-1,133,1')) {
				switch (value) {
					case '?':
						return $rootScope.i18n("?", [], 'dts/mpd');
					case '0':
						return $rootScope.i18n("l-mercoria-revenda", [], 'dts/mpd');
					case '1':
						return $rootScope.i18n("l-materia-prima", [], 'dts/mpd');
					case '2':
						return $rootScope.i18n("l-embalagem", [], 'dts/mpd');
					case '3':
						return $rootScope.i18n("l-produto-processo", [], 'dts/mpd');
					case '4':
						return $rootScope.i18n("l-produto-acabado", [], 'dts/mpd');
					case '5':
						return $rootScope.i18n("l-subproduto", [], 'dts/mpd');
					case '6':
						return $rootScope.i18n("l-produto-intermediario", [], 'dts/mpd');
					case '7':
						return $rootScope.i18n("l-material-uso-consumo", [], 'dts/mpd');
					case '8':
						return $rootScope.i18n("l-ativo-imobilizado", [], 'dts/mpd');
					case '9':
						return $rootScope.i18n("l-servicos", [], 'dts/mpd');
					case '10':
						return $rootScope.i18n("l-outros-insumos", [], 'dts/mpd');
					case '99':
						return $rootScope.i18n("l-outras", [], 'dts/mpd');
				}
			}

			if (vm.containsString(field, '&emitente&natureza')) {
				switch (value) {
					case '?':
						return $rootScope.i18n("?", [], 'dts/mpd');
					case '1':
						return $rootScope.i18n("l-pessoa-fisica", [], 'dts/mpd');
					case '2':
						return $rootScope.i18n("l-pessoa-juridica", [], 'dts/mpd');
					case '3':
						return $rootScope.i18n("l-foreign", [], 'dts/mpd');
					case '4':
						return $rootScope.i18n("l-trading", [], 'dts/mpd');
				}
			}

			if (vm.containsString(field, '&ped-venda&cod-des-merc')) {
				switch (value) {
					case '?':
						return $rootScope.i18n("?", [], 'dts/mpd');
					case '1':
						return $rootScope.i18n("l-business-industry", [], 'dts/mpd');
					case '2':
						return $rootScope.i18n("l-own-propertie", [], 'dts/mpd');
				}
			}

			if(vm.containsString(field, '&item&compr-fabric')){
				switch(value){
					case '?' :
						return  $rootScope.i18n("?", [], 'dts/mpd');
					case '1' :
						return  $rootScope.i18n("l-comprado", [], 'dts/mpd');
					case '2' :
						return  $rootScope.i18n("l-fabricado", [], 'dts/mpd');
				}
			}

			if(vm.containsString(field, '&item&cd-trib-icm')){
				switch(value){
					case '?' :
						return  $rootScope.i18n("?", [], 'dts/mpd');
					case '1' :
						return  $rootScope.i18n("l-tributado", [], 'dts/mpd');
					case '2' :
						return  $rootScope.i18n("l-isento", [], 'dts/mpd');
					case '3' :
						return  $rootScope.i18n("l-outros", [], 'dts/mpd');
					case '4' :
						return  $rootScope.i18n("l-reduzido", [], 'dts/mpd');
				}
			}
		}

		vm.getGridOptionsCopy = function () {
			vm.deferredGridRulesCopy = $q.defer();

			vm.optsGridRulesCopy = {
				reorderable: true,
				sortable: true,
				columns: angular.copy(parameters.columnsGridRulesCopy)
			};

			//Atualiza a definição das colunas do grid
			vm.deferredGridRulesCopy.resolve(vm.optsGridRulesCopy);

			return vm.deferredGridRulesCopy.promise;
		}

		vm.itemsGridEdit = function(event, column) {

			$timeout(function () {
				var inputs = $(event.container).find("input:focus:text");
				if (inputs.length > 0) inputs[0].setSelectionRange(0,999);
			},50);

		}

		vm.startData();
	}

	// *************************************************************************************
	// *** MODAL NOTE
	// *************************************************************************************
	modalNote.$inject = ['$modal'];

	function modalNote($modal) {
		/* jshint validthis: true */

		/**
		 * Abre a modal de pesquisa avançada
		 * @param  {Object} params Parâmetros que deverão ser passados para o controller da modal
		 * @return {Promise}       Retorna a instância da modal
		 */
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/mpd/html/rulesoperations/rulesoperations.note.html',
				controller: 'mpd.rulesoperations.note.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: {
					parameters: function () {
						return params;
					}
				}
			});

			return instance.result;
		};
	}

	// *************************************************************************************
	// *** CONTROLLER MODAL NOTE
	// *************************************************************************************
	rulesOperationsNoteController.$inject = [
		'$modalInstance',
		'parameters'
	];

	function rulesOperationsNoteController(
		$modalInstance,
		parameters) {
		/* jshint validthis: true */
		var vm = this;


		vm.isEdit = parameters.edit;
		vm.valueTextarea = parameters.note;

		vm.startData = function () {

		}

		vm.confirm = function() {

			if(vm.valueTextarea == '') vm.valueTextarea = undefined;

			$modalInstance.close({
				note :  vm.valueTextarea,
				confirm: true
			});
		}

		/**
		 * Fecha a modal
		 * @return {}
		 */
		vm.close = function close() {
			$modalInstance.dismiss('cancel');
		};
	}

	// *************************************************************************************
	// *** HELPER
	// *************************************************************************************
	rulesOperationsHelper.$inject = ['$filter'];

	function rulesOperationsHelper($filter) {
		return {
			/**
			 * Cria um filtro (padrão de um disclaimer).
			 * @param {string} property property do disclaimer
			 * @param {string} value    valor do campo
			 * @param {string} title    título do disclaimer
			 * @param {string} type     tipo de campo (string, boolean, date). default: string
			 * @param {boolean} hide    identifica se o disclaimer deve ficar escondido
			 * @return {Object}         Retorna um disclaimer
			 */
			addFilter: function (property, value, title, type, hide) {
				var filter = {
					'property': property,
					'value': value,
					'type': type ? type : 'string',
					'hide': hide === true
				};

				switch (type) {
					case 'date':
						filter.title = title + ': ' + $filter('date')(value, 'shortDate');
						break;
					case 'boolean':
						filter.title = title;
						break;
					default:
						filter.title = title + ': ' + value;
						break;
				}
				return filter;
			},
			/**
			 * Converte os disclaimers para um objeto contendo os respectivos valores.
			 * @param  {Array}  disclaimers Disclaimers que serão convertidos
			 * @return {Object} Objeto contendo os disclaimers convertidos da seguinte forma: object[disclaimer.property] = disclaimer.value
			 */
			parseDisclaimersToFilter: function(disclaimers) {
				disclaimers = disclaimers || [];
				var filters = {};
				disclaimers.forEach(function(disclaimer) {
					filters[disclaimer.property] = disclaimer.value;
				});
				return filters;
			},
			/**
			 * Transforma os disclaimers em parâmetros para a API
			 * @param  {Array}  disclaimers Disclaimers que serão convertidos em filtros para a API
			 * @return {Object} filtros para a API
			 */
			parseDisclaimersToParameters: function(disclaimers) {
				disclaimers = disclaimers || [];
				var options = {
					properties: [],
					values: []
				};
				disclaimers.forEach(function(filter) {
					if (filter.property) {
						options.properties.push(filter.property);

						/* Tratamento como paliativo para filtros por campos lógicos */
						if(filter.value.toUpperCase() === "SIM") filter.value = "yes";
						if(filter.value.toUpperCase() === "NÃO") filter.value = "no";
						if(filter.value.toUpperCase() === "NAO") filter.value = "no";

						switch (filter.type) {
							case 'date':
								options.values.push($filter('date')(filter.value, 'shortDate'));
								break;
							default:
								options.values.push(filter.value);
								break;
						}

					}
				});
				return options;
			}
		};
	}


	index.register.controller('mpd.rulesoperations.list.control', rulesoperationsListController);

	index.register.service('mpd.rulesoperations.modal.advanced.search', modalAdvancedSearch);
	index.register.controller('mpd.rulesoperations.advanced.search.control', rulesOperationsAdvancedSearchController);

	index.register.service('mpd.rulesoperations.modal.add.edit', modalAddEdit);
	index.register.controller('mpd.rulesoperations.add.edit.control', rulesOperationsAddEditController);

	index.register.service('mpd.rulesoperations.modal.copy', modalCopy);
	index.register.controller('mpd.rulesoperations.copy.control', rulesOperationsCopyController);

	index.register.service('mpd.rulesoperations.modal.note', modalNote);
	index.register.controller('mpd.rulesoperations.note.control', rulesOperationsNoteController);

	index.register.service('mpd.rulesoperationshelper.helper', rulesOperationsHelper);

});

