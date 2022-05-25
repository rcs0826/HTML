define(['index',
    '/dts/hgp/html/hrb-importCompartRiscoCsv/importCompartRiscoCsvFactory.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/global/gpsScheduleTotvs.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/global/sharedGlobalFactory.js',
    '/dts/hgp/html/global-parameters/parametersFactory.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    importCompartRiscoCsvMainController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service',
        'hrb.importCompartRiscoCsv.Factory', 'global.userConfigs.Factory',
        '$modal', 'AbstractAdvancedFilterController', 'TOTVSEvent', '$location', '$timeout', '$anchorScroll', 'shared.global.Factory',
        'dts-utils.utils.Service'];
    function importCompartRiscoCsvMainController($rootScope, $scope, $state, $stateParams, appViewService, importCompartRiscoCsvFactory,
        userConfigsFactory, $modal, AbstractAdvancedFilterController,
        TOTVSEvent, $location, $timeout, $anchorScroll, sharedGlobalFactory, dtsUtils) {

        var _self = this;

        _self.dadosTela = {}
        _self.options = {};
        _self.execution = {};

        _self.execution.filename = "importCompartRiscoCsv";

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
            appViewService.startView("Importação Compartilhamento de Risco Csv", 'hrb.importCompartRiscoCsvMain.Control', _self);
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

            importCompartRiscoCsvFactory.importCompartRiscoCsv(_self.parametros, _self.rpw, function(result){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'success', title: 'Gerado pedido RPW Nº: ' + result.nrPedido
                });
            });
        };

        this.checkFields = function () {
            var camposOk = true;
            var mensagem = [];
            
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

    index.register.controller('hrb.importCompartRiscoCsvMain.Control', importCompartRiscoCsvMainController);

});


