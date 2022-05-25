define(['index'], function (index) {

    cd1409ListCtrl.$inject = ['$rootScope',
                              '$scope',
                              '$location',
                              'totvs.app-main-view.Service',
                              'mce.fchmatcd1409.factory',
                              'mce.utils.Service',
                              '$q', 
                              '$filter', 
                              'TOTVSEvent', 
                              'mce.cd1409.modalAdvancedSearch.Service',
                              'mce.cd1409.modalChooseBalance.Service',
                              'mcc.followup.ModalFollowUp',
                              'mce.data.Factory',
                              '$timeout'];

    function cd1409ListCtrl($rootScope,
                            $scope, 
                            $location, 
                            appViewService, 
                            fchmatcd1409, 
                            mceUtils, 
                            $q, 
                            $filter, 
                            TOTVSEvent, 
                            modalAdvancedSearch, 
                            modalChooseBalance,
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
                controller.fchmatcd1409 = fchmatcd1409;
                controller.mceUtils = mceUtils;
                controller.linhasSelecionadasInvalidas = 0;
                controller.linhasSelecionadas = [];
                controller.dataFactory = dataFactory;

                /* #### CONFIGURAÇÕES DO GRID #### */
                controller.templateQtdAtender = getTemplateQtdAtender;

                controller.templateSituacao = getTemplateSituacao;

                controller.gridOptions = {
                    groupable: {
                        messages: {
                            empty: $scope.i18n('l-drag-group-column'),
                        }
                    }
                };

                /* Função....: getTemplateQtdAtender
                   Descrição.: Funcao chamada pela celula quantidade a atender.
                               Retorna template que altera cor do conteúdo da célula
                               conforme saldo em estoque
                   Parâmetros: dataItem: objeto correspondente à linha do grid
                 */
                function getTemplateQtdAtender(dataItem) {
                    var color = "";

                    switch (dataItem['ind-saldo']){
                        case 0:
                            color = "#ff0000"; // red
                            break;
                         case 1:
                             color = "#ffa500"; // orange
                            break;
                         case 2:
                             color ="#008000"; // green
                            break;
                         default:
                            color = "#000000"; // black
                    }
                    return '<span style = "font-weight: bold; color: ' + color + '">' + $filter('number')(dataItem['qt-a-atender'], 4) +
                         '</span>';
                };

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
                    fchmatcd1409.initializeInterface(function (result) {
                        controller.ttListParameters = result[0];
                        controller.mountDisclaimers(controller.ttListParameters);
                        controller.load();
                    });
                };

                /*  Função....: simplifiedRequisitionProcessing
                    Descrição.: Função chamada ao clicar no botão Atender
                    Parâmetros: dataItem: objeto correspondente a linha do grid.
                */
                this.simplifiedRequisitionProcessing = function (dataItem) {    
                    controller.fchmatcd1409.simplifiedRequisitionProcessing({}, dataItem,
                        function (result) {    
                            if (!result.$hasError) {
                                controller.load(false);    
                            }    
                        });    
                };

                /*  Função....: filterQtdToAttend
                    Descrição.: Filtro que retorna quantidade a atender m,aior que zero.
                                Cahamdo dentro da função selectedRequisitionProcessing
                    Parâmetros: data -> linha selecionada
                */
                this.filterQtdToAttend = function(data){
                    return data['qt-a-atender'] > 0;
                };
        
                /*  Função....: selectedRequisitionProcessing
                    Descrição.: Função chamada ao clicar no botão Atender Selecionados
                    Parâmetros: 
                */
                this.selectedRequisitionProcessing = function () {
                   if (controller.ttListParameters.permiteAtendSimp && controller.totalRecords > 0 && controller.linhasSelecionadasInvalidas === 0) {                                       
                       
                        controller.fchmatcd1409.selectedRequisitionProcessing({}, controller.selectedItems,
                            function (result) {    
                                if (!result.$hasError) {
                                    controller.load(false);    
                                }    
                            });                            
                    }    
                };


                /*  Função....: closeInventoryRequisition
                    Descrição.: Função chamada ao clicar na opção Fechar Requisição
                    Parâmetros: nrRequis: número da requisição
                */
                this.closeInventoryRequisition = function (nrRequis) {
                    $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                        title: $scope.i18n('l-close-request-question', [nrRequis], 'dts/mce'),
                        cancelLabel: 'l-cancel',
                        confirmLabel: 'l-confirm',
                        text: $scope.i18n('msg-close-request-item-question'),
                        callback: function (isPositiveResult) {
                            if (isPositiveResult){
                                controller.fchmatcd1409.closeInventoryRequisition({nrRequisicao: nrRequis}, {},
                                    function (result) {    
                                        if (!result.$hasError) {
                                            controller.load(false);    
                                        }
                                    });
                            }
                        }
                    });
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
                    var option = controller.dataFactory.get("cd1409.group"); // busca agrupamento aramazenado no dataFactory                   
                    if (option){
                        controller.myGrid.dataSource.group(JSON.parse(option)); // atualiza configurações grid
                        controller.dataFactory.delete('cd1409.group'); // apaga dataFactory
                    }
                };

                /* Função....: deleteDataFactoryGroup
                   Descrição.: Eliminar configuracoes feitas no grid pelo usuario
                   Parâmetros: 
                */
                this.deleteDataFactoryGroup = function(){
                    controller.dataFactory.delete("cd1409.group"); 
                };


                /* Função....: init
                    Descrição.: responsável por inicializar o controller principal
                    Parâmetros: <não há>                    
                 */
                this.init = function (isSaveNew) {
                    createTab = appViewService.startView($rootScope.i18n('l-realization') + ' ' + $rootScope.i18n('l-request'), 'mce.cd1409.ListCtrl', controller);

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


                /* Função....: openModalChooseBalance
                    Descrição.: Abrir a modal de atendimento por saldo
                    Parâmetros: <não há>                    
                 */
                this.openModalChooseBalance = function (dataItem) {
                    var obj = {};
                    angular.copy(dataItem, obj); // Realiza copia do objeto por causa do bind com tela
                    var modalInstance = modalChooseBalance.open({
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


                    controller.fchmatcd1409.getListItensRequest({
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
                
                this.editGrid = function (event, column) {
                    if (column.column == "qt-a-atender") {
                        /* Deixa a celula habilitada se permite atendimento simplificado e a situacao nao estiver fechada */
                        if (controller.ttListParameters.permiteAtendSimp && event.model['sit'] != 3) {                       
                            return;
                        }
                        controller.myGrid.closeCell();
                        controller.myGrid.table.focus();
                    }
                };


                this.changeGrid = function (event) {

                    // inicializando arrays quando clica na linha do grid
                    controller.linhasSelecionadasInvalidas = 0;
                    controller.linhasSelecionadas = [];

                    // Filtro para retornar linhas invalidas(situacao fechada)
                    this.filtro = function(data){
                        return data === 2; 
                    };

                    controller.myGrid.select().each(function(){ // percorre linhas selecionadas
                        controller.linhasSelecionadas.push(event.sender.dataItem($(this))['situacao']); // carrega array com todas as linhas selecionadas
                    });

                    controller.linhasSelecionadasInvalidas = controller.linhasSelecionadas.filter(this.filtro).length; // Carrega array com linhas invalidas
                   
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
                        controller.dataFactory.set("cd1409.group", kendo.stringify(groupingChanged));
                    }
                };

                if ($rootScope.currentuserLoaded) {
                    this.init();
                };

                // *********************************************************************************
                // *** Events Listners
                // *********************************************************************************
                $scope.$on('$destroy', function () {
                   controller.setDataFactoryGroup();
                   cd1409ListCtrl = undefined;
                });

                $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                    cd1409ListCtrl.init();
                });
    };

    /*####################################################################################################
        # CONTROLLER: modalAdvancedSearch
        * REGISTRO..: mce.cd1409.modalAdvancedSearch.Service
        # DESCRICAO.: Controle responsável pela abertura da Modal de Pesquisa Avançada
        ####################################################################################################*/
    modalAdvancedSearch.$inject = ['$modal'];
    function modalAdvancedSearch($modal) {

                this.open = function (params) {

                    var instance = $modal.open({

                        templateUrl: '/dts/mce/html/cd1409/cd1409.advanced.search.html',
                        controller: 'mce.cd1409.AdvacendSearch as controller',
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
        # CONTROLLER: modalChooseBalance
        * REGISTRO..: mce.cd1409.modalChooseBalance.Service
        # DESCRICAO.: Controle responsável pela abertura da Modal para seleção de saldo para atendimento
        ####################################################################################################*/
    modalChooseBalance.$inject = ['$modal'];
    function modalChooseBalance($modal) {

                this.open = function (params) {

                    var instance = $modal.open({

                        templateUrl: '/dts/mce/html/cd1409/cd1409.choose.balance.html',
                        controller: 'mce.cd1409.ChooseBalance as controller',
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
        * REGISTRO..: mce.cd1409.modalChooseBalance.Service
        # DESCRICAO.: Controle responsável pela abertura da Modal para seleção de saldo para atendimento
        ####################################################################################################*/
    modalChooseBalance.$inject = ['$modal'];
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
    index.register.controller('mce.cd1409.ListCtrl', cd1409ListCtrl);
    index.register.service('mce.cd1409.modalAdvancedSearch.Service', modalAdvancedSearch);
    index.register.service('mce.cd1409.modalChooseBalance.Service', modalChooseBalance);
    index.register.service('mcc.followup.ModalFollowUp', modalFollowup);


});
