define(['index', // index sempre deve ser injetado para permitir o registro dos controllers.
         // totvs-custom alem das tags de customização de tela, tambem comtêm os serviços de customização
        '/dts/mpd/js/dbo/bodi00706.js',        
        '/dts/mpd/js/zoom/cliente.js', //zoom de emitente
        '/dts/mpd/js/zoom/grupo-cliente.js', //zoom de grupo de cliente
        '/dts/mpd/js/zoom/repres.js', //zoom de representante
		'/dts/mpd/js/api/fchdis0013api.js'
       ], function(index) {
        
    /*********** definição do controller portalConfigurListController ***********/
    portalConfigurListController.$inject = ['$rootScope',
                                            '$scope',
                                            '$modal',
                                            'totvs.app-main-view.Service',
                                            'customization.generic.Factory',
                                            'mpd.portalconfigpdp.Service',
                                            '$stateParams', 'TOTVSEvent'];
    function portalConfigurListController($rootScope, $scope, $modal, appViewService, customizationService, portalConfigurService, $stateParams, TOTVSEvent) {
        
        var controller = this;

        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************

        this.listResult = [];       // array que mantem a lista de registros
        this.totalRecords = 0;      // atributo que mantem a contagem de registros da pesquisa
        this.disclaimers = [];      // array que mantem a lista de filtros aplicados
        this.advancedSearch = {};    // objeto para manter as informações do filtro avançado
        
        // *********************************************************************************
        // *** Methods
        // *********************************************************************************
        
        // abertura da tela de pesquisa avançada
        this.openAdvancedSearch = function() {
            var modalInstance = $modal.open({
              templateUrl: '/dts/mpd/html/portalconfigpdp/portal-config-clien-rep.search.html',
              controller: 'mpd.portal-config-clien-rep-search.Control as controller',
              size: 'lg',
              resolve: {
                model: function () {
                  // passa o objeto com os dados da pesquisa avançada para o modal
                  return controller.advancedSearch;
                }
              }
            });
            // quando o usuario clicar em pesquisar:
            modalInstance.result.then(function () {
                // cria os disclaimers
                controller.addDisclaimers();
                // e chama o busca dos dados
                controller.loadData();
            });
        }
        // metodo para adicionar os disclaimers relativos a tela de pesquisa avançada
        this.addDisclaimers = function() {
            // reinicia os disclaimers
            controller.disclaimers = [];
            // para a faixa de codigos, tem que tratar e colocar em apenas um disclaimer
            if (controller.advancedSearch.codClienIni || controller.advancedSearch.codClienFin) {
                var faixa = '0', deate = ' ' + $rootScope.i18n('l-from-start');                 
                if (controller.advancedSearch.codClienIni)  {
                    faixa = controller.advancedSearch.codClienIni;
                    deate = controller.advancedSearch.codClienIni;
                }
                if (controller.advancedSearch.codClienFin) {
                    faixa = faixa + ';' + controller.advancedSearch.codClienFin;
                    deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + controller.advancedSearch.codClienFin;
                } else {
                    faixa = faixa + ';9999999';
                    deate = deate + ' ' + $rootScope.i18n('l-to-end');
                }
                // adicionar o disclaimer para o campo cod-mensagem, para faixa o value é "inicio;final"
                controller.addDisclaimer('cdn-clien', faixa, $rootScope.i18n('l-customer') + deate);
            }
            if (controller.advancedSearch.codGrpClienIni || controller.advancedSearch.codGrpClienFin) {
                var faixa = '0', deate = ' ' + $rootScope.i18n('l-from-start');                 
                if (controller.advancedSearch.codGrpClienIni)  {
                    faixa = controller.advancedSearch.codGrpClienIni;
                    deate = controller.advancedSearch.codGrpClienIni;
                }
                if (controller.advancedSearch.codGrpClienFin) {
                    faixa = faixa + ';' + controller.advancedSearch.codGrpClienFin;
                    deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + controller.advancedSearch.codGrpClienFin;
                } else {
                    faixa = faixa + ';9999999';
                    deate = deate + ' ' + $rootScope.i18n('l-to-end');
                }
                // adicionar o disclaimer para o campo cod-mensagem, para faixa o value é "inicio;final"
                controller.addDisclaimer('cdn-grp-clien', faixa, $rootScope.i18n('l-grp-clien') + deate);
            }
            if (controller.advancedSearch.codRepresIni || controller.advancedSearch.codRepresFin) {
                var faixa = '0', deate = ' ' + $rootScope.i18n('l-from-start');                 
                if (controller.advancedSearch.codRepresIni)  {
                    faixa = controller.advancedSearch.codRepresIni;
                    deate = controller.advancedSearch.codRepresIni;
                }
                if (controller.advancedSearch.codRepresFin) {
                    faixa = faixa + ';' + controller.advancedSearch.codRepresFin;
                    deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + controller.advancedSearch.codRepresFin;
                } else {
                    faixa = faixa + ';9999999';
                    deate = deate + ' ' + $rootScope.i18n('l-to-end');
                }
                // adicionar o disclaimer para o campo cod-mensagem, para faixa o value é "inicio;final"
                controller.addDisclaimer('cdn-repres', faixa, $rootScope.i18n('l-representative') + deate);
            }
        }
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
            if (disclaimer.property == 'cdn-clien') {
                controller.advancedSearch.codClienIni = '';
                controller.advancedSearch.codClienFin = '';
            }
            if (disclaimer.property == 'cdn-grp-clien') {
                controller.advancedSearch.codGrpClienIni = '';
                controller.advancedSearch.codGrpClienFin = '';
            }
            if (disclaimer.property == 'cdn-repres') {
                controller.advancedSearch.codRepresIni = '';
                controller.advancedSearch.codRepresFin = '';
            }
            // recarrega os dados quando remove um disclaimer
            controller.loadData();
        }

        // metodo de leitura dos dados
        this.loadData = function(isMore, quickFilter) {
            // valores default para o inicio e pesquisa
            var startAt = 0;
            var where = '';
            var criteria = '';
            
            //se houver pesquisa rápida, monta o where
            if (controller.quickSearchText){
                where = '(portal-configur-clien.cdn-clien = int(' + controller.quickSearchText + ') OR ' +
                        'portal-configur-clien.cdn-grp-clien = int(' + controller.quickSearchText + ') OR ' +
                        'portal-configur-clien.cdn-repres = int(' + controller.quickSearchText + '))'
                controller.disclaimers = [];
                //controller.addDisclaimers();
                controller.addDisclaimer(null, null, controller.quickSearchText);
            }
            
            //Pesquisa Rápida com tags
            if (quickFilter == 'CLIENTE') {
                criteria = 'portal-configur-clien.cdn-clien > int(0)';
                controller.disclaimers = [];
                controller.addDisclaimers();
                controller.addDisclaimer('cdn-clien', '1;999999999', $rootScope.i18n('l-customer'));
            } else if (quickFilter == 'GRUPCLIENTE'){
                criteria = 'portal-configur-clien.cdn-grp-clien > int(0)';
                controller.disclaimers = [];
                controller.addDisclaimers();
                controller.addDisclaimer('cdn-grp-clien', '1;99', $rootScope.i18n('l-grp-clien'));
            } else if (quickFilter == 'REPRESENTANTE') {
                criteria = 'portal-configur-clien.cdn-repres > int(0)';
                controller.disclaimers = [];
                controller.addDisclaimers();
                controller.addDisclaimer('cdn-repres', '1;99999', $rootScope.i18n('l-representative'));
            } else if (quickFilter == 'CONFGERAIS'){
                criteria = 'portal-configur-clien.idi-clien-repres > int(0)';
                controller.disclaimers = [];
                controller.addDisclaimers();
                controller.addDisclaimer('all', 'all', $rootScope.i18n('l-conf-gerais')); 
            }
            
            // se não é busca de mais dados, inicializa o array de resultado
            if (!isMore) {
                controller.listResult = [];
            }
            // calcula o registro inicial da busca
            startAt = controller.listResult.length;

            // monta a lista de propriedades e valores a partir dos disclaimers
            var properties = ['log-livre-2'];
            var values = ['false'];

            angular.forEach(controller.disclaimers, function (filter) {
                if (filter.property) {
                    if(filter.property == 'all') {
                        where = 'portal-configur-clien.idi-clien-repres > int(0) AND portal-configur-clien.idi-clien-repres > int(0)';
                    } else {
                        properties.push(filter.property);
                        values.push(filter.value);
                    }
                }
            });
            // monta os parametros para o service
            var parameters = {
                property: properties,
                value: values,
            };

            if (where)
                parameters.where = where;
                        
            if (parameters.where && criteria)
                parameters.where = parameters.where + " AND " + criteria;
            else if (criteria)
                parameters.where = criteria;
                
            // chama o findRecords
            portalConfigurService.findRecords(startAt, parameters, function(result) {
                var icont = 0;
                // se tem result
                if (result) {
                    
                    // para cada item do result
                    angular.forEach(result, function (value) {
                                                
                        // se tiver o atributo $length e popula o totalRecords
                        if (value && value.$length) {
                            controller.totalRecords = value.$length;                            
                        }                         

                        //Monta os titulos da lista e as tags correspondentes
                        if (value['cdn-clien'] > 0){
                            value.tag = 1;
                            value.titleList = value['cdn-clien'] + ' - ' + value['_']['desc-clien'];                            
                            value.idiTipconfig = 1;
                        } else if (value['cdn-grp-clien'] > 0){
                            value.tag = 2;
                            value.titleList = value['cdn-grp-clien'] + ' - ' + value['_']['desc-grp-clien'];                            
                            value.idiTipconfig = 1;
                        } else if (value['cdn-repres'] > 0) {
                            value.tag = 3;
                            value.titleList = value['cdn-repres'] + ' - ' + value['_']['desc-repres'];
                            value.idiTipconfig = 2;                            
                        } else {
                            value.tag = 4;
                            if (value['idi-clien-repres'] === 1){
                                value.titleList = $rootScope.i18n('l-todos-clientes');                                
                                value.idiTipconfig = 1;
                            } else {
                                value.titleList = $rootScope.i18n('l-todos-repres');
                                value.idiTipconfig = 2;                                
                            }
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
                title: 'l-question', // titulo da mensagem
                text: $rootScope.i18n('l-confirm-delete-operation'), // texto da mensagem
                cancelLabel: 'l-no', // label do botão cancelar
                confirmLabel: 'l-yes', // label do botão confirmar
                callback: function(isPositiveResult) { // função de retorno
                    if (isPositiveResult) { // se foi clicado o botão confirmar

                        // chama o metodo de remover registro do service
                        portalConfigurService.deleteRecord(record['idi-seq'], function(result) {
                            if (result) {

                                // remove o item da lista
                                var index = controller.listResult.indexOf(record);

                                if (index != -1) {

                                    controller.listResult.splice(index, 1);

                                    controller.totalRecords--;

                                    // notifica o usuario que o registro foi removido
                                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                        type: 'success', // tipo de notificação
                                        title: $rootScope.i18n('l-portal-config-clien-rep'), // titulo da notificação
                                        // detalhe da notificação
                                        detail: $rootScope.i18n('l-portal-config-clien-rep') + ': '
                                            + record['idi-seq'] + ', ' +
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
            if (appViewService.startView($rootScope.i18n('l-portal-config-clien-rep'), 'mpd.portal-config-clien-rep-list.Control', controller)) {
                // se é a abertura da tab, implementar aqui inicialização do controller
            }
            // realiza a busca de dados inicial
            this.loadData(false);            
            // chama um ponto da EPC para customizar a inicialização da tela.
            customizationService.callEvent('mpd.portalconfigpdp', 'initEvent', controller);
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
     
    // **************************************************************************************
	// *** CONTROLLER - DETAIL
	// **************************************************************************************
	    
    portalConfigurDetailController.$inject = ['$rootScope', 
                                              '$scope', 
                                              '$stateParams', 
                                              '$state',
                                              'totvs.app-main-view.Service', 
                                              'mpd.portalconfigpdp.Service', 'TOTVSEvent'];
    function portalConfigurDetailController($rootScope, $scope, $stateParams, $state,
                                            appViewService, portalConfigurService, TOTVSEvent) {
        var controller = this;

        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************
        this.model = {}; // mantem o conteudo do registro em detalhamento
        
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
                        portalConfigurService.deleteRecord(controller.model ['idi-seq'], function(result) {
                            if (result) {
                                // notifica o usuario que o registro foi removido
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type: 'success', // tipo de notificação
                                    title: $rootScope.i18n('l-portal-config-clien-rep'), // titulo da notificação
                                    // detalhe da notificação
                                    detail: $rootScope.i18n('l-portal-config-clien-rep') + ': '
                                        + controller.model['idi-seq'] + ', ' +
                                        $rootScope.i18n('l-success-deleted') + '!'
                                });
                                // muda o state da tela para o state inicial, que é a lista
                                $state.go('dts/mpd/portalconfigpdp.start');
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
            portalConfigurService.getRecord(id, function(portalConfigur) {
                if (portalConfigur) { // se houve retorno, carrega no model
                    controller.model = portalConfigur;                    
                    $rootScope.$broadcast('scope:on-load-portal-configur-detail',portalConfigur)
                }              
            });
        }

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        this.init = function() {

            if (appViewService.startView($rootScope.i18n('l-portal-config-clien-rep'), 'mpd.portal-config-clien-rep-detail.Control', controller)) {             
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
	    
    portalConfigurEditController.$inject = ['$rootScope',
                                            '$scope',
                                            '$stateParams',
                                            '$window',
                                            '$location',
                                            '$state',
                                            'totvs.app-main-view.Service', 
                                            'mpd.portalconfigpdp.Service',
											'mpd.paramportal.Factory',
											'TOTVSEvent'];
    function portalConfigurEditController($rootScope, $scope, $stateParams, $window, $location, $state,
                                          appViewService, portalConfigurService, paramPortalFactory, TOTVSEvent) {
        var controller = this;
        
        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************

        this.model = {}; // mantem o conteudo do registro em edição/inclusão

		//atributos para habilitar/desabilitar os campos em tela
        this.idDisabledLogLivre1 = true; //o campo de Itens do Cliente sempre inicia desabilitado
        this.idDisabledLogLivre3 = true; //o campo de Itens do Cliente sempre inicia desabilitado
        this.idDisabledLogLivre4 = true;
        this.idDisabledIdiClienRepres = false; // o campo Tipo de Configuração sempre inicia habilitado
		this.idVisibleIdiClienRepres = true; // o campo Tipo de Configuração sempre visível
		this.enableQuotation = true;
		this.enableSalesChannel = true;
		        
        // *********************************************************************************
        // *** Methods
        // *********************************************************************************

        // Método de leitura do regstro
        this.load = function(id) {
            this.model = {};
            controller.enableCotacConfiguration = false;
			this.idDisabledLogCanalVendasRepres = false;
            // Chama o servico para retornar o registro
            portalConfigurService.getRecord(id, function(result) {
                
                // Carrega no model
                controller.model = result;

                // Se possuir valor no campo de representante habilita ou a confiração é para todos os representantes, habilita a opção
				// Itens do Cliente/Grupo de Cliente para Representante e a Completa automaticamente Pedidos liberados por Representantes
                
                if (controller.model['cdn-repres'] > 0 ||
               		controller.model['idi-clien-repres'] == 2) {
                    controller.idDisabledLogLivre1 = false;  
                    controller.idDisabledLogLivre3 = false;
                    controller.idDisabledLogLivre4 = false;
                    controller.enableCotacConfiguration = true;
					controller.idDisabledLogCanalVendasRepres = true;
                } else {
                    controller.idDisabledLogLivre1 = true;
                    controller.idDisabledLogLivre3 = true;
                    controller.idDisabledLogLivre4 = true;
                    controller.enableCotacConfiguration = false;
					controller.idDisabledLogCanalVendasRepres = false;
                }

				// Se os algum dos campos de Cliente, Grupo de Cliente e Representante desabilita o campo Tipo de Configuração
                if (controller.model['cdn-clien'] != 0 ||
                    controller.model['cdn-grp-clien'] != 0 ||
                    controller.model['cdn-repres'] != 0){
                    controller.idDisabledIdiClienRepres = true;
                } else {
                    controller.idDisabledIdiClienRepres = false;
                }		

				if ($state.is('dts/mpd/portalconfigpdp.edit')) {
					 controller.idDisabledIdiClienRepres = true;
					 controller.idVisibleIdiClienRepres = false;
				}					
            });
			
			paramPortalFactory.getRecordParam({}, function(result) {
				angular.forEach(result, function(value) {
					switch (value['cod-param']) {
						case 'portal-cotacao-nivel-geral':
                            controller.enableQuotation = value['cod-val-param'] == 'no' ? false : true;
                            break;
						case 'portal-canal-vendas-repres':
							controller.enableSalesChannel = value['cod-val-param'] == 'no' ? false : true;
							break;
					}
				})
			});
        }

        // metodo para salvar o registro
        this.save = function() {
            // verificar se o formulario tem dados invalidos
            if (this.isInvalidForm()) {
                return;
            }
            
            if (this.model['cdn-clien'] != '' && this.model['cdn-clien'] != null && this.model['cdn-clien'] != undefined){
                this.model['cdn-grp-clien'] = "-1";
                this.model['cdn-repres'] = "-1";
            } else if (this.model['cdn-grp-clien'] != '' && this.model['cdn-grp-clien'] != null && this.model['cdn-grp-clien'] != undefined){
                this.model['cdn-clien'] = "-1";
                this.model['cdn-repres'] = "-1";
            } else if (this.model['cdn-repres'] != '' && this.model['cdn-repres'] != null && this.model['cdn-repres'] != undefined){
                this.model['cdn-clien'] = "-1";
                this.model['cdn-grp-clien'] = "-1";
            }
			
			if (this.model['idi-clien-repres'] > 0) {
				this.model['cdn-grp-clien'] = "-1";
                this.model['cdn-repres'] = "-1";
				this.model['cdn-clien'] = "-1";
			}		

            // se for a tela de edição, faz o update
            if ($state.is('dts/mpd/portalconfigpdp.edit')) {                
                portalConfigurService.updateRecord(this.model['idi-seq'], this.model, function(result) {
                    // se gravou o registro com sucesso
                    controller.onSaveUpdate(true, result);
                });
            } else { // senão faz o create                
                portalConfigurService.saveRecord(this.model, function(result) {
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
                title: $rootScope.i18n('l-portal-config-clien-rep'),
                detail: $rootScope.i18n('l-portal-config-clien-rep') + ' ' +
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
            $location.path('dts/mpd/portalconfigpdp/detail/' + this.model['idi-seq'] + '/0');
        }
        // redireciona para a tela inicial
        this.redirectToInit = function() {
            $location.path('dts/mpd/portalconfigpdp/');
        }
        
        if (!$state.is('dts/mpd/portalconfigpdp.edit')) { //esta no modo de incluir*/
            
            this.onChange = function(value){
                
                if (value == "emitente" && this.model['cdn-clien'] != "" && this.model['cdn-clien'] != null && this.model['cdn-clien'] != undefined){
                    this.model['cdn-grp-clien'] = undefined;
                    this.model['cdn-repres'] = undefined;
                    this.model['log-livre-1'] = false;
                    this.model['idi-clien-repres'] = 0;
                    this.idDisabledLogLivre1 = true;
                    this.idDisabledLogLivre3 = true;
                    this.idDisabledLogLivre4 = true;
                    this.idDisabledIdiClienRepres = true;
                    this.enableCotacConfiguration = false;
					this.idDisabledLogCanalVendasRepres = false;
                } else  if (value == "gr-cli" && this.model['cdn-grp-clien'] != "" && this.model['cdn-grp-clien'] != null && this.model['cdn-grp-clien'] != undefined){
                    this.model['cdn-clien'] = undefined;
                    this.model['cdn-repres'] = undefined ;                    
                    this.model['log-livre-1'] = false;
                    this.model['idi-clien-repres'] = 0;
                    this.idDisabledLogLivre1 = true;
                    this.idDisabledLogLivre3 = true;
                    this.idDisabledLogLivre4 = true;
                    this.idDisabledIdiClienRepres = true;
                    this.enableCotacConfiguration = false;
					this.idDisabledLogCanalVendasRepres = false;
                } else  if (value == "repres" && this.model['cdn-repres'] != "" && this.model['cdn-repres'] != null && this.model['cdn-repres'] != undefined){
                    this.model['cdn-clien'] = undefined;
                    this.model['cdn-grp-clien'] = undefined;
                    this.model['idi-clien-repres'] = 0;
                    this.idDisabledLogLivre1 = false;
                    this.idDisabledLogLivre3 = false;
                    this.idDisabledLogLivre4 = false;
                    this.idDisabledIdiClienRepres = true;
                    this.enableCotacConfiguration = true;
					this.idDisabledLogCanalVendasRepres = true;
                }
                
				if (  (this.model['cdn-clien'] == '' || this.model['cdn-clien'] == null || this.model['cdn-clien'] == undefined)
                   && (this.model['cdn-grp-clien'] == '' || this.model['cdn-grp-clien'] == null || this.model['cdn-grp-clien'] == undefined)
                   && (this.model['cdn-repres'] == '' || this.model['cdn-repres'] == null || this.model['cdn-repres'] == undefined)){
					   
					if (this.model['idi-clien-repres'] == 2) {
						this.idDisabledLogLivre1 = false;
                        this.idDisabledLogLivre3 = false;
                        this.idDisabledLogLivre4 = false;
                        this.enableCotacConfiguration = true;
						this.idDisabledLogCanalVendasRepres = true;
					} else {
						this.idDisabledLogLivre1 = true;
                        this.idDisabledLogLivre3 = true;
                        this.idDisabledLogLivre4 = true;
                        this.enableCotacConfiguration = false;
						this.idDisabledLogCanalVendasRepres = false;
					}
					this.idDisabledIdiClienRepres = false;
				}
            }
        }
        
        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        this.init = function() {

            if (appViewService.startView($rootScope.i18n('l-portal-config-clien-rep'), 'mpd.portal-config-clien-rep-edit.Control', controller)) {
                // se é a abertura da tab, implementar aqui inicialização do controller            
            }

            // se houver parametros na URL
            if ($stateParams && $stateParams.id) {
                // realiza a busca de dados inicial
                this.load($stateParams.id);
            } else { // se não, incica com o model em branco (inclusão)
                this.model = {};						
                this.idDisabledLogLivre1 = true;
                this.idDisabledLogLivre3 = true;
                this.idDisabledLogLivre4 = true;
                this.idDisabledIdiClienRepres = false;
                this.idVisibleIdiClienRepres = true;
				this.idDisabledLogCanalVendasRepres = true;
            }
            
            // atributo auxiliar para determinar se é uma edição, desabilitando o campo chave        
            this.idDisabled = $state.is('dts/mpd/portalconfigpdp.edit');

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
 
    // **************************************************************************************
	// *** CONTROLLER - Search
	// **************************************************************************************
	      
    portalConfigurSearchController.$inject = ['$modalInstance', 'model'];
    function portalConfigurSearchController ($modalInstance, model) {
         
        // recebe os dados de pesquisa atuais e coloca no controller
        this.advancedSearch = model;
         
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
    index.register.controller('mpd.portal-config-clien-rep-list.Control', portalConfigurListController);
    index.register.controller('mpd.portal-config-clien-rep-edit.Control', portalConfigurEditController);
    index.register.controller('mpd.portal-config-clien-rep-detail.Control', portalConfigurDetailController);
    index.register.controller('mpd.portal-config-clien-rep-search.Control', portalConfigurSearchController);    
});