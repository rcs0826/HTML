define(['index',
    
    
    '/dts/mpd/js/api/fchdis0036.js',
    '/dts/mpd/js/api/fchdis0048.js',
    '/dts/mpd/js/portal-factories.js',
    '/dts/mpd/js/userpreference.js',
    '/dts/dts-utils/js/lodash-angular.js',
],
function(index) {
    'use strict';

    // *************************************************************************************
    // *** MODAL - CONFIG
    // *************************************************************************************
    modalCustomerDetailConfig.$inject = ['$rootScope', '$modal'];
    function modalCustomerDetailConfig($rootScope, $modal) {
        this.open = function (params) {

            var scope = $rootScope.$new();
            scope.isModal = true;
            scope.parameters = params;

            scope.$modalInstance = $modal.open({
                templateUrl: '/dts/mpd/html/internalcustomerdetail/customer-detail-config.html',
                controller: 'salesorder.internalcustomerdetailmodalconfig.controller as modalCustomerDetailConfigController',
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                scope: scope,
                resolve: {
                    params: function() {
                        return params;
                    }
                }
            });

            return scope.$modalInstance.result;
        };
    }

    // *************************************************************************************
    // *** CONTROLLER CONFIG
    // *************************************************************************************
    controllerInternalCustomerDetailConfig.$inject = ['$rootScope', 'params', '$modalInstance', '$filter'];
    function controllerInternalCustomerDetailConfig($rootScope, params, $modalInstance, $filter) {
        var ControlInternalCustomerDetailConfig = this;
        var i18n = $filter('i18n');

        ControlInternalCustomerDetailConfig.myParams = angular.copy(params);
        ControlInternalCustomerDetailConfig.listGroups = ControlInternalCustomerDetailConfig.myParams.listGroups;
        ControlInternalCustomerDetailConfig.startOpenDetailsOrder = ControlInternalCustomerDetailConfig.myParams.startOpenDetailsOrder;
        ControlInternalCustomerDetailConfig.startExpandedGroupsDetail = ControlInternalCustomerDetailConfig.myParams.startExpandedGroupsDetail;

        ControlInternalCustomerDetailConfig.help = "<ul style='padding-left: 15px'>" +
                "<li>" + $rootScope.i18n('msg-oder-detail-show-groups') + "</li>" +
                "<li>" + $rootScope.i18n('mgs-order-detail-groups-position') + "</li>" +
                "</ul>";

        this.close = function() {
            $modalInstance.dismiss('cancel');
        };

        this.save = function() {
            $modalInstance.close(ControlInternalCustomerDetailConfig);
        };

        // Necessario para nao disparar o evento de drag'n'drop ao tentar alterar o valor do switch.
        this.onMousedown = function(event) {
            event.stopPropagation();
        };

    }

    // *************************************************************************************
    // *** CONTROLLER - DETAIL
    // *************************************************************************************
    controllerInternalCustomerDetail.$inject = ['$rootScope', 'totvs.app-main-view.Service', '$stateParams',
        '$window', 'mpd.customerapd.Factory', 'mpd.customer.Factory',
        'salesorder.salesorders.Factory', '$filter', 'customization.generic.Factory',
        '$modal', '$location', '$q',
        'userPreference', 'salesorder.internalcustomerdetail.modal.config', '$timeout', 'TOTVSEvent'];
    function controllerInternalCustomerDetail($rootScope, appViewService, $stateParams,
        $window, customerApdFactory, customerFactory,
        orderResource, $filter, customService,
        $modal,  $location, $q,
        userPreference, modalCustomerDetailConfig, $timeout, TOTVSEvent) {

        // *********************************************************************************
        // *** Variables
        // *********************************************************************************
        var ControlInternalCustomerDetail = this;
        var i18n = $filter('i18n');

        ControlInternalCustomerDetail.startOpenedOrderDetail = false;
        ControlInternalCustomerDetail.startExpandedGroupsDetail = true;
        ControlInternalCustomerDetail.customerId = $stateParams.customerId;
        ControlInternalCustomerDetail.params = {codEmitente: $stateParams.customerId};
        ControlInternalCustomerDetail.supplierParams = [];  
        ControlInternalCustomerDetail.supplierMaisNegocios = false;
        ControlInternalCustomerDetail.newCreditLimit = null;
        
        ControlInternalCustomerDetail.listGroups = [
            {item: {codeGroup: 1, groupName: $rootScope.i18n('l-dados-gerais'), visible: false, expanded: true, avalaible: true}},
            {item: {codeGroup: 2, groupName: $rootScope.i18n('l-endereco'), visible: false, expanded: true, avalaible: true}},
            {item: {codeGroup: 3, groupName: $rootScope.i18n('l-comunicacao'), visible: false, expanded: true, avalaible: true}},
            {item: {codeGroup: 4, groupName: $rootScope.i18n('l-fiscal-data'), visible: false, expanded: true, avalaible: true}},
            {item: {codeGroup: 5, groupName: $rootScope.i18n('l-faturamento'), visible: false, expanded: true, avalaible: true}},
            {item: {codeGroup: 6, groupName: $rootScope.i18n('l-faturamento-retro'), visible: false, expanded: true, avalaible: true}},
            {item: {codeGroup: 7, groupName: $rootScope.i18n('l-pedido-programacao'), visible: false, expanded: true, avalaible: true}},
            {item: {codeGroup: 8, groupName: $rootScope.i18n('l-descontos-bonificacoes'), visible: false, expanded: true, avalaible: true}},
            {item: {codeGroup: 9, groupName: $rootScope.i18n('l-ind-cre-cli'), visible: false, expanded: true, avalaible: true}},
            {item: {codeGroup: 10, groupName: $rootScope.i18n('l-endereco-cobranca'), visible: false, expanded: true, avalaible: true}},
            {item: {codeGroup: 11, groupName: $rootScope.i18n('l-informacao-cobranca'), visible: false, expanded: true, avalaible: true}},
            {item: {codeGroup: 12, groupName: $rootScope.i18n('l-financial-data'), visible: false, expanded: true, avalaible: true}},
            {item: {codeGroup: 13, groupName: $rootScope.i18n('l-order-summary'), visible: false, expanded: true, avalaible: true}},
            {item: {codeGroup: 14, groupName: $rootScope.i18n('l-other-information'), visible: false, expanded: true, avalaible: true}}
        ];


        appViewService.startView(i18n('l-customer-detail') + " " + ControlInternalCustomerDetail.customerId, 'salesorder.internalcustomerdetail.controller');

        $q.all([userPreference.getPreference('summaryInitDate')])
            .then(function(data) {
            var dt = new Date();
            if (data[0].prefValue) {
                dt = new Date(parseFloat(data[0].prefValue));
            } else {
                dt.setMonth(dt.getMonth() - 1);
            }
            if ( isNaN(dt.getTime())) {
                dt = new Date();
                dt.setMonth(dt.getMonth() - 1);
            }
            ControlInternalCustomerDetail.iniDate = dt;
        });

        $q.all([userPreference.getPreference('salesorder.internalCustomerDetailConfig.positionGroupsCode'),
            userPreference.getPreference('salesorder.internalCustomerDetailConfig.visibleGroupsCode'),
            userPreference.getPreference('salesorder.internalCustomerDetailConfig.startOpenedOrderDetail'),
            userPreference.getPreference('salesorder.internalCustomerDetailConfig.startExpandedOrderDetail')])
            .then(function(data) {

            if (data[0].prefValue)
                ControlInternalCustomerDetail.positionGroupsCode = data[0].prefValue;
            if (data[1].prefValue)
                ControlInternalCustomerDetail.visibleGroupsCode = data[1].prefValue;
            if (data[2].prefValue)
                ControlInternalCustomerDetail.startOpenedOrderDetail = data[2].prefValue;
            if (data[3].prefValue)
                ControlInternalCustomerDetail.startExpandedGroupsDetail = data[3].prefValue;

            if (ControlInternalCustomerDetail.startOpenedOrderDetail === 'true') {
                ControlInternalCustomerDetail.startOpenedOrderDetail = true;
            } else {
                ControlInternalCustomerDetail.startOpenedOrderDetail = false;
            }

            //Se não houver configuração do usuário para posicionar os grupos todos devem ser viviveis
            if (ControlInternalCustomerDetail.positionGroupsCode === undefined ||
                ControlInternalCustomerDetail.positionGroupsCode === null ||
                ControlInternalCustomerDetail.positionGroupsCode === "") {

                angular.forEach(ControlInternalCustomerDetail.listGroups, function(group) {
                    group.item.visible = true;
                });

            }

            if (ControlInternalCustomerDetail.startExpandedGroupsDetail === 'true') {
                ControlInternalCustomerDetail.startExpandedGroupsDetail = true;
            } else {
                ControlInternalCustomerDetail.startExpandedGroupsDetail = false;
            }

            if (ControlInternalCustomerDetail.startOpenedOrderDetail === true) {
                ControlInternalCustomerDetail.startOpenOrderDetails();
            }
            console.dir(ControlInternalCustomerDetail);

            customerApdFactory.getSupplierParam({}, function(data) {
                ControlInternalCustomerDetail.supplierParams = data;  
                angular.forEach(ControlInternalCustomerDetail.supplierParams, function(param, key) {
                    if(param.paramCode == 'log_integr_mng') {
                        ControlInternalCustomerDetail.supplierMaisNegocios = param.paramValue == 'yes' ? true : false;
    
                        if(ControlInternalCustomerDetail.supplierMaisNegocios == true) {
                            ControlInternalCustomerDetail.listGroups.push({item: {codeGroup: 15, groupName: $rootScope.i18n('l-risk'), visible: true, expanded: true, avalaible: true}});
                        }
    
                    }
                });
                
                ControlInternalCustomerDetail.startLoad();
            });

        });

        // *********************************************************************************
		// *** Functions
		// *********************************************************************************
        this.checkVisibleInfGroups = function() {
            //Verifica se existe configuração de grupos visiveis
            if (ControlInternalCustomerDetail.visibleGroupsCode) {
                //Atualiza os grupos visiveis baseado na configuração do usuário
                ControlInternalCustomerDetail.arrayVisibleGroup = ControlInternalCustomerDetail.visibleGroupsCode.split(',');
                angular.forEach(ControlInternalCustomerDetail.listGroups, function(group) {
                    for (var i = 0; i < ControlInternalCustomerDetail.arrayVisibleGroup.length; i++) {
                        if (group.item.codeGroup == ControlInternalCustomerDetail.arrayVisibleGroup[i])
                            group.item.visible = true;
                    }
                });
            }

            angular.forEach(ControlInternalCustomerDetail.listGroups, function(group) {
                //verifica se os grupos devem abrir expandidos
                if (ControlInternalCustomerDetail.startExpandedGroupsDetail === true)
                    group.item.expanded = true;
                else
                    group.item.expanded = false;
            });
        };

        this.checkOrderInfGroups = function() {
            ControlInternalCustomerDetail.reorderListGroups = [];
            //Realiza reordenação de grupos apenas se houver uma configuração do usuário
            if (ControlInternalCustomerDetail.positionGroupsCode) {
                ControlInternalCustomerDetail.arrayPositionGroups = ControlInternalCustomerDetail.positionGroupsCode.split(',');
                //Reordena os grupos baseados nas configurações do usuário
                for (var i = 0; i < ControlInternalCustomerDetail.arrayPositionGroups.length; i++) {
                    angular.forEach(ControlInternalCustomerDetail.listGroups, function(group) {
                        if (group.item.codeGroup == ControlInternalCustomerDetail.arrayPositionGroups[i])
                            ControlInternalCustomerDetail.reorderListGroups.push(group);
                    });
                }

                for (var x = 0; x < ControlInternalCustomerDetail.listGroups.length; x++) {
                    if(!ControlInternalCustomerDetail.reorderListGroups.find(group => group.item.codeGroup == ControlInternalCustomerDetail.listGroups[x].item.codeGroup)){
                        ControlInternalCustomerDetail.listGroups[x].item.visible = true;
                        ControlInternalCustomerDetail.listGroups[x].item.expanded = true;
                        ControlInternalCustomerDetail.reorderListGroups.push(ControlInternalCustomerDetail.listGroups[x]);
                    }
                }

                ControlInternalCustomerDetail.listGroups = ControlInternalCustomerDetail.reorderListGroups;

                // Remove o grupo risk (supplier) mesmo se foi gravado sua posição nas preferências de usuário.
                if (ControlInternalCustomerDetail.supplierMaisNegocios == false) {
                    for (var y = 0; y < ControlInternalCustomerDetail.listGroups.length; y++) {
                        if(ControlInternalCustomerDetail.listGroups[y].item.codeGroup == 15) {
                            ControlInternalCustomerDetail.listGroups.splice(y,1);
                        }
                    }
                }

            }
        };

        this.startOpenOrderDetails = function() {
            var group = $('#tgcOrderDetail').find('.content');
            group.addClass('open');
            group.attr('style', '');
        };

        this.startLoad = function() {

            ControlInternalCustomerDetail.loadData();

            ControlInternalCustomerDetail.checkVisibleInfGroups();
            ControlInternalCustomerDetail.checkOrderInfGroups();
        };

        this.loadData = function () {

            customerApdFactory.getCustomerDetails(ControlInternalCustomerDetail.params, function (result) {
                ControlInternalCustomerDetail.ttDetalheCliente = result[0];
                ControlInternalCustomerDetail.customerShortName = ControlInternalCustomerDetail.ttDetalheCliente['nome-abrev'];

                ControlInternalCustomerDetail.loadDeliveryPlaces(ControlInternalCustomerDetail.customerShortName);
                ControlInternalCustomerDetail.loadCustomerItens(ControlInternalCustomerDetail.customerShortName);
                ControlInternalCustomerDetail.loadCustomerInformers(ControlInternalCustomerDetail.customerShortName);
                ControlInternalCustomerDetail.loadCustomerSites(ControlInternalCustomerDetail.customerShortName);
                ControlInternalCustomerDetail.loadCustomerContacts(ControlInternalCustomerDetail.customerId);
                ControlInternalCustomerDetail.loadCustomerOrdersGraph(ControlInternalCustomerDetail.customerShortName, ControlInternalCustomerDetail.iniDate);
                ControlInternalCustomerDetail.loadSupplierMaisNegociosCustomerCredit(ControlInternalCustomerDetail.customerId, false);
                
                customerFactory.statusActiveCustomer({codEmitente: ControlInternalCustomerDetail.customerId,
                                                    nrMesesInativo: ControlInternalCustomerDetail.ttDetalheCliente['nr-mesina'],
                                                    dataUltimaVenda: ControlInternalCustomerDetail.ttDetalheCliente['dt-ult-venda']},
                                                    function(result){
                                                        ControlInternalCustomerDetail.isActive = !result.lInativo;
                                                    });
            });

        };

        this.loadCustomerContacts = function(customerId) {
            if (!ControlInternalCustomerDetail.customerContacts) {
                customerApdFactory.getCustomerContacts({codEmitente: customerId},function(result){
                    ControlInternalCustomerDetail.customerContacts = result;
                });
            }
        };

        this.loadCustomerSites = function(shortName) {
            if (!ControlInternalCustomerDetail.customerSites) {
                customerApdFactory.getCustomerSites({nomeAbrev: shortName},function(result){
                    ControlInternalCustomerDetail.customerSites = result;
                });
            }
        };

        this.loadCustomerInformers = function(shortName) {
            if (!ControlInternalCustomerDetail.customerInformers) {
                customerApdFactory.getCustomerInformers({nomeAbrev: shortName},function(result){
                    ControlInternalCustomerDetail.customerInformers = result;
                });
            }
        };

        this.loadDeliveryPlaces = function(shortName) {
            if (!ControlInternalCustomerDetail.deliveryPlaces) {
                customerApdFactory.getCustomerDeliveryPlaces({nomeAbrev: shortName},function(result){
                    ControlInternalCustomerDetail.deliveryPlaces = result;
                });
            }
        };

        this.loadCustomerItens = function(shortName) {
            if (!ControlInternalCustomerDetail.customerItems) {
                customerApdFactory.getCustomerItens({nomeAbrev: shortName},function(result){
                    ControlInternalCustomerDetail.customerItems = result;
                });
            }
        };

        this.loadCustomerOrdersGraph = function(shortName, initialDate){
            var ordersParams = {};
            ordersParams.codEmitente = shortName;
            ordersParams.iniDate = initialDate;
            ordersParams.endDate = undefined;
            ordersParams.teamSalesHierarchy = -1;
            ordersParams.teamSalesHierarchyType = -1;
            ordersParams.isQuote = false;
            ordersParams.siteId = undefined;
            ordersParams.orderAdder = undefined;

            var summary = customerApdFactory.ordersCustomerSummaryInternal(ordersParams, function() {
                 ControlInternalCustomerDetail.customerData = [];
                 angular.forEach(summary, function(value) {
                     ControlInternalCustomerDetail.customerData.push(
                         {
                             label: value.situation + '&nbsp;</td><td class="legendLabel" style="text-align: right;">' + value.quantity,
                             data: value.quantity
                         });
                 });
                 ControlInternalCustomerDetail.summaryShow = true;
            });
        };

        this.summaryOptions = {
            tooltip: true,
            tooltipOpts: {
                content: function(label, x, y, item) {
                    return label.split('&')[0] + " " + y;
                }
            },
            grid: {hoverable: true},
            series: {
                pie: {
                    show: true
                }
            }
        };

        this.getDelayIndicatorDescription = function(indicatorId){
            var delayIndicator = [
                {id: 1, description: 'l-ind-atraso-nao-informa'},
                {id: 2, description: 'l-ind-atraso-informa'},
                {id: 3, description: 'l-ind-atraso-sumarizar'}
            ];
            for(var i = 0; i< delayIndicator.length; i++){
                if(delayIndicator[i].id === indicatorId){
                    return delayIndicator[i].description;
                }
            }
        };

        this.getAmountType = function(amountId){
            var amountType = [
                {id: 1, description: 'l-tipo-quant-prog-liquido'},
                {id: 2, description: 'l-tipo-quant-prog-acumulado'}
            ];
            for(var i = 0; i< amountType.length; i++){
                if(amountType[i].id === amountId){
                    return amountType[i].description;
                }
            }
        };

        this.getDeliveryConfirmation = function(deliveryId){
            var confirmation = [
                {id: 1, description: 'l-conf-progr-entrega-sobrepoe'},
                {id: 2, description: 'l-conf-progr-entrega-acumular'}
            ];
            for(var i = 0; i< confirmation.length; i++){
                if(confirmation[i].id === deliveryId){
                    return confirmation[i].description;
                }
            }
        };

        this.getBonusGeneration = function(bonusId){
            var generation = [
                {id: 1, description: 'l-geracao-bonificacao-online'},
                {id: 2, description: 'l-geracao-bonificacao-lote'}
            ];
            for(var i = 0; i< generation.length; i++){
                if(generation[i].id === bonusId){
                    return generation[i].description;
                }
            }
        };

        this.getBonusCancellation = function(bonusId){
            var cancellation = [
                {id: 1, description: 'l-atualiza-bonif-cancel-saldo'},
                {id: 2, description: 'l-atualiza-bonif-cancel-saldo-prop'},
                {id: 3, description: 'l-atualiza-bonif-cancel-saldo-tudo'}
            ];
            for(var i = 0; i< cancellation.length; i++){
                if(cancellation[i].id === bonusId){
                    return cancellation[i].description;
                }
            }
        };

        this.openOrders = function() {
            $location.url('/dts/mpd/internalsalesorders/openbycustomer/' + ControlInternalCustomerDetail.customerShortName);
        };

        this.settings = function() {
            ControlInternalCustomerDetail.openOrderDetailConfigModall();
        };

        this.openOrderDetailConfigModall = function() {

            modalCustomerDetailConfig.open( {
                listGroups: ControlInternalCustomerDetail.listGroups,
                startOpenDetailsOrder: ControlInternalCustomerDetail.startOpenedOrderDetail,
                startExpandedGroupsDetail: ControlInternalCustomerDetail.startExpandedGroupsDetail
            }).then(function(result) {
                 ControlInternalCustomerDetail.saveOrderDetailConfiguration(result);
            });
        };

        // metodo para salvar o registro de configuração de grupos de informações
        this.saveOrderDetailConfiguration = function(dataModalController) {
            ControlInternalCustomerDetail.positionGroupsCode = '';
            ControlInternalCustomerDetail.visibleGroupsCode = '';

            ControlInternalCustomerDetail.listGroups = dataModalController.listGroups;
            ControlInternalCustomerDetail.startOpenedOrderDetail = dataModalController.startOpenDetailsOrder;
            ControlInternalCustomerDetail.startExpandedGroupsDetail = dataModalController.startExpandedGroupsDetail;

            for (var i = 0; i < dataModalController.listGroups.length; i++) {
                ControlInternalCustomerDetail.positionGroupsCode = ControlInternalCustomerDetail.positionGroupsCode + ',' + dataModalController.listGroups[i].item.codeGroup;

                if (dataModalController.listGroups[i].item.visible === true)
                    ControlInternalCustomerDetail.visibleGroupsCode = ControlInternalCustomerDetail.visibleGroupsCode + ',' + dataModalController.listGroups[i].item.codeGroup;
            }

            $q.all([userPreference.setPreference('salesorder.internalCustomerDetailConfig.positionGroupsCode', ControlInternalCustomerDetail.positionGroupsCode),
                userPreference.setPreference('salesorder.internalCustomerDetailConfig.visibleGroupsCode', ControlInternalCustomerDetail.visibleGroupsCode),
                userPreference.setPreference('salesorder.internalCustomerDetailConfig.startOpenedOrderDetail', dataModalController.startOpenDetailsOrder),
                userPreference.setPreference('salesorder.internalCustomerDetailConfig.startExpandedOrderDetail', dataModalController.startExpandedGroupsDetail)]).then(function() {
            });

            angular.forEach(ControlInternalCustomerDetail.listGroups, function(group) {
                //verifica se os grupos devem ser expandidos
                if (ControlInternalCustomerDetail.startExpandedGroupsDetail === true)
                    group.item.expanded = true;
                else
                    group.item.expanded = false;
            });
        };

        // Busca online de informações de crédito do cliente na Supplier (Risk)
        this.refreshSupplierCustomerCredit = function() {
            this.loadSupplierMaisNegociosCustomerCredit(ControlInternalCustomerDetail.customerId, true);
        }

        this.formatDateTime = function(dateTimeISO) {
            var dateTime = new Date(dateTimeISO);
            return ControlInternalCustomerDetail.pad(dateTime.getUTCDate()) + '/' + ControlInternalCustomerDetail.pad(dateTime.getUTCMonth() + 1) + '/' + dateTime.getUTCFullYear() + ' ' +
                   ControlInternalCustomerDetail.pad(dateTime.getUTCHours()) + ':' + ControlInternalCustomerDetail.pad(dateTime.getUTCMinutes()) + ':' +  ControlInternalCustomerDetail.pad(dateTime.getUTCSeconds())
        };

        this.pad = function(number) {
            if (number < 10) {
              return '0' + number;
            }
            return number;
        }

        this.loadSupplierMaisNegociosCustomerCredit = function(customerCode, refreshOnline) {
            customerApdFactory.getSupplierMaisNegociosCustomerCredit({customerCode: customerCode, refreshOnline: refreshOnline}, function(data) {

                if(!data.$hasError) {
                    if(data.ttSupplierCustomerCredit[0]['dtm-ultima-atualiz']) {
                        data.ttSupplierCustomerCredit[0]['dtm-ultima-atualiz'] = ControlInternalCustomerDetail.formatDateTime(data.ttSupplierCustomerCredit[0]['dtm-ultima-atualiz']);
                    }   

                    for (var i = 0; i < data.ttSupplierCustomerCreditConcessi.length; i++) {
                        data.ttSupplierCustomerCreditConcessi[i]['dtm-solicitacao'] = ControlInternalCustomerDetail.formatDateTime(data.ttSupplierCustomerCreditConcessi[i]['dtm-solicitacao']);
                        data.ttSupplierCustomerCreditConcessi[i]['dtm-avaliac']     = ControlInternalCustomerDetail.formatDateTime(data.ttSupplierCustomerCreditConcessi[i]['dtm-avaliac']);
                    }  

                    ControlInternalCustomerDetail.ttDetalheCliente.supplierCustomerCredit = data.ttSupplierCustomerCredit[0];  
                    ControlInternalCustomerDetail.ttDetalheCliente.supplierCustomerCreditConcessi = data.ttSupplierCustomerCreditConcessi; 
                } 
                
            });
        }

        ControlInternalCustomerDetail.supplierGrantCredit = function save() {

            $timeout(function () {

                if(ControlInternalCustomerDetail.newCreditLimit > 0) {
                    customerApdFactory.postSupplierMaisNegociosRequestCredit({customerCode: ControlInternalCustomerDetail.customerId, newCreditLimit: ControlInternalCustomerDetail.newCreditLimit}, function(result) {
                        if(!result.$hasError) {
                            ControlInternalCustomerDetail.loadSupplierMaisNegociosCustomerCredit(ControlInternalCustomerDetail.customerId, true);
                        }
                    });
                } else {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error',
                        title: $rootScope.i18n('l-attention'),
                        detail: $rootScope.i18n('l-supplier-enter-the-desired-limit')
                    });
                    return;
                }

            }, 100);

        };



    }//function controllerInternalCustomerDetail()

    // *************************************************************************************
    // *** REGISTER
    // *************************************************************************************
    index.register.service('salesorder.internalcustomerdetail.modal.config', modalCustomerDetailConfig);

    index.register.controller('salesorder.internalcustomerdetailmodalconfig.controller', controllerInternalCustomerDetailConfig);
    index.register.controller('salesorder.internalcustomerdetail.controller', controllerInternalCustomerDetail);

});
