define([
	'index',
    '/dts/mcc/js/zoom/ordem-compra.js',
    '/dts/mcc/js/zoom/comprador.js',
    '/dts/mcc/js/zoom/cond-pagto-2.js',
    '/dts/mcc/js/api/ccapi351.js',
    '/dts/mcc/js/api/ccapi369.js',
    '/dts/mpd/js/zoom/emitente.js',
    '/dts/mpd/js/zoom/transporte.js',
    '/dts/mpd/js/zoom/mensagem.js',
    '/dts/mcc/js/mcc-utils.js',
    '/dts/mcc/html/purchaseorder/list/purchaseorder.comments.ctrl.js',
    '/dts/mcc/html/purchaseorder/edit/purchaseorder.link.ctrl.js'
], function(index) {

    // **************************************************************************************
	// *** CONTROLLER - EDIT
	// **************************************************************************************	
	purchaseOrderEditController.$inject = ['$rootScope', '$scope', '$state', 'totvs.app-main-view.Service', 'TOTVSEvent', 'mcc.ccapi351.Factory', 'mcc.ccapi369.Factory', '$stateParams','mcc.purchaseorder.commentsModal', 'mcc.purchaseorder.linkModal', '$location'];
	function purchaseOrderEditController($rootScope, $scope, $state, appViewService, TOTVSEvent, ccapi351, ccapi369, $stateParams, commentsModal, linkModal, $location) {
        var ctrl = this;
        ctrl.model = {};
        ctrl.paymentTermsPanel = true;
        ctrl.supplementsPanel = true;
        ctrl.purchaseOrderPanel = true;
        ctrl.conditionPaymentField = false;
        ctrl.totalPaymentCondition = 0;
        ctrl.ttEnableFields = [];
        ctrl.executeLeaveFunction = true;
        ctrl.purchaseOrderNumber = 0;
        ctrl.documentNumberVendorFormat = '';
        ctrl.documentNumberIssuerFormat = '';
        ctrl.isPrinted = false;
        ctrl.isPurchaseCreate = true;
        ctrl.isOpenPurchaseOrder = false;
        ctrl.isFreightPaid = false;
        ctrl.activeComments = false;
        ctrl.paymentConditionCache = null;
        ctrl.options = [
            {value: 1, label: $rootScope.i18n('l-purchase')},
            {value: 2, label: $rootScope.i18n('l-service')},
            {value: 3, label: $rootScope.i18n('l-subcontracting')},
        ];
        ctrl.listOfSpecificCondition = [];

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************   

        // # Purpose: Método de inicialização
        // # Parameters: 
        // # Notes: 
        ctrl.init = function() {
            
            // Inicializando variaveis devido ao editar da tela.
            ctrl.model = {};
            ctrl.specificCondition = false;
            ctrl.activeComments = false;
            ctrl.listOfSpecificCondition = [];
            
            createTab = appViewService.startView($rootScope.i18n('l-purchase-orders', [], 'dts/mcc'), 'mcc.purchaseorder.EditCtrl', ctrl);
            ctrl.purchaseOrderNumber = $stateParams.purchaseOrderNumber;
            
            if (ctrl.purchaseOrderNumber && Number(ctrl.purchaseOrderNumber) > 0) {
                ctrl.isPurchaseCreate = false;
                ctrl.executeLeaveFunction = false;
            } else
                ctrl.isPurchaseCreate = true;

            if (!createTab && !ctrl.isPurchaseCreate && appViewService.previousView 
                && appViewService.previousView.name != 'dts/mcc/purchaseorder.start'
                && appViewService.previousView.name != 'dts/mcc/purchaseorder.edit') {

                // Adiciona novamente o scroll na pagina.
                document.getElementById('menu-contents').style.overflowY = "scroll";

                // Inicializa as variáveis dos paineis de condição de pagamento e complementos
                ctrl.paymentTermsPanel = true;
                ctrl.supplementsPanel = true;
                ctrl.detailAll = false;

                if (ctrl.documentNumberVendor) {
                    ctrl.documentNumberVendor = '' + ctrl.documentNumberVendor['cod-emitente'];
                }

                if (ctrl.documentNumberIssuer) {
                    ctrl.documentNumberIssuer = '' + ctrl.documentNumberIssuer['cod-emitente'];
                }
                return;
            }

            if (ctrl.previusState == "") {
                ctrl.previusState = appViewService.previousView.name.toLowerCase();
            }
            
            if (ctrl.isPurchaseCreate)
                ctrl.leaveFields('', {}, true);
            else
                ctrl.loadPurchaseOrder();

            ccapi351.getViaTransporte({}, {}, function(results) {
                ctrl.routeTransport = [];
                results.forEach(element => {
                    ctrl.routeTransport.push({
                        value: element.id,
                        label: element.descricao
                    });
                });
            });

            ctrl.detailAll = false;
        }
        
        // # Purpose: Carrega os dados do Pedido de Compra na tela.
        // # Parameters:
        // # Notes: 
        ctrl.loadPurchaseOrder = function() {
            
            ctrl.leaveFields('', {}, false);
            ctrl.listOfPurchaseOrderline = [];

            var parameter = {
                numPedido: ctrl.purchaseOrderNumber
            }
            
            ccapi351.getOrderDetails(parameter, {}, function(result) {
                ctrl.model = result.ttPurchaseOrderDefaultAux[0];
                ctrl.isPrinted = ctrl.model['situacao'] == 1 ? true : false;
                ctrl.listOfPurchaseOrderline = result.ttSummaryPurchRequisition;
                ctrl.documentNumberVendor = '' + ctrl.model['cod-emitente'];
                ctrl.documentNumberIssuer = '' + ctrl.model['cod-emit-terc'];

                /**
                 * Valida a condição específica de pagamento.
                 */
                ctrl.paymentConditionCache = ctrl.model['cod-cond-pag'];
                if (ctrl.model['cod-cond-pag'] === 0) {
                    
                    ccapi351.getPaymentTerms(parameter, {}, function(paymentTerms) {
                        ctrl.listOfSpecificCondition = paymentTerms;
                    });

                    ctrl.specificCondition = true;
                    ctrl.conditionPaymentField = true;
                }

                ctrl.fillFreighPaidVar();

                ctrl.purchaseOrderPanel = false;
                ctrl.isOpenPurchaseOrder = true;
                ctrl.executeLeaveFunction = true;
            });
            
        }
        
        // # Purpose: Método auxiliar para preenchimento da variavel responsável pelo frete.
        // # Parameters:
        // # Notes: 
        ctrl.fillFreighPaidVar = function() {
            if (ctrl.model.frete == 1) 
                ctrl.isFreightPaid = true;
            else 
                ctrl.isFreightPaid = false;
        }

        // # Purpose: Método de leave, executa algumas regras no progress de acordo com o campo informado
        // # Parameters: fieldName - Nome do campo
        //               ttPurchaseOrder - Dados a serem validados no Progress
        //               updateModel - Se for marcado como true, irá atualizar a variavél "model" do controller.
        // # Notes: 
        ctrl.leaveFields = function(fieldName, ttPurchaseOrder, updateModel) {
            
            if (!ctrl.executeLeaveFunction)
                return;

            var parameters = {
                pType: ctrl.isPurchaseCreate ? 'Create' : 'Update',
                pFieldName: fieldName,
                ttPurchaseOrder: ttPurchaseOrder
            }

            if (ctrl.isFreightPaid)
                ctrl.model.frete = 1;
            else
                ctrl.model.frete = 2;

            ccapi351.getEmergencyOrderDefaults({}, parameters, function(results) {
                ctrl.ttEnableFields = results.ttEnableFields;
                
                if (updateModel) {
                    ctrl.model = results.ttPurchaseOrderDefaultAux[0];
                    
                    ctrl.fillFreighPaidVar();
    
                    if (ctrl.documentNumberVendor == null && ctrl.model['cod-emitente'] == 0)
                        ctrl.documentNumberVendor = '0';
                    
                    if (ctrl.documentNumberIssuer == null && ctrl.model['cod-emit-terc'] == 0)
                        ctrl.documentNumberIssuer = '0';
                }
            });
        }

        // # Purpose: Retorna se o campo foi ou não desabilitado pelo ERP.
        // # Parameters: - fieldName - Nome do campo a ser verificado a validade.
        // # Notes: 
        ctrl.enableFields = function(fieldName) {
            for(var count = 0; count < ctrl.ttEnableFields.length; count++) {
                if (ctrl.ttEnableFields[count].campo == fieldName)
                    return !ctrl.ttEnableFields[count].habilitado;
            }
            return false;
        }

        // # Purpose: Preenche o campo documento e executa o leave do campo fornecedor
        // # Parameters: 
        // # Notes: 
        ctrl.getDocumentNumberVendor = function() {
            
            if (!ctrl.executeLeaveFunction)
                return;

            if (ctrl.documentNumberVendor) {
                ctrl.documentVendor = ctrl.documentNumberVendor.cgc;
                ctrl.model['cod-emitente'] = ctrl.documentNumberVendor['cod-emitente'];
                var parameter = {
                    pCodEmitente: ctrl.model['cod-emitente']
                }
                ccapi351.getFormatoNumeroDocumento(parameter, {}, function(results) {
                    ctrl.documentNumberVendorFormat = results.formatoDocumento;
                });
                ctrl.leaveFields('cod-emitente', ctrl.model, true);
            } else {
                ctrl.model['cod-emitente'] = null;
            }
        }

        // # Purpose: Preenche o campo documento
        // # Parameters: 
        // # Notes: 
        ctrl.getDocumentNumberIssuer = function() {

            if (!ctrl.executeLeaveFunction)
                return;

            if (ctrl.documentNumberIssuer) {
                ctrl.documentIssuer = ctrl.documentNumberIssuer.cgc;
                ctrl.model['cod-emit-terc'] = ctrl.documentNumberIssuer['cod-emitente'];
                var parameter = {
                    pCodEmitente: ctrl.model['cod-emit-terc']
                }
                ccapi351.getFormatoNumeroDocumento(parameter, {}, function(results) {
                    ctrl.documentNumberIssuerFormat = results.formatoDocumento;
                });
                ctrl.leaveFields('cod-emitente', ctrl.model, true);
            } else {
                ctrl.model['cod-emit-terc'] = null;
            }
        }

        // # Purpose: Executa a função para desvincular as ordens do pedido no back-end.
        // # Parameters: ttSummaryPurchRequisition - Lista do pedido de compra a ser desvinculado.
        //               comments                  - Comentário a ser inserido como motivo de desvinculação.
        // # Notes: 
        ctrl.unlinkRequisitions = function(ttSummaryPurchRequisition, comments) {
            var parameters = {
                'ttSummaryPurchRequisition': ttSummaryPurchRequisition,
                'pComentario': comments
            }

            ccapi369.unlinkRequisitions({}, parameters, function(result) {
                if (!result['$hasError']) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success',
                        title: $rootScope.i18n('l-purchase-orders', [], 'dts/mcc'),
                        detail: $rootScope.i18n('l-success-unlinked', [], 'dts/mcc')
                    });
                    ctrl.loadPurchaseOrder();
                }
            });
        }
        
        // # Purpose: Verifica se tem alguma ordem de compra selecionada.
        // # Parameters:
        // # Notes: 
        ctrl.isPurchaseSelected = function() {
            if (ctrl.listOfPurchaseOrderline == undefined)
                return false;
                
            var listOfPurchaseOrderlineSelected = ctrl.listOfPurchaseOrderline.filter(function (element) {
                // Retorna todos os elementos selecionados que não esteja com a situação "Eliminado".
                return element.situacao != 4 && element.$selected;
            });

            if (listOfPurchaseOrderlineSelected.length > 0)
                return true;
            else
                return false;
        }

        // # Purpose: Evento do breadcrumb, deve voltar para a listagem de pedido de compras
        // # Parameters:
        // # Notes: 
        ctrl.onBreadcrumbEvent = function() {
            ctrl.cleanVariables();
            appViewService.removeView(appViewService.getPageActive());
            $state.go('dts/mcc/purchaseorder.start');
        }

        // # Purpose: Limpa as variáveis do controller.
        // # Parameters:
        // # Notes: 
        ctrl.cleanVariables = function() {
            ctrl.activeComments = false;
            ctrl.purchaseOrderNumber = null;
            ctrl.model = {};
            ctrl.documentNumberVendor = null;
            ctrl.documentNumberIssuer = null;
            ctrl.listOfSpecificCondition = [];
            ctrl.listOfPurchaseOrderline = [];
            ctrl.specificCondition = false;
        }

        // # Purpose: Evento do botão Desvincular Todos.
        // # Parameters:
        // # Notes: 
        ctrl.onUnlinkOrders = function() {
            var listOfPurchaseOrderlineSelected = ctrl.listOfPurchaseOrderline.filter(function (element) {
                // Retorna todos os elementos selecionados que não esteja com a situação "Eliminado".
                return element.situacao != 4 && element.$selected;
            });

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question',
                text: $rootScope.i18n('l-unlink-orders-question-operation', [], 'dts/mcc'),
                cancelLabel: 'l-no',
                confirmLabel: 'l-yes',
                callback: function(isPositiveResult) {
                    if (isPositiveResult) {
                        if (ctrl.model['situacao'] == 1) {
                            commentsModal.open().then(function(result) {
                                ctrl.unlinkRequisitions(listOfPurchaseOrderlineSelected, result);
                            });
                        } else {
                            ctrl.unlinkRequisitions(listOfPurchaseOrderlineSelected, '');
                        }
                    }
                }
            });
        }

        // # Purpose: Evento do botão Desvincular.
        // # Parameters: item - Objeto do pedido de compra preenchido a ser desvinculado.
        // # Notes: 
        ctrl.onUnlinkOrder = function(item) {
            
            var ttSummaryPurchRequisition = [];
            ttSummaryPurchRequisition.push(item);

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question',
                text: $rootScope.i18n('l-unlink-question-operation', [], 'dts/mcc'),
                cancelLabel: 'l-no',
                confirmLabel: 'l-yes',
                callback: function(isPositiveResult) {
                    if (isPositiveResult) {
                        if (ctrl.model['situacao'] == 1) {
                            commentsModal.open().then(function(result) {
                                ctrl.unlinkRequisitions(ttSummaryPurchRequisition, result);
                            });
                        } else {
                            ctrl.unlinkRequisitions(ttSummaryPurchRequisition, '');
                        }
                    }
                }
            });
        }

        // # Purpose: Evento do botão cancelar.
        // # Parameters: 
        // # Notes: 
        ctrl.onCancel = function() {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question',
                text: $rootScope.i18n('l-cancel-operation', [], 'dts/mcc'),
                cancelLabel: 'l-no',
                confirmLabel: 'l-yes',
                callback: function(isPositiveResult) {
                    if (isPositiveResult) {
                        ctrl.cleanVariables();
                        appViewService.removeView(appViewService.getPageActive());
                        $state.go('dts/mcc/purchaseorder.start');
                    }
                }
            });
        }

        // # Purpose: Método auxiliar do link "Expandir/Contrair Todos".
        // # Parameters: 
        // # Notes: 
        ctrl.expandAll = function() {
			ctrl.detailAll = !ctrl.detailAll;
			if (ctrl.detailAll)
				$('.panel-collapse').collapse('show');
			else
                $('.panel-collapse').collapse('hide');

            ctrl.paymentTermsPanel = !ctrl.detailAll;
            ctrl.supplementsPanel = !ctrl.detailAll;
            ctrl.purchaseOrderPanel = !ctrl.detailAll;
            ctrl.isOpenPurchaseOrder = ctrl.detailAll;
        }

        // # Purpose: Abre a tela para vincular as ordens de compra ao pedido de compras.
        // # Parameters: 
        // # Notes:
        ctrl.linkPurchaseOrder = function() {
            linkModal.open(ctrl.model['num-pedido']).then(function(result) {
                ctrl.loadPurchaseOrder();
            });
        }

        // # Purpose: Método auxiliar que ativa a tela de comentários durante a edição de um pedido de compras.
        // # Parameters: 
        // # Notes: 
        ctrl.onActiveComments = function() {
            if (ctrl.isPrinted) {
                if (ctrl.paymentConditionCache !== ctrl.model['cod-cond-pag'])
                    ctrl.activeComments = true;
                else
                    ctrl.activeComments = false;
            }
        }

        // # Purpose: Executa o método de criação/alteração de um pedido no progress.
        // # Parameters: parameters - Parametros passados para a API.
        //               isSaveAndNew - Informa se é para salvar e criar um novo pedido de compra.
        // # Notes: 
        ctrl.callCreateUpdatePurchaseOrder = function(parameters, isSaveAndNew) {
            ccapi369.createUpdatePurchaseOrder({}, parameters, function(result) {
                if (!result['$hasError']) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success',
                        title: $rootScope.i18n('l-purchase-orders', [], 'dts/mcc'),
                        detail: ctrl.isPurchaseCreate ? $rootScope.i18n('l-success-created', [], 'dts/mcc') + '!' : $rootScope.i18n('l-success-updated', [], 'dts/mcc') + '!'
                    });
                    if (isSaveAndNew) {
                        ctrl.activeComments = false;
                        ctrl.documentIssuer = null;
                        ctrl.documentNumberIssuer = null;
                        ctrl.documentVendor = null;
                        ctrl.documentNumberVendor = null;
                        ctrl.isPurchaseCreate = true;
                        ctrl.listOfSpecificCondition = [];
                        ctrl.specificCondition = false;
                        ctrl.leaveFields('', {}, true);
                    } else {
                        /* Após a persistencia dos dados do pedido é habilitado o modo edição para poder
                           vincular as ordens de compra. */
                        ctrl.isPurchaseCreate = false;
                        ctrl.listOfPurchaseOrderline = [];
                        $location.path('dts/mcc/purchaseorder/edit/' + ctrl.model['num-pedido']);
                    }
                }
            });
        }

        // # Purpose: Evento do botão salvar.
        // # Parameters: isSaveAndNew - Define se foi acionado o botão "Salvar" ou "Salvar e Novo".
        // # Notes: 
        ctrl.save = function(isSaveAndNew) {
            
            if (!ctrl.checkIsValidForm()) return;

            /**
             * Valida a condição específica de pagamento.
             */
            if (ctrl.specificCondition) {
                ctrl.model['cod-cond-pag'] = 0;
            } else {
                ctrl.listOfSpecificCondition = [];
            }
            
            if (ctrl.isFreightPaid)
                ctrl.model.frete = 1;
            else
                ctrl.model.frete = 2;

            var parameters = {
                pType: ctrl.isPurchaseCreate ? 'Create' : 'Update',
                ttPurchaseOrder: ctrl.model,
                ttPaymentTerms: ctrl.listOfSpecificCondition
            }
            
            if (ctrl.isPrinted && ctrl.activeComments) {
                commentsModal.open().then(function(result) {
                    parameters['pComentario'] = result;
                    ctrl.callCreateUpdatePurchaseOrder(parameters, isSaveAndNew);
                });
            } else
                ctrl.callCreateUpdatePurchaseOrder(parameters, isSaveAndNew);
        }

        // # Purpose: Função de validação dos campos requeridos da tela.
        // # Parameters: 
        // # Notes: 
        ctrl.checkIsValidForm = function() {
            if (ctrl.model['num-pedido'] == null || ctrl.model['num-pedido'] == 0) {
                ctrl.showErrorAlert('l-order');
                return false;
            }
            
            if (ctrl.model['data-pedido'] == null || ctrl.model['data-pedido'] == '') {
                ctrl.showErrorAlert('l-date');
                return false;
            }

            if (ctrl.model['cod-emitente'] == null || ctrl.model['cod-emitente'] < 0) {
                ctrl.showErrorAlert('l-vendor');
                return false;
            }

            if (ctrl.model['cod-emit-terc'] == null || ctrl.model['cod-emit-terc'] < 0) {
                ctrl.showErrorAlert('l-issuer-delivery');
                return false;
            }

            if (ctrl.model['end-entrega'] == null || ctrl.model['end-entrega'] == 0) {
                ctrl.showErrorAlert('l-delivery-establishment');
                return false;
            }

            if (ctrl.model['end-cobranca'] == null || ctrl.model['end-cobranca'] == 0) {
                ctrl.showErrorAlert('l-collect-establishment');
                return false;
            }

            if (ctrl.model['cod-cond-pag'] == null) {
                ctrl.showErrorAlert('l-payment-term');
                return false;
            }

            if (ctrl.model['cod-transp'] == null || ctrl.model['cod-transp'] === '') {
                ctrl.showErrorAlert('l-carrier');
                return false;
            }

            if (ctrl.model['cod-mensagem'] == null || ctrl.model['cod-mensagem'] < 0) {
                ctrl.showErrorAlert('l-message');
                return false;
            }

            if (ctrl.model['responsavel'] == null || ctrl.model['responsavel'] === '') {
                ctrl.showErrorAlert('l-owner');
                return false;
            }

            if (ctrl.specificCondition) {
                var returnSpecificCondition = false;
                ctrl.listOfSpecificCondition.forEach(function(element) {
                    if (element['data-cond'] == '') {
                        ctrl.showErrorAlert('l-date');
                        returnSpecificCondition = true;
                    }
                    if (element['percent'] == undefined || element['percent'] == '') {
                        ctrl.showErrorAlert('l-percentage');
                        returnSpecificCondition = true;
                    }
                });
                if (returnSpecificCondition) return false;
                
            }

            return true;
        }

        // # Purpose: Exibe um alerta contendo a mensagem de erro de campo obrigatório
        // # Parameters:  field - Campo a ser exibido na mensagem. Este parâmetro irá buscar a tradução no arquivo de traduções
        // # Notes:
        ctrl.showErrorAlert = function(field) {
            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type: 'error',
                title: $rootScope.i18n('l-field', [], 'dts/mcc') + ' ' + $rootScope.i18n('l-required', [], 'dts/mcc'),
                detail: $rootScope.i18n('l-required-field', [$rootScope.i18n(field)], 'dts/mcc')
            });
        }

        // # Purpose: Adiciona uma condição específica.
        // # Parameters: 
        // # Notes: 
        ctrl.addPaymentCondition = function() {
            if(ctrl.listOfSpecificCondition.length == 12)
                return;

            var total = ctrl.getTotalPaymentCondition();
            var nextPercent = 0;
            
            nextPercent = 100 - total;
            if (nextPercent <= 0)
                return;

            ctrl.listOfSpecificCondition.push(
                {
                    'data-cond': '',
                    'percent': nextPercent,
                    'comentario': '',
                    'num-pedido': ctrl.model['num-pedido']
                }
            );
            ctrl.totalPaymentCondition += nextPercent;
        }

        // # Purpose: Realiza a validação no total, caso passe de 100 é exibido uma mensagem de erro.
        // # Parameters: 
        // # Notes:
        ctrl.onBlurPaymentCondition = function() {
            ctrl.totalPaymentCondition = ctrl.getTotalPaymentCondition();
            if (ctrl.totalPaymentCondition > 100) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    'type': 'error',
                    'title': $rootScope.i18n('l-condition-specific', [], 'dts/mcc'),
                    'detail': $rootScope.i18n('l-validation-error-percent', [], 'dts/mcc')
                });
            }
        }

        // # Purpose: Realiza o calculo da porcentagem entre os campos
        // # Parameters: 
        // # Notes:
        ctrl.getTotalPaymentCondition = function() {
            var total = 0;
            ctrl.listOfSpecificCondition.forEach(function(element) {
                total += Number(element.percent);
            });
            return total;
        }

        // # Purpose: Remove uma linha da condição especificada.
        // # Parameters: index - Inidice a ser removido da lista.
        // # Notes:
        ctrl.removePaymentCondition = function(index) {
            ctrl.listOfSpecificCondition.splice(index, 1);
            ctrl.totalPaymentCondition = ctrl.getTotalPaymentCondition();
        }

        // # Purpose: Habilita/desabilita a condição especifica.
        // # Parameters: 
        // # Notes:
        ctrl.enableSpecificCondition = function() {
            setTimeout(function() {
                if (ctrl.specificCondition) {
                    ctrl.conditionPaymentField = true;
                    ctrl.addPaymentCondition();
                } else {
                    ctrl.conditionPaymentField = false;
                    ctrl.totalPaymentCondition = ctrl.getTotalPaymentCondition();
                }
                $scope.$apply();
            },0);
        }

        // # Purpose: Valida se a data de pagamento é depois da data atual..
        // # Parameters: index - Numero da linha da condição específica.
        // # Notes:
        ctrl.validateDatePayment = function(index) {

            if(index == 0) {
                if (ctrl.listOfSpecificCondition[index]['data-cond'] < ctrl.model['data-pedido']) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error',
                        title: $rootScope.i18n('l-condition-specific', [], 'dts/mcc'),
                        detail: $rootScope.i18n('l-validation-error-date', [], 'dts/mcc')
                    });
                    ctrl.listOfSpecificCondition[index]['data-cond'] = '';
                }
            } else {
                if (ctrl.listOfSpecificCondition[index]['data-cond'] < ctrl.listOfSpecificCondition[index - 1]['data-cond']) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error',
                        title: $rootScope.i18n('l-condition-specific', [], 'dts/mcc'),
                        detail: $rootScope.i18n('l-validation-error-date2', [], 'dts/mcc')
                    });
                    ctrl.listOfSpecificCondition[index]['data-cond'] = '';
                }
            }

        }

         // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { ctrl.init(); }
         
        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************
         
        // # Purpose: cria um listerner de evento para inicializar o 
        // #          controller somente depois de inicializar o contexto da aplicação.
        // # Parameters: 
        // # Notes: 
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            ctrl.init();
        });

        // # Purpose: Limpa variável com o controller
        // # Parameters: 
        // # Notes: 
         $scope.$on('$destroy', function () {
            ctrl = undefined;
        });

    }

    index.register.controller('mcc.purchaseorder.EditCtrl', purchaseOrderEditController);
});
