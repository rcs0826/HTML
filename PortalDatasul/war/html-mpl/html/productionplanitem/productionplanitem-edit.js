define(['index'], function(index) {

    /**
     * Controller Edit
     */
    productionplanitemEditCtrl.$inject = [
        '$rootScope',
        '$scope',
        '$stateParams',
        '$window',
        '$location',
        '$state',
        'totvs.app-main-view.Service',
        'mpl.periodo.zoom',
        'fchman.fchmanproductionplanitem.Factory',
        'men.item.zoom',
        'men.referenciaitem.zoom',
        'mpd.emitente.zoom',
        'mpd.gr-cli.zoom',
        'mpd.ped-venda.zoom',
        'mpd.estabelec.zoom',
        'helperProductionPlanItem',
        'TOTVSEvent'
    ];

    function productionplanitemEditCtrl($rootScope,
                                        $scope,
                                        $stateParams,
                                        $window,
                                        $location,
                                        $state,
                                        appViewService,
                                        servicePeriodZoom,
                                        fchmanproductionplanitemFactory,
                                        serviceItemZoom,
                                        serviceItemReferenceZoom,
                                        serviceEmitenteZoom,
                                        serviceCustomerGroupZoom,
                                        serviceCustomerRequestZoom,
                                        serviceSiteZoom,
                                        helperProductionPlanItem,
                                        TOTVSEvent) {

        /**
         * Variável Controller
         */
        var controller = this;

        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************

        // mantem o conteudo do registro em edição/inclusão
        this.model = {};

        // Definição dos services de zoom
        this.servicePeriodZoom = servicePeriodZoom;
        this.serviceCustomerRequestZoom = serviceCustomerRequestZoom;
        this.serviceItemZoom = serviceItemZoom;
        this.serviceEmitenteZoom = serviceEmitenteZoom;
        this.serviceCustomerGroupZoom = serviceCustomerGroupZoom;
        this.serviceSiteZoom = serviceSiteZoom;
        this.serviceItemReferenceZoom = serviceItemReferenceZoom;

        // atributo auxiliar para determinar se é uma edição, desabilitando o campo chave
        //this.idDisabled = $state.is('dts/mpl/productionplanitem.edit');

        // título que será mostrado no breadcrumb de edição do html
        var breadcrumbTitle;

        // título que será mostrado no header de edição do html
        var headerTitle;

        // habilita o campo referencia quando o item for controlado por referencia
        this.itemHasReference = false;

        this.isSetShortName = false;

        this.periodType = {'cd-tipo': 0,
                           'descricao': "",
                           'int-1': 0,
                           'log-periodo-gerc': false,
                           'nr-dia': 0};

        // variável para controlar se o usuário selecionou a opção Salvar e Novo
        var isSaveNew = false;

        this.productionPlan = "";
        this.isMultiSites = false;
        this.planType = "";
        this.model.siteCode = {};

        this.ttProductionPlanItem = {};

        // *********************************************************************************
        // *** Functions
        // *********************************************************************************

        /* Função....: save
           Descrição.: ação de clicar no botão Salvar
           Parâmetros:  */
        this.save = function () {
            // verifica se o formulario tem dados invalidos
            if (this.isInvalidForm()) {
                return;
            }

            var ano = controller.model.initialPeriodString['ano'];
            var periodo = controller.model.initialPeriodString['nr-periodo'];

            controller.ttProductionPlanItem = {
                date: controller.model.date,
                quantity: controller.model.quantity,
                reference: controller.model.reference['cod-refer'],
                shortName: controller.model.shortName['nome-abrev'],
                customerGroup: controller.model.customerGroup['cod-gr-cli'],
                customerRequest: controller.model.customerRequest['nr-pedcli'],
                sequence: controller.model.sequence,
                confirmQuantity: 0,
                period: periodo,
                source: "",
                structureNumber: "",
                deliveryNumber: "",
                itemCode: controller.model.item['it-codigo'],
                componentListCode: "",
                siteCode: controller.model.siteCode['cod-estabel'],
                planCode: controller.model.productionPlan,
                year: ano,
                unitOfMeasure: "",
                unitOfMeasureDescription: "",
                isSelected: "",
                periodString: periodo + "/" + ano,
                periodType: controller.periodType['cd-tipo'],
                itemDescription: "",
                hasReference: controller.itemHasReference,
            };

            // faz o create
            fchmanproductionplanitemFactory.addProductionPlanItem(controller.ttProductionPlanItem, function (result) {
                if (result && !result['$hasError']) {
                    // redireciona a tela para a tela de detalhar
                    if (controller.isSaveNew) {
                        controller.setDefaultModel();
                    } else {
                        controller.redirectToProductionPlanItem();
                    }

                    controller.isSaveNew = false;

                    // notifica o usuario que conseguiu salvar o registro
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success',
                        title: ($rootScope.i18n('msg-item-created')),
                        detail: ($rootScope.i18n('msg-success-created'))
                    });
                }
            });
        }

        /* Função....: saveNew
           Descrição.: ação de clicar no botão Salvar e Novo
           Parâmetros:  */
        this.saveNew = function () {
            controller.isSaveNew = true;
            controller.save();
        }

        /* Função....: cancel
           Descrição.: ação de clicar no botão Cancelar
           Parâmetros:  */
        this.cancel = function() {
            // solicita que o usuario confirme o cancelamento da edição/inclusão
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question',
                text: $rootScope.i18n('l-cancel-operation'),
                cancelLabel: 'l-no',
                confirmLabel: 'l-yes',
                callback: function(isPositiveResult) {
                    if (isPositiveResult) { // se confirmou, navega para a pagina anterior
                        controller.redirectToProductionPlanItem();
                    }
                }
            });
        }

        /* Função....: onChangeItem
           Descrição.: evento ng-change do campo item
           Parâmetros:  */
        this.onChangeItem = function() {
            // Verifica se o item é controlado por referência
            if (controller.model.item != undefined && controller.model.item['tipo-con-est'] == 4) {
                controller.itemHasReference = true;
                controller.model.reference = "";
                controller.serviceItemReferenceZoom.getReference({'init': {'property': 'it-codigo',
                                                                           'value': controller.model.item['it-codigo'],
                                                                           'type': 'integer'}});
            } else {
                controller.itemHasReference = false;
            }
        }

        /* Função....: onChangePeriodo
           Descrição.: evento ng-change do campo período
           Parâmetros:  */
        this.onChangePeriodo = function() {
            if (controller.model.initialPeriodString != undefined) {

                var parameters = {
                    period: controller.model.initialPeriodString['nr-periodo'],
                    year: controller.model.initialPeriodString['ano'],
                    planType: controller.periodType['cd-tipo'],
                };

                // Retorna o período referente a data informada
                fchmanproductionplanitemFactory.getDateOfPeriod(parameters, function(result) {
                    if (result) {
                        // para cada item do result
                        angular.forEach(result, function (value) {
                            if (value.periodValue != -1 && value.yearValue != -1) {
                                controller.model.date = value.dateValue;
                            }
                        });
                    }
                });
            }
        }

        /* Função....: onChangeShortName
           Descrição.: evento ng-change do campo nome abreviado
           Parâmetros:  */
        this.onChangeShortName = function() {

            if (controller.model.shortName != undefined) {
                // Busca grupo de cliente
                angular.forEach(controller.serviceCustomerGroupZoom.groupList, function(value) {
                    if (value['cod-gr-cli'] == controller.model.shortName['cod-gr-cli']) {
                        controller.model.customerGroup = {'cod-gr-cli': value['cod-gr-cli'],
		            	                                  'descricao': value['descricao']};
                    }
                });

                // Desativa o campo Grupo de Cliente
                controller.isSetShortName = true;

                // Atualiza a lista de Pedidos de Cliente
                controller.serviceCustomerRequestZoom.getRequest({'pedido':'', 'nomeAbrev':controller.model.shortName['nome-abrev']});

            } else {
                controller.isSetShortName = false;
            }
        }

        /* Função....: onChangePeriodoZoom
           Descrição.: evento ng-change do campo período zoom.
           Parâmetros:  */
        this.onChangePeriodoZoom = function() {
            controller.servicePeriodZoom.periodList = [controller.model.initialPeriodString];

            controller.onChangePeriodo();
        }

        /* Função....: onChangeDataFinal
           Descrição.: evento ng-change do campo Data Final
           Parâmetros:  */
        this.onChangeDataFinal = function() {

            var parameters = {
                date: controller.model.date,
            };

            // Retorna o período referente a data informada
            fchmanproductionplanitemFactory.getPeriodOfDate(controller.periodType['cd-tipo'], parameters, function(result) {
                if (result) {
                    angular.forEach(result, function (value) {
                        if (value.periodValue != -1 && value.yearValue != -1) {
                            controller.model.initialPeriodString = {'ano': value.yearValue,
                                                                    'cd-tipo': controller.periodType['cd-tipo'],
                                                                    'dt-inicio': value.dateValue,
                                                                    'dt-termino': value.finalDateValue,
                                                                    'nr-periodo': value.periodValue};

                            controller.servicePeriodZoom.periodList = [controller.model.initialPeriodString];
                            controller.model.date = value.finalDateValue;
                        } else {
                            controller.model.initialPeriodString = undefined;
                        }
                    });
                }
            });
        }

        /* Função....: setDefaultModel
           Descrição.: define as informações padrão para o model
           Parâmetros:  */
        this.setDefaultModel = function () {
            var currentDate = new Date();

            controller.model = {date: currentDate.getTime(),
                                quantity: 0,
                                reference: "",
                                shortName: "",
                                customerGroup: "",
                                customerRequest: "",
                                sequence: 0,
                                initialPeriodString: undefined,
                                item: undefined,
                                siteCode: "",
                                productionPlan: controller.productionPlan};

            controller.onChangeDataFinal();
        }

        /* Função....: isInvalidForm
           Descrição.: verifica se o formulario é invalido
           Parâmetros:  */
        this.isInvalidForm = function() {

            var isInvalidForm = false;
            var warning;

            // verifica se a quantidade foi informada
            if (!controller.model.quantity || controller.model.quantity == "") {
                isInvalidForm = true;
                warning = $rootScope.i18n('l-quantity');
            }

            // verifica se o item foi informado
            if (!controller.model.item || !controller.model.item['it-codigo'] || controller.model.item['it-codigo'].length === 0) {
                isInvalidForm = true;
                warning = $rootScope.i18n('l-item');
            }

            // verifica se o período foi informado
            if (!controller.model.initialPeriodString || controller.model.initialPeriodString.length === 0) {
                isInvalidForm = true;

                if (warning) {
                    warning = warning + ' ' + $rootScope.i18n('l-period');
                } else {
                    warning = $rootScope.i18n('l-period');
                }
            }

            // verifica se a data foi informada
            if (!controller.model.date || controller.model.date.length === 0) {
                isInvalidForm = true;

                if (warning) {
                    warning = warning + ' ' + $rootScope.i18n('l-date');
                } else {
                    warning = $rootScope.i18n('l-date');
                }
            }

            // se for invalido, monta e mostra a mensagem
            if (isInvalidForm) {
                warning = warning + ' ' + $rootScope.i18n('l-required');

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                  type: 'error',
                  title: $rootScope.i18n('l-attention'),
                  detail: warning
                });
            }

            // Nao deve permitir incluir um item comprado em um plano de producao do tipo PP
            if (controller.model.item['compr-fabric'] == 1 && controller.planType == "PP") {
                isInvalidForm = true;

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error',                                      // tipo de notificação
                    title: $rootScope.i18n('l-attention'),          // titulo da notificação
                    detail: $rootScope.i18n('msg-item-comprado-pp')     // detalhe da notificação
                });
            }

            return isInvalidForm;
        }

        /* Função....: redirectToProductionPlanItem
           Descrição.: Redireciona para a tela de items do plano de producao
           Parâmetros:  */
        this.redirectToProductionPlanItem = function() {
            $location.path('dts/mpl/productionplanitem/');
        }

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        /* Função....: init
           Descrição.: quando o controller for iniciado
           Parâmetros:  */
        this.init = function() {
            if (appViewService.startView($rootScope.i18n('l-production-plan-item'),
                                         'mpl.productionplanitem.EditCtrl',
                                         controller)) {
                // se é a abertura da tab, implementar aqui inicialização do controller
            }

            var currentDate = new Date();

            if (helperProductionPlanItem && helperProductionPlanItem.data) {
                controller.productionPlan = helperProductionPlanItem.data.productionPlanCode;
                controller.periodType['cd-tipo'] = helperProductionPlanItem.data.productionPlanPeriodType;
                controller.isMultiSites = helperProductionPlanItem.data.isMultiSites;
                controller.planType = helperProductionPlanItem.data.planType;
            }

            // inicia o model com as informações padrão
            controller.setDefaultModel();

            this.headerTitle = $rootScope.i18n('btn-add');
            this.breadcrumbTitle = this.headerTitle;
        }

        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) {
            this.init();
        }

        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************

        // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        });
    }

    index.register.controller('mpl.productionplanitem.EditCtrl', productionplanitemEditCtrl);

});