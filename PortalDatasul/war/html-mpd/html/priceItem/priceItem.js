/* global TOTVSEvent */
define(['index',
    '/dts/mpd/js/userpreference.js',
    '/dts/mpd/js/portal-factories.js',
    '/dts/mpd/js/mpd-factories.js',
    '/dts/mpd/js/api/fchdis0035api.js',
    '/dts/mpd/js/api/fchdis0063.js'], function (index) {

        index.stateProvider

            .state('dts/mpd/priceItem', {
                abstract: true,
                template: '<ui-view/>'
            })
            .state('dts/mpd/priceItem.start', {
                url: '/dts/mpd/priceItem/:nrTabPre',
                controller: 'salesorder.priceItem.Controller',
                controllerAs: 'controller',
                templateUrl: '/dts/mpd/html/priceItem/priceItem.html'
            })

        pricesCtrl.$inject = ['salesorder.products.Factory',
            '$injector',
            '$stateParams',
            'userPreference',
            'totvs.app-main-view.Service',
            'portal.generic.Controller',
            '$rootScope',
            '$filter',
            'salesorder.salesorders.Factory',
            'mpd.companyChange.Factory',
            'TOTVSEvent',
            'portal.getUserData.factory',
            'mpd.fchdis0035.factory',
            'mpd.fchdis0063.Factory',
            '$location',
            '$timeout',
			'customization.generic.Factory'];

        function pricesCtrl(products,
            $injector,
            $stateParams,
            userPreference,
            appViewService,
            genericController,
            $rootScope,
            $filter,
            orderResource,
            companyChange,
            TOTVSEvent,
            userdata,
            fchdis0035,
            fchdis0063,
            $location,
            $timeout,
			customService) {

            var controller = this;
            var i18n = $filter('i18n');
            this.currentUserRoles = [];
            controller.isRepresentative = false;
            controller.isCustomer = false;
            controller.newOrderInclusionFlow = false;
            var paramVisibleFieldsPedVendaLista = { cTable: "ped-venda-lista" };
            controller.hasMore = false;
            controller.listResult = [];
            controller.quickSearchText = "";
            controller.shoppingCartActionAdd = false;

            controller.bussinessContexts = null;

            if ($injector.has('totvs.app-bussiness-Contexts.Service')) {
                controller.bussinessContexts = $injector.get('totvs.app-bussiness-Contexts.Service');
            }


            genericController.decorate(this, products);

            if (controller.bussinessContexts && controller.bussinessContexts.getContextData('selected.sales.order')) {
                controller.simpleOrderItemsToNewOrder = controller.bussinessContexts.getContextData('selected.sales.order').simpleOrderItems;
            } else {
                controller.simpleOrderItemsToNewOrder = [];
            }


            this.loadMore = function () {
                controller.clearFilter();

                if (controller.newOrderInclusionFlow  && controller.isRepresentative) {

                    // Carrega itens do portal 2.0
                    controller.loadData2(true);

                } else {

                    if (controller.nrTabPre)
                        controller.filterBy.push({ label: 'l-price-table', property: 'codPriceTable', value: controller.nrTabPre, title: i18n('l-price-table') + ": " + controller.nrTabPre, fixed: true });

                    if (controller.quickSearchText)
                        controller.filterBy.push({ label: 'l-search-item', property: 'filterPriceTableItem', value: controller.quickSearchText, title: i18n('l-simple-filter') + ": " + controller.quickSearchText });

                    // Controle de paginação por código do item e referência
                    var lastPortalRegClien = controller.listResult[controller.listResult.length - 1]['it-codigo'] + "@#$" +
                        controller.listResult[controller.listResult.length - 1]['cod-refer'];

                    controller.addFilter('lastPortalRegClien', lastPortalRegClien, '', ''); // Para paginação manual 

                    this.findRecords(controller.listResult.length, controller.filterBy).then(function(result) {
                        for (var i = 0; i < result.length; i++) {                            
                            result[i]["nom-imagem"] = encodeURIComponent(result[i]["nom-imagem"]);                            
                        };
                    });;

                    controller.clearFilter();

                    if (controller.nrTabPre)
                        controller.filterBy.push({ label: 'l-price-table', property: 'codPriceTable', value: controller.nrTabPre, title: i18n('l-price-table') + ": " + controller.nrTabPre, fixed: true });

                    if (controller.quickSearchText)
                        controller.filterBy.push({ label: 'l-search-item', property: 'filterPriceTableItem', value: controller.quickSearchText, title: i18n('l-simple-filter') + ": " + controller.quickSearchText });

                }

            };


            this.removeSelectedFilter = function (filter) {
                if (filter.label == 'l-search-item')
                    controller.quickSearchText = '';

                controller.clearFilter(controller);
                controller.loadData();
            }

            this.search = function () {
                controller.clearFilter(controller);
                controller.loadData();
            }

            this.loadData = function () {

                // problema com caracter barra no codigo da tabela de preço
                // na chamada tem que codificar 2 vezes, porque o browser decodifica automaricamente na URL;
                // como codificou 2 vezes, o browser decodifica 1 vez, e aqui tem que decodificar a segunda.
                controller.nrTabPre = decodeURIComponent($stateParams.nrTabPre);


                if (controller.newOrderInclusionFlow && controller.isRepresentative) {

                    // Carrega itens do portal 2.0
                    controller.loadData2();

                } else {

                    controller.filterBy = [];

                    if (controller.nrTabPre)
                        controller.filterBy.push({ label: 'l-price-table', property: 'codPriceTable', value: controller.nrTabPre, title: i18n('l-price-table') + ": " + controller.nrTabPre, fixed: true });

                    if (controller.quickSearchText)
                        controller.filterBy.push({ label: 'l-search-item', property: 'filterPriceTableItem', value: controller.quickSearchText, title: i18n('l-simple-filter') + ": " + controller.quickSearchText });

                    controller.clearDefaultData(true, controller);
                    this.findRecords(null, controller.filterBy).then(function(result) {
                        for (var i = 0; i < result.length; i++) {                            
                            result[i]["nom-imagem"] = encodeURIComponent(result[i]["nom-imagem"]);                            
                        };
                    });
                }
            }

            this.loadData2 = function (isLoadMore) {

                controller.clearFilter();

                if (controller.nrTabPre) {
                    controller.filterBy.push({ label: 'l-price-table', property: 'codPriceTable', value: controller.nrTabPre, title: i18n('l-price-table') + ": " + controller.nrTabPre, fixed: true });
                }

                if (controller.quickSearchText) {
                    controller.filterBy.push({ label: 'l-search-item', property: 'filterPriceTableItem', value: controller.quickSearchText, title: i18n('l-simple-filter') + ": " + controller.quickSearchText });
                }

                if (!isLoadMore) {
                    controller.clearDefaultData(true, controller);
                }

                var quickSearchTextParam = "";

                if (controller.quickSearchText) {
                    quickSearchTextParam = "*" + controller.quickSearchText + "*"
                } else {
                    quickSearchTextParam = "**";
                }

                var params = angular.extend(
                    {},

                    controller.searchParams,
                    {
                        nrPedido: 0,
                        SimpleSearchType: 3,
                        SearchTerm: quickSearchTextParam,
                        NrTabPre: controller.nrTabPre,
                        CodEstab: 0,
                        Start: controller.listResult.length,
                        searchType: 1,
                        shoppingPeriod: 0,
                        shoppingCart: true
                    }
                );

                fchdis0063.searchproducts(params, function (data) {

                    for (var i = 0; i < data.dsOrderItemSearch.length; i++) {
                        data.dsOrderItemSearch[i].ttPricesRelatedByItem = data.dsOrderItemSearch[i].ttOrderItemSearchUM;
                        data.dsOrderItemSearch[i].itemDesc = data.dsOrderItemSearch[i]['desc-item'];
                        data.dsOrderItemSearch[i]["nom-imagem"] = encodeURIComponent(data.dsOrderItemSearch[i]["nom-imagem"]);                        
                    }

                    controller.listResult = controller.listResult.concat(data.dsOrderItemSearch);
                    controller.hasMore = data.lMore;
                });
            }


            this.addItemToShoppingCart = function (simpleOrderItem, relatedPrice) {

                var simpleOrderItemObj = { 'cod-refer': '', 'cod-un': '', 'epcValue': '', 'hasBalance': false, 'hasEquivalent': false, 'hasRelated': false, 'hasRelatedPrice': false, 'it-codigo': '', 'itemDesc': '', 'nom-imagem': '', 'nr-sequencia': 0, 'nr-tabpre': '', 'precosUnidade': '', 'qt-un-fat': 0, 'qtdToAddCart': 0, 'relatedPrices': [], 'situacao': '', 'vl-preuni': 0, 'vl-saldo': 0, 'vl-tot-it': 0 };

                if (relatedPrice['qtdToAddCart'] > 0) {

                    if (relatedPrice['qtdToAddCart'] < relatedPrice['quant-min']) {
                        var message = '';
                        if ((simpleOrderItem['cod-refer'] == '') || (simpleOrderItem['cod-refer'] == undefined)) {
                            message = i18n('l-alert-item') + simpleOrderItem['it-codigo'] + i18n('l-alert-item-qtd-min');
                        } else {
                            message = i18n('l-alert-item') + simpleOrderItem['it-codigo'] + i18n('l-com-referencia') + simpleOrderItem['cod-refer'] + i18n('l-alert-item-qtd-min');
                        }

                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'warning',
                            title: i18n('l-quant-min') + ".",
                            detail: message
                        });
                    } else {

                        if (relatedPrice != null) {
                            simpleOrderItem['vl-preuni'] = relatedPrice['preco-venda'];
                            simpleOrderItem['qt-un-fat'] = simpleOrderItem['qtdToAddCart'];

                            if (controller.newOrderInclusionFlow && controller.isRepresentative) {
                                simpleOrderItem['des-un-medida'] = relatedPrice['cod-unid-med'];
                            }else{
                                simpleOrderItem['cod-un'] = relatedPrice['cod-unid-med'];
                            }    
                
                            simpleOrderItem['nr-tabpre'] = relatedPrice['nr-tabpre'];
                            simpleOrderItem['qt-un-fat'] = relatedPrice['qtdToAddCart'];
                        } else {
                            simpleOrderItem['qt-un-fat'] = simpleOrderItem['qtdToAddCart'];
                        }

                        if (simpleOrderItem['qt-un-fat'] > 0) {

                            if (controller.newOrderInclusionFlow && controller.isRepresentative) {
                                simpleOrderItemObj = angular.copy(simpleOrderItem);
                            } else {

                                //Necessário para nao pegar a mesma referencia do objeto simpleOrderItem
                                simpleOrderItemObj['cod-refer'] = simpleOrderItem['cod-refer'];
                                simpleOrderItemObj['cod-un'] = simpleOrderItem['cod-un'];
                                simpleOrderItemObj['epcValue'] = simpleOrderItem['epcValue'];
                                simpleOrderItemObj['hasBalance'] = simpleOrderItem['hasBalance'];
                                simpleOrderItemObj['hasEquivalent'] = simpleOrderItem['hasEquivalent'];
                                simpleOrderItemObj['hasRelated'] = simpleOrderItem['hasRelated'];
                                simpleOrderItemObj['hasRelatedPrice'] = simpleOrderItem['hasRelatedPrice'];
                                simpleOrderItemObj['it-codigo'] = simpleOrderItem['it-codigo'];
                                simpleOrderItemObj['itemDesc'] = simpleOrderItem['itemDesc'];
                                simpleOrderItemObj['nom-imagem'] = simpleOrderItem['nom-imagem'];
                                simpleOrderItemObj['nr-sequencia'] = simpleOrderItem['nr-sequencia'];
                                simpleOrderItemObj['nr-tabpre'] = simpleOrderItem['nr-tabpre'];
                                simpleOrderItemObj['precosUnidade'] = simpleOrderItem['precosUnidade'];
                                simpleOrderItemObj['qt-un-fat'] = simpleOrderItem['qt-un-fat'];
                                simpleOrderItemObj['relatedPrices'] = simpleOrderItem['relatedPrices'];
                                simpleOrderItemObj['situacao'] = simpleOrderItem['situacao'];
                                simpleOrderItemObj['vl-preuni'] = simpleOrderItem['vl-preuni'];
                                simpleOrderItemObj['vl-saldo'] = simpleOrderItem['vl-saldo'];
                                simpleOrderItemObj['vl-tot-it'] = simpleOrderItem['vl-tot-it'];
                                simpleOrderItemObj['des-pct-desconto-inform'] = simpleOrderItem['des-pct-desconto-inform'];

                            }

                            if (controller.bussinessContexts.getContextData('selected.sales.order')) {
                                if (controller.bussinessContexts.getContextData('selected.sales.order').orderId != undefined)
                                    var nrPedidoShoppingCart = controller.bussinessContexts.getContextData('selected.sales.order').orderId
                                else
                                    var nrPedidoShoppingCart = 0;
                            }


                            if (controller.newOrderInclusionFlow && controller.isRepresentative) {

                                fchdis0063.validateOrderItem(
                                    {
                                        nrPedido: nrPedidoShoppingCart
                                    },
                                    {
                                        dsOrderItemSearch: {
                                            ttOrderItemSearch: [simpleOrderItemObj]
                                        }
                                    },
                                    function (result) {

                                        if (!result.$hasError) {

                                            if (result.ttOrderItemSearch[0]) {
                                                controller.simpleOrderItemsToNewOrder.push(result.ttOrderItemSearch[0]);

                                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                                    type:   'info',
                                                    title:  $rootScope.i18n('l-information', [], 'dts/mpd'),
                                                    detail: $rootScope.i18n('l-item-adde-to-shopping-cart', [], 'dts/mpd') + ' (' + result.ttOrderItemSearch[0]['it-codigo'] + ').'
                                                });
                                            }    

                                            relatedPrice.qtdToAddCart = 0;

                                            if (controller.bussinessContexts) {
                                                if (controller.bussinessContexts.getContextData('selected.sales.order')) {
                                                    if (controller.bussinessContexts.getContextData('selected.sales.order').orderId != undefined) {
                                                        controller.orderId = controller.bussinessContexts.getContextData('selected.sales.order').orderId;
                                                        controller.order2CustomerId = controller.bussinessContexts.getContextData('selected.sales.order').order2CustomerId;
                                                        controller.order2modelId = controller.bussinessContexts.getContextData('selected.sales.order').order2modelId;
                                                        controller.isQuotation = controller.bussinessContexts.getContextData('selected.sales.order').isQuotation;
                                                        controller.createShoppingCartToOrder();

                                                    } else {
                                                        controller.createShoppingCart();
                                                    }
                                                } else {
                                                    controller.createShoppingCart();
                                                }
                                            }

                                        }
                                    });

                            } else {

                                orderResource.validateOrderItem({
                                    nrPedido: nrPedidoShoppingCart
                                }, simpleOrderItemObj, function (result) {
                                    if (!result.$hasError) {

                                        if (result[0] != undefined) {
                                            controller.simpleOrderItemsToNewOrder.push(result[0]);

                                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                                type:   'info',
                                                title:  $rootScope.i18n('l-information', [], 'dts/mpd'),
                                                detail: $rootScope.i18n('l-item-adde-to-shopping-cart', [], 'dts/mpd') + ' (' + result[0]['it-codigo'] + ').'
                                            });

                                        }    

                                        relatedPrice.qtdToAddCart = 0;

                                        if (controller.bussinessContexts) {
                                            if (controller.bussinessContexts.getContextData('selected.sales.order')) {
                                                if (controller.bussinessContexts.getContextData('selected.sales.order').orderId != undefined) {
                                                    controller.orderId = controller.bussinessContexts.getContextData('selected.sales.order').orderId;
                                                    controller.order2CustomerId = controller.bussinessContexts.getContextData('selected.sales.order').order2CustomerId;
                                                    controller.order2modelId = controller.bussinessContexts.getContextData('selected.sales.order').order2modelId;
                                                    controller.isQuotation = controller.bussinessContexts.getContextData('selected.sales.order').isQuotation;
                                                    controller.createShoppingCartToOrder();
                                                } else {
                                                    controller.createShoppingCart();
                                                }
                                            } else {
                                                controller.createShoppingCart();
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            };


            this.createShoppingCart = function () {

                if(controller.orderId) {
                    controller.shoppingCartActionAdd = false;
                } else {
                    controller.shoppingCartActionAdd = true;
                }

                controller.isQuotation = false;

                controller.bussinessContexts.setContext('selected.sales.order',
                    i18n('l-shopping-cart') + ' ' + ' (' + controller.simpleOrderItemsToNewOrder.length + ' ' + i18n('l-items-qtd') + ')',
                    'glyphicon-shopping-cart',
                    [{
                        name: i18n('btn-complete') + ' (' + controller.simpleOrderItemsToNewOrder.length + ' ' + i18n('l-items-qtd') + ')',
                        icon: 'glyphicon-ok',
                        click: function () {

                            var url = $location.url();
                            var inHeader = false;

                            if(url.indexOf('dts/mpd/customers') !== -1) {
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type:   'warning',
                                    title:  $rootScope.i18n('l-warning', [], 'dts/mpd'),
                                    detail: $rootScope.i18n('l-use-customer-action', [], 'dts/mpd')
                                });
                            }

                            if(url.indexOf('dts/mpd/order2/new') !== -1) {
                                inHeader = true;
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type:   'warning',
                                    title:  $rootScope.i18n('l-warning', [], 'dts/mpd'),
                                    detail: $rootScope.i18n('l-save-header-to-continue', [], 'dts/mpd')
                                });
                            }

                            if(url.indexOf('dts/mpd/quotation/new') !== -1) {
                                inHeader = true;
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type:   'warning',
                                    title:  $rootScope.i18n('l-warning', [], 'dts/mpd'),
                                    detail: $rootScope.i18n('l-save-header-to-continue', [], 'dts/mpd')
                                });
                            }

                            if (!controller.simpleOrderItemsToNewOrder.length){
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type:   'error',
                                    title:  $rootScope.i18n('l-shopping-cart', [], 'dts/mpd'),
                                    detail: $rootScope.i18n('msg-shopping-cart-required', [], 'dts/mpd') + '.'
                                });
                            } else {
                                
                                if (!controller.bussinessContexts.getContextData('selected.sales.order').complete) {
                                    controller.updateDataContext = controller.bussinessContexts.getContextData('selected.sales.order');
                                    controller.updateDataContext.complete = true;
                                    controller.bussinessContexts.setContextData('selected.sales.order', controller.updateDataContext);
                                }

                                if(!inHeader){
                                    $location.url(controller.papel);
                                }
                            }
                            
                        }
                    },
                    {
                        name: i18n('l-remove-shopping-cart'),
                        icon: 'glyphicon-remove',
                        click: function () {
                            controller.bussinessContexts.removeContext('selected.sales.order');
                            controller.simpleOrderItemsToNewOrder.length = 0;
                        }
                    }],
                    { complete: false, orderId: undefined, simpleOrderItems: controller.simpleOrderItemsToNewOrder, order2: controller.newOrderInclusionFlow, isQuotation: controller.isQuotation,  shoppingCartActionAdd: controller.shoppingCartActionAdd, order2CustomerId: undefined, order2modelId: undefined });
            };

            this.createShoppingCartToOrder = function () {

                if(controller.orderId) {
                    controller.shoppingCartActionAdd= false;
                } else {
                    controller.shoppingCartActionAdd = true;
                }

                var urlOrderView = "";

                if(controller.shoppingCartActionAdd && controller.newOrderInclusionFlow  && controller.isRepresentative){
                    urlOrderView = '/dts/mpd/order2/new/' + controller.order2CustomerId;
                } else if (!controller.shoppingCartActionAdd && controller.newOrderInclusionFlow && controller.isRepresentative) {
                    if (controller.order2modelId) {
                        urlOrderView = '/dts/mpd/order2/' + controller.orderId + '/edit?modelId=' + controller.order2modelId;
                    }else {
                        urlOrderView = '/dts/mpd/order2/' + controller.orderId + '/edit' + controller.orderId;
                    }
                } else {
                    urlOrderView = '/dts/mpd/order/' + controller.orderId;
                }

                if(controller.isQuotation) {
                    if(controller.shoppingCartActionAdd) {
                        urlOrderView = '/dts/mpd/quotation/new' + controller.order2CustomerId;
                    } else {
                        if (controller.order2modelId) {
                            urlOrderView = '/dts/mpd/quotation/' + controller.orderId + '/edit?modelId=' + controller.order2modelId;
                        }else {
                            urlOrderView = '/dts/mpd/quotation/' + controller.orderId + '/edit' + controller.orderId;
                        }
                    }
                }

                controller.bussinessContexts.setContext('selected.sales.order',
                    i18n('l-shopping-cart') + ' ' + controller.orderId + ' (' + controller.simpleOrderItemsToNewOrder.length + ' ' + i18n('l-items-qtd') + ')',
                    'glyphicon-shopping-cart',
                    [{
                        name: i18n('btn-complete') + ' ' + controller.orderId +  ' (' + controller.simpleOrderItemsToNewOrder.length + ' ' + i18n('l-items-qtd') + ')',
                        icon: 'glyphicon-ok',
                        click: async function () {

                            var url = $location.url();
                            var inHeader = false;
                            var requiredReloadView = false;

                            if(url.indexOf('dts/mpd/customers') !== -1) {
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type:   'warning',
                                    title:  $rootScope.i18n('l-warning', [], 'dts/mpd'),
                                    detail: $rootScope.i18n('l-use-customer-action', [], 'dts/mpd')
                                });
                            }

                            if(url.indexOf('dts/mpd/order2/new') !== -1) {
                                inHeader = true;
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type:   'warning',
                                    title:  $rootScope.i18n('l-warning', [], 'dts/mpd'),
                                    detail: $rootScope.i18n('l-save-header-to-continue', [], 'dts/mpd')
                                });
                            }

                            if(url.indexOf('dts/mpd/quotation/new') !== -1) {
                                inHeader = true;
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type:   'warning',
                                    title:  $rootScope.i18n('l-warning', [], 'dts/mpd'),
                                    detail: $rootScope.i18n('l-save-header-to-continue', [], 'dts/mpd')
                                });
                            }

                            if(url.indexOf('dts/mpd/prices') !== -1) {
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type:   'warning',
                                    title:  $rootScope.i18n('l-warning', [], 'dts/mpd'),
                                    detail: $rootScope.i18n('l-select-a-price-table', [], 'dts/mpd')
                                });
                            } 

                            if(url.indexOf('dts/mpd/quotation/' + controller.orderId + '/edit') !== -1) {
                                requiredReloadView = true;
                            }
                            
                            if(url.indexOf('dts/mpd/order2/' + controller.orderId + '/edit') !== -1) {
                                requiredReloadView = true;
                            }

                            if (!controller.simpleOrderItemsToNewOrder.length){
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type:   'error',
                                    title:  $rootScope.i18n('l-shopping-cart', [], 'dts/mpd'),
                                    detail: $rootScope.i18n('msg-shopping-cart-required', [], 'dts/mpd') + '.'
                                });
                            } else {
                                
                                if (!controller.bussinessContexts.getContextData('selected.sales.order').complete) {
                                    controller.updateDataContext = controller.bussinessContexts.getContextData('selected.sales.order');
                                    controller.updateDataContext.complete = true;
                                    controller.bussinessContexts.setContextData('selected.sales.order', controller.updateDataContext);
                                }

                                if(!inHeader){
                                    if(requiredReloadView){
                                        await controller.closeView(urlOrderView);
                                    }
                                    $timeout(function () {
                                        $location.url(urlOrderView);
                                    }, 250);
                                }
                            }
 
                        }
                    },
                    {
                        name: i18n('l-remove-items'),
                        icon: 'glyphicon-remove',
                        click: function () {
                            controller.simpleOrderItemsToNewOrder.length = 0;
                            controller.createShoppingCartToOrder();
                        }
                    },
                    {
                        name: i18n('l-remove-shopping-cart'),
                        icon: 'glyphicon-remove',
                        click: function () {
                            controller.bussinessContexts.removeContext('selected.sales.order');
                            controller.simpleOrderItemsToNewOrder.length = 0;
                            controller.orderId = undefined;
                            controller.order2CustomerId = undefined;
                            controller.order2modelId = undefined;
                            controller.createShoppingCart();
                        }
                    }],
                    { complete: false, orderId: controller.orderId, simpleOrderItems: controller.simpleOrderItemsToNewOrder, order2: controller.newOrderInclusionFlow, isQuotation: controller.isQuotation, shoppingCartActionAdd: controller.newOrder, order2CustomerId: controller.order2CustomerId, order2modelId: controller.order2modelId });

            };

            this.closeView = async function (urlView) {

				var views = appViewService.openViews;
				var i, len = views.length, view;

				for (i = 0; i < len; i += 1) {
					if (views[i].url === urlView) {
						view = views[i];
						break;
					}
				}

				if (view)
					await appViewService.removeView(view);
		   };


            this.start = function () {
                for (var i = controller.currentUserRoles.length - 1; i >= 0; i--) {
                    if (controller.currentUserRoles[i] == "representative") {
                        controller.isRepresentative = true;
                        controller.papel = '/dts/mpd/customers';
                    }

                    if (controller.currentUserRoles[i] == "customer") {
                        controller.isCustomer = true;
                        controller.papel = '/dts/mpd/model';
                    }

                }

                // Busca todas as empresas vinculadas ao usuario logado | Método getDataCompany presente na fchdis0035api.js |
                if (companyChange.checkContextData() === false) {
                    companyChange.getDataCompany(true);
                }

                // busca os dados novamente quando feita a troca de empresa
                $rootScope.$$listeners['mpd.selectCompany.event'] = [];
                $rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {
                    controller.search();
                });

                controller.loadData();

                if (controller.bussinessContexts) {
                    if (!controller.bussinessContexts.getContextData('selected.sales.order')) {
                        controller.createShoppingCart();
                    }
                }
            }

			customService.callCustomEvent('beforeInitPage', {controller: controller});
			customService.callEvent ('salesorder.priceItem', 'beforeInitPage', {controller: controller});
            var viewName = i18n('l-item-list') + " - " +  decodeURIComponent($stateParams.nrTabPre)

            if (appViewService.startView( viewName, 'salesorder.priceItem.Controller', this)) {

                fchdis0035.getUserRoles({ usuario: userdata['user-name'] }, function (result) {
                    controller.currentUserRoles = result.out.split(",");

                    fchdis0035.getVisibleFields(paramVisibleFieldsPedVendaLista, function (result) {
                        angular.forEach(result, function (value) {
                            if (value.fieldName === "novo-fluxo-inclusao-pedido") {
                                controller.newOrderInclusionFlow = value.fieldEnabled;
                            }
                        });

                        controller.start();
                    });
                });

            } else {

                // busca os dados novamente quando feita a troca de empresa
                $rootScope.$$listeners['mpd.selectCompany.event'] = [];
                $rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {
                    controller.search();
                });                

                if (encodeURIComponent(controller.nrTabPre) != $stateParams.nrTabPre){
                    controller.loadData();
                }    
            }


        } // function pricesCtrl(loadedModules) 

        index.register.controller('salesorder.priceItem.Controller', pricesCtrl);
    });