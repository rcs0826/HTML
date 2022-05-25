/* global TOTVSEvent, angular*/
define(['index'], function(index) {


	deliveryItemsController.$inject = [
		'$scope',
		'$stateParams',
		'$timeout'];

	function deliveryItemsController(
			$scope,
			$stateParams,
			$timeout) {

		var deliveryItemsController = this;

		deliveryItemsController.expandedRows = {};

		deliveryItemsController.orderId = $stateParams.orderId;

		deliveryItemsController.loadData = function () {
			deliveryItemsController.orderItens = $scope.orderController.orderItens;
			$timeout(function () {
				var items = deliveryItemsController.itensGrid.items();
				for (var index = 0; index < items.length; index++) {
					var element = items[index];
					var item = deliveryItemsController.itensGrid.dataItem(element);
					if (deliveryItemsController.expandedRows[item['nr-sequencia']]) {
						deliveryItemsController.itensGrid.expandRow(element);
					}
				}
			});
		};

		deliveryItemsController.gridOptions = {
			detailCollapse: function (e) {
				var item = deliveryItemsController.itensGrid.dataItem(e.masterRow);
				deliveryItemsController.expandedRows[item['nr-sequencia']] = false;
			},
			detailExpand: function (e) {
				var item = deliveryItemsController.itensGrid.dataItem(e.masterRow);
				deliveryItemsController.expandedRows[item['nr-sequencia']] = true;
			}
		}

		$scope.$on("salesorder.pd4000.loadorder", function (event,data) {

			if (data != "pd4000h") {
				// busca os dados do controller principal
				deliveryItemsController.loadData();
			}
		});

		deliveryItemsController.loadData();
	}
	index.register.controller('salesorder.pd4000DeliveryItems.Controller', deliveryItemsController);


	deliveryController.$inject = [
		'$scope',
		'$stateParams',
		'$timeout',
		'$modal',
		'customization.generic.Factory',
		'mpd.fchdis0051.Factory'];

	function deliveryController(
			$scope,
			$stateParams,
			$timeout,
			$modal,
			customService,
			fchdis0051) {

		var deliveryController = this;

		deliveryController.orderId = $stateParams.orderId;

		deliveryController.init = function (data) {
			if (data == undefined) return;
			deliveryController.order = $scope.orderController.order;
			deliveryController.orderDisabled = $scope.orderController.orderDisabled;

			if ($scope.orderController.pd4000['aba-entregas'].fieldEnabled == false) {
				deliveryController.orderDisabled = true;
			}

			deliveryController.ttOrderDelivery = data.ttOrderDelivery;
			deliveryController.original = angular.copy(deliveryController.ttOrderDelivery);
		};

		deliveryController.canDelete = function () {
			var grid = deliveryController.deliveryItemsGrid;
			if (grid) {
				var ttOrderDelivery = grid.dataSource.data();
				if (deliveryController.deliveryItemsGridSelectedItems &&
					deliveryController.deliveryItemsGridSelectedItems.length > 0 &&
					deliveryController.deliveryItemsGridSelectedItems.length < ttOrderDelivery.length) return true;
			}
			return false;
		}

		deliveryController.canEdit = function () {

			return deliveryController.ordem != 2 && !deliveryController.orderDisabled && deliveryController.order && deliveryController.order['esp-ped'] != 1;
		}

		deliveryController.horaTemplate = function  (dataItem) { 
			var val = dataItem['hr-entrega'];
			val = val.replace(/:/g,'');
			return val.substr(0,2) + ":" + val.substr(2,2) + ":" + val.substr(4,2);
		}

		deliveryController.horaEditor = function  (container, options) {
			var input = angular.element('<input></input>');
			input.attr("data-bind", 'value: ["hr-entrega"]')
			input.appendTo(container);
			input.kendoMaskedTextBox({
				mask: "20:50:50",
				rules: {
					'2':function (char) {							
							return char == '0' || 
								   char == '1' || 
								   char == '2';
						},
					'5':function (char) {							
							return char == '0' || 
								   char == '1' || 
								   char == '2' || 
								   char == '3' || 
								   char == '4' || 
								   char == '5';
						},
				}
			});
		}

		deliveryController.deliveryItemsGridEdit = function (event, column) {

			if (!deliveryController.canEdit() || event.model['cod-sit-ent'] != 1) {
				deliveryController.deliveryItemsGrid.closeCell();
				deliveryController.deliveryItemsGrid.table.focus();
			} else {
				$timeout(function () {
					var inputs = $(event.container).find("input:focus:text");
					if (inputs.length > 0) inputs[0].setSelectionRange(0,999);
				},50);
			}
		}

		deliveryController.save = function () {

			if(deliveryController.checkDirty()){

				var grid = deliveryController.deliveryItemsGrid;

				var ttOrderDelivery = angular.copy(grid.dataSource.data());

				if (ttOrderDelivery.length < 1) return;

				for (var index = 0; index < ttOrderDelivery.length; index++) {
					ttOrderDelivery[index] = ttOrderDelivery[index].toJSON();
					ttOrderDelivery[index]['hr-entrega'] = ttOrderDelivery[index]['hr-entrega'].replace(/:/g,'');
				}

				fchdis0051.saveOrderDelivery(
					{
						nrPedido: deliveryController.orderId
					},
					ttOrderDelivery,
					function (result) {

						customService.callCustomEvent("saveOrderDelivery", {
							controller:deliveryController,
							result: result
						});

						if (!result.$hasError) {
							$scope.$emit("salesorder.pd4000.loadorder","pd4000h");
						} else {
							/* Para evitar o travamento do grid */
							/*
							var grid = deliveryController.deliveryItemsGrid;
							var ttOrderDelivery = grid.dataSource.data();

							deliveryController.ttOrderDelivery = angular.copy(ttOrderDelivery);							
							*/
						}
					});
			}

		}

		deliveryController.refresh = function () {
			if(deliveryController.checkDirty()){
				deliveryController.ttOrderDelivery = angular.copy(deliveryController.original);
			}
		}

		deliveryController.checkDirty = function () {
			var grid = deliveryController.deliveryItemsGrid;
			if (!grid) return false;
			var data = grid.dataSource.data();

			for (var idx = 0; idx < data.length; idx++) {
				if (data[idx].dirty) {
					return true;
				}
			}
			return false;
		}

		deliveryController.add = function () {

			var newobj = {};

			var item = deliveryController.ttOrderDelivery[deliveryController.ttOrderDelivery.length - 1];

			newobj["nome-abrev"]   = item["nome-abrev"];
			newobj["nr-pedcli"]    = item["nr-pedcli"];
			newobj["nr-sequencia"] = item["nr-sequencia"];
			newobj["it-codigo"]    = item["it-codigo"];
			newobj["desc-item"]    = item["desc-item"];
			newobj["cod-refer"]    = item["cod-refer"];
			newobj["nr-entrega"]   = item["nr-entrega"] + 10;
			newobj["dt-entrega"]   = item["dt-entrega"];
			newobj["hr-entrega"]   = item["hr-entrega"];
			newobj["qt-un-fat"]    = 0.0;
			newobj["qt-log-aloca"] = 0.0;
			newobj["tipo-atend"]   = 2;
			newobj["tp-entrega"]   = 1;
			newobj["cod-sit-ent"]  = 1;

			item.dirty = true;

			var i = deliveryController.ttOrderDelivery.push(newobj)

            $timeout(function () {				
				var obj = deliveryController.deliveryItemsGrid.dataSource.at(i - 1);
				deliveryController.deliveryItemsGrid.select("tr[data-uid='" + obj.uid + "']");
                deliveryController.deliveryItemsGrid.editCell("tr[data-uid='" + obj.uid + "'] td:eq(1)");
            });
			
		}

		deliveryController.remove = function () {

			if(deliveryController.canDelete()){
				var selected = deliveryController.deliveryItemsGridSelectedItems;

				var grid = deliveryController.deliveryItemsGrid;

				for (var index = 0; index < selected.length; index++) {
					var element = selected[index];
					grid.dataSource.remove(element);
				}

				var element = grid.dataSource.at(0);
				element.dirty = true;
			}
		}

		deliveryController.cancel = function() {

			if(deliveryController.canDelete()){
				var params = {};

				var selectitems = deliveryController.deliveryItemsGridSelectedItems;

				if (selectitems.length < 1) return;

				var params = {
					tipo: "entrega",
					nrPedido: deliveryController.orderId,
					ttOrderDelivery: []
				};

				for (var i = 0; i < selectitems.length; i++) {
					var item = selectitems[i];
					params.ttOrderDelivery.push(item);
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
					$scope.$emit("salesorder.pd4000.loadorder","pd4000h");
				});
			}
		};


	}

	index.register.controller('salesorder.pd4000Delivery.Controller', deliveryController);

});

