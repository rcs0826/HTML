/* global TOTVSEvent, angular*/
define(['index'], function(index) {
	
		searchQuotationItemcontroller.$inject = [
			'mpd.fchdis0051.Factory',
			'mpd.fchdis0067.Factory',
			'customization.generic.Factory',
			'$scope',
			'$timeout',
			'$modal',
			'$filter',
			'userPreference',
			'$q',
			'$rootScope',
			'TOTVSEvent',
			'$http'];
	
		function searchQuotationItemcontroller(
				fchdis0051,
				fchdis0067,
				customService,
				$scope,
				$timeout,
				$modal,
				$filter,
				userPreference,
				$q,
				$rootScope,
				TOTVSEvent,
				$http) {
	
			var searchController = this;

			$scope.$on("salesorder.portal.editableprice", function (event,data) {
				searchController.editablePrice = $scope.quotationController.editablePrice;
			});
	
			var number = $filter('number');
			var i18n = $filter('i18n');
			
			searchController.quotationController = $scope.quotationController;
	
			searchController.nrPedido = $scope.quotationController.order['nr-pedido'];

			searchController.isRepresentative = $scope.quotationController.isRepresentative;
			searchController.isCustomer = $scope.quotationController.isCustomer
			searchController.pesquisaVisibleFields = $scope.quotationController.pesquisaVisibleFields;
			searchController.editablePrice = $scope.quotationController.editablePrice;
			

			searchController.listResult = [];
	
			searchController.quickSearchText = '';
			searchController.simpleSearchType = 1;	

			userPreference.getPreference('salesorder.portal.simpleSearchType').then(function(data) {
				if(data.prefValue){
					searchController.simpleSearchType = data.prefValue;
				}	
			});

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
				$q.all([userPreference.getPreference('salesorder.portal.SoItemCli'),
					userPreference.getPreference('salesorder.portal.ConsideraFamilia'),
					userPreference.getPreference('salesorder.portal.ConsideraGrupo'),
					userPreference.getPreference('salesorder.portal.FamilyBusiness'),
					userPreference.getPreference('salesorder.portal.GroupStocks'),
					userPreference.getPreference('salesorder.portal.SoItemTabPrecoPedido'),
					userPreference.getPreference('salesorder.portal.NrTabPre')]).then(function(data) {
	
					searchController.searchParams.SoItemCli = data[0].prefValue == 'true';
					searchController.searchParams.ConsideraFamilia = data[1].prefValue == 'true';
					searchController.searchParams.ConsideraGrupo = data[2].prefValue == 'true';
					searchController.searchParams.FamilyBusiness = data[3].prefValue;
					searchController.searchParams.GroupStocks = data[4].prefValue;
					searchController.searchParams.SoItemTabPrecoPedido = data[5].prefValue == 'true';
	
					if(searchController.searchParams.SoItemTabPrecoPedido) {
						searchController.searchParams.NrTabPre = searchItemParamController.nrTabPrecoPedido;
					} else {
						searchController.searchParams.NrTabPre = data[6].prefValue;
					}
				});
			});
	
			$scope.$on("salesorder.portal.selectview", function (event,data) {
				if (data == 'searchAllItems') {
					$timeout(function() {
						angular.element('input[ng-model="searchController.quickSearchText"]').focus();
					}, 100);
				}
			});
			
			searchController.showEdit = function(column) {
	
				if (column == 'it-codigo') return false;
				if (column == 'desc-item') return false;
				if (column == 'cod-refer') return false;
				if (column == 'qtd-disponivel') return false;
				if (column == 'qt-pedida') return false;
				if (column == 'cod-un') return false;
				if (column == 'vl-preori-un-fat') return false;
				if (column == 'codigo-refer') return false;

				if (column == 'vl-preori') {
					if(searchController.editablePrice){
						return true;
					}else{
						return false;
					}
				} 
	
				for (var index = 0; index < searchController.pesquisaVisibleFields.length; index++) {
					var element = searchController.pesquisaVisibleFields[index];
					if (element.fieldName == column && element.fieldEnabled) return true;                
				}
				return false;
			}
			
			searchController.customItemsGrid = function(){
				customService.callCustomEvent('portalItemsGrid', {searchController: searchController});
			};

			searchController.itemsGridEdit = function(event, column) {
	
				$timeout(function () {
					var inputs = $(event.container).find("input:focus:text");
					if (inputs.length > 0) inputs[0].setSelectionRange(0,999);
				},50);
	
				// campos que sempre habilitam a edição
				if (column.column == "qt-un-fat")
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
				if (column.column == "vl-preori" && searchController.editablePrice)
					return;
 				searchController.searchItemsGrid.closeCell();
           			searchController.searchItemsGrid.table.focus();
	
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
					template: "<span>#: data.id #</span>",
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
				var ttOrderParameters = $scope.quotationController.orderParameters;
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
	
					$timeout(function() {
						fchdis0067.startAddItem({
							nrPedido: searchController.nrPedido,
							itemCode: original['it-codigo'],
							field: column.column
						}, {
							ttOrderItemSearch: ttOrderItemSearch,
							ttOrderParameters: ttOrderParameters
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
					});
					}, 250);
	
				} else {
					if (column.column == "qt-un-fat" ||
							column.column == "des-un-medida" ||
							column.column == "log-usa-tabela-desconto" ||
							column.column == "nr-tabpre" ||
							column.column == "vl-preori" ||
							column.column == "ct-codigo" ||
							column.column == "nat-operacao" ||
							column.column == "estab-atend-item" ||
							column.column == "cod-entrega" ||
							column.column == "dt-entrega") {
						
						fchdis0067.leaveOrderItem({
							nrPedido: searchController.nrPedido,
							nrSeq: original['nr-sequencia'],
							itemCode: original['it-codigo'],
							fieldname: column.column,
							action: "Add"
						}, {
							ttOrderItemPortalScreen: [ttOrderItemSearch],
							ttOrderParameters: ttOrderParameters
						}, function(result) {
							customService.callCustomEvent("leaveOrderItemSearch", {
								controller: searchController,
								result: result
							});
	
							var obj = result.ttOrderItemPortalScreen[0];
							for (var key in obj) {
								if (event.model.hasOwnProperty(key) && event.model[key] != obj[key]) {
									event.model.set("[\"" + key + "\"]", obj[key]);
									searchController.listResult[currentIndex][key] = obj[key];
								}
							}
						});
					}
				}
			}

        searchController.addItens = function (gotoitems) {
            var ttOrderParameters = $scope.quotationController.orderParameters;

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
                    $rootScope.$broadcast(TOTVSEvent.showNotification, [{ type: 'warning', title: i18n('l-items-qtd'), detail: i18n('l-set-quantity-to-add-items') }]);
                }
            } else {
                $rootScope.$broadcast(TOTVSEvent.showNotification, [{ type: 'warning', title: i18n('l-items-qtd'), detail: i18n('l-perfom-search-quotation') }]);
			}

	    	searchController.customLoading = false;

            if (searchController.itensToAdd.length) {

                $timeout(function () {

                    fchdis0067.validateOrderItem(
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
                                    fchdis0067.addOrderItem({
                                        nrPedido: searchController.nrPedido
                                    }, {
				    		ttOrderItemSearch: resultitems.ttOrderItemSearch,
				    		ttOrderParameters: ttOrderParameters,
                                        }, function (result) {
                                            customService.callCustomEvent("addOrderItem", {
                                                controller: searchController,
                                                result: result
                                            });
											
											$scope.$emit("salesorder.portal.calculaterequired", true);
											
                                            searchController.reloadItems(gotoitems);
                                            
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

			$scope.$emit("salesorder.portal.loaditems", gotoitems);

			if(!gotoitems){
                searchController.setFocusItem();
				$rootScope.$broadcast(TOTVSEvent.showNotification, [{type: 'info', title: i18n('l-cod-item') , detail: i18n('l-added-to-quotation') }]);
			}
        };
        
        searchController.setFocusItem = function() {
            var searchItemEl = document.getElementById('searchitemField');
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
                nrTabPre = $scope.quotationController.order['nr-tabpre'];  
            }else{
                nrTabPre = searchController.searchParams.NrTabPre;
			}
			
			searchController.editablePrice = $scope.quotationController.editablePrice;

            var codEstabel = $scope.quotationController.order['cod-estabel'];
            var params = angular.extend(
					{},
					
					//TODO - Adicionar aqui o novo parametro tipo de pesquisa: simpleSearchType
                    searchController.searchParams,
                    {
						nrPedido: searchController.nrPedido,
						SimpleSearchType: searchController.simpleSearchType,
                        SearchTerm: "*" + searchController.quickSearchText + "*",
                        NrTabPre: nrTabPre,
                        CodEstab: codEstabel,
						Start: searchController.listResult.length,
						searchType: 1,
						shoppingPeriod: 0
                    }
            );

            fchdis0067.searchproducts(
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
								$rootScope.$broadcast(TOTVSEvent.showNotification, [{type: 'warning', title: i18n('l-search-with-results'), detail: i18n('l-search-term')}]);
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
					templateUrl: '/dts/mpd/html/quotation/itemSearch.params.html',
					controller: 'salesorder.quotation.searchItemParam.Controller as searchItemParamController',
					size: 'lg',
					resolve: {
						modalParams: function() {
							return {
								isRepresentative: searchController.isRepresentative,
								searchParams: searchController.searchParams,
								nrTabPrecoPedido: $scope.quotationController.order['nr-tabpre'] 
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
				var itemdeposito = searchController.quotationController.ttItemEstoqueDeposito;
	
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
					ttItemEstoqueParam: searchController.quotationController.ttItemEstoqueParam || []
				}, function(data) {
	
					var modalInstance = $modal.open({
						templateUrl: '/dts/mpd/html/quotation/itemSearch.stock.html',
						controller: 'salesorder.itemsearch.stock.Controller as modalStockController',
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
						searchController.quotationController.ttItemEstoqueDeposito = data.ttItemEstoqueDeposito;
						searchController.quotationController.ttItemEstoqueParam = data.ttItemEstoqueParam;
					});
				});
			}


			searchController.setPreference = function(name, value) {
				userPreference.setPreference(name, value);
			}

		}
		index.register.controller('salesorder.quotation.searchItems.Controller', searchQuotationItemcontroller);
	
	
		searchItemParamController.$inject = ['modalParams', '$modalInstance', 'userPreference', '$q', '$rootScope', '$scope'];
	
		function searchItemParamController(modalParams, $modalInstance, userPreference, $q, $rootScope, $scope) {
	
			var searchItemParamController = this;

			searchItemParamController.isRepresentative = modalParams.isRepresentative;
	
			searchItemParamController.searchParams = modalParams.searchParams;
			searchItemParamController.nrTabPrecoPedido = modalParams.nrTabPrecoPedido;
	
			if(searchItemParamController.searchParams.SoItemTabPrecoPedido == true && searchItemParamController.searchParams.NrTabPre == null){
				searchItemParamController.searchParams.NrTabPre = searchItemParamController.nrTabPrecoPedido;
			}
	
			searchItemParamController.cancel = function() {
				$q.all([userPreference.getPreference('salesorder.portal.SoItemCli'),
					userPreference.getPreference('salesorder.portal.ConsideraFamilia'),
					userPreference.getPreference('salesorder.portal.ConsideraGrupo'),
					userPreference.getPreference('salesorder.portal.FamilyBusiness'),
					userPreference.getPreference('salesorder.portal.GroupStocks'),
					userPreference.getPreference('salesorder.portal.SoItemTabPrecoPedido'),
					userPreference.getPreference('salesorder.portal.NrTabPre')]).then(function(data) {
	
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
				
				$q.all([userPreference.setPreference('salesorder.portal.SoItemCli', searchItemParamController.searchParams.SoItemCli),
					userPreference.setPreference('salesorder.portal.ConsideraFamilia', searchItemParamController.searchParams.ConsideraFamilia),
					userPreference.setPreference('salesorder.portal.ConsideraGrupo', searchItemParamController.searchParams.ConsideraGrupo),
					userPreference.setPreference('salesorder.portal.FamilyBusiness', searchItemParamController.searchParams.FamilyBusiness),
					userPreference.setPreference('salesorder.portal.GroupStocks', searchItemParamController.searchParams.GroupStocks),
					userPreference.setPreference('salesorder.portal.SoItemTabPrecoPedido', searchItemParamController.searchParams.SoItemTabPrecoPedido),
					userPreference.setPreference('salesorder.portal.NrTabPre', searchItemParamController.searchParams.NrTabPre)]).then(function() {
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

		index.register.controller('salesorder.quotation.searchItemParam.Controller', searchItemParamController);
	});