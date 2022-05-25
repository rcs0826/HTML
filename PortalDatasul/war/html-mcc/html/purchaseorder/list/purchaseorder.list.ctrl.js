define([
    'index',
    '/dts/mcc/js/api/ccapi351.js',
    '/dts/mcc/js/api/ccapi369.js',
    '/dts/mcc/html/purchaseorder/list/purchaseorder.advanced.search.ctrl.js',
    '/dts/mcc/html/purchaseorder/list/purchaseorder.comments.ctrl.js'
], function(index) {
    
    purchaseOrderListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service', 'TOTVSEvent', 'mcc.purchaseorder.advancedSearchModal', 'mcc.ccapi351.Factory', 'mcc.ccapi369.Factory','mcc.purchaseorder.commentsModal'];
    function purchaseOrderListController($rootScope, $scope, appViewService, TOTVSEvent, advancedSearchModal, ccapi351, ccapi369, commentsModal) {
        var ctrl = this;

        // *********************************************************************************
        // *** Variables
        // *********************************************************************************
        ctrl.hasNext = false;
        ctrl.cCodEstabelec = '';
        ctrl.disclaimers = [];
        ctrl.defaultDisclaimersValue = [];
        ctrl.basicFilter = "";
        ctrl.completeModel = {};
        ctrl.modelListCount = 0;
        ctrl.rLastEmitPedCompr = null;
        ctrl.rLastPedCompr = null;
        ctrl.orderbyList = null;
        ctrl.listOfOrders = [];
        ctrl.loaded = false;
        ctrl.ttListParameters = null;

        // # Purpose: Método de inicialização
        // # Parameters: 
        // # Notes:
        ctrl.init = function() {
            createTab = appViewService.startView($rootScope.i18n('l-purchase-orders', [], 'dts/mcc'),'mcc.purchaseorder.ListCtrl',ctrl);

            if (!createTab && appViewService.previousView && appViewService.previousView.name != 'dts/mcc/purchaseorder.new') {
                // Adiciona novamente o scroll na pagina.
                document.getElementById('menu-contents').style.overflowY = "scroll";

                return;
            }

            if (ctrl.ttListParameters == null) {
                var startDate = new Date();
                startDate = new Date(startDate.setDate(startDate.getDate() - 30));
                ctrl.ttListParameters = {
                    notApproved: true,
                    approved: true,
                    receivedPartial: true,
                    receivedTotal: false,
                    eliminated: false,
                    printed: true,
                    notPrinted: true,
                    emergency: true,
                    normal: true,
                    responsibleIni: $rootScope.currentuser.login,
                    responsibleEnd: $rootScope.currentuser.login,
                    purchaseDateIni: startDate,
                    purchaseDateEnd: new Date(),
                    sortBy: '-num-pedido',
                };
            }

            ctrl.loadDisclaimers();
            ctrl.loadData(ctrl.ttListParameters);
            if (ctrl.orderbyList == null)
                ctrl.orderbyList = [
                    {title: $rootScope.i18n('l-order'), property:"num-pedido", asc:false, default:true},
                    {title: $rootScope.i18n('l-date'), property:"data-pedido", asc:false},
                    {title: $rootScope.i18n('l-site'), property:"cod-estabel", asc:false},
                    {title: $rootScope.i18n('l-vendor'), property:"cod-emitente", asc:false}
                ];
        };

        // # Purpose: Método auxiliar para formatação de datas para exibição na tela.
        // # Parameters: date - Data a ser formatada.
        // # Notes:
        ctrl.formatDate = function(date){
            if (date == null || date == '') return '';
            day  = date.getDate().toString(),
            dayF = (day.length == 1) ? '0'+day : day,
            month  = (date.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
            monthF = (month.length == 1) ? '0'+month : month,
            yearF = date.getFullYear();
            return dayF+"/"+monthF+"/"+yearF;
        }

        // # Purpose: Método auxiliar para formatar os textos que aparecem no disclaimers
        // # Parameters: start - Campo inicial do filtro de busca
        //               end - Campo final do filtro de busca
        //               label - Label do campo que está sendo formatado.
        // # Notes:
        ctrl.formatValuesDisclaimer = function(start, end, label) {
            if (start == undefined && end != undefined)
                return $rootScope.i18n(label) + ': ' + $rootScope.i18n('l-smaller-or-equal') + ' ' + end;
            else if (start != undefined && end == undefined)
                return $rootScope.i18n(label) + ': ' + $rootScope.i18n('l-bigger-or-equal') + ' ' + start;
            else
                return $rootScope.i18n(label) + ': ' + start + ' ' + $rootScope.i18n('l-to') + ' ' + end;
        }

        // # Purpose: Método auxiliar para formatar os textos que aparecem no disclaimers
        // # Parameters: start - Campo inicial do filtro de busca
        //               end - Campo final do filtro de busca
        //               label - Label do campo que está sendo formatado.
        // # Notes:
        ctrl.formatCharacterDisclaimer = function(start, end, label) {
            if (start == undefined || start == '')
                return $rootScope.i18n(label) + ': ' + $rootScope.i18n('l-smaller-or-equal') + ' ' + end;
            else if (end == undefined || end == '')
                return $rootScope.i18n(label) + ': ' + $rootScope.i18n('l-bigger-or-equal') + ' ' + start;
            else if (start == end)
                return $rootScope.i18n(label) + ': ' + start;
            else
                return $rootScope.i18n(label) + ': ' + start + ' ' + $rootScope.i18n('l-to') + ' ' + end;
        }

        // # Purpose: Método auxiliar para adicionar os disclaimers
        // # Parameters: property - Propriedade a ser adicionada no disclaimer.
        // # Notes:
        ctrl.addDisclaimer = function(property) {
            var value = '';
            var title = '';
            switch (property) {
                case 'rangeDate':
                    value = [ctrl.ttListParameters.purchaseDateIni, ctrl.ttListParameters.purchaseDateEnd];
                    var startDateString = ctrl.formatDate(ctrl.ttListParameters.purchaseDateIni);
                    var endDateString = ctrl.formatDate(ctrl.ttListParameters.purchaseDateEnd);
                    if (startDateString == '' && endDateString != '')
                        title = $rootScope.i18n('l-date') + ': ' + $rootScope.i18n('l-smaller-or-equal') + ' ' + ctrl.formatDate(ctrl.ttListParameters.purchaseDateEnd);
                    else if (startDateString != '' && endDateString == '')
                        title = $rootScope.i18n('l-date') + ': ' + $rootScope.i18n('l-bigger-or-equal') + ' ' + ctrl.formatDate(ctrl.ttListParameters.purchaseDateIni);
                    else
                        title = $rootScope.i18n('l-date') + ': ' + ctrl.formatDate(ctrl.ttListParameters.purchaseDateIni) + ' ' + $rootScope.i18n('l-to') + ' ' + ctrl.formatDate(ctrl.ttListParameters.purchaseDateEnd);
                    break;
                case 'responsible':
                    value = [ctrl.ttListParameters.responsibleIni, ctrl.ttListParameters.responsibleEnd]
                    title = ctrl.formatCharacterDisclaimer(ctrl.ttListParameters.responsibleIni, ctrl.ttListParameters.responsibleEnd, 'l-owner');
                    break;
                case 'purchaseNumber':
                    value = [ctrl.ttListParameters.purchaseNumberIni, ctrl.ttListParameters.purchaseNumberEnd]
                    title = ctrl.formatValuesDisclaimer(ctrl.ttListParameters.purchaseNumberIni, ctrl.ttListParameters.purchaseNumberEnd, 'l-order-number');
                    break;
                case 'contractNumber':
                    value = [ctrl.ttListParameters.contractNumberIni, ctrl.ttListParameters.contractNumberEnd]
                    title = ctrl.formatValuesDisclaimer(ctrl.ttListParameters.contractNumberIni, ctrl.ttListParameters.contractNumberEnd, 'l-contract');
                    break;
                case 'supplier':
                    value = [ctrl.ttListParameters.supplierIni, ctrl.ttListParameters.supplierEnd]
                    title = ctrl.formatValuesDisclaimer(ctrl.ttListParameters.supplierIni, ctrl.ttListParameters.supplierEnd, 'l-vendor');
                    break;
                case 'supplierName':
                    value = [ctrl.ttListParameters.supplierNameIni, ctrl.ttListParameters.supplierNameEnd]
                    title = ctrl.formatCharacterDisclaimer(ctrl.ttListParameters.supplierNameIni, ctrl.ttListParameters.supplierNameEnd, 'l-vendor');
                    break;
                case 'supplierShortName':
                    value = [ctrl.ttListParameters.supplierShortNameIni, ctrl.ttListParameters.supplierShortNameEnd]
                    title = ctrl.formatCharacterDisclaimer(ctrl.ttListParameters.supplierShortNameIni, ctrl.ttListParameters.supplierShortNameEnd,'l-short-name');
                    break;
                case 'supplierCNPJ':
                    value = [ctrl.ttListParameters.supplierCNPJIni, ctrl.ttListParameters.supplierCNPJEnd]
                    title = ctrl.formatCharacterDisclaimer(ctrl.ttListParameters.supplierCNPJIni, ctrl.ttListParameters.supplierCNPJEnd, 'l-cnpj-cpf');
                    break;
                case 'establishment':
                    value = [ctrl.ttListParameters.establishmentIni, ctrl.ttListParameters.establishmentEnd]
                    title = ctrl.formatValuesDisclaimer(ctrl.ttListParameters.establishmentIni, ctrl.ttListParameters.establishmentEnd, 'l-site');
                    break;
                case 'notApproved':
                    value = ctrl.ttListParameters.notApproved
                    title = $rootScope.i18n('l-not-approved-gen');
                    break;
                case 'approved':
                    value = ctrl.ttListParameters.approved
                    title = $rootScope.i18n('l-approved-m');
                    break;
                case 'receivedPartial':
                    value = ctrl.ttListParameters.receivedPartial
                    title = $rootScope.i18n('l-partial-received-man');
                    break;
                case 'receivedTotal':
                    value = ctrl.ttListParameters.receivedTotal
                    title = $rootScope.i18n('l-received-total-m');
                    break;
                case 'eliminated':
                    value = ctrl.ttListParameters.eliminated
                    title = $rootScope.i18n('l-deleted-m');
                    break;
                case 'printed':
                    value = ctrl.ttListParameters.printed
                    title = $rootScope.i18n('l-printed');
                    break;
                case 'notPrinted':
                    value = ctrl.ttListParameters.notPrinted
                    title = $rootScope.i18n('l-not-printed');
                    break;
                case 'emergency':
                    value = ctrl.ttListParameters.emergency
                    title = $rootScope.i18n('l-emergency');
                    break;
                case 'normal':
                    value = ctrl.ttListParameters.normal
                    title = $rootScope.i18n('l-normal');
                    break;
            }

            ctrl.disclaimers.push({
                'property': property,
                'value': value,
                'title': title
            });
        }

        // # Purpose: Método auxiliar para converter o disclaimer em objeto.
        // # Parameters:
        // # Notes:
        ctrl.disclaimerToObject = function() {
            var sortBy = (ctrl.orderBySelected.asc ? '' : '-') + ctrl.orderBySelected.property;
            ctrl.ttListParameters['sortBy'] = sortBy;
            ctrl.disclaimers.forEach(function (element) {
                switch (element.property) {
                    case 'rangeDate':
                        ctrl.ttListParameters['purchaseDateIni'] = element.value[0];
                        ctrl.ttListParameters['purchaseDateEnd'] = element.value[1];
                        break;
                    case 'responsible':
                        ctrl.ttListParameters['responsibleIni'] = element.value[0];
                        ctrl.ttListParameters['responsibleEnd'] = element.value[1];
                        break;
                    case 'purchaseNumber':
                        ctrl.ttListParameters['purchaseNumberIni'] = element.value[0];
                        ctrl.ttListParameters['purchaseNumberEnd'] = element.value[1];
                        break;
                    case 'contractNumber':
                        ctrl.ttListParameters['contractNumberIni'] = element.value[0];;
                        ctrl.ttListParameters['contractNumberEnd'] = element.value[1];;
                        break;
                    case 'supplier':
                        ctrl.ttListParameters['supplierIni'] = element.value[0];;
                        ctrl.ttListParameters['supplierEnd'] = element.value[1];;
                        break;
                    case 'supplierName':
                        ctrl.ttListParameters['supplierNameIni'] = element.value[0];;
                        ctrl.ttListParameters['supplierNameEnd'] = element.value[1];;
                        break;
                    case 'supplierShortName':
                        ctrl.ttListParameters['supplierShortNameIni'] = element.value[0];;
                        ctrl.ttListParameters['supplierShortNameEnd'] = element.value[1];;
                        break;
                    case 'supplierCNPJ':
                        ctrl.ttListParameters['supplierCNPJIni'] = element.value[0];;
                        ctrl.ttListParameters['supplierCNPJEnd'] = element.value[1];;
                        break;
                    case 'establishment':
                        ctrl.ttListParameters['establishmentIni'] = element.value[0];;
                        ctrl.ttListParameters['establishmentEnd'] = element.value[1];;
                    case 'notApproved':
                        ctrl.ttListParameters['notApproved'] = element.value;
                        break;
                    case 'approved':
                        ctrl.ttListParameters['approved'] = element.value;
                        break;
                    case 'receivedPartial':
                        ctrl.ttListParameters['receivedPartial'] = element.value;
                        break;
                    case 'receivedTotal':
                        ctrl.ttListParameters['receivedTotal'] = element.value;
                        break;
                    case 'eliminated':
                        ctrl.ttListParameters['eliminated'] = element.value;
                        break;
                    case 'printed':
                        ctrl.ttListParameters['printed'] = element.value;
                        break;
                    case 'notPrinted':
                        ctrl.ttListParameters['notPrinted'] = element.value;
                        break;
                    case 'emergency':
                        ctrl.ttListParameters['emergency'] = element.value;
                        break;
                    case 'normal':
                        ctrl.ttListParameters['normal'] = element.value;
                        break;
                }
            });

        }

        // # Purpose: Remoção do disclaimer
        // # Parameters: filter - Propriedade a ser removida do disclaimer
        // # Notes:
        ctrl.removeDisclaimer = function(filter) {
            var index = ctrl.disclaimers.map(
                function (el) {
                    return el.property
                }
            ).indexOf(filter.property);

            ctrl.disclaimers.splice(index, 1);
            
            switch (filter.property) {
                case 'rangeDate':
                    delete ctrl.ttListParameters.purchaseDateIni;
                    delete ctrl.ttListParameters.purchaseDateEnd;
                    break;
                case 'responsible':
                    ctrl.ttListParameters.responsibleIni = '';
                    ctrl.ttListParameters.responsibleEnd = '';
                    break;
                case 'purchaseNumber':
                    delete ctrl.ttListParameters.purchaseNumberIni;
                    delete ctrl.ttListParameters.purchaseNumberEnd;
                    break;
                case 'contractNumber':
                    delete ctrl.ttListParameters.contractNumberIni;
                    delete ctrl.ttListParameters.contractNumberEnd;
                    break;
                case 'supplier':
                    delete ctrl.ttListParameters.supplierIni;
                    delete ctrl.ttListParameters.supplierEnd;
                    break;
                case 'supplierName':
                    delete ctrl.ttListParameters.supplierNameIni;
                    delete ctrl.ttListParameters.supplierNameEnd;
                    break;
                case 'supplierShortName':
                    delete ctrl.ttListParameters.supplierShortNameIni;
                    delete ctrl.ttListParameters.supplierShortNameEnd;
                    break;
                case 'supplierCNPJ':
                    delete ctrl.ttListParameters.supplierCNPJIni;
                    delete ctrl.ttListParameters.supplierCNPJEnd;
                    break;
                case 'establishment':
                    delete ctrl.ttListParameters.establishmentIni;
                    delete ctrl.ttListParameters.establishmentEnd;
                case 'notApproved':
                    ctrl.ttListParameters.notApproved = false;
                    break;
                case 'approved':
                    ctrl.ttListParameters.approved = false;
                    break;
                case 'receivedPartial':
                    ctrl.ttListParameters.receivedPartial = false;
                    break;
                case 'receivedTotal':
                    ctrl.ttListParameters.receivedTotal = false;
                    break;
                case 'eliminated':
                    ctrl.ttListParameters.eliminated = false;
                    break;
                case 'printed':
                    ctrl.ttListParameters.printed = false;
                    break;
                case 'notPrinted':
                    ctrl.ttListParameters.notPrinted = false;
                    break;
                case 'emergency':
                    ctrl.ttListParameters.emergency = false;
                    break;
                case 'normal':
                    ctrl.ttListParameters.normal = false;
                    break;
            }
            ctrl.loadData(ctrl.ttListParameters, false);
        };

        /*
		 * Objetivo: alterar a ordenação dos resultados
		 * Parâmetros:  - orderby: objeto que contém a ordenação selecionada pelo usuário em tela.
		 *                orderby.property - nome do campo que será usado na ordenação
         *                orderby.asc - indica se a ordenação é crescente (asc = true), ou decrescente (asc = false)
         * Observações:
		 */
		ctrl.selectOrderBy = function(orderby){
            var sortBy = (orderby.asc ? '' : '-') + orderby.property;
            
            ctrl.orderbyList.forEach( function (item) {
                delete item['default'];
            });
            
            ctrl.orderbyList.forEach( function (item) {
                if (item.property === orderby.property)
                    item['default'] = true;
            });

            ctrl.rLastPedCompr = null;
            ctrl.disclaimerToObject();
            ctrl.ttListParameters['sortBy'] = sortBy;
			ctrl.loadData(ctrl.ttListParameters, false);
		};

        // # Purpose: Realiza a busca os dados de Compras.
        // # Parameters: ttListParameters - Objeto com os dados do filtro.
        //               isMore - Indica se está buscando mais resultados na base com os mesmos termos.
        // # Notes:
        ctrl.loadData = function(ttListParameters, isMore) {
            
            if (isMore)  {
                ttListParameters.rLastPedCompr = ctrl.rLastPedCompr;
                ttListParameters.rLastEmitPedCompr = ctrl.rLastEmitPedCompr;
                ttListParameters.cCodEstabelec = ctrl.cCodEstabelec;
            } else {
                delete ttListParameters.rLastPedCompr;
                delete ttListParameters.rLastEmitPedCompr;
                delete ttListParameters.cCodEstabelec;
            }

            ccapi351.listPurchaseOrder({}, ttListParameters, function(results) {
                
                if (isMore)
                    Array.prototype.push.apply(ctrl.listOfOrders, results['ds-pedido-compr']);
                else    
                    ctrl.listOfOrders = results['ds-pedido-compr'];

                ctrl.listOfOrdersCache = ctrl.listOfOrders.slice(0);
                ctrl.rLastEmitPedCompr = results['rLastEmitPedCompr'];
                ctrl.rLastPedCompr = results['rLastPedCompr'];
                ctrl.hasNext = results['lHastNext'];
                ctrl.cCodEstabelec = results['cCodEstabelec'];
            });
        }

        // # Purpose: Realiza a busca de mais resultados
        // # Parameters:
        // # Notes:
        ctrl.loadMoreResults = function() {
            ctrl.loadData(ctrl.ttListParameters, true);
        }

        // # Purpose: Método responsável por adicionar os disclaimers na tela.
        // # Parameters:
        // # Notes:
        ctrl.loadDisclaimers = function() {
            ctrl.disclaimers = [];

            if ((ctrl.ttListParameters.purchaseDateIni != null && ctrl.ttListParameters.purchaseDateIni != '') || 
                (ctrl.ttListParameters.purchaseDateEnd != null && ctrl.ttListParameters.purchaseDateEnd != '')) 
                ctrl.addDisclaimer('rangeDate');

            if (!ctrl.ttListParameters.responsibleIni == '' || 
                !ctrl.ttListParameters.responsibleEnd == '') 
                ctrl.addDisclaimer('responsible');
            
            if (ctrl.ttListParameters.purchaseNumberIni != undefined || 
                ctrl.ttListParameters.purchaseNumberEnd != undefined &&
                ctrl.ttListParameters.purchaseNumberIni > 0 && 
                ctrl.ttListParameters.purchaseNumberEnd > 0) 
                ctrl.addDisclaimer('purchaseNumber');

            if (ctrl.ttListParameters.contractNumberIni != undefined || 
                ctrl.ttListParameters.contractNumberEnd != undefined) 
                ctrl.addDisclaimer('contractNumber');

            if (ctrl.ttListParameters.establishmentIni != undefined || 
                ctrl.ttListParameters.establishmentEnd != undefined) 
                ctrl.addDisclaimer('establishment');

            if (ctrl.ttListParameters.supplierIni != undefined || 
                ctrl.ttListParameters.supplierEnd != undefined) 
                ctrl.addDisclaimer('supplier');

            if (ctrl.ttListParameters.supplierShortNameIni != undefined || 
                ctrl.ttListParameters.supplierShortNameEnd != undefined) 
                ctrl.addDisclaimer('supplierShortName');

            if (ctrl.ttListParameters.supplierNameIni != undefined || 
                ctrl.ttListParameters.supplierNameEnd != undefined) 
                ctrl.addDisclaimer('supplierName');

            if (ctrl.ttListParameters.supplierCNPJIni != undefined || 
                ctrl.ttListParameters.supplierCNPJEnd != undefined) 
                ctrl.addDisclaimer('supplierCNPJ');

            if (ctrl.ttListParameters.notApproved) ctrl.addDisclaimer('notApproved');
            if (ctrl.ttListParameters.approved) ctrl.addDisclaimer('approved');
            if (ctrl.ttListParameters.receivedPartial) ctrl.addDisclaimer('receivedPartial');
            if (ctrl.ttListParameters.receivedTotal) ctrl.addDisclaimer('receivedTotal');
            if (ctrl.ttListParameters.eliminated) ctrl.addDisclaimer('eliminated');
            if (ctrl.ttListParameters.printed) ctrl.addDisclaimer('printed');
            if (ctrl.ttListParameters.notPrinted) ctrl.addDisclaimer('notPrinted');
            if (ctrl.ttListParameters.emergency) ctrl.addDisclaimer('emergency');
            if (ctrl.ttListParameters.normal) ctrl.addDisclaimer('normal');

        }

        // # Purpose: Abre a modal de busca avançada
        // # Parameters: 
        // # Notes:
        ctrl.openAdvancedSearch = function() {
            ctrl.ttListParameters = {};
            ctrl.disclaimerToObject();
            advancedSearchModal.open(ctrl.ttListParameters).then(function(result) {
                ctrl.ttListParameters = result;
                ctrl.loadDisclaimers();
                ctrl.loadData(ctrl.ttListParameters, false);
            });
        };

        // # Purpose: Ação do botão limpar filtros
        // # Parameters: 
        // # Notes:
        ctrl.cleanFilter = function() {
            ctrl.basicFilter = '';
            delete ctrl.ttListParameters.purchaseNumberIni;
            delete ctrl.ttListParameters.purchaseNumberEnd;
            ctrl.loadData(ctrl.ttListParameters, false);
        }

        // # Purpose: Ação do botão filtrar
        // # Parameters: 
        // # Notes:
        ctrl.filter = function() {
            var orderNumber = ctrl.basicFilter.replace(/([^0-9])/g, '').substring(0,9);
            
            if (orderNumber.length == 0)
                orderNumber = -1;

            ctrl.ttListParameters['purchaseNumberIni'] = orderNumber;
            ctrl.ttListParameters['purchaseNumberEnd'] = orderNumber;
            ctrl.loadData(ctrl.ttListParameters, false);
        }

        // # Purpose: Remove um pedido de compras.
        // # Parameters: purchaseNumber - Número do pedido de compras
        //               comments: comentarios.
        // # Notes:
        ctrl.deletePurchaseOrder = function(purchaseNumber, comments) {
            var parameters = {
                'pNumPedido': purchaseNumber,
                'pComentario': comments
            };
            ccapi369.deletePurchaseOrder({}, parameters, function(result) {
                if (!result['$hasError']) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success',
                        title: $rootScope.i18n('l-purchase-orders', [], 'dts/mcc'),
                        detail: $rootScope.i18n('l-success-deleted', [], 'dts/mcc') + '!'
                    });
                    ctrl.loadData(ctrl.ttListParameters, false);
                }
            });
        }

        // # Purpose: Evento de uma remoção de um pedido de compras.
        // # Parameters: purchaseNumber - Número do pedido de compras
        // # Notes:
        ctrl.onRemove = function(purchaseModel) {
            
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question',
                text: $rootScope.i18n('l-confirm-delete-operation', [], 'dts/mcc'),
                cancelLabel: 'l-no',
                confirmLabel: 'l-yes',
                callback: function(isPositiveResult) {
                    if (isPositiveResult) {
                        if (purchaseModel['situacao'] == 1) {
                            commentsModal.open().then(function(result) {
                                ctrl.deletePurchaseOrder(purchaseModel['num-pedido'], result);
                            });
                        } else {
                            ctrl.deletePurchaseOrder(purchaseModel['num-pedido'], null);
                        }
                    }
                }
            });
        }

        if ($rootScope.currentuserLoaded) { ctrl.init(); }
        
        // *********************************************************************************
        // *** Events Listeners
        // *********************************************************************************
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            ctrl.init();
        }); 
    }
    index.register.controller('mcc.purchaseorder.ListCtrl', purchaseOrderListController);
});
