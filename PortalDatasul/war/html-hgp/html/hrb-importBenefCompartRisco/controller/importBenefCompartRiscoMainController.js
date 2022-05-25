define(['index',
    '/dts/hgp/html/hrb-importBenefCompartRisco/importBenefCompartRiscoFactory.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/global/gpsScheduleTotvs.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/global/sharedGlobalFactory.js',
    '/dts/hgp/html/global-parameters/parametersFactory.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    importBenefCompartRiscoMainController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service',
        'hrb.importBenefCompartRisco.Factory', 'global.userConfigs.Factory',
        '$modal', 'AbstractAdvancedFilterController', 'TOTVSEvent', '$location', '$timeout', '$anchorScroll', 'shared.global.Factory',
        'dts-utils.utils.Service'];
    function importBenefCompartRiscoMainController($rootScope, $scope, $state, $stateParams, appViewService, importBenefCompartRiscoFactory,
        userConfigsFactory, $modal, AbstractAdvancedFilterController,
        TOTVSEvent, $location, $timeout, $anchorScroll, sharedGlobalFactory, dtsUtils) {

        var _self = this;

        _self.dadosTela = {}
        _self.options = {};
        _self.execution = {};
        
        _self.dadosTela.lgReexporta = false;
        _self.dadosTela.cdContratante = 1;
        _self.dadosTela.nrLote = 1;

        _self.execution.filename = "importBenefCompartRisco";

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
            appViewService.startView("Importação Beneficiários Compartilhamento de Risco", 'hrb.importBenefCompartRiscoMain.Control', _self);
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

            _self.parametros.arquivo       = _self.execution.filename;

            _self.parametros.lgReexporta   = _self.dadosTela.lgReexporta;
            _self.parametros.cdContratante = _self.dadosTela.cdContratante;
            _self.parametros.nrLote        = _self.dadosTela.nrLote;

            importBenefCompartRiscoFactory.importBenefCompartRisco(_self.parametros, _self.rpw, function(result){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'success', title: 'Gerado pedido RPW Nº: ' + result.nrPedido
                });
            });
        };

        this.checkFields = function () {
            var camposOk = true;
            var mensagem = [];

            if (_self.dadosTela.lgReexporta == true){
                
                if (!_self.dadosTela.cdContratante) {
                    camposOk = false;
                    mensagem.push('Contratante não informado.');
                }

                if (!_self.dadosTela.nrLote) {
                    camposOk = false;
                    mensagem.push('Número do lote não informado.');
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

    index.register.controller('hrb.importBenefCompartRiscoMain.Control', importBenefCompartRiscoMainController);

});


