define(['index',
    '/dts/hgp/html/hfp-conferenciaProvisaoReceita/conferenciaProvisaoReceitaFactory.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/global/gpsScheduleTotvs.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/global/sharedGlobalFactory.js',
    '/dts/hgp/html/global-parameters/parametersFactory.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    conferenciaProvisaoReceitaMainController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service',
        'hfp.conferenciaProvisaoReceita.Factory', 'global.userConfigs.Factory',
        '$modal', 'AbstractAdvancedFilterController', 'TOTVSEvent', '$location', '$timeout', '$anchorScroll', 'shared.global.Factory',
        'dts-utils.utils.Service'];
    function conferenciaProvisaoReceitaMainController($rootScope, $scope, $state, $stateParams, appViewService, conferenciaProvisaoReceitaFactory,
        userConfigsFactory, $modal, AbstractAdvancedFilterController,
        TOTVSEvent, $location, $timeout, $anchorScroll, sharedGlobalFactory, dtsUtils) {

        var _self = this;
        _self.dadosTela = {};
        _self.options = {};

        _self.listMovtosContabilizados= [                
            { 'value': 0, 'label': 'Não' },
            { 'value': 1, 'label': 'Sim' },
            { 'value': 2, 'label': 'Ambos' }];          

        _self.dadosTela.inContab        = 0;
        _self.dadosTela.lgFatEstornadas = false;
        _self.dadosTela.dtContabIni     = new Date();
        _self.dadosTela.dtContabFim     = new Date();

        _self.execution = {};
        _self.execution.filename = "PROVISAO-RECEITA";

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
            appViewService.startView("Conferência Contabilização Movimentos (Procedimentos/Insumos)", 'hfp.conferenciaProvisaoReceitaMain.Control', _self);
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

            _self.parametros.arquivo     = _self.execution.filename;

            _self.parametros.inContab        = _self.dadosTela.inContab;
            _self.parametros.lgFatEstornadas = _self.dadosTela.lgFatEstornadas;
            _self.parametros.dtContabIni     = _self.dadosTela.dtContabIni;
            _self.parametros.dtContabFim     = _self.dadosTela.dtContabFim;

            conferenciaProvisaoReceitaFactory.generatePasscode(_self.parametros, _self.rpw,
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
    index.register.controller('hfp.conferenciaProvisaoReceitaMain.Control', conferenciaProvisaoReceitaMainController);

});
