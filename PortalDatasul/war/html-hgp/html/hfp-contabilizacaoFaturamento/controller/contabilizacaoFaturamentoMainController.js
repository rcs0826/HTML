define(['index',
    '/dts/hgp/html/hfp-contabilizacaoFaturamento/contabilizacaoFaturamentoFactory.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/global/gpsScheduleTotvs.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/global-documentSpecie/documentSpecieZoomController.js',
    '/dts/hgp/html/global/sharedGlobalFactory.js',
    '/dts/hgp/html/global-parameters/parametersFactory.js'
], function (index) {

    contabilizacaoFaturamentoMainController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service',
        'hfp.contabilizacaoFaturamento.Factory', 'global.userConfigs.Factory',
        '$modal', 'AbstractAdvancedFilterController', 'TOTVSEvent', '$location', '$timeout', '$anchorScroll', 'shared.global.Factory',
        'dts-utils.utils.Service'];
    function contabilizacaoFaturamentoMainController($rootScope, $scope, $state, $stateParams, appViewService, contabilizacaoFaturamentoFactory,
        userConfigsFactory, $modal, AbstractAdvancedFilterController,
        TOTVSEvent, $location, $timeout, $anchorScroll, sharedGlobalFactory, dtsUtils) {

        var _self = this;

        _self.options = {};
        _self.options.tipoRelatorio = [
            { 'value': 1, 'label': 'Resumido' },
            { 'value': 2, 'label': 'Detalhado' }
        ];
        _self.options.tipoReferencia = [
            { 'value': 1, 'label': 'Dia' },
            { 'value': 2, 'label': 'Período' }
        ];

        _self.dadosTela = {};
        _self.execution = {};
        _self.execution.filename = "ContabilizacaoFaturamento";

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

        this.changeTipoRelatorio = function () {
            if (_self.dadosTela.tipoRelatorio == 2){
                _self.dadosTela.tipoReferencia == 1;
            }
        };

        this.changeLgExportaTemporarias = function () {
            if (!_self.dadosTela.lgExportaTemporarias){
                _self.dadosTela.diretorioExportacao == "";
            }
        };

        this.changeAltUsuarioCont = function () {
            if (!_self.dadosTela.altUsuarioCont){
                _self.dadosTela.usuarioEms = "";
                _self.dadosTela.senhaEms = "";
            }
        };

        this.init = function () {
            appViewService.startView("Contabilização Faturamento", 'hfp.contabilizacaoFaturamentoMain.Control', _self);
            if (appViewService.lastAction != 'newtab') {
                return;
            }

            // Carrega valores iniciais para empresa, estabelecimento e as datas
            contabilizacaoFaturamentoFactory.getParametros(function (result) {
                if (result[0]) {
                    result = result[0];
                    _self.dadosTela.cdEmpresa = result.cdEmpresa;
                    _self.dadosTela.cdEstabelecimento = result.cdEstabelecimento;
                    _self.dadosTela.dtContabIni = result.dtContabIni;
                    _self.dadosTela.dtContabFim = result.dtContabFim;
                }
            });

            _self.dadosTela.tipoRelatorio = 1;
            _self.dadosTela.tipoReferencia = 1;
            _self.dadosTela.lgExportaTemporarias = false;
            _self.dadosTela.diretorioExportacao = "";
            _self.dadosTela.altUsuarioCont = false;
            _self.dadosTela.usuarioEms = 1;
            _self.dadosTela.senhaEms = 1;
            _self.dadosTela.cdEspecieIni = "";
            _self.dadosTela.cdEspecieFim = "ZZZ";
            _self.dadosTela.lgGerarCSV = false;
            _self.dadosTela.nmArquivoCSV = "ContabilizacaoFaturamento";
        };

        this.irPara = function (local) {
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash(local);

            // call $anchorScroll()
            $anchorScroll();
        };

        this.generate = function () {
            if (!_self.checkFields()) {
                return;
            }

            _self.rpw = dtsUtils.mountExecution(_self.execution, _self.schedule, _self.dadosTela.servidor);

            _self.parametros = {};
            _self.parametros.arquivo = _self.execution.filename;
            _self.parametros.tipoRelatorio = _self.dadosTela.tipoRelatorio;
            _self.parametros.tipoReferencia = _self.dadosTela.tipoReferencia;
            _self.parametros.lgExportaTemporarias = _self.dadosTela.lgExportaTemporarias;
            _self.parametros.diretorioExportacao = _self.dadosTela.diretorioExportacao;
            _self.parametros.altUsuarioCont = _self.dadosTela.altUsuarioCont;
            _self.parametros.usuarioEms = _self.dadosTela.usuarioEms;
            _self.parametros.senhaEms = _self.dadosTela.senhaEms;
            _self.parametros.cdEmpresa = _self.dadosTela.cdEmpresa;
            _self.parametros.cdEstabelecimento = _self.dadosTela.cdEstabelecimento;
            _self.parametros.cdEspecieIni = _self.dadosTela.cdEspecieIni;
            _self.parametros.cdEspecieFim = _self.dadosTela.cdEspecieFim;
            _self.parametros.dtContabIni = _self.dadosTela.dtContabIni;
            _self.parametros.dtContabFim = _self.dadosTela.dtContabFim;
            _self.parametros.lgGerarCSV = _self.dadosTela.lgGerarCSV;
            _self.parametros.nmArquivoCSV = _self.dadosTela.nmArquivoCSV;

            var erroValidacao = false;
            contabilizacaoFaturamentoFactory.generate(_self.parametros, _self.rpw, function(result) {
                angular.forEach(result, function (erro) {
                    erroValidacao = true;
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title: erro.dsErro
                    });
                });

                if (!erroValidacao && (angular.isUndefined(result.$hasError) || !result.$hasError)) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Operação concluída com sucesso!'
                    });
                }
            });
        };

        this.checkFields = function () {
            var camposOk = true;
            var mensagem = [];

            if (_self.dadosTela.lgGerarCSV && _self.dadosTela.nmArquivoCSV == "") {
                camposOk = false;
                mensagem.push('Arquivo .CSV não informado');
            }

            if (_self.dadosTela.tipoRelatorio != 1 && _self.dadosTela.tipoRelatorio != 2){
                camposOk = false;
                mensagem.push('Tipo de Relatório não informado.');
            }

            if (_self.dadosTela.tipoRelatorio == 1){
                if (_self.dadosTela.tipoReferencia != 1 && _self.dadosTela.tipoReferencia != 2){
                    camposOk = false;
                    mensagem.push('Tipo de Referência não informado.');
                }
            }

            if (_self.dadosTela.lgExportaTemporarias && _self.dadosTela.diretorioExportacao == ""){
                camposOk = false;
                mensagem.push('Diretório de exportação das temporárias não informado.');
            }

            if (_self.dadosTela.altUsuarioCont
                && (_self.dadosTela.usuarioEms == "" || _self.dadosTela.senhaEms == "")){
                camposOk = false;
                mensagem.push('Informações de acesso do usuário do EMS não informadas.');
            }

            if (_self.dadosTela.cdEmpresa == ""){
                camposOk = false;
                mensagem.push('Empresa não informada.');
            }
            if (_self.dadosTela.cdEstabelecimento == ""){
                camposOk = false;
                mensagem.push('Estabelecimento não informado.');
            }

            if (_self.dadosTela.cdEspecieIni > _self.dadosTela.cdEspecieFim){
                camposOk = false;
                mensagem.push('Espécie final menor que inicial.');
            }

            if (_self.dadosTela.dtContabIni == null){
                camposOk = false;
                mensagem.push('Data inicial não informada.');
            }

            if (_self.dadosTela.dtContabFim == null){
                camposOk = false;
                mensagem.push('Data inicial não informada.');
            }

            if (_self.dadosTela.dtContabIni > _self.dadosTela.dtContabFim){
                camposOk = false;
                mensagem.push('Data final menor que inicial.');
            }

            if (angular.isUndefined(_self.dadosTela.servidor) || _self.dadosTela.servidor == "") {
                camposOk = false;
                mensagem.push("Servidor de Execução não informado");
            }

            if (_self.execution.schedule.type == "DATE") {
                if (_self.execution.schedule.date == "") {
                    camposOk = false;
                    mensagem.push("Informe a data e hora do agendamento");
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

    index.register.controller('hfp.contabilizacaoFaturamentoMain.Control', contabilizacaoFaturamentoMainController);

});
