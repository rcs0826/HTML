define(['index',
    '/dts/hgp/html/hrb-exportBenefCompartRisco/exportBenefCompartRiscoFactory.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/global/gpsScheduleTotvs.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/global/sharedGlobalFactory.js',
    '/dts/hgp/html/global-parameters/parametersFactory.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    exportBenefCompartRiscoMainController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service',
        'hrb.exportBenefCompartRisco.Factory', 'global.userConfigs.Factory',
        '$modal', 'AbstractAdvancedFilterController', 'TOTVSEvent', '$location', '$timeout', '$anchorScroll', 'shared.global.Factory',
        'dts-utils.utils.Service'];
    function exportBenefCompartRiscoMainController($rootScope, $scope, $state, $stateParams, appViewService, exportBenefCompartRiscoFactory,
        userConfigsFactory, $modal, AbstractAdvancedFilterController,
        TOTVSEvent, $location, $timeout, $anchorScroll, sharedGlobalFactory, dtsUtils) {

        var _self = this;

        _self.dadosTela = {}
        _self.options = {};
        _self.execution = {};

        _self.options.inStatus = [
            { 'value': 0, 'label': 'Pendente envio' },
            { 'value': 3, 'label': 'Pendente reenvio' },
            { 'value': 4, 'label': 'Todos' }];

        _self.options.tipoMovimento = [
            { 'value': "I", 'label': 'Incusão' },
            { 'value': "E", 'label': 'Exclusão' },
            { 'value': "T", 'label': 'Todos' }];
			
		_self.options.formatoSaida = [
            { 'value': 1, 'label': 'Texto' },
            { 'value': 2, 'label': 'XML' }];

        _self.dadosTela.cdUnidadeIni = "1";
	    _self.dadosTela.cdUnidadeFim = "9999";
	    _self.dadosTela.cdModalidadeIni = "1";
	    _self.dadosTela.cdModalidadeFim = "99"; 
	    _self.dadosTela.cdContratoIni = "1";
	    _self.dadosTela.cdContratoFim = "999999";
	    _self.dadosTela.cdUsuarioIni = "1";
        _self.dadosTela.cdUsuarioFim = "999999";
        _self.dadosTela.dataInclusaoIncio = new Date();
	    _self.dadosTela.dataInclusaoFim = new Date();
	    _self.dadosTela.dataExclusaoIncio = new Date();
        _self.dadosTela.dataExclusaoFim = new Date();
	    _self.dadosTela.inStatus = 4;
        _self.dadosTela.tipoMovimento = "T";
        _self.dadosTela.cdUnidadeLote = "1";
        _self.dadosTela.nrLote = "1";   
        _self.dadosTela.lgReexporta = false;
		_self.dadosTela.inFormatoSaida = 2;

        _self.execution.filename = "exportBenefCompartRisco";

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
            appViewService.startView("Exportação Beneficiários Compartilhamento de Risco", 'hrb.exportBenefCompartRiscoMain.Control', _self);
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
            _self.parametros.cdUnidadeIni = _self.dadosTela.cdUnidadeIni;   
            _self.parametros.cdUnidadeFim = _self.dadosTela.cdUnidadeFim;
            _self.parametros.cdModalidadeIni = _self.dadosTela.cdModalidadeIni;
            _self.parametros.cdModalidadeFim = _self.dadosTela.cdModalidadeFim;
            _self.parametros.cdContratoIni = _self.dadosTela.cdContratoIni;
            _self.parametros.cdContratoFim = _self.dadosTela.cdContratoFim;
            _self.parametros.cdUsuarioIni = _self.dadosTela.cdUsuarioIni;
            _self.parametros.cdUsuarioFim = _self.dadosTela.cdUsuarioFim;
            _self.parametros.dataInclusaoIncio = _self.dadosTela.dataInclusaoIncio;
            _self.parametros.dataInclusaoFim = _self.dadosTela.dataInclusaoFim;
            _self.parametros.dataExclusaoIncio = _self.dadosTela.dataExclusaoIncio;
            _self.parametros.dataExclusaoFim = _self.dadosTela.dataExclusaoFim;
            _self.parametros.inStatus = _self.dadosTela.inStatus;
            _self.parametros.tipoMovimento = _self.dadosTela.tipoMovimento;

            _self.parametros.lgReexporta = _self.dadosTela.lgReexporta;
            _self.parametros.cdUnidadeLote = _self.dadosTela.cdUnidadeLote;
            _self.parametros.nrLote = _self.dadosTela.nrLote;
			
			_self.parametros.inFormatoSaida = _self.dadosTela.inFormatoSaida;

            exportBenefCompartRiscoFactory.exportBenefCompartRisco(_self.parametros, _self.rpw, function(result){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'success', title: 'Gerado pedido RPW Nº: ' + result.nrPedido
                });

            });
        };

        this.checkFields = function () {
            var camposOk = true;
            var mensagem = [];

            if (_self.dadosTela.lgReexporta == false){

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

                if (_self.dadosTela.cdUnidadeIni == "") {
                    camposOk = false;
                    mensagem.push('Unidade inicial não informada.');
                }

                if (_self.dadosTela.cdUnidadeFim == "") {
                    camposOk = false;
                    mensagem.push('Unidade final não informada.');
                }

                if (Number(_self.dadosTela.cdUnidadeIni) > Number(_self.dadosTela.cdUnidadeFim)) {
                    camposOk = false;
                    mensagem.push('Unidade Final deve ser maior que a Inicial.');
                }

                if (_self.dadosTela.cdModalidadeIni == "") {
                    camposOk = false;
                    mensagem.push('Modalidade inicial não informada.');
                }

                if (_self.dadosTela.cdModalidadeFim == "") {
                    camposOk = false;
                    mensagem.push('Modalidade final não informada.');
                }

                if (Number(_self.dadosTela.cdModalidadeIni) > Number(_self.dadosTela.cdModalidadeFim)) {
                    camposOk = false;
                    mensagem.push('Modalidade Final deve ser maior que a Inicial.');
                }

                if (_self.dadosTela.cdContratoIni == "") {
                    camposOk = false;
                    mensagem.push('Contrato inicial não informado.');
                }

                if (_self.dadosTela.cdContratoFim == "") {
                    camposOk = false;
                    mensagem.push('Contrato final não informado.');
                }

                if (Number(_self.dadosTela.cdContratoIni) > Number(_self.dadosTela.cdContratoFim)) {
                    camposOk = false;
                    mensagem.push('Contrato Final deve ser maior que o Inicial.');
                }

                if (_self.dadosTela.cdUsuarioIni == "") {
                    camposOk = false;
                    mensagem.push('Beneficiário inicial não informado.');
                }

                if (_self.dadosTela.cdUsuarioFim == "") {
                    camposOk = false;
                    mensagem.push('Beneficiário final não informado.');
                }

                if (Number(_self.dadosTela.cdUsuarioIni) > Number(_self.dadosTela.cdUsuarioFim)) {
                    camposOk = false;
                    mensagem.push('Beneficiário Final deve ser maior que o Inicial.');
                }

                if (Date(_self.dadosTela.dataInclusaoIncio) > Date(_self.dadosTela.dataInclusaoFim)) {
                    camposOk = false;
                    mensagem.push('Data Inclusão Final deve ser maior que o Inicial.');
                }

                if (Date(_self.dadosTela.dataExclusaoIncio) > Date(_self.dadosTela.dataExclusaoFim)) {
                    camposOk = false;
                    mensagem.push('Data Exclusão Final deve ser maior que o Inicial.');
                }
            }
            else{
                if (_self.dadosTela.cdUnidadeLote == "") {
                    camposOk = false;
                    mensagem.push('Unidade Lote não informada.');
                }

                if (_self.dadosTela.nrLote == "") {
                    camposOk = false;
                    mensagem.push('Lote não informada.');
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

    index.register.controller('hrb.exportBenefCompartRiscoMain.Control', exportBenefCompartRiscoMainController);

});


