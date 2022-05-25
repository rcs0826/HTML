define(['index',
    // Modal pd4000.item: Fachada para o pedido HTML(openItemModal).
    '/dts/mpd/js/api/fchdis0051.js',

    // Modal pd4000.item: Message com controle de foco(openItemModal).
    '/dts/dts-utils/js/msg-utils.js',

    // Modal pd4000.item: Controller da sub-tela(openItemModal).
    '/dts/mpd/html/pd4000/pd4000.item.js',

    // Modal pd4000.item: Configurador de produtos(openItemModal).
    '/dts/mcf/html/pendingproduct/pendingproduct-informConfiguration.js',

    // Modal pd4000.item: Zoom(openItemModal).
    '/dts/mpd/js/zoom/referencia.js',
    '/dts/mcc/js/zoom/tab-unidade.js',
	'/dts/mpd/js/zoom/tb-preco-inter.js',
	'/dts/mpd/js/zoom/natur-oper.js',
	'/dts/mpd/js/zoom/classif-fisc.js',
	'/dts/mpd/js/zoom/tab-codser.js',
	'/dts/mpd/js/zoom/loc-entr.js',
	'/dts/mpd/js/zoom/unid-negoc.js',
	'/dts/mpd/js/zoom/campanha.js',
	'/dts/mpd/js/zoom/estabelec.js',
	'/dts/utb/js/zoom/cta-ctbl-integr.js',
	'/dts/utb/js/zoom/ccusto.js',

    // Modal narrative: Import's necessários para abertura da modal narrativa(openConfigNarrative).
    '/dts/mpd/html/order2/orderItems.js',
    '/dts/mpd/js/api/cfapi004.js',

    // Internalorderdetail.
    '/dts/mpd/js/api/fchdis0046.js',
    '/dts/mpd/html/pd4000/pd4000.print.js',
    '/dts/mpd/js/api/fchdis0051.js',
    '/dts/mpd/js/portal-factories.js',
    '/dts/mpd/js/userpreference.js',
    '/dts/dts-utils/js/lodash-angular.js',], function(index) {

        index.stateProvider
            .state('dts/mpd/internalorderdetail', {
                abstract: true,
                template: '<ui-view/>'
            })
            .state('dts/mpd/internalorderdetail.start', {
                url: '/dts/mpd/internalorderdetail/:orderId',
                controller: 'salesorder.internalorderdetail.controller',
                controllerAs: 'controller',
                templateUrl: '/dts/mpd/html/internalorderdetail/internalorderdetail.html'
            });

        internalOrderDetailCtrl.$inject = [
            '$rootScope',
            'totvs.app-main-view.Service',
            '$stateParams',
            '$window',
            'mpd.fchdis0046.Factory',
            '$filter',
            'customization.generic.Factory',
            '$modal',
            'mpd.fchdis0051.Factory',
            '$location',
            '$q',
            'userPreference'
        ];

        function internalOrderDetailCtrl(
            $rootScope,
            appViewService,
            $stateParams,
            $window,
            fchdis0046,
            $filter,
            customService,
            $modal,
            fchdis0051,
            $location,
            $q,
            userPreference,
        ) {
            var ctrl = this;
            var i18n = $filter('i18n');

            this.startOpenedOrderDetail = false;
            this.startExpandedGroupsDetail = true;
            this.orderId = $stateParams.orderId;

            appViewService.startView(i18n('l-order-details') + " " + this.orderId, 'salesorder.internalorderdetail.controller');

            $q.all([
                userPreference.getPreference('salesorder.orderDetailConfig.positionGroupsCode'),
                userPreference.getPreference('salesorder.orderDetailConfig.visibleGroupsCode'),
                userPreference.getPreference('salesorder.orderDetailConfig.startOpenedOrderDetail'),
                userPreference.getPreference('salesorder.orderDetailConfig.startExpandedOrderDetail')
            ]).then(function (data) {
                    if (data[0].prefValue)
                        ctrl.positionGroupsCode = data[0].prefValue;
                    if (data[1].prefValue)
                        ctrl.visibleGroupsCode = data[1].prefValue;
                    if (data[2].prefValue)
                        ctrl.startOpenedOrderDetail = data[2].prefValue;
                    if (data[3].prefValue)
                        ctrl.startExpandedGroupsDetail = data[3].prefValue;

                    if (ctrl.startOpenedOrderDetail === 'true') {
                        ctrl.startOpenedOrderDetail = true;
                    } else {
                        ctrl.startOpenedOrderDetail = false;
                    }

                    ctrl.listGroups = [{ item: { codeGroup: 1, groupName: $rootScope.i18n('l-dados-gerais'), visible: false, expanded: true, avalaible: true } },
                    { item: { codeGroup: 2, groupName: $rootScope.i18n('l-informacoes-fiscais'), visible: false, expanded: true, avalaible: true } },
                    { item: { codeGroup: 3, groupName: $rootScope.i18n('l-valores-do-pedido'), visible: false, expanded: true, avalaible: true } },
                    { item: { codeGroup: 4, groupName: $rootScope.i18n('l-informacoes-de-data'), visible: false, expanded: true, avalaible: true } },
                    { item: { codeGroup: 5, groupName: $rootScope.i18n('l-endereco-entrega'), visible: false, expanded: true, avalaible: true } },
                    { item: { codeGroup: 6, groupName: $rootScope.i18n('l-observacoes'), visible: false, expanded: true, avalaible: true } },
                    { item: { codeGroup: 7, groupName: $rootScope.i18n('l-cancelamento'), visible: false, expanded: true, avalaible: true } },
                    { item: { codeGroup: 8, groupName: $rootScope.i18n('l-sup-reat'), visible: false, expanded: true, avalaible: true } },
                    { item: { codeGroup: 9, groupName: $rootScope.i18n('l-impl-alt'), visible: false, expanded: true, avalaible: true } },
                    { item: { codeGroup: 10, groupName: $rootScope.i18n('l-credit-aval'), visible: false, expanded: true, avalaible: true } },
                    { item: { codeGroup: 11, groupName: $rootScope.i18n('l-prices'), visible: false, expanded: true, avalaible: true } },
                    { item: { codeGroup: 12, groupName: $rootScope.i18n('l-faturamento'), visible: false, expanded: true, avalaible: true } },
                    { item: { codeGroup: 13, groupName: $rootScope.i18n('l-pre-faturamento'), visible: false, expanded: true, avalaible: true } },
                    { item: { codeGroup: 14, groupName: $rootScope.i18n('l-cobranca'), visible: false, expanded: true, avalaible: true } },
                    { item: { codeGroup: 15, groupName: $rootScope.i18n('l-discounts'), visible: false, expanded: true, avalaible: true } },
                    { item: { codeGroup: 16, groupName: $rootScope.i18n('l-bonificacao'), visible: false, expanded: true, avalaible: true } },
                    { item: { codeGroup: 17, groupName: $rootScope.i18n('l-fiscal-data'), visible: false, expanded: true, avalaible: true } },
                    { item: { codeGroup: 18, groupName: $rootScope.i18n('l-customer'), visible: false, expanded: true, avalaible: true } },
                    { item: { codeGroup: 19, groupName: $rootScope.i18n('l-frete'), visible: false, expanded: true, avalaible: true } },
                    { item: { codeGroup: 20, groupName: $rootScope.i18n('l-multiplanta'), visible: false, expanded: true, avalaible: true } },
                    { item: { codeGroup: 21, groupName: $rootScope.i18n('l-vendor'), visible: true, expanded: true, avalaible: false } },
                    { item: { codeGroup: 22, groupName: $rootScope.i18n('l-graos'), visible: true, expanded: true, avalaible: false } }];

                    // Se não houver configuração do usuário para posicionar os grupos todos devem ser viviveis            
                    if (ctrl.positionGroupsCode == undefined || ctrl.positionGroupsCode == null || ctrl.positionGroupsCode == "") {
                        angular.forEach(ctrl.listGroups, function (group) {
                            group.item.visible = true;
                        });
                    }

                    if (ctrl.startExpandedGroupsDetail === 'true') {
                        ctrl.startExpandedGroupsDetail = true;
                    } else {
                        ctrl.startExpandedGroupsDetail = false;
                    }

                    if (ctrl.startOpenedOrderDetail === true) {
                        ctrl.startOpenOrderDetails();
                    }

                    ctrl.startLoad();
                }
            );

            this.checkVisibleInfGroups = function() {
                // Verifica se existe configuração de grupos visiveis    
                if (ctrl.visibleGroupsCode) {
                    // Atualiza os grupos visiveis baseado na configuração do usuário
                    ctrl.arrayVisibleGroup = ctrl.visibleGroupsCode.split(',');
                    angular.forEach(ctrl.listGroups, function(group) {
                        for (i = 0; i < ctrl.arrayVisibleGroup.length; i++) {
                            if (group.item.codeGroup == ctrl.arrayVisibleGroup[i])
                                group.item.visible = true;
                        }
                    });
                }

                angular.forEach(ctrl.listGroups, function(group) {
                    // Verifica se os grupos devem abrir expandidos
                    if (ctrl.startExpandedGroupsDetail === true)
                        group.item.expanded = true;
                    else
                        group.item.expanded = false;
                });
            }

            this.checkOrderInfGroups = function() {
                ctrl.reorderListGroups = [];

                // Realiza reordenação de grupos apenas se houver uma configuração do usuário
                if (ctrl.positionGroupsCode) {
                    ctrl.arrayPositionGroups = ctrl.positionGroupsCode.split(',');

                    // Reordena os grupos baseados nas configurações do usuário
                    for (i = 0; i < ctrl.arrayPositionGroups.length; i++) {
                        angular.forEach(ctrl.listGroups, function(group) {
                            if (group.item.codeGroup == ctrl.arrayPositionGroups[i])
                                ctrl.reorderListGroups.push(group);
                        });
                    }

                    ctrl.listGroups = ctrl.reorderListGroups;
                }
            }

            this.startOpenOrderDetails = function() {
                var group = $('#tgcOrderDetail').find('.content');
                group.addClass('open');
                group.attr('style', '');
                // var spanGroupTitle = $("a[ng-click='toggleContent();']").find("span");
                // spanGroupTitle.replaceWith("&#9660;");
            }

            this.startLoad = function() {
                fchdis0046.getOrderByOrderAdder({ nrPedido: ctrl.orderId }, function(result) {
                    ctrl.ttOrderDetails = result.ttOrderDetails[0];

                    if (result.ttOrderItem) {
                        ctrl.ttOrderItem = result.ttOrderItem;
                    }
                    if (result.ttOrderVendor.length > 0) {
                        ctrl.ttOrderVendor = result.ttOrderVendor[0];
                    }

                    ctrl.orderparams = result.ttOrderParams;

                    angular.forEach(ctrl.orderparams, function(row) {
                        switch (row['codParam']) {
                            case 'modulo-graos':
                                ctrl.ttOrderDetails['modulo-graos'] = row.valParam;
                                ctrl.listGroups[21].item.avalaible = true;
                                break;
                            case 'funcao-vendor':
                                ctrl.ttOrderDetails['funcao-vendor'] = row.valParam;
                                ctrl.listGroups[20].item.avalaible = true;
                                break;
                            case 'ecommerce':
                                ctrl.ttOrderDetails['ecommerce'] = row.valParam;
                                break;
                        }
                    });

                    customService.callCustomEvent('afterGetOrderByOrderAdder', ctrl);
                    ctrl.checkVisibleInfGroups();
                    ctrl.checkOrderInfGroups();
                });
            };

            this.loadRepresentative = function() {
                if (!ctrl.ttOrderRepresentative) {
                    fchdis0046.getOrderRepresentatives({ nrPedido: ctrl.orderId }, function(result) {
                        ctrl.ttOrderRepresentative = result;
                    });
                }
            };

            this.loadPaymentEcommerce = function() {
                if (!ctrl.ttOrderPaymentEcommerce) {
                    fchdis0046.getPaymentEcommerce({ nrPedido: ctrl.orderId }, function(result) {
                        ctrl.ttOrderPaymentEcommerce = result;
                    });
                }
            };

            this.loadSpecialPaymentConditions = function() {
                if (!ctrl.ttOrderSpecialPaymentCondition) {
                    fchdis0046.getOrderSpecialPaymentConditions({ nrPedido: ctrl.orderId }, function(result) {
                        ctrl.ttOrderSpecialPaymentCondition = result;
                    });
                }
            };

            this.loadPrepayments = function() {
                if (!ctrl.ttPrepayment) {
                    fchdis0046.getPrepayments({ nrPedido: ctrl.orderId }, function(result) {
                        ctrl.ttPrepayment = result;
                    });
                }
            };

            this.loadInvoices = function() {
                if (!ctrl.ttSimpleInvoice) {
                    fchdis0046.getInvoices({ nrPedido: ctrl.orderId }, function(result) {
                        ctrl.ttSimpleInvoice = result;
                    });
                }
            };

            this.loadShipments = function() {
                if (!ctrl.ttSimpleShipment) {
                    fchdis0046.getShipments({ nrPedido: ctrl.orderId }, function(result) {
                        ctrl.ttSimpleShipment = result;
                    });
                }
            };

            this.loadParamItemCommission = function() {
                fchdis0046.getItemCommission({}, function(result) {
                    ctrl.showCommissionValues = result;
                });
            };

            this.loadOrderTickets = function() {
                fchdis0046.getOrderSupplierTickets({ nrPedido: ctrl.orderId }, function(result) {
                    ctrl.ttOrderSupplierTickets = ctrl.getTicketsWithDateTime(result);
                });
            }
			
	        this.cancelOrderTickets = function() {
                fchdis0046.cancelOrderSupplierTickets({ nrPedido: ctrl.orderId }, function(result) {
			        ctrl.loadOrderTickets();
                });
            }

            this.getTicketsWithDateTime = function(result) {
                if (result && result.length > 0) {
                    angular.forEach(result, function(it) {
                        if (it["dat-solicit-pre-autoriz"])
                            it["dat-solicit-pre-autoriz"] = new Date(it["dat-solicit-pre-autoriz"]);

                        if (it["dat-cancel-pre-autoriz"])
                            it["dat-cancel-pre-autoriz"] = new Date(it["dat-cancel-pre-autoriz"]);

                        if (it["dat-vigenc-pre-autoriz"])
                            it["dat-vigenc-pre-autoriz"] = new Date(it["dat-vigenc-pre-autoriz"]);                        
                    });
                }

                return result;
            }

            this.print = function() {
                var modalInstance = $modal.open({
                    templateUrl: '/dts/mpd/html/pd4000/pd4000.print.html',
                    controller: 'salesorder.pd4000Print.Controller as printController',
                    size: 'lg',
                    resolve: {
                        orderstatus: function() {
                            return {
                                cancalculate: false,
                                iscompleted: true
                            }
                        }
                    }
                });

                modalInstance.result.then(function(data) {
                    data.orderId = ctrl.orderId

                    fchdis0051.getPrintUrl(data, function(url) {
                        $window.open(url);
                    });
                });
            };

            this.openOrder = function() {
                $location.url('/dts/mpd/pd4000/' + ctrl.orderId);
            };

            this.openHistory = function() {
                $location.url('/dts/mpd/internalorderhistory/' + ctrl.orderId);
            };

            this.settings = function() {
                ctrl.openOrderDetailConfigModall();
            }

            this.openOrderDetailConfigModall = function() {
                var params = {};

                params = {
                    listGroups: ctrl.listGroups,
                    startOpenDetailsOrder: ctrl.startOpenedOrderDetail,
                    startExpandedGroupsDetail: ctrl.startExpandedGroupsDetail
                };

                var modalInstance = $modal.open({
                    templateUrl: '/dts/mpd/html/internalorderdetail/order-detail-config.html',
                    controller: 'salesorder.internalOrderDetailModalConfig.Controller as modalOrderDetailConfigController',
                    size: 'lg',
                    resolve: {
                        modalParams: function() {
                            return params;
                        }
                    }
                });

                modalInstance.result.then(function(dataModalController) {
                    ctrl.saveOrderDetailConfiguration(dataModalController);
                });
            };

            // metodo para salvar o registro de configuração de grupos de informações
            this.saveOrderDetailConfiguration = function(dataModalController) {
                ctrl.positionGroupsCode = '';
                ctrl.visibleGroupsCode = '';
                ctrl.listGroups = dataModalController.listGroups;
                ctrl.startOpenedOrderDetail = dataModalController.startOpenDetailsOrder;
                ctrl.startExpandedGroupsDetail = dataModalController.startExpandedGroupsDetail;

                for (var i = 0; i < dataModalController.listGroups.length; i++) {
                    ctrl.positionGroupsCode = ctrl.positionGroupsCode + ',' + dataModalController.listGroups[i].item.codeGroup;

                    if (dataModalController.listGroups[i].item.visible == true)
                        ctrl.visibleGroupsCode = ctrl.visibleGroupsCode + ',' + dataModalController.listGroups[i].item.codeGroup;
                }

                $q.all([userPreference.setPreference('salesorder.orderDetailConfig.positionGroupsCode', ctrl.positionGroupsCode),
                userPreference.setPreference('salesorder.orderDetailConfig.visibleGroupsCode', ctrl.visibleGroupsCode),
                userPreference.setPreference('salesorder.orderDetailConfig.startOpenedOrderDetail', dataModalController.startOpenDetailsOrder),
                userPreference.setPreference('salesorder.orderDetailConfig.startExpandedOrderDetail', dataModalController.startExpandedGroupsDetail)]).then(function () {
                });

                angular.forEach(ctrl.listGroups, function(group) {
                    // Verifica se os grupos devem ser expandidos
                    if (ctrl.startExpandedGroupsDetail === true)
                        group.item.expanded = true;
                    else
                        group.item.expanded = false;
                });
            }
        }//function internalOrderDetailCtrl()
        index.register.controller('salesorder.internalorderdetail.controller', internalOrderDetailCtrl);


        internalOrderDetailItemDetailCtrl.$inject = [
            '$scope',
            '$stateParams',
            '$timeout',
            '$filter',
            '$modal',
            '$compile',
            '$document',
            'mpd.fchdis0046.Factory',
            'mpd.fchdis0051.Factory',
            'order.itemconfig.narrative.modal'
        ];

        function internalOrderDetailItemDetailCtrl(
            $scope,
            $stateParams,
            $timeout,
            $filter,
            $modal,
            $compile,
            $document,
            fchdis0046,
            fchdis0051,
            modalItemConfigNarrative
        ) {
            var ctrl = this;
            var i18n = $filter('i18n');

            this.initItemDelivery = function(data) {
                if (data == undefined) return;

                ctrl.dataItem = data;
                // ctrl.loadSimpleDelivery(data);
            };

            this.loadSimpleDelivery = function(item) {
                if (item) {
                    if ((item['cod-refer'] == undefined) || (item['cod-refer'] == '')) {
                        item['cod-refer'] = ' '; // Espaço para parâmetro de url em branco
                    }

                    fchdis0046.getSimpleDelivery({
                        nrPedido: $stateParams.orderId,
                        nrSequencia: item['nr-sequencia'],
                        itCodigo: item['it-codigo'],
                        codRefer: item['cod-refer']
                    }, function (result) {
                        ctrl.ttSimpleDelivery = result;
                        ctrl.openItemDeliveryModal(item);
                    });
                }
            };

            this.loadItemInvoices = function(item) {
                if (item) {
                    if ((item['cod-refer'] == undefined) || (item['cod-refer'] == '')) {
                        item['cod-refer'] = ' '; // Espaço para parâmetro de url em branco
                    }
                    fchdis0046.getItemInvoices({
                        nrPedido: $stateParams.orderId,
                        nrSequencia: item['nr-sequencia'],
                        itCodigo: item['it-codigo'],
                        codRefer: item['cod-refer']
                    }, function (result) {
                        ctrl.ttSimpleInvoice = result;
                        ctrl.openItemInvoiceModal(item);
                    });
                }
            };

            this.openItemDeliveryModal = function(item) {
                var params = {};

                params = {
                    ttOrderItem: item,
                    ttSimpleDelivery: ctrl.ttSimpleDelivery
                };

                var modalInstance = $modal.open({
                    templateUrl: '/dts/mpd/html/internalorderdetail/order-detail-item-delivery-grid.html',
                    controller: 'salesorder.internalOrderDetailModalItemDelivery.Controller as modalItemDeliveryController',
                    size: 'lg',
                    resolve: {
                        modalParams: function () {
                            return params;
                        }
                    }
                });
            };

            this.openItemInvoiceModal = function(item) {
                var params = {};

                params = {
                    ttOrderItem: item,
                    ttSimpleInvoice: ctrl.ttSimpleInvoice
                };

                var modalInstance = $modal.open({
                    templateUrl: '/dts/mpd/html/internalorderdetail/order-detail-item-invoices-grid.html',
                    controller: 'salesorder.internalOrderDetailModalItemInvoice.Controller as modalItemInvoiceController',
                    size: 'lg',
                    resolve: {
                        modalParams: function () {
                            return params;
                        }
                    }
                });
            };

            this.openItemModal = function(dataItem) {
                fchdis0051.getParameters(function result(result) {
                    ctrl.orderParameters = result.ttOrderParameters[0];

                    ctrl.permissions = {
                        'ped-venda-add': [],
                        'ped-venda-edit': [],
                        'ped-item-add-edit': [],
                        'ped-item-child': [],
                        'ped-item-fastadd': [],
                        'ped-item-grid': [],
                        'ped-item-search': [],
                        'ped-repre': [],
                        'ped-ent': [],
                        'ped-repres-item': [],
                        'ped-saldo': [],
                        'pd4000': [],
                        'carteira-pedidos': []
                    }

                    ctrl.pd4000 = {
                        "rentabilidade-pedido": false,
                        "rentabilidade-detalhe-pedido": false,
                        "peso-pedido": false,
                        "peso-atendido-pedido": false,
                        "peso-aberto-pedido": false,

                        "adicionar-item": false,
                        "adicionar-fast-item": false,
                        "adicionar-filho-item": false,
                        "editar-item": false,
                        "editar-grade-item": false,
                        "remover-item": false,
                        "cancelar-item": false,

                        "aba-pesquisar": false,
                        "aba-cabecalho": false,
                        "aba-pagamento": false,
                        "aba-financiamento": false,
                        "aba-antecipacoes": false,
                        "aba-exportacao": false,
                        "aba-entregas": false,
                        "aba-representantes-item": false,
                        "aba-representantes-pedido": false,
                        "aba-alocacao": false,
                    };

                    for (var i = 0; i < result.ttVisibleFieldsPD4000.length; i++) {
                        var field = result.ttVisibleFieldsPD4000[i];
                        ctrl.permissions[field.screenName].push(field);
                        if (field.screenName == "pd4000") {
                            ctrl.pd4000[field.fieldName] = field;
                        }
                    }

                    for (var i = 0; i < ctrl.permissions['ped-item-add-edit'].length; i++) {
                        if (ctrl.permissions['ped-item-add-edit'][i].fieldName == 'vl-preori') {
                            ctrl.permissions['ped-item-add-edit'][i].fieldFormat = ctrl.originalPriceFormat;
                            ctrl.permissions['ped-item-add-edit'][i].fieldDecimalNumber = Number(ctrl.originalPriceNumberDecimalFormat);
                        }
                    }

                    if (dataItem) {
                        // Espaço para parâmetro de url em branco.
                        if ((dataItem['cod-refer'] == undefined) || (dataItem['cod-refer'] == '')) {
                            dataItem['cod-refer'] = ' ';
                        }

                        /**
                         * Pegando todas as informações do cabeçalho(order) e item(orderItem)
                         * do pedido para poder abrir a modal pd4000.item.
                         * ParamBonif também está sendo enviado na modal(this.itemModal).
                         * A cod-sit-ped(Order) está sendo utilizado para exibir o botão 'Detalhar'.
                         */
                        fchdis0051.getOrder({ nrPedido: $stateParams.orderId }, function (result) {
                            ctrl.order = result.ttOrder[0];
                            ctrl.ttParamBonif = result.ttParamBonif[0];

                            for (var i = 0; i < result.dsOrderItemPD4000.length; i++) {
                                if (
                                    dataItem['nr-sequencia'] == result.dsOrderItemPD4000[i]['nr-sequencia']
                                    && dataItem['it-codigo'] == result.dsOrderItemPD4000[i]['it-codigo']
                                ) {
                                    ctrl.orderItem = result.dsOrderItemPD4000[i];
                                    ctrl.itemModal();
                                }     
                            }
                        });
                    }
                });    
            };

            this.itemModal = function() {
                var modalInstance = $modal.open({
                    templateUrl: '/dts/mpd/html/pd4000/pd4000.item.html',
                    controller: 'salesorder.pd4000Item.Controller as itemController',
                    size: 'lg',
                    backdrop: 'static',
                    resolve: {
                        modalParams: function() {
                            return {
                                operation: 'show',
                                ttOrderParameters: null,
                                permissions: ctrl.permissions,
                                situacao: ctrl.orderItem['cod-sit-item'],
                                'nr-sequencia': ctrl.orderItem['nr-sequencia'],
                                'it-codigo': ctrl.orderItem['it-codigo'],
                                'cod-refer': ctrl.orderItem['cod-refer'],
                                item: ctrl.orderItem,
                                orderController: $scope.itemDetailController,
                                order: ctrl.order
                            };
                        }
                    }
                });

                modalInstance.result.then(function () {
                    $scope.$emit("salesorder.pd4000.loadorder","pd4000a");
                });
            };

            this.openConfigNarrative = function(itCodigo, codRefer) {
                modalItemConfigNarrative.open({
                    itCodigo: itCodigo,
                    codRefer: codRefer
                });			
            }
        }
        index.register.controller('salesorder.internalOrderDetailItemDetail.Controller', internalOrderDetailItemDetailCtrl);


        modalItemDelivery.$inject = ['modalParams', '$modalInstance', '$filter'];
        function modalItemDelivery(modalParams, $modalInstance, $filter) {
            var modalItemDeliveryController = this;
            var i18n = $filter('i18n');

            this.myParams = angular.copy(modalParams);
            this.ttOrderItem = this.myParams.ttOrderItem;
            this.ttSimpleDelivery = this.myParams.ttSimpleDelivery;

            this.close = function () {
                $modalInstance.dismiss('cancel');
            }
        }
        index.register.controller('salesorder.internalOrderDetailModalItemDelivery.Controller', modalItemDelivery);


        modalItemInvoice.$inject = ['modalParams', '$modalInstance', '$filter'];
        function modalItemInvoice(modalParams, $modalInstance, $filter) {
            var modalItemInvoiceController = this;
            var i18n = $filter('i18n');

            this.myParams = angular.copy(modalParams);
            this.ttOrderItem = this.myParams.ttOrderItem;
            this.ttSimpleInvoice = this.myParams.ttSimpleInvoice;

            this.close = function() {
                $modalInstance.dismiss('cancel');
            }
        }
        index.register.controller('salesorder.internalOrderDetailModalItemInvoice.Controller', modalItemInvoice);


        modalOrderDetailConfig.$inject = ['$rootScope', 'modalParams', '$modalInstance', '$filter'];
        function modalOrderDetailConfig($rootScope, modalParams, $modalInstance, $filter) {
            var modalOrderDetailConfigController = this;
            var i18n = $filter('i18n');

            this.myParams = angular.copy(modalParams);
            this.listGroups = this.myParams.listGroups;
            this.startOpenDetailsOrder = this.myParams.startOpenDetailsOrder;
            this.startExpandedGroupsDetail = this.myParams.startExpandedGroupsDetail;

            this.help = "<ul style='padding-left: 15px'>" +
                "<li>" + $rootScope.i18n('msg-oder-detail-show-groups') + "</li>" +
                "<li>" + $rootScope.i18n('mgs-order-detail-groups-position') + "</li>" +
                "</ul>";

            this.close = function() {
                $modalInstance.dismiss('cancel');
            }

            this.save = function() {
                $modalInstance.close(modalOrderDetailConfigController);
            };

            // Necessario para nao disparar o evento de drag'n'drop ao tentar alterar o valor do switch.
            this.onMousedown = function(event) {
                event.stopPropagation();
            };

        }
        index.register.controller('salesorder.internalOrderDetailModalConfig.Controller', modalOrderDetailConfig);
    }
);
