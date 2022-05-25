define(['index',  
        '/dts/mpd/js/portal-factories.js', 
        '/dts/mpd/html/order/shoppingcart.js',
        '/dts/mpd/js/api/fchdis0035api.js'], function (index) {

    index.stateProvider
            .state('dts/mpd/productdetail', {
                abstract: true,
                template: '<ui-view/>'
            })
            .state('dts/mpd/productdetail.start', {
                url: '/dts/mpd/productdetail/{itCodigo}?codRefer',
                controller: 'salesorder.productdetail.Controller',
                controllerAs: 'controller',
                templateUrl: '/dts/mpd/html/productdetail/productdetail.html'
            });

            productDetailCtrl.$inject = ['totvs.app-main-view.Service', 
                                         'salesorder.products.Factory', 
                                         '$injector', 
                                         '$stateParams', 
                                         'salesorder.shoppingcart.component', 
                                         '$filter', 
                                         '$rootScope', 
                                         'salesorder.salesorders.Factory', 
                                         'TOTVSEvent',
                                         'portal.getUserData.factory',
                                         'mpd.fchdis0035.factory'];
            function productDetailCtrl(appViewService, 
                                       serviceProducts, 
                                       $injector, 
                                       $stateParams, 
                                       shoppingcartcomponent, 
                                       $filter, 
                                       $rootScope, 
                                       orderResource, 
                                       TOTVSEvent,
                                       userdata,
                                       fchdis0035) {
        var ctrl = this;
        var i18n = $filter('i18n');
         
        ctrl.bussinessContexts = null;
        ctrl.newOrderInclusionFlow = false;
        
        if ($injector.has('totvs.app-bussiness-Contexts.Service')) {
        	ctrl.bussinessContexts = $injector.get('totvs.app-bussiness-Contexts.Service');
        }


        ctrl.params = {
            itCodigo: $stateParams.itCodigo,
            codRefer: $stateParams.codRefer || " "
        };

        ctrl.startup = function () {
            if (appViewService.startView(i18n('l-product-details') + " " + ctrl.params.itCodigo, 'salesorder.productdetail.Controller', this)) {

                var paramVisibleFieldsPedVendaLista = {cTable: "ped-venda-lista"};
                
                fchdis0035.getVisibleFields(paramVisibleFieldsPedVendaLista, function(result) {
                    angular.forEach(result, function(value) {
                        if (value.fieldName === "novo-fluxo-inclusao-pedido") {
							ctrl.newOrderInclusionFlow = value.fieldEnabled; 
						}
                    });
				});

                ctrl.loadData();
                ctrl.isStarted = true;
            }

            if(!ctrl.isStarted){
                ctrl.loadData();
            }
        };

        ctrl.loadData = function () {
            ctrl.model = serviceProducts.getItemDetails(ctrl.params, function (data) {
                ctrl.createSimpleOrderItem();
            });
        };


        ctrl.createSimpleOrderItem = function () {
            ctrl.simpleOrderItemObj = {'cod-refer': '',
                'cod-un': '',
                'epcValue': '',
                'hasBalance': false,
                'hasEquivalent': false,
                'hasRelated': false,
                'hasRelatedPrice': false,
                'it-codigo': '',
                'itemDesc': '',
                'nom-imagem': '',
                'nr-sequencia': 0,
                'nr-tabpre': '',
                'precosUnidade': '',
                'qt-un-fat': 0,
                'qtdToAddCart': 0,
                'relatedPrices': [],
                'situacao': '',
                'vl-preuni': 0,
                'vl-saldo': 0,
                'vl-tot-it': 0};

            ctrl.simpleOrderItemObj['cod-refer'] = ctrl.params.codRefer;
            ctrl.simpleOrderItemObj['cod-un'] = ctrl.model.ttProductDetails[0]['cod-un'];
            ctrl.simpleOrderItemObj['epcValue'] = '';
            ctrl.simpleOrderItemObj['hasBalance'] = false;
            ctrl.simpleOrderItemObj['hasEquivalent'] = ctrl.model.ttEquivalentProduct.length > 0;
            ctrl.simpleOrderItemObj['hasRelated'] = ctrl.model.ttRelatedProduct.length > 0;
            ctrl.simpleOrderItemObj['hasRelatedPrice'] = ctrl.model.ttRelatedProduct.length > 0;
            ctrl.simpleOrderItemObj['it-codigo'] = ctrl.model.ttProductDetails[0]['it-codigo'];
            ctrl.simpleOrderItemObj['itemDesc'] = ctrl.model.ttProductDetails[0]['itemDesc'];
            ctrl.simpleOrderItemObj['nom-imagem'] = ctrl.model.ttProductDetails[0]['nom-imagem'];
            ctrl.simpleOrderItemObj['nr-sequencia'] = 0;
            ctrl.simpleOrderItemObj['nr-tabpre'] = '';
            ctrl.simpleOrderItemObj['precosUnidade'] = '';
            ctrl.simpleOrderItemObj['qt-un-fat'] = 0;
            ctrl.simpleOrderItemObj['relatedPrices'] = [];
            ctrl.simpleOrderItemObj['situacao'] = '';
            ctrl.simpleOrderItemObj['vl-preuni'] = 0;
            ctrl.simpleOrderItemObj['vl-saldo'] = 0;
            ctrl.simpleOrderItemObj['vl-tot-it'] = 0;
        };

        ctrl.addItemToShoppingCart = function (price) {
            if (price.qtdToAddCart > 0) {
                
                if (price['qtdToAddCart'] < price['quant-min']) {
                    var message = '';
                    if((price['cod-refer'] == '') || (price['cod-refer'] == undefined)){
                        message = i18n('l-alert-item') + price['it-codigo'] + i18n('l-alert-item-qtd-min');
                    }else{
                        message = i18n('l-alert-item') + price['it-codigo'] +  i18n('l-com-referencia') + price['cod-refer'] +  i18n('l-alert-item-qtd-min');
                    }

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'alert',
                        title: i18n('l-quant-min') + ".",
                        detail: message
                    });
                }else{                
                    ctrl.simpleOrderItemObj['vl-preuni'] = price['preco-venda'];
                    ctrl.simpleOrderItemObj['qt-un-fat'] = price['qtdToAddCart'];
                    ctrl.simpleOrderItemObj['cod-un']    = price['cod-unid-med'];
                    ctrl.simpleOrderItemObj['nr-tabpre'] = price['nr-tabpre'];

                    if (ctrl.bussinessContexts.getContextData('selected.sales.order')) {
                        if (ctrl.bussinessContexts.getContextData('selected.sales.order').orderId != undefined)
                           var nrPedidoShoppingCart = ctrl.bussinessContexts.getContextData('selected.sales.order').orderId
                        else
                           var nrPedidoShoppingCart = 0;
                    } 
                }

                orderResource.validateOrderItem({
                    nrPedido: nrPedidoShoppingCart
                }, ctrl.simpleOrderItemObj, function(result) {
                    if (!result.$hasError){ 
                        
                        if (ctrl.bussinessContexts) {
                            //Responsavel por gerar o carrinho utilizando o arquivo shoppingcart.js
                            if (ctrl.bussinessContexts.getContextData('selected.sales.order')) {
                                ctrl.dataContext = ctrl.bussinessContexts.getContextData('selected.sales.order');
                                //Adicionar um item no carrinho
                                if(result[0] != undefined)
                                    ctrl.dataContext.simpleOrderItems.push(ctrl.simpleOrderItemObj);
                                price.qtdToAddCart = 0;
                                //Define a url para compeltar o carrinho cliente/representante
                                shoppingcartcomponent.roleurl = ctrl.roleurl;
                                shoppingcartcomponent.startShoppingCart();
                            } else {
                                shoppingcartcomponent.roleurl = ctrl.roleurl;
                                shoppingcartcomponent.startShoppingCart();
                            }
                        }                            
                    }
                });                

            }

        };


        fchdis0035.getUserRoles({usuario: userdata['user-name']}, function(result){                
            ctrl.currentUserRoles = result.out.split(",");
            
            for (var i = ctrl.currentUserRoles.length - 1; i >= 0; i--) {
                if(ctrl.currentUserRoles[i] == "representative"){
                    ctrl.isRepresentative = true;
                    ctrl.roleurl = '/dts/mpd/customers';
                }

                if(ctrl.currentUserRoles[i] == "customer"){
                    ctrl.isCustomer = true;	
                    ctrl.roleurl = '/dts/mpd/model';		
                }
                
            }

            shoppingcartcomponent.roleurl = ctrl.roleurl;
            shoppingcartcomponent.startShoppingCart();
        
            ctrl.startup();

        });    

    }



    index.register.controller('salesorder.productdetail.Controller', productDetailCtrl);

});