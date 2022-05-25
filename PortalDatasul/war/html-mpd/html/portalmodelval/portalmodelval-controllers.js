define([
    'index', // index sempre deve ser injetado para permitir o registro dos controllers.
    '/dts/mpd/js/dbo/bodi00709.js',
    '/dts/mpd/js/api/fchdis0028.js'
], function(index) {
    portalModelValListController.$inject = [
        '$rootScope',
        '$scope',
        '$stateParams',
        'totvs.app-main-view.Service',
        'customization.generic.Factory',
        'mpd.portalmodelval.Service',
        'TOTVSEvent',
        '$location',
    ];
    function portalModelValListController(
        $rootScope,
        $scope,
        $stateParams,
        appViewService,
        customizationService,
        portalModelValService,
        TOTVSEvent,
        $location
    ) {
        var controller = this;

        controller.idPortalConfigur = $stateParams.idPortalConfigur;
        controller.father = $stateParams.idModel;

        this.listResult = [];       // array que mantem a lista de registros
        this.totalRecords = 0;      // atributo que mantem a contagem de registros da pesquisa
        this.disclaimers = [];      // array que mantem a lista de filtros aplicados

        // Adiciona um objeto na lista de disclaimers.
        this.addDisclaimer = function(property, value, label) {
            controller.disclaimers.push({
                property: property,
                value: value,
                title: label
            });
        }

        // Remove um disclaimer.
        this.removeDisclaimer = function(disclaimer) {
            // pesquisa e remove o disclaimer do array
            var index = controller.disclaimers.indexOf(disclaimer);

            if (index != -1) {
                controller.disclaimers.splice(index, 1);
            }

            // Dependendo do disclaimer excluido, atualiza os dados do controller para atualizar a tela.
            if (disclaimer.property == null)
                controller.quickSearchText = '';

            // Recarrega os dados quando remove um disclaimer.
            controller.loadData();
        }

        // Metodo de leitura dos dados
        this.loadData = function(isMore) {
            // valores default para o inicio e pesquisa
            var startAt = 0;
            var where = '';
            
             // monta a lista de propriedades e valores a partir dos disclaimers
            var properties = [];
            var values = [];
            
            //se houver pesquisa rápida, monta o where
            if (controller.quickSearchText){
                where = '(portal-model-val.num-seq-campo = int("' + controller.quickSearchText + '") OR ' +
                        'portal-model-val.num-seq-item = int("' + controller.quickSearchText + '") OR ' +
                        'portal-model-val.cod-valor Matches string("*' + controller.quickSearchText + '*") OR ' +
                        'portal-model-val.cod-campo Matches string("*' + controller.quickSearchText + '*"))'
                controller.disclaimers = [];
                controller.addDisclaimer(null, null, controller.quickSearchText);
            } else {
                controller.disclaimers.splice(index, 1);
            }

            // se não é busca de mais dados, inicializa o array de resultado
            if (!isMore) {
                controller.listResult = [];
            }

            // calcula o registro inicial da busca
            startAt = controller.listResult.length;

            //Adiciona as propriedades do pai
            properties.push('idi-model');
            values.push($stateParams.idModel);

            // monta os parametros para o service.
            var parameters = { property: properties, value: values };

            if (where)
                parameters.where = where;

            // chama o findRecords.
            portalModelValService.findRecords(startAt, parameters, function(result) {
                // Se tem result.
                if (result) {
                    // Para cada item do result.
                    angular.forEach(result, function (value) {
                        // Se tiver o atributo $length e popula o totalRecords.
                        if (value && value.$length) {
                            controller.totalRecords = value.$length;
                        }

                        // Adicionar o item na lista de resultado.
                        controller.listResult.push(value);
                    });
                }
            });
        }

        this.openAdd = function() {
            $location.path('dts/mpd/portalmodelval/' + controller.idPortalConfigur+ '/' + controller.father + '/new');
        }

        this.openDetail = function(portalModelVal) {
            $location.path('dts/mpd/portalmodelval/detail/' + controller.idPortalConfigur+ '/' + portalModelVal['idi-model'] + '/' + portalModelVal['num-seq-campo']);
        }

        this.openEdit = function(portalModelVal) {
            $location.path('dts/mpd/portalmodelval/edit/' + controller.idPortalConfigur+ '/' + portalModelVal['idi-model'] + '/' + portalModelVal['num-seq-campo']);
        }
        
        // Metodo para a ação de delete.
        this.delete = function(record) {
            // Envia um evento para perguntar ao usuário.
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question', // titulo da mensagem
                text: $rootScope.i18n('l-confirm-delete-operation'), // texto da mensagem
                cancelLabel: 'l-no', // label do botão cancelar
                confirmLabel: 'l-yes', // label do botão confirmar
                callback: function(isPositiveResult) { // função de retorno
                    if (isPositiveResult) { // se foi clicado o botão confirmar
                        // chama o metodo de remover registro do service
                        portalModelValService.deleteRecord(record['idi-model'], record['num-seq-campo'], function(result) {
                            if (result) {
                                // Remove o item da lista.
                                var index = controller.listResult.indexOf(record);

                                if (index != -1) {
                                    controller.listResult.splice(index, 1);
                                    controller.totalRecords--;

                                    // notifica o usuario que o registro foi removido
                                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                        type: 'success', // tipo de notificação
                                        title: $rootScope.i18n('l-modelo-val'), // titulo da notificação
                                        // detalhe da notificação
                                        detail: $rootScope.i18n('l-modelo-val') + ': '
                                            + record['num-seq-campo'] + ', ' +
                                            $rootScope.i18n('l-success-deleted') + '!'
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }

        this.init = function(portalModel) {
            if (appViewService.startView($rootScope.i18n('l-portal-model-val') + ' - '  +  $stateParams.idModel, 'mpd.portal-model-list.Control', controller)) {
                // se é a abertura da tab, implementar aqui inicialização do controller
            }

            // Realiza a busca de dados inicial.
            this.loadData(false);

            // chama um ponto da EPC para customizar a inicialização da tela.
            customizationService.callEvent('mpd.portalmodel', 'initEvent', controller);
        }

        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { this.init(); }

        // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
        $scope.$on('scope:on-load-portal-model-detail', function (event, portalModel) {
            controller.init(portalModel);
        });
    }
    
    portalModelValDetailController.$inject = [
        '$rootScope',
        '$scope',
        '$stateParams',
        '$location',
        'totvs.app-main-view.Service',
        'mpd.portalmodelval.Service',
        'TOTVSEvent'
    ];
    function portalModelValDetailController(
        $rootScope,
        $scope,
        $stateParams,
        $location,
        appViewService,
        portalModelValService,
        TOTVSEvent
    ) {
        var controller = this;

        controller.father = $stateParams.idModel;
        controller.idPortalConfigur = $stateParams.idPortalConfigur;

        this.model = {}; // mantem o conteudo do registro em detalhamento
        
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
                        portalModelValService.deleteRecord(controller.model ['idi-model'], controller.model['num-seq-campo'], function(result) {
                            if (result) {
                                // notifica o usuario que o registro foi removido
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type: 'success', // tipo de notificação
                                    title: $rootScope.i18n('l-modelo-val'), // titulo da notificação
                                    // detalhe da notificação
                                    detail: $rootScope.i18n('l-modelo-val') + ': '
                                        + controller.model['num-seq-campo'] + ', ' +
                                        $rootScope.i18n('l-success-deleted') + '!'
                                });

                                // Muda o state da tela para o state inicial, que é a lista.
                                $location.path('dts/mpd/portalmodelval/' + controller.idPortalConfigur + '/' + controller.father);
                            }
                        });
                    }
                }
            });
        }

        this.load = function(id) {
            this.model = {};

            // chama o servico para retornar o registro.
            portalModelValService.getRecord(this.father, id, function(portalmodelval) {
                if (portalmodelval) { // se houve retorno, carrega no model
                    controller.model = portalmodelval;
                }
            });
        }

        this.init = function() {
            if (appViewService.startView($rootScope.i18n('l-portal-model-val') + ' - '  +  $stateParams.idModel, 'mpd.portal-model-val-detail.Control', controller)) {             
                // se é a abertura da tab, implementar aqui inicialização do controller
            }

            // Se houver parametros na URL.
            if ($stateParams && $stateParams.id) {
                this.load($stateParams.id);
            }
        }

        // Se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { this.init(); }

        // Cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        });
    }    
 
    portalModelValEditController.$inject = [
        '$rootScope',
        '$scope',
        '$stateParams',
        '$window',
        '$location',
        '$state',
        'totvs.app-main-view.Service', 
        'mpd.portalmodelval.Service',
        'mpd.fchdis0028.FactoryApi',
        'TOTVSEvent'
    ];
    function portalModelValEditController(
        $rootScope,
        $scope,
        $stateParams,
        $window,
        $location,
        $state,
        appViewService,
        portalModelValService,
        portalModelValFactoryApi,
        TOTVSEvent
    ) {
        var controller = this;

        controller.father = $stateParams.idModel;
        controller.idPortalConfigur = $stateParams.idPortalConfigur;

        this.model = {}; // mantem o conteudo do registro em edição/inclusão
        this.fieldSelected = "";
        this.numSeqItem = 0;
        this.title = "";
        this.idDisabled = "";

        this.load = function(id) {
            this.model = {};
                    
            // chama o servico para retornar o registro
            portalModelValService.getRecord(this.father, id, function(result) {
                controller.model = result;
                
                this.numSeqItem = controller.model['num-seq-item'];
                this.father     = controller.model['idi-model'];

                //Retorna os campos para o combo-box da tela de edit ou new
                portalModelValFactoryApi.getFieldsModelVal({idiModel: this.father, numSeqItem: this.numSeqItem}, function(result) {
                    controller.listFields = result;
                    controller.fieldSelected = controller.getFieldSelected(controller.model['cod-campo'],controller.listFields);
                });
            });
        }

        controller.getFieldSelected = function(id, data) {
            var fieldSelected = [];

            angular.forEach(data, function(value) {
                if (id == value['c-field']) {
                    fieldSelected = value;
                }
            });

            return fieldSelected
        }

        this.save = function() {
            this.model['idi-model'] = this.father;
            this.model['cod-campo'] = this.fieldSelected['c-field'];

            if (this.isInvalidForm()) {
                return;
            }            
            
            // se for a tela de edição, faz o update
            if ($state.is('dts/mpd/portalmodelval.edit')) {      
                portalModelValService.updateRecord(this.model['idi-model'],this.model['num-seq-campo'], this.model, function(result) {
                    // se gravou o registro com sucesso
                    controller.onSaveUpdate(true, result);
                });
            } else { // senão faz o create
                portalModelValService.saveRecord(this.model, function(result) {
                    // se gravou o registro com sucesso
                    controller.onSaveUpdate(false, result);
                });
            }
        }

        // Metodo para notificar o usuario da gravaçao do registro com sucesso.
        this.onSaveUpdate = function(isUpdate, result) {
            if (result.$hasError == true) return;
            
            // Redireciona a tela para a tela de detalhar
            controller.model = result;

            if (isUpdate){
                controller.redirectToDetail();
            } else {
                controller.redirectToInit();
            }

            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type: 'success',
                title: $rootScope.i18n('l-modelo-val'),
                detail: $rootScope.i18n('l-modelo-val') + ' ' +
                (isUpdate ? $rootScope.i18n('l-success-updated') : $rootScope.i18n('l-success-created')) + '!'
            });
        }

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

        this.isInvalidForm = function() {
            var messages = [];
            var isInvalidForm = false;

            if ((this.model['cod-campo'] == undefined) || (this.model['cod-campo'] == '')) {
                isInvalidForm = true;
            }            

            if ((this.model['cod-valor'] == undefined) || (this.model['cod-valor'] == '')) {
                isInvalidForm = true;
            }

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

        this.redirectToDetail = function() {
            $location.path('dts/mpd/portalmodelval/detail/' + this.idPortalConfigur + '/' + this.model['idi-model'] + '/' + this.model['num-seq-campo']);
        }

        this.redirectToInit = function() {
            $location.path('dts/mpd/portalmodelval/' + this.idPortalConfigur + '/' + this.model['idi-model']);
        }

        this.changeNumSeqItem = function(numSeqItem) {
            if (numSeqItem > 0){
                this.numSeqItem = numSeqItem;
            } else {
                this.numSeqItem = 0;
            }

            //Retorna os campos para o combo-box da tela de edit ou new
            portalModelValFactoryApi.getFieldsModelVal({idiModel: this.father, numSeqItem: this.numSeqItem}, function(result) {
                controller.listFields = result;
            });
        }

        this.init = function() {
            controller.listFields = [{'c-label':''}];

            if (appViewService.startView($rootScope.i18n('l-portal-model-val') + ' - '  +  $stateParams.idModel, 'mpd.portal-model-val-edit.Control', controller)) {
                // se é a abertura da tab, implementar aqui inicialização do controller.
            }

            // se houver parametros na URL
            if ($stateParams && $stateParams.id) {
                // realiza a busca de dados inicial
                this.load($stateParams.id);
            } else { // se não, incica com o model em branco (inclusão)
                this.model = {};

                controller.fieldSelected = '';

                this.changeNumSeqItem();
            }

            // atributo auxiliar para determinar se é uma edição, desabilitando o campo chave        
            this.idDisabled = $state.is('dts/mpd/portalmodelval.edit');

            if (this.idDisabled) {
                controller.title = $rootScope.i18n('l-edit-model-field');
            } else {
                controller.title = $rootScope.i18n('l-add-model-field');
            }
        }

        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { this.init(); }

        // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        });    
    }

    portalModelValSearchController.$inject = ['$modalInstance'];
    function portalModelValSearchController ($modalInstance) {
        this.search = function () {
            $modalInstance.close();
        }
         
        this.close = function () {
            // dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
            $modalInstance.dismiss();
        }
    }

    // Registrar os controllers no angular.
    index.register.controller('mpd.portal-model-val-list.Control', portalModelValListController);
    index.register.controller('mpd.portal-model-val-edit.Control', portalModelValEditController);
    index.register.controller('mpd.portal-model-val-detail.Control', portalModelValDetailController);
    index.register.controller('mpd.portal-model-val-search.Control', portalModelValSearchController);    
});
