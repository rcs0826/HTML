define(['index',
    '/dts/hgp/html/hrc-processaBaixaAviso/processaBaixaAvisoFactory.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/global/gpsScheduleTotvs.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/global/sharedGlobalFactory.js',
    '/dts/hgp/html/global-parameters/parametersFactory.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    processaBaixaAvisoMainController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service',
        'hrc.processaBaixaAviso.Factory', 'global.userConfigs.Factory',
        '$modal', 'AbstractAdvancedFilterController', 'TOTVSEvent', '$location', '$timeout', '$anchorScroll', 'shared.global.Factory',
        'dts-utils.utils.Service'];
    function processaBaixaAvisoMainController($rootScope, $scope, $state, $stateParams, appViewService, processaBaixaAvisoFactory,
        userConfigsFactory, $modal, AbstractAdvancedFilterController,
        TOTVSEvent, $location, $timeout, $anchorScroll, sharedGlobalFactory, dtsUtils) {

        var _self = this;

        _self.dadosTela = {}
        _self.options = {};
        _self.execution = {};

        _self.dadosTela.lgAvisoIndevido = false;
        _self.dadosTela.lgGlosaTotalPrestador = false;
        _self.dadosTela.lgPrazoExpirado = false;
        _self.dadosTela.tpSelecao = 1;
        _self.dadosTela.dataInicial = new Date();
        _self.dadosTela.dataFinal = new Date();
        _self.dadosTela.nrDiasRetroativos = "1";

        _self.execution.filename = "ENVIO-A530";

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
            appViewService.startView("Envio Baixa Aviso de Cobrança", 'hrc.processaBaixaAvisoMain.Control', _self);
            if (appViewService.lastAction != 'newtab') {
                return;
            }

            $(".teste").each(function() { 
                $(this).hide();
             });
        };

        this.generate = function () {

            console.log(_self.schedule);
            console.log(_self.execution);
            console.log();

            if (!_self.checkFields()) {
                return;
            }

            _self.parametros = {};
            _self.rpw = {};

            _self.rpw = dtsUtils.mountExecution(_self.execution, _self.schedule, _self.dadosTela.servidor);

            _self.parametros.arquivo = _self.execution.filename;

            _self.parametros.lgAvisoIndevido = _self.dadosTela.lgAvisoIndevido;
            _self.parametros.lgGlosaTotalPrestador = _self.dadosTela.lgGlosaTotalPrestador;
            _self.parametros.lgPrazoExpirado = _self.dadosTela.lgPrazoExpirado;
            _self.parametros.tpSelecao = _self.dadosTela.tpSelecao;
            _self.parametros.dataInicial = _self.dadosTela.dataInicial;
            _self.parametros.dataFinal = _self.dadosTela.dataFinal;
            _self.parametros.nrDiasRetroativos = _self.dadosTela.nrDiasRetroativos;

            processaBaixaAvisoFactory.processaBaixaAviso(_self.parametros, _self.rpw, function(result){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'success', title: 'Gerado pedido RPW Nº: ' + result.nrPedido
                });
            });
        };

        this.checkFields = function () {
            var camposOk = true;
            var mensagem = [];

            if (_self.filtersForm.$invalid) {
                camposOk = false;
                _self.filtersForm.$setDirty();
                angular.forEach(_self.filtersForm, function (value, key) {
                    if (typeof value === 'object' && value.hasOwnProperty('$modelValue')) {
                        value.$setDirty();
                    }
                });
                mensagem.push('Existem campos com valor inválido ou nao informado. Revise as informações.');
            }

            if (_self.dadosTela.lgAvisoIndevido == false
             && _self.dadosTela.lgGlosaTotalPrestador == false
             && _self.dadosTela.lgPrazoExpirado == false){
                camposOk = false;
                mensagem.push('Tipo de Execução não informada.');
            }

            if (_self.dadosTela.lgAvisoIndevido 
             || _self.dadosTela.lgGlosaTotalPrestador){

                if (_self.dadosTela.tpSelecao == '1'){
                    
                    if (_self.dadosTela.dataInicial == null){
                        camposOk = false;
                        mensagem.push('Data Inicial de Conhecimento não informada.');
                    }
                    
                    if (_self.dadosTela.dataFinal == null){
                        camposOk = false;
                        mensagem.push('Data Final de Conhecimento não informada.');
                    }
                    
                    if (_self.dadosTela.dataInicial > _self.dadosTela.dataFinal){
                        camposOk = false;
                        mensagem.push('Data Final de Conhecimento menor que a Inicial.');
                    }
                }
                else{
                    if (_self.dadosTela.nrDiasRetroativos == ""){
                        camposOk = false;
                        mensagem.push('Número de Dias Retroativos não informado.');
                    }
                }   
            }

            if(!_self.dadosTela.servidor){
                camposOk = false;
                mensagem.push('Servidor deve ser informado.');
            }
            
            if (!camposOk) {
                mensagem.forEach(function (element) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title: element
                    });
                }, this);
            }

            return camposOk;
        };

        if ($rootScope.currentuserLoaded) {
            this.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }
    }

    index.register.controller('hrc.processaBaixaAvisoMain.Control', processaBaixaAvisoMainController);

});


