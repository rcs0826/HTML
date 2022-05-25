define(['index', // index sempre deve ser injetado para permitir o registro dos controllers.
         // totvs-custom alem das tags de customização de tela, tambem comtêm os serviços de customização
        '/dts/mpd/js/api/fchdis0013api.js', // os controllers dependem dos serviços registrados.
        '/dts/mpd/js/zoom/motivocancelamento.js',
        '/dts/mpd/js/zoom/usuario.js',
        '/dts/mpd/js/zoom/grp_usuar.js',
       ], function(index) {

    paramPortalDetailController.$inject = ['$rootScope',
        '$scope',
        '$stateParams',
        '$state',
        'totvs.app-main-view.Service',
        'mpd.paramportal.Factory', 'TOTVSEvent'];
    function paramPortalDetailController($rootScope, $scope, $stateParams, $state, appViewService, paramPortalFactory, TOTVSEvent) {
        var controller = this;

        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************
        this.model = {}; // mantem o conteudo do registro em detalhamento
        // *********************************************************************************
        // *** Methods
        // *********************************************************************************

        // metodo de leitura do regstro
        this.load = function() {

            this.model = {}; // zera o model
            // chama o servico para retornar o registro

            paramPortalFactory.getRecordParam({}, function(result) {
                this.model = result;
                controller.dataparam = {};

                angular.forEach(this.model, function(value) {
                    switch (value['cod-param']) {
                        case 'portal-log-intgr-portal':
                            if (value['cod-val-param'] == 'no') {
                                controller.dataparam.portallogintgrportal = $rootScope.i18n('l-no');
                                controller.integracomworkflow = false;
                            } else {
                                controller.dataparam.portallogintgrportal = $rootScope.i18n('l-yes');
                                controller.integracomworkflow = true;
                            }
                            break;
                        /* case 'portal-repres-libera-completa':
                            if (value['cod-val-param'] == 'no') {
                                controller.dataparam.portalrepresliberacompleta = $rootScope.i18n('l-no');
                            } else {
                                controller.dataparam.portalrepresliberacompleta = $rootScope.i18n('l-yes')
                            }
                            break; */
                        case 'portal-cotacao-nivel-geral':
                            controller.dataparam.portalgeneralquotation = value['cod-val-param'] == 'no' ? $rootScope.i18n('l-no') : $rootScope.i18n('l-yes');
                            break;
                        case 'portal-codigo-motivo-cancelamento':
                            controller.dataparam.portalcodigomotivocancelamento = value['cod-val-param'];
                            break;
                        case 'portal-codigo-motivo-cancelamento-desc':
                            controller.dataparam.portalcodigomotivocancelamentodesc = value['cod-val-param'];
                            break;                            
                        case 'portal-val-min-pedido':
                            controller.dataparam.portalvalminpedido = value['cod-val-param'];
                            break;
                        case 'portal-usuario-aprovacao-ecm':
                            controller.dataparam.portalusuarioaprovacaoecm = value['cod-val-param'];
                            break;
                        case 'portal-gerenciador-aprovacao-ped-venda':
                            controller.dataparam.portalgerenciadoraprovacaopedvenda = value['cod-val-param'] == 'false'
                                ? $rootScope.i18n('l-no') 
                                : $rootScope.i18n('l-yes');
                            break;
                        case 'wfcpp-portal-usuario-aprovacao-ecm':
                            controller.dataparam.wfcppportalusuarioaprovacaoecm = value['cod-val-param'];
                            break;
                        case 'portal-pasta-arquivos-danfe-nfe':
                            controller.dataparam.portalpastaarquivosdanfenfe = value['cod-val-param'];
                            break;
                        case 'portal-pasta-arquivos-xml-nfe':
                            controller.dataparam.portalpastaarquivosxmlnfe = value['cod-val-param'];
                            break;
                        case 'servidor-pasta-arquivos-danfe-nfe':
                            controller.dataparam.servidorpastaarquivosdanfenfe = value['cod-val-param'];
                            break;
                        case 'servidor-pasta-arquivos-xml-nfe':
                            controller.dataparam.servidorpastaarquivosxmlnfe = value['cod-val-param'];
                            break;
                        case 'servidor-pasta-arquivos-imagem-item':
                            controller.dataparam.servidorpastaarquivosimagemitem = value['cod-val-param'];
                            break;
                        case 'portal-validade-senha':
                            controller.dataparam.portalvalidadesenha = value['cod-val-param'];
                            break;
                        case 'portal-tentativas-logon':
                            controller.dataparam.portaltentativaslogon = value['cod-val-param'];
                            break;
                        case 'portal-usuario-modelo':
                            controller.dataparam.portalusuariomodelo = value['cod-val-param'];
                            break;
                        case 'portal-usuario-modelo-desc':
                            controller.dataparam.portalusuariomodelodesc = value['cod-val-param'];
                            break;                            
                        case 'wf.apa-id-atividade-pedido-aceito':
                            controller.dataparam.wfapaidatividadepedidoaceito = value['cod-val-param'];
                            break;
                        case 'wf.apa-id-atividade-pedido-rejeitado':
                            controller.dataparam.wfapaidatividadepedidorejeitado = value['cod-val-param'];
                            break;
                        case 'wf.apa-id-atividade-aprovacao':
                            controller.dataparam.wfapaidatividadeaprovacao = value['cod-val-param'];
                            break;
                        case 'wfcpp-id-atividade-cancelar':
                            controller.dataparam.wfcppidatividadecancelar = value['cod-val-param'];
                            break;
                        case 'wfcpp-id-atividade-rejeitar':
                            controller.dataparam.wfcppidatividaderejeitar = value['cod-val-param'];
                            break;
                        case 'portal-modulo-manutencao-mla':
                            if (value['cod-val-param'] == 'no') {
                                controller.dataparam.portalmodulomanutencaomla = $rootScope.i18n('l-no');
                            } else {
                                controller.dataparam.portalmodulomanutencaomla = $rootScope.i18n('l-yes');
                            }
                            break;
                        case 'portal-modulo-manutencao-pedido':
                            if (value['cod-val-param'] == 'no') {
                                controller.dataparam.portalmodulomanutencaopedido = $rootScope.i18n('l-no');
                            } else {
                                controller.dataparam.portalmodulomanutencaopedido = $rootScope.i18n('l-yes');
                            }
                            break;
                        case 'portal-modulo-manutencao-crm':
                            if (value['cod-val-param'] == 'no') {
                                controller.dataparam.portalmodulomanutencaocrm = $rootScope.i18n('l-no');
                            } else {
                                controller.dataparam.portalmodulomanutencaocrm = $rootScope.i18n('l-yes');
                            }
                            break;
                        case 'portal-modulo-manutencao-grupo':
                            controller.dataparam.portalmodulomanutencaogrupo = value['cod-val-param'];
                            break;
                        case 'portal-app':
                            if (value['cod-val-param'] == 'no'){
                                controller.dataparam.portalapp = $rootScope.i18n('l-no');                                
                            } else {
                                controller.dataparam.portalapp = $rootScope.i18n('l-yes');
                            }
                            break;
                        case 'portal-app-serv-internet':
                            controller.dataparam.portalappservinternet = value['cod-val-param'];
                            break;    
                        /*case 'portal-app-serv-busca-produto':
                            controller.dataparam.portalappservbuscaproduto = value['cod-val-param'];
                            break;
                        case 'portal-app-serv-envio-orcamento':
                            controller.dataparam.portalappservenvioorcamento = value['cod-val-param'];
                            break; 
                        case 'portal-app-usuario-integr':
                            controller.dataparam.portalappusuariointegr = value['cod-val-param'];
                            break; */
                        case 'portal-app-img-empresa':
                            controller.dataparam.portalappimgempresa = value['cod-val-param'];
                            break;
                        /*case 'portal-app-id-mingle':
                            controller.dataparam.portalappidmingle = value['cod-val-param'];
                            break; */   
                        case 'portal-qtde-resultados-item':
                            controller.dataparam.portalqtderesultpesquisa = value['cod-val-param'];
                            break;  
                        case 'app-dias-validade-orcamento':
                            controller.dataparam.validadeorcamento = value['cod-val-param']; 
                            break;         
                        case 'portal-aplica-desconto-ao-incluir-item':
                            if (value['cod-val-param'] == 'no') {
                                controller.dataparam.portalAplicaDescontoAoIncluirItem = $rootScope.i18n('l-no');
                            } else {
                                controller.dataparam.portalAplicaDescontoAoIncluirItem = $rootScope.i18n('l-yes');
                            }
                            break;
						case 'portal-canal-vendas-repres':
                            if (value['cod-val-param'] == 'no') {
                                controller.dataparam.portalCanalVendasRepres = $rootScope.i18n('l-no');
                            } else {
                                controller.dataparam.portalCanalVendasRepres = $rootScope.i18n('l-yes');
                            }
                            break;
                    }
                });
                
                
                paramPortalFactory.getActivitiesWorkFlow({}, function (resultdatawfapp) {
                    var comboOrder = "0 - " + $rootScope.i18n('not-apply');
                    controller.combowfapp = resultdatawfapp;

                    if (controller.combowfapp) {
                        angular.forEach(controller.combowfapp, function (value) {
                            value['nome_atividade'] = value['id_atividade'] + ' - ' + value['nome_atividade'];
                        });

                        angular.forEach(this.model, function (value) {
                            switch (value['cod-param']) {
                                case 'wf.apa-id-atividade-pedido-aceito':
                                    controller.dataparam.wfapaidatividadepedidoaceito = controller.getActivityName(value['cod-val-param'], controller.combowfapp);
                                    break;
                                case 'wf.apa-id-atividade-pedido-rejeitado':
                                    controller.dataparam.wfapaidatividadepedidorejeitado = controller.getActivityName(value['cod-val-param'], controller.combowfapp);
                                    break;
                                case 'wf.apa-id-atividade-aprovacao':
                                    controller.dataparam.wfapaidatividadeaprovacao = controller.getActivityName(value['cod-val-param'], controller.combowfapp);
                                    break;
                            }
                        });
                    } else {
                        angular.forEach(this.model, function (value) {
                            switch (value['cod-param']) {
                                case 'wf.apa-id-atividade-pedido-aceito':
                                    controller.dataparam.wfapaidatividadepedidoaceito = comboOrder;
                                    break;
                                case 'wf.apa-id-atividade-pedido-rejeitado':
                                    controller.dataparam.wfapaidatividadepedidorejeitado = comboOrder;
                                    break;
                                case 'wf.apa-id-atividade-aprovacao':
                                    controller.dataparam.wfapaidatividadeaprovacao = comboOrder;
                                    break;
                            }
                        });
                    }
                });

                paramPortalFactory.getActivitiesWorkFlowCancelPed({}, function (resultdatawfcpp) {
                    var comboCancel = "0 - " + $rootScope.i18n('not-apply');
                    controller.combowfcpp = resultdatawfcpp;

                    if (controller.combowfcpp) {
                        angular.forEach(controller.combowfcpp, function (value) {
                            value['nome_atividade'] = value['id_atividade'] + ' - ' + value['nome_atividade'];
                        });

                        angular.forEach(this.model, function (value) {
                            switch (value['cod-param']) {
                                case 'wfcpp-id-atividade-cancelar':
                                    controller.dataparam.wfcppidatividadecancelar = controller.getActivityName(value['cod-val-param'], controller.combowfcpp);
                                    break;
                                case 'wfcpp-id-atividade-rejeitar':
                                    controller.dataparam.wfcppidatividaderejeitar = controller.getActivityName(value['cod-val-param'], controller.combowfcpp);
                                    break;
                            }
                        });
                    } else {
                        angular.forEach(this.model, function (value) {
                            switch (value['cod-param']) {
                                case 'wfcpp-id-atividade-cancelar':
                                    controller.dataparam.wfcppidatividadecancelar = comboCancel;
                                    break;
                                case 'wfcpp-id-atividade-rejeitar':
                                    controller.dataparam.wfcppidatividaderejeitar = comboCancel;
                                    break;
                            }
                        });
                    }
                });

            });
        }

        controller.getActivityName = function(id, data) {
            var labelactivity = '';
            angular.forEach(data, function(value) {
                if (id == value['id_atividade']) {
                    labelactivity = value['nome_atividade'];
                }
            });
            
            if(labelactivity == ""){
                labelactivity = id;
            }
            
            return labelactivity
        }

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        this.init = function() {
            if (appViewService.startView($rootScope.i18n('l-sales-param-portal'), 'mpd.param-portal-detail.Control', controller)) {             
                // se é a abertura da tab, implementar aqui inicialização do controller
            }
            this.load();
        }

        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) {
            this.init();
        }
        // *********************************************************************************
        // *** Events Listeners
        // *********************************************************************************
        // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function() {
            controller.init();
        });

    }

    paramPortalEditController.$inject = ['$rootScope',
        '$scope',
        '$stateParams',
        '$window',
        '$location',
        '$state',
        'totvs.app-main-view.Service',
        'mpd.paramportal.Factory',
        '$element',
        'TOTVSEvent'];
    function paramPortalEditController($rootScope, $scope, $stateParams, $window, $location, $state, appViewService, paramPortalFactory, $element, TOTVSEvent) {

        var controller = this;
        controller.isChangePropQuotation = false;
		controller.isChangePropSalesChannel = false;

        this.getUrlEncode = function(value) {
            return window.encodeURIComponent(value);
        };

        this.reloadWFAPP = function() {

            if(!controller.dataparam.portallogintgrportal){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'alert',
                    title: $rootScope.i18n('l-atividades-workflow'),
                    detail: $rootScope.i18n('l-atividades-workflow-msg') 
                });
            }else{            
                paramPortalFactory.checkRequests({}, function(dataCheckRequests) {                    
                    if(dataCheckRequests['l-retorno'] == false){
                        paramPortalFactory.getActivitiesWorkFlow({}, function(resultdatawfapp) {
                            controller.combowfapp = resultdatawfapp;
                            angular.forEach(controller.combowfapp, function(value) {
                                value['nome_atividade'] = value['id_atividade'] + ' - ' + value['nome_atividade'];
                            });
                        });
                    }
                }); 
            }
        }

        this.reloadWFCPP = function() {
            if(!controller.dataparam.portallogintgrportal){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'alert',
                    title: $rootScope.i18n('l-atividades-workflow'),
                    detail: $rootScope.i18n('l-atividades-workflow-msg') 
                });
            }else{            
                paramPortalFactory.checkRequests({}, function(dataCheckRequests) {                    
                    if(dataCheckRequests['l-retorno'] == false){            
                        paramPortalFactory.getActivitiesWorkFlowCancelPed({}, function(resultdatawfcpp) {
                            controller.combowfcpp = resultdatawfcpp;
                            angular.forEach(controller.combowfcpp, function(value) {
                                value['nome_atividade'] = value['id_atividade'] + ' - ' + value['nome_atividade'];
                            });
                        });
                    }
                });
            }
        }

        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************
        this.model = {}; // mantem o conteudo do registro em edição/inclusã
        // atributo auxiliar para determinar se é uma edição, desabilitando o campo chave
        this.codProdutoDisabled = $state.is('dts/mpd/paramportal.edit');
        //atributos para habilitar/desabilitar os campos em tela
        var valuesWfAprove = {};
        var valuesWfCancel = {};

        // *********************************************************************************
        // *** Methods
        // *********************************************************************************

        // metodo de leitura do regstro
        this.load = function() {
            this.model = {};

            paramPortalFactory.getRecordParam({}, function(result) {
                this.model = result;
                controller.dataparam = {};
                                
                angular.forEach(this.model, function(value) {
                    switch (value['cod-param']) {
                        case 'portal-log-intgr-portal':
                            if (value['cod-val-param'] == 'no') {
                                controller.dataparam.portallogintgrportal = false;
                            } else {
                                controller.dataparam.portallogintgrportal = true
                            }
                            break;
                        /* case 'portal-repres-libera-completa':
                            if (value['cod-val-param'] == 'no') {
                                controller.dataparam.portalrepresliberacompleta = false
                            } else {
                                controller.dataparam.portalrepresliberacompleta = true
                            }
                            break; */
                        case 'portal-codigo-motivo-cancelamento':
                            controller.dataparam.portalcodigomotivocancelamento = value['cod-val-param'];
                            break;
                        case 'portal-val-min-pedido':
                            controller.dataparam.portalvalminpedido = value['cod-val-param'].replace(',', '.');
                            break;
                        case 'portal-usuario-aprovacao-ecm':
                            controller.dataparam.portalusuarioaprovacaoecm = value['cod-val-param'];
                            break;
                        case 'portal-gerenciador-aprovacao-ped-venda':
                            controller.dataparam.portalgerenciadoraprovacaopedvenda = value['cod-val-param'] == 'false' ? false : true;
                            break;
                        case 'wfcpp-portal-usuario-aprovacao-ecm':
                            controller.dataparam.wfcppportalusuarioaprovacaoecm = value['cod-val-param'];
                            break;
                        case 'portal-pasta-arquivos-danfe-nfe':
                            controller.dataparam.portalpastaarquivosdanfenfe = value['cod-val-param'];
                            break;
                        case 'portal-pasta-arquivos-xml-nfe':
                            controller.dataparam.portalpastaarquivosxmlnfe = value['cod-val-param'];
                            break;
                        case 'servidor-pasta-arquivos-danfe-nfe':
                            controller.dataparam.servidorpastaarquivosdanfenfe = value['cod-val-param'];
                            break;
                        case 'servidor-pasta-arquivos-xml-nfe':
                            controller.dataparam.servidorpastaarquivosxmlnfe = value['cod-val-param'];
                            break;
                        case 'servidor-pasta-arquivos-imagem-item':
                            controller.dataparam.servidorpastaarquivosimagemitem = value['cod-val-param'];
                            break;
                        case 'portal-validade-senha':
                            controller.dataparam.portalvalidadesenha = parseInt(value['cod-val-param']);
                            break;
                        case 'portal-tentativas-logon':
                            controller.dataparam.portaltentativaslogon = parseInt(value['cod-val-param']);
                            break;
                        case 'portal-usuario-modelo':
                            controller.dataparam.portalusuariomodelo = value['cod-val-param'];
                            break;
                        case 'portal-modulo-manutencao-mla':
                            if (value['cod-val-param'] == 'no') {
                                controller.dataparam.portalmodulomanutencaomla = false;
                            } else {
                                controller.dataparam.portalmodulomanutencaomla = true
                            }
                            break;
                        case 'portal-modulo-manutencao-pedido':
                            if (value['cod-val-param'] == 'no') {
                                controller.dataparam.portalmodulomanutencaopedido = false;
                            } else {
                                controller.dataparam.portalmodulomanutencaopedido = true
                            }
                            break;
                        case 'portal-modulo-manutencao-crm':
                            if (value['cod-val-param'] == 'no') {
                                controller.dataparam.portalmodulomanutencaocrm = false;
                            } else {
                                controller.dataparam.portalmodulomanutencaocrm = true
                            }
                            break;
                        case 'portal-modulo-manutencao-grupo':
                            controller.dataparam.portalmodulomanutencaogrupo = value['cod-val-param'];
                            break;
                        case 'portal-app':
                            if (value['cod-val-param'] == 'no'){
                                controller.dataparam.portalapp = false;                                
                            } else {
                                controller.dataparam.portalapp = true;
                            }
                            break;
                        case 'portal-app-serv-internet':
                            controller.dataparam.portalappservinternet = value['cod-val-param'];
                            break;    
                        case 'portal-app-img-empresa':
                            controller.dataparam.portalappimgempresa = value['cod-val-param'];
                            break;
                        case 'portal-qtde-resultados-item':
                            controller.dataparam.portalqtderesultpesquisa = parseInt(value['cod-val-param']);
                            break; 
                        case 'app-dias-validade-orcamento':
                            controller.dataparam.validadeorcamento = parseInt(value['cod-val-param']);
                            break;
                        case 'portal-cotacao-nivel-geral':
                            controller.dataparam.portalgeneralquotation = value['cod-val-param'] == 'no' ? false : true;
                            break;
                        case 'habilita-portal-cotacao-nivel-geral':
                            controller.dataparam.habilitaportalgeneralquotation = value['cod-val-param'] == 'no' ? false : true;
                            break;
                        case 'portal-aplica-desconto-ao-incluir-item':
                            if (value['cod-val-param'] == 'no') {
                                controller.dataparam.portalAplicaDescontoAoIncluirItem = false;
                            } else {
                                controller.dataparam.portalAplicaDescontoAoIncluirItem = true
                            }
                            break;
						case 'portal-canal-vendas-repres':
                            if (value['cod-val-param'] == 'no') {
                                controller.dataparam.portalCanalVendasRepres = false;
                            } else {
                                controller.dataparam.portalCanalVendasRepres = true
                            }
                            break;
                    }
                });

                paramPortalFactory.getActivitiesWorkFlow({}, function (resultdatawfapp) {
                    var comboOrder = { 'id_atividade': '0', 'nome_atividade': "0 - " + $rootScope.i18n('not-apply')};
                    controller.combowfapp = resultdatawfapp;

                    if (controller.combowfapp) {
                        angular.forEach(controller.combowfapp, function (value) {
                            value['nome_atividade'] = value['id_atividade'] + ' - ' + value['nome_atividade'];
                        });

                        angular.forEach(this.model, function (value) {
                            switch (value['cod-param']) {
                                case 'wf.apa-id-atividade-pedido-aceito':
                                    controller.dataparam.wfapaidatividadepedidoaceito = controller.getObjectSelectedCombo(value['cod-val-param'], controller.combowfapp);
                                    break;
                                case 'wf.apa-id-atividade-pedido-rejeitado':
                                    controller.dataparam.wfapaidatividadepedidorejeitado = controller.getObjectSelectedCombo(value['cod-val-param'], controller.combowfapp);
                                    break;
                                case 'wf.apa-id-atividade-aprovacao':
                                    controller.dataparam.wfapaidatividadeaprovacao = controller.getObjectSelectedCombo(value['cod-val-param'], controller.combowfapp);
                                    break;
                            }
                        });
                        valuesWfAprove = {
                            wfapaidatividadepedidoaceito: controller.dataparam.wfapaidatividadepedidoaceito,
                            wfapaidatividadepedidorejeitado: controller.dataparam.wfapaidatividadepedidorejeitado,
                            wfapaidatividadeaprovacao: controller.dataparam.wfapaidatividadeaprovacao
                        };
                    } else {
                        angular.forEach(this.model, function (value) {
                            switch (value['cod-param']) {
                                case 'wf.apa-id-atividade-pedido-aceito':
                                    controller.dataparam.wfapaidatividadepedidoaceito = comboOrder;
                                    break;
                                case 'wf.apa-id-atividade-pedido-rejeitado':
                                    controller.dataparam.wfapaidatividadepedidorejeitado = comboOrder;
                                    break;
                                case 'wf.apa-id-atividade-aprovacao':
                                    controller.dataparam.wfapaidatividadeaprovacao = comboOrder;
                                    break;
                            }
                        });
                    }
                });

                paramPortalFactory.getActivitiesWorkFlowCancelPed({}, function (resultdatawfcpp) {
                    var comboCancel = { 'id_atividade': '0', 'nome_atividade': "0 - " + $rootScope.i18n('not-apply') };
                    controller.combowfcpp = resultdatawfcpp;

                    if (controller.combowfcpp) {
                        angular.forEach(controller.combowfcpp, function (value) {
                            value['nome_atividade'] = value['id_atividade'] + ' - ' + value['nome_atividade'];
                        });

                        angular.forEach(this.model, function (value) {
                            switch (value['cod-param']) {
                                case 'wfcpp-id-atividade-cancelar':
                                    controller.dataparam.wfcppidatividadecancelar = controller.getObjectSelectedCombo(value['cod-val-param'], controller.combowfcpp);
                                    break;
                                case 'wfcpp-id-atividade-rejeitar':
                                    controller.dataparam.wfcppidatividaderejeitar = controller.getObjectSelectedCombo(value['cod-val-param'], controller.combowfcpp);
                                    break;
                            }
                        });
                        valuesWfCancel = {
                            wfcppidatividadecancelar: controller.dataparam.wfcppidatividadecancelar,
                            wfcppidatividaderejeitar: controller.dataparam.wfcppidatividaderejeitar
                        };
                    } else {
                        angular.forEach(this.model, function (value) {
                            switch (value['cod-param']) {
                                case 'wfcpp-id-atividade-cancelar':
                                    controller.dataparam.wfcppidatividadecancelar = comboCancel;
                                    break;
                                case 'wfcpp-id-atividade-rejeitar':
                                    controller.dataparam.wfcppidatividaderejeitar = comboCancel;
                                    break;
                            }
                        });
                    }
                });
            })
        }

        controller.getObjectSelectedCombo = function(id, data) {
            var objectselected = {};
            angular.forEach(data, function(value) {
                if (id == value['id_atividade']) {
                    objectselected = value;
                }
            });
            return objectselected;
        }
		
		// Método responsável por tratar a respesta da pergunta caso o campo "Habilitar Cotação em Nível Geral"
        // seja clicado.
        this.confirmEnablemQuotationQuestion = function(isPositiveResult) {
			if (isPositiveResult) { // se foi clicado o botão confirmar			
                var paramObj = {"cod-param": "", "cod-val-param": ""};
                paramObj['cod-param'] = 'portal-cotacao-nivel-geral';
                paramObj['cod-val-param'] = controller.dataparam.portalgeneralquotation;

                paramPortalFactory.enableQuotatioGeneralLevel({}, paramObj, function(result) {
                    console.log('RESULTADO: ', result);
                })

            }
			controller.onSave();
            controller.isChangePropQuotation = false;
        }
		
		// Método responsável por tratar a respesta da pergunta caso o campo "Configura Canal de Venda para o Representante"
        // seja clicado.
        this.confirmEnablemSalesChannelQuestion = function(isPositiveResult) {
			if (isPositiveResult) { // se foi clicado o botão confirmar			
                var paramObj = {"cod-param": "", "cod-val-param": ""};
                paramObj['cod-param'] = 'portal-canal-vendas-repres';
                paramObj['cod-val-param'] = controller.dataparam.portalCanalVendasRepres;

                paramPortalFactory.enableSalesChannelGeneralLevel({}, paramObj, function(result) {
                    console.log('RESULTADO: ', result);
                })

            }
			controller.onSave();
            controller.isChangePropSalesChannel = false;
        }

        // Método que verifica se a opção "Habilitar Cotação em Nível Geral" foi habilitada.
        this.save = function() {
			
			// verificar se o formulario tem dados invalidos
            if (this.isInvalidForm()) {
				return;
            }
			
			paramPortalFactory.checkRequests({}, function (dataCheckRequests) {
				if (controller.wfHasChange() && dataCheckRequests['l-retorno'] == true) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error',
                        title: $rootScope.i18n('l-attention'),
                        detail: $rootScope.i18n('l-valid-wf-fields')
                    });
                    return;
                }
				
				if (controller.isChangePropQuotation) {
					$rootScope.$broadcast(TOTVSEvent.showQuestion, {
                        title: 'l-question', // titulo da mensagem
                        text: controller.dataparam.portalgeneralquotation ? $rootScope.i18n('l-confirm-enable-general-quotation') : $rootScope.i18n('l-confirm-disable-general-quotation'),
                        cancelLabel: 'l-no', // label do botão cancelar
                        confirmLabel: 'l-yes', // label do botão confirmar
                        callback: function(isPositiveResult) {
							controller.confirmEnablemQuotationQuestion(isPositiveResult)
						}
                    });
                } else if (controller.isChangePropSalesChannel) {
					$rootScope.$broadcast(TOTVSEvent.showQuestion, {
                        title: 'l-question', // titulo da mensagem
                        text: controller.dataparam.portalCanalVendasRepres ? $rootScope.i18n('l-confirm-enable-general-sales-channel-repres') : $rootScope.i18n('l-confirm-disable-general-sales-channel-repres'),
                        cancelLabel: 'l-no', // label do botão cancelar
                        confirmLabel: 'l-yes', // label do botão confirmar
                        callback: function(isPositiveResult) {
							controller.confirmEnablemSalesChannelQuestion(isPositiveResult)
						}
                    });
                } else {
					controller.onSave();
                }
            });
        
        }

        // Método com as regras de negócio para salvar os dados do parâmetros.
        this.onSave = function() {

		    var atividadeDefault = {id_atividade: 0, nome_atividade: "0 - " + $rootScope.i18n('not-apply')};

            // se for a tela de edição, faz o update
            if ($state.is('dts/mpd/paramportal.edit')) {
                controller.paramToSave = [];
                this.addParamObj('portal-log-intgr-portal', controller.dataparam.portallogintgrportal);
                //this.addParamObj('portal-repres-libera-completa', controller.dataparam.portalrepresliberacompleta);
                this.addParamObj('portal-codigo-motivo-cancelamento', controller.dataparam.portalcodigomotivocancelamento);
                this.addParamObj('portal-val-min-pedido', controller.dataparam.portalvalminpedido);


				if(!controller.dataparam.wfapaidatividadepedidoaceito.hasOwnProperty('id_atividade') ||
				   controller.dataparam.wfapaidatividadepedidorejeitado == undefined){
					controller.dataparam.wfapaidatividadepedidoaceito = atividadeDefault;
				}


				if(!controller.dataparam.wfapaidatividadepedidorejeitado.hasOwnProperty('id_atividade') ||
				   controller.dataparam.wfapaidatividadepedidorejeitado == undefined){
					controller.dataparam.wfapaidatividadepedidorejeitado = atividadeDefault;
				}

				if(!controller.dataparam.wfapaidatividadeaprovacao.hasOwnProperty('id_atividade') ||
				   controller.dataparam.wfapaidatividadeaprovacao == undefined){
					controller.dataparam.wfapaidatividadeaprovacao = atividadeDefault;
				}

				if(!controller.dataparam.wfcppidatividadecancelar.hasOwnProperty('id_atividade') ||
				   controller.dataparam.wfcppidatividadecancelar == undefined){
					controller.dataparam.wfcppidatividadecancelar = atividadeDefault;
				}

				if(!controller.dataparam.wfcppidatividaderejeitar.hasOwnProperty('id_atividade') ||
				   controller.dataparam.wfcppidatividaderejeitar == undefined){
					controller.dataparam.wfcppidatividaderejeitar = atividadeDefault;
				}
                if(controller.combowfapp){
                    if(controller.combowfapp.length > 0){
                        this.addParamObj('wf.apa-id-atividade-pedido-aceito', controller.dataparam.wfapaidatividadepedidoaceito);
                        this.addParamObj('wf.apa-id-atividade-pedido-rejeitado', controller.dataparam.wfapaidatividadepedidorejeitado);
                        this.addParamObj('wf.apa-id-atividade-aprovacao', controller.dataparam.wfapaidatividadeaprovacao);
                    }
                }
                this.addParamObj('portal-usuario-aprovacao-ecm', controller.dataparam.portalusuarioaprovacaoecm);
                this.addParamObj('portal-gerenciador-aprovacao-ped-venda', controller.dataparam.portalgerenciadoraprovacaopedvenda);
                if(controller.combowfcpp){
                    if(controller.combowfcpp.length > 0){
                        this.addParamObj('wfcpp-id-atividade-cancelar', controller.dataparam.wfcppidatividadecancelar);
                        this.addParamObj('wfcpp-id-atividade-rejeitar', controller.dataparam.wfcppidatividaderejeitar);
                    }
                }
                this.addParamObj('wfcpp-portal-usuario-aprovacao-ecm', controller.dataparam.wfcppportalusuarioaprovacaoecm);
                this.addParamObj('portal-pasta-arquivos-danfe-nfe', controller.dataparam.portalpastaarquivosdanfenfe);
                this.addParamObj('portal-pasta-arquivos-xml-nfe', controller.dataparam.portalpastaarquivosxmlnfe);
                this.addParamObj('servidor-pasta-arquivos-danfe-nfe', controller.dataparam.servidorpastaarquivosdanfenfe);
                this.addParamObj('servidor-pasta-arquivos-xml-nfe', controller.dataparam.servidorpastaarquivosxmlnfe);
                this.addParamObj('servidor-pasta-arquivos-imagem-item', controller.dataparam.servidorpastaarquivosimagemitem);
                this.addParamObj('portal-validade-senha', controller.dataparam.portalvalidadesenha);
                this.addParamObj('portal-tentativas-logon', controller.dataparam.portaltentativaslogon);
                this.addParamObj('portal-usuario-modelo', controller.dataparam.portalusuariomodelo);

                this.addParamObj('portal-modulo-manutencao-mla', controller.dataparam.portalmodulomanutencaomla);
                this.addParamObj('portal-modulo-manutencao-pedido', controller.dataparam.portalmodulomanutencaopedido);
                this.addParamObj('portal-modulo-manutencao-crm', controller.dataparam.portalmodulomanutencaocrm);
                this.addParamObj('portal-modulo-manutencao-grupo', controller.dataparam.portalmodulomanutencaogrupo);
                this.addParamObj('portal-app', controller.dataparam.portalapp);
                 this.addParamObj('portal-app-serv-internet', controller.dataparam.portalappservinternet);
                /*this.addParamObj('portal-app-serv-busca-produto', controller.dataparam.portalappservbuscaproduto);
                this.addParamObj('portal-app-serv-envio-orcamento', controller.dataparam.portalappservenvioorcamento); 
                this.addParamObj('portal-app-usuario-integr', controller.dataparam.portalappusuariointegr); */
                this.addParamObj('portal-app-img-empresa', controller.dataparam.portalappimgempresa);
                /*this.addParamObj('portal-app-id-mingle', controller.dataparam.portalappidmingle);*/
                this.addParamObj('app-dias-validade-orcamento', controller.dataparam.validadeorcamento);


                this.addParamObj('portal-qtde-resultados-item', controller.dataparam.portalqtderesultpesquisa);
                
                this.addParamObj('portal-cotacao-nivel-geral', controller.dataparam.portalgeneralquotation);

                this.addParamObj('portal-aplica-desconto-ao-incluir-item', controller.dataparam.portalAplicaDescontoAoIncluirItem);
				
				this.addParamObj('portal-canal-vendas-repres', controller.dataparam.portalCanalVendasRepres);

                paramPortalFactory.saveRecordParam({}, controller.paramToSave, function(result) {
                    if (!result.$hasError) {
                        controller.onSaveUpdate(true, result);
                    }
                });
            }
        }

        /*
         * Adiciona os paramêtros em um objeto e trata os valores para o progress
         */
        this.addParamObj = function(codparam, value) {
            var paramObj = {"cod-param": "", "cod-val-param": ""};
            paramObj['cod-param'] = codparam;
            switch (codparam) {
                case 'portal-log-intgr-portal':
                    if (value == true) {
                        paramObj['cod-val-param'] = 'yes';
                    } else {
                        paramObj['cod-val-param'] = 'no';
                    }
                    break;
                case 'portal-repres-libera-completa':
                    if (value == true) {
                        paramObj['cod-val-param'] = 'yes';
                    } else {
                        paramObj['cod-val-param'] = 'no';
                    }
                    break;
                case 'wf.apa-id-atividade-pedido-aceito':
                    paramObj['cod-val-param'] = value.id_atividade;  // controller.getObjectSelectedCombo(value['cod-val-param'], controller.combowfapp);
                    break;
                case 'wf.apa-id-atividade-pedido-rejeitado':
                    paramObj['cod-val-param'] = value.id_atividade;  //controller.getObjectSelectedCombo(value['cod-val-param'], controller.combowfapp);
                    break;
                case 'wf.apa-id-atividade-aprovacao':
                    paramObj['cod-val-param'] = value.id_atividade;  //controller.getObjectSelectedCombo(value['cod-val-param'], controller.combowfapp);
                    break;
                case 'wfcpp-id-atividade-cancelar':
                    paramObj['cod-val-param'] = value.id_atividade;  //controller.getObjectSelectedCombo(value['cod-val-param'], controller.combowfcpp);
                    break;
                case 'wfcpp-id-atividade-rejeitar':
                    paramObj['cod-val-param'] = value.id_atividade;  //controller.getObjectSelectedCombo(value['cod-val-param'], controller.combowfcpp);
                    break;
                default:
                    paramObj['cod-val-param'] = value;
            }
            controller.paramToSave.push(paramObj);
        };

        // metodo para notificar o usuario da gravaçao do registro com sucesso
        this.onSaveUpdate = function(isUpdate, result) {
            // redireciona a tela para a tela de detalhar
            controller.redirectToDetail();

            // notifica o usuario que conseguiu salvar o registro
            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type: 'success',
                title: $rootScope.i18n('l-sales-param-portal'),
                detail: $rootScope.i18n('l-sales-param-portal') + ', ' +
                        (isUpdate ? $rootScope.i18n('l-success-updated') : $rootScope.i18n('l-success-created')) + '!'
            });
        }

        // metodo para a ação de cancelar
        this.cancel = function() {
            // solicita que o usuario confirme o cancelamento da edição/inclusão
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question',
                text: $rootScope.i18n('l-cancel-operation'),
                cancelLabel: 'l-no',
                confirmLabel: 'l-yes',
                callback: function(isPositiveResult) {
                    if (isPositiveResult) { // se confirmou, navega para a pagina anterior
                        $window.history.back();
                    }
                }
            });
        }

        // metodo para verificar se o formulario é invalido
        this.isInvalidForm = function() {
            var messages = [];
            var isInvalidForm = false;

            // verifica se o item esta vazio
            if ((controller.dataparam.portalcodigomotivocancelamento == undefined) || (controller.dataparam.portalcodigomotivocancelamento == '')) {
                isInvalidForm = true;
                messages.push('l-motivo-cancelamento-portal');
            }

            if ((controller.dataparam.portalvalminpedido == undefined) || (controller.dataparam.portalvalminpedido == '')) {
                isInvalidForm = true;
                messages.push('l-valor-minimo-pedido-portal');
            }

            if ((controller.dataparam.wfapaidatividadepedidoaceito == undefined) || (controller.dataparam.wfapaidatividadepedidoaceito == '')) {
                isInvalidForm = true;
                messages.push('l-wfapp-aceito');
            }

            if ((controller.dataparam.wfapaidatividadepedidorejeitado == undefined) || (controller.dataparam.wfapaidatividadepedidorejeitado == '')) {
                isInvalidForm = true;
                messages.push('l-wfapp-rejeitado');
            }

            if ((controller.dataparam.wfapaidatividadeaprovacao == undefined) || (controller.dataparam.wfapaidatividadeaprovacao == '')) {
                isInvalidForm = true;
                messages.push('l-wfapp-aprovacao');
            }

            if ((controller.dataparam.portalusuarioaprovacaoecm == undefined) || (controller.dataparam.portalusuarioaprovacaoecm == '')) {
                isInvalidForm = true;
                messages.push('l-wfapp-responsavel-aprovacao');
            }

            /*
			if ((controller.dataparam.wfcppidatividadecancelar == undefined) || (controller.dataparam.wfcppidatividadecancelar == '')) {
                isInvalidForm = true;
                messages.push('l-wfcpp-cancelar');
            }
			
			if ((controller.dataparam.wfcppidatividaderejeitar == undefined) || (controller.dataparam.wfcppidatividaderejeitar == '')) {
                isInvalidForm = true;
                messages.push('l-wfcpp-reprovar-cancelamento');
            }
			
            if ((controller.dataparam.wfcppportalusuarioaprovacaoecm == undefined) || (controller.dataparam.wfcppportalusuarioaprovacaoecm == '')) {
                isInvalidForm = true;
                messages.push('l-wfcpp-responsavel-aprovacao');
            }
			*/

            if ((controller.dataparam.portalpastaarquivosdanfenfe == undefined) || (controller.dataparam.portalpastaarquivosdanfenfe == '')) {
                isInvalidForm = true;
                messages.push('l-diretorio-arquivos-danfe');
            }

            if ((controller.dataparam.portalpastaarquivosxmlnfe == undefined) || (controller.dataparam.portalpastaarquivosxmlnfe == '')) {
                isInvalidForm = true;
                messages.push('l-diretorio-arquivos-xml-nfe');
            }

            if ((controller.dataparam.servidorpastaarquivosdanfenfe == undefined) || (controller.dataparam.servidorpastaarquivosdanfenfe == '')) {
                isInvalidForm = true;
                messages.push('l-diretorio-arquivos-danfe-servidor-portal');
            }

            if ((controller.dataparam.servidorpastaarquivosxmlnfe == undefined) || (controller.dataparam.servidorpastaarquivosxmlnfe == '')) {
                isInvalidForm = true;
                messages.push('l-diretorio-arquivos-xml-servidor-portal');
            }

            /*
			if ((controller.dataparam.servidorpastaarquivosimagemitem == undefined) || (controller.dataparam.servidorpastaarquivosimagemitem == '')) {
                isInvalidForm = true;
                messages.push('l-diretorio-arquivos-imagens-servidor-portal');
            }
			*/

            if ((controller.dataparam.portalvalidadesenha == undefined) || (controller.dataparam.portalvalidadesenha == '') || (controller.dataparam.portaltentativaslogon > 365)) {
                isInvalidForm = true;
                messages.push('l-periodo-validade-senha');
            }

            if ((controller.dataparam.portalqtderesultpesquisa == undefined) || (controller.dataparam.portalqtderesultpesquisa == '') || (controller.dataparam.portalqtderesultpesquisa > 200)) {
                isInvalidForm = true;
                messages.push('l-search-result-number');
            }
            if ((controller.dataparam.portaltentativaslogon == undefined) || (controller.dataparam.portaltentativaslogon == '') || (controller.dataparam.portaltentativaslogon > 10)) {
                isInvalidForm = true;
                messages.push('l-tentativas-logon-incorreto');
            }

            if ((controller.dataparam.portalusuariomodelo == undefined) || (controller.dataparam.portalusuariomodelo == '')) {
                isInvalidForm = true;
                messages.push('l-usuario-modelo');
            }

            if (controller.dataparam.portalapp == true){

                if ((controller.dataparam.portalappservinternet == undefined) || (controller.dataparam.portalappservinternet == '')) {
                    isInvalidForm = true;
                    messages.push('l-serv-internet');
                }
                
                /*
                if ((controller.dataparam.portalappservbuscaproduto == undefined) || (controller.dataparam.portalappservbuscaproduto == '')) {
                    isInvalidForm = true;
                    messages.push('l-serv-busca-produto');
                }

                if ((controller.dataparam.portalappservenvioorcamento == undefined) || (controller.dataparam.portalappservenvioorcamento == '')) {
                    isInvalidForm = true;
                    messages.push('l-serv-envio-orcamento');
                }
                

                if ((controller.dataparam.portalappusuariointegr == undefined) || (controller.dataparam.portalappusuariointegr == '')) {
                    isInvalidForm = true;
                    messages.push('l-usuario-integr');
                } */

                if ((controller.dataparam.portalappimgempresa == undefined) || (controller.dataparam.portalappimgempresa == '')) {
                    isInvalidForm = true;
                    messages.push('l-img-empresa');
                }

                /*
                if ((controller.dataparam.portalappidmingle == undefined) || (controller.dataparam.portalappidmingle == '')) {
                    isInvalidForm = true;
                    messages.push('l-id-mingle');
                }
                */

                if ((controller.dataparam.validadeorcamento == undefined) || (controller.dataparam.validadeorcamento == '') || (controller.dataparam.validadeorcamento > 9999)) {
                    isInvalidForm = true;
                    messages.push('l-validade-orcamentos');
                }


            }
            
            // se for invalido, monta e mostra a mensagem
            if (isInvalidForm) {
                var warning = '';
                angular.forEach(messages, function(item) {
                    warning = warning + ' ' + $rootScope.i18n(item) + ',';
                });

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-attention'),
                    detail: warning + $rootScope.i18n('l-validacao-campos')
                });
            }
            return isInvalidForm;
        }

        // redireciona para a tela de detalhar
        this.redirectToDetail = function() {
            $location.path('dts/mpd/paramportal');
        }

        this.wfHasChange = function () {
            if (valuesWfAprove) {
                if (valuesWfAprove.wfapaidatividadepedidoaceito &&
                    valuesWfAprove.wfapaidatividadepedidoaceito.id_atividade != controller.dataparam.wfapaidatividadepedidoaceito.id_atividade)
                    return true;

                if (valuesWfAprove.wfapaidatividadepedidorejeitado &&
                    valuesWfAprove.wfapaidatividadepedidorejeitado.id_atividade != controller.dataparam.wfapaidatividadepedidorejeitado.id_atividade)
                    return true;

                if (valuesWfAprove.wfapaidatividadeaprovacao &&
                    valuesWfAprove.wfapaidatividadeaprovacao.id_atividade != controller.dataparam.wfapaidatividadeaprovacao.id_atividade)
                    return true;
            }

            if (valuesWfCancel) {
                if (valuesWfCancel.wfcppidatividadecancelar &&
                    valuesWfCancel.wfcppidatividadecancelar.id_atividade != controller.dataparam.wfcppidatividadecancelar.id_atividade)
                    return true;

                if (valuesWfCancel.wfcppidatividaderejeitar &&
                    valuesWfCancel.wfcppidatividaderejeitar.id_atividade != controller.dataparam.wfcppidatividaderejeitar.id_atividade)
                    return true;
            }

            return false;
        }

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        this.init = function() {
            if (appViewService.startView($rootScope.i18n('l-sales-param-portal'), 'mpd.param-portal-edit.Control', controller)) {
                // se é a abertura da tab, implementar aqui inicialização do controller            
            }
            this.load();
        }

        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) {
            this.init();
        }
        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************

        // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function() {
            controller.init();
        });
    }
    ;

        // registrar os controllers no angular
        index.register.controller('mpd.param-portal-edit.Control', paramPortalEditController);
        index.register.controller('mpd.param-portal-detail.Control', paramPortalDetailController);
});