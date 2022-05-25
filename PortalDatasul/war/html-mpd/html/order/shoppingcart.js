define(['index'], function(index) {

    shoppingcartsalesorder.$inject = ['$injector', '$filter', '$location', '$rootScope', 'TOTVSEvent', 'totvs.app-main-view.Service', '$timeout'];
    function shoppingcartsalesorder($injector, $filter, $location,  $rootScope, TOTVSEvent, appViewService, $timeout) {

        var ctrl = this;
        var i18n = $filter('i18n');
        
        ctrl.bussinessContexts = null;

        if ($injector.has('totvs.app-bussiness-Contexts.Service')) {
        	ctrl.bussinessContexts = $injector.get('totvs.app-bussiness-Contexts.Service');
        }
        
        
        ctrl.objContext = null;
        
        this.startShoppingCart = function(){
        	
        	if (ctrl.bussinessContexts) {
                if(ctrl.bussinessContexts.getContextData('selected.sales.order')){
                    ctrl.objContext = ctrl.bussinessContexts.getContextData('selected.sales.order');
                        
                    if(ctrl.objContext.orderId != undefined){
                        ctrl.createCartToSelectedOrder(); 
                    }else{
                        ctrl.createCartToNewOrder();
                    }
                }else{
                    ctrl.createCartToNewOrder();
                }                        
        	}
            
        };

        this.createCartToNewOrder = function() {

        	if (ctrl.bussinessContexts) {
        		
                if(!ctrl.bussinessContexts.getContextData('selected.sales.order')){
                    ctrl.objContext = {complete: false, orderId: undefined, simpleOrderItems: [], order2: undefined, isQuotation: undefined, shoppingCartActionAdd: false, order2CustomerId: undefined, order2modelId: undefined};
                }    
            
                ctrl.bussinessContexts.setContext('selected.sales.order',
                        i18n('l-shopping-cart') + ' ' + ' (' + ctrl.objContext.simpleOrderItems.length + ' ' + i18n('l-items-qtd') + ')',
                        'glyphicon-shopping-cart',
                        [{name: i18n('btn-complete') + ' (' + ctrl.objContext.simpleOrderItems.length + ' ' + i18n('l-items-qtd') + ')',
                                icon: 'glyphicon-ok',
                                click: async function() {

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
    
                                    if (!ctrl.objContext.simpleOrderItems.length){
                                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                            type:   'error',
                                            title:  $rootScope.i18n('l-shopping-cart', [], 'dts/mpd'),
                                            detail: $rootScope.i18n('msg-shopping-cart-required', [], 'dts/mpd') + '.'
                                        });
                                    } else {

                                        if (!ctrl.bussinessContexts.getContextData('selected.sales.order').complete) {
                                            ctrl.objContext = ctrl.bussinessContexts.getContextData('selected.sales.order');
                                            ctrl.objContext.complete = true;
                                            ctrl.bussinessContexts.setContextData('selected.sales.order', ctrl.objContext);
                                        }

                                        if(!inHeader){
                                            $location.url(ctrl.roleurl);
                                        }

                                    }    
                                }
                            },
                            {name: i18n('l-remove-shopping-cart'),
                                icon: 'glyphicon-remove',
                                click: function() {
                                    ctrl.bussinessContexts.removeContext('selected.sales.order');
                                    ctrl.objContext.simpleOrderItems.length = 0;
                                }
                            }],
                        ctrl.objContext);

        	}

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

        this.createCartToSelectedOrder = function() {

        	if (ctrl.bussinessContexts) {

                var urlOrderView = "";

                if(ctrl.objContext.shoppingCartActionAdd && ctrl.objContext.order2){
                    urlOrderView = '#/dts/mpd/order2/new/' + ctrl.objContext.order2CustomerId;
                } else if (!ctrl.objContext.shoppingCartActionAdd && ctrl.objContext.order2) {
                    if (ctrl.objContext.order2modelId) {
                        urlOrderView = '#/dts/mpd/order2/' + ctrl.objContext.orderId + '/edit?modelId=' + ctrl.objContext.order2modelId;
                    }else {
                        urlOrderView = '#/dts/mpd/order2/' + ctrl.objContext.orderId + '/edit' + ctrl.objContext.orderId;
                    }
                } else {
                    urlOrderView = '#/dts/mpd/order/' + ctrl.objContext.orderId;
                }

                if(ctrl.objContext.isQuotation) {
                    if(ctrl.objContext.shoppingCartActionAdd) {
                        urlOrderView = '/dts/mpd/quotation/new' + ctrl.objContext.order2CustomerId;
                    } else {
                        if (ctrl.objContext.order2modelId) {
                            urlOrderView = '/dts/mpd/quotation/' + ctrl.objContext.orderId + '/edit?modelId=' + ctrl.objContext.order2modelId;
                        }else {
                            urlOrderView = '/dts/mpd/quotation/' + ctrl.objContext.orderId + '/edit' + ctrl.objContext.orderId;
                        }
                    }
                }

                ctrl.bussinessContexts.setContext('selected.sales.order',
                        i18n('l-shopping-cart') + ' ' + ctrl.objContext.orderId + ' (' + ctrl.objContext.simpleOrderItems.length + ' ' + i18n('l-items-qtd') + ')',
                        'glyphicon-shopping-cart',
                        [{name: i18n('btn-complete') + ' ' + ctrl.objContext.orderId +  ' (' + ctrl.objContext.simpleOrderItems.length + ' ' + i18n('l-items-qtd') + ')',
                                icon: 'glyphicon-ok',
                                click: async function() {

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
                                    
                                    if(url.indexOf('dts/mpd/quotation/' + ctrl.objContext.orderId + '/edit') !== -1) {
                                        requiredReloadView = true;
                                    }
                                    
                                    if(url.indexOf('dts/mpd/order2/' + ctrl.objContext.orderId + '/edit') !== -1) {
                                        requiredReloadView = true;
                                    }


                                    if (!ctrl.objContext.simpleOrderItems.length){
                                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                            type:   'error',
                                            title:  $rootScope.i18n('l-shopping-cart', [], 'dts/mpd'),
                                            detail: $rootScope.i18n('msg-shopping-cart-required', [], 'dts/mpd') + '.'
                                        });
                                    } else {

                                        if (!ctrl.bussinessContexts.getContextData('selected.sales.order').complete) {
                                            ctrl.objContext = ctrl.bussinessContexts.getContextData('selected.sales.order');
                                            ctrl.objContext.complete = true;
                                            ctrl.bussinessContexts.setContextData('selected.sales.order', ctrl.objContext);
                                        }
     
                                        if(!inHeader){
                                            if(requiredReloadView){
                                                await ctrl.closeView(urlOrderView);
                                            }

                                            $timeout(function () {
                                                $location.url(urlOrderView);
                                            }, 250)
                                        };
                                        
                                    }

                                }
                            },
                            {name: i18n('l-remove-items'),
                                icon: 'glyphicon-remove',
                                click: function() {
                                    ctrl.objContext.simpleOrderItems.length = 0;
                                    ctrl.createCartToSelectedOrder();
                                }
                            },
                            {name: i18n('l-remove-shopping-cart'),
                                icon: 'glyphicon-remove',
                                click: function() {
                                    ctrl.bussinessContexts.removeContext('selected.sales.order');
                                    ctrl.objContext.simpleOrderItems.length = 0;
                                    ctrl.objContext.orderId = undefined;
                                    ctrl.createCartToNewOrder();
                                }
                            }],
                        ctrl.objContext);
        		
        	}

        };

        if (ctrl.bussinessContexts) {
        	
            if (ctrl.bussinessContexts.getContextData('selected.sales.order')) {
                ctrl.objContext = ctrl.bussinessContexts.getContextData('selected.sales.order');
            } else {
                this.createCartToNewOrder();
            }        
        }
        

    };

    index.register.service('salesorder.shoppingcart.component', shoppingcartsalesorder);
});