define(['index', // index sempre deve ser injetado para permitir o registro dos controllers.
         // totvs-custom alem das tags de customização de tela, tambem comtêm os serviços de customização
        '/dts/mpd/js/dbo/bodi574.js', // os controllers dependem dos serviços registrados.
        '/dts/men/js/zoom/item.js'
       ], function(index) {

    crossSellingListController.$inject = ['$rootScope',
                                            '$scope',
                                            '$modal',
                                            'totvs.app-main-view.Service',
                                            'customization.generic.Factory',
                                            'mpd.productcrossselling.Service',
                                            '$stateParams', 'TOTVSEvent'];
    function crossSellingListController($rootScope, $scope, $modal, appViewService, customizationService, productCrossSellingService, $stateParams, TOTVSEvent) {
        $scope.showAsTable = false;
        
        if ($stateParams.hasOwnProperty('showAsTable')){
            $scope.showAsTable = $stateParams.showAsTable;
        }

        var controller = this;

        this.getUrlEncode = function(value) {
            value = window.encodeURIComponent(value);
            value = controller.replaceAllString(value, '.', '%2E');
            return value;
        };
        
        this.replaceAllString = function(str, find, replace) {
            return str.replace(find, replace);
        }


        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************

        this.listResult = [];       // array que mantem a lista de registros
        this.totalRecords = 0;      // atributo que mantem a contagem de registros da pesquisa
        this.disclaimers = [];      // array que mantem a lista de filtros aplicados
        this.advancedSearch = {}    // objeto para manter as informações do filtro avançado

        // *********************************************************************************
        // *** Methods
        // *********************************************************************************

        // abertura da tela de pesquisa avançada
        this.openAdvancedSearch = function() {
            var modalInstance = $modal.open({
              templateUrl: '/dts/mpd/html/productcrossselling/cross-selling.search.html',
              controller: 'mpd.cross-selling-search.Control as controller',
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
            if (controller.advancedSearch.item) {                
                // adicionar o disclaimer para o campo cod-mensagem, para faixa o value é "inicio;final"
                controller.addDisclaimer('cod-produto', '*' + controller.advancedSearch.item + '*', $rootScope.i18n('l-cod-item') + ": " + controller.advancedSearch.item);
            }
            
            if (controller.advancedSearch.productcrossselling) {                
                // adicionar o disclaimer para o campo cod-mensagem, para faixa o value é "inicio;final"
                controller.addDisclaimer('cod-cross-selling', '*' + controller.advancedSearch.productcrossselling + '*', $rootScope.i18n('l-product-cross-selling') + ": " + controller.advancedSearch.productcrossselling);
            }
            
            /* problema com o campo em oracle...por causa do tipo do campo, não é possivel fazer a query
			
			if (controller.advancedSearch.desc) {                
                // adicionar o disclaimer para o campo cod-mensagem, para faixa o value é "inicio;final"
                controller.addDisclaimer('dsl-obs', '*' + controller.advancedSearch.desc + '*', $rootScope.i18n('l-descricao') + ": " + controller.advancedSearch.desc);
            } */           
        }
        // adiciona um objeto na lista de disclaimers
        this.addDisclaimer = function(property, value, label) {
            controller.disclaimers.push({
                property: property,
                value: value,
                title: label
            });
        }        
		
		this.quickSearch = function() {
		
			controller.addDisclaimers();
		
            //se houver pesquisa rápida, monta o where
            if (controller.quickSearchText){
                controller.addDisclaimer('cod-cross-selling', '*' + controller.quickSearchText + '*', "Filtro Simples: " + controller.quickSearchText);
                controller.quickSearchText = '';
            } 
			controller.loadData()
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
            if (disclaimer.property == 'cod-produto') {
                controller.advancedSearch.item = '';
            }
            if (disclaimer.property == 'cod-cross-selling') {
                controller.advancedSearch.productcrossselling = '';
            }
            if (disclaimer.property == 'dsl-obs') {
                controller.advancedSearch.desc = '';
            }            
            
            // recarrega os dados quando remove um disclaimer
            controller.loadData();
        }

        // metodo de leitura dos dados
        this.loadData = function(isMore) {
            
            // valores default para o inicio e pesquisa
            var startAt = 0;
            var where = '';
            var criteria = '';
            controller.totalRecords = 0;
            
            // se não é busca de mais dados, inicializa o array de resultado
            if (!isMore) {
                controller.listResult = [];
            }
            // calcula o registro inicial da busca
            startAt = controller.listResult.length;

            // monta a lista de propriedades e valores a partir dos disclaimers
            var properties = [];
            var values = [];

            angular.forEach(controller.disclaimers, function (filter) {
                if (filter.property) {
                    properties.push(filter.property);
                    values.push(filter.value);
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
            productCrossSellingService.findRecords(startAt, parameters, function(result) {
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
                        productCrossSellingService.deleteRecord(record['cod-produto'], record['cod-cross-selling']  , function(result) {
                            if (result) {

                                // remove o item da lista
                                var index = controller.listResult.indexOf(record);

                                if (index != -1) {

                                    controller.listResult.splice(index, 1);

                                    controller.totalRecords--;

                                    // notifica o usuario que o registro foi removido
                                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                        type: 'success', // tipo de notificação
                                        title: $rootScope.i18n('l-products-cross-selling'), // titulo da notificação
                                        // detalhe da notificação
                                        detail: $rootScope.i18n('l-product-cross-selling') + ': '
                                            + record['cod-cross-selling'] + ', ' +
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
            if (appViewService.startView($rootScope.i18n('l-products-cross-selling'), 'mpd.cross-selling-list.Control', controller)) {
                // se é a abertura da tab, implementar aqui inicialização do controller
            }
            // realiza a busca de dados inicial
            this.loadData(false);            
            // chama um ponto da EPC para customizar a inicialização da tela.
            customizationService.callEvent('mpd.productcrosssellingproductcrossselling', 'initEvent', controller);
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
    };
    
    
    crossSellingDetailController.$inject = ['$rootScope', 
                                              '$scope', 
                                              '$stateParams', 
                                              '$state',
                                              'totvs.app-main-view.Service', 
                                              'mpd.productcrossselling.Service', 'TOTVSEvent'];    
    function crossSellingDetailController($rootScope, $scope, $stateParams, $state,appViewService, productCrossSellingService, TOTVSEvent) {
        
        var controller = this;

        this.getUrlEncode = function(value) {
            value = window.encodeURIComponent(value);
            value = controller.replaceAllString(value, '.', '%2E');
            return value;
        };
        
        this.replaceAllString = function(str, find, replace) {
            return str.replace(find, replace);
        }

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
            if((controller.model['cod-produto'] != undefined) && (controller.model['cod-produto'] != '') && (controller.model['cod-cross-selling'] != undefined) && (controller.model['cod-cross-selling'] != '')){
                $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                    title: 'l-question', // titlo da mensagem
                    text: $rootScope.i18n('l-confirm-delete-operation'), // texto da mensagem
                    cancelLabel: 'l-no', // label do botão cancelar
                    confirmLabel: 'l-yes', // label do botão confirmar
                    callback: function(isPositiveResult) { // função de retorno
                        if (isPositiveResult) { // se foi clicado o botão confirmar
                            // chama o metodo de remover registro do service
                            productCrossSellingService.deleteRecord(controller.model['cod-produto'], controller.model['cod-cross-selling'], function(result) {
                                if (result) { 
                                    // notifica o usuario que o registro foi removido
                                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                        type: 'success', // tipo de notificação
                                        title: $rootScope.i18n('l-products-cross-selling'), // titulo da notificação
                                        // detalhe da notificação
                                        detail: $rootScope.i18n('l-product-cross-selling') + ': '
                                            + controller.model['cod-cross-selling'] + ', ' +
                                            $rootScope.i18n('l-success-deleted') + '!'
                                    });
                                    // muda o state da tela para o state inicial, que é a lista
                                    $state.go('dts/mpd/productcrossselling.start');
                                }
                            });
                        }
                    }
                });
            }
        }
        // metodo de leitura do regstro
        this.load = function(codProduto, codCrossSelling) {
            this.model = {}; // zera o model
            // chama o servico para retornar o registro
            productCrossSellingService.getRecord(codProduto, codCrossSelling, function(datadetail) {
                if (datadetail) { // se houve retorno, carrega no model
                    controller.model = datadetail;                    
                }              
            });
        }

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        this.init = function() {
            if (appViewService.startView($rootScope.i18n('l-products-cross-selling'), 'mpd.cross-selling-detail.Control', controller)) {             
                // se é a abertura da tab, implementar aqui inicialização do controller
            }

            // se houver parametros na URL
            if ($stateParams && $stateParams.codProduto && $stateParams.codCrossSelling) {
                // realiza a busca de dados inicial
                this.load($stateParams.codProduto, $stateParams.codCrossSelling);
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
                                                
    };

    crossSellingEditController.$inject = ['$rootScope',
                                            '$scope',
                                            '$stateParams',
                                            '$window',
                                            '$location',
                                            '$state',
                                            'totvs.app-main-view.Service', 
                                            'mpd.productcrossselling.Service', 'TOTVSEvent'];
    function crossSellingEditController($rootScope, $scope, $stateParams, $window, $location, $state, appViewService, productCrossSellingService, TOTVSEvent) {
    
        var controller = this;
        
        this.getUrlEncode = function(value) {
            value = window.encodeURIComponent(value);
            value = controller.replaceAllString(value, '.', '%2E');
            return value;
        };
        
        this.replaceAllString = function(str, find, replace) {
            return str.replace(find, replace);
        }
        
        this.getMaxValueDslObs = function(){
            if(controller.model['dsl-obs'].length > 4000){
                controller.model['dsl-obs'] = controller.model['dsl-obs'].substring(0, 15000);
            }
        };
        
                
        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************

        this.model = {}; // mantem o conteudo do registro em edição/inclusão

        // atributo auxiliar para determinar se é uma edição, desabilitando o campo chave
        
        this.codProdutoDisabled = $state.is('dts/mpd/productcrossselling.edit');
        
        if (this.codProdutoDisabled) {
            this.title = $rootScope.i18n('l-editar');
        } else {
            this.title = $rootScope.i18n('l-novo-registro');           
        }
        
        //atributos para habilitar/desabilitar os campos em tela

        
        // *********************************************************************************
        // *** Methods
        // *********************************************************************************

        // metodo de leitura do regstro
        this.load = function(codProduto, codCrossSelling) {
            this.model = {};
            // chama o servico para retornar o registro
            productCrossSellingService.getRecord(codProduto, codCrossSelling, function(result) {
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

            // se for a tela de edição, faz o update
            if ($state.is('dts/mpd/productcrossselling.edit')) {                
                productCrossSellingService.updateRecord(this.model['cod-produto'], this.model['cod-cross-selling'], this.model, function(result) {
                    // se gravou o registro com sucesso
                    controller.onSaveUpdate(true, result);
                });
            } else { // senão faz o create                
                productCrossSellingService.saveRecord(this.model, function(result) {
                    // se gravou o registro com sucesso
                    controller.onSaveUpdate(false, result);
                });
            }
        }
        // metodo para notificar o usuario da gravaçao do registro com sucesso
        this.onSaveUpdate = function(isUpdate, result) {
            if(!result.$hasError){
                // redireciona a tela para a tela de detalhar
                controller.redirectToDetail();
                
                // notifica o usuario que conseguiu salvar o registro
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'success',
                    title: $rootScope.i18n('l-products-cross-selling'),
                    detail: $rootScope.i18n('l-product-cross-selling') + ': ' + controller.model['cod-cross-selling'] + ', ' +
                    (isUpdate ? $rootScope.i18n('l-success-updated') : $rootScope.i18n('l-success-created')) + '!'
                });
            }
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

            // verifica se o item e produto cross-selling são iguais
            if (this.model['cod-produto'] == this.model['cod-cross-selling']) {
                isInvalidForm = true;
                messages.push('l-validate-item-cross-selling');
            }
            
            // verifica se o item esta vazio
            if ((this.model['cod-produto'] == undefined)||(this.model['cod-produto'] == '')) {
                isInvalidForm = true;
                messages.push('l-validate-item-null');
            }
            
            // verifica se o produto cross-selling esta vazio
            if ((this.model['cod-cross-selling'] == undefined)||(this.model['cod-cross-selling'] == '')) {
                isInvalidForm = true;
                messages.push('l-validate-cross-selling-null');
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
                    detail: warning
                });
            }

            return isInvalidForm;
        }

        // redireciona para a tela de detalhar
        this.redirectToDetail = function() {
            $location.path('dts/mpd/productcrossselling/detail/' + this.model['cod-produto'] + '/' + this.model['cod-cross-selling']);
        }
        
        
        if (this.codProdutoDisabled === false) { //esta no modo de incluir*/         
            //Realizar validação de campos
            this.onChangeItemCode = function() {
                if (this.model['cod-produto'] != 0 || this.model['cod-produto'] != ''){
                    
                }
            };
        }
        
        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        this.init = function() {

            if (appViewService.startView($rootScope.i18n('l-products-cross-selling'), 'mpd.cross-selling-edit.Control', controller)) {
                // se é a abertura da tab, implementar aqui inicialização do controller            
            }

            // se houver parametros na URL
            if ($stateParams && $stateParams.codProduto && $stateParams.codCrossSelling) {
                // realiza a busca de dados inicial
                this.load($stateParams.codProduto, $stateParams.codCrossSelling);
            } else { // se não, incica com o model em branco (inclusão)
                this.model = {};
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
        
    };

    crossSellingSearchController.$inject = ['$modalInstance', 'model'];
        function crossSellingSearchController ($modalInstance, model) {
        
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

    };

    // registrar os controllers no angular
    index.register.controller('mpd.cross-selling-list.Control', crossSellingListController);
    index.register.controller('mpd.cross-selling-edit.Control', crossSellingEditController);
    index.register.controller('mpd.cross-selling-detail.Control', crossSellingDetailController);
    index.register.controller('mpd.cross-selling-search.Control', crossSellingSearchController);    


});