define(['index',
    '/dts/hgp/html/hrc-importInsumos/importInsumosFactory.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/global/gpsScheduleTotvs.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/global/sharedGlobalFactory.js',
    '/dts/hgp/html/global-parameters/parametersFactory.js'
], function(index) {

    importInsumosMainController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service', 'hrc.importInsumos.Factory', 
    'global.userConfigs.Factory', '$modal', 'AbstractAdvancedFilterController', 
    'TOTVSEvent', '$location', '$timeout', '$anchorScroll', 'shared.global.Factory', 'dts-utils.utils.Service'];
    function importInsumosMainController($rootScope, $scope, $state, $stateParams, appViewService, importInsumosFactory,
        userConfigsFactory, $modal, AbstractAdvancedFilterController,
        TOTVSEvent, $location, $timeout, $anchorScroll, sharedGlobalFactory, dtsUtils) {

        var _self = this;

        _self.dadosTela = {};

        _self.options = {};
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

        this.irPara = function (local) {
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash(local);

            // call $anchorScroll()
            $anchorScroll();
        }

        this.generate = function() {
            if (!_self.checkFields()) {
                return;
            }

            _self.rpw = dtsUtils.mountExecution(_self.execution, _self.schedule, _self.dadosTela.servidor);

            _self.parametros = {};
            _self.parametros.arquivo                = _self.execution.filename;
            _self.parametros.dtInicioVig            = _self.dadosTela.dtInicioVig;
            _self.parametros.dtFimVig               = _self.dadosTela.dtFimVig;
            _self.parametros.dtLimiteMoeda          = _self.dadosTela.dtLimiteMoeda;
            _self.parametros.dtLimiteTabela         = _self.dadosTela.dtLimiteTabela;
            _self.parametros.tpBuscaDataLimiteMoeda = _self.dadosTela.tpBuscaDataLimiteMoeda;

            importInsumosFactory.criaPedidoExec(_self.parametros, _self.rpw, function(result) {
                if (angular.isUndefined(result.$hasError) || !result.$hasError) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Operação concluída com sucesso!'
                    });
                }
            });
        }

        this.checkFields = function() {
            var camposOk = true;
            var mensagem = [];

            if (_self.dadosTela.nmLayout == "Deve ser parametrizado") {
                camposOk = false;
                mensagem.push("Layout de importação deve ser parametrizado");
            }
            if (!_self.dadosTela.dtInicioVig) {
                camposOk = false;
                mensagem.push('Data de início de vigência não informada');
            } 
            if (!_self.dadosTela.dtFimVig) {
                camposOk = false;
                mensagem.push('Data de fim de vigência não informada');
            }
            if (_self.dadosTela.tpBuscaDataLimiteMoeda == 'INFORMADA'
            && !_self.dadosTela.dtLimiteMoeda) {
                camposOk = false;
                mensagem.push('Data limite Informada não foi preenchida');
            }
            if (!_self.dadosTela.dtLimiteTabela) {
                camposOk = false;
                mensagem.push('Data limite para tabela de moedas não informada');
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

            if (!camposOk) {
                mensagem.forEach(function (element) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title: element
                    });
                }, this);
            }

            return camposOk;
        }

        this.onChangeTpBuscaDataLimiteMoeda = function () {
            if (_self.dadosTela.tpBuscaDataLimiteMoeda == 'ARQUIVO'){
                _self.dadosTela.dtLimiteMoeda = undefined;
            }else{
                _self.dadosTela.dtLimiteMoeda = new Date().getTime();
            }

        };

        this.init = function () {
            appViewService.startView("Importação Insumos", 'hrc.importInsumosMain.Control', _self);
            if (appViewService.lastAction != 'newtab') {
                return;
            }

            _self.execution = {};
            _self.execution.filename = "ImportInsumos";

            _self.dadosTela.dtInicioVig = new Date().getTime();
            _self.dadosTela.dtFimVig = new Date().getTime();
            _self.dadosTela.dtLimiteMoeda = new Date().getTime();
            _self.dadosTela.dtLimiteTabela = new Date().getTime();
            _self.dadosTela.tpBuscaDataLimiteMoeda = 'INFORMADA';

            importInsumosFactory.carregaDadosPadrao(function (result) {
                if (result[0]) {
                    _self.nmLayout = result[0].nmLayout;
                }
            });
        }

        if ($rootScope.currentuserLoaded) {
            this.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }
    }

    index.register.controller('hrc.importInsumosMain.Control', importInsumosMainController);
});