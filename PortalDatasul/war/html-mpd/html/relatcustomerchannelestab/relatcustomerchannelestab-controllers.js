define(['index',
    '/dts/mpd/js/zoom/estabelec.js',
    '/dts/mpd/js/zoom/emitente.js',
    '/dts/mpd/js/zoom/transporte.js',
    '/dts/mpd/js/zoom/tb-preco-inter.js',
    '/dts/mpd/js/zoom/cond-pagto-inter.js',
    '/dts/mpd/js/zoom/canal-venda.js',
    '/dts/mpd/js/zoom/repres.js',
    '/dts/mpd/js/api/relatcustomerchannelestab.js'
], function (index) {

    relatcustomerchannelestabListController.$inject = [
        '$rootScope',
        '$scope',
        '$modal',
        'totvs.app-main-view.Service',
        'customization.generic.Factory',
        'dts-utils.relatcustomerchannelestab.Factory',
        '$stateParams', '$filter', 'TOTVSEvent'
    ];

    function relatcustomerchannelestabListController($rootScope, $scope, $modal, appViewService, customizationService, appFactory, $stateParams, $filter, TOTVSEvent) {
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
        this.advancedSearch = {};    // objeto para manter as informações do filtro avançado
        this.hasNext = true; // variável de controle para a paginação
        this.page = 1; // variável de controle para a paginação
        this.pageSize = 50; // variável de controle para a paginação

        // *********************************************************************************
        // *** Methods
        // *********************************************************************************

        // abertura da tela de pesquisa avançada
        this.openAdvancedSearch = function () {
            var modalInstance = $modal.open({
                templateUrl: '/dts/mpd/html/relatcustomerchannelestab/relatcustomerchannelestab.search.html',
                controller: 'mpd.relatcustomerchannelestab-search.Control as controller',
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

                controller.addDisclaimer('cod-estabel', faixa, $rootScope.i18n('Estabelecimento: ') + deate);
            }

            if (controller.advancedSearch.codEmitIni || controller.advancedSearch.codEmitFin) {
                var faixa = '',
                    deate = ' ' + $rootScope.i18n('l-from-start');                 
                if (controller.advancedSearch.codEmitIni)  {
                    faixa = controller.advancedSearch.codEmitIni;
                    deate = controller.advancedSearch.codEmitIni;
                }
                if (controller.advancedSearch.codEmitFin) {
                    faixa = faixa + ';' + controller.advancedSearch.codEmitFin;
                    deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + controller.advancedSearch.codEmitFin;
                } else {
                    faixa = faixa + ';ZZZZZZZZ';
                    deate = deate + ' ' + $rootScope.i18n('l-to-end');
                }

                controller.addDisclaimer('cod-emitente', faixa, $rootScope.i18n('Código Emitente: ') + deate);
            }

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

                controller.addDisclaimer('nome-abrev', faixa, $rootScope.i18n('Nome Abreviado: ') + deate);
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

                controller.addDisclaimer('cod-canal-venda', faixa, $rootScope.i18n('Canal de Venda: ') + deate);
            }

            if (controller.advancedSearch.dtIniValIni || controller.advancedSearch.dtIniValFin) {
                var faixa = '',
                    deate = ' ' + $rootScope.i18n('l-from-start');                 
                if (controller.advancedSearch.dtIniValIni)  {
                    faixa = $filter('date')(controller.advancedSearch.dtIniValIni, 'shortDate');
                    deate = $filter('date')(controller.advancedSearch.dtIniValIni, 'shortDate');
                }
                if (controller.advancedSearch.dtIniValFin) {
                    faixa = faixa + ';' + $filter('date')(controller.advancedSearch.dtIniValFin, 'shortDate');
                    controller.advancedSearch.dtIniValFin;
                    deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + $filter('date')(controller.advancedSearch.dtIniValFin, 'shortDate');
                } else {
                    faixa = faixa + ';31/12/9999';
                    deate = deate + ' ' + $rootScope.i18n('l-to-end');
                }
                controller.addDisclaimer('dat-inic-validade', faixa, $rootScope.i18n('Dt Início Validade: ') + deate);
            }

            if (controller.advancedSearch.dtFimValIni || controller.advancedSearch.dtFimValFin) {
                var faixa = '',
                    deate = ' ' + $rootScope.i18n('l-from-start');                 
                if (controller.advancedSearch.dtFimValIni)  {
                    faixa = $filter('date')(controller.advancedSearch.dtFimValIni, 'shortDate');
                    deate = $filter('date')(controller.advancedSearch.dtFimValIni, 'shortDate');
                }
                if (controller.advancedSearch.dtFimValFin) {
                    faixa = faixa + ';' + $filter('date')(controller.advancedSearch.dtFimValFin, 'shortDate');
                    controller.advancedSearch.dtFimValFin;
                    deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + $filter('date')(controller.advancedSearch.dtFimValFin, 'shortDate');
                } else {
                    faixa = faixa + ';31/12/9999';
                    deate = deate + ' ' + $rootScope.i18n('l-to-end');
                }
                controller.addDisclaimer('dat-fim-validade', faixa, $rootScope.i18n('Dt Fim Validade: ') + deate);
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
                controller.addDisclaimer('cod-cond-pag', faixa, $rootScope.i18n('Condição de Pagamento: ') + deate);
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
                controller.addDisclaimer('nr-tabpre', faixa, $rootScope.i18n('Tabela de Preço: ') + deate);
            }

            if (controller.advancedSearch.codTranspIni || controller.advancedSearch.codTranspFin) {
                var faixa = '',
                    deate = ' ' + $rootScope.i18n('l-from-start');                 
                if (controller.advancedSearch.codTranspIni)  {
                    faixa = controller.advancedSearch.codTranspIni;
                    deate = controller.advancedSearch.codTranspIni;
                }
                if (controller.advancedSearch.codTranspFin) {
                    faixa = faixa + ';' + controller.advancedSearch.codTranspFin;
                    deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + controller.advancedSearch.codTranspFin;
                } else {
                    faixa = faixa + ';ZZZZZZZZ';
                    deate = deate + ' ' + $rootScope.i18n('l-to-end');
                }
                controller.addDisclaimer('cod-transp', faixa, $rootScope.i18n('Código do Transportador: ') + deate);
            }

            if (controller.advancedSearch.codRepIni || controller.advancedSearch.codRepFin) {
                var faixa = '',
                    deate = ' ' + $rootScope.i18n('l-from-start');                 
                if (controller.advancedSearch.codRepIni)  {
                    faixa = controller.advancedSearch.codTranspIni;
                    deate = controller.advancedSearch.codRepIni;
                }
                if (controller.advancedSearch.codRepFin) {
                    faixa = faixa + ';' + controller.advancedSearch.codRepFin;
                    deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + controller.advancedSearch.codRepFin;
                } else {
                    faixa = faixa + ';999';
                    deate = deate + ' ' + $rootScope.i18n('l-to-end');
                }
                controller.addDisclaimer('cod-rep', faixa, $rootScope.i18n('Código do Representante: ') + deate);
            }

        }

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
                controller.addDisclaimer('', '*' + controller.quickSearchText + '*', "Filtro Simples: " + controller.quickSearchText);
            }
            controller.loadData()
        }

        // remove um disclaimer
        this.removeDisclaimer = function (disclaimer) {
            // pesquisa e remove o disclaimer do array
            var index = controller.disclaimers.indexOf(disclaimer);

            if (disclaimer.property === 'cod-estabel') {
                controller.advancedSearch.estabelecIni = "";
                controller.advancedSearch.estabelecFin = "";
            } else if (disclaimer.property === 'cod-emitente') {
                controller.advancedSearch.codEmitIni = "";
                controller.advancedSearch.codEmitFin = "";
            } else if (disclaimer.property === 'nome-abrev') {
                controller.advancedSearch.nomeAbrevIni = "";
                controller.advancedSearch.nomeAbrevFin = "";
            } else if (disclaimer.property === 'cod-canal-venda') {
                controller.advancedSearch.codCanalVendaIni = "";
                controller.advancedSearch.codCanalVendaFin = "";
            } else if (disclaimer.property === 'dat-inic-validade') {
                controller.advancedSearch.dtIniValIni = "";
                controller.advancedSearch.dtIniValFin = "";
            } else if (disclaimer.property === 'dat-fim-validade') {
                controller.advancedSearch.dtFimValIni = "";
                controller.advancedSearch.dtFimValFin = "";
            } else if (disclaimer.property === 'cod-cond-pag') {
                controller.advancedSearch.codCondPagIni = "";
                controller.advancedSearch.codCondPagFin = "";
            } else if (disclaimer.property === 'nr-tabpre') {
                controller.advancedSearch.nrTabPreIni = "";
                controller.advancedSearch.nrTabPreFin = "";
            } else if (disclaimer.property === 'cod-transp') {
                controller.advancedSearch.codTranspIni = "";
                controller.advancedSearch.codTranspFin = "";
            } else if (disclaimer.property === 'cod-rep') {
                controller.advancedSearch.codRepIni = "";
                controller.advancedSearch.codRepFin = "";
            }

            if (index != -1) {
                controller.disclaimers.splice(index, 1);
            }

            // recarrega os dados quando remove um disclaimer
            controller.loadData();
        }

        // metodo de leitura dos dados
        this.loadData = function (isMore) {

            if (!isMore) {
                controller.listResult = [];
                controller.page = 1;
            } else {
                controller.page = controller.page + 1;
            }

            var filters = [];

            angular.forEach(controller.disclaimers, function (filter) {
                if (filter.property) {
                    var values = filter.value.split(";");
                    var obj = {
                        fieldName: filter.property,
                        valueInitial: values[0],
                        valueFinal: values[1]
                    }
                    filters.push(obj);
                }
            });

            var options = {
                page: controller.page,
                pageSize: controller.pageSize,
                filter: filters
            };

            if (controller.quickSearchText) {
                options.quickSearchText = controller.quickSearchText;
                controller.quickSearchText = "";
            }

            //Busca registros da grade
            appFactory.getRecords(options, function (result) {
                if (result.data) {
                    controller.listResult = controller.listResult.concat(result.data);
                    controller.hasNext = result.hasNext;
                }
            });
        }

        this.delete = function (record) {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question',
                text: $rootScope.i18n('l-confirm-delete-operation'),
                cancelLabel: 'l-no',
                confirmLabel: 'l-yes',
                callback: function (isPositiveResult) {
                    if (isPositiveResult) {

                        appFactory.deleteRecord({
                            estabel: record['cod-estabel'],
                            canal: record['cod-canal-venda'],
                            emitente: record['cod-emitente'],
                            data: controller.convertDate(record['dat-inic-validade'])
                        }, function (result) {
                            if (result) {

                                var index = controller.listResult.indexOf(record);

                                if (index != -1) {
                                    controller.listResult.splice(index, 1);

                                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                        type: 'success',
                                        title: $rootScope.i18n('l-relac-customer-establishment'),
                                        detail: $rootScope.i18n('l-relac-customer-establishment') + " " + $rootScope.i18n('l-success-deleted') + '!'
                                    });
                                }
                            }
                        })
                    }
                }
            });
        }

        this.convertDate = function convertDate(date) {
            return date = $filter('date')(date, 'dd-MM-yyyy');
        }

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
        this.init = function () {           
            if (appViewService.startView($rootScope.i18n('l-relac-customer-establishment'), 'mpd.relatcustomerchannelestab-list.Control', controller)) {
                // se é a abertura da tab, implementar aqui inicialização do controller
            }
            // realiza a busca de dados inicial
            this.loadData(false);
            // chama um ponto da EPC para customizar a inicialização da tela.
            customizationService.callEvent('mpd.relatcustomerchannelestabrelatcustomerchannelestab', 'initEvent', controller);
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


    relatcustomerchannelestabDetailController.$inject = ['$rootScope',
        '$scope',
        '$stateParams',
        '$state',
        '$timeout',
        '$filter',
        'totvs.app-main-view.Service',
        'dts-utils.relatcustomerchannelestab.Factory',
        'TOTVSEvent'
    ];

    function relatcustomerchannelestabDetailController($rootScope, $scope, $stateParams, $state, $timeout, $filter, appViewService, appFactory, TOTVSEvent) {

        var controller = this;

        this.model = {};

        this.getUrlEncode = function (value) {
            value = window.encodeURIComponent(value);
            value = controller.replaceAllString(value, '.', '%2E');
            return value;
        };

        this.replaceAllString = function (str, find, replace) {
            return str.replace(find, replace);
        }

        this.convertDate = function convertDate(date) {
            return date = $filter('date')(date, 'dd-MM-yyyy');
        }

        this.load = function (estabel, canal, emitente, data) {
            this.model = {};
            appFactory.getRecord({
                estabel: estabel,
                canal: canal,
                emitente: emitente,
                data: data
            }, function (result) {
                if (result.data) {
                    $timeout(function () {
                        controller.model = {};
                        controller.model = result.data[0];
                    }, 500);
                }
            });
        }

        this.redirectList = function () {
            $state.go('dts/mpd/relatcustomerchannelestab.start');
        }

        this.onRemove = function () {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question',
                text: $rootScope.i18n('l-confirm-delete-operation'),
                cancelLabel: 'l-no',
                confirmLabel: 'l-yes',
                callback: function (isPositiveResult) {
                    if (isPositiveResult) {

                        appFactory.deleteRecord({
                            estabel: controller.model['cod-estabel'],
                            canal: controller.model['cod-canal-venda'],
                            emitente: controller.model['cod-emitente'],
                            data: controller.convertDate(controller.model['dat-inic-validade'])
                        }, function (result) {
                            if (result) {
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type: 'success', 
                                    title:  $rootScope.i18n('l-relac-customer-establishment'), 
                                    detail: $rootScope.i18n('l-relac-customer-establishment') + ' ' +
                                            $rootScope.i18n('l-success-deleted') + '!'
                                });
                                controller.redirectList();
                            }
                        })
                    }
                }
            });
        }

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        this.init = function () {
            if ($stateParams && $stateParams.estabel, $stateParams.canal, $stateParams.emitente, $stateParams.data) {
                this.load($stateParams.estabel, $stateParams.canal, $stateParams.emitente, $stateParams.data);
            }
        }

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

    relatcustomerchannelestabEditController.$inject = [
        '$rootScope',
        '$scope',
        '$modal',
        '$state',
        'totvs.app-main-view.Service',
        'customization.generic.Factory',
        'dts-utils.relatcustomerchannelestab.Factory',
        '$stateParams', '$filter', '$timeout', 'TOTVSEvent'
    ];

    function relatcustomerchannelestabEditController($rootScope, $scope, $modal, $state, appViewService, customizationService, appFactory, $stateParams, $filter, $timeout, TOTVSEvent) {

        var controller = this;

        this.model = {};

        this.disabledKeyField = $state.is('dts/mpd/relatcustomerchannelestab.edit');

        this.getUrlEncode = function (value) {
            value = window.encodeURIComponent(value);
            value = controller.replaceAllString(value, '.', '%2E');
            return value;
        };

        this.replaceAllString = function (str, find, replace) {
            return str.replace(find, replace);
        }

        if (this.disabledKeyField) {
            this.title = $rootScope.i18n('l-editar');
        } else {
            this.title = $rootScope.i18n('l-novo-registro');
        }

        // *********************************************************************************
        // *** Methods
        // *********************************************************************************

        this.load = function (estabel, canal, emitente, data) {
            appFactory.getRecord({
                estabel: estabel,
                canal: canal,
                emitente: emitente,
                data: data
            }, function (result) {
                if (result.data) {
                    $timeout(function () {
                        controller.model = {};
                        controller.model = result.data[0];
                    }, 500);
                }
            });
        }

        this.save = function () {
            this.beforeSave(false);
        }

        this.saveNew = function () {
            this.beforeSave(true);
        }

        this.beforeSave = function (saveNew) {

            if (this.isInvalidForm()) {
                return;
            }

            var modelFinal = {};

            modelFinal['cod-estabel'] = this.model['cod-estabel'] != undefined ? this.model['cod-estabel'] : "";
            modelFinal['cod-canal-venda'] = this.model['cod-canal-venda'] != undefined ? this.model['cod-canal-venda'] : 0;
            modelFinal['cod-emitente'] = this.model['cod-emitente'] != undefined ? this.model['cod-emitente'] : 0;
            modelFinal['nome-abrev'] = this.model['nome-abrev'] != undefined ? this.model['nome-abrev'] : "";
            modelFinal['dat-inic-validade'] = this.model['dat-inic-validade'] != undefined ? $filter('date')(this.model['dat-inic-validade'], 'yyyy/MM/dd') : $filter('date')(new Date, 'yyyy/MM/dd')
            modelFinal['dat-fim-validade'] = this.model['dat-fim-validade'] != undefined ? $filter('date')(this.model['dat-fim-validade'], 'yyyy/MM/dd') : $filter('date')(new Date, 'yyyy/MM/dd')
            modelFinal['cod-cond-pag'] = this.model['cod-cond-pag'] != undefined ? this.model['cod-cond-pag'] : 0;
            modelFinal['bonificacao'] = this.model['bonificacao'] != undefined ? this.model['bonificacao'] : 0;
            modelFinal['nr-tabpre'] = this.model['nr-tabpre'] != undefined ? this.model['nr-tabpre'] : "";
            modelFinal['cod-transp'] = this.model['cod-transp'] != undefined ? this.model['cod-transp'] : 0;
            modelFinal['cod-rep'] = this.model['cod-rep'] != undefined ? this.model['cod-rep'] : 0;
            modelFinal['val-perc-comis'] = this.model['val-perc-comis'] != undefined ? this.model['val-perc-comis'] : 0;
            modelFinal['val-comis-emis'] = this.model['val-comis-emis'] != undefined ? this.model['val-comis-emis'] : 0;

            if ($state.is('dts/mpd/relatcustomerchannelestab.edit')) {
                appFactory.putRecord(modelFinal, function (result) {
                    controller.onSaveUpdate(true, saveNew, result);
                });
            } else {
                appFactory.postRecord(modelFinal, function (result) {
                    controller.onSaveUpdate(false, saveNew, result);
                });
            }
        }

        this.onSaveUpdate = function (isUpdate, saveNew, result) {

            if (!result.$hasError) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'success',
                    title: $rootScope.i18n('l-relac-customer-establishment'),
                    detail: $rootScope.i18n('l-relac-customer-establishment') + " " + (isUpdate ? $rootScope.i18n('l-success-updated') : $rootScope.i18n('l-success-created')) + '!'
                });

                if (saveNew) {
                    controller.init();
                } else {
                    controller.redirectList();
                }
            }
        }

        this.cancel = function () {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question',
                text: $rootScope.i18n('l-cancel-operation'),
                cancelLabel: 'l-no',
                confirmLabel: 'l-yes',
                callback: function (isPositiveResult) {
                    if (isPositiveResult) {
                        controller.redirectList();
                    }
                }
            });
        }

        this.getDefault = function () {
            if (!this.disabledKeyField) {
                if (controller.model['cod-canal-venda'] != 0 && controller.model['cod-canal-venda'] != undefined &&
                    controller.model['cod-emitente'] != 0 && controller.model['cod-emitente'] != undefined) {
                    // Busca os defaults do cadastro de Canal de Venda
                    appFactory.returnCustomerDefault({
                        canal: controller.model['cod-canal-venda'],
                        cliente: controller.model['cod-emitente']
                    }, function (result) {
                        $timeout(function () {
                            controller.model['bonificacao'] = result.data[0]['bonificacao'] !== 0 ? result.data[0]['bonificacao'] : controller.model['bonificacao'];
                            controller.model['cod-cond-pag'] = result.data[0]['cod-cond-pag'] !== 0 ? result.data[0]['cod-cond-pag'] : result.data[0]['cod-cond-pag'];
                            controller.model['cod-transp'] = result.data[0]['cod-transp'] !== 0 ? result.data[0]['cod-transp'] : controller.model['cod-transp'];
                            controller.model['cod-rep'] = result.data[0]['cod-rep'] !== 0 ? result.data[0]['cod-rep'] : controller.model['cod-rep'];
                            controller.model['dat-fim-validade'] = (result.data[0]['dat-fim-validade'] !== '' && result.data[0]['dat-fim-validade'] !== null)   ? new Date(result.data[0]['dat-fim-validade']) : controller.model['dat-fim-validade'];
                            controller.model['nr-tabpre'] = result.data[0]['nr-tabpre'] !== '' ? result.data[0]['nr-tabpre'] : controller.model['nr-tabpre'];
                            controller.model['val-comis-emis'] = result.data[0]['val-comis-emis'] !== 0 ? result.data[0]['val-comis-emis'] : controller.model['val-comis-emis'];
                            controller.model['val-perc-comis'] = result.data[0]['val-perc-comis'] !== 0 ? result.data[0]['val-perc-comis'] : controller.model['val-perc-comis'];
                        }, 200);
                    })
                }
            }
        }

        this.isInvalidForm = function () {
            var fields = "";
            var messages = [];
            var isInvalidForm = false;

            if ((this.model['cod-estabel'] === undefined) || (this.model['cod-estabel'] === '')) {
                isInvalidForm = true;
                messages.push('Estabelecimento');
            }

            if ((this.model['cod-canal-venda'] === undefined) || (this.model['cod-canal-venda'] === '')) {
                isInvalidForm = true;
                messages.push('Canal de Venda');
            }

            if ((this.model['cod-emitente'] === undefined) || (this.model['cod-emitente'] === '')) {
                isInvalidForm = true;
                messages.push('Emitente');
            }

            if ((this.model['dat-inic-validade'] === undefined) || (this.model['dat-inic-validade'] === '')) {
                isInvalidForm = true;
                messages.push('Dt Início de Validade');
            }

            if ((this.model['dat-fim-validade'] === undefined) || (this.model['dat-fim-validade'] === '')) {
                isInvalidForm = true;
                messages.push('Dt Fim de Validade');
            }

            if ((this.model['cod-transp'] === undefined) || (this.model['cod-transp'] === '')) {
                isInvalidForm = true;
                messages.push('Transportador');
            }

            if ((this.model['cod-rep'] === undefined) || (this.model['cod-rep'] === '')) {
                isInvalidForm = true;
                messages.push('Representante');
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

        this.redirectList = function () {
            $state.go('dts/mpd/relatcustomerchannelestab.start');
        }


        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        this.init = function () {

            this.disabledKeyField = $state.is('dts/mpd/relatcustomerchannelestab.edit');

            if (this.disabledKeyField) {
                this.load($stateParams.estabel, $stateParams.canal, $stateParams.emitente, $stateParams.data);
            } else {
                controller.model = {};
                controller.model['cod-estabel'] = "";
                controller.model['cod-emitente'] = "";
                controller.model['dat-inic-validade'] = new Date();
                controller.model['dat-fim-validade'] = new Date();
                controller.model['cod-cond-pag'] = "";
                controller.model['bonificacao'] = "";
                controller.model['nr-tabpre'] = "";
                controller.model['cod-transp'] = "";
                controller.model['cod-rep'] = "";
                controller.model['val-perc-comis'] = "";
                controller.model['val-comis-emis'] = "";
            }
        }

        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) {
            controller.init();
        }

        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************

        // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        }); 

    };

    relatcustomerchannelestabSearchController.$inject = ['$modalInstance', 'model'];    
    function relatcustomerchannelestabSearchController($modalInstance, model) {

                
        this.advancedSearch = model;                 
        this.search = function () {            
            $modalInstance.close();        
        }                 
        this.close = function () {            
            $modalInstance.dismiss();        
        }
    };

    // registrar os controllers no angular        
    index.register.controller('mpd.relatcustomerchannelestab-list.Control', relatcustomerchannelestabListController);    
    index.register.controller('mpd.relatcustomerchannelestab-edit.Control', relatcustomerchannelestabEditController);    
    index.register.controller('mpd.relatcustomerchannelestab-detail.Control', relatcustomerchannelestabDetailController);    
    index.register.controller('mpd.relatcustomerchannelestab-search.Control', relatcustomerchannelestabSearchController);

});