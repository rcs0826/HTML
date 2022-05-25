define(['index',
    '/dts/hgp/html/hfp-saldosProvisaoReceita/saldosProvisaoReceitaFactory.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/global/gpsScheduleTotvs.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/global/sharedGlobalFactory.js',
    '/dts/hgp/html/global-parameters/parametersFactory.js'
], function(index) {

    saldosProvisaoReceitaMainController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service', 'hfp.saldosProvisaoReceita.Factory', 
    'global.userConfigs.Factory', '$modal', 'AbstractAdvancedFilterController', 
    'TOTVSEvent', '$location', '$timeout', '$anchorScroll', 'shared.global.Factory', 'dts-utils.utils.Service'];
    function saldosProvisaoReceitaMainController($rootScope, $scope, $state, $stateParams, appViewService, saldosProvisaoReceitaFactory,
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
            appViewService.startView("Saldos Provisão Receita", 'hfp.saldosProvisaoReceitaMain.Control', _self);
            if (appViewService.lastAction != 'newtab') {
                return;
            }
            _self.dadosTela.dtContabilizacao = {startDate: new Date(), 
                                                endDate: new Date()};
            _self.dadosTela.dtLimite = new Date();

            _self.execution = {};
            _self.execution.filename = "SaldosProvisaoReceita";
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

            _self.parametros.arquivo             = _self.execution.filename;
            _self.parametros.dtContabilizacaoIni = _self.dadosTela.dtContabilizacao.startDate;
            _self.parametros.dtContabilizacaoFim = _self.dadosTela.dtContabilizacao.endDate;
            _self.parametros.dtLimite            = _self.dadosTela.dtLimite;

            saldosProvisaoReceitaFactory.generatePasscode(_self.parametros, _self.rpw,
                function(result){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'success', title: 'Gerado pedido RPW Nº: ' + result.nrPedido
                });
            });
        }

        this.checkFields = function() {
            var camposOk = true;
            var mensagem = [];

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

            if (new Date(_self.dadosTela.dtContabilizacao.endDate).clearTime() > new Date(_self.dadosTela.dtLimite).clearTime()){
                camposOk = false;
                mensagem.push('Data Limite menor que a data final de Contabilização');
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

    index.register.controller('hfp.saldosProvisaoReceitaMain.Control', saldosProvisaoReceitaMainController);
});