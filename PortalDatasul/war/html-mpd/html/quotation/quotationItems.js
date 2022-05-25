/* global angular*/
define(['index'], function(index) {

	orderitemsgridportalcontroller.$inject = [
		'$rootScope',
		'$scope',
		'$modal',
		'$timeout',
		'customization.generic.Factory',
		'mpd.fchdis0067.Factory',
		'mcf.pendingproduct.informConfiguration.modal',
		'dts-utils.message.Service',
		'TOTVSEvent',
		'dts-utils.Resize.Service',
		'$location',
		'userPreference',
		'$q',
		'itemconfig.narrative.modal'];

	function orderitemsgridportalcontroller(
			$rootScope,
			$scope,
			$modal,
			$timeout,
			customService,
			fchdis0067,
			modalInformConfiguration,
			messageUtils,
			TOTVSEvent,
			resizeService,
			$location,
			userPreference,
			$q,
			modalItemConfigNarrative) {

		var itemsGridController = this;

		itemsGridController.itemsGridSelectedItems = [];
		itemsGridController.itemsGridSelectedItem;
		itemsGridController.itemGridDirtyItems = [];
		itemsGridController.inlineEditActive = false;
		itemsGridController.userPreferenceLoaded = false;

		itemsGridController.order = $scope.quotationController.order;
		itemsGridController.orderId = $scope.quotationController.order['nr-pedido']
		itemsGridController.orderItens = $scope.quotationController.orderItens;

		$scope.$on("salesorder.portal.loadorder", function (event,data) {

			if (data != "orderItems") {
				// busca os dados do controller principal
				itemsGridController.order = $scope.quotationController.order;
				itemsGridController.orderId = $scope.quotationController.order['nr-pedido']
				itemsGridController.orderItens = $scope.quotationController.orderItens;
				itemsGridController.visibleFields = $scope.quotationController.pedItemListaVisibleFields;
				itemsGridController.orderDisabled = $scope.quotationController.orderDisabled;
				itemsGridController.editablePrice = $scope.quotationController.editablePrice;
				itemsGridController.itemCadastroVisibleFields = $scope.quotationController.itemCadastroVisibleFields;


				itemsGridController.orderItensNoChild = [];

				itemsGridController.orderItensWithChild = [];

				itemsGridController.showChild = false;
				itemsGridController.userPreferenceLoaded = false;

				userPreference.getPreference('mpd.quotation.showChild').then(function(results) {

					itemsGridController.userPreferenceLoaded = true;

					if(results.prefValue) {
						if(results.prefValue === 'true') {
							itemsGridController.showChild = true;
						} else {
							itemsGridController.showChild = false;
						}
					};

					for (var i = 0; i < itemsGridController.orderItens.length; i++) {

						// copia para utilizar no cancelamento do grid editavel
						var item = angular.copy(itemsGridController.orderItens[i])
	
						itemsGridController.orderItensWithChild.push(item);
						if (itemsGridController.orderItens[i]['ind-componen'] != 3) {
							itemsGridController.orderItensNoChild.push(item);
						}
					}

					itemsGridController.setQuickFilterShowChildren();
					
					resizeService.doResize();
				});
			}
			
		})


		$scope.$watch('itemsGridController.itemsGridSelectedItems', function(newValue, oldValue) {

			if(newValue.length != oldValue.length) {

				itemsGridController.showCancelButtom = false;

				for (var index = 0; index < newValue.length; index++) {
					if(newValue[index]['cod-sit-item'] != 6){
						itemsGridController.showCancelButtom = true;
					}
				}
			}else{
				itemsGridController.showCancelButtom = true;
			}

		});

		$timeout(function () {
			itemsGridController.itemsGrid.content.dblclick(function () {
				if (!itemsGridController.inlineEditActive && itemsGridController.orderDisabled != true) {
					itemsGridController.inlineEditActive = true;
					itemsGridController.itemsGrid.editCell(itemsGridController.itemsGrid.current());
				}
			});
		});
		
		itemsGridController.customItemsGrid = function() {
			customService.callCustomEvent('orderitems.portal.newItemsGrid', {itemsGridController: itemsGridController});
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

			var ttOrderParameters = [];

			itemsGridController.inlineEditActive = false;
			fchdis0067.saveOrderItems({
				nrPedido: itemsGridController.orderId
			}, {
				ttOrderParameters: ttOrderParameters,
				ttOrderItemPortalScreen: itemsGridController.itemGridDirtyItems
			}, function(result) {
				customService.callCustomEvent("saveOrderItems", {
					controller:itemsGridController,
					result: result
				});

				$scope.$emit("salesorder.portal.calculaterequired", true);
				$scope.$emit("salesorder.portal.loadorder","orderItems");
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
            if (column == 'descItem') return false;
            if (column == 'cod-refer') return false;
            if (column == 'cod-sit-item') return false;
            if (column == 'qtd-disponivel') return false;
            if (column == 'qt-pedida') return false;
            if (column == 'cod-un') return false;
            if (column == 'vl-preori-un-fat') return false;
			if (column == 'vl-tot-it') return false;
			
			if (column == 'vl-preori') {
				if(itemsGridController.editablePrice){
					return true;
				}else{
					return false;
				}
			} 

            if (column == 'classificacao-fiscal') column = 'cod-class-fis';

			for (var index = 0; index < itemsGridController.visibleFields.length; index++) {
				var element = itemsGridController.visibleFields[index];
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
				var ttOrderItem = event.model;
				if (column.column == "des-un-medida" && ttOrderItem.measureUnit) return;
				if (column.column == "ct-codigo" && ttOrderItem.account) return;
				if (column.column == "sc-codigo" && ttOrderItem.account) return;
				if (column.column == "custo-contabil" && ttOrderItem.costAccount) return;
				if (column.column == "classificacao-fiscal" && ttOrderItem.classFis) return;
				if (column.column == "vl-preori" && itemsGridController.editablePrice) return;
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
			var ttOrderParameters = [];
			var ttOrderItemPortalScreen = original;
			ttOrderItemPortalScreen[column.column] = value;

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
				column.column == "ct-codigo"                ||
				column.column == "nat-operacao"             ||
				column.column == "estab-atend-item"         ||
				column.column == "cod-entrega"              ||
				column.column == "dt-entrega") {
				// fecha o editor antes de chamar para evitar iteração do usuário
				itemsGridController.itemsGrid.closeCell();
				$timeout(selectCell, 0);

				var leaveName = angular.copy(column.column);

				if(column.column == "nr-tabpre") {
					leaveName = "des-un-medida";
				}

				fchdis0067.leaveOrderItem({
					nrPedido: itemsGridController.orderId,
					nrSeq: original['nr-sequencia'],
					itemCode: original['it-codigo'],
					itemRef: original['cod-refer'],
					fieldname: leaveName,
					action: "Update"
				}, {
					ttOrderParameters: ttOrderParameters,
					ttOrderItemPortalScreen: [ttOrderItemPortalScreen]
				}, function(result) {
					customService.callCustomEvent("leaveOrderItemGrid", {
						controller:itemsGridController,
						result: result
					});

					var obj = result.ttOrderItemPortalScreen[0];
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
			  templateUrl: '/dts/mpd/html/quotation/quotation.cancel.html',
			  controller: 'salesorder.portalQuotationCancel.Controller as modalCancelcontroller',
			  size: 'lg',
			  resolve: {
				modalParams: function() {
					return params;
				}
			  }
			});

			modalInstance.result.then(function () {
				$scope.$emit("salesorder.portal.calculaterequired", true);
				$scope.$emit("salesorder.portal.loadorder","orderItems");
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
			  templateUrl: '/dts/mpd/html/quotation/quotationItem.html',
			  controller: 'salesorder.quotation.quotationItem.Controller as itemController',
			  size: 'lg',
			  backdrop: 'static',
			  resolve: {
				modalParams: function() {
					return {
					   operation: itemsGridController.orderDisabled ? 'show' : 'edit',
					   ttOrderParameters: itemsGridController.orderParameters,
					   itemCadastroVisibleFields: itemsGridController.itemCadastroVisibleFields,
					   situacao: item['cod-sit-item'],
					   'nr-sequencia': item['nr-sequencia'],
					   'it-codigo': item['it-codigo'],
					   'cod-refer': item['cod-refer'],
					   item: item,
					   quotationController: $scope.quotationController,
					   order: itemsGridController.order,
					   costCenterInit: itemsGridController.costCenterInit,
					   integrationAccountInit: itemsGridController.integrationAccountInit,
					   ttParamBonif: $scope.quotationController.ttParamBonif
					};
				}
			  }
			});

			modalInstance.result.then(function () {
				$scope.$emit("salesorder.portal.loadorder","orderItems");
			});

		};

		itemsGridController.openAddItemModal = function() {
			var item = itemsGridController.itemsGridSelectedItem;
			var modalInstance = $modal.open({
			  templateUrl: '/dts/mpd/html/quotation/quotationItem.html',
			  controller: 'salesorder.quotation.quotationItem.Controller as itemController',
			  size: 'lg',
			  backdrop: 'static',
			  resolve: {
				modalParams: function() {
					return {
					   ttOrderParameters: itemsGridController.orderParameters,
					   itemCadastroVisibleFields: itemsGridController.itemCadastroVisibleFields,
					   operation: 'add',
					   quotationController: $scope.quotationController,
					   order: itemsGridController.order,
					   costCenterInit: itemsGridController.costCenterInit,
					   integrationAccountInit: itemsGridController.integrationAccountInit
					};
				}
			  }
			});

			modalInstance.result.then(function () {
				$scope.$emit("salesorder.portal.loadorder","orderItems");
			},function () {
				$scope.$emit("salesorder.portal.loadorder","orderItems");
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
					   quotationController: $scope.quotationController,
					   order: itemsGridController.order,
					   costCenterInit: itemsGridController.costCenterInit,
					   integrationAccountInit: itemsGridController.integrationAccountInit
					};
				}
			  }
			});

			modalInstance.result.then(function () {
				$scope.$emit("salesorder.portal.loadorder","orderItems");
			},function () {
				$scope.$emit("salesorder.portal.loadorder","orderItems");
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
					   quotationController: $scope.quotationController,
					   'nr-sequencia': item['nr-sequencia'],
					   'it-codigo': item['it-codigo'],
					   'cod-refer': item['cod-refer'],
					   order: itemsGridController.order
					};
				}
			  }
			});

			modalInstance.result.then(function () {
				$scope.$emit("salesorder.portal.loadorder","orderItems");
			},function () {
				$scope.$emit("salesorder.portal.loadorder","orderItems");
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
				text: $rootScope.i18n('l-confirm-remove-item'),
				cancelLabel: $rootScope.i18n('l-no'),
				confirmLabel: $rootScope.i18n('l-yes'),
                defaultCancel: true,
				callback: function(isPositiveResult) {
					if (isPositiveResult) {
						fchdis0067.deleteOrderItems(
							{
								nrPedido: itemsGridController.orderId
							},
							ttOrderItemsSelected,
							function(result) {
								customService.callCustomEvent("deleteOrderItems", {
									controller:itemsGridController,
									result: result
								});

								$scope.$emit("salesorder.portal.calculaterequired", true);
								$scope.$emit("salesorder.portal.loadorder","orderItems");
							}
						);
					}
				}
			});
		};

		itemsGridController.configProduct = function(item){
			modalInformConfiguration.open({itemCotacao: item['it-codigo'],
										   descItem: item['desc-item'],
										   un: item['cod-un'],
										   nrPedido: itemsGridController.orderId,
										   sequencia: item['nr-sequencia'],
										   nomeAbrev: item['nome-abrev']}).then(function(result){

				if (result.nrEstrut) {

					var selfNrEstrut = angular.copy(result.nrEstrut);

					fchdis0067.addOrderItemConfigured({nrEstrut: result.nrEstrut}, item, function(result) {

						if (!result.$hasError){ 							
							messageUtils.question( {
								title: $rootScope.i18n('l-cost-update'),
								text: $rootScope.i18n('msg-cost-update') + item['it-codigo'] + '?',
								cancelLabel: 'l-no',
								confirmLabel: 'l-yes',
								defaultCancel: true,
								callback: function(isPositiveResult) {

									$scope.$emit("salesorder.portal.calculaterequired", true);
									$scope.$emit("salesorder.portal.loadorder","orderItems");

									if (isPositiveResult) {
										itemsGridController.configProductCostVariable(item['it-codigo'], selfNrEstrut);
									}
								}
							});
						}

					});
				}
			});
		};

		itemsGridController.configProductCostVariable = function(itCodigo, codRef) {
			// Para permitir o uso de barra no código do item, é necessário códificar para base64 e que a interface do mcf decodifique quando receber o parâmetro.
			$location.url("/dts/mcf/smartconfiguration/costvariable/" + itCodigo + "/" + codRef + "?from=orderAdd");
		}

		itemsGridController.reopenQuotationItems = function(){

			var selectitems = itemsGridController.itemsGridSelectedItems;
			var itemsToReopen = [];

			if (selectitems.length < 1) return;

			for (var i = 0; i < selectitems.length; i++) {
				var item = selectitems[i];
            
				itemsToReopen.push({
					'nr-sequencia': item['nr-sequencia'],
					'it-codigo': item['it-codigo'],
					'cod-refer': item['cod-refer'],
				});
			}

			fchdis0067.reopenQuotationItems(
				{
					nrPedido: itemsGridController.orderId, 
				}, {
					descMotivo: '',
					ttOrderItemsSelected: itemsToReopen
				}, function(result) {

					if (!result.$hasError){ 
						$scope.$emit("salesorder.portal.calculaterequired", true);
						$scope.$emit("salesorder.portal.loadorder","orderItems");

						customService.callCustomEvent("reopenQuotationItems", {
							controller:itemsGridController,
							result: result 
						});
					}
				}
			);
		}

		itemsGridController.setUserPreferences = function() {
			$q.all([userPreference.setPreference('mpd.quotation.showChild', itemsGridController.showChild)]).then(function() {});
		}

		itemsGridController.openConfigNarrative = function(itCodigo, codRefer) {
			modalItemConfigNarrative.open({
				itCodigo: itCodigo,
				codRefer: codRefer
			});			
		}

	}


	// *************************************************************************************
	// *** MODAL ITEM CONFIG NARRATIVE
	// *************************************************************************************
	modalItemConfigNarrative.$inject = ['$modal'];

	function modalItemConfigNarrative($modal) {
		/* jshint validthis: true */

		/**
		 * Abre a modal de pesquisa avançada
		 * @param  {Object} params Parâmetros que deverão ser passados para o controller da modal
		 * @return {Promise}       Retorna a instância da modal
		 */
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/mpd/html/quotation/itemconfig.narrative.html',
				controller: 'itemconfig.narrative.Controller as controller',
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
	// *** CONTROLLER MODAL ITEM CONFIG NARRATIVE
	// *************************************************************************************
	itemConfigNarrativeModalController.$inject = [
		'$modalInstance',
		'parameters',
		'mpd.cfapi004.Factory',
	];

	function itemConfigNarrativeModalController(
		$modalInstance,
		parameters,
		cfapi004) {

		var vm = this;

		vm.itCodigo = parameters.itCodigo;
		vm.codRefer = parameters.codRefer;

		cfapi004.narrative({itemCotacao: vm.itCodigo, nrEstrut: vm.codRefer}, {}, function(result) {
			vm.narrative = result.narrativa;
		})

		/**
		 * Fecha a modal
		 * @return {}
		 */
		vm.close = function close() {
			$modalInstance.dismiss('cancel');
		};
	}

	index.register.controller('salesorder.quotation.quotationitems.Controller', orderitemsgridportalcontroller);

	index.register.service('itemconfig.narrative.modal', modalItemConfigNarrative);
	index.register.controller('itemconfig.narrative.Controller', itemConfigNarrativeModalController);

});