define(['index'], function (index) {

    cd1410ListCtrl.$inject = ['$rootScope',
                              '$scope',
                              '$location',
                              'totvs.app-main-view.Service',
                              'mce.fchmatcd1410.factory',
                              'mce.utils.Service',
                              '$q', '$filter', 'TOTVSEvent', 'mce.cd1410.modalAdvancedSearch.Service',
                              'mce.cd1410.modalChooseService.Service',
                              'mcc.followup.ModalFollowUp',
                              'mce.data.Factory',
                              '$timeout'];

    function cd1410ListCtrl($rootScope,
                            $scope, 
                            $location, 
                            appViewService, 
                            fchmatcd1410, 
                            mceUtils, 
                            $q, 
                            $filter, 
                            TOTVSEvent, 
                            modalAdvancedSearch, 
                            modalChooseService, 
                            modalFollowup,
                            dataFactory,
                            $timeout) {

                /* Controller Definitions */
                var controller = this;

                controller.ttListParameters = {};
                controller.disclaimers = [];
                controller.listOfRequest = [];
                controller.numResults = 0;
                controller.totalRecords = 0;
                controller.basicFilter = "";
                controller.fchmatcd1410 = fchmatcd1410;
                controller.mceUtils = mceUtils;
                controller.dataFactory = dataFactory;
                controller.linhasSelecionadasInvalidas = 0;
                controller.linhasSelecionadas = [];

                /* #### CONFIGURAÇÕES DO GRID #### */
                controller.gridOptions = {
                    groupable: {
                        messages: {
                            empty: $scope.i18n('l-drag-group-column'),
                        }
                    }
                };

                controller.templateSituacao = getTemplateSituacao;

                /* Função....: getTemplateSituacao
                   Descrição.: Funcao chamada pela celula situação.
                               Retorna template que altera cor do conteúdo da célula
                               conforme situação do item da requisição
                   Parâmetros: dataItem: objeto correspondente à linha do grid
                 */
                function getTemplateSituacao(dataItem) {
                    var color = '';
                    switch (dataItem['sit']) {
                        case 1:
                            color = "#ff0000"; /* 1 - atrasada - red */
                            break;
                        case 2:
                            color = '#ffa500'; /* 2- pendente - orange */
                            break;
                        case 3:
                            color = '#008000'; /* 3 - green */
                            break;
                         default:
                            color = "#000000"; // black
                    }
                    return '<span style = "font-weight: bold; color: ' + color + ';">' + dataItem['desc-status'] + '</span>';
                };

                /* #### FIM CONFIGURAÇÕES DO GRID #### */

                /* Função....: initializeInterface
                   Descrição.: Metodo GET para incialiazação da interface
                   Parâmetros:
                 */
                this.initializeInterface = function () {
                    fchmatcd1410.initializeInterface(function (result) {
                        controller.ttListParameters = result[0];
                        controller.mountDisclaimers(controller.ttListParameters);
                        controller.load();
                    });
                };

                /*  Função....: simplifiedRequisitionProcessing
                    Descrição.: Função chamada ao clicar no botão Atender
                    Parâmetros: dataItem: objeto correspondente a linha do grid.
                */
                this.simplifiedRequisitionReturn = function (dataItem) {    
                    controller.fchmatcd1410.simplifiedRequisitionReturn({}, dataItem,
                        function (result) {    
                            if (!result.$hasError) {
                                controller.load(false);    
                            }    
                        });    
                };
        
                /*  Função....: selectedRequisitionReturn
                    Descrição.: Função chamada ao clicar no botão Devolver Selecionados
                    Parâmetros: 
                */
                this.selectedRequisitionReturn = function () {    
                    
                    if (controller.totalRecords > 0 && controller.linhasSelecionadasInvalidas === 0) {     
                       
                        controller.fchmatcd1410.selectedRequisitionReturn({}, controller.selectedItems,
                            function (result) {    
                                if (!result.$hasError) {
                                    controller.load(false);    
                                }    
                            });
                    }
                        
                };
                
                /* Função....: mountDisclaimers
                    Descrição.: monta diclaimers com base nos parametros defaults
                    Parâmetros: 
                */
                this.mountDisclaimers = function (result) {
                    var disclaimer = {};                    
                    for (var i in result) {
                        switch (i) {
                            case 'cod-estabel':
                                if (result['cod-estabel'] && result['cod-estabel'] !== '') {
                                    disclaimer = {
                                        fixed: true,
                                        property: i,
                                        title: $scope.i18n('l-site') + ":" + result['cod-estabel'],
                                        value: result['cod-estabel']
                                    };
                                    controller.disclaimers.push(disclaimer);
                                }
                                break;

                           case 'dt-requis-ini':
                               if (result['dt-requis-ini'] && result['dt-requis-fim']) {
                                   disclaimer = mceUtils.parseDateRangeToDisclaimer({
                                       start: result['dt-requis-ini'],
                                       end: result['dt-requis-fim']
                                   }, 'dt-requis', 'Date');
                                   disclaimer.fixed = true;
                                   controller.disclaimers.push(disclaimer);
                               }
                                break;

                            case 'atrasada':
                                if (result.atrasada) {
                                    disclaimer = {
                                        fixed: false,
                                        property: 'situacao',
                                        title: $scope.i18n('l-status') + ":" + $scope.i18n('l-late'),
                                        value: result.atrasada
                                    };
                                    controller.disclaimers.push(disclaimer);
                                }
                                break;
                            case 'pendente':
                                if (result.pendente) {

                                    disclaimer = {
                                        fixed: false,
                                        property: 'situacao',
                                        title: $scope.i18n('l-status') + ":" + $scope.i18n('l-pending'),
                                        value: result.pendente
                                    };
                                    controller.disclaimers.push(disclaimer);

                                };
                                break;
                            case 'fechada':
                                if (result.fechada) {
                                    disclaimer = {
                                        fixed: false,
                                        property: 'situacao',
                                        title: $scope.i18n('l-status') + ":" + $scope.i18n('l-closed'),
                                        value: result.fechada
                                    };
                                    controller.disclaimers.push(disclaimer);
                                }
                                break;
                        }
                    }

                };

                /* Função....: getDataFactoryGroup
                   Descrição.: buscar configuracoes feitas no grid pelo usuario
                   Parâmetros: 
                */
                this.getDataFactoryGroup = function(){
                    var option = controller.dataFactory.get("cd1410.group"); // busca agrupamento aramazenado no dataFactory                   
                    if (option){
                        controller.myGrid.dataSource.group(JSON.parse(option)); // atualiza configurações grid
                        controller.dataFactory.delete('cd1410.group'); // apaga dataFactory
                    }
                };

                /* Função....: deleteDataFactoryGroup
                   Descrição.: Eliminar configuracoes feitas no grid pelo usuario
                   Parâmetros: 
                */
                this.deleteDataFactoryGroup = function(){
                    controller.dataFactory.delete("cd1410.group"); 
                };

                /* Função....: init
                    Descrição.: responsável por inicializar o controller principal
                    Parâmetros: <não há>                    
                 */
                this.init = function (isSaveNew) {
                    createTab = appViewService.startView($rootScope.i18n('l-return-mce') + ' ' + $rootScope.i18n('l-request'), 'mce.cd1410.ListCtrl', controller);

                    if (createTab === false && !isSaveNew) {
                        $timeout(function(){
                            controller.getDataFactoryGroup();                  
                            return;
                        });                       
                    } else {
                        controller.deleteDataFactoryGroup();
                        controller.initializeInterface();
                    }
                };


                /* Função....: openAdvancedSearch
                    Descrição.: Abrir a modal de pesquisa avançãda
                    Parâmetros: <não há>                    
                */
                this.openAdvancedSearch = function () {
                    var modalInstance = modalAdvancedSearch.open({
                            ttListParameters: controller.ttListParameters
                        })
                        .then(function (result) {
                            controller.ttListParameters = result.ttListParameters;
                            controller.disclaimers = [];
                            controller.mountDisclaimers(controller.ttListParameters);
                            controller.load();
                        });
                };


                /* Função....: openModalChooseService
                    Descrição.: Abrir a modal de atendimento por saldo
                    Parâmetros: <não há>                    
                 */
                this.openModalChooseService = function (dataItem) {
                    var obj = {};
                    angular.copy(dataItem, obj); // Realiza copia do objeto por causa do bind com tela
                    var modalInstance = modalChooseService.open({
                            dataItem: obj
                        })
                        .then(function (result) {
                            if (result && !result.$hasError) {
                                controller.load();
                            }
                        });
                };
        
                /* 
                    Abre a modal para visualizar e adicionar os follow-ups
                    * doc: Tipo do documento
                    *    1 - Requisi‡Æo de Estoque                
                    * docNumber: Número do documento (requisição)
                    * item: Código do item
                    * seqItem: Sequência do item
                    * vendor: Código do fornecedor
                    * seqQuote: Sequência da cotação ou ordem de compra no caso de pedido
                */
                this.openModalFollowUp = function(doc, docNumber, item, seqItem, vendor, seqQuote){
                    var modalInstance = modalFollowup.open({doc: doc, docNumber: docNumber, item: item, seqItem: seqItem, vendor: vendor, seqQuote: seqQuote});
                };


                /*
                  Função...: loadInfoCompItem
                  Descrição: responsável por carregar as informações complementares do item
                */
                this.loadInfoCompItem = function (dataItem) {
                    dataItem.infCompl = [
                        {
                            'narrativa'     : dataItem['narrativa'],
                            'desc-item'     : dataItem['desc-item'],
                            'desc-estado'   : dataItem['desc-estado'],
                            'qt-atendida'   : dataItem['qt-atendida'],
                            'qt-requisitada': dataItem['qt-requisitada'],
                            'nome-abrev'    : dataItem['nome-abrev'],
                            'dt-requisicao' : dataItem['dt-requisicao']
                        } 
                    ];
                };

                /*
                 Função....: load
                 Descrição.: função responsável pelo carregamento do grid
                 Parâmetros: isMore -> indica se deve ser feito a bisca de mais resultados              
                */
                this.load = function (isMore) {

                    if (!isMore) {
                        controller.numResults = 0;
                        controller.totalRecords = 0;
                        controller.listOfRequest = [];
                        controller.ttListParameters['filtro-simples'] = controller.basicFilter;
                    }


                    controller.fchmatcd1410.getListItensRequest({
                            isMore: isMore,
                            numResults: controller.numResults
                        }, controller.ttListParameters,
                        function (result) {
                            controller.numResults = result.QP_numResults;
                            controller.totalRecords = result.piTotalRecords;

                            if (isMore) {
                                // para mais resultados, incrementa a lista
                                angular.forEach(result.dsAtendimento, function (value) {
                                    controller.listOfRequest.push(value);
                                });
                            } else {
                                // Nova lista
                                controller.listOfRequest = result.dsAtendimento;
                            }

                            //Cria atributo para que o código do item seja passado corretamente via URL
                            $.each(controller.listOfRequest, function(index, value) {
                                controller.listOfRequest[index]['it-codigo-link'] = encodeURIComponent(controller.listOfRequest[index]['it-codigo']);
                            });

                        });

                };
                        
                // Deletar um disclaimer
                // d: disclaimer a ser removido
                this.removeDisclaimer = function (d) {

                    var index = controller.disclaimers.indexOf(d);

                    if (index != -1 && index != undefined) {

                        switch (controller.disclaimers[index].title) {
                            case 'Situação:Atrasada':
                                controller.ttListParameters.atrasada = false;
                                break;
                            case 'Situação:Pendente':
                                controller.ttListParameters.pendente = false;
                                break;
                            case 'Situação:Fechada':
                                controller.ttListParameters.fechada = false;
                                break;
                        }


                        if (controller.disclaimers[index].property == 'cod-estabel') {
                            controller.ttListParameters['cod-estabel'] = "";
                        }

                        controller.disclaimers.splice(index, 1);
                        controller.load(false);
                    }
                };


                this.setDataFactoryGroup = function(){
                    // Configuração original do Grid
                    var confGroupDefault = controller.myGrid.dataSource.options.group[0].field;

                    // Configuração alterada do Grid
                    var groupingChanged =  controller.myGrid.dataSource.group();
                    
                    if(groupingChanged.length == 1){
                        groupingChanged = groupingChanged[0].field;
                    }

                    //Somente salva a configurações do grid em localStorage se for diferente da conf. default.
                    if(confGroupDefault !== groupingChanged) {
                        controller.dataFactory.set("cd1410.group", kendo.stringify(groupingChanged));
                    }
                };

                if ($rootScope.currentuserLoaded) {
                    this.init();
                };

                // *********************************************************************************
                // *** Events Listners
                // *********************************************************************************
                $scope.$on('$destroy', function () {
                    cd1410ListCtrl = undefined;
                    controller.setDataFactoryGroup();
                    
                });

                $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                    cd1410ListCtrl.init();
                });
    };

    /*####################################################################################################
        # CONTROLLER: modalAdvancedSearch
        * REGISTRO..: mce.cd1410.modalAdvancedSearch.Service
        # DESCRICAO.: Controle responsável pela abertura da Modal de Pesquisa Avançada
        ####################################################################################################*/
    modalAdvancedSearch.$inject = ['$modal'];
    function modalAdvancedSearch($modal) {

                this.open = function (params) {

                    var instance = $modal.open({

                        templateUrl: '/dts/mce/html/cd1410/cd1410.advanced.search.html',
                        controller: 'mce.cd1410.AdvacendSearch as controller',
                        backdrop: 'static',
                        keyboard: false,
                        size: 'md',
                        resolve: {
                            parameters: function () {
                                return params;
                            }
                        }

                    });

                    return instance.result;
                }

    };


    /*####################################################################################################
        # CONTROLLER: modalChooseService
        * REGISTRO..: mce.cd1410.modalChooseService.Service
        # DESCRICAO.: Controle responsável pela abertura da Modal para seleção de saldo para atendimento
        ####################################################################################################*/
    modalChooseService.$inject = ['$modal'];
    function modalChooseService($modal) {

                this.open = function (params) {

                    var instance = $modal.open({

                        templateUrl: '/dts/mce/html/cd1410/cd1410.choose.service.html',
                        controller: 'mce.cd1410.ChooseService as controller',
                        backdrop: 'static',
                        keyboard: false,
                        size: 'lg',
                        resolve: {
                            parameters: function () {
                                return params;
                            }
                        }

                    });

                    return instance.result;
                }

    };
    
    /*####################################################################################################
        # CONTROLLER: modalFollowUP
        * REGISTRO..: mce.cd1409.modalChooseService.Service
        # DESCRICAO.: Controle responsável pela abertura da Modal para seleção de saldo para atendimento
        ####################################################################################################*/
    modalFollowup.$inject = ['$modal'];
    function modalFollowup($modal) {

                this.open = function (params) {

                    var instance = $modal.open({

                        templateUrl: '/dts/mcc/html/followup/followup.modal.html',
				        controller: 'mcc.followup.modalFollowupCtrl as controller',
                        backdrop: 'static',
                        keyboard: false,
                        size: 'lg',
                        resolve: {
                            parameters: function () {
                                return params;
                            }
                        }

                    });

                    return instance.result;
                }

    };

    /**********************************************************************************/
    /*   REGISTERS                                                                    */
    /**********************************************************************************/
    index.register.controller('mce.cd1410.ListCtrl', cd1410ListCtrl);
    index.register.service('mce.cd1410.modalAdvancedSearch.Service', modalAdvancedSearch);
    index.register.service('mce.cd1410.modalChooseService.Service', modalChooseService);
    index.register.service('mcc.followup.ModalFollowUp', modalFollowup);


});
