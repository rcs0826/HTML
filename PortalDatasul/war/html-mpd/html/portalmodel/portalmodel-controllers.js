define([
    'index', // index sempre deve ser injetado para permitir o registro dos controllers.
    '/dts/mpd/js/dbo/bodi00707.js', // os controllers dependem dos serviços registrados.
    '/dts/mpd/js/zoom/portal-configur-clien.js', //zoom de configuração do portal
    '/dts/mpd/js/zoom/portal-model.js', //zoom de modelo do portal
    '/dts/mpd/js/api/fchdis0028.js'
], function(index) {
    portalModelListController.$inject = [
        '$rootScope',
        '$scope',
        '$stateParams',
        '$modal',
        'totvs.app-main-view.Service',                                       
        'customization.generic.Factory',
        'mpd.portalmodel.Service', 'TOTVSEvent'
    ];
    function portalModelListController(
        $rootScope,
        $scope,
        $stateParams,
        $modal,
        appViewService,
        customizationService,
        portalModelService,
        TOTVSEvent
    ) {
        var controller = this;

        this.listResult = [];       // array que mantem a lista de registros
        this.totalRecords = 0;      // atributo que mantem a contagem de registros da pesquisa
        this.disclaimers = [];      // array que mantem a lista de filtros aplicados
        this.idPortalConfigur = $stateParams.idPortalConfigur;
		this.idiTipconfig = $stateParams.idTipconfig;
        this.copy = {};
        // this.idiTipConfig = 0;
		
		// adiciona um objeto na lista de disclaimers
        this.addDisclaimer = function(property, value, label) {
            controller.disclaimers.push({
                property: property,
                value: value,
                title: label
            });
        }

        // pesquisa e remove o disclaimer do array
        this.removeDisclaimer = function(disclaimer) {
            var index = controller.disclaimers.indexOf(disclaimer);

            if (index != -1) {
                controller.disclaimers.splice(index, 1);
            }

            // dependendo do disclaimer excluido, atualiza os dados do controller para atualizar a tela.
            if (disclaimer.property == 'quickSearchText')
                controller.quickSearchText = '';

            controller.loadData();
        }

        // metodo de leitura dos dados
        this.loadData = function(isMore, typeModel) {
            var startAt = 0;
            var where = '';
            var properties = [];
            var values = [];

            // se houver pesquisa rápida, monta o where
            if (controller.quickSearchText) {
                controller.disclaimers.forEach(function(tag) {
                    var index = tag.property.indexOf('quickSearchText');

                    if (index >= 0) {
                        controller.disclaimers.splice(controller.disclaimers.indexOf(tag), 1);
                    }
                });

                controller.addDisclaimer('quickSearchText', controller.quickSearchText, controller.quickSearchText);
            }

            if (typeModel == 1) {
                controller.removeQuickFilter();
                controller.addDisclaimer('cdnTipoModel1', 1, $rootScope.i18n('l-desc-order-model-type'));
            }

            if (typeModel == 2) {
                controller.removeQuickFilter();
                controller.addDisclaimer('cdnTipoModel2', 2, $rootScope.i18n('l-desc-quotation-model-type'));
            }

            where = '';

            controller.disclaimers.forEach(function(tag) {
                var index = tag.property.indexOf('quickSearchText');

                if (index >= 0) {
                    if (where == '') {
                        where = '(portal-model.idi-model = int("' + controller.quickSearchText + '") OR ' +
                        'portal-model.nom-model Matches string("*' + controller.quickSearchText + '*"))'
                    } else {
                        where = where + ' and (portal-model.idi-model = int("' + controller.quickSearchText + '") OR ' +
                        'portal-model.nom-model Matches string("*' + controller.quickSearchText + '*"))'
                    }    
                }

                var index = tag.property.indexOf('cdnTipoModel1');

                if (index >= 0) {
                    if(where == '') {
                        where = '(portal-model.cdn-tipo-model = 1)';
                    } else {
                        where = where + ' and (portal-model.cdn-tipo-model = 1)';
                    }
                }

                var index = tag.property.indexOf('cdnTipoModel2');

                if (index >= 0) {
                    if (where == '') {
                        where = '(portal-model.cdn-tipo-model = 2)';
                    } else {
                        where = where + ' and (portal-model.cdn-tipo-model = 2)';
                    }
                }
            });
                                    
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

            if (where) parameters.where = where;

            portalModelService.findRecords(startAt, parameters, function(result) {
                if (result) {
                    angular.forEach(result, function (value) {
                        
                        // se tiver o atributo $length e popula o totalRecords
                        if (value && value.$length) {
                            controller.totalRecords = value.$length;
                        }

                        //Monta as tags correspondentes
                        if (value['cdn-tipo-model'] == 1){
                            value.tag = 1;                           
                        } else if (value['cdn-tipo-model'] == 2){
                            value.tag = 2;
                        }

                        // adicionar o item na lista de resultado
                        controller.listResult.push(value);
                        // controller.idiTipConfig = value['_']['idi-tip-config'];                        
                    });                    
                }
            });
        }

        this.removeQuickFilter = function() {
            controller.disclaimers.forEach(function(value) {
                var index = value.property.indexOf('cdnTipoModel1');

                if (index >= 0) {
                    controller.disclaimers.splice(controller.disclaimers.indexOf(value), 1);
                }
            });

            controller.disclaimers.forEach(function(tag) {
                var index = tag.property.indexOf('cdnTipoModel2');

                if (index >= 0) {
                    controller.disclaimers.splice(controller.disclaimers.indexOf(tag), 1);
                }
            });
        }
        
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
                        portalModelService.deleteRecord(record['idi-seq'], record['idi-model'], function(result) {
                            if (result) {
                                var index = controller.listResult.indexOf(record);

                                if (index != -1) {
                                    controller.listResult.splice(index, 1);
                                    controller.totalRecords--;

                                    // notifica o usuario que o registro foi removido
                                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                        type: 'success', // tipo de notificação
                                        title: $rootScope.i18n('l-modelo'), // titulo da notificação
                                        // detalhe da notificação
                                        detail: $rootScope.i18n('l-modelo') + ': '
                                            + record['idi-model'] + ', ' +
                                            $rootScope.i18n('l-success-deleted') + '!'
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }

        this.openCopyModal = function() {
            var params = {};

			params = { idiTipConfig: controller.idiTipconfig, idPortalConfigur: controller.idPortalConfigur };

            var modalInstance = $modal.open({
                templateUrl: '/dts/mpd/html/portalmodel/portal-model.copy.html',
                controller: 'mpd.portalModelCopyController.Controller as controller',
                size: 'lg',
                resolve: {
                    modalParams: function() {
                        // passa o objeto com os dados da copia avançada para o modal
                        return params;
                    }
                }
            });

            modalInstance.result.then(function() {
			    controller.loadData(false);
			});
        };

        this.init = function(portalConfigur) {
            if (appViewService.startView($rootScope.i18n('l-portal-model') + ' - ' + $stateParams.idPortalConfigur, 'mpd.portal-model-list.Control', controller)) {
                // se é a abertura da tab, implementar aqui inicialização do controller
            }

            // realiza a busca de dados inicial
            this.loadData(false);

            // chama um ponto da EPC para customizar a inicialização da tela.
            customizationService.callEvent('mpd.portalmodel', 'initEvent', controller);
        }

        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { this.init(); }

        // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
        $scope.$on('scope:on-load-portal-configur-detail', function (event, portalConfigur) {
            controller.init(portalConfigur);
        });
    }

    portalModelDetailController.$inject = [
        '$rootScope',
        '$scope',
        '$stateParams',
        'totvs.app-main-view.Service',
        'mpd.portalmodel.Service', 'TOTVSEvent',
        '$location'
    ];
    function portalModelDetailController(
        $rootScope,
        $scope,
        $stateParams,
        appViewService,
        portalModelService,
        TOTVSEvent,
        $location
    ) {
        $scope.showAsTable = false;
 
        if ($stateParams.hasOwnProperty('showAsTable')) {
            $scope.showAsTable = $stateParams.showAsTable;
        }

        var controller = this;

        this.model = {}; // mantem o conteudo do registro em detalhamento
        this.father = $stateParams.idPortalConfigur;

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
                        portalModelService.deleteRecord(controller.model['idi-seq'], controller.model['idi-model'], function(result) {
                            if (result) {
                                // notifica o usuario que o registro foi removido
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type: 'success', // tipo de notificação
                                    title: $rootScope.i18n('l-modelo'), // titulo da notificação
                                    // detalhe da notificação
                                    detail: $rootScope.i18n('l-modelo') + ': '
                                        + controller.model['idi-model'] + ', ' +
                                        $rootScope.i18n('l-success-deleted') + '!'
                                });

                                $location.path('dts/mpd/portalmodel/' + controller.model['idi-seq'] + '/' + controller.model['idi-model']);
                            }
                        });
                    }
                }
            });
        }

        this.load = function(id) {
            this.model = {};

            // chama o servico para retornar o registro                        
            portalModelService.getRecord(this.father, id, function(portalModel) {
                if (portalModel) { // se houve retorno, carrega no model
                    controller.model = portalModel;
                    $rootScope.$broadcast('scope:on-load-portal-model-detail',portalModel)
                }              
            });
        }

        this.init = function() {
            if (appViewService.startView($rootScope.i18n('l-portal-model'), 'mpd.portal-model-detail.Control', controller)) {
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

        // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        });
    }    
 
    portalModelEditController.$inject = [
        '$rootScope',
        '$scope',
        '$stateParams',
        '$location',
        '$state',
        'totvs.app-main-view.Service', 
        'mpd.portalmodel.Service',
        'TOTVSEvent'
    ];
    function portalModelEditController(
        $rootScope,
        $scope,
        $stateParams,
        $location,
        $state,
        appViewService,
        portalModelService,
        TOTVSEvent
    ) {
        var controller = this;

        this.model = {}; // mantem o conteudo do registro em edição/inclusão
        this.father = $stateParams.idPortalConfigur;

        this.typeModel = [
            {cdnTipoModel: 1, descTipoModel: $rootScope.i18n('l-order-model-type')},
            {cdnTipoModel: 2, descTipoModel: $rootScope.i18n('l-quotation-model-type')},
        ];

        // metodo de leitura do regstro
        this.load = function(id) {
            this.model = {};

            // chama o servico para retornar o registro
            portalModelService.getRecord(this.father, id, function(result) {                
                // carrega no model
                controller.model = result;
            });
        }

        // metodo para salvar o registro
        this.save = function() {
            // verificar se o formulario tem dados invalidos
            if (this.isInvalidForm()) {
                return;
            }

            this.model['idi-seq'] = this.father;

            // se for a tela de edição, faz o update
            if ($state.is('dts/mpd/portalmodel.edit')) {
                portalModelService.updateRecord(this.model['idi-seq'],this.model['idi-model'], this.model, function(result) {
                    // se gravou o registro com sucesso
                    controller.onSaveUpdate(true, result);

                    $location.path('dts/mpd/portalmodel/detail/' + controller.model['idi-seq'] + '/' + controller.model['idi-model']);
                });
            } else {
                if(this.model['log-ativo']) {
                    this.model['log-ativo'] = true;
                } else {
                    this.model['log-ativo'] = false;
                }

                portalModelService.saveRecord(this.model, function(result) {
                    // se gravou o registro com sucesso
                    controller.onSaveUpdate(false, result);

                    $location.path('dts/mpd/portalmodel/' + controller.model['idi-seq'] + '/' + controller.model['idi-model']);
                });
            }            
        }

        // metodo para notificar o usuario da gravaçao do registro com sucesso
        this.onSaveUpdate = function(isUpdate, result) {
            if (result.$hasError == true) { return; }
            
            // redireciona a tela para a tela de detalhar
            controller.model = result;

            if (isUpdate) {
                controller.redirectToDetail();    
            } else {
                controller.redirectToInit();
            }

            // notifica o usuario que conseguiu salvar o registro
            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type: 'success',
                title: $rootScope.i18n('l-modelo'),
                detail: $rootScope.i18n('l-modelo') + ' ' +
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
                    // se confirmou, navega para a pagina anterior
                    if (isPositiveResult) {
                        $location.path('dts/mpd/portalmodel/detail/' + controller.model['idi-seq'] + '/' + controller.model['idi-model']);
                    }
                }
            });
        }

        // metodo para verificar se o formulario é invalido
        this.isInvalidForm = function() {
            var messages = [];
            var isInvalidForm = false;

            if (!this.model['nom-descr']) {
				isInvalidForm = true;
				messages.push('l-descricao');
			}

            if (!this.model['nom-model']) {
				isInvalidForm = true;
				messages.push('l-nom-model');
			}

            // se for invalido, monta e mostra a mensagem
            if (isInvalidForm) {
                var warning = $rootScope.i18n('l-field');

                if (messages.length > 1) {
                    warning = $rootScope.i18n('l-fields');
                }

                angular.forEach(messages, function(item) {
                    if(item == messages[(messages.length - 1)]) {
                        warning = warning + ' ' + "<b>" + $rootScope.i18n(item) + "</b>";
                    } else {
                        warning = warning + ' ' + "<b>" + $rootScope.i18n(item) + "</b>" + ',';
                    }
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
            $location.path('dts/mpd/portalmodel/detail/' + this.model['idi-seq'] + '/' + this.model['idi-model']);
        }

        // redireciona para a tela inicial
        this.redirectToInit = function() {
            $location.path('dts/mpd/portalmodel/' + this.model['idi-seq']);
        }

        this.init = function() {
            if (appViewService.startView($rootScope.i18n('l-portal-model'), 'mpd.portal-model-edit.Control', controller)) {
                // se é a abertura da tab, implementar aqui inicialização do controller
            }

            // se houver parametros na URL
            if ($stateParams && $stateParams.id != 0) {
                // realiza a busca de dados inicial
                this.load($stateParams.id);
            } else { // se não, incica com o model em branco (inclusão)
                this.model = {};
                controller.model['cdn-tipo-model'] = 1;
            }

            // atributo auxiliar para determinar se é uma edição, desabilitando o campo chave
            this.idDisabled = $state.is('dts/mpd/portalmodel.edit');

            if (this.idDisabled) {
                this.title = $rootScope.i18n('l-editar');
            } else {
                this.title = $rootScope.i18n('l-novo-registro');
            }
        }

        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { this.init(); }

        // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        });
    }

    portalModelSearchController.$inject = ['$modalInstance'];
    function portalModelSearchController ($modalInstance) {
        this.search = function () {
            $modalInstance.close();
        }
         
        this.close = function () {
            // dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
            $modalInstance.dismiss();
        }
    }

    portalModelCopyController.$inject = ['modalParams', '$modalInstance', 'mpd.fchdis0028.FactoryApi'];
    function portalModelCopyController (modalParams, $modalInstance, portalModelFactoryApi) {
        var controller = this;

        this.portalModelFilter = null;
        this.idDisabledBtnCopy = true;        
        this.myParams = angular.copy(modalParams);
		
		this.changeZoomConfigClienRep = function(idPortalConfigur) {
            controller.idiModel = "";

            if (controller.idPortalConfigur > 0 && controller.idiModel > 0)
                controller.idDisabledBtnCopy = false;
            else
                controller.idDisabledBtnCopy = true;
        }

        this.changeZoomPortalModel = function() {            
            if (controller.idPortalConfigur > 0 && controller.idiModel > 0) {
                controller.idDisabledBtnCopy = false;
            } else {
                controller.idDisabledBtnCopy = true;
            }
        }

        this.confirm = function () {
            portalModelFactoryApi.postPortalModelCopy({
                idiPortalConfigurCopy: controller.idPortalConfigur,
                idiPortalConfigurNew: controller.myParams.idPortalConfigur,
                idiModel: controller.idiModel
            }, function(result) {
                $modalInstance.close();
            });
        }

        this.close = function () {
            // dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
            $modalInstance.dismiss();
        }
    }
 
    // registrar os controllers no angular 
    index.register.controller('mpd.portal-model-list.Control', portalModelListController);
    index.register.controller('mpd.portal-model-edit.Control', portalModelEditController);
    index.register.controller('mpd.portal-model-detail.Control', portalModelDetailController);
    index.register.controller('mpd.portal-model-search.Control', portalModelSearchController);
    index.register.controller('mpd.portalModelCopyController.Controller', portalModelCopyController); 
});
