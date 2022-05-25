define(['index', // index sempre deve ser injetado para permitir o registro dos controllers.
         // totvs-custom alem das tags de customização de tela, tambem comtêm os serviços de customização
        '/dts/mpd/js/api/fchdis0028.js' // os controllers dependem dos serviços registrados.
       ], function(index) {
 
    // *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************

    portalUserRelatedListController.$inject = ['$rootScope',
                                               '$scope',
                                               '$stateParams',
                                               '$modal',
                                               'totvs.app-main-view.Service',
                                               'customization.generic.Factory',
                                               'mpd.fchdis0028.FactoryApi', 'TOTVSEvent'];
    function portalUserRelatedListController($rootScope, $scope, $stateParams, $modal, appViewService, customizationService, portalUserRelatedFactoryApi, TOTVSEvent) {

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
            var where = ' ';
            var max = 10;
            var cont = 0;
             
            //se houver pesquisa rápida, monta o where
            if (controller.quickSearchText){
                where = '(ttUsuar.cod_usuario Matches string("*' + controller.quickSearchText + '*") OR ' +
                        ' ttUsuar.nom_usuario Matches string("*' + controller.quickSearchText + '*") OR ' +                        
                        ' ttUsuar.cod_e_mail_local Matches string("*' + controller.quickSearchText + '*"))'
                        
                        
                controller.disclaimers = [];
                controller.addDisclaimer(null, null, controller.quickSearchText);
            }
                                    
            // se não é busca de mais dados, inicializa o array de resultado
            if (!isMore) {
                controller.listResult = [];
            }
            // calcula o registro inicial da busca
            startAt = controller.listResult.length;
            
            // Busca Registros
            portalUserRelatedFactoryApi.getUserRelated({idiSeq: $stateParams.idPortalConfigur, startAt: startAt, max: max, where: where}, function(result) {
                // se tem result
                if (result) {
                    
                    // para cada item do result
                    angular.forEach(result, function (value) {
                        
                        if (value.totalRecords != 0)
                            controller.totalRecords = value.totalRecords;
                        
                        if (value.user_block == true){
                            value.titleUserBlock = $rootScope.i18n('l-desbloquear-usuario');
                        } else {
                            value.titleUserBlock = $rootScope.i18n('l-bloquear-usuario');
                        }
                        // adicionar o item na lista de resultado
                        controller.listResult.push(value);                        
                    });
                    
                }
            });
        }
        
        // metodo para a ação de delete
        this.delete = function(record) {
            // envia um evento para perguntar ao usuário
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-title-delete-operation', // titulo da mensagem
                text: $rootScope.i18n('l-description-delete-operation'), // texto da mensagem
                cancelLabel: 'l-no', // label do botão cancelar
                confirmLabel: 'l-yes', // label do botão confirmar
                callback: function(isPositiveResult) { // função de retorno
                    if (isPositiveResult) { // se foi clicado o botão confirmar
                        // chama o metodo de remover registro do service
                        portalUserRelatedFactoryApi.deleteUserRelated({codUsuario: record.cod_usuario, idiDtsul: record.idi_dtsul}, function(result) {
                            if (result) {
                                // remove o item da lista
                                var index = controller.listResult.indexOf(record);

                                if (index != -1) {
                                    controller.listResult.splice(index, 1);
                                    controller.totalRecords--;

                                    // notifica o usuario que o registro foi removido
                                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                        type: 'success', // tipo de notificação
                                        title: $rootScope.i18n('l-usuario'), // titulo da notificação
                                        // detalhe da notificação
                                        detail: $rootScope.i18n('l-usuario') + ': '
                                            + record.cod_usuario + ', ' +
                                            $rootScope.i18n('l-success-deleted') + '!'
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
        
        this.userBlock = function(record){
            
            portalUserRelatedFactoryApi.putBlockUnlockUserRelated(record, function(result) {
            
                angular.forEach(controller.listResult, function(value) {
                    if (value.cod_usuario == record.cod_usuario){
                        
                        value.user_block = !record.user_block;
                        
                        if (value.user_block == true){
                            value.titleUserBlock = $rootScope.i18n('l-desbloquear-usuario');
                        } else {
                            value.titleUserBlock = $rootScope.i18n('l-bloquear-usuario');
                        }
                    }
                });
            });            
        }
        
        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
        this.init = function() {
            if (appViewService.startView($rootScope.i18n('l-portal-user-related'), 'mpd.portal-user-related-list.Control', controller)) {
                // se é a abertura da tab, implementar aqui inicialização do controller
            }
            // realiza a busca de dados inicial
            this.loadData(false);            
            // chama um ponto da EPC para customizar a inicialização da tela.
            customizationService.callEvent('mpd.portaluserrelated', 'initEvent', controller);
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
    
    portalUserRelatedDetailController.$inject = ['$rootScope',
                                                 '$scope',
                                                 '$stateParams',
                                                 '$location',
                                                 '$state',
                                                 'totvs.app-main-view.Service',
                                                 'mpd.fchdis0028.FactoryApi', 'TOTVSEvent'];
    function portalUserRelatedDetailController($rootScope, $scope, $stateParams, $location, $state,
                                               appViewService, portalUserRelatedFactoryApi, TOTVSEvent) {
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
                        portalUserRelatedFactoryApi.deleteUserRelated({codUsuario: controller.model.cod_usuario, idiDtsul: controller.model.idi_dtsul}, function(result) {
                            if (result) {
                                // notifica o usuario que o registro foi removido
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type: 'success', // tipo de notificação
                                    title: $rootScope.i18n('l-usuario'), // titulo da notificação
                                    // detalhe da notificação
                                    detail: $rootScope.i18n('l-usuario') + ': '
                                        + controller.model.cod_usuario + ', ' +
                                        $rootScope.i18n('l-success-deleted') + '!'
                                });
                                // muda o state da tela para o state inicial, que é a lista
                                $location.path('dts/mpd/portaluserrelated/' + controller.model.idi_seq);
                            }
                        });
                    }
                }
            });
        }
        // metodo de leitura do regstro
        this.load = function(id) {
            this.model = {}; // zera o model
            startAt = 0;
            max = 10;
            where = 'ttUsuar.cod_usuario = string("' + id + '")';
            
            // chama o servico para retornar o registro
            portalUserRelatedFactoryApi.getUserRelated({idiSeq: this.father, startAt: startAt, max: max, where: where}, function(result) {
                controller.model = result[0];
                controller.model.cod_senha = undefined;                
            });
        }

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        this.init = function() {

            if (appViewService.startView($rootScope.i18n('l-portal-user-related'), 'mpd.portal-user-related-detail.Control', controller)) {
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
	    
    portalUserRelatedEditController.$inject = ['$rootScope',
                                               '$scope',
                                               '$stateParams',
                                               '$window',
                                               '$location',
                                               '$state',
                                               'totvs.app-main-view.Service',
                                               'mpd.fchdis0028.FactoryApi', 'TOTVSEvent'];
    function portalUserRelatedEditController($rootScope, $scope, $stateParams, $window, $location, $state,
                                             appViewService,portalUserRelatedFactoryApi, TOTVSEvent) {
                                                 
        var controller = this;
        
        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************

        this.model = {}; // mantem o conteudo do registro em edição/inclusão
        this.father = $stateParams.idPortalConfigur;
        this.dtIni = new Date();
        this.dtFim = 4102365600000;       
        
        this.dateIniFimVal= {start: this.dtIni, end: this.dtFim};
        
        // *********************************************************************************
        // *** Methods
        // *********************************************************************************

        // metodo de leitura do regstro
        this.load = function(id) {
            this.model = {};
            startAt = 0;
            max = 10;
            where = 'ttUsuar.cod_usuario = string("' + id + '")';
            
            // chama o servico para retornar o registro
            portalUserRelatedFactoryApi.getUserRelated({idiSeq: this.father, startAt: startAt, max: max, where: where}, function(result) {
                controller.model = result[0];
                controller.model.cod_senha = undefined;
                controller.dateIniFimVal= {start: controller.model.dat_inic_valid, end: controller.model.dat_fim_valid};
            });
        }
        
        // metodo para salvar o registro
        this.save = function() {
            
            var lErro = false;
            
            // verificar se o formulario tem dados invalidos
            if (this.isInvalidForm()) {
                return;
            }
            
            this.model.idi_seq = this.father;
            this.model.dat_inic_valid = this.dateIniFimVal.start;
            this.model.dat_fim_valid  = this.dateIniFimVal.end;
            
            if ($state.is('dts/mpd/portaluserrelated.edit')) {
                //Valida se foi deixado algum campo em branco
                if (   this.model.cod_usuario == '' || this.model.cod_usuario == undefined || this.model.cod_usuario == null
                    || this.model.nom_usuario == '' || this.model.nom_usuario == undefined || this.model.nom_usuario == null
                    || this.model.cod_e_mail_local == '' || this.model.cod_e_mail_local == undefined || this.model.cod_e_mail_local == null
                    || this.dateIniFimVal.start == '' || this.dateIniFimVal.start == undefined || this.dateIniFimVal.start == null
                    || this.dateIniFimVal.end == '' || this.dateIniFimVal.end == undefined || this.dateIniFimVal.end == null){
                                            
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error',
                            title: $rootScope.i18n('l-attention'),
                            detail: $rootScope.i18n('l-campos-preenchido')                        
                        }); 
                        lErro = true;
                }            
                
                if (  this.model.cod_senha != '' && this.model.cod_senha != undefined && this.model.cod_senha != null
                   || this.model.valid_senha != '' && this.model.valid_senha != undefined && this.model.valid_senha != null){
                    
                    if (this.model.cod_senha != this.model.valid_senha){
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error',
                            title: $rootScope.i18n('l-attention'),
                            detail: $rootScope.i18n('l-valid-senha')
                        });
                        lErro = true;
                    }
                }
            } else {
            
                //Valida se foi deixado algum campo em branco
                if (   this.model.cod_usuario == '' || this.model.cod_usuario == undefined || this.model.cod_usuario == null
                    || this.model.nom_usuario == '' || this.model.nom_usuario == undefined || this.model.nom_usuario == null
                    || this.model.cod_e_mail_local == '' || this.model.cod_e_mail_local == undefined || this.model.cod_e_mail_local == null
                    || this.dateIniFimVal.start == '' || this.dateIniFimVal.start == undefined || this.dateIniFimVal.start == null
                    || this.dateIniFimVal.end == '' || this.dateIniFimVal.end == undefined || this.dateIniFimVal.end == null
                    || this.model.cod_senha == '' || this.model.cod_senha == undefined || this.model.cod_senha == null
                    || this.model.valid_senha == '' || this.model.valid_senha == undefined || this.model.valid_senha == null){
                                            
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error',
                            title: $rootScope.i18n('l-attention'),
                            detail: $rootScope.i18n('l-campos-preenchido')                        
                        }); 
                        lErro = true;
                }            
                
                if (this.model.cod_senha != this.model.valid_senha){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error',
                        title: $rootScope.i18n('l-attention'),
                        detail: $rootScope.i18n('l-valid-senha')                    
                    });
                    lErro = true;
                }
            }
            
            if (lErro == false) {
                
                // se for a tela de edição, faz o update
                if ($state.is('dts/mpd/portaluserrelated.edit')) {
                    
                    portalUserRelatedFactoryApi.putUserRelated(this.model, function(result) {
                        // se gravou o registro com sucesso
                        controller.onSaveUpdate(true, result);
                    });
                } else { // senão faz o create
                    
                    portalUserRelatedFactoryApi.postUserRelated(this.model, function(result) {
                        // se gravou o registro com sucesso
                        controller.onSaveUpdate(false, result);
                    });
                }
            }
        }
        // metodo para notificar o usuario da gravaçao do registro com sucesso
        this.onSaveUpdate = function(isUpdate, result) {
            
            if (result.$hasError == true) return;
            
            // redireciona a tela para a tela de detalhar            
            if (isUpdate){
                controller.redirectToDetail();                
            } else {
                controller.redirectToInit();
            }
            
             // notifica o usuario que conseguiu salvar o registro
            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type: 'success',
                title: $rootScope.i18n('l-usuario'),
                detail: $rootScope.i18n('l-usuario') + ' ' +
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
            $location.path('dts/mpd/portaluserrelated/detail/' + this.model.idi_seq + '/' + this.model.cod_usuario);
        }
        // redireciona para a tela inicial
        this.redirectToInit = function() {
            $location.path('dts/mpd/portaluserrelated/' + this.model.idi_seq);
        }
                
        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        this.init = function() {
            
            if (appViewService.startView($rootScope.i18n('l-portal-user-related'), 'mpd.portal-user-related-edit.Control', controller)) {
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
            this.idDisabled = $state.is('dts/mpd/portaluserrelated.edit');

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
 
    // registrar os controllers no angular 
    index.register.controller('mpd.portal-user-related-list.Control', portalUserRelatedListController);
    index.register.controller('mpd.portal-user-related-edit.Control', portalUserRelatedEditController);
    index.register.controller('mpd.portal-user-related-detail.Control', portalUserRelatedDetailController);    
});