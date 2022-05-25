/* global TOTVSEvent, angular*/
define(['index'], function (index) {

	searchItemLastShoppingcontroller.$inject = [
		'mpd.fchdis0051.Factory',
		'mpd.fchdis0063.Factory',
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

	function searchItemLastShoppingcontroller(
		fchdis0051,
		fchdis0063,
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

		var lastShoppingController = this;

		var number = $filter('number');

		lastShoppingController.orderController = $scope.orderController;

		lastShoppingController.order = $scope.orderController.order;

		lastShoppingController.nrPedido = $scope.orderController.order['nr-pedido'];

		lastShoppingController.isRepresentative = $scope.orderController.isRepresentative;

		lastShoppingController.isCustomer = $scope.orderController.isCustomer
		lastShoppingController.pesquisaVisibleFields = $scope.orderController.pesquisaVisibleFields;
		lastShoppingController.editablePrice = false;

		lastShoppingController.listResult = [];

		lastShoppingController.quickSearchText = '';
		lastShoppingController.simpleSearchType = 1;

		lastShoppingController.showItemImage = false;

		lastShoppingController.shoppingPeriod = 1; //30 dias

		lastShoppingController.showNumberReplacement = false;

		lastShoppingController.loadingItems = false;

		/* -----------------------------------------  */

		//Define o periodo de compra da pequisa para Reposição
		this.setPeriodShopping = function (numberPeriod) {
			lastShoppingController.shoppingPeriod = numberPeriod;
			$q.all([userPreference.setPreference('mpd.portal.periodshop', numberPeriod)]).then(function () { });
			lastShoppingController.searchButton();
		}

		//Define se será carregado a quantidade da última compra nos items para Reposição
		this.setShowNumberReplacement = function (showQtd) {
			lastShoppingController.showNumberReplacement = showQtd;
			$q.all([userPreference.setPreference('mpd.portal.showqtdrep', showQtd)]).then(function () { });

			/*for (var i = 0; i < lastShoppingController.listResult.length; i++) {

				for (var x = 0; x < lastShoppingController.listResult[i].ttOrderItemSearchUM[x].length; x++) {
					if (lastShoppingController.listResult[i]['cod-un'] == lastShoppingController.listResult[i].replacement[x].codun) {
						lastShoppingController.listResult[i].replacementtext = $rootScope.i18n('l-shopped') + " " + lastShoppingController.listResult[i].replacement[x].qtd_tot + " " + lastShoppingController.listResult[i].replacement[x].codun + " " + $rootScope.i18n('l-in-last') + " " + lastShoppingController.listResult[i].replacement[x].tot_dias + " " + $rootScope.i18n('l-days');
						if (parseFloat(lastShoppingController.listResult[i].replacement[x].ult_vl_preuni) > 0)
							lastShoppingController.listResult[i].replacementtext = lastShoppingController.listResult[i].replacementtext + ". " + $rootScope.i18n('l-last-price') + " " + lastShoppingController.listResult[i].replacement[x].ult_vl_preuni;

						if (lastShoppingController.showNumberReplacement == true) {
							//adiciona quantidade do ultimo pedido
							lastShoppingController.listResult[i]['qt-un-fat'] = lastShoppingController.listResult[i].replacement[x].qtd_ult_ped;
						} else {
							//remove quantidade do ultimo pedido
							lastShoppingController.listResult[i]['qt-un-fat'] = 0;
						}
					}
				}
			}*/

			for (var i = 0; i < lastShoppingController.listResult.length; i++) {

				for (var j = 0; j < lastShoppingController.listResult[i].ttOrderItemSearchUM.length; j++) {

					if (lastShoppingController.listResult[i].ttOrderItemSearchUM[j].replacement) {

						if (lastShoppingController.listResult[i]['cod-un'] == lastShoppingController.listResult[i].ttOrderItemSearchUM[j].replacement.codun) {

							lastShoppingController.listResult[i].replacementtext = $rootScope.i18n('l-shopped') + " " + lastShoppingController.listResult[i].ttOrderItemSearchUM[j].replacement.qtd_tot + " " + lastShoppingController.listResult[i].ttOrderItemSearchUM[j].replacement.codun + " " + $rootScope.i18n('l-in-last') + " " + lastShoppingController.listResult[i].ttOrderItemSearchUM[j].replacement.tot_dias + " " + $rootScope.i18n('l-days');
							if (parseFloat(lastShoppingController.listResult[i].ttOrderItemSearchUM[j].replacement.ult_vl_preuni) > 0)
								lastShoppingController.listResult[i].replacementtext = lastShoppingController.listResult[i].replacementtext + ". " + $rootScope.i18n('l-last-price') + " " + lastShoppingController.listResult[i].ttOrderItemSearchUM[j].replacement.ult_vl_preuni;

							if (lastShoppingController.showNumberReplacement == true) {
								//adiciona quantidade do ultimo pedido
								lastShoppingController.listResult[i]['qt-un-fat'] = lastShoppingController.listResult[i].ttOrderItemSearchUM[j].replacement.qtd_ult_ped;
							} else {
								//remove quantidade do ultimo pedido
								lastShoppingController.listResult[i]['qt-un-fat'] = 0;
							}
						}
					}
				}
			}

		}

		this.setShowItemImage = function (showImage) {
			lastShoppingController.showItemImage = showImage;
			$q.all([userPreference.setPreference('mpd.portal.showitimg', showImage)]).then(function () { });
		}
		
		
		this.loadPreferences = function (callback) {

			var count = 0, total = 4;
			
			userPreference.getPreference('mpd.portal.periodshop').then(function (data) {
				if (data.prefValue) {
					lastShoppingController.shoppingPeriod = data.prefValue;
					if (++count === total && callback) { callback(); }
				}
			});
			
			userPreference.getPreference('mpd.portal.showqtdrep').then(function (data) {
				if (data.prefValue) {
					if (data.prefValue == 'true') {
						lastShoppingController.showNumberReplacement = true;
					} else {
						lastShoppingController.showNumberReplacement = false;
					}
					if (++count === total && callback) { callback(); }
				}
			});
			
			userPreference.getPreference('mpd.portal.showitimg').then(function (data) {
				if (data.prefValue) {
					if (data.prefValue == 'true') {
						lastShoppingController.showItemImage = true;
					} else {
						lastShoppingController.showItemImage = false;
					}
					if (++count === total && callback) { callback(); }
				}
			});
			
			userPreference.getPreference('salesorder.portal.simpleSearchTypeLastShopping').then(function (data) {
				if (data.prefValue) {
					lastShoppingController.simpleSearchType = data.prefValue;
					if (++count === total && callback) { callback(); }
				}
			});

		};


		//Retorna as preferencias do usuário para periodo e se mostra quantidade da última compra
		this.getPeriodShopping = function () {
			lastShoppingController.loadPreferences();
		};


		/* ----------------------------------------- */


		lastShoppingController.addItens = function (item) {
			var ttOrderParameters = $scope.orderController.orderParameters;

			lastShoppingController.itensToAdd = new Array();

			if (item['qt-un-fat'] <= 0) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, [{ 
					type: 'warning', 
					title: $rootScope.i18n('l-items', [], 'dts/mpd'),
					detail: $rootScope.i18n('l-enter-quantity', [], 'dts/mpd')
				}]);

			} else {
				lastShoppingController.itensToAdd.push(item);

				if (lastShoppingController.itensToAdd.length) {

					$timeout(function () {

						fchdis0063.validateOrderItem(
							{
								nrPedido: lastShoppingController.nrPedido
							},
							{
								ttOrderParameters: ttOrderParameters,
								dsOrderItemSearch: {
									ttOrderItemSearch: lastShoppingController.itensToAdd
								}
							},
							function (resultitems) {
								customService.callCustomEvent("validateOrderItem", {
									controller: lastShoppingController,
									result: resultitems
								});

								if (lastShoppingController.showNumberReplacement != true) {
									for (var i = 0; i < lastShoppingController.listResult.length; i++) {
										lastShoppingController.listResult[i]["qt-un-fat"] = 0;
									}
								}

								if (!resultitems.$hasError) {
									if (resultitems.ttOrderItemSearch.length > 0) {
										fchdis0063.addOrderItem({
											nrPedido: lastShoppingController.nrPedido
										}, {
											ttOrderParameters: ttOrderParameters,
											ttOrderItemSearch: resultitems.ttOrderItemSearch
										}, function (result) {
											customService.callCustomEvent("addOrderItemLastShopping", {
												controller: lastShoppingController,
												result: result
											});
											if (!result.$hasError) {
												lastShoppingController.reloadItems(false);
											}

											item.itemsToAfterDrawAttention = false;
										});
									}
								} else {
									item.itemsToAfterDrawAttention = false;
								}
							}
						);
					}, 250);
				}

			}
		};


		this.getItemsRelated = function (item) {

			if ((!!item.itemsRelatedRequire) || (!!item.itemsRelatedUpSelling) || (!!item.itemsRelatedCrossSelling))
				return;

			item.itemsRelatedRequire = [];
			item.itemsRelatedUpSelling = [];
			item.itemsRelatedCrossSelling = [];


			for (var i = 0; i < item.ttOrderItemSearchObrigatorio.length; i++) {
				item.ttOrderItemSearchObrigatorio[i].isRepresentative = lastShoppingController.isRepresentative;
				item.ttOrderItemSearchObrigatorio[i].isCustomer = lastShoppingController.isCustomer;

				item.itemsRelatedRequire.push(item.ttOrderItemSearchObrigatorio[i]);
			}

			for (var i = 0; i < item.ttOrderItemSearchCrossSelling.length; i++) {
				item.ttOrderItemSearchCrossSelling[i].isRepresentative = lastShoppingController.isRepresentative;
				item.ttOrderItemSearchCrossSelling[i].isCustomer = lastShoppingController.isCustomer;

				item.itemsRelatedCrossSelling.push(item.ttOrderItemSearchCrossSelling[i]);
			}

			for (var i = 0; i < item.ttOrderItemSearchUpSelling.length; i++) {
				item.ttOrderItemSearchUpSelling[i].isRepresentative = lastShoppingController.isRepresentative;
				item.ttOrderItemSearchUpSelling[i].isCustomer = lastShoppingController.isCustomer;

				item.itemsRelatedUpSelling.push(item.ttOrderItemSearchUpSelling[i]);
			}

		};


		this.getRelatedPrices = function (item, isNotOpenPopover, callback) {
			var ret, params;

			params = {
				nrPedido: lastShoppingController.nrPedido,
				itemCode: item['it-codigo'] || " ",
				itemReference: item['cod-refer'] || " "
			};

			item.priceRelatedResult = undefined;

			if (item.priceRelated) {

				if (!isNotOpenPopover) {
					item.priceRelatedResult = item.priceRelated;
				}

				if (callback) { callback(item.priceRelated); }

			} else {

				if (!isNotOpenPopover) {
					ret = fchdis0063.getRelatedPrice(params, function (data) {
						item.priceRelated = data;
						if (callback) { callback(item.priceRelated); }
					});
					item.priceRelatedResult = ret;
				} else {
					ret = fchdis0063.getRelatedPriceWithNoCountRequest(params, function (data) {
						item.priceRelated = data;
						if (callback) { callback(item.priceRelated); }
					});
				}

			}
		};


		lastShoppingController.addItensWithTimeOut = function (item) {

			item.itemsToAfterDrawAttention = true;			

			if (item['qt-un-fat'] > 0) {

				$timeout(function () {
					if ($http.pendingRequests.length === 0) {
						lastShoppingController.addItens(item);
					} else {
						lastShoppingController.quickSearchText = '';
						lastShoppingController.addItensWithTimeOut(item);
					}
				}, 500);

			} else {
				item.itemsToAfterDrawAttention = false;
				$rootScope.$broadcast(TOTVSEvent.showNotification, [{ 
					type: 'warning', 
					title: $rootScope.i18n('l-items', [], 'dts/mpd'),
					detail: $rootScope.i18n('l-enter-quantity', [], 'dts/mpd')
				}]);
			}


		}

		this.setKeyUp = function (keyEvent, item) {
			if (keyEvent.which === 13) {

				var target = keyEvent.target;

				target.blur();

				lastShoppingController.addItensWithTimeOut(item)
			}
		}


		lastShoppingController.reloadItems = function (gotoitems) {

			$scope.$emit("salesorder.portal.loaditems", gotoitems);

			if (!gotoitems) {
				lastShoppingController.setFocusItem();
				$rootScope.$broadcast(TOTVSEvent.showNotification, [{ 
					type: 'info', 
					title: $rootScope.i18n('l-items'), 
					detail: $rootScope.i18n('l-added-to-order') }]);
			}
		};



		lastShoppingController.customItemsGrid = function () {
			customService.callCustomEvent('portalLastShopping', { lastShoppingController: lastShoppingController });
		};


		lastShoppingController.setFocusItem = function () {
			// var searchItemEl = document.getElementById('searchitemLastShoppingField');
			// var angularEl = angular.element(searchItemEl);
			// angularEl.focus();
		}

		lastShoppingController.searchButton = function () {

			lastShoppingController.listResult = [];

			lastShoppingController.loadMore();
		};

		lastShoppingController.applySelectRange = function ($event) {
			$event.target.setSelectionRange(0, 999);
		}

		lastShoppingController.loadMore = function () {
			var nrTabPre = null;
			var codEstabel = $scope.orderController.order['cod-estabel'];

			var params = angular.extend(
				{},

				lastShoppingController.searchParams,
				{
					nrPedido: lastShoppingController.nrPedido,
					SimpleSearchType: lastShoppingController.simpleSearchType,
					SearchTerm: "*" + lastShoppingController.quickSearchText + "*",
					NrTabPre: nrTabPre,
					CodEstab: codEstabel,
					Start: lastShoppingController.listResult.length,
					searchType: 3,
					shoppingPeriod: lastShoppingController.shoppingPeriod
				}
			);


			lastShoppingController.loadingItems = true;

			fchdis0063.searchproducts(
				params
				, function (data) {
					customService.callCustomEvent("searchProductsLastShopping", {
						controller: lastShoppingController,
						result: data
					});

					lastShoppingController.loadingItems = false;

					for (var i = 0; i < data.dsOrderItemSearch.length; i++) {

						data.dsOrderItemSearch[i].precosUnidade = undefined;
						data.dsOrderItemSearch[i].replacementtext = $rootScope.i18n('l-no-has-item-shopped');

						for (var j = 0; j < data.dsOrderItemSearch[i].ttOrderItemSearchUM.length; j++) {

							if (!data.dsOrderItemSearch[i].precosUnidade) {
								data.dsOrderItemSearch[i].precosUnidade = "'" + data.dsOrderItemSearch[i].ttOrderItemSearchUM[j]['cod-unid-med'] + "': " + data.dsOrderItemSearch[i].ttOrderItemSearchUM[j]['preco-venda'];
							} else {
								data.dsOrderItemSearch[i].precosUnidade = data.dsOrderItemSearch[i].precosUnidade + ",'" + data.dsOrderItemSearch[i].ttOrderItemSearchUM[j]['cod-unid-med'] + "': " + data.dsOrderItemSearch[i].ttOrderItemSearchUM[j]['preco-venda'];
							}

							if (data.dsOrderItemSearch[i].ttOrderItemSearchUM[j].replacement) {
								data.dsOrderItemSearch[i].ttOrderItemSearchUM[j].replacement = angular.fromJson(data.dsOrderItemSearch[i].ttOrderItemSearchUM[j].replacement.replace(/'/g, '"'));

								if (data.dsOrderItemSearch[i]['cod-un'] == data.dsOrderItemSearch[i].ttOrderItemSearchUM[j].replacement.codun) {

									data.dsOrderItemSearch[i].replacementtext = $rootScope.i18n('l-shopped') + " " + data.dsOrderItemSearch[i].ttOrderItemSearchUM[j].replacement.qtd_tot + " " + data.dsOrderItemSearch[i].ttOrderItemSearchUM[j].replacement.codun + " " + $rootScope.i18n('l-in-last') + " " + data.dsOrderItemSearch[i].ttOrderItemSearchUM[j].replacement.tot_dias + " " + $rootScope.i18n('l-days');
									if (parseFloat(data.dsOrderItemSearch[i].ttOrderItemSearchUM[j].replacement.ult_vl_preuni) > 0)
										data.dsOrderItemSearch[i].replacementtext = data.dsOrderItemSearch[i].replacementtext + ". " + $rootScope.i18n('l-last-price') + " " + data.dsOrderItemSearch[i].ttOrderItemSearchUM[j].replacement.ult_vl_preuni;

									//adiciona quantidade do ultimo pedido
									if (lastShoppingController.showNumberReplacement == true) {
										data.dsOrderItemSearch[i]['qt-un-fat'] = data.dsOrderItemSearch[i].ttOrderItemSearchUM[j].replacement.qtd_ult_ped;
									}

								}

							}
						}

						data.dsOrderItemSearch[i].precosUnidade = "{" + data.dsOrderItemSearch[i].precosUnidade + "}";
						data.dsOrderItemSearch[i].precosUnidade = angular.fromJson(data.dsOrderItemSearch[i].precosUnidade.replace(/'/g, '"'));

					}

					lastShoppingController.listResult = lastShoppingController.listResult.concat(data.dsOrderItemSearch);
					lastShoppingController.hasMore = data.lMore;
					lastShoppingController.totalRecords = data.count;


					if (lastShoppingController.showNumberReplacement == true) {
						for (var i = 0; i < lastShoppingController.listResult.length; i++) {
							if (lastShoppingController.listResult[i]['qt-un-fat'] > 0) {
								lastShoppingController.leaveItemField(lastShoppingController.listResult[i], 'qt-un-fat')
							}
						}
					}

					if (data.dsOrderItemSearch.length == 0) {
						$rootScope.$broadcast(TOTVSEvent.showNotification, [{ 
							type: 'warning', 
							title: $rootScope.i18n('l-search-with-results'), 
							detail: $rootScope.i18n('l-another-search-term')
						}]);
					}


					fchdis0063.getItemBalance({ pStart: 0, nrPedido: lastShoppingController.nrPedido }, lastShoppingController.listResult, function (data) {

						for (var i = 0; i < lastShoppingController.listResult.length; i++) {
							for (var j = 0; j < data.length; j++) {
								if (data[j]['it-codigo'] == lastShoppingController.listResult[i]['it-codigo'] && data[j]['cod-refer'] == lastShoppingController.listResult[i]['cod-refer']) {
									if (lastShoppingController.listResult[i].balanceLoaded != true) {
										lastShoppingController.listResult[i].balanceLoaded = true;
										lastShoppingController.listResult[i]['vl-saldo'] = data[j]['vl-saldo'];
									}

									lastShoppingController.listResult[i].hasEquivalent = data[j]['hasEquivalent'];
									lastShoppingController.listResult[i].hasRelated = data[j]['hasRelated'];
									lastShoppingController.listResult[i].hasBalance = data[j]['hasBalance'];

								}
							}
						}
					});
				}
			);
		};


		lastShoppingController.setPreference = function (name, value) {
			userPreference.setPreference(name, value);
		}


		lastShoppingController.setEditablePrice = function () {
			for (var i = lastShoppingController.pesquisaVisibleFields.length - 1; i >= 0; i--) {
				if (lastShoppingController.pesquisaVisibleFields[i]['fieldName'] == "permite-alterar-preco") {
					lastShoppingController.editablePrice = true;
				}
			}
		}


		this.changeUn = function (item) {

			var hasUn = false;

			for (var i = 0; i < item.ttOrderItemSearchUM.length; i++) {

				if (item.ttOrderItemSearchUM[i].replacement) {

					if (item['des-un-medida'] == item.ttOrderItemSearchUM[i].replacement.codun) {

						hasUn = true;

						item.replacementtext = $rootScope.i18n('l-shopped') + " " + item.ttOrderItemSearchUM[i].replacement.qtd_tot + " " + item.ttOrderItemSearchUM[i].replacement.codun + " " + $rootScope.i18n('l-in-last') + " " + item.ttOrderItemSearchUM[i].replacement.tot_dias + " " + $rootScope.i18n('l-days');
						if (parseFloat(item.ttOrderItemSearchUM[i].replacement.ult_vl_preuni) > 0)
							item.replacementtext = item.replacementtext + ". " + $rootScope.i18n('l-last-price') + " " + item.ttOrderItemSearchUM[i].replacement.ult_vl_preuni;

						//adiciona quantidade do ultimo pedido
						if (lastShoppingController.showNumberReplacement == true && item.ttOrderItemSearchUM[i].replacement.qtd_ult_ped > 0) {
							item['qt-un-fat'] = item.ttOrderItemSearchUM[i].replacement.qtd_ult_ped;
						}
					}
				}
			}

			if (hasUn == false) {
				item.replacementtext = $rootScope.i18n('l-no-has-item-shopped');
				/*if(lastShoppingController.showNumberReplacement == true){
					item['qt-un-fat'] = 0;
				}*/
			}


			lastShoppingController.leaveItemField(item, 'des-un-medida');

		};


		lastShoppingController.leaveItemField = function (item, fieldName) {

			var ttOrderParameters = $scope.orderController.orderParameters;

			if (!item['nr-sequencia'] > 0) {

				$timeout(function () {
					fchdis0063.startAddItem({
						nrPedido: lastShoppingController.nrPedido,
						itemCode: item['it-codigo'],
						field: fieldName
					}, {
						ttOrderParameters: ttOrderParameters,
						ttOrderItemSearch: item
					}, function (result) {
						customService.callCustomEvent("startAddItem", {
							controller: lastShoppingController,
							result: result
						});

						var imageValue = item['nom-imagem'];
						var qtUnFat = item['qt-un-fat'];


						item = Object.assign(item, result.ttOrderItemSearch[0]);

						item['nom-imagem'] = imageValue;
						item['qt-un-fat'] = qtUnFat;


					});
				}, 250);

			} else {

				if (fieldName == "qt-un-fat" ||
					fieldName == "des-un-medida" ||
					fieldName == "log-usa-tabela-desconto" ||
					fieldName == "nr-tabpre" ||
					fieldName == "ct-codigo" ||
					fieldName == "nat-operacao" ||
					fieldName == "estab-atend-item" ||
					fieldName == "cod-entrega" ||
					fieldName == "dt-entrega") {

					fchdis0063.leaveOrderItem({
						nrPedido: lastShoppingController.nrPedido,
						nrSeq: item['nr-sequencia'],
						itemCode: item['it-codigo'],
						fieldname: fieldName,
						action: "Add"
					}, {
						ttOrderItemPortalScreen: [item],
						ttOrderParameters: ttOrderParameters
					}, function (result) {
						customService.callCustomEvent("leaveOrderItemSearchLastShopping", {
							controller: lastShoppingController,
							result: result
						});

						var imageValue = item['nom-imagem'];
						var qtUnFat = item['qt-un-fat'];

						item = Object.assign(item, result.ttOrderItemPortalScreen[0]);

						item['nom-imagem'] = imageValue;
						item['qt-un-fat'] = qtUnFat;

					});
				}
			}
		}


		lastShoppingController.start = function () {
			lastShoppingController.getPeriodShopping();
			lastShoppingController.setEditablePrice();
		}


		lastShoppingController.start();

	}
	index.register.controller('salesorder.order2.searchItemLastShopping.Controller', searchItemLastShoppingcontroller);


});

