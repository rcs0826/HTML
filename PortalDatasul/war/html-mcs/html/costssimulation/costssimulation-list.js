define(['index'], function(index) {
	
	/**
	 * Controller List
	 * 
	 */
	costssimulationListCtrl.$inject = [
		'$rootScope',
		'$scope',
		'$modal',
		'$filter',
		'totvs.app-main-view.Service',
        'fchman.fchman0008.Factory',
		'TOTVSEvent',
		'totvs.app-notification.Service',
        'i18nFilter',
		'messageHolder'
	];
	
	function costssimulationListCtrl($rootScope,
								 	 $scope,
								 	 $modal,
								 	 $filter,
								 	 appViewService,
                                 	 fchman0008Factory,
								 	 TOTVSEvent,
									 appNotificationService,
									 i18n,
									 messageHolder) {
	
		/**
		 * Variável Controller
		 */
		var controller = this;

		this.disclaimers = [];      // array que mantem a lista de filtros aplicados
        
        
 	    var day = new Date().getDate();
 	    var month = new Date().getMonth();
 	    var year = new Date().getFullYear(); 	     	    
 	    var today = new Date(year, month, day);
 	    var startDate = new Date(year,(month - 1), day);
        
		var createTab;
		var previousView;
		var filter = "";
	
        controller.quickSearchText = "";   // atributo que contem o valor da pesquisa rápida
        controller.ttItemCostsScenaryVO;
		controller.ttMultiLevelItemCostsVO;
		controller.ttOverheadCostsDetailVO2;
		controller.ttExternalOperationsCostsVO;
		controller.ttOperationLaborCostsDetailVO;
		controller.setupTimeVO;
		// *************************************************************************************
		// *** Functions
		// *************************************************************************************

		/**
		 * Abertura da tela de pesquisa avançada
		 */
	    controller.openDetail = function(data) {
			
			angular.forEach(controller.ttMultiLevelItemCostsVO,function(value){
				
				if(value.sequence == data.sequence){
					gridRow = {
						itemCode: data.itemCode,
						itemReference: data.itemReference,
						itemDescription: data.itemDescription,								
						materialCost: value.materialCost,								
						laborCost: value.laborCost,								
						laborTotCost: value.laborTotCost,								
						overheadCost: value.overheadCost,								
						overheadTotCost: value.overheadTotCost,								
						externalOpCost: value.externalOpCost,								
						scrapCost: value.scrapCost,								
						setupCost: value.setupCost,								
						itemCompr: value.itemCompr,
						totalValue: value.totalValue,
						unitValue: value.unitValue
					}					
				}				
			});
			
			var modalInstance = $modal.open({
				templateUrl: '/dts/mcs/html/costssimulation/costssimulation.detail.html',
				controller: 'mcs.costssimulation.DetailCtrl as controller',
				size: 'lg',
				windowClass: 'app-modal-window',
				resolve: {
					model: function () {
						var modelControllers = [controller.ttItemCostsScenaryVO,controller.resultTempTables,gridRow];
						//passa o objeto com os dados da pesquisa avançada para o modal
						return modelControllers;
					}
				}
			});
		}

		/**
		 * Abertura da tela de pesquisa avançada
		 */
	    controller.openAdvancedSearch = function() {
						
			controller.ttItemCostsScenaryVO.itemCode = controller.quickSearchText;
			
			angular.forEach(controller.disclaimers, function(result){
				if(result){
					switch(result.property) {
						case "site":
							controller.ttItemCostsScenaryVO.site = result.value.substring(1, result.value.length - 1);
							break;
						case "itemReference":
							controller.ttItemCostsScenaryVO.itemReference =  result.value.substring(1, result.value.length - 1);
							break;
						case "routingCode":
							controller.ttItemCostsScenaryVO.routingCode =  result.value.substring(1, result.value.length - 1);
							break;
						case "componentListCode":
							controller.ttItemCostsScenaryVO.componentListCode =  result.value.substring(1, result.value.length - 1);
							break;
					}
				}
			})
			
			
	        var modalInstance = $modal.open({
	        	templateUrl: '/dts/mcs/html/costssimulation/costssimulation.advanced.search.html',
	        	controller: 'mcs.costssimulation.SearchCtrl as controller',
	        	size: 'lg',
	        	resolve: {
	        		model: function () {
	        			//passa o objeto com os dados da pesquisa avançada para o modal
	        			return controller.ttItemCostsScenaryVO;
	        		}
	        	}
	        });
	        
	        // quando o usuario clicar em pesquisar:
	        modalInstance.result.then(function () {
				controller.quickSearchText = controller.ttItemCostsScenaryVO.itemCode;
	 	    	
	            // e chama o busca dos dados
                controller.loadData(false);
	        });
	    }
        /**
         * Limpar filtros da pesquisa avançada
         */
        controller.onCleanSearch = function() {
            controller.quickSearchText = "";
            controller.setDefaultItemCostsScenary();
        }
        controller.notification = function() {
			messageHolder.showMsg(i18n('l-warning'), i18n('l-tipo-sobra-invalido'));			
        }
        
		/**
		 * Método de leitura dos dados
		 */
        controller.loadData = function(firstRun) {
						
			controller.addDisclaimers();            
            controller.listResult = [];
            controller.totalRecords = 0;
			            
            if (firstRun){
                controller.ttItemCostsScenaryVO.itemCode = undefined;
			}else{            
                controller.ttItemCostsScenaryVO.itemCode = controller.quickSearchText;
			}
                        
            fchman0008Factory.getMultiLevelItemCosts(controller.ttItemCostsScenaryVO, function(result){
				
                if (result) {                    
					
					controller.gridRows = [];
                    controller.totalRecords = result.ttMultiLevelItemCostsVO.length;
					controller.ttMultiLevelItemCostsVO = result.ttMultiLevelItemCostsVO;
					controller.ttOverheadCostsDetailVO2 = result.ttOverheadCostsDetailVO2;
					controller.ttOperationLaborCostsDetailVO = result.ttOperationLaborCostsDetailVO;
					controller.ttExternalOperationsCostsVO = result.ttExternalOperationsCostsVO;
					controller.ttSetupTimeVO = result.ttSetupTimeVO;
					controller.resultTempTables = result;

                    // para cada item do result
                    angular.forEach(result.ttMultiLevelItemCostsVO, function (value) {
                        // adicionar o item na lista de resultado
                        controller.listResult.push({level: value.level,
                                                     itemCode: value.itemCode,
												 	 itemReference: value.itemReference,
                                                     fatherItem: value.fatherItem,
                                                     itemDescription: value.itemDescription});
													
                        // atualiza o grid de necessidades
                        controller.gridRows.push({level: value.level,
												 itemCode: value.itemCode,
												 itemReference: value.itemReference,
												 fatherItem: value.fatherItem,
												 iIndex: value.iIndex,
												 id: value.sequence,
												 sequence: value.sequence,
												 parentId: value.fatherSequence == "" ? null:value.fatherSequence,
												 unitValue: value.unitValue,
												 totalValue: value.totalValue,
												 itemDescription: value.itemDescription,
												 quantity: value.quantity,
												 inventoryGroup: value.inventoryGroup,
												 percentualValue: value.percentualValue,
												 unitOfMeasure: value.unitOfMeasure});
					});
				}

				var dataSource = new kendo.data.TreeListDataSource({
					transport: {
						read: function(options) {
							setTimeout(function() {
								if (!options.data.id) {
									options.success(controller.gridRows);
								}
							}, 1000);
						}
					},
					schema: {
						model: {
							id: "id"
						}
					}
				});

				if ($("#treeList").data("kendoTreeList") == undefined) {
                    controller.createTreeList(dataSource);
                } else {
                    $("#treeList").data("kendoTreeList").setDataSource(dataSource);
                }
            });
									
        }
        controller.createTreeList = function(dataSource) {
			$("#treeList").kendoTreeList({
				dataSource: dataSource,
				height: 540,
				selectable: false,
				resizable: true,
				reorderable: true,
				sortable: true,
				columns:[
					{ 
						field: "itemCode",
						title: "Item",
						attributes: {
							  class: "table-cell",
							  style: "text-align: left; font-size: 14px"
							}
					},
					{ 
						field: "itemDescription", 
						title: "Descrição",
						attributes: {
					class: "table-cell",
							  style: "text-align: center; font-size: 14px"
							},
						minScreenWidth: "500px"
					},
					{ 

						field: "inventoryGroup", 
						title: "Grupo Estoque",
						attributes: {
					class: "table-cell",
							  style: "text-align: center; font-size: 14px"
							}
					},
					{ 
						field: "quantity", 
						title: "Quantidade",
						attributes: {
					class: "table-cell",
							  style: "text-align: center; font-size: 14px"
							}
					},
					{ 
						field: "unitOfMeasure", 
						title: "Unidade Medida",
						attributes: {
							  class: "table-cell",
							  style: "text-align: center; font-size: 14px"
							}
					},
					{ 
						field: "unitValue", 
						title: "Valor Unitário",
						format: "{0:n4}",
						attributes: {
						class: "table-cell",
								  style: "text-align: center; font-size: 14px"
								}
					},
					{ 
						field: "totalValue", 
						title: "Valor Total",
						format: "{0:n4}",
						attributes: {
					class: "table-cell",
							  style: "text-align: center; font-size: 14px"
							}
					},
					{	
						attributes:{
							style: "text-align: center;"
						},
						command: [ {
							name: "detailColumn",
							text: "Detalhar",
							click: function(e) {
								// e.target is the DOM element representing the button
								var tr = $(e.target).closest("tr"); // get the current table row (tr)
								// get the data bound to the current table row
								var data = this.dataItem(tr);

								controller.ttItemCostsScenaryVO.itemCode = data.itemCode;
								controller.ttItemCostsScenaryVO.itemReference = data.itemReference;
								controller.ttItemCostsScenaryVO.sequence = data.sequence;

								if(data.quantity >= 0){
									controller.openDetail(data);
								}else{
									controller.notification();
								}
							}
						}]
					}
				],
				messages: {
					noRows: "Nenhum registro disponível"
				}
			});
		}
		
        controller.setDefaultItemCostsScenary = function() {
            controller.ttItemCostsScenaryVO = {
                    itemCode: "",
                    itemReference: "",
                    quantity: 1,
                    opCutOffDate: Date.parse(today),
                    itemPrice: "1",
                    currency: "0",
                    correction: false,
                    site: "",
                    setupType: "0",
                    operationCost: "1",
                    costCalcMethod: "1",
                    calcUpToLevel: 19,
                    includeScrapCost: false,
                    childItemSite: false,
                    businessUnit: false,
                    sequence: 0,
                    itemStatus: "1",
                    bomCutOffDate: Date.parse(today),
                    routingCode: "",
                    componentListCode: "",
                    showExternalOperation: true,
                    showOnlyExternalOperation: false
            };
			
		}
		
		/* Método que gera arquivo CSV */
		controller.gerarCsv = function(){
								
			if (controller.ttMultiLevelItemCostsVO != ""){

				var ttUnique = controller.geraTtUnique();

				fchman0008Factory.TempTableToCSV(ttUnique, function(result){

					if (result) {               

						var csvContent = controller.alteraLabel(result.csvContent);

						var a         = document.createElement('a');
						a.href        = 'data:attachment/csv,' +  encodeURIComponent(csvContent);
						a.target      = '_blank';
						a.download    = 'Simulação de Custos - ' + controller.ttItemCostsScenaryVO.itemCode + '.csv';

						document.body.appendChild(a);
						a.click();

					}
				});
			}
		}		
		
		
		controller.geraTtUnique = function(){
			
			var newEntry, ttUnique = [];
			
			angular.forEach(controller.ttMultiLevelItemCostsVO,function(item){
				if(item){
					
					newEntry = {
						itemCode: item.itemCode,
						itemRefer: item.itemReference ,
						tipo: "MAT",
						fatherItem: item.fatherItem,
						operation: 0,
						routingCode: "",
						unitValue: item.unitValue,
						laborCode: "", 
						quantidade: item.quantity,
						valorTotal: item.totalValue,
						opTime: 0, 
						setupCost: item.scrapCost,
						unitValueOpExt: 0,
						scrapCost: 0,
						vlUnitMob: 0,
						ccCode: 0, 
						overheadCost1: 0,
						overheadCost2: 0,
						overheadCost3: 0,
						overheadCost4: 0,
						overheadCost5: 0,
						overheadCost6: 0,
						upUnitQuantity: 0,
						upQuantity: 0
					};
					
					ttUnique.push(newEntry);
					
					controller.ttExternalOperationsCostsVO.find(function(opExt){
						if(opExt.sequence == item.sequence){
							newEntry = {
								itemCode: item.itemCode,
								itemRefer: item.itemReference,
								tipo: "OPER",
								fatherItem: item.fatherItem,
								operation: opExt.operation,
								routingCode: opExt.routingCode,
								unitValue: 0,
								laborCode: 0, 
								quantidade: 0,
								valorTotal: 0,
								opTime: 0, 
								setupCost: 0,
								unitValueOpExt: opExt.unitValue,
								scrapCost: 0,
								vlUnitMob: 0,
								ccCode: 0, 
								overheadCost1: 0,
								overheadCost2: 0,
								overheadCost3: 0,
								overheadCost4: 0,
								overheadCost5: 0,
								overheadCost6: 0,
								upUnitQuantity: 0,
								upQuantity: 0
							};
							
							ttUnique.push(newEntry);
						}
					});
					
					
					
					controller.ttOperationLaborCostsDetailVO.find(function(mob){
						if(mob.sequence == item.sequence){
							 
							newEntry = {
								itemCode: item.itemCode,
								itemRefer: item.itemReference,
								tipo: "OPER",
								fatherItem: item.fatherItem,
								operation: mob.operation,
								routingCode: mob.routingCode,
								unitValue: 0,
								laborCode: mob.laborCode, 
								quantidade: 0,
								valorTotal: 0,
								opTime: mob.laborTime, 
								setupCost: 0,
								unitValueOpExt: 0,
								scrapCost: 0,
								vlUnitMob: mob.laborCost,
								ccCode: 0, 
								overheadCost1: 0,
								overheadCost2: 0,
								overheadCost3: 0,
								overheadCost4: 0,
								overheadCost5: 0,
								overheadCost6: 0,
								upUnitQuantity: 0,
								upQuantity: 0
							};
							
							controller.ttOverheadCostsDetailVO2.find(function(ggf){
								if(ggf.sequence == item.sequence && ggf.operation == mob.operation){
									newEntry.ccCode = ggf.ccCode;
									newEntry.overheadCost1 = ggf.overheadCost1;
									newEntry.overheadCost2 = ggf.overheadCost2;
									newEntry.overheadCost3 = ggf.overheadCost3;
									newEntry.overheadCost4 = ggf.overheadCost4;
									newEntry.overheadCost5 = ggf.overheadCost5;
									newEntry.overheadCost6 = ggf.overheadCost6;
								}								
							});
							
							controller.ttSetupTimeVO.find(function(prep){
								if(prep.sequence == item.sequence && prep.operation == mob.operation){
									newEntry.setupCost = prep.unitValue;
									newEntry.upQuantity = prep.upQuantity;
								}
							});
							
							ttUnique.push(newEntry);
						}
					});
				}
			});
			
			return ttUnique;
		}
		
		controller.alteraLabel = function(csvContent){
			
			var csvContentNew = csvContent;
			
			csvContentNew = csvContentNew.replace("itemCode", i18n('l-item'));
			csvContentNew = csvContentNew.replace("itemRefer", i18n('l-reference'));
			csvContentNew = csvContentNew.replace("tipo", i18n('l-type'));
			csvContentNew = csvContentNew.replace("fatherItem", i18n('l-parent-item'));
			csvContentNew = csvContentNew.replace("operation", i18n('l-operation'));
			csvContentNew = csvContentNew.replace("routingCode", i18n('l-routing'));
			csvContentNew = csvContentNew.replace("unitValue", i18n('l-unitary-value'));
			csvContentNew = csvContentNew.replace("laborCode", i18n('l-mob-label'));
			csvContentNew = csvContentNew.replace("quantidade", i18n('l-quantity'));
			csvContentNew = csvContentNew.replace("valorTotal", i18n('l-total-value'));
			csvContentNew = csvContentNew.replace("opTime", i18n('l-opTime'));
			csvContentNew = csvContentNew.replace("setupCost", i18n('l-preparacao'));
			csvContentNew = csvContentNew.replace("unitValueOpExt", i18n('l-value-opext')); //NOVO
			csvContentNew = csvContentNew.replace("scrapCost", i18n('l-refugo'));
			csvContentNew = csvContentNew.replace("vlUnitMob", i18n('l-valor-unit-mob')); //NOVO
			csvContentNew = csvContentNew.replace("ccCode", i18n('l-ccCode'));
			if(controller.ttOverheadCostsDetailVO2[0]){
				csvContentNew = csvContentNew.replace("overheadCost1", controller.ttOverheadCostsDetailVO2[0].overheadName1);
				csvContentNew = csvContentNew.replace("overheadCost2", controller.ttOverheadCostsDetailVO2[0].overheadName2);
				csvContentNew = csvContentNew.replace("overheadCost3", controller.ttOverheadCostsDetailVO2[0].overheadName3);
				csvContentNew = csvContentNew.replace("overheadCost4", controller.ttOverheadCostsDetailVO2[0].overheadName4);
				csvContentNew = csvContentNew.replace("overheadCost5", controller.ttOverheadCostsDetailVO2[0].overheadName5);
				csvContentNew = csvContentNew.replace("overheadCost6", controller.ttOverheadCostsDetailVO2[0].overheadName6);
			}
			csvContentNew = csvContentNew.replace("upUnitQuantity", i18n('l-quantity-up')); //NOVO
			csvContentNew = csvContentNew.replace("upQuantity", i18n('l-quantity-up-prep'));
			
			return csvContentNew;
		}
				
		
		/**
		 * Método inicial
		 */
		controller.init = function() {
			createTab = appViewService.startView($rootScope.i18n('l-costssimulation'), 'mcs.costssimulation.ListCtrl', controller);
			previousView = appViewService.previousView;			

			if (previousView.controller) {
	            // Validação para não recarregar os dados ao trocar de aba
				if (createTab === false && previousView.controller !== "mcs.costssimulation.DetailCtrl" && previousView.controller !== "mcs.costssimulation.EditCtrl") {
	                return;
				}
			}

            controller.setDefaultItemCostsScenary();
            controller.loadData(true);
		}


	    /**
	     * Método para adicionar os disclaimers relativos a tela de pesquisa avançada
	     */ 
	    this.addDisclaimers = function() {
	        // reinicia os disclaimers
	    	controller.disclaimers = [];
	        
	        // adicionar o disclaimer para estabelecimento
			if (controller.ttItemCostsScenaryVO.site) {
				controller.addDisclaimer('site', '*' + controller.ttItemCostsScenaryVO.site.toUpperCase() + '*', $rootScope.i18n('l-site') + ": " + controller.ttItemCostsScenaryVO.site.toUpperCase());
			}
			
			// adicionar o disclaimer para referencia
	        if (controller.ttItemCostsScenaryVO.itemReference)
	            controller.addDisclaimer('itemReference', '*' + controller.ttItemCostsScenaryVO.itemReference.toUpperCase() + '*', $rootScope.i18n('l-reference') + ": " + controller.ttItemCostsScenaryVO.itemReference.toUpperCase());
			
			// adicionar o disclaimer para roteiro
	        if (controller.ttItemCostsScenaryVO.routingCode)
	            controller.addDisclaimer('routingCode', '*' + controller.ttItemCostsScenaryVO.routingCode + '*', $rootScope.i18n('l-routing') + ": " + controller.ttItemCostsScenaryVO.routingCode);

			// adicionar o disclaimer para lista de componentes
	        if (controller.ttItemCostsScenaryVO.componentListCode)
	            controller.addDisclaimer('componentListCode', '*' + controller.ttItemCostsScenaryVO.componentListCode + '*', $rootScope.i18n('l-lista-compon') + ": " + controller.ttItemCostsScenaryVO.componentListCode);

	    }


	    /**
	     * Adiciona um objeto na lista de disclaimers
	     */ 
	    this.addDisclaimer = function(property, value, label) {
	        controller.disclaimers.push({
	            property: property,
	            value: value,
	            title: label
	        });	       
	    }
	    
	    /**
	     * Remove um disclaimer
	     */
	    this.removeDisclaimer = function(disclaimer) {
	        // pesquisa e remove o disclaimer do array
	        var index = controller.disclaimers.indexOf(disclaimer);
	        if (index != -1) {
	            controller.disclaimers.splice(index, 1);
	        }
	        
	        if (disclaimer.property == 'itemReference') {
	            controller.ttItemCostsScenaryVO.itemReference = '';
	        }
	        if (disclaimer.property == 'routingCode') {
	            controller.ttItemCostsScenaryVO.routingCode = '';
	        }
	        if (disclaimer.property == 'componentListCode') {
	            controller.ttItemCostsScenaryVO.componentListCode = '';
	        }
	        if (disclaimer.property == 'site') {
	            controller.ttItemCostsScenaryVO.site = '';
	        }


	        controller.loadData();
	    }
	    


        
        
		// *********************************************************************************
	    // *** Control Initialize
	    // *********************************************************************************
		
		if ($rootScope.currentuserLoaded) { controller.init(); }
		
		// *********************************************************************************
	    // *** Events Listeners
	    // *********************************************************************************
		
		$scope.$on('$destroy', function () {
			controller = undefined;
		});
		
		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			controller.init();
		});
        
		
		
        
	}
    
    index.register.controller('mcs.costssimulation.ListCtrl', costssimulationListCtrl);
	
});
