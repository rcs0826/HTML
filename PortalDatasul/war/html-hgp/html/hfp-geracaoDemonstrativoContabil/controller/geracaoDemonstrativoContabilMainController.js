define(['index',
    '/dts/hgp/html/hfp-geracaoDemonstrativoContabil/geracaoDemonstrativoContabilFactory.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/global/gpsScheduleTotvs.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/global/sharedGlobalFactory.js',
    '/dts/hgp/html/js/util/DateTools.js',
    '/dts/hgp/html/global-parameters/parametersFactory.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    geracaoDemonstrativoContabilMainController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service',
        'hfp.geracaoDemonstrativoContabil.Factory', 'global.userConfigs.Factory',
        '$modal', 'AbstractAdvancedFilterController', 'TOTVSEvent', '$location', '$timeout', '$anchorScroll', 'shared.global.Factory',
        'dts-utils.utils.Service'];
    function geracaoDemonstrativoContabilMainController($rootScope, $scope, $state, $stateParams, appViewService, geracaoDemonstrativoContabilFactory,
        userConfigsFactory, $modal, AbstractAdvancedFilterController,
        TOTVSEvent, $location, $timeout, $anchorScroll, sharedGlobalFactory, dtsUtils) {

        var _self = this;
        _self.dadosTela = {};
        _self.options = {};

        _self.dadosTela.lgTrataDif           = false;
        _self.dadosTela.lgContabFatEstornada = false;
        _self.dadosTela.lgProvisao           = true;
        _self.dadosTela.lgDemonstrativo      = false;
        _self.dadosTela.lgConsidera          = true;
        _self.dadosTela.lgDiferencia         = false;
        _self.dadosTela.lgProcedimentosCustoPagamento = false;
        _self.dadosTela.lgInsumosCustoPagamento       = false;
        _self.dadosTela.lgProcedimentosCustoAlterado  = false;
        _self.dadosTela.lgInsumosCustoAlterado        = false;
        _self.dadosTela.lgProcedimentosPartPagamento  = false;
        _self.dadosTela.lgInsumosPartPagamento        = false;
        _self.dadosTela.lgProcedimentosPartAlterado   = false;
        _self.dadosTela.lgInsumosPartAlterado         = false;
        _self.dadosTela.tpRelatorio          = 1;
        _self.dadosTela.tpResumido           = 1;
        _self.dadosTela.tpClassificacao      = 1;
        _self.dadosTela.cdEspecieIni         = " ";
        _self.dadosTela.cdEspecieFim         = "ZZZ";
        _self.dadosTela.dtContabIni          = Date.now().addMonths(-1).moveToFirstDayOfMonth(); // primeiro dia do mes anterior
        _self.dadosTela.dtContabFim          = Date.now().addMonths(-1).moveToLastDayOfMonth();  // ultimo dia do mes anterior
        _self.dadosTela.ctCodigoIni          = "0";
        _self.dadosTela.ctCodigoFim          = "99999999999999999999";
        _self.dadosTela.scCodigoIni          = "0";
        _self.dadosTela.scCodigoFim          = "99999999999999999999";
        _self.dadosTela.cdContratIni         = "0";
        _self.dadosTela.cdContratFim         = 999999999;

        _self.execution = {}; 
        _self.execution.filename = "DEMONSTRATIVO-CONTABIL";

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
            appViewService.startView("Geração Demonstrativo Contábil", 'hfp.geracaoDemonstrativoContabilMain.Control', _self);
            if (appViewService.lastAction != 'newtab') {
                return;
            }
        };

        this.irPara = function (local) {
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash(local);

            // call $anchorScroll()
            $anchorScroll();
        };

        this.filterSelected = function (item) {
            return item.$selected;
        }

        this.generate = function () {

            _self.parametros = {};
            _self.rpw = {};

            if (!_self.checkFields()) {
                return;
            }

            _self.rpw = dtsUtils.mountExecution(_self.execution, _self.schedule, _self.dadosTela.servidor);

            _self.parametros.arquivo              = _self.execution.filename;

            _self.parametros.lgTrataDif           = _self.dadosTela.lgTrataDif;
            _self.parametros.lgContabFatEstornada = _self.dadosTela.lgContabFatEstornada;
            _self.parametros.lgProvisao           = _self.dadosTela.lgProvisao;
            _self.parametros.lgDemonstrativo      = _self.dadosTela.lgDemonstrativo;
            _self.parametros.lgConsidera          = _self.dadosTela.lgConsidera;
            _self.parametros.lgDiferencia         = _self.dadosTela.lgDiferencia;
            _self.parametros.lgProcedimentosCustoPagamento = _self.dadosTela.lgProcedimentosCustoPagamento;
            _self.parametros.lgInsumosCustoPagamento       = _self.dadosTela.lgInsumosCustoPagamento;     
            _self.parametros.lgProcedimentosCustoAlterado  = _self.dadosTela.lgProcedimentosCustoAlterado;
            _self.parametros.lgInsumosCustoAlterado        = _self.dadosTela.lgInsumosCustoAlterado;     
            _self.parametros.lgProcedimentosPartPagamento  = _self.dadosTela.lgProcedimentosPartPagamento;
            _self.parametros.lgInsumosPartPagamento        = _self.dadosTela.lgInsumosPartPagamento;     
            _self.parametros.lgProcedimentosPartAlterado   = _self.dadosTela.lgProcedimentosPartAlterado;
            _self.parametros.lgInsumosPartAlterado         = _self.dadosTela.lgInsumosPartAlterado;     
            _self.parametros.tpRelatorio          = _self.dadosTela.tpRelatorio;
            _self.parametros.tpResumido           = _self.dadosTela.tpResumido;
            _self.parametros.tpClassificacao      = _self.dadosTela.tpClassificacao;
            _self.parametros.cdEspecieIni         = _self.dadosTela.cdEspecieIni;
            _self.parametros.cdEspecieFim         = _self.dadosTela.cdEspecieFim;
            _self.parametros.dtContabIni          = _self.dadosTela.dtContabIni;
            _self.parametros.dtContabFim          = _self.dadosTela.dtContabFim;
            _self.parametros.ctCodigoIni          = _self.dadosTela.ctCodigoIni;
            _self.parametros.ctCodigoFim          = _self.dadosTela.ctCodigoFim;
            _self.parametros.scCodigoIni          = _self.dadosTela.scCodigoIni;
            _self.parametros.scCodigoFim          = _self.dadosTela.scCodigoFim;
            _self.parametros.cdContratIni         = _self.dadosTela.cdContratIni;
            _self.parametros.cdContratFim         = _self.dadosTela.cdContratFim;

            geracaoDemonstrativoContabilFactory.generatePasscode(_self.parametros, _self.rpw,
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

            if (_self.dadosTela.cdEspecieIni == "" || _self.dadosTela.cdEspecieIni == null) {
                camposOk = false;
                mensagem.push('Espécie Inicial não informada');
            }
            if (_self.dadosTela.cdEspecieFim == "" || _self.dadosTela.cdEspecieFim == null) {
                camposOk = false;
                mensagem.push('Espécie Final não informada');
            }
            if (_self.dadosTela.cdEspecieIni > _self.dadosTela.cdEspecieFim) {
                camposOk = false;
                mensagem.push('Espécie Final deve ser maior que a Inicial');
            }

            if (_self.dadosTela.dtContabIni == null){    
                camposOk = false;
                mensagem.push('Data inicial deve ser informada');
            }
            if (_self.dadosTela.dtContabFim == null){    
                camposOk = false;
                mensagem.push('Data final deve ser informada');
            }
            if (   (!angular.isUndefined(_self.dadosTela.dtContabIni) && _self.dadosTela.dtContabIni !== null)
                && (!angular.isUndefined(_self.dadosTela.dtContabFim) && _self.dadosTela.dtContabFim !== null)
                && (_self.dadosTela.dtContabIni > _self.dadosTela.dtContabFim) ){                    
                    camposOk = false;
                    mensagem.push('Data final menor que inicial');
            }            
            if (new Date(_self.dadosTela.dtContabIni).getMonth() !== new Date(_self.dadosTela.dtContabFim).getMonth()){    
                camposOk = false;
                mensagem.push('Período tem que estar dentro do mesmo mês');
            }            
            if (new Date(_self.dadosTela.dtContabIni).getFullYear() !== new Date(_self.dadosTela.dtContabFim).getFullYear()){    
                camposOk = false;
                mensagem.push('Período tem que estar dentro do mesmo ano');
            }
            if (    _self.dadosTela.lgDemonstrativo 
                && (new Date(_self.dadosTela.dtContabFim).moveToLastDayOfMonth()).getTime() !== new Date(_self.dadosTela.dtContabFim).getTime()){    
                camposOk = false;
                mensagem.push('Data fim do período tem que corresponder ao último dia do mês');
            }
            if (_self.dadosTela.ctCodigoIni == "" || _self.dadosTela.ctCodigoIni == null) {
                camposOk = false;
                mensagem.push('Conta Contábil Inicial não informada');
            }
            if (_self.dadosTela.ctCodigoFim == "" || _self.dadosTela.ctCodigoFim == null) {
                camposOk = false;
                mensagem.push('Conta Contábil Final não informada');
            }
            if (_self.dadosTela.ctCodigoIni > _self.dadosTela.ctCodigoFim) {
                camposOk = false;
                mensagem.push('Conta Contábil Final deve ser maior que a Inicial');
            }

            if (_self.dadosTela.scCodigoIni == "" || _self.dadosTela.scCodigoIni == null) {
                camposOk = false;
                mensagem.push('Sub-Conta Inicial não informada');
            }
            if (_self.dadosTela.scCodigoFim == "" || _self.dadosTela.scCodigoFim == null) {
                camposOk = false;
                mensagem.push('Sub-Conta Final não informada');
            }
            if (_self.dadosTela.scCodigoIni > _self.dadosTela.scCodigoFim) {
                camposOk = false;
                mensagem.push('Sub-Conta Final deve ser maior que a Inicial');
            }

            if (_self.dadosTela.cdContratIni == "" || _self.dadosTela.cdContratIni < 0 || _self.dadosTela.cdContratIni == null) {
                camposOk = false;
                mensagem.push('Contratante Inicial não informado');
            }
            if (_self.dadosTela.cdContratFim == "" || _self.dadosTela.cdContratFim < 0 || _self.dadosTela.cdContratFim == null) {
                camposOk = false;
                mensagem.push('Contratante Final não informado');
            }
            if (_self.dadosTela.cdContratIni > _self.dadosTela.cdContratFim) {
                camposOk = false;
                mensagem.push('Contratante Final deve ser maior que o Inicial');
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
    index.register.controller('hfp.geracaoDemonstrativoContabilMain.Control', geracaoDemonstrativoContabilMainController);

});
