define(['index',
    '/dts/hgp/html/hrc-exportacaoAvisoCobranca/exportacaoAvisoCobrancaFactory.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/global/gpsScheduleTotvs.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/global/sharedGlobalFactory.js',
    '/dts/hgp/html/global-parameters/parametersFactory.js'
], function (index) { 

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    exportacaoAvisoCobrancaMainController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service',
        'hrc.exportacaoAvisoCobranca.Factory', 'global.userConfigs.Factory',
        '$modal', 'AbstractAdvancedFilterController', 'TOTVSEvent', '$location', '$timeout', '$anchorScroll', 'shared.global.Factory',
        'dts-utils.utils.Service'];
    function exportacaoAvisoCobrancaMainController($rootScope, $scope, $state, $stateParams, appViewService, exportacaoAvisoCobrancaFactory,
        userConfigsFactory, $modal, AbstractAdvancedFilterController,
        TOTVSEvent, $location, $timeout, $anchorScroll, sharedGlobalFactory, dtsUtils) {

        var _self = this;
        _self.dadosTela = {};
        _self.options = {};
        _self.options.tipoArquivo = [
            { 'value': 1, 'label': 'Exportação A520' },
            { 'value': 2, 'label': 'Importação Arquivo Retorno A520' }];

        _self.options.tipoIntercambio = [
            { 'value': 1, 'label': 'Habitual' },
            { 'value': 2, 'label': 'Eventual' },
            { 'value': 3, 'label': 'Ambos' }];

        _self.options.cobValorAlt = [
            { 'value': 'n', 'label': 'Nenhum' },
            { 'value': 'p', 'label': 'Procedimento' },
            { 'value': 'i', 'label': 'Insumo' },
            { 'value': 'a', 'label': 'Ambos' }
        ]

        _self.dadosTela.tipoArquivo = 1;
        _self.dadosTela.tipoIntercambio = 3;
        _self.dadosTela.inCobValorAlt = 'n';
        _self.dadosTela.cdUnidadeInic = 1;
        _self.dadosTela.cdUnidadeFim = 9999;
        _self.dadosTela.cdTransacaoInic = 1;
        _self.dadosTela.cdTransacaoFim = 9999;
        _self.dadosTela.dataInicial = new Date();
        _self.dadosTela.dataInicial.setDate(_self.dadosTela.dataInicial.getDate() - 1);
        _self.dadosTela.exportaA520 = true;
        _self.dadosTela.validaEnviaA520 = false;

        _self.dadosTela.dataFinal = new Date();
        _self.dadosTela.dataFinal.setDate(_self.dadosTela.dataFinal.getDate() - 1);

        _self.execution = {};
        _self.execution.filename = "GERACAO-A520";

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

        this.changeTipoArquivo = function () {
            function changeField(){
                if (_self.dadosTela.tipoArquivo == 1){
                    if (_self.execution.filename == "IMP-RETORNO-A520"){
                        _self.execution.filename = "GERACAO-A520";
                    }
                } else {
                    if (_self.execution.filename == "GERACAO-A520"){

                        _self.execution.filename = "IMP-RETORNO-A520";
                    }
                }
              }
            //o onChange roda antes do data bind, o timeout 0 faz com que o bind rode antes e o valor seja  atualizado
            $timeout(changeField, 0);
        };

        this.init = function () {
            appViewService.startView("Exportação Aviso de Cobrança", 'hrc.exportacaoAvisoCobrancaMain.Control', _self);
            if (appViewService.lastAction != 'newtab') {
                return;
            }

            exportacaoAvisoCobrancaFactory.getInitialTemps(function (result) {

                _self.tmpUnidade = result.tmpUnidade;
                _self.onChangeRangeUnidade();

                _self.tmpTransacao = result.tmpTransacao;
                _self.onChangeRangeTransacao();
            });
        };

        this.irPara = function (local) {
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash(local);

            // call $anchorScroll()
            $anchorScroll();

        };

        this.onChangeRangeUnidade = function (event){
            function changeField(){
                _self.tmpUnidadeFiltrada = _self.tmpUnidade.filter(function (unidade) {
                    return unidade.cdUnidade >= _self.dadosTela.cdUnidadeInic && unidade.cdUnidade <= _self.dadosTela.cdUnidadeFim;
                });
              }
            //o onChange roda antes do data bind, o timeout 0 faz com que o bind rode antes e o valor seja  atualizado
            $timeout(changeField, 0);
        };

        this.onChangeRangeTransacao = function (event){
            function changeField(){
                _self.tmpTransacaoFiltrada = _self.tmpTransacao.filter(function (Transacao) {
                    return Transacao.cdTransacao >= _self.dadosTela.cdTransacaoInic && Transacao.cdTransacao <= _self.dadosTela.cdTransacaoFim;
                });
              }
            //o onChange roda antes do data bind, o timeout 0 faz com que o bind rode antes e o valor seja  atualizado
            $timeout(changeField, 0);
        };

        this.filterSelected = function (item) {
            return item.$selected;
        }

        this.generate = function () {

            _self.parametros = {};
            _self.rpw = {};
            _self.tmpUnidadePar = _self.tmpUnidadeFiltrada.filter(_self.filterSelected);
            _self.tmpTransacaoPar = _self.tmpTransacaoFiltrada.filter(_self.filterSelected);

            if (!_self.checkFields()) {
                return;
            }

            _self.rpw = dtsUtils.mountExecution(_self.execution, _self.schedule, _self.dadosTela.servidor);

            _self.parametros.arquivo = _self.execution.filename;

            _self.parametros.tipoArquivo = _self.dadosTela.tipoArquivo;
            _self.parametros.tipoIntercambio = _self.dadosTela.tipoIntercambio;
            _self.parametros.inCobValorAlt = _self.dadosTela.inCobValorAlt;
            _self.parametros.dataInicial = _self.dadosTela.dataInicial;
            _self.parametros.dataFinal = _self.dadosTela.dataFinal;
            _self.parametros.exportaA520 = _self.dadosTela.exportaA520;
            _self.parametros.validaEnviaA520 = _self.dadosTela.validaEnviaA520;

            exportacaoAvisoCobrancaFactory.generatePasscode(_self.parametros, _self.rpw, _self.tmpUnidadePar, _self.tmpTransacaoPar,
                function(result){
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

            if(!_self.dadosTela.servidor){
                camposOk = false;
                mensagem.push('Servidor deve ser informado.');
            }

            if (_self.dadosTela.tipoArquivo == 1){

                var ontem = new Date();
                ontem.setDate(ontem.getDate() - 1);


                if (_self.dadosTela.exportaA520 === false
                &&  _self.dadosTela.validaEnviaA520 === false){
                    camposOk = false;
                    mensagem.push('Deve ser informada uma das opção para exportação (Exportar Avisos de Cobrança/Efetuar Upload para CMB)');
                }

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

                if (_self.dadosTela.dataInicial > ontem || _self.dadosTela.dataFinal > ontem) {
                    camposOk = false;
                    mensagem.push('Período não pode ser superior a data de ontem.');
                }

                if (_self.tmpUnidadePar.length == 0){
                    camposOk = false;
                    mensagem.push('Ao menos uma unidade deve ser selecionada');
                }

                if (_self.tmpTransacaoPar.length == 0){
                    camposOk = false;
                    mensagem.push('Ao menos uma transação deve ser selecionada');
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
        };

        if ($rootScope.currentuserLoaded) {
            this.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }
    }
    index.register.controller('hrc.exportacaoAvisoCobrancaMain.Control', exportacaoAvisoCobrancaMainController);

});
