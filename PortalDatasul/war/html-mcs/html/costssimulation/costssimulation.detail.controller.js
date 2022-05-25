define(['index',
    	'filter-i18n'
		], function(index) {

    // *********************************************************************************
    // *** Controller Detalhe
    // *********************************************************************************
	costssimulationDetailCtrl.$inject = [
 		'$modalInstance', 
 		'$scope',
		'$modal',
 	    'model',
 	    '$filter',
        'i18nFilter',
 	    'fchman.fchman0008.Factory'];

 	
 	function costssimulationDetailCtrl ($modalInstance,
	 									$scope,
								 	 	$modal,
										model,
										$filter,
										i18n,
										fchman0008Factory) {

		var controller = this;
		controller.objeto;

		controller.ttItemCostsScenaryVO = model[0];
		controller.resultTempTables = model[1];
		controller.gridRow = model[2];
				
		controller.detailName;
		controller.item;
		controller.descricao;
		controller.referencia;
		controller.OPext = false;
			
		controller.valueMat;
		controller.valueMob;
		controller.valueGgf;
		controller.valueOpPreparacao;
		controller.valueOpExt;
		controller.valueOpRefugo;
		controller.tipo;
		
	    controller.closeOther = false;
	    $scope.oneAtATime = true;
	    
	    $scope.status = {
    	    isFirstOpen: true,
    	    isFirstDisabled: false
	    };

 	    // ação de pesquisar
 	    controller.search = function () {
 	        // close é o fechamento positivo
 	        $modalInstance.close();
 	    }
 	    
 	    // ação de fechar
 	    controller.close = function () {
 	        // dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
 	        $modalInstance.dismiss();
 	    }
		
		
 	    // ação de fechar
 	    controller.voltar = function () {
 	        $("#chart").css("display","");
			$(".grid").css("display","none");
			$(".principal").css("display","");			
			$(".detalhes").css("display","none");			
			
			controller.detailName = i18n("l-details");
 	    }
		
		controller.onClick = function(){
		}

		/**
		 * Método de leitura dos dados
		 */
        controller.loadData = function() {
						
			controller.detailName = i18n('l-details');
			controller.item = controller.ttItemCostsScenaryVO.itemCode;
			controller.referencia = controller.ttItemCostsScenaryVO.itemReference;
			
			controller.descricao = controller.gridRow.itemDescription;

			controller.tipo = (controller.gridRow.itemCompr == 1) ? i18n('l-bought') : i18n('l-manufactured-singular');
			controller.valueMat = (controller.gridRow.itemCompr == 1) ? controller.gridRow.totalValue : controller.gridRow.materialCost;
			controller.valueMob = controller.gridRow.laborTotCost;
			controller.valueGgf = controller.gridRow.overheadTotCost;
		
			if (controller.ttItemCostsScenaryVO.setupType > 0) {
				controller.valueOpPreparacao = controller.gridRow.setupCost;
			}
			
			if (controller.ttItemCostsScenaryVO.showExternalOperation) {
				controller.valueOpExt = controller.gridRow.externalOpCost;
			}

			if (controller.ttItemCostsScenaryVO.includeScrapCost) {
				controller.valueOpRefugo = controller.gridRow.scrapCost;
			}
			
			setTimeout(controller.loadGrid, 100);			
			
        };
		
		controller.loadGrid = function(){
			
			
			dataCollection = [];
			categoriesCollection = [i18n('l-material'), i18n('l-mob-label'), i18n('l-ggf')];
			
			// adicionar o item na lista de resultado
			dataCollection = [(controller.gridRow.itemCompr == 1) ? controller.gridRow.totalValue : controller.gridRow.materialCost, controller.gridRow.laborTotCost, controller.gridRow.overheadTotCost];
						
			if (controller.ttItemCostsScenaryVO.setupType > 0) {
				dataCollection.push(controller.gridRow.setupCost);
				categoriesCollection.push(i18n('l-preparacao'));
				$("#opPreparacao").css("display","");

			}else{
				$("#opPreparacao").css("display","none");								
			}

			if (controller.ttItemCostsScenaryVO.showExternalOperation) {
				dataCollection.push(controller.gridRow.externalOpCost);
				categoriesCollection.push(i18n('l-opext'));
				$("#opExt").css("display","");		

			}else{
				$("#opExt").css("display","none");								
			}

			if (controller.ttItemCostsScenaryVO.includeScrapCost) {
				dataCollection.push(controller.gridRow.scrapCost);
				categoriesCollection.push(i18n('l-refugo'));
				$("#opRefugo").css("display","");		

			}else{
				$("#opRefugo").css("display","none");								
			}

			$(".detalhes").css("display","none");
			

			$("#chart").kendoChart({
				axisDefaults: {
					categories: categoriesCollection
				},
				series: [{
					data: dataCollection,
					color: "#007acc",
					type: "bar"
				}],
				plotAreaClick: controller.loadDataGrid,
				tooltip: {
					visible: true,
					template: "#= 'Valor' #: #=kendo.format('{0:n4}', value)#"
				}
			});	
		}
		/**
		 * Método de leitura dos dados
		 */
        controller.loadDataGrid = function(e) {
             

			if(e.category == i18n('l-material')){
				
				var dataSource = [];
				
				angular.forEach(controller.resultTempTables.ttMultiLevelItemCostsVO, function(result){
										
					if(result.fatherItem.toUpperCase() == controller.ttItemCostsScenaryVO.itemCode.toUpperCase()){
						dataSource.push(result);
					}
				});
								
				$(document).ready(function () { 

					$("#gridMat").kendoGrid({
						columnResizeHandleWidth: 6,
						dataSource: {
							data: dataSource,
							aggregate: [
								{ field: "totalValue", aggregate: "sum" }										
							]
						},
						scrollable: true,
						resizable: true,
						reorderable: true,
						columns:  [
						{
							field: "itemCode",
							title: i18n('l-item'),
							width: "150px"
						}, 
						{
							field: "itemDescription",
							title: i18n('l-description'),
							width: "200px"
						}, 
						{
							field: "itemReference",
							title: i18n('l-reference'),
							format: "{0:n2}",
							width: "100px"
						},
						{
							field: "unitOfMeasure",
							title: i18n('l-un'),
							template: '#=kendo.format("{0:n4}", unitOfMeasure)#',
							width: "50px"
						}, 
						{
							field: "quantity",
							title: i18n('l-quantity'),
							template: '#=kendo.format("{0:n4}", quantity)#',
							width: "150px",
							attributes:{style:"text-align:right;"}
						},  
						{
							field: "unitValue",
							title: i18n('l-unitary-value'),
							template: '#=kendo.format("{0:n4}", unitValue)#',
							width: "120px",
							attributes:{style:"text-align:right;"}
						},  
						{
							field: "totalValue",
							title: i18n('l-total-value'),
							template: '#=kendo.format("{0:n4}", totalValue)#',
							footerTemplate: '#=kendo.format("{0:n4}", sum)#',
							width: "120px",
							attributes:{style:"text-align:right;"}
						}, 
						{
							field: "percentualValue",
							title: i18n('l-total'),
							template: '#=kendo.format("{0:p}", percentualValue / 100)#',
							attributes: {
								  class: "table-cell",
								  style: "text-align: center; font-size: 14px"
								},
							width: "120px"
						}],
						noRecords: {
							template: i18n('l-no-registro')
						}
					});
				});
						
					
				$("#gridMat").css("display","");
				
			}else if(e.category == i18n('l-mob-label')){
							
				var dataSource = [];

				angular.forEach(controller.resultTempTables.ttOperationLaborCostsDetailVO, function(result){
										
					if(result.itemCode.toUpperCase() == controller.ttItemCostsScenaryVO.itemCode.toUpperCase()){
						dataSource.push(result);
					}
				});
					
				
				$(document).ready(function () { 

					$("#gridMov").kendoGrid({
						columnResizeHandleWidth: 6,
						dataSource: {
							data: dataSource
						},
						scrollable: true,
						resizable: true,
						reorderable: true,
						columns:  [
						{
							field: "laborCode",
							title: i18n('l-mob-label'),
							width: "100px"
						}, 
						{
							field: "laborDescription",
							title: i18n('l-description'),
							width: "200px"
						}, 
						{
							field: "operation",
							title: i18n('l-operation'),
							width: "100px"
						},
						{
							field: "opDescription",
							title: i18n('l-descricao-op'),
							width: "100px"
						},							
						{
							field: "laborTotCost",
							title: i18n('l-value'),
							format: "{0:n4}",
							width: "100px",
							attributes:{style:"text-align:right;"}
						},
						{
							field: "operationPercentual",
							title: i18n('l-perc'),
							template: '#=kendo.format("{0:p}", operationPercentual / 100)#',
							attributes: {
								  class: "table-cell",
								  style: "text-align: center; font-size: 14px"
								},
							width: "100px"
						},
						{
							field: "totalPercentual",
							title: i18n('l-total'),
							template: '#=kendo.format("{0:p}", totalPercentual / 100)#',
							attributes: {
								  class: "table-cell",
								  style: "text-align: center; font-size: 14px"
								},
							width: "100px"
						}],
						noRecords: {
							template: i18n('l-no-registro')
						}
					});
				});
						
						
				$("#gridMov").css("display","");
				
			}else if(e.category == i18n('l-ggf')){ //ggf
				
					var dataSource = [];
					var overheadName1;
					var overheadName2;
					var overheadName3;
					var overheadName4;
					var overheadName5;
					var overheadName6;
					
					angular.forEach(controller.resultTempTables.ttOverheadCostsDetailVO2, function(result){

						
						if(result.itemCode.toUpperCase() == controller.ttItemCostsScenaryVO.itemCode.toUpperCase()){
							
							dataSource.push(result);
							
							overheadName1 = i18n(result.overheadName1);
							overheadName2 = i18n(result.overheadName2);
							overheadName3 = i18n(result.overheadName3);
							overheadName4 = i18n(result.overheadName4);
							overheadName5 = i18n(result.overheadName5);
							overheadName6 = i18n(result.overheadName6);
						}
					});								

					$(document).ready(function () {
						$("#gridGgf").kendoGrid({
							dataSource: {
								data: dataSource,
								aggregate: [
									{ field: "overheadTotCost1", aggregate: "sum" },
									{ field: "overheadTotCost2", aggregate: "sum" },
									{ field: "overheadTotCost3", aggregate: "sum" },
									{ field: "overheadTotCost4", aggregate: "sum" },
									{ field: "overheadTotCost5", aggregate: "sum" },
									{ field: "overheadTotCost6", aggregate: "sum" }

								]
							},
							scrollable: true,
							resizable: true,
							reorderable: true,
							sortable: true,
							columns:  [
							{
								field: "itemCode",
								title: i18n('l-item'),
								width: 100
							},
							{
								field: "operation",
								title: "Op.",
								width: 100
							}, 
							{
								field: "opDescription",
								title: i18n('l-description'),
								width: 200,
								minScreenWidth: "500px"
							},							
							{
								field: "routingCode",
								title: i18n('l-routing'),
								width: "100px"
							},
							{	
								field: "overheadTotCost1",
								title: overheadName1,
								template: '#=kendo.format("{0:n4}", overheadTotCost1)#',
								footerTemplate: '#=kendo.format("{0:n4}", sum) #',
								width: 100,
								attributes:{style:"text-align:right;"}
							},
							{	 
								field: "overheadTotCost2",
								title: overheadName2,
								template: '#=kendo.format("{0:n4}", overheadTotCost2)#',
								footerTemplate: '#=kendo.format("{0:n4}", sum) #',
								width: 100,
								attributes:{style:"text-align:right;"}
							},
							{	
								field: "overheadTotCost3",
								title: overheadName3,
								template: '#=kendo.format("{0:n4}", overheadTotCost3)#',
								footerTemplate: '#=kendo.format("{0:n4}", sum) #',
								width: 100,
								attributes:{style:"text-align:right;"} 
							},
							{ 	
								field: "overheadTotCost4",
								title: overheadName4,
								template: '#=kendo.format("{0:n4}", overheadTotCost4)#',
								footerTemplate: '#=kendo.format("{0:n4}", sum) #',
								width: 100,
								attributes:{style:"text-align:right;"} 
							},
							{	
								field: "overheadTotCost5",
								title: overheadName5,
								template: '#=kendo.format("{0:n4}", overheadTotCost5)#',
								footerTemplate: '#=kendo.format("{0:n4}", sum) #',
								width: 100,
								attributes:{style:"text-align:right;"} 
							},
							{	
								field: "overheadTotCost6",
								title: overheadName6,
								template: '#=kendo.format("{0:n4}", overheadTotCost6)#',
								footerTemplate: '#=kendo.format("{0:n4}", sum) #',
								width: 100,
								attributes:{style:"text-align:right;"}
							},
							{
								field: "operationPercentual",
								title: i18n('l-perc'),
								template: '#=kendo.format("{0:p}", operationPercentual / 100)#',
								width: 100,
								attributes: {
									  class: "table-cell",
									  style: "text-align: center; font-size: 14px"
									}
							},
							{
								field: "totalPercentual",
								title: i18n('l-total'),
								template: '#=kendo.format("{0:p}", totalPercentual / 100)#',
								width: 100,
								attributes: {
									  class: "table-cell",
									  style: "text-align: center; font-size: 14px"
									}
							}],
							noRecords: {
								template: i18n('l-no-registro')
							}
						});
					});

				
				$("#gridGgf").css("display","");
				
			}else if(e.category == i18n('l-opext')){ //Operações Externas
				
				var dataSource = [];
					
				angular.forEach(controller.resultTempTables.ttExternalOperationsCostsVO, function(result){


					if(result.itemCode.toUpperCase() == controller.ttItemCostsScenaryVO.itemCode.toUpperCase()){

						dataSource.push(result);
					}
				});								

				
				$(document).ready(function () {
					$("#gridExtOp").kendoGrid({
						dataSource: {
							data: dataSource,
							aggregate: [
								{ field: "unitValue", aggregate: "sum" }
							]
						},
						scrollable: true,
						resizable: true,
						reorderable: true,
						sortable: true,
						columns:[
							{ 

								field: "operation", 
								title: i18n('l-op-short'),
								attributes: {
									class: "table-cell",
									style: "text-align: center; font-size: 14px"
									},
								width: "75px"
							},
							{ 

								field: "opDescription", 
								title: i18n('l-descricao-op'),
								attributes: {
									class: "table-cell",
									style: "text-align: center; font-size: 14px"
									},
								width: "200px"
							},
							{ 
								field: "itemCode",
								title: i18n('l-item'),
								expandable: true,
								attributes: {
									class: "table-cell",
									style: "text-align: center; font-size: 14px"
									},
								width: "150px"
							},
							{ 
								field: "itemDescription", 
								title: i18n('l-description'),
								attributes: {
									class: "table-cell",
									style: "text-align: center; font-size: 14px"
									},
								minScreenWidth: "500px",
								width: "200px"
							},							
							{
								field: "routingCode",
								title: i18n('l-routing'),
								width: "100px"
							}, 
							{ 
								field: "unitOfMeasure", 
								title: i18n('l-un'),
								attributes: {
									class: "table-cell",
									style: "text-align: center; font-size: 14px"
									},
								width: "75px"
							},
							{ 
								field: "unitValue", 
								title: i18n('l-total-value'), 
								format: "{0:n4}",
								footerTemplate: '#=kendo.format("{0:n4}", sum) #',
								attributes: {
									class: "table-cell",
									style: "text-align: right; font-size: 14px"
									},
								width: "120px"
							},
							{ 
								field: "operationPercentual", 
								title: i18n('l-oper-perc'),
								template: '#=kendo.format("{0:p}", operationPercentual / 100)#',
								attributes: {
									class: "table-cell",
									style: "text-align: center; font-size: 14px"
									},
								width: "120px"
							},
							{ 
								field: "totalPercentual", 
								title: i18n('l-total'),
								template: '#=kendo.format("{0:p}", totalPercentual / 100)#',
								attributes: {
									class: "table-cell",
									style: "text-align: center; font-size: 14px"
									},
								width: "120px"
							}
						],
						noRecords: {
							template: i18n('l-no-registro')
						}
					});
				});

				
				$("#gridExtOp").css("display","");
				
			} else if (e.category == i18n('l-preparacao')){ //Preparação
				
				var dataSource = [];
					
				angular.forEach(controller.resultTempTables.ttSetupTimeVO, function(result){

					if(result.itemCode.toUpperCase() == controller.ttItemCostsScenaryVO.itemCode.toUpperCase()){

						dataSource.push(result);
					}
				});								

				$(document).ready(function () {
					$("#gridPreparacao").kendoGrid({
						dataSource: {
							data: dataSource,
							aggregate: [
								{ field: "upQuantity", aggregate: "sum" },
								{ field: "unitValue", aggregate: "sum" }
							]
						},
						scrollable: true,
						resizable: true,
						reorderable: true,
						sortable: true,
						columns:[
							{ 
								field: "operation",
								title: i18n('l-op-short'),
								attributes: {
									class: "table-cell",
									style: "text-align: center; font-size: 14px"
									},
								width: "75px"
							},
							{ 
								field: "opDescription", 
								title: i18n('l-descricao-op'),
								attributes: {
									class: "table-cell",
									style: "text-align: center; font-size: 14px"
									},
								width: "200px"
							},
							{ 
								field: "itemCode",
								title: i18n('l-item'),
								expandable: true,
								attributes: {
									class: "table-cell",
									style: "text-align: center; font-size: 14px"
									},
								width: "150px"
							},
							{ 
								field: "itemDescription", 
								title: i18n('l-description'),
								attributes: {
									class: "table-cell",
									style: "text-align: center; font-size: 14px"
									},
								minScreenWidth: "500px",
								width: "200px"
							},
							{
								field: "routingCode",
								title: i18n('l-routing'),
								width: "100px"
							},
							{ 
								field: "unitOfMeasure", 
								title: i18n('l-un'),
								attributes: {
									class: "table-cell",
									style: "text-align: center; font-size: 14px"
									},
								width: "75px"
							},
							{ 
								field: "upQuantity", 
								title: i18n('l-quantity-up'),
								format: "{0:n4}",
								footerTemplate: '#=kendo.format("{0:n4}", sum) #',
								attributes: {
									class: "table-cell",
									style: "text-align: center; font-size: 14px"
									},
								width: "120px"
							},
							{ 
								field: "unitValue", 
								title: i18n('l-unitary-value'),
								format: "{0:n4}",
								footerTemplate: '#=kendo.format("{0:n4}", sum) #',
								attributes: {
									class: "table-cell",
									style: "text-align: right; font-size: 14px"
									},
								width: "120px"
							}
						],
						noRecords: {
							template: i18n('l-no-registro')
						}
					});
				});

				
				$("#gridPreparacao").css("display","");
			}
			
			if (e.category != i18n('l-refugo')) {
				controller.detailName = i18n(e.category);
				$("#chart").css("display","none");
				
				$(".principal").css("display","none");			
				$(".detalhes").css("display","");
			}
        };
		
		controller.loadData();
		
 	}

    index.register.controller('mcs.costssimulation.DetailCtrl', costssimulationDetailCtrl);
 
});