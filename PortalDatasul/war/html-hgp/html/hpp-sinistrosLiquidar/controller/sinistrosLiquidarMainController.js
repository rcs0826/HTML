define(['index',
    '/dts/hgp/html/hpp-sinistrosLiquidar/sinistrosLiquidarFactory.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/global/gpsScheduleTotvs.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/global/sharedGlobalFactory.js',
    '/dts/hgp/html/global-parameters/parametersFactory.js'
], function(index) {

    sinistrosLiquidarMainController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service', 'hpp.sinistrosLiquidar.Factory', 
    'global.userConfigs.Factory', '$modal', 'AbstractAdvancedFilterController', 
    'TOTVSEvent', '$location', '$timeout', '$anchorScroll', 'shared.global.Factory', 'dts-utils.utils.Service'];
    function sinistrosLiquidarMainController($rootScope, $scope, $state, $stateParams, appViewService, sinistrosLiquidarFactory,
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

        this.init = function () {
            appViewService.startView("Sinistros a Liquidar", 'hpp.sinistrosLiquidarMain.Control', _self);
            if (appViewService.lastAction != 'newtab') {
                return;
            }

            _self.dadosTela.lgGerarCSV = false;
            _self.dadosTela.nmArquivoCSV = "";

            _self.dadosTela.dtContabilizacao = {startDate: new Date(), 
                                                endDate: new Date()};
            _self.dadosTela.dtLimite = new Date();

            _self.execution = {};
            _self.execution.filename = "SinistrosLiquidar";
            _self.dadosTela.nmArquivoCSV = "SinistrosLiquidar";
        }

        if ($rootScope.currentuserLoaded) {
            this.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }

        this.generate = function() {
            if (!_self.checkFields()) {
                return;
            }

            _self.parametros = {};
            _self.rpw = dtsUtils.mountExecution(_self.execution, _self.schedule, _self.dadosTela.servidor);

            console.log(_self.schedule);
            console.log(_self.execution);
            console.log(_self.rpw);

            _self.parametros.arquivo             = _self.execution.filename;
            _self.parametros.lgGerarCSV          = _self.dadosTela.lgGerarCSV;
            _self.parametros.nmArquivoCSV        = _self.dadosTela.nmArquivoCSV;
            _self.parametros.dtContabilizacaoIni = _self.dadosTela.dtContabilizacao.startDate;
            _self.parametros.dtContabilizacaoFim = _self.dadosTela.dtContabilizacao.endDate;
            _self.parametros.dtLimite            = _self.dadosTela.dtLimite;

            console.log(_self.parametros);
            
            sinistrosLiquidarFactory.generate(_self.parametros, _self.rpw, function(result){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'success', title: 'Operação concluída com sucesso!'
                });
            });
        }

        this.checkFields = function() {
            var camposOk = true;
            var mensagem = [];

            if (_self.dadosTela.lgGerarCSV && _self.dadosTela.nmArquivoCSV == "") {
                camposOk = false;
                mensagem.push('Arquivo .CSV não informado');
            }

            if (_self.dadosTela.dtContabilizacao == null
                || _self.dadosTela.dtContabilizacao.startDate == null
                || _self.dadosTela.dtContabilizacao.endDate == null) {
                camposOk = false;
                mensagem.push('Data Contabilização não informada');
            }

            if (_self.dadosTela.dtLimite == null) {
                camposOk = false;
                mensagem.push('Data Limite não informada');
            }

            if (_self.execution.filename == "") {
                camposOk = false;
                mensagem.push("Nome do arquivo de saída não informado");
            }

            if (_self.dadosTela.servidor == undefined) {
                camposOk = false;
                mensagem.push("Servidor de Execução não informado");
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
    }

    index.register.controller('hpp.sinistrosLiquidarMain.Control', sinistrosLiquidarMainController);
});