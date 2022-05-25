define(['index', // index sempre deve ser injetado para permitir o registro dos controllers.
         // totvs-custom alem das tags de customização de tela, tambem comtêm os serviços de customização
        '/dts/mpd/js/dbo/bodi00710.js' // os controllers dependem dos serviços registrados.
       ], function(index) {
 
    // *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************

    portalMsgListController.$inject = ['$rootScope',
                                       '$scope',
                                       '$stateParams',
                                       '$modal',
                                       'totvs.app-main-view.Service',                                       
                                       'customization.generic.Factory',
                                       'mpd.portalmsg.Service', 'TOTVSEvent'];
    function portalMsgListController($rootScope, $scope, $stateParams, $modal, appViewService, customizationService, portalMsgService, TOTVSEvent) {

        var controller = this;
                
        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************

        this.listResult = [];       // array que mantem a lista de registros
        this.totalRecords = 0;      // atributo que mantem a contagem de registros da pesquisa
        this.disclaimers = [];      // array que mantem a lista de filtros aplicados
        this.idPortalConfigur = $stateParams.idPortalConfigur;
        
        // *********************************************************************************
        // *** Methods
        // *********************************************************************************
        
        // adiciona um objeto na lista de disclaimers
        this.addDisclaimer = function(property, value, label) {
            controller.disclaimers.push({
                property: property,
                value: value,
                title: label
            });
        }
        // remove um disclaimer
        this.removeDisclaimer = function(disclaimer) {
            // pesquisa e remove o disclaimer do array
            var index = controller.disclaimers.indexOf(disclaimer);
            if (index != -1) {
                controller.disclaimers.splice(index, 1);
            }

            // dependendo do disclaimer excluido, atualiza os dados do controller para atualizar a tela.
            if (disclaimer.property == null)
                controller.quickSearchText = '';            
            // recarrega os dados quando remove um disclaimer
            controller.loadData();
        }

        // metodo de leitura dos dados
        this.loadData = function(isMore) {
            // valores default para o inicio e pesquisa
            var startAt = 0;
            var where = '';
            
             // monta a lista de propriedades e valores a partir dos disclaimers
            var properties = [];
            var values = [];           
            
            //se houver pesquisa rápida, monta o where
            if (controller.quickSearchText){
                where = '(portal-msg-clien.idi-message = int("' + controller.quickSearchText + '") OR ' +
                        'portal-msg-clien.des-obs Matches string("*' + controller.quickSearchText + '*"))'
                controller.disclaimers = [];
                controller.addDisclaimer(null, null, controller.quickSearchText);
            }
                                    
            // se não é busca de mais dados, inicializa o array de resultado
            if (!isMore) {
                controller.listResult = [];
            }
            // calcula o registro inicial da busca
            startAt = controller.listResult.length;
            
            //Adiciona as propriedades do pai
            properties.push('idi-seq');
            values.push($stateParams.idPortalConfigur);
            
            // monta os parametros para o service
            var parameters = {
                property: properties,
                value: values,
            };
            
            if (where)
                parameters.where = where;
            
            // chama o findRecords
            portalMsgService.findRecords(startAt, parameters, function(result) {
                // se tem result
                if (result) {

                    // para cada item do result
                    angular.forEach(result, function (value) {
                        
                        // se tiver o atributo $length e popula o totalRecords
                        if (value && value.$length) {
                            controller.totalRecords = value.$length;
                        }
                        // adicionar o item na lista de resultado
                        controller.listResult.push(value);                        
                    });
                }
            });

            var menuView = $('#menu-view');
            menuView.attr('style', '');
        }
        
        // metodo para a ação de delete
        this.delete = function(record) {
            // envia um evento para perguntar ao usuário
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question', // titulo da mensagem
                text: $rootScope.i18n('l-confirm-delete-operation'), // texto da mensagem
                cancelLabel: 'l-no', // label do botão cancelar
                confirmLabel: 'l-yes', // label do botão confirmar
                callback: function(isPositiveResult) { // função de retorno
                    if (isPositiveResult) { // se foi clicado o botão confirmar

                        // chama o metodo de remover registro do service
                        portalMsgService.deleteRecord(record['idi-seq'], record['idi-message'], function(result) {
                            if (result) {

                                // remove o item da lista
                                var index = controller.listResult.indexOf(record);

                                if (index != -1) {

                                    controller.listResult.splice(index, 1);

                                    controller.totalRecords--;

                                    // notifica o usuario que o registro foi removido
                                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                        type: 'success', // tipo de notificação
                                        title: $rootScope.i18n('l-messages'), // titulo da notificação
                                        // detalhe da notificação
                                        detail: $rootScope.i18n('l-messages') + ': '
                                            + record['idi-message'] + ', ' +
                                            $rootScope.i18n('l-success-deleted') + '!'
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
        
        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
        this.init = function() {
            if (appViewService.startView($rootScope.i18n('l-portal-msg') + ' ' + $stateParams.idPortalConfigur, 'mpd.portal-msg-list.Control', controller)) {
                // se é a abertura da tab, implementar aqui inicialização do controller
            }
            // realiza a busca de dados inicial
            this.loadData(false);            
            // chama um ponto da EPC para customizar a inicialização da tela.
            customizationService.callEvent('mpd.portalmsg', 'initEvent', controller);
        }
        
        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { this.init(); }

        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************

        // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
        $scope.$on('scope:on-load-portal-configur-detail', function (event, portalConfigur) {
            controller.init(portalConfigur);
        });

    }
     
    // **************************************************************************************
	// *** CONTROLLER - DETAIL
	// **************************************************************************************
    
    portalMsgDetailController.$inject = ['$rootScope', 
                                         '$scope', 
                                         '$stateParams', 
                                         '$location',
                                         '$state',
                                         'totvs.app-main-view.Service', 
                                         'mpd.portalmsg.Service', 'TOTVSEvent'];
    function portalMsgDetailController($rootScope, $scope, $stateParams, $location, $state,
                                        appViewService, portalMsgService, TOTVSEvent) {
        var controller = this;
        
        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************
        this.model = {}; // mantem o conteudo do registro em detalhamento
        this.father = $stateParams.idPortalConfigur;
        
        // *********************************************************************************
        // *** Methods
        // *********************************************************************************
        // metodo para a ação de remover
        this.onRemove = function() {
            // envia um evento para perguntar ao usuário
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question', // titlo da mensagem
                text: $rootScope.i18n('l-confirm-delete-operation'), // texto da mensagem
                cancelLabel: 'l-no', // label do botão cancelar
                confirmLabel: 'l-yes', // label do botão confirmar
                callback: function(isPositiveResult) { // função de retorno
                    if (isPositiveResult) { // se foi clicado o botão confirmar

                        // chama o metodo de remover registro do service
                        portalMsgService.deleteRecord(controller.model ['idi-seq'], controller.model['idi-message'], function(result) {
                            if (result) {
                                // notifica o usuario que o registro foi removido
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type: 'success', // tipo de notificação
                                    title: $rootScope.i18n('l-messages'), // titulo da notificação
                                    // detalhe da notificação
                                    detail: $rootScope.i18n('l-messages') + ': '
                                        + controller.model['idi-message'] + ', ' +
                                        $rootScope.i18n('l-success-deleted') + '!'
                                });
                                // muda o state da tela para o state inicial, que é a lista
                                $location.path('dts/mpd/portalmsg/' + controller.model['idi-seq']);
                            }
                        });
                    }
                }
            });
        }
        // metodo de leitura do regstro
        this.load = function(id) {
            this.model = {}; // zera o model
            // chama o servico para retornar o registro
            portalMsgService.getRecord(this.father, id, function(portalMsg) {
                if (portalMsg) { // se houve retorno, carrega no model
                    controller.model = portalMsg;
                                        
                    if (portalMsg['cod-livre-1'].substring(0,1) == '1') {
                        controller.ckTelaInicial = true;
                    } else {
                        controller.ckTelaInicial = false;
                    }
                    if (portalMsg['cod-livre-1'].substring(1,2) == '1'){
                        controller.ckTelaCadastro = true;
                    } else {
                        controller.ckTelaCadastro = false;
                    }
                    if (portalMsg['cod-livre-1'].substring(2,3) == '1'){
                        controller.ckTelaConsulta = true;                        
                    } else {
                        controller.ckTelaConsulta = false;
                    }
                    if (portalMsg['cod-livre-1'].substring(3,4) == '1'){
                        controller.ckTelaImpressao = true;                        
                    } else {
                        controller.ckTelaImpressao = false;
                    }
					if (portalMsg['cod-livre-1'].substring(4,5) == '1'){
                        controller.ckTelaCadastroCotacao = true;                        
                    } else {
                        controller.ckTelaCadastroCotacao = false;
                    }
					if (portalMsg['cod-livre-1'].substring(5,6) == '1'){
                        controller.ckTelaImpressaoCotacao = true;                        
                    } else {
                        controller.ckTelaImpressaoCotacao = false;
                    }
                }              
            });
        }

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        this.init = function() {

            if (appViewService.startView($rootScope.i18n('l-portal-msg') + ' ' + $stateParams.idPortalConfigur, 'mpd.portal-msg-detail.Control', controller)) {             
                // se é a abertura da tab, implementar aqui inicialização do controller
            }
            // se houver parametros na URL
            if ($stateParams && $stateParams.id) {
                // realiza a busca de dados inicial
                this.load($stateParams.id);
            }
        }

        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { this.init(); }

        // *********************************************************************************
        // *** Events Listeners
        // *********************************************************************************

        // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        });
    }    
 
    // **************************************************************************************
	// *** CONTROLLER - EDIT
	// **************************************************************************************
	    
    portalMsgEditController.$inject = ['$rootScope',
                                       '$scope',
                                       '$stateParams',
                                       '$window',
                                       '$location',
                                       '$state',
                                       'totvs.app-main-view.Service', 
                                       'mpd.portalmsg.Service', 'TOTVSEvent'];
    function portalMsgEditController($rootScope, $scope, $stateParams, $window, $location, $state,
                                      appViewService, portalMsgService, TOTVSEvent) {
        var controller = this;
        
        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************

        this.model = {}; // mantem o conteudo do registro em edição/inclusão
        this.father = $stateParams.idPortalConfigur;
        
        // *********************************************************************************
        // *** Methods
        // *********************************************************************************

        // metodo de leitura do regstro
        this.load = function(id) {
            this.model = {};
                    
            // chama o servico para retornar o registro
            portalMsgService.getRecord(this.father, id, function(result) {
                
                // carrega no model
                controller.model = result;
                
                if (controller.model['cod-livre-1'].substring(0,1) == '1') {
                    controller.ckTelaInicial = true;
                } else {
                    controller.ckTelaInicial = false;
                }
                if (controller.model['cod-livre-1'].substring(1,2) == '1'){
                    controller.ckTelaCadastro = true;
                } else {
                    controller.ckTelaCadastro = false;
                }
                if (controller.model['cod-livre-1'].substring(2,3) == '1'){
                    controller.ckTelaConsulta = true;                        
                } else {
                    controller.ckTelaConsulta = false;
                }
                if (controller.model['cod-livre-1'].substring(3,4) == '1'){
                    controller.ckTelaImpressao = true;                        
                } else {
                    controller.ckTelaImpressao = false;
                }
				if (controller.model['cod-livre-1'].substring(4,5) == '1'){
                    controller.ckTelaCadastroCotacao = true;                        
                } else {
                    controller.ckTelaCadastroCotacao = false;
                }
				 if (controller.model['cod-livre-1'].substring(5,6) == '1'){
                    controller.ckTelaImpressaoCotacao = true;                        
                } else {
                    controller.ckTelaImpressaoCotacao = false;
                }    
            });
        }
        
        // metodo para salvar o registro
        this.save = function() {
            // verificar se o formulario tem dados invalidos
            if (this.isInvalidForm()) {
                return;
            }
            
            this.model['idi-seq'] = this.father;
            
            //Salvando os campos logicos
            
            if (this.ckTelaInicial == true){
                this.model['cod-livre-1'] = '1';
            } else {
                this.model['cod-livre-1'] = '0';
            }
            if (this.ckTelaCadastro == true){
                this.model['cod-livre-1'] =  this.model['cod-livre-1'] + '1';
            } else {
                this.model['cod-livre-1'] = this.model['cod-livre-1'] + '0';
            }
            if (this.ckTelaConsulta == true){
                this.model['cod-livre-1'] = this.model['cod-livre-1'] + '1';
            } else {
                this.model['cod-livre-1'] = this.model['cod-livre-1'] + '0';
            }
            if (this.ckTelaImpressao == true){
                this.model['cod-livre-1'] = this.model['cod-livre-1'] + '1';
            } else {
                this.model['cod-livre-1'] = this.model['cod-livre-1'] + '0';
            }
			if (this.ckTelaCadastroCotacao == true){
                this.model['cod-livre-1'] = this.model['cod-livre-1'] + '1';
            } else {
                this.model['cod-livre-1'] = this.model['cod-livre-1'] + '0';
            }
			if (this.ckTelaImpressaoCotacao == true){
                this.model['cod-livre-1'] = this.model['cod-livre-1'] + '1';
            } else {
                this.model['cod-livre-1'] = this.model['cod-livre-1'] + '0';
            }
            
            // se for a tela de edição, faz o update
            if ($state.is('dts/mpd/portalmsg.edit')) {      
                
                portalMsgService.updateRecord(this.model['idi-seq'], this.model['idi-message'], this.model, function(result) {
                    // se gravou o registro com sucesso
                    controller.onSaveUpdate(true, result);
                });
            } else { // senão faz o create
                
                portalMsgService.saveRecord(this.model, function(result) {
                    // se gravou o registro com sucesso
                    controller.onSaveUpdate(false, result);
                });
            }            
        }
        // metodo para notificar o usuario da gravaçao do registro com sucesso
        this.onSaveUpdate = function(isUpdate, result) {
            
            if (result.$hasError == true) return;
            
            // redireciona a tela para a tela de detalhar
            controller.model = result;
            if (isUpdate){
                controller.redirectToDetail();
            } else {
                controller.redirectToInit();
            }
            
             // notifica o usuario que conseguiu salvar o registro
            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type: 'success',
                title: $rootScope.i18n('l-messages'),
                detail: $rootScope.i18n('l-messages') + ' ' +
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

            // se for invalido, monta e mostra a mensagem
            if (isInvalidForm) {
                var warning = $rootScope.i18n('l-field');
                if (messages.length > 1) {
                    warning = $rootScope.i18n('l-fields');
                }
                angular.forEach(messages, function(item) {
                    warning = warning + ' ' + $rootScope.i18n(item) + ',';
                });
                if (messages.length > 1) {
                    warning = warning + ' ' + $rootScope.i18n('l-requireds');
                } else {
                    warning = warning + ' ' + $rootScope.i18n('l-required');
                }
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-attention'),
                    detail: warning
                });
            }

            return isInvalidForm;
        }
        
        // redireciona para a tela de detalhar
        this.redirectToDetail = function() {
            $location.path('dts/mpd/portalmsg/detail/' + this.model['idi-seq'] + '/' + this.model['idi-message']);
        }
        // redireciona para a tela inicial
        this.redirectToInit = function() {
            $location.path('dts/mpd/portalmsg/' + this.model['idi-seq']);
        }
                
        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        this.init = function() {

            if (appViewService.startView($rootScope.i18n('l-portal-msg') + ' ' + $stateParams.idPortalConfigur, 'mpd.portal-msg-edit.Control', controller)) {
                // se é a abertura da tab, implementar aqui inicialização do controller            
            }

            // se houver parametros na URL
            if ($stateParams && $stateParams.id) {
                // realiza a busca de dados inicial
                this.load($stateParams.id);
            } else { // se não, incica com o model em branco (inclusão)
                this.model = {};
            }
            
            // atributo auxiliar para determinar se é uma edição, desabilitando o campo chave        
            this.idDisabled = $state.is('dts/mpd/portalmsg.edit');

            if (this.idDisabled) {
                this.title = $rootScope.i18n('l-editar');
            } else {
                this.title = $rootScope.i18n('l-novo-registro');
            }            
        }

        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { this.init(); }

        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************

        // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        });    
    }
 
    /*********** definição do controller portalMsgSearchController ***********/
    
    portalMsgSearchController.$inject = ['$modalInstance', 'model'];
    function portalMsgSearchController ($modalInstance, model) {
                 
        // ação de pesquisar
        this.search = function () {
            // close é o fechamento positivo
            $modalInstance.close();
        }
         
        // ação de fechar
        this.close = function () {
            // dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
            $modalInstance.dismiss();
        }
    }
 
    // registrar os controllers no angular 
    index.register.controller('mpd.portal-msg-list.Control', portalMsgListController);
    index.register.controller('mpd.portal-msg-edit.Control', portalMsgEditController);
    index.register.controller('mpd.portal-msg-detail.Control', portalMsgDetailController);
    index.register.controller('mpd.portal-msg-search.Control', portalMsgSearchController);    
});