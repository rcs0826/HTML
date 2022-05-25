define(['index', // index sempre deve ser injetado para permitir o registro dos controllers.
             // totvs-custom alem das tags de customização de tela, tambem comtêm os serviços de customização
            '/dts/mpd/js/dbo/bodi00705.js', // os controllers dependem dos serviços registrados.
    '/dts/mpd/js/zoom/estabelec.js',
    '/dts/mpd/js/zoom/emitente.js',
    '/dts/mpd/js/zoom/natur-oper.js',
    '/dts/mpd/js/zoom/tb-preco-inter.js',
    '/dts/mpd/js/zoom/cond-pagto-inter.js',
    '/dts/mpd/js/zoom/canal-venda.js',
    '/dts/mpd/js/zoom/repres.js',
    '/dts/mpd/js/zoom/loc-entr.js',
    '/dts/mpd/js/api/fchdisdbo.js'
], function (index) {

    relatIssuerEstabListController.$inject = ['$rootScope',
        '$scope',
        '$modal',
        'totvs.app-main-view.Service',
        'customization.generic.Factory',
        'mpd.relatissuerestab.Service',
        '$stateParams', 'TOTVSEvent'
    ];

    function relatIssuerEstabListController($rootScope, $scope, $modal, appViewService, customizationService, relatissuerestabService, $stateParams, TOTVSEvent) {
        $scope.showAsTable = false;

        if ($stateParams.hasOwnProperty('showAsTable')) {
            $scope.showAsTable = $stateParams.showAsTable;
        }

        var controller = this;

        this.getUrlEncode = function (value) {
            value = window.encodeURIComponent(value);
            value = controller.replaceAllString(value, '.', '%2E');
            return value;
        };

        this.replaceAllString = function (str, find, replace) {
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
        this.openAdvancedSearch = function () {
            var modalInstance = $modal.open({
                templateUrl: '/dts/mpd/html/relatissuerestab/relatissuerestab.search.html',
                controller: 'mpd.relatissuerestab-search.Control as controller',
                size: 'lg',
                resolve: {
                    model: function () {
                        return controller.advancedSearch;
                    }
                }
            });
            modalInstance.result.then(function () {
                controller.addDisclaimers();
                controller.loadData();
            });
        }

        // metodo para adicionar os disclaimers relativos a tela de pesquisa avançada
        this.addDisclaimers = function () {
            // reinicia os disclaimers
            controller.disclaimers = [];

            if (controller.advancedSearch.nomeAbrevIni || controller.advancedSearch.nomeAbrevFin) {
                var faixa = '',
                    deate = ' ' + $rootScope.i18n('l-from-start');                 
                if (controller.advancedSearch.nomeAbrevIni)  {
                    faixa = controller.advancedSearch.nomeAbrevIni;
                    deate = controller.advancedSearch.nomeAbrevIni;
                }
                if (controller.advancedSearch.nomeAbrevFin) {
                    faixa = faixa + ';' + controller.advancedSearch.nomeAbrevFin;
                    deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + controller.advancedSearch.nomeAbrevFin;
                } else {
                    faixa = faixa + ';ZZZZZZZZ';
                    deate = deate + ' ' + $rootScope.i18n('l-to-end');
                }
                // adicionar o disclaimer para o campo cod-mensagem, para faixa o value é "inicio;final"
                controller.addDisclaimer('nome-abrev', faixa, $rootScope.i18n('Nome Abreviado: ') + deate);
            }

            if (controller.advancedSearch.estabelecIni || controller.advancedSearch.estabelecFin) {
                var faixa = '',
                    deate = ' ' + $rootScope.i18n('l-from-start');                 
                if (controller.advancedSearch.estabelecIni)  {
                    faixa = controller.advancedSearch.estabelecIni;
                    deate = controller.advancedSearch.estabelecIni;
                }
                if (controller.advancedSearch.estabelecFin) {
                    faixa = faixa + ';' + controller.advancedSearch.estabelecFin;
                    deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + controller.advancedSearch.estabelecFin;
                } else {
                    faixa = faixa + ';ZZZZZZZZ';
                    deate = deate + ' ' + $rootScope.i18n('l-to-end');
                }
                // adicionar o disclaimer para o campo cod-mensagem, para faixa o value é "inicio;final"
                controller.addDisclaimer('cod-estabel', faixa, $rootScope.i18n('Estabelecimento: ') + deate);
            }

            if (controller.advancedSearch.natOperIni || controller.advancedSearch.natOperFin) {
                var faixa = '',
                    deate = ' ' + $rootScope.i18n('l-from-start');                 
                if (controller.advancedSearch.natOperIni)  {
                    faixa = controller.advancedSearch.natOperIni;
                    deate = controller.advancedSearch.natOperIni;
                }
                if (controller.advancedSearch.natOperFin) {
                    faixa = faixa + ';' + controller.advancedSearch.natOperFin;
                    deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + controller.advancedSearch.natOperFin;
                } else {
                    faixa = faixa + ';ZZZZZZZZ';
                    deate = deate + ' ' + $rootScope.i18n('l-to-end');
                }
                // adicionar o disclaimer para o campo cod-mensagem, para faixa o value é "inicio;final"
                controller.addDisclaimer('nat-operacao', faixa, $rootScope.i18n('Natureza de Operação: ') + deate);
            }

            if (controller.advancedSearch.natOperExtIni || controller.advancedSearch.natOperExtFin) {
                var faixa = '',
                    deate = ' ' + $rootScope.i18n('l-from-start');                 
                if (controller.advancedSearch.natOperExtIni)  {
                    faixa = controller.advancedSearch.natOperExtIni;
                    deate = controller.advancedSearch.natOperExtIni;
                }
                if (controller.advancedSearch.natOperExtFin) {
                    faixa = faixa + ';' + controller.advancedSearch.natOperExtFin;
                    deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + controller.advancedSearch.natOperExtFin;
                } else {
                    faixa = faixa + ';ZZZZZZZZ';
                    deate = deate + ' ' + $rootScope.i18n('l-to-end');
                }
                // adicionar o disclaimer para o campo cod-mensagem, para faixa o value é "inicio;final"
                controller.addDisclaimer('nat-oper-ext', faixa, $rootScope.i18n('Natureza de Operação Interestadual: ') + deate);
            }

            if (controller.advancedSearch.nrTabPreIni || controller.advancedSearch.nrTabPreFin) {
                var faixa = '',
                    deate = ' ' + $rootScope.i18n('l-from-start');                 
                if (controller.advancedSearch.nrTabPreIni)  {
                    faixa = controller.advancedSearch.nrTabPreIni;
                    deate = controller.advancedSearch.nrTabPreIni;
                }
                if (controller.advancedSearch.nrTabPreFin) {
                    faixa = faixa + ';' + controller.advancedSearch.nrTabPreFin;
                    deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + controller.advancedSearch.nrTabPreFin;
                } else {
                    faixa = faixa + ';ZZZZZZZZ';
                    deate = deate + ' ' + $rootScope.i18n('l-to-end');
                }
                // adicionar o disclaimer para o campo cod-mensagem, para faixa o value é "inicio;final"
                controller.addDisclaimer('nr-tabpre', faixa, $rootScope.i18n('Tabela de Preço: ') + deate);
            }

            if (controller.advancedSearch.codCondPagIni || controller.advancedSearch.codCondPagFin) {
                var faixa = '',
                    deate = ' ' + $rootScope.i18n('l-from-start');                 
                if (controller.advancedSearch.codCondPagIni)  {
                    faixa = controller.advancedSearch.codCondPagIni;
                    deate = controller.advancedSearch.codCondPagIni;
                }
                if (controller.advancedSearch.codCondPagFin) {
                    faixa = faixa + ';' + controller.advancedSearch.codCondPagFin;
                    deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + controller.advancedSearch.codCondPagFin;
                } else {
                    faixa = faixa + ';999';
                    deate = deate + ' ' + $rootScope.i18n('l-to-end');
                }
                // adicionar o disclaimer para o campo cod-mensagem, para faixa o value é "inicio;final"
                controller.addDisclaimer('cod-cond-pag', faixa, $rootScope.i18n('Condição de Pagamento: ') + deate);
            }

            if (controller.advancedSearch.codCanalVendaIni || controller.advancedSearch.codCanalVendaFin) {
                var faixa = '',
                    deate = ' ' + $rootScope.i18n('l-from-start');                 
                if (controller.advancedSearch.codCanalVendaIni)  {
                    faixa = controller.advancedSearch.codCanalVendaIni;
                    deate = controller.advancedSearch.codCanalVendaIni;
                }
                if (controller.advancedSearch.codCanalVendaFin) {
                    faixa = faixa + ';' + controller.advancedSearch.codCanalVendaFin;
                    deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + controller.advancedSearch.codCanalVendaFin;
                } else {
                    faixa = faixa + ';999';
                    deate = deate + ' ' + $rootScope.i18n('l-to-end');
                }
                // adicionar o disclaimer para o campo cod-mensagem, para faixa o value é "inicio;final"
                controller.addDisclaimer('cod-canal-venda', faixa, $rootScope.i18n('Canal de Venda: ') + deate);
            }

            if (controller.advancedSearch.codRepIni || controller.advancedSearch.codRepFin) {
                var faixa = '',
                    deate = ' ' + $rootScope.i18n('l-from-start');                 
                if (controller.advancedSearch.codRepIni)  {
                    faixa = controller.advancedSearch.codRepIni;
                    deate = controller.advancedSearch.codRepIni;
                }
                if (controller.advancedSearch.codRepFin) {
                    faixa = faixa + ';' + controller.advancedSearch.codRepFin;
                    deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + controller.advancedSearch.codRepFin;
                } else {
                    faixa = faixa + ';999';
                    deate = deate + ' ' + $rootScope.i18n('l-to-end');
                }
                // adicionar o disclaimer para o campo cod-mensagem, para faixa o value é "inicio;final"
                controller.addDisclaimer('cod-rep', faixa, $rootScope.i18n('Código do Representante: ') + deate);
            }

            if (controller.advancedSearch.codLocEntrIni || controller.advancedSearch.codLocEntrFin) {
                var faixa = '',
                    deate = ' ' + $rootScope.i18n('l-from-start');                 
                if (controller.advancedSearch.codLocEntrIni)  {
                    faixa = controller.advancedSearch.codLocEntrIni;
                    deate = controller.advancedSearch.codLocEntrIni;
                }
                if (controller.advancedSearch.codLocEntrFin) {
                    faixa = faixa + ';' + controller.advancedSearch.codLocEntrFin;
                    deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + controller.advancedSearch.codLocEntrFin;
                } else {
                    faixa = faixa + ';ZZZZZZZZ';
                    deate = deate + ' ' + $rootScope.i18n('l-to-end');
                }
                // adicionar o disclaimer para o campo cod-mensagem, para faixa o value é "inicio;final"
                controller.addDisclaimer('cod-entrega', faixa, $rootScope.i18n('Código do Local de Entrega: ') + deate);
            }
        }
        // adiciona um objeto na lista de disclaimers
        this.addDisclaimer = function (property, value, label) {
            controller.disclaimers.push({
                property: property,
                value: value,
                title: label
            });
        }

        this.quickSearch = function () {

            controller.addDisclaimers();

            //se houver pesquisa rápida, monta o where
            if (controller.quickSearchText) {
                controller.addDisclaimer('nome-abrev', '*' + controller.quickSearchText + '*', "Filtro Simples por Nome Emitente: " + controller.quickSearchText);
                controller.quickSearchText = '';
            }
            controller.loadData()
        }

        // remove um disclaimer
        this.removeDisclaimer = function (disclaimer) {
            // pesquisa e remove o disclaimer do array
            var index = controller.disclaimers.indexOf(disclaimer);

            if (disclaimer.property === 'nome-abrev') {
                controller.advancedSearch.nomeAbrevIni = "";
                controller.advancedSearch.nomeAbrevFin = "";
            } else if (disclaimer.property === 'cod-estabel') {
                controller.advancedSearch.estabelecIni = "";
                controller.advancedSearch.estabelecFin = "";
            } else if (disclaimer.property === 'nat-operacao') {
                controller.advancedSearch.natOperIni = "";
                controller.advancedSearch.natOperFin = "";
            } else if (disclaimer.property === 'nat-oper-ext') {
                controller.advancedSearch.natOperExtIni = "";
                controller.advancedSearch.natOperExtFin = "";
            } else if (disclaimer.property === 'nr-tabpre') {
                controller.advancedSearch.nrTabPreIni = "";
                controller.advancedSearch.nrTabPreFin = "";
            } else if (disclaimer.property === 'cod-cond-pag') {
                controller.advancedSearch.codCondPagIni = "";
                controller.advancedSearch.codCondPagFin = "";
            } else if (disclaimer.property === 'cod-canal-venda') {
                controller.advancedSearch.codCanalVendaIni = "";
                controller.advancedSearch.codCanalVendaFin = "";
            } else if (disclaimer.property === 'cod-rep') {
                controller.advancedSearch.codRepIni = "";
                controller.advancedSearch.codRepFin = "";
            } else if (disclaimer.property === 'cod-entrega') {
                controller.advancedSearch.codLocEntrIni = "";
                controller.advancedSearch.codLocEntrFin = "";
            }

            if (index != -1) {
                controller.disclaimers.splice(index, 1);
            }

            // recarrega os dados quando remove um disclaimer
            controller.loadData();
        }

        // metodo de leitura dos dados
        this.loadData = function (isMore) {

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

            parameters.order = "cod-emitente";

            if (parameters.where && criteria)
                parameters.where = parameters.where + " AND " + criteria;
            else if (criteria)
                parameters.where = criteria;

            // chama o findRecords
            relatissuerestabService.findRecords(startAt, parameters, function (result) {
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
        this.delete = function (record) {
            // envia um evento para perguntar ao usuário
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question', // titulo da mensagem
                text: $rootScope.i18n('l-confirm-delete-operation'), // texto da mensagem
                cancelLabel: 'l-no', // label do botão cancelar
                confirmLabel: 'l-yes', // label do botão confirmar
                callback: function (isPositiveResult) { // função de retorno
                    if (isPositiveResult) { // se foi clicado o botão confirmar

                        // chama o metodo de remover registro do service
                        relatissuerestabService.deleteRecord(record['cod-estabel'], record['cod-emitente'], function (result) {
                            if (result) {

                                // remove o item da lista
                                var index = controller.listResult.indexOf(record);

                                if (index != -1) {
                                    controller.listResult.splice(index, 1);
                                    controller.totalRecords--;

                                    // notifica o usuario que o registro foi removido
                                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                        type: 'success', // tipo de notificação
                                        title: $rootScope.i18n('l-relac-customer-establishment'), // titulo da notificação
                                        // detalhe da notificação
                                        detail: $rootScope.i18n('l-relac-customer-establishment') + " " + $rootScope.i18n('l-success-deleted') + '!'
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
        this.init = function () {           
            if (appViewService.startView($rootScope.i18n('l-relac-customer-establishment'), 'mpd.relatissuerestab-list.Control', controller)) {
                // se é a abertura da tab, implementar aqui inicialização do controller
            }
            // realiza a busca de dados inicial
            this.loadData(false);
            // chama um ponto da EPC para customizar a inicialização da tela.
            customizationService.callEvent('mpd.relatissuerestabrelatissuerestab', 'initEvent', controller);
        }

        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) {
            this.init();
        }

        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************

        // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        });
    };


    relatIssuerEstabDetailController.$inject = ['$rootScope',
        '$scope',
        '$stateParams',
        '$state',
        'totvs.app-main-view.Service',
        'mpd.relatissuerestab.Service',
        'TOTVSEvent'
    ];

    function relatIssuerEstabDetailController($rootScope, $scope, $stateParams, $state, appViewService, relatissuerestabService, TOTVSEvent) {

        var controller = this;

        this.getUrlEncode = function (value) {
            value = window.encodeURIComponent(value);
            value = controller.replaceAllString(value, '.', '%2E');
            return value;
        };

        this.replaceAllString = function (str, find, replace) {
            return str.replace(find, replace);
        }

        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************
        this.model = {}; // mantem o conteudo do registro em detalhamento

        // *********************************************************************************
        // *** Methods
        // *********************************************************************************

        this.redirectList = function () {
            $state.go('dts/mpd/relatissuerestab.start');
        }

        // metodo para a ação de remover
        this.onRemove = function () {
            // envia um evento para perguntar ao usuário
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question', // titlo da mensagem
                text: $rootScope.i18n('l-confirm-delete-operation'), // texto da mensagem
                cancelLabel: 'l-no', // label do botão cancelar
                confirmLabel: 'l-yes', // label do botão confirmar
                callback: function (isPositiveResult) { // função de retorno
                    if (isPositiveResult) { // se foi clicado o botão confirmar
                        // chama o metodo de remover registro do service
                        relatissuerestabService.deleteRecord(controller.model['cod-estabel'],controller.model['cod-emitente'], function (result) {
                            if (result) {
                                // notifica o usuario que o registro foi removido
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type: 'success', // tipo de notificação
                                    title: $rootScope.i18n('l-relac-customer-establishment'), // titulo da notificação
                                    // detalhe da notificação
                                    detail: $rootScope.i18n('l-relac-customer-establishment')  + ', ' +
                                        $rootScope.i18n('l-success-deleted') + '!'
                                });
                                // muda o state da tela para o state inicial, que é a lista
                                controller.redirectList();
                            }
                        });
                    }
                }
            });
        }

        // metodo de leitura do regstro
        this.load = function (codEstabel, codEmitente) {
            this.model = {}; // zera o model
            // chama o servico para retornar o registro
            relatissuerestabService.getRecord(codEstabel, codEmitente, function (datadetail) {
                if (datadetail) { // se houve retorno, carrega no model
                    controller.model = datadetail;
                }              
            });
        }

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        this.init = function () {
            if (appViewService.startView($rootScope.i18n('l-relac-customer-establishment'), 'mpd.relatissuerestab-detail.Control', controller)) {             
                // se é a abertura da tab, implementar aqui inicialização do controller
            }

            // se houver parametros na URL
            if ($stateParams && $stateParams.codEstabel && $stateParams.codEmitente) {
                // realiza a busca de dados inicial
                this.load($stateParams.codEstabel, $stateParams.codEmitente);
            }
        }

        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) {
            this.init();
        }

        // *********************************************************************************
        // *** Events Listeners
        // *********************************************************************************

        // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        });

    };

    relatIssuerEstabEditController.$inject = ['$rootScope',
        '$scope',
        '$stateParams',
        '$window',
        '$location',
        '$state',
        'totvs.app-main-view.Service',
        'mpd.relatissuerestab.Service',
        'mpd.fchdisdbo.Factory',
        'TOTVSEvent'
    ];

    function relatIssuerEstabEditController($rootScope, $scope, $stateParams, $window, $location, $state, appViewService, relatissuerestabService, fchdisdbo, TOTVSEvent) {

        var controller = this;

        this.getUrlEncode = function (value) {
            value = window.encodeURIComponent(value);
            value = controller.replaceAllString(value, '.', '%2E');
            return value;
        };

        this.replaceAllString = function (str, find, replace) {
            return str.replace(find, replace);
        }

        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************

        this.model = {

        }; // mantem o conteudo do registro em edição/inclusão

        // atributo auxiliar para determinar se é uma edição, desabilitando o campo chave

        this.disabledKeyField = $state.is('dts/mpd/relatissuerestab.edit');

        this.emitente = {
        };

        if (this.disabledKeyField) {
            this.title = $rootScope.i18n('l-editar');
        } else {
            this.title = $rootScope.i18n('l-novo-registro');
        }

        //atributos para habilitar/desabilitar os campos em tela


        // *********************************************************************************
        // *** Methods
        // *********************************************************************************

        // metodo de leitura do regstro
        this.load = function (codEstabel, codEmitente) {
            this.model = {};
            // chama o servico para retornar o registro
            relatissuerestabService.getRecord(codEstabel, codEmitente, function (result) {
                // carrega no model
                controller.model = result;
                controller.emitente = controller.model['nome-abrev'];
            });
        }

        this.save = function () {            
            this.beforeSave(false);
        }
        
        this.saveNew = function () {
            this.beforeSave(true); 
        }

        this.beforeSave = function (saveNew) {
            // verificar se o formulario tem dados invalidos
            if (this.isInvalidForm()) {
                return;
            }

            var modelFinal = {};

            modelFinal['cod-estabel'] = this.model['cod-estabel'] != undefined ? this.model['cod-estabel'] : 0;
            modelFinal['cod-emitente'] = this.model['cod-emitente'] != undefined ? this.model['cod-emitente'] : 0;
            modelFinal['nat-operacao'] = this.model['nat-operacao'] != undefined ? this.model['nat-operacao'] : "";
            modelFinal['nat-oper-ext'] = this.model['nat-oper-ext'] != undefined ? this.model['nat-oper-ext'] : "";
            modelFinal['nr-tabpre'] = this.model['nr-tabpre'] != undefined ? this.model['nr-tabpre'] : "";
            modelFinal['val-perc-desc-clien'] = this.model['val-perc-desc-clien'] != undefined ? this.model['val-perc-desc-clien'] : 0;
            modelFinal['cod-cond-pag'] = this.model['cod-cond-pag'] != undefined ? this.model['cod-cond-pag'] : 0;
            modelFinal['cod-entrega'] = this.model['cod-entrega'] != undefined ? this.model['cod-entrega'] : 0;
            modelFinal['cod-rep'] = this.model['cod-rep'] != undefined ? this.model['cod-rep'] : 0;
            modelFinal['cod-canal-venda'] = this.model['cod-canal-venda'] != undefined ? this.model['cod-canal-venda'] : 0;

            // se for a tela de edição, faz o update
            if ($state.is('dts/mpd/relatissuerestab.edit')) {
                relatissuerestabService.updateRecord(modelFinal['cod-estabel'], modelFinal['cod-emitente'], modelFinal, function (result) {
                    // se gravou o registro com sucesso
                    controller.onSaveUpdate(true, saveNew, result);
                });
            } else { // senão faz o create                
                relatissuerestabService.saveRecord(modelFinal, function (result) {
                    // se gravou o registro com sucesso                    
                    controller.onSaveUpdate(false, saveNew, result);
                });
            }
        }

        // metodo para notificar o usuario da gravaçao do registro com sucesso
        this.onSaveUpdate = function (isUpdate, saveNew, result) {
            if (!result.$hasError) {
                // notifica o usuario que conseguiu salvar o registro
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'success',
                    title: $rootScope.i18n('l-relac-customer-establishment'),
                    detail: $rootScope.i18n('l-relac-customer-establishment') + " " + (isUpdate ? $rootScope.i18n('l-success-updated') : $rootScope.i18n('l-success-created')) + '!'
                });

                if(saveNew) {
                    controller.init();
                } else {
                    controller.redirectList();
                }                
            }
        }

        // metodo para a ação de cancelar
        this.cancel = function () {
            // solicita que o usuario confirme o cancelamento da edição/inclusão
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question',
                text: $rootScope.i18n('l-cancel-operation'),
                cancelLabel: 'l-no',
                confirmLabel: 'l-yes',
                callback: function (isPositiveResult) {
                    if (isPositiveResult) { // se confirmou, navega para a pagina anterior
                        controller.redirectList();
                    }
                }
            });
        }

        this.changeEmitente = function () {
            if (!this.disabledKeyField && controller.emitente) {
                controller.model['cod-emitente'] = controller.emitente['cod-emitente'];
                controller.model['nome-abrev'] = controller.emitente['nome-abrev'];

                fchdisdbo.bodi00705_ReturnCustomerDefault({
                    cliente: controller.model['cod-emitente']
                }, function (result) {
                    controller.model['cod-entrega'] = result['p-c-cod-entrega'];
                    controller.model['nat-oper-ext'] = result['p-c-nat-oper-ext'];
                    controller.model['nat-operacao'] = result['p-c-nat-operacao'];
                    controller.model['nr-tabpre'] = result['p-c-nr-tabpre'];
                    controller.model['val-perc-desc-clien'] = result['p-d-val-perc-desc-clien'];
                    controller.model['cod-canal-venda'] = result['p-i-cod-canal-venda'];
                    controller.model['cod-cond-pag'] = result['p-i-cod-cond-pag'];
                    controller.model['cod-rep'] = result['p-i-cod-rep'];
                })
            } 
        }

        // metodo para verificar se o formulario é invalido
        this.isInvalidForm = function () {
            var fields = "";
            var messages = [];
            var isInvalidForm = false;

            if ((this.model['cod-estabel'] === undefined) || (this.model['cod-estabel'] === '')) {
                isInvalidForm = true;
                messages.push('Estabelecimento');
            }

            if ((this.model['nome-abrev'] === undefined) || (this.model['nome-abrev'] === '')) {
                isInvalidForm = true;
                messages.push('Emitente');
            }

            if ((this.model['nat-operacao'] === undefined) || (this.model['nat-operacao'] === '')) {
                isInvalidForm = true;
                messages.push('Natureza de Operação');
            }

            if ((this.model['nat-oper-ext'] === undefined) || (this.model['nat-oper-ext'] === '')) {
                isInvalidForm = true;
                messages.push('Natureza de Operação Insterestadual');
            }

            if ((this.model['val-perc-desc-clien'] === undefined) || (this.model['val-perc-desc-clien'] === '')) {
                isInvalidForm = true;
                messages.push('Percentual de Desconto');
            }

            if ((this.model['cod-cond-pag'] === undefined) || (this.model['cod-cond-pag'] === '')) {
                isInvalidForm = true;
                messages.push('Condição de Pagamento');
            }

            if ((this.model['cod-entrega'] === undefined) || (this.model['cod-entrega'] === '')) {
                isInvalidForm = true;
                messages.push('Local de Entrega');
            }

            if ((this.model['cod-rep'] === undefined) || (this.model['cod-rep'] === '')) {
                isInvalidForm = true;
                messages.push('Representante');
            }

            if ((this.model['cod-canal-venda'] === undefined) || (this.model['cod-canal-venda'] === '')) {
                isInvalidForm = true;
                messages.push('Canal de Venda');
            }

            if (isInvalidForm) {

                var warning = messages.length > 1 ? "Verifique os campos" : "Verifique o campo";

                angular.forEach(messages, function (item) {
                    if (fields !== "") {
                        fields = fields + ", ";
                    }
                    fields = fields + $rootScope.i18n(item);
                });

                warning = warning + " " + fields;

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-attention'),
                    detail: warning
                });
            }

            return isInvalidForm;
        }

        // redireciona para a tela de lista
        this.redirectList = function () {
            $state.go('dts/mpd/relatissuerestab.start');
        }

        if (this.codProdutoDisabled === false) { //esta no modo de incluir*/         
            //Realizar validação de campos
            this.onChangeItemCode = function () {
                if (this.model['cod-produto'] != 0 || this.model['cod-produto'] != '') {

                }
            };
        }

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        this.init = function () {
            if (appViewService.startView($rootScope.i18n('l-relac-customer-establishment'), 'mpd.relatissuerestab-edit.Control', controller)) {
            }

            this.disabledKeyField = $state.is('dts/mpd/relatissuerestab.edit');

            // se houver parametros na URL
            if ($stateParams && $stateParams.codEstabel && $stateParams.codEmitente) {
                this.load($stateParams.codEstabel, $stateParams.codEmitente);
            } else {
                controller.model = {};
                controller.model['cod-estabel'] = "";
                controller.model['cod-emitente'] = 0;
                controller.model['nat-operacao'] = "";
                controller.model['nat-oper-ext'] = "";
                controller.model['nr-tabpre'] = "";
                controller.model['val-perc-desc-clien'] = 0;
                controller.model['cod-entrega'] = "";
                controller.model['cod-rep'] = 0;
                controller.model['cod-canal-venda'] = 0;              
                controller.emitente = undefined;                                       

                angular.element('input[name="controller_model_cod_estabel_input"]').focus();
            }    
        }

        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) {
            this.init();
        }

        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************

        // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        }); 

    };

    relatIssuerEstabSearchController.$inject = ['$modalInstance', 'model'];    
    function relatIssuerEstabSearchController($modalInstance, model) {

                
        this.advancedSearch = model;                 
        this.search = function () {            
            $modalInstance.close();        
        }                 
        this.close = function () {            
            $modalInstance.dismiss();        
        }
    };

         // registrar os controllers no angular
        
    index.register.controller('mpd.relatissuerestab-list.Control', relatIssuerEstabListController);    
    index.register.controller('mpd.relatissuerestab-edit.Control', relatIssuerEstabEditController);    
    index.register.controller('mpd.relatissuerestab-detail.Control', relatIssuerEstabDetailController);    
    index.register.controller('mpd.relatissuerestab-search.Control', relatIssuerEstabSearchController);


});