define(['index',
    '/dts/mmi/js/api/fch/fchmip/fchmiplog.js',
    '/dts/mmi/js/utils/filters.js',
    '/dts/mmi/js/zoom/mi-espec.js'
], function (index) {

    logListCtrl.$inject = [
        '$rootScope',
        '$scope',
        '$modal',
        'totvs.app-main-view.Service',
        'fchmip.log.Factory',
        'TOTVSEvent'
    ];

    function logListCtrl($rootScope,
        $scope,
        $modal,
        appViewService,
        logService,
        TOTVSEvent) {

        var controller = this;
        
        var init = function () {
            var createTab = appViewService.startView($rootScope.i18n('l-pending-log'), 'mmi.log.ListCtrl', controller);
            previousView = appViewService.previousView;

            if (!this.advancedSearch) {
                this.advancedSearch = {};
                this.advancedSearch = {
                    accord: {
                        pendencia: true,
                        parametros: false
                    }
                }
                this.advancedSearch.logApontamentoMobMi = true;
                this.advancedSearch.logApontamentoMobFrotas = true;
                this.advancedSearch.logCriacaoOm = true;
                this.advancedSearch.logSolicitacaoServico = true;
                this.advancedSearch.logEncerramentoOm = true
            }

            if (previousView.controller) {
                if (createTab === false) {
                    return;
                }
            }

            controller.buscaDadosLog();
        }

        controller.buscaDadosLog = function (buscarMais) {

            if (!buscarMais) {
                controller.listResult = [];
                controller.totalRecords = 0;
                controller.ttParametrosBusca = {
                    'filtro': 1,
                    'startAt': buscarMais === true ? controller.listResult.length + 1 : 1
                }
            } else {
                controller.ttParametrosBusca.filtro = controller.ttParametrosBusca.filtro;
                controller.ttParametrosBusca.startAt = buscarMais === true ? controller.listResult.length + 1 : 1;
            }

            logService.buscaDadosLog({ "ttParametrosBusca": controller.ttParametrosBusca }, buscaDadosLogCallabck);
        }

        var buscaDadosLogCallabck = function (result) {
            controller.listResult = controller.listResult.concat(result.ttLog);
            controller.totalRecords = controller.listResult.length;
            controller.paginate = result.ttPaginacao[0].paginate;

            if (controller.paginate) controller.totalRecords += "+";
        }

        controller.editarLog = function (log, consulta) {
            var model = angular.copy(log);
            var templateUrl = "";

            model.consulta = consulta;

            if (log.origem === 1 || log.origem === 2) {
                templateUrl = '/dts/mmi/html/log/log.edit.html'
            } else if (log.origem === 3) {
                templateUrl = '/dts/mmi/html/log/log.order.edit.html'
            } else if (log.origem === 4) {
                templateUrl = '/dts/mmi/html/log/log.servicerequest.edit.html'
            } else if (log.origem === 5) {
                templateUrl = '/dts/mmi/html/log/log.roteiro.edit.html'
            } else if (log.origem === 7) {
                templateUrl = '/dts/mmi/html/log/log.order.encerrar.edit.html'
            }


            var modalInstance = $modal.open({
                templateUrl: templateUrl,
                controller: 'mmi.log.EditCtrl as controller',
                size: 'lg',
                backdrop: 'static',
                keyboard: true,
                resolve: {
                    model: function () {
                        return model;
                    }
                }
            });

            modalInstance.result.then(function () {
                atualizaLista(log);

                if (log.origem === 3) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success',
                        title: $rootScope.i18n('msg-record-reprocess'),
                        detail: ($rootScope.i18n('msg-success-order-created-number', model.nrDocumento))
                    });
                } else if (log.origem === 4) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success',
                        title: $rootScope.i18n('msg-record-reprocess'),
                        detail: ($rootScope.i18n('msg-success-service-request-created-number', model.nrDocumento))
                    });
                } else {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success',
                        title: $rootScope.i18n('msg-record-reprocess'),
                        detail: $rootScope.i18n('msg-record-success-reprocess')
                    });
                }
            });
        }

        controller.removerLog = function (log) {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question',
                text: $rootScope.i18n('msg-confirm-delete-pending', [log.programa, log.nrOrdProdu]),
                cancelLabel: 'l-no',
                confirmLabel: 'l-yes',
                callback: function (isPositiveResult) {
                    if (isPositiveResult) {
                        logService.removerLog(log.id, function (result) {
                            if (result) removerLogCallback(log);
                        });
                    }
                }
            });
        }

        var removerLogCallback = function (log) {
            atualizaLista(log);
            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type: 'success',
                title: $rootScope.i18n('msg-record-deleted'),
                detail: $rootScope.i18n('msg-record-success-deleted')
            });
        }

        this.openAdvancedSearch = function () {
            controller.quickSearchText = "";

            var modalInstance = $modal.open({
                templateUrl: '/dts/mmi/html/log/buscaavancada.html',
                controller: 'mmi.log.BuscaCtrl as controller',
                size: 'lg',
                backdrop: 'static',
                keyboard: true,
                resolve: {
                    model: function () {
                        return this.advancedSearch;
                    }
                }
            });

            modalInstance.result.then(function (retorno) {
                controller.ttParametrosBusca = {};
                controller.ttParametrosBusca = {
                    'numeroDocumento': retorno.numeroDocumento == undefined ? controller.quickSearchText : retorno.numeroDocumento,
                    'codigoUsuario': retorno.codigoUsuario,
                    'codigEstabelecimento': retorno.codigEstabelecimento,
                    'logApontamentoMobMi': retorno.logApontamentoMobMi == undefined ? false : retorno.logApontamentoMobMi,
                    'logApontamentoMobFrotas': retorno.logApontamentoMobFrotas == undefined ? false : retorno.logApontamentoMobFrotas,
                    'logCriacaoOm': retorno.logCriacaoOm == undefined ? false : retorno.logCriacaoOm,
                    'logSolicitacaoServico': retorno.logSolicitacaoServico == undefined ? false : retorno.logSolicitacaoServico,
                    'logEncerramentoOm': retorno.logEncerramentoOm == undefined ? false : retorno.logEncerramentoOm,
                    'startDate': !retorno.dateRange ? "" : retorno.dateRange.startDate,
                    'endDate': !retorno.dateRange ? "" : retorno.dateRange.endDate,
                    'filtro': 3,
                    'startAt': 1
                }
                controller.listResult = [];
                controller.totalRecords = 0;
                logService.buscaDadosLog({ "ttParametrosBusca": controller.ttParametrosBusca }, buscaDadosLogCallabck);
            });
        }

        controller.search = function () {
            controller.listResult = [];
            controller.totalRecords = 0;

            if (controller.valorDaBusca) {
                controller.ttParametrosBusca = {
                    'numeroDocumento': controller.valorDaBusca,
                    'codigoUsuario': controller.valorDaBusca,
                    'filtro': 2,
                    'startAt': 1
                }
            } else {
                controller.ttParametrosBusca = {
                    'filtro': 1,
                    'startAt': 1
                }
            }

            logService.buscaDadosLog({ "ttParametrosBusca": controller.ttParametrosBusca }, buscaDadosLogCallabck);
        }

        var atualizaLista = function (log) {
            var index = controller.listResult.indexOf(log);
            controller.listResult.splice(index, 1);
            controller.totalRecords = controller.listResult.length;
            if (controller.paginate) controller.totalRecords += "+";
        }

        if ($rootScope.currentuserLoaded) { init(); }

        $scope.$on('$destroy', function () {
            controller = undefined;
        });
    }

    logBuscaCtrl.$inject = [
        '$modalInstance',
        'model',
        '$rootScope',
        'TOTVSEvent'
    ];

    function logBuscaCtrl(
        $modalInstance,
        model,
        $rootScope,
        TOTVSEvent) {

        this.closeOther = false;

        this.advancedSearch = model;

        this.pesquisar = function () {
            this.validaPendenciaMarcada();
            if (this.close === true) {
                $modalInstance.close(this.advancedSearch);
            }
        }

        this.validaPendenciaMarcada = function () {
            this.close = true;
            if (this.advancedSearch.logApontamentoMobMi === false
                && this.advancedSearch.logApontamentoMobFrotas === false
                && this.advancedSearch.logCriacaoOm === false
                && this.advancedSearch.logSolicitacaoServico === false
                && this.advancedSearch.logEncerramentoOm === false) {

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-attention'),
                    detail: $rootScope.i18n('l-pendencia-selecionada')
                });
                this.close = false;
            }

        };

        this.cancelar = function () {
            $modalInstance.dismiss('cancel');
        }
    }
    index.register.controller('mmi.log.ListCtrl', logListCtrl);
    index.register.controller('mmi.log.BuscaCtrl', logBuscaCtrl);
});