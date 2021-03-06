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

                /* #### CONFIGURAĆĆES DO GRID #### */
                controller.templateQtdAtender = getTemplateQtdAtender;

                controller.templateSituacao = getTemplateSituacao;

                controller.gridOptions = {
                    groupable: {
                        messages: {
                            empty: $scope.i18n('l-drag-group-column'),
                        }
                    }
                };

                /* FunĆ§Ć£o....: getTemplateQtdAtender
                   DescriĆ§Ć£o.: Funcao chamada pela celula quantidade a atender.
                               Retorna template que altera cor do conteĆŗdo da cĆ©lula
                               conforme saldo em estoque
                   ParĆ¢metros: dataItem: objeto correspondente Ć  linha do grid
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

                /* FunĆ§Ć£o....: getTemplateSituacao
                   DescriĆ§Ć£o.: Funcao chamada pela celula situaĆ§Ć£o.
                               Retorna template que altera cor do conteĆŗdo da cĆ©lula
                               conforme situaĆ§Ć£o do item da requisiĆ§Ć£o
                   ParĆ¢metros: dataItem: objeto correspondente Ć  linha do grid
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

                /* #### FIM CONFIGURAĆĆES DO GRID #### */


                /* FunĆ§Ć£o....: initializeInterface
                    DescriĆ§Ć£o.: Metodo GET para incialiazaĆ§Ć£o da interface
                    ParĆ¢metros: 
                 */
                this.initializeInterface = function () {
                    fchmatcd1409.initializeInterface(function (result) {
                        controller.ttListParameters = result[0];
                        controller.mountDisclaimers(controller.ttListParameters);
                        controller.load();
                    });
                };

                /*  FunĆ§Ć£o....: simplifiedRequisitionProcessing
                    DescriĆ§Ć£o.: FunĆ§Ć£o chamada ao clicar no botĆ£o Atender
                    ParĆ¢metros: dataItem: objeto correspondente a linha do grid.
                */
                this.simplifiedRequisitionProcessing = function (dataItem) {    
                    controller.fchmatcd1409.simplifiedRequisitionProcessing({}, dataItem,
                        function (result) {    
                            if (!result.$hasError) {
                                controller.load(false);    
                            }    
                        });    
                };

                /*  FunĆ§Ć£o....: filterQtdToAttend
                    DescriĆ§Ć£o.: Filtro que retorna quantidade a atender m,aior que zero.
                                Cahamdo dentro da funĆ§Ć£o selectedRequisitionProcessing
                    ParĆ¢metros: data -> linha selecionada
                */
                this.filterQtdToAttend = function(data){
                    return data['qt-a-atender'] > 0;
                };
        
                /*  FunĆ§Ć£o....: selectedRequisitionProcessing
                    DescriĆ§Ć£o.: FunĆ§Ć£o chamada ao clicar no botĆ£o Atender Selecionados
                    ParĆ¢metros: 
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


                /*  FunĆ§Ć£o....: closeInventoryRequisition
                    DescriĆ§Ć£o.: FunĆ§Ć£o chamada ao clicar na opĆ§Ć£o Fechar RequisiĆ§Ć£o
                    ParĆ¢metros: nrRequis: nĆŗmero da requisiĆ§Ć£o
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
                

               /* FunĆ§Ć£o....: mountDisclaimers
                    DescriĆ§Ć£o.: monta diclaimers com base nos parametros defaults
                    ParĆ¢metros: 
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

                /* FunĆ§Ć£o....: getDataFactoryGroup
                   DescriĆ§Ć£o.: buscar configuracoes feitas no grid pelo usuario
                   ParĆ¢metros: 
                */
                this.getDataFactoryGroup = function(){
                    var option = controller.dataFactory.get("cd1409.group"); // busca agrupamento aramazenado no dataFactory                   
                    if (option){
                        controller.myGrid.dataSource.group(JSON.parse(option)); // atualiza configuraĆ§Ćµes grid
                        controller.dataFactory.delete('cd1409.group'); // apaga dataFactory
                    }
                };

                /* FunĆ§Ć£o....: deleteDataFactoryGroup
                   DescriĆ§Ć£o.: Eliminar configuracoes feitas no grid pelo usuario
                   ParĆ¢metros: 
                */
                this.deleteDataFactoryGroup = function(){
                    controller.dataFactory.delete("cd1409.group"); 
                };


                /* FunĆ§Ć£o....: init
                    DescriĆ§Ć£o.: responsĆ”vel por inicializar o controller principal
                    ParĆ¢metros: <nĆ£o hĆ”>                    
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


                /* FunĆ§Ć£o....: openAdvancedSearch
                    DescriĆ§Ć£o.: Abrir a modal de pesquisa avanĆ§Ć£da
                    ParĆ¢metros: <nĆ£o hĆ”>                    
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


                /* FunĆ§Ć£o....: openModalChooseBalance
                    DescriĆ§Ć£o.: Abrir a modal de atendimento por saldo
                    ParĆ¢metros: <nĆ£o hĆ”>                    
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
                    *    1 - Requisiā”Ćo de Estoque                
                    * docNumber: NĆŗmero do documento (requisiĆ§Ć£o)
                    * item: CĆ³digo do item
                    * seqItem: SequĆŖncia do item
                    * vendor: CĆ³digo do fornecedor
                    * seqQuote: SequĆŖncia da cotaĆ§Ć£o ou ordem de compra no caso de pedido
                */
                this.openModalFollowUp = function(doc, docNumber, item, seqItem, vendor, seqQuote){
                    var modalInstance = modalFollowup.open({doc: doc, docNumber: docNumber, item: item, seqItem: seqItem, vendor: vendor, seqQuote: seqQuote});
                };


                /*
                  FunĆ§Ć£o...: loadInfoCompItem
                  DescriĆ§Ć£o: responsĆ”vel por carregar as informaĆ§Ćµes complementares do item
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
                 FunĆ§Ć£o....: load
                 DescriĆ§Ć£o.: funĆ§Ć£o responsĆ”vel pelo carregamento do grid
                 ParĆ¢metros: isMore -> indica se deve ser feito a bisca de mais resultados              
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

                            //Cria atributo para que o cĆ³digo do item seja passado corretamente via URL
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
                            case 'SituaĆ§Ć£o:Atrasada':
                                controller.ttListParameters.atrasada = false;
                                break;
                            case 'SituaĆ§Ć£o:Pendente':
                                controller.ttListParameters.pendente = false;
                                break;
                            case 'SituaĆ§Ć£o:Fechada':
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
                    // ConfiguraĆ§Ć£o original do Grid
                    var confGroupDefault = controller.myGrid.dataSource.options.group[0].field;

                    // ConfiguraĆ§Ć£o alterada do Grid
                    var groupingChanged =  controller.myGrid.dataSource.group();
                    
                    if(groupingChanged.length == 1){
                        groupingChanged = groupingChanged[0].field;
                    }

                    //Somente salva a configuraĆ§Ćµes do grid em localStorage se for diferente da conf. default.
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
        # DESCRICAO.: Controle responsĆ”vel pela abertura da Modal de Pesquisa AvanĆ§ada
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
        # DESCRICAO.: Controle responsĆ”vel pela abertura da Modal para seleĆ§Ć£o de saldo para atendimento
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
        # DESCRICAO.: Controle responsĆ”vel pela abertura da Modal para seleĆ§Ć£o de saldo para atendimento
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
