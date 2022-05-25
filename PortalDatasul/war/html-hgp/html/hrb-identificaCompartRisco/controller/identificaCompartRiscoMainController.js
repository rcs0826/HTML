define(['index',
    '/dts/hgp/html/hrb-identificaCompartRisco/identificaCompartRiscoFactory.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/global/gpsScheduleTotvs.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/global/sharedGlobalFactory.js',
    '/dts/hgp/html/global-parameters/parametersFactory.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    identificaCompartRiscoMainController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service',
        'hrb.identificaCompartRisco.Factory', 'global.userConfigs.Factory',
        '$modal', 'AbstractAdvancedFilterController', 'TOTVSEvent', '$location', '$timeout', '$anchorScroll', 'shared.global.Factory',
        'dts-utils.utils.Service'];
    function identificaCompartRiscoMainController($rootScope, $scope, $state, $stateParams, appViewService, identificaCompartRiscoFactory,
        userConfigsFactory, $modal, AbstractAdvancedFilterController,
        TOTVSEvent, $location, $timeout, $anchorScroll, sharedGlobalFactory, dtsUtils) {

        var _self = this;
        _self.dadosTela = {};
        _self.options = {};

        _self.dadosTela.lgGeraCancelamento    = false;
        _self.dadosTela.dtFimCompartCanc      = new Date();
        _self.dadosTela.dtInicial             = new Date();
        _self.dadosTela.dtFinal               = new Date();
        _self.dadosTela.dtIniNovoCompart      = new Date();
        _self.dadosTela.dtFimNovoCompart      = new Date();
        _self.dadosTela.qtMinAtendEletivo     = 1;
        _self.dadosTela.qtMinAtendUrgen       = 1;
        _self.dadosTela.cdUnidadeInic         = 1;
        _self.dadosTela.cdUnidadeFim          = 9999;
        _self.dadosTela.cdModalidadeInic      = 1;
        _self.dadosTela.cdModalidadeFim       = 99;
        _self.dadosTela.cdPlanoInic           = 1;
        _self.dadosTela.cdPlanoFim            = 99;
        _self.dadosTela.cdTipoPlanoInic       = 1;
        _self.dadosTela.cdTipoPlanoFim        = 99;
        _self.dadosTela.lgIndividualFamiliar  = false;
        _self.dadosTela.lgColAdeComPatrocinio = false;
        _self.dadosTela.lgColAdeSemPatrocinio = false;
        _self.dadosTela.lgColEmpComPatrocinio = false;
        _self.dadosTela.lgColEmpSemPatrocinio = false;
        _self.dadosTela.lgNaoInformado        = false;

        _self.execution = {};
        _self.execution.filename = "BENEF-COMPART-RISCO";

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
            appViewService.startView("Identificar Beneficiários Compartilhamento Risco", 'hrb.identificaCompartRiscoMain.Control', _self);
            if (appViewService.lastAction != 'newtab') {
                return;
            }

            identificaCompartRiscoFactory.getInitialTemps(function (result) {
                _self.tmpUnidade = result.tmpUnidade;
                _self.tmpTpPlano = result.tmpTpPlano;
                _self.onChangeRangeUnidade();
                _self.onChangeRangeModalidade();
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

        this.onChangeRangeModalidade = function (event){
            function changeField(){
                _self.tmpTpPlanoFiltrada = _self.tmpTpPlano.filter(function (modalidade) {
                    return modalidade.cdModalidade >= _self.dadosTela.cdModalidadeInic && modalidade.cdModalidade <= _self.dadosTela.cdModalidadeFim
                        && modalidade.cdPlano      >= _self.dadosTela.cdPlanoInic      && modalidade.cdPlano      <= _self.dadosTela.cdPlanoFim
                        && modalidade.cdTipoPlano  >= _self.dadosTela.cdTipoPlanoInic  && modalidade.cdTipoPlano  <= _self.dadosTela.cdTipoPlanoFim;
                });
              }
            //o onChange roda antes do data bind, o timeout 0 faz com que o bind rode antes e o valor seja  atualizado
            $timeout(changeField, 0);
        };

        this.filterSelected = function (item) {
            return item.$selected;
        }

        this.generate = function () {

            _self.parametros      = {};
            _self.rpw             = {};
            _self.tmpTpContratPar = [];
            _self.tmpUnidadePar   = _self.tmpUnidadeFiltrada.filter(_self.filterSelected);
            _self.tmpTpPlanoPar   = _self.tmpTpPlanoFiltrada.filter(_self.filterSelected);

            if (!_self.checkFields()) {
                return;
            }

            _self.rpw = dtsUtils.mountExecution(_self.execution, _self.schedule, _self.dadosTela.servidor);

            _self.parametros.nmArquivoCSV       = _self.execution.filename;

            _self.parametros.lgGeraCancelamento = _self.dadosTela.lgGeraCancelamento;
            _self.parametros.dtFimCompartCanc   = _self.dadosTela.dtFimCompartCanc;
            _self.parametros.dtInicial          = _self.dadosTela.dtInicial;
            _self.parametros.dtFinal            = _self.dadosTela.dtFinal;
            _self.parametros.dtIniNovoCompart   = _self.dadosTela.dtIniNovoCompart;
            _self.parametros.dtFimNovoCompart   = _self.dadosTela.dtFimNovoCompart;
            _self.parametros.qtMinAtendEletivo  = _self.dadosTela.qtMinAtendEletivo;
            _self.parametros.qtMinAtendUrgen    = _self.dadosTela.qtMinAtendUrgen;

            if (_self.dadosTela.lgIndividualFamiliar){
                _self.tmpTpContratPar.push({'cdTpContrat': 1});
            }
            if (_self.dadosTela.lgColAdeComPatrocinio){
                _self.tmpTpContratPar.push({'cdTpContrat': 3});
            }
            if (_self.dadosTela.lgColAdeSemPatrocinio){
                _self.tmpTpContratPar.push({'cdTpContrat': 4});
            }
            if (_self.dadosTela.lgColEmpComPatrocinio){
                _self.tmpTpContratPar.push({'cdTpContrat': 5});
            }
            if (_self.dadosTela.lgColEmpSemPatrocinio){
                _self.tmpTpContratPar.push({'cdTpContrat': 6});
            }
            if (_self.dadosTela.lgNaoInformado){
                _self.tmpTpContratPar.push({'cdTpContrat': 99});
            }

            identificaCompartRiscoFactory.generatePasscode(_self.parametros, _self.rpw, _self.tmpUnidadePar, _self.tmpTpPlanoPar, _self.tmpTpContratPar,
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

            if (_self.dadosTela.lgGeraCancelamento && _self.dadosTela.dtFimCompartCanc == null ){    
                camposOk = false;
                mensagem.push('Data fim do compartilhamento (Registros cancelados) deve ser informada');
            }

            if (_self.dadosTela.dtInicial == null){    
                camposOk = false;
                mensagem.push('Data inicial deve ser informada');
            }

            if (_self.dadosTela.dtFinal == null){    
                camposOk = false;
                mensagem.push('Data final deve ser informada');
            }

            if (   (!angular.isUndefined(_self.dadosTela.dtInicial) && _self.dadosTela.dtInicial !== null)
                && (!angular.isUndefined(_self.dadosTela.dtFinal)   && _self.dadosTela.dtFinal !== null)
                && (_self.dadosTela.dtInicial > _self.dadosTela.dtFinal) ){                    
                    camposOk = false;
                    mensagem.push('Data final menor que inicial');
            }

            if (_self.dadosTela.dtIniNovoCompart == null){    
                camposOk = false;
                mensagem.push('Data início do compartilhamento (Registros novos) deve ser informada');
            }

            if (   (!angular.isUndefined(_self.dadosTela.dtIniNovoCompart) && _self.dadosTela.dtIniNovoCompart !== null)
                && (!angular.isUndefined(_self.dadosTela.dtFimNovoCompart) && _self.dadosTela.dtFimNovoCompart !== null)
                && (_self.dadosTela.dtIniNovoCompart > _self.dadosTela.dtFimNovoCompart) ){                    
                    camposOk = false;
                    mensagem.push('Data fim do compartilhamento (Registros novos) menor que Data início');
            }

            if (_self.dadosTela.qtMinAtendEletivo <= 0 || _self.dadosTela.qtMinAtendEletivo == null){
                camposOk = false;
                mensagem.push('Quantidade minima de atendimentos eletivos deve ser maior que zero');
            }

            if (_self.dadosTela.qtMinAtendUrgen <= 0 || _self.dadosTela.qtMinAtendUrgen == null){
                camposOk = false;
                mensagem.push('Quantidade minima de atendimentos urgencia deve ser maior que zero');
            }

            if (_self.tmpUnidadePar.length == 0){
                camposOk = false;
                mensagem.push('Ao menos uma unidade deve ser selecionada');
            }

            if (_self.tmpTpPlanoPar.length == 0){
                camposOk = false;
                mensagem.push('Ao menos um tipo de plano deve ser selecionado');
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
    index.register.controller('hrb.identificaCompartRiscoMain.Control', identificaCompartRiscoMainController);

});
