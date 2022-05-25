define([
    'index', // index sempre deve ser injetado para permitir o registro dos controllers.
    '/dts/mpd/js/api/fchdis0028.js',
    '/dts/mpd/js/api/fchdis0013api.js',
    '/dts/mpd/js/zoom/portal-configur-clien.js',
    'less!/dts/mpd/assets/css/configportal.less',
    'ng-load!angular-nestable'
], function(index) { 	    
    portalCamposEditController.$inject = [
        '$rootScope',
        '$scope',
        '$stateParams',
        '$modal',
        '$nestable',
        'totvs.app-main-view.Service',
        'mpd.fchdis0028.FactoryApi',
        'mpd.paramportal.Factory',
        'TOTVSEvent'
    ];
    function portalCamposEditController(
        $rootScope,
        $scope,
        $stateParams,
        $modal,
        $nestable,
        appViewService,
        portalCamposFactoryApi,
        paramPortalFactory,
        TOTVSEvent
    ) {
        var controller = this;
        
        // mantem o conteudo do registro em edição/inclusão
        this.model = {};
        this.father = $stateParams.idPortalConfigur;
        this.listFields = [];
        
        /*
         * 1 - Pedidos
         * 2 - Cotação
         */
        this.visibleTab = null;
        controller.enableQuotations = false;
        controller.perfilEnableQuotations = false;
		controller.perfilEnableSales2 = false;
        controller.selectTable = '';

        $nestable.defaultOptions = { maxDepth: 1 };
        
        this.tooltip = "<img src='/dts/mpd/assets/image/ped-venda-resumo.jpg'>";
        this.help    = "<ul style='padding-left: 15px'>" +
                            "<li>" + $rootScope.i18n('l-campos-mostrar-help') + "</li>" +
                            "<li>" + $rootScope.i18n('l-campos-esconder-help') + "</li>" +
                            "<li>" + $rootScope.i18n('l-campos-nao-def1-help') + "<br/>" + $rootScope.i18n('l-campos-nao-def2-help') + "</li>" +
                       "</ul>";

        // metodo de leitura do regstro
        this.load = function(id) {
            this.model = {};
            this.listFields = [];
            this.visibleTab = 1;
            this.loadConfigurations();
        }

        this.selectTab = function(tabId) {
            this.visibleTab = tabId;
            this.listFields = [];
            this.loadTables();
        }

        this.loadConfigurations = function() {
            this.tag = $stateParams.tag;

            portalCamposFactoryApi.getParametersClientRepConfigurations({idiSeq: $stateParams.idPortalConfigur}, function(result) {
                controller.perfilEnableQuotations = result['log-habilita-cotac'];
				controller.perfilEnableSales2 = result['log-novo-portal'];
				controller.loadTables();
            });

            paramPortalFactory.getRecordParam({}, function(result) {
                angular.forEach(result, function(value) {
                    if (value['cod-param'] === 'portal-cotacao-nivel-geral') {
                        controller.enableQuotations = value['cod-val-param'] == 'no' ? false : true;
                    }
                });
            });
        }

        this.loadTables = function() {
			var sales2 = "";
			var tabSelected = this.visibleTab;
            var param = { idiSeq: $stateParams.idPortalConfigur, idiTip: this.visibleTab };
			
            portalCamposFactoryApi.getTables(param, function(result) {
				controller.tables = result;

				if (controller.perfilEnableSales2 && tabSelected === 1) {
					sales2 = "2"
				}
                angular.forEach(controller.tables, function (value) {					
					if (value.c_table === 'pesquisa' && tabSelected === 2){						
						value.image = "<div> <img class='img-max' src='/dts/mpd/assets/image/cotac-pesquisa.jpg'> </div>";
					} else {
						value.image = "<div> <img class='img-max' src='/dts/mpd/assets/image/" + value.c_table + sales2 + ".jpg'> </div>";
					}
                });  
            });
        }

        this.clickListButton = function(table,isQuotation) {
            controller.showAllFields = false;

            angular.forEach(controller.tables, function (value) {
                value.$selected = false;

                if (value.c_table == table){
                    controller.selectTable = value.c_table;
                    value.$selected = true;
                }
            });

            portalCamposFactoryApi.getFields({ idiSeq: $stateParams.idPortalConfigur, table: table, isQuotation: isQuotation }, function(result) {
                controller.fields = result;
                controller.listFields = [];
                controller.allStartChecked = true;

                angular.forEach(result, function(value) {
                    if (value['i-visible'] != 1) {
                        controller.allStartChecked = false;
                    }

                    if (value['c-label'].indexOf("*") != -1) {
                        value['c-label'] = value['c-label'].replace('*', '');
                        value.obrigatorio = true;
                    }

                    controller.listFields.push({ item: value });
                });

                controller.showAllFields = controller.allStartChecked;
            });
        }

        // Necessario para nao disparar o evento de drag'n'drop ao tentar alterar o valor do switch.
        this.onMousedown = function(event) {
            event.stopPropagation();
        };

        this.save = function() {
            var icont = 0;
            var table = "";

            ttFields = [];

            // Verificar se o formulario tem dados invalidos.
            if (this.isInvalidForm()) {
                return;
            }
            
            for (var i = 0; i < controller.listFields.length; i++) {
                icont ++;
                controller.listFields[i].item['i-index'] = icont;
                controller.listFields[i].item['c-table'] = controller.selectTable;
                ttFields.push(controller.listFields[i].item);
                table = controller.selectTable;
            }

            portalCamposFactoryApi.postFields({ idiSeq: $stateParams.idPortalConfigur }, ttFields, function(result) {
                /**
                 * Inserido a validacao (table != "") para tratar o erro de quando
                 * o usuario nao seleciona uma aba e aperta em 'Salvar'.
                 */
                if (table != "") {
                    if (controller.visibleTab == 1) {
                        controller.clickListButton(table, false);
                    } else if (controller.visibleTab == 2) {
                        controller.clickListButton(table, true);
                    }
                }
                    // Notifica o usuario que conseguiu salvar o registro.
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success',
                        title: $rootScope.i18n('l-portal-campos'),
                        detail: $rootScope.i18n('l-portal-campos') 
                            + ' '
                            + $rootScope.i18n('l-success-created')
                            + '!'
                    });
                }
            );
        }       

        this.cancel = function() {
            // Solicita que o usuario confirme o cancelamento da edição/inclusão.
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question',
                text: $rootScope.i18n('l-cancel-operation'),
                cancelLabel: 'l-no',
                confirmLabel: 'l-yes',
                callback: function(isPositiveResult) {
                    if (isPositiveResult) { // se confirmou, navega para a pagina anterior
                        var pageActive = appViewService.getPageActive();
                        appViewService.removeView(pageActive);
                    }
                }
            });
        }

        this.isInvalidForm = function() {
            var messages = [];
            var isInvalidForm = false;

            // Se for invalido, monta e mostra a mensagem.
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

		this.setQuickAllFields = function() {
			var i = 0;

			for (i = 0; i < controller.listFields.length; i++) {

				if (controller.showAllFields) {
					controller.listFields[i]['i-visible'] = 1;
					controller.listFields[i].item['i-visible'] = 1;
				} else {
					controller.listFields[i]['i-visible'] = 0;
					controller.listFields[i].item['i-visible'] = 0;
				}
			}
        }

        this.openCopyModal = function() {
            var params = {};
			
			params = { idiTipConfig: $stateParams.idTipconfig, idPortalConfigur: $stateParams.idPortalConfigur, listTables: controller.tables };
            
            var modalInstance = $modal.open({
                templateUrl: '/dts/mpd/html/portalcampos/portal-campos.copy.html',
                controller: 'mpd.portal-campos-copy.Controller as controller',
                size: 'lg',
                resolve: {
                    modalParams: function() {
                        // Passa o objeto com os dados da copia avançada para o modal.
                        return params;
                    }
                }
            });

            modalInstance.result.then(function() {
			    controller.load($stateParams.idPortalConfigur);
			});
        };

        this.init = function() {
            if (appViewService.startView($rootScope.i18n('l-portal-campos'), 'mpd.portal-campos-edit.Control', controller)) {
                // se é a abertura da tab, implementar aqui inicialização do controller            
            }

            this.load();
        }

        // Se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { this.init(); }

        // Cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function() {
            controller.init();
        });    
    }

    portalCamposCopyController.$inject = ['modalParams', '$modalInstance', 'mpd.fchdis0028.FactoryApi'];
    function portalCamposCopyController(modalParams, $modalInstance, portalCamposFactoryApi) {
        var controller = this;

        this.idDisabledBtnCopy = true;

        controller.tables = [];

        this.myParams = angular.copy(modalParams);

        angular.forEach(this.myParams.listTables, function(key) {
            controller.tables.push({ ctable: key.c_table, clabel: key.c_label, lchecked: true });
        });

        this.changeZoomConfigClienRep = function(idPortalConfigur) {
            if (controller.idPortalConfigur > 0)
                controller.idDisabledBtnCopy = false;
            else
                controller.idDisabledBtnCopy = true;
        }

        // Ação de pesquisar.
        this.confirm = function() {
            portalCamposFactoryApi.postPortalCamposCopy({
                idiPortalConfigurCopy: controller.idPortalConfigur, 
                idiPortalConfigurNew: controller.myParams.idPortalConfigur
            }, controller.tables, function(result) {
                // Close é o fechamento positivo.
                $modalInstance.close();
            });
        }

        // Ação de fechar.
        this.close = function() {
            // Dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC).
            $modalInstance.dismiss();
        }
    }

    // Registrar os controllers no angular.
    index.register.controller('mpd.portal-campos-edit.Control', portalCamposEditController);    
    index.register.controller('mpd.portal-campos-copy.Controller', portalCamposCopyController);
});
