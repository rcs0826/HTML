define(['index',
    '/dts/hgp/html/hrc-avisoCobranca/avisoCobrancaFactory.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/global/gpsScheduleTotvs.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/global/sharedGlobalFactory.js',
    '/dts/hgp/html/global-parameters/parametersFactory.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    avisoCobrancaMainController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service',
        'hrc.avisoCobranca.Factory', 'global.userConfigs.Factory',
        '$modal', 'AbstractAdvancedFilterController', 'TOTVSEvent', '$location', '$timeout', '$anchorScroll', 'shared.global.Factory',
        'dts-utils.utils.Service'];
    function avisoCobrancaMainController($rootScope, $scope, $state, $stateParams, appViewService, avisoCobrancaFactory,
        userConfigsFactory, $modal, AbstractAdvancedFilterController,
        TOTVSEvent, $location, $timeout, $anchorScroll, sharedGlobalFactory, dtsUtils) {

        var _self = this;

        _self.dadosTela = {}
        _self.options = {};
        _self.execution = {};
        _self.dadosTela.lgDownloadCMBA520 = false;
        _self.dadosTela.lgDownloadCMBA525 = false;
        _self.dadosTela.lgImportarAvisos = true;
        _self.dadosTela.lgUploadResposta = true;
        _self.dadosTela.dataInicial = new Date();
        _self.dadosTela.dataFinal = new Date();

        _self.options.servidores = {
            transport: {
                read: {
                    url: '../dts/datasul-rest/resources/api/fch/fchsau/shared/fchsausharedglobal/getRpwServers/',
                    dataType: 'json'
                }
            },
            serverFiltering: true,
            schema: {
                data: 'data'
            }
        };

        this.init = function () {
            appViewService.startView("Importação de Aviso de Cobrança", 'hrc.avisoCobrancaMain.Control', _self);
            if (appViewService.lastAction != 'newtab') {
                return;
            }

            _self.execution.filename = "IMPORTACAO-A520";
        };

        this.irPara = function (local) {
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash(local);

            // call $anchorScroll()
            $anchorScroll();

        };

        this.onChangeRangeUnidadeOrigem = function (event) {
            function changeField() {
                _self.tmpUnidadeOrigemFiltrada = _self.tmpUnidadeOrigem.filter(function (unidade) {
                    return unidade.cdUnidade >= _self.dadosTela.cdUnidadeOrigemInic && unidade.cdUnidade <= _self.dadosTela.cdUnidadeOrigemFim;
                });
            }
            //o onChange roda antes do data bind, o timeout 0 faz com que o bind rode antes e o valor seja  atualizado
            $timeout(changeField, 0);
        };

        this.onChangeRangeUnidadeDestino = function (event) {
            function changeField() {
                _self.tmpUnidadeDestinoFiltrada = _self.tmpUnidadeDestino.filter(function (unidade) {
                    return unidade.cdUnidade >= _self.dadosTela.cdUnidadeDestinoInic && unidade.cdUnidade <= _self.dadosTela.cdUnidadeDestinoFim;
                });
            }
            //o onChange roda antes do data bind, o timeout 0 faz com que o bind rode antes e o valor seja  atualizado
            $timeout(changeField, 0);
        };

        this.onChangeCheckDownload = function (event) {

            if (_self.dadosTela.lgDownloadCMBA520 == false && _self.dadosTela.lgDownloadCMBA525 == false) {
                return;
            }

            _self.dadosTela.cdUnidadeOrigemInic = "1";
            _self.dadosTela.cdUnidadeOrigemFim = "9999";
            _self.dadosTela.cdUnidadeDestinoInic = "1";
            _self.dadosTela.cdUnidadeDestinoFim = "9999";
            _self.dadosTela.dataInicial.setDate(_self.dadosTela.dataInicial.getDate());
            _self.dadosTela.dataFinal.setDate(_self.dadosTela.dataFinal.getDate());

            if (_self.tmpUnidadeOrigem == undefined ||
                _self.tmpUnidadeDestino == undefined) {
                avisoCobrancaFactory.getInitialTemps(function (result) {
                    _self.tmpUnidadeOrigem = angular.copy(result);
                    _self.tmpUnidadeDestino = angular.copy(result);
                    _self.onChangeRangeUnidadeOrigem();
                    _self.onChangeRangeUnidadeDestino();
                });
            }
        };

        this.filterSelected = function (item) {
            return item.$selected;
        }

        this.generate = function () {

            _self.parametros = {};
            _self.rpw = {};

            if (_self.dadosTela.lgDownloadCMBA520.selected == true || _self.dadosTela.lgDownloadCMBA525.selected == true
                || _self.dadosTela.lgDownloadCMBA520 == true || _self.dadosTela.lgDownloadCMBA525 == true) {
                _self.tmpUnidadeOrigemPar = _self.tmpUnidadeOrigemFiltrada.filter(_self.filterSelected);
                _self.tmpUnidadeDestinoPar = _self.tmpUnidadeDestinoFiltrada.filter(_self.filterSelected);
            }

            if (!_self.checkFields()) {
                return;
            }

            _self.rpw = dtsUtils.mountExecution(_self.execution, _self.schedule, _self.dadosTela.servidor);

            _self.parametros.nmArquivoSaida = _self.execution.filename;
            _self.parametros.lgImportarAvisos = _self.dadosTela.lgImportarAvisos;
            _self.parametros.lgDownloadCMBA520 = _self.dadosTela.lgDownloadCMBA520;
            _self.parametros.lgDownloadCMBA525 = _self.dadosTela.lgDownloadCMBA525;
            _self.parametros.lgUploadResposta = _self.dadosTela.lgUploadResposta
            _self.parametros.dataInicial = _self.dadosTela.dataInicial;
            _self.parametros.dataFinal = _self.dadosTela.dataFinal;

            avisoCobrancaFactory.criaPedidoExec(_self.parametros, _self.rpw, _self.tmpUnidadeOrigemPar, _self.tmpUnidadeDestinoPar,
                function (result) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Gerado pedido RPW Nº: ' + result.nrPedido
                    });
                });
        };

        this.checkFields = function () {

            var camposOk = true;
            var mensagem = [];

            if (_self.filtersForm.$invalid) {
                _self.filtersForm.$setDirty();
                angular.forEach(_self.filtersForm, function (value, key) {
                    if (typeof value === 'object' && value.hasOwnProperty('$modelValue')) {
                        value.$setDirty();
                    }
                });
            }

            if (_self.dadosTela.lgImportarAvisos == false &&
                _self.dadosTela.lgDownloadCMBA520 == false &&
                _self.dadosTela.lgDownloadCMBA525 == false &&
                _self.dadosTela.lgUploadResposta == false) {
                camposOk = false;
                mensagem.push('Ao menos uma opção de ação deve ser selecionada (Importação ou Download');
            }

            if (!_self.dadosTela.servidor) {
                camposOk = false;
                mensagem.push('Servidor de execução não informado');
            }
            if (!_self.execution.filename) {
                camposOk = false;
                mensagem.push("Nome do arquivo de saída não informado");
            }
            if (_self.execution.schedule.type == "DATE") {
                if (!_self.execution.schedule.date) {
                    camposOk = false;
                    mensagem.push("Data e hora do agendamento não informadas");
                }
            }

            if (_self.dadosTela.lgDownloadCMBA520.selected == true || _self.dadosTela.lgDownloadCMBA525.selected == true) {

                if (_self.dadosTela.dataInicial == null) {
                    camposOk = false;
                    mensagem.push('Data Inicial de Envio não informada.');
                }
                if (_self.dadosTela.dataFinal == null) {
                    camposOk = false;
                    mensagem.push('Data Final de Envio não informada.');
                }
                if (_self.tmpUnidadePar.length == 0) {
                    camposOk = false;
                    mensagem.push('Ao menos uma unidade deve ser selecionada');
                }
            }

            if (!camposOk) {
                mensagem.forEach(function (element) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title: element
                    });
                }, this);
            }

            return camposOk;
        }

        if ($rootScope.currentuserLoaded) {
            this.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }
    }

    index.register.controller('hrc.avisoCobrancaMain.Control', avisoCobrancaMainController);

});


