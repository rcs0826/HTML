/* global TOTVSEvent, angular*/
define(['index'], function(index) {
	
		modalSearchItemcontroller.$inject = [
			'mpd.fchdis0051.Factory',
			'customization.generic.Factory',
			'$scope',
			'$stateParams',
			'$state',
			'$compile',
			'$timeout',
			'$modal',
			'$filter',
			'userPreference',
			'$q',
			'$rootScope',
			'TOTVSEvent',
			'$http'];
	
		function modalSearchItemcontroller(
				fchdis0051,
				customService,
				$scope,
				$stateParams,
				$state,
				$compile,
				$timeout,
				$modal,
				$filter,
				userPreference,
				$q,
				$rootScope,
				TOTVSEvent,
				$http) {
	
			var searchController = this;
	
			var number = $filter('number');
	
			searchController.orderController = $scope.orderController;
	
			searchController.nrPedido = $stateParams.orderId;
			searchController.nrSequencia = $stateParams.nrSeq;
	
			searchController.listResult = [];
	
			searchController.quickSearchText = '';
	
			searchController.searchParams = {'SoItemCli':false, 
											 'ConsideraFamilia': false, 
											 'ConsideraGrupo': false, 
											 'FamilyBusiness': null,
											 'GroupStocks': null,
											 'SoItemTabPrecoPedido':true,
											   'NrTabPre': null};
											   
			searchController.customLoading = false;  
			searchController.rowIndex = null;
			searchController.cellIndex = null;
			
			searchController.gridOptions = {
				dataBinding: function (e) {
					searchController.onDataBinding(e);
				},
				dataBound: function (e) {
					searchController.onDataBound(e);
				}				
			}	
			
			searchController.onDataBinding = function (e) {
				var current = e.sender.current() || [];
				if (current[0]) {

					if (current.parent().index() < 0) {
						searchController.cellIndex = 1;
						searchController.rowIndex = 0;
					} else {
						searchController.cellIndex = current.index();
						searchController.rowIndex = current.parent().index();
					}

				}
			}

			searchController.onDataBound = function (e) {
				if (!isNaN(searchController.cellIndex)) {
					e.sender.current(e.sender.tbody.children().eq(searchController.rowIndex).children().eq(searchController.cellIndex));


					e.sender.select(e.sender.tbody.children().eq(searchController.rowIndex));

					searchController.rowIndex = searchController.cellIndex = null;					
				}
			}		
															 
			$q.when($rootScope.currentuser).then(function(result) {
				$q.all([userPreference.getPreference('mpd.pd400html.SoItemCli'),
					userPreference.getPreference('mpd.pd400html.ConsideraFamilia'),
					userPreference.getPreference('mpd.pd400html.ConsideraGrupo'),
					userPreference.getPreference('mpd.pd400html.FamilyBusiness'),
					userPreference.getPreference('mpd.pd400html.GroupStocks'),
					userPreference.getPreference('mpd.pd400html.SoItemTabPrecoPedido'),
					userPreference.getPreference('mpd.pd400html.NrTabPre')]).then(function(data) {
	
					searchController.searchParams.SoItemCli            = data[0].prefValue == 'true';
					searchController.searchParams.ConsideraFamilia     = data[1].prefValue == 'true';
					searchController.searchParams.ConsideraGrupo       = data[2].prefValue == 'true';
					searchController.searchParams.FamilyBusiness       = data[3].prefValue;
					searchController.searchParams.GroupStocks          = data[4].prefValue;
					searchController.searchParams.SoItemTabPrecoPedido = data[5].prefValue == 'true';
	
					if(searchController.searchParams.SoItemTabPrecoPedido) {
						searchController.searchParams.NrTabPre = searchItemParamController.nrTabPrecoPedido;
					} else {
						searchController.searchParams.NrTabPre = data[6].prefValue;
					}
				});
			});        
	
			$scope.$on("salesorder.pd4000.selectview", function (event,data) {
				if (data == 'pd4000b') {
					$timeout(function() {
						angular.element('input[ng-model="searchController.quickSearchText"]').focus();
					}, 100);				
				}
			});
			
			$scope.$on("salesorder.pd4000.hotkey.quickSearchText", function (event,data) {
				$timeout(function() {
					angular.element('input[ng-model="searchController.quickSearchText"]').focus();
				}, 100);
			});
	
			$scope.$on("salesorder.pd4000.hotkey.addItens", function (event,data) {
				angular.element('input[ng-model="searchController.quickSearchText"]').focus();   
				$timeout(function() {                
					searchController.addItensWithTimeOut();    
				}, 100);            
			});
	
			searchController.showEdit = function(column) {
	
				if (column == 'it-codigo') return false;
				if (column == 'desc-item') return false;
				if (column == 'cod-refer') return false;
				if (column == 'qtd-disponivel') return false;
				if (column == 'qt-pedida') return false;
				if (column == 'cod-un') return false;
				if (column == 'vl-preori-un-fat') return false;
				if (column == 'item-cli') return false;
				if (column == 'codigo-refer') return false;
	
				if (column == 'classificacao-fiscal') column = 'cod-class-fis';
	
				for (var index = 0; index < $scope.orderController.permissions['ped-item-search'].length; index++) {
					var element = $scope.orderController.permissions['ped-item-search'][index];
					if (element.fieldName == column && element.fieldEnabled) return true;                
				}
				return false;
			}
			
			searchController.customItemsGrid = function(){
				customService.callCustomEvent('pd4000bItemsGrid', {searchController: searchController});
			};			

			searchController.itemsGridEdit = function(event, column) {
	
				$timeout(function () {
					var inputs = $(event.container).find("input:focus:text");
					if (inputs.length > 0) inputs[0].setSelectionRange(0,999);
				},50);
	
				// campos que sempre habilitam a edição
				if (column.column == "qt-un-fat")
					return;
				if (column.column == "log-usa-tabela-desconto")
					return;
				if (column.column == "nr-tabpre")
					return;
				if (column.column == "val-desconto-inform")
					return;
				if (column.column == "des-pct-desconto-inform")
					return;
				if (column.column == "val-pct-desconto-tab-preco")
					return;
				if (column.column == "nat-operacao")
					return;
				if (column.column == "tipo-atend")
					return;
				if (column.column == "cod-entrega")
					return;
				if (column.column == "dt-entrega")
					return;
				if (column.column == "ind-fat-qtfam-aux")
					return;
				if (column.column == "estab-atend-item")
					return;
	
				// campos que validam uma regra
				var ttOrderItemSearch = event.model;
				if (column.column == "des-un-medida" && ttOrderItemSearch.measureUnit
						&& ttOrderItemSearch.ttOrderItemSearchUM
						&& ttOrderItemSearch.ttOrderItemSearchUM.length > 1)
					return;
				if (column.column == "ct-codigo" && ttOrderItemSearch.account)
					return;
				if (column.column == "sc-codigo" && ttOrderItemSearch.account)
					return;
				if (column.column == "custo-contabil" && ttOrderItemSearch.costAccount)
					return;
				if (column.column == "classificacao-fiscal" && ttOrderItemSearch.classFis)
					return;
				if (column.column == "vl-preori" && ttOrderItemSearch.originalPrice)
					return;
 				searchController.searchItemsGrid.closeCell();
           			searchController.searchItemsGrid.table.focus();
	
				/*var scrollTop = searchController.searchItemsGrid.content[0].scrollTop;
				var scrollLeft = searchController.searchItemsGrid.content[0].scrollLeft;
	
				searchController.searchItemsGrid.closeCell();
				searchController.searchItemsGrid.table.focus();
	
				searchController.searchItemsGrid.content[0].scrollTop = scrollTop;
				searchController.searchItemsGrid.content[0].scrollLeft =  scrollLeft;*/
	
			}
	
			searchController.editorUM = function(container, options) {
				options.model["des-un-medida"] = options.model["des-un-medida"].toUpperCase();
				var input = angular.element('<input></input>');
				input.attr("data-bind", 'value: ["des-un-medida"]')
				input.appendTo(container);
				var opts = [];
				var ttOrderItemSearchUM = options.model.ttOrderItemSearchUM;
				for (var i = 0; i < ttOrderItemSearchUM.length; i++) {
					opts.push({id: ttOrderItemSearchUM[i]['cod-unid-med'].toUpperCase(), name: number(ttOrderItemSearchUM[i]['preco-venda'], 2)});
				}
				input.kendoDropDownList({
					dataValueField: "id",
					dataTextField: "id",
					template: "<span>#: data.id # - #: data.name #</span>",
					dataSource: opts
				});
			}
	
			searchController.itemsGridSave = function(event, column, value, original, currentIndex) {
	
				if (original[column.column] != undefined &&
						value != undefined &&
						value != null &&
						original[column.column].toString().toUpperCase() === value.toString().toUpperCase()) {
					return;
				}
	
				if (    value == undefined || value == null
					 || (column.column == "qt-un-fat" && (value > 9999999.9999 || isNaN(value)))
					 || (column.column == "vl-preori" && (value > 999999999.9999 || isNaN(value)))
					) {
	
					event.preventDefault();
					return;
				}
	
				var scrollTop = searchController.searchItemsGrid.content[0].scrollTop;
				var scrollLeft = searchController.searchItemsGrid.content[0].scrollLeft;
	
				var index = event.container.index();
				var ttOrderParameters = $scope.orderController.orderParameters;
				var ttOrderItemSearch = original;
				ttOrderItemSearch[column.column] = value;
	
				var selectCell = function() {
					searchController.searchItemsGrid.options.navigatable = true;
					// seleciona a linha do grid
					var items = searchController.searchItemsGrid.items();
					var selected = [];
					items.each(function(idx, row) {
						obj = searchController.searchItemsGrid.dataItem(row);
						if (obj == event.model) {
							selected.push(row);
						}
					});
					searchController.searchItemsGrid.select(selected);
					searchController.searchItemsGrid.current($(selected).find("td").eq(index));
					searchController.searchItemsGrid.table.focus();
					searchController.searchItemsGrid.content[0].scrollTop = scrollTop;
					searchController.searchItemsGrid.content[0].scrollLeft = scrollLeft;
	
				}
	
				if (event.model.ttOrderItemSearchObrigatorio) {
					for (var index = 0; index < event.model.ttOrderItemSearchObrigatorio.length; index++) {
						var element = event.model.ttOrderItemSearchObrigatorio[index];
						if (element['vl-preori'])
							element['qt-un-fat'] = ttOrderItemSearch['qt-un-fat'];
	
						element = searchController.listResult[currentIndex].ttOrderItemSearchObrigatorio[index];
						if (element['vl-preori'])
							element['qt-un-fat'] = ttOrderItemSearch['qt-un-fat'];
					}
				}
	
				if (!original['nr-sequencia']) {
					// fecha o editor antes de chamar para evitar iteração do usuário
					//searchController.searchItemsGrid.closeCell();
					//searchController.searchItemsGrid.table.focus();
					//$timeout(selectCell, 0);
	
					$timeout(function() {
						fchdis0051.startAddItem({
							nrPedido: searchController.nrPedido,
							itemCode: original['it-codigo'],
							field: column.column
						}, {
							ttOrderParameters: ttOrderParameters,
							ttOrderItemSearch: ttOrderItemSearch
						}, function(result) {
							customService.callCustomEvent("startAddItem", {
								controller: searchController,
								result: result
							});
	
						var obj = result.ttOrderItemSearch[0];
						for (var key in obj) {
							if (event.model.hasOwnProperty(key) && event.model[key] != obj[key]) {
								event.model.set("[\"" + key + "\"]", obj[key]);
								searchController.listResult[currentIndex][key] = obj[key];
							}
						}

					
						//$timeout(selectCell, 0);
					});
					}, 250);
	
				} else {
					if (column.column == "qt-un-fat" ||
							column.column == "des-un-medida" ||
							column.column == "log-usa-tabela-desconto" ||
							column.column == "nr-tabpre" ||
							//column.column == "vl-preori"                ||
							column.column == "ct-codigo" ||
							//column.column == "sc-codigo"                ||
							column.column == "nat-operacao" ||
							column.column == "estab-atend-item" ||
							column.column == "cod-entrega" ||
							column.column == "dt-entrega") {
						// fecha o editor antes de chamar para evitar iteração do usuário    
						//searchController.searchItemsGrid.closeCell();
						//searchController.searchItemsGrid.table.focus();
						//$timeout(selectCell, 0);
						fchdis0051.leaveOrderItem({
							nrPedido: searchController.nrPedido,
							nrSeq: original['nr-sequencia'],
							itemCode: original['it-codigo'],
							fieldname: column.column,
							action: "Add"
						}, {
							ttOrderItemPD4000: [ttOrderItemSearch],
							ttOrderParameters: ttOrderParameters
						}, function(result) {
							customService.callCustomEvent("leaveOrderItemSearch", {
								controller: searchController,
								result: result
							});
	
							var obj = result.ttOrderItemPD4000[0];
							for (var key in obj) {
								if (event.model.hasOwnProperty(key) && event.model[key] != obj[key]) {
									event.model.set("[\"" + key + "\"]", obj[key]);
									searchController.listResult[currentIndex][key] = obj[key];
								}
							}
							//$timeout(selectCell, 0);
						});
					}
				}
			}
		

		

        searchController.addItens = function (gotoitems) {
            var ttOrderParameters = $scope.orderController.orderParameters;

            searchController.itensToAdd = new Array();

            var lista = searchController.listResult;

			var countItemToAdd = 0;
            angular.forEach(lista, function(item) {

                if (item['qt-un-fat'] > 0) {
                    searchController.itensToAdd.push(item);
                    countItemToAdd = countItemToAdd + 1;
                }
            });
            if (searchController.listResult.length > 0) {
                if (countItemToAdd == 0) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, [{ type: 'warning', title: 'Itens', detail: 'Informe quantidade nos itens para adiciona-los ao pedido.' }]);
                }
            } else {
                $rootScope.$broadcast(TOTVSEvent.showNotification, [{ type: 'warning', title: 'Itens', detail: 'Realize uma pesquisa para adicionar itens ao pedido.' }]);
			}
			
	    searchController.customLoading = false;

            if (searchController.itensToAdd.length) {

                $timeout(function () {					

                    fchdis0051.validateOrderItem(
                        {
                            nrPedido: searchController.nrPedido
                        },
                        {
                            ttOrderParameters: ttOrderParameters,
                            dsOrderItemSearch: {
                                ttOrderItemSearch: searchController.itensToAdd
                            }
                        },
                        function (resultitems) {
                            customService.callCustomEvent("validateOrderItem", {
                                controller: searchController,
                                result: resultitems
                            });

                            for (var i = 0; i < searchController.listResult.length; i++) {
                                searchController.listResult[i]["qt-un-fat"] = 0;
                                searchController.listResult[i]["qt-un-fat"] = 0;
                            }
                            
                            searchController.searchItemsGrid.dataSource.data(searchController.listResult);

                            if (!resultitems.$hasError) {
                                if (resultitems.ttOrderItemSearch.length > 0) {
                                    fchdis0051.addOrderItem({
                                        nrPedido: searchController.nrPedido
                                    }, {
                                            ttOrderParameters: ttOrderParameters,
                                            ttOrderItemSearch: resultitems.ttOrderItemSearch
                                        }, function (result) {
                                            customService.callCustomEvent("addOrderItem", {
                                                controller: searchController,
                                                result: result
                                            });
                                            if (!result.$hasError) {
                                                searchController.reloadItems(gotoitems);
                                            }
                                        });
                                }
                            }
                        }
                    );
                }, 250);
            }
        };


		searchController.addItensWithTimeOut = function(gotoitems){

			searchController.customLoading = true;

			$timeout(function () {
				if($http.pendingRequests.length === 0){
					searchController.addItens(gotoitems);
				}else{
                    searchController.quickSearchText = '';
					searchController.addItensWithTimeOut(gotoitems);
				}
			}, 500);
		}


		searchController.reloadItems = function(gotoitems) {
			$scope.$emit("salesorder.pd4000.loaditems", gotoitems);

			if(!gotoitems){
                searchController.setFocusItem();
				$rootScope.$broadcast(TOTVSEvent.showNotification, [{type: 'info', title: 'Itens', detail: 'Adicionado ao pedido'}]);
			}
        };
        
        searchController.setFocusItem = function() {
            var searchItemEl = document.getElementById('pd4000searchitem');
            var angularEl = angular.element(searchItemEl);
            angularEl.focus();
        }

        searchController.searchButton = function() {

            searchController.listResult = [];

            searchController.loadMore();
        };

        searchController.applySelectRange = function($event){			
			$event.target.setSelectionRange(0, 999); 			
        }
                
        searchController.loadMore = function() {
            var nrTabPre = null;

            if(searchController.searchParams.SoItemTabPrecoPedido == true){
                nrTabPre = $scope.orderController.order['nr-tabpre'];  
            }else{
                nrTabPre = searchController.searchParams.NrTabPre;
            }

            var codEstabel = $scope.orderController.order['cod-estabel'];
            var params = angular.extend(
                    {},
                    searchController.searchParams,
                    {
                        nrPedido: searchController.nrPedido,
                        SearchTerm: "*" + searchController.quickSearchText + "*",
                        NrTabPre: nrTabPre,
                        CodEstab: codEstabel,
                        Start: searchController.listResult.length
                    }
            );

            fchdis0051.searchproducts(
                    params
                    , function(data) {
                        customService.callCustomEvent("searchproducts", {
                            controller: searchController,
                            result: data
                        });


							searchController.searchItemsGrid.table.on('keyup', function(e) {
								
								
								
								var cell = $(e.currentTarget).find(".k-state-focused").closest('td');
								var row = $(cell).closest('tr');
								var rowIndex = $("tr", searchController.searchItemsGrid.tbody).index(row);
				
								searchController.searchItemsGrid.select(row);
							});
																												
							searchController.listResult = searchController.listResult.concat(data.dsOrderItemSearch);
							searchController.hasMore = data.lMore;
	
							if (data.dsOrderItemSearch.length == 0) {
								$rootScope.$broadcast(TOTVSEvent.showNotification, [{type: 'warning', title: 'Pesquisa sem resultados', detail: 'Informe outro termo de pesquisa ou verifique os parametros da pesquisa'}]);
							}
						}
				);
			};
	
			searchController.copyQtd = function(dataItem, table, master) {
				dataItem.set('["qt-un-fat"]', master['qt-un-fat']);
				var index1 = searchController.searchItemsGrid.dataSource.indexOf(master);
				var index2 = dataItem.parent().indexOf(dataItem);
				searchController.listResult[index1][table][index2]["qt-un-fat"] = master['qt-un-fat'];
			}
			searchController.copyPriceSelected = function(dataItem, master) {
	
				var index1 = searchController.searchItemsGrid.dataSource.indexOf(master);
	
				if(searchController.listResult[index1]["qt-un-fat"] < dataItem['quant-min']){
					searchController.listResult[index1]["qt-un-fat"] = dataItem['quant-min'];
					searchController.listResult[index1]["qt-pedida"] = dataItem['quant-min'];
	
					master.set('["qt-un-fat"]', dataItem['quant-min']);
					master.set('["qt-pedida"]', dataItem['quant-min']);
				}
	
				searchController.listResult[index1]["des-un-medida"] = dataItem['cod-unid-med'];
				searchController.listResult[index1]["vl-preori"] = dataItem['preco-venda'];
	
				master.set('["des-un-medida"]', dataItem['cod-unid-med']);
				master.set('["vl-preori"]', dataItem['preco-venda']);
	
			}
	
			searchController.relatedItemsGridSave = function(column, value, currentIndex, master, table) {
				var index1 = searchController.searchItemsGrid.dataSource.indexOf(master);
				searchController.listResult[index1][table][currentIndex]["qt-un-fat"] = value;
			}
	
			searchController.consigSearchItens = function() {
	
				var modalInstance = $modal.open({
					templateUrl: '/dts/mpd/html/pd4000/pd4000b.params.html',
					controller: 'salesorder.pd4000SearchItemParam.Controller as searchItemParamController',
					size: 'lg',
					resolve: {
						modalParams: function() {
							return {
								searchParams: searchController.searchParams,
								nrTabPrecoPedido: $scope.orderController.order['nr-tabpre'] 
							}
						}
					}
				});
	
				modalInstance.result.then(function(data) {
					searchController.searchParams = data.searchParams;
				});
	
			}
	
			searchController.itemStock = function(dataItem) {
	
				var ttItemEstoqueDeposito = [];
				var itemdeposito = searchController.orderController.ttItemEstoqueDeposito;
	
				if (itemdeposito) {
					if (itemdeposito.hasOwnProperty('size')) {
						for (var i = 0; i < itemdeposito.size; i++) {
							ttItemEstoqueDeposito.push({
								"deposito": itemdeposito.objSelected[i]['cod-depos']
							})
						}
					} else {
						ttItemEstoqueDeposito.push({
							"deposito": itemdeposito['cod-depos']
						})
					}
				}
	
				fchdis0051.itemstock({
					item: dataItem['it-codigo'],
					referencia: dataItem['cod-refer']
				}, {
					ttItemEstoqueDeposito: ttItemEstoqueDeposito,
					ttItemEstoqueParam: searchController.orderController.ttItemEstoqueParam || []
				}, function(data) {
	
					var modalInstance = $modal.open({
						templateUrl: '/dts/mpd/html/pd4000/pd4000.stock.html',
						controller: 'salesorder.pd4000Stock.Controller as modalStockController',
						size: 'lg',
						resolve: {
							modalParams: function() {
								return {
									ttItemEstoque: data.ttItemEstoque[0],
									ttItemEstoqueParam: data.ttItemEstoqueParam[0],
									ttItemEstoqueDeposito: itemdeposito
								}
							}
						}
					});
	
					modalInstance.result.then(function(data) {
						searchController.orderController.ttItemEstoqueDeposito = data.ttItemEstoqueDeposito;
						searchController.orderController.ttItemEstoqueParam = data.ttItemEstoqueParam;
					});
				});
			}
	
		}
		index.register.controller('salesorder.pd4000SearchItem.Controller', modalSearchItemcontroller);
	
	
		searchItemParamController.$inject = ['modalParams', '$modalInstance', 'userPreference', '$q', '$rootScope'];
	
		function searchItemParamController(modalParams, $modalInstance, userPreference, $q, $rootScope) {
	
			var searchItemParamController = this;
	
			searchItemParamController.searchParams = modalParams.searchParams;
			searchItemParamController.nrTabPrecoPedido = modalParams.nrTabPrecoPedido
	
			if(searchItemParamController.searchParams.SoItemTabPrecoPedido == true && searchItemParamController.searchParams.NrTabPre == null){
				searchItemParamController.searchParams.NrTabPre = searchItemParamController.nrTabPrecoPedido;
			}
	
			searchItemParamController.cancel = function() {
				$q.all([userPreference.getPreference('mpd.pd400html.SoItemCli'),
					userPreference.getPreference('mpd.pd400html.ConsideraFamilia'),
					userPreference.getPreference('mpd.pd400html.ConsideraGrupo'),
					userPreference.getPreference('mpd.pd400html.FamilyBusiness'),
					userPreference.getPreference('mpd.pd400html.GroupStocks'),
					userPreference.getPreference('mpd.pd400html.SoItemTabPrecoPedido'),
					userPreference.getPreference('mpd.pd400html.NrTabPre')]).then(function(data) {
	
					searchItemParamController.searchParams.SoItemCli            = data[0].prefValue == 'true';
					searchItemParamController.searchParams.ConsideraFamilia     = data[1].prefValue == 'true';
					searchItemParamController.searchParams.ConsideraGrupo       = data[2].prefValue == 'true';
					searchItemParamController.searchParams.FamilyBusiness       = data[3].prefValue;
					searchItemParamController.searchParams.GroupStocks          = data[4].prefValue;
					searchItemParamController.searchParams.SoItemTabPrecoPedido = data[5].prefValue == 'true';
					searchItemParamController.searchParams.NrTabPre             = data[6].prefValue;
				});                                                                                    
				$modalInstance.dismiss('cancel');                            			
			}
	
			searchItemParamController.close = function() {
				$modalInstance.close({
					searchParams: searchItemParamController.searchParams
				});
			}
			
			searchItemParamController.confirm = function() {
				
				$q.all([userPreference.setPreference('mpd.pd400html.SoItemCli', searchItemParamController.searchParams.SoItemCli),
					userPreference.setPreference('mpd.pd400html.ConsideraFamilia', searchItemParamController.searchParams.ConsideraFamilia),
					userPreference.setPreference('mpd.pd400html.ConsideraGrupo', searchItemParamController.searchParams.ConsideraGrupo),
					userPreference.setPreference('mpd.pd400html.FamilyBusiness', searchItemParamController.searchParams.FamilyBusiness),
					userPreference.setPreference('mpd.pd400html.GroupStocks', searchItemParamController.searchParams.GroupStocks),
					userPreference.setPreference('mpd.pd400html.SoItemTabPrecoPedido', searchItemParamController.searchParams.SoItemTabPrecoPedido),
					userPreference.setPreference('mpd.pd400html.NrTabPre', searchItemParamController.searchParams.NrTabPre)]).then(function() {
					$modalInstance.close({
						searchParams: searchItemParamController.searchParams
					});
				});
			};
			
			searchItemParamController.changeOnlyOrderPriceTable = function(){
				if(searchItemParamController.searchParams.SoItemTabPrecoPedido == true){
					searchItemParamController.searchParams.NrTabPre = searchItemParamController.nrTabPrecoPedido; 
				}
			}
			
		}
	
		index.register.controller('salesorder.pd4000SearchItemParam.Controller', searchItemParamController);
	
	});
	
	