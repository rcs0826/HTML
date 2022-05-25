define(['index'], function(index) {
	orderitemsgridcontroller.$inject = [
		'$rootScope',
		'$scope',
		'$stateParams',
		'$modal',
		'$timeout',
		'customization.generic.Factory',
		'mpd.fchdis0051.Factory',
		'mcf.pendingproduct.informConfiguration.modal',
		'dts-utils.message.Service',
        'TOTVSEvent',
		'order.itemconfig.narrative.modal'
	];

	function orderitemsgridcontroller(
		$rootScope,
		$scope,
		$stateParams,
		$modal,
		$timeout,
		customService,
		fchdis0051,
		modalInformConfiguration,
		messageUtils,
		TOTVSEvent,
		modalItemConfigNarrative
	) {
		var itemsGridController = this;

		itemsGridController.orderId = $stateParams.orderId;
		itemsGridController.itemsGridSelectedItems = [];
		itemsGridController.itemsGridSelectedItem;
		itemsGridController.itemGridDirtyItems = [];
		itemsGridController.inlineEditActive = false;
		itemsGridController.disableBtnSave = false;

		$scope.$on("salesorder.pd4000.selectview", function (event,data) {
			if (data == 'pd4000a') {
				$timeout(function() {
					itemsGridController.itemsGrid.table.focus();
				}, 100);				
            }
		});

		// Posiciona o cursor no último registro do grid de itens
		$scope.$on("salesorder.pd4000.scrollGrid", function (event,data) {
			console.log("salesorder.pd4000.scrollGrid");
			
			var grids = $(".k-grid-content"),
				index = 0,
				grid;
			
			for (; index < grids.length; index++) {
				grid = grids[index];
				grid.scrollTop = grid.scrollHeight;
			}			
		});

		$scope.$on("salesorder.pd4000.hotkey.inlineEdit", function (event,data) {
			itemsGridController.inlineEdit();
			itemsGridController.itemsGrid.table.focus();			
		});		

		$scope.$on("salesorder.pd4000.hotkey.inlineEditSave", function (event,data) {
			itemsGridController.itemsGrid.table.focus();
			
			$timeout(function() {
				itemsGridController.inlineEditSave();
			}, 150);							
		});
		
		$scope.$on("salesorder.pd4000.hotkey.inlineEditCancel", function (event,data) {
            itemsGridController.inlineEditCancel();
        });
		$scope.$on("salesorder.pd4000.changeparameters", function (event,data) {
			itemsGridController.orderParameters = $scope.orderController.orderParameters;
		});

		$scope.$on("salesorder.pd4000.loadorder", function (event,data) {
			if (data != "pd4000a") {
				// busca os dados do controller principal
				itemsGridController.order = $scope.orderController.order;
				itemsGridController.orderDisabled = $scope.orderController.orderDisabled;
				itemsGridController.orderItens = $scope.orderController.orderItens;
				itemsGridController.integrationAccountInit = $scope.orderController.integrationAccountInit;
				itemsGridController.costCenterInit = $scope.orderController.costCenterInit;
				itemsGridController.orderParameters = $scope.orderController.orderParameters;
				itemsGridController.permissions = $scope.orderController.permissions;

				itemsGridController.orderItensNoChild = [];

				itemsGridController.orderItensWithChild = [];

				itemsGridController.showChild = true;

				for (var i = 0; i < itemsGridController.orderItens.length; i++) {

					// copia para utilizar no cancelamento do grid editavel
					var item = angular.copy(itemsGridController.orderItens[i])

					itemsGridController.orderItensWithChild.push(item);
					if (itemsGridController.orderItens[i]['ind-componen'] != 3) {
						itemsGridController.orderItensNoChild.push(item);
					}
				}
			}
		})

		$timeout(function () {
			itemsGridController.itemsGrid.content.dblclick(function () {
				if (!itemsGridController.inlineEditActive) {
					itemsGridController.inlineEditActive = true;
					itemsGridController.itemsGrid.editCell(itemsGridController.itemsGrid.current());
				}
			});
		});
		
		itemsGridController.customItemsGrid = function() {
			customService.callCustomEvent('pd4000aItemsGrid', {itemsGridController: itemsGridController});
		}

		itemsGridController.setQuickFilterShowChildren = function() {

			if (itemsGridController.showChild) {
				itemsGridController.orderItens = angular.copy(itemsGridController.orderItensWithChild);
			} else {
				itemsGridController.orderItens = angular.copy(itemsGridController.orderItensNoChild);
			}
		};

		itemsGridController.inlineEdit = function () {
            
            if(!itemsGridController.inlineEditActive){
                angular.forEach(itemsGridController.orderItens, function(item,key){
                    if(item['showWarning'] == true){
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                           title: $rootScope.i18n('l-warning'),
                           detail: $rootScope.i18n('l-the-item') + item['it-codigo'] + $rootScope.i18n('l-msg-fat-antecip')
                        });
                    }
                });
            }
            
			itemsGridController.inlineEditActive = !itemsGridController.inlineEditActive;
		}

		itemsGridController.inlineEditSave = function () {

			var ttOrderParameters = itemsGridController.orderParameters;

			itemsGridController.inlineEditActive = false;
			fchdis0051.saveOrderItems({
				nrPedido: itemsGridController.orderId
			}, {
				ttOrderItemPD4000: itemsGridController.itemGridDirtyItems,
				ttOrderParameters: ttOrderParameters
			}, function(result) {
				customService.callCustomEvent("saveOrderItems", {
					controller:itemsGridController,
					result: result
				});

				$scope.$emit("salesorder.pd4000.loadorder","pd4000a");
			});
		}

		itemsGridController.inlineEditCancel = function () {
			itemsGridController.inlineEditActive = false;
			itemsGridController.itemsGrid.cancelChanges();
			itemsGridController.setQuickFilterShowChildren();
		}

        itemsGridController.showEdit = function(column) {

			if (itemsGridController.inlineEditActive == false) return false;

            if (column == 'nr-sequencia') return false;
            if (column == 'it-codigo') return false;
            if (column == 'desc-item') return false;
            if (column == 'cod-refer') return false;
            if (column == 'cod-sit-item') return false;
            if (column == 'qtd-disponivel') return false;
            if (column == 'qt-pedida') return false;
            if (column == 'cod-un') return false;
            if (column == 'vl-preori-un-fat') return false;
            if (column == 'vl-tot-it') return false;

            if (column == 'classificacao-fiscal') column = 'cod-class-fis';

            for (var index = 0; index < itemsGridController.permissions['ped-item-grid'].length; index++) {
                var element = itemsGridController.permissions['ped-item-grid'][index];
                if (element.fieldName == column && element.fieldEnabled) return true;                
            }
            return false;
        }

		itemsGridController.itemsGridEdit = function (event, column) {

			
			if (itemsGridController.inlineEditActive) {
				$timeout(function () {
					var inputs = $(event.container).find("input:focus:text");
					if (inputs.length > 0) inputs[0].setSelectionRange(0,999);
				},50);
				// campos que sempre habilitam a edição
				if (column.column == "qt-un-fat") return;
				if (column.column == "log-usa-tabela-desconto") return;
				if (column.column == "nr-tabpre") return;
				if (column.column == "val-desconto-inform") return;
				if (column.column == "des-pct-desconto-inform") return;
				if (column.column == "val-pct-desconto-tab-preco") return;
				if (column.column == "nat-operacao") return;
				if (column.column == "tipo-atend") return;
				if (column.column == "cod-entrega") return;
				if (column.column == "dt-entrega") return;
				if (column.column == "ind-fat-qtfam-aux") return;
				if (column.column == "estab-atend-item") return;

				// campos que validam uma regra
				var ttOrderItemPD4000 = event.model;
				if (column.column == "des-un-medida" && ttOrderItemPD4000.measureUnit) return;
				if (column.column == "ct-codigo" && ttOrderItemPD4000.account) return;
				if (column.column == "sc-codigo" && ttOrderItemPD4000.account) return;
				if (column.column == "custo-contabil" && ttOrderItemPD4000.costAccount) return;
				if (column.column == "classificacao-fiscal" && ttOrderItemPD4000.classFis) return;
				if (column.column == "vl-preori" && ttOrderItemPD4000.originalPrice) return;
			}

            var scrollTop = itemsGridController.itemsGrid.content[0].scrollTop;
            var scrollLeft = itemsGridController.itemsGrid.content[0].scrollLeft;

			itemsGridController.itemsGrid.closeCell();
			itemsGridController.itemsGrid.table.focus();

			itemsGridController.itemsGrid.content[0].scrollTop = scrollTop;
            itemsGridController.itemsGrid.content[0].scrollLeft =  scrollLeft;

		}

		itemsGridController.itemsGridSave = function (event, column, value, original, currentIndex) {

			if (original[column.column] != undefined &&
				value != undefined &&
				original[column.column].toString().toUpperCase() === value.toString().toUpperCase()) {
				return;
			}

			var scrollTop = itemsGridController.itemsGrid.content[0].scrollTop;
			var scrollLeft = itemsGridController.itemsGrid.content[0].scrollLeft;

			var index = event.container.index();
			var ttOrderParameters = itemsGridController.orderParameters;
			var ttOrderItemPD4000 = original;
			ttOrderItemPD4000[column.column] = value;

			var selectCell = function () {
				// seleciona a linha do grid
				var items = itemsGridController.itemsGrid.items();
				var selected = [];
				items.each(function (idx, row) {
					obj = itemsGridController.itemsGrid.dataItem(row);
					if (obj == event.model) {
						selected.push(row);
					}
				});
				itemsGridController.itemsGrid.select(selected);
				itemsGridController.itemsGrid.current($(selected).find("td").eq(index));
				itemsGridController.itemsGrid.table.focus();
				itemsGridController.itemsGrid.content[0].scrollTop = scrollTop;
				itemsGridController.itemsGrid.content[0].scrollLeft = scrollLeft;

			}

			if (column.column == "qt-un-fat"                ||
				column.column == "des-un-medida"            ||
				column.column == "log-usa-tabela-desconto"  ||
				column.column == "nr-tabpre"                ||
				//column.column == "vl-preori"                ||
				column.column == "ct-codigo"                ||
				//column.column == "sc-codigo"                ||
				column.column == "nat-operacao"             ||
				column.column == "estab-atend-item"         ||
				column.column == "cod-entrega"              ||
				column.column == "dt-entrega") {
				// fecha o editor antes de chamar para evitar iteração do usuário
				//itemsGridController.itemsGrid.closeCell();
				//itemsGridController.itemsGrid.table.focus();
				$timeout(selectCell, 0);

				// aguardar retorno do changeItem para liberar
				itemsGridController.disableBtnSave = true;

				fchdis0051.leaveOrderItem({
					nrPedido: itemsGridController.orderId,
					nrSeq: original['nr-sequencia'],
					itemCode: original['it-codigo'],
					itemRef: original['cod-refer'],
					fieldname: column.column,
					action: "Update"
				}, {
					ttOrderItemPD4000: [ttOrderItemPD4000],
					ttOrderParameters: ttOrderParameters
				}, function(result) {

				itemsGridController.disableBtnSave = false;

					customService.callCustomEvent("leaveOrderItemGrid", {
						controller:itemsGridController,
						result: result
					});

					var obj = result.ttOrderItemPD4000[0];
					for (var key in obj) {
						if (event.model.hasOwnProperty(key) && event.model[key] != obj[key]) {
							event.model.set("[\"" + key + "\"]",obj[key]);
						}
					}
					selectCell();
				});
			}
		}


		itemsGridController.openCancelModal = function() {
			var params = {};

			var selectitems = itemsGridController.itemsGridSelectedItems;

			if (selectitems.length < 1) return;

			var params = {
				tipo: "item",
				nrPedido: itemsGridController.orderId,
				ttOrderItemsSelected: []
			};

			for (var i = 0; i < selectitems.length; i++) {
				var item = selectitems[i];
                
                if(item['showWarning'] == true){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
					   title: $rootScope.i18n('l-warning'),
					   detail: $rootScope.i18n('l-the-item') + item['it-codigo'] + $rootScope.i18n('l-msg-fat-antecip')
					});
                }
                
				params.ttOrderItemsSelected.push({
					'nr-sequencia': item['nr-sequencia'],
					'it-codigo': item['it-codigo'],
					'cod-refer': item['cod-refer'],
				});
			}


			var modalInstance = $modal.open({
			  templateUrl: '/dts/mpd/html/pd4000/pd4000.cancel.html',
			  controller: 'salesorder.pd4000Cancel.Controller as modalCancelcontroller',
			  size: 'lg',
			  resolve: {
				modalParams: function() {
					return params;
				}
			  }
			});

			modalInstance.result.then(function () {
				$scope.$emit("salesorder.pd4000.loadorder","pd4000a");
			});
		};

		itemsGridController.openItemModal = function() {
			var item = itemsGridController.itemsGridSelectedItem;
            
            if(item['showWarning'] == true){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                   title: $rootScope.i18n('l-warning'),
                   detail: $rootScope.i18n('l-the-item') + item['it-codigo'] + $rootScope.i18n('l-msg-fat-antecip')
                });
            }
            
			var modalInstance = $modal.open({
			  templateUrl: '/dts/mpd/html/pd4000/pd4000.item.html',
			  controller: 'salesorder.pd4000Item.Controller as itemController',
			  size: 'lg',
			  backdrop: 'static',
			  resolve: {
				modalParams: function() {
					return {
					   operation: itemsGridController.orderDisabled ? 'show' : 'edit',
					   ttOrderParameters: itemsGridController.orderParameters,
					   permissions: itemsGridController.permissions,
					   situacao: item['cod-sit-item'],
					   'nr-sequencia': item['nr-sequencia'],
					   'it-codigo': item['it-codigo'],
					   'cod-refer': item['cod-refer'],
					   item: item,
					   orderController: $scope.orderController,
					   order: itemsGridController.order,
					   costCenterInit: itemsGridController.costCenterInit,
					   integrationAccountInit: itemsGridController.integrationAccountInit
					};
				}
			  }
			});

			modalInstance.result.then(function () {
				$scope.$emit("salesorder.pd4000.loadorder","pd4000a");
			});

		};

		itemsGridController.openAddItemModal = function() {
			var item = itemsGridController.itemsGridSelectedItem;
			var modalInstance = $modal.open({
			  templateUrl: '/dts/mpd/html/pd4000/pd4000.item.html',
			  controller: 'salesorder.pd4000Item.Controller as itemController',
			  size: 'lg',
			  backdrop: 'static',
			  resolve: {
				modalParams: function() {
					return {
					   ttOrderParameters: itemsGridController.orderParameters,
					   permissions: itemsGridController.permissions,
					   operation: 'add',
					   orderController: $scope.orderController,
					   order: itemsGridController.order,
					   costCenterInit: itemsGridController.costCenterInit,
					   integrationAccountInit: itemsGridController.integrationAccountInit
					};
				}
			  }
			});

			modalInstance.result.then(function () {
				$scope.$emit("salesorder.pd4000.loadorder","pd4000a");
			},function () {
				$scope.$emit("salesorder.pd4000.loadorder","pd4000a");
			});

		};

		itemsGridController.fastAddItemModal = function() {
			var item = itemsGridController.itemsGridSelectedItem;
			var modalInstance = $modal.open({
			  templateUrl: '/dts/mpd/html/pd4000/pd4000.item.html',
			  controller: 'salesorder.pd4000Item.Controller as itemController',
			  size: 'lg',
			  backdrop: 'static',
			  resolve: {
				modalParams: function() {
					return {
					   ttOrderParameters: itemsGridController.orderParameters,
					   permissions: itemsGridController.permissions,
					   operation: 'fastadd',
					   orderController: $scope.orderController,
					   order: itemsGridController.order,
					   costCenterInit: itemsGridController.costCenterInit,
					   integrationAccountInit: itemsGridController.integrationAccountInit
					};
				}
			  }
			});

			modalInstance.result.then(function () {
				$scope.$emit("salesorder.pd4000.loadorder","pd4000a");
			},function () {
				$scope.$emit("salesorder.pd4000.loadorder","pd4000a");
			});

		};

		itemsGridController.openAddChildItemModal = function() {
			var item = itemsGridController.itemsGridSelectedItem;
			var modalInstance = $modal.open({
			  templateUrl: '/dts/mpd/html/pd4000/pd4000.item.html',
			  controller: 'salesorder.pd4000Item.Controller as itemController',
			  size: 'lg',
			  backdrop: 'static',
			  resolve: {
				modalParams: function() {
					return {
					   ttOrderParameters: itemsGridController.orderParameters,
					   permissions: itemsGridController.permissions,
					   operation: 'addchild',
					   orderController: $scope.orderController,
					   'nr-sequencia': item['nr-sequencia'],
					   'it-codigo': item['it-codigo'],
					   'cod-refer': item['cod-refer'],
					   order: itemsGridController.order
					};
				}
			  }
			});

			modalInstance.result.then(function () {
				$scope.$emit("salesorder.pd4000.loadorder","pd4000a");
			},function () {
				$scope.$emit("salesorder.pd4000.loadorder","pd4000a");
			});

		};

		itemsGridController.removeOrderItem = function() {
			var selectitems = itemsGridController.itemsGridSelectedItems;

			if (selectitems.length < 1) return;

			var ttOrderItemsSelected = [];

			for (var i = 0; i < selectitems.length; i++) {
				var item = selectitems[i];
				ttOrderItemsSelected.push({
					'nr-sequencia': item['nr-sequencia'],
					'it-codigo': item['it-codigo'],
					'cod-refer': item['cod-refer'],
				});
			}

			   messageUtils.question( {
				title: 'Remover Item',
				text: $rootScope.i18n('Confirma a eliminação do item?'),
				cancelLabel: 'Não',
				confirmLabel: 'Sim',
                defaultCancel: true,
				callback: function(isPositiveResult) {
					if (isPositiveResult) {
						fchdis0051.deleteOrderItems(
							{
								nrPedido: itemsGridController.orderId
							},
							ttOrderItemsSelected,
							function(result) {
								customService.callCustomEvent("deleteOrderItems", {
									controller:itemsGridController,
									result: result
								});

								$scope.$emit("salesorder.pd4000.loadorder","pd4000a");
							}
						);
					}
				}
			});
		};


		itemsGridController.configProduct = function(item){
			modalInformConfiguration.open({itemCotacao: item['it-codigo'],
										   descItem: item.itemDesc,
										   un: item['cod-un'],
										   nrPedido: itemsGridController.orderId,
										   sequencia: item['nr-sequencia'],
										   nomeAbrev: item['nome-abrev']}).then(function(result){
				if (result.nrEstrut) {
					fchdis0051.addOrderItemConfigured({nrEstrut: result.nrEstrut}, item, function(result) {
						if (!result.$hasError) $scope.$emit("salesorder.pd4000.loadorder","pd4000a");
					});
				}
			});
		 };

		 this.openConfigNarrative = function(itCodigo, codRefer) {
			modalItemConfigNarrative.open({
				itCodigo: itCodigo,
				codRefer: codRefer
			});			
		}
	}
	index.register.controller('salesorder.pd4000ItemsGrid.Controller', orderitemsgridcontroller);

});
