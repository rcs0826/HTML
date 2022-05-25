define(['index',
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/hrs-gru/gruFactory.js',
        '/dts/hgp/html/hrs-ressusAbiImportation/controller/ressusAbiImportationZoomController.js',
        '/dts/hgp/html/hcg-unit/unitZoomController.js',
        '/dts/hgp/html/global-provider/providerZoomController.js',
    ], function(index) {

    gruMaintenanceController.$inject = ['$rootScope', '$scope','$state', '$stateParams', '$timeout',
                                        'totvs.utils.Service', 'totvs.app-main-view.Service','$location',
                                        'hrs.gru.Factory','TOTVSEvent'];
    function gruMaintenanceController($rootScope, $scope, $state, $stateParams, $timeout,
                                      totvsUtilsService, appViewService, $location,
                                      gruFactory , TOTVSEvent) {
        var _self = this;

        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.gru = {};
        _self.gruReturnObject = {};
        _self.abiAnalysisFixedFilters = {};
        _self.abiFixedFilters = {};
        _self.provider = {};
        _self.isInit = false;

        this.init = function(){
            _self.isInit = true;
            appViewService.startView("Manutenção de GRU",
                                     'hrs.gruMaintenance.Control',
                                     _self);

            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }

            _self.cleanModel();

            _self.currentUrl = $location.$$path;

            if (!angular.isUndefined($stateParams.cddRessusAbiGru)) {
                gruFactory.prepareDataToMaintenanceWindow($stateParams.cddRessusAbiGru,
                    function (result) {
                        if (result) {
                            angular.forEach(result, function (value) {
                                _self.gru = value;
                                _self.gruReturnObject = {codAbi: _self.gru.codAbi, cddRessusAbiDados: _self.gru.cddRessusAbiDados};
                                _self.provider = {cdnPrestdor: _self.gru.cdnUnidPrestdor + "/" + _self.gru.cdnPrestdor};
                            });
                        }
                    });
            }

            if($state.current.name === 'dts/hgp/hrs-gru.new'){
                _self.action = 'INSERT';
            }else if($state.current.name === 'dts/hgp/hrs-gru.detail'){
                _self.action = 'DETAIL';
            }else{
                _self.action = 'EDIT';
            }
            $timeout(function(){_self.isInit = false});
        };

        this.cleanModel = function (){
            _self.gru = {};
            _self.gruReturnObject = {};
            _self.abiAnalysisFixedFilters = {};
            _self.abiFixedFilters = {};
            _self.provider = {};
        }

        this.save = function () {
            var novoRegistro = false;
            if (_self.action == 'INSERT'){
                novoRegistro = true;
            }

            if (angular.isUndefined(_self.gru.codAbi) || _self.gru.codAbi == ""){

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning', title: 'Código da ABI é obrigatório'
                });
                return;
            }

            if (angular.isUndefined(_self.gru.cddGru) || _self.gru.cddGru == ""){

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning', title: 'Número do Documento é obrigatório'
                });
                return;
            }

            if (angular.isUndefined(_self.gru.vlGru) || _self.gru.vlGru == ""){

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning', title: 'Valor da GRU é obrigatório'
                });
                return;
            }

            if (angular.isUndefined(_self.gru.datDocto) || _self.gru.datDocto == ""){

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning', title: 'Data do Documento é obrigatória'
                });
                return;
            }

            if (angular.isUndefined(_self.gru.datProcmto) || _self.gru.datProcmto == ""){

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning', title: 'Data do Processamento é obrigatória'
                });
                return;
            }

            if (angular.isUndefined(_self.gru.dtVencimento) || _self.gru.dtVencimento == ""){

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning', title: 'Data de Vencimento é obrigatória'
                });
                return;
            }

            if (_self.gru.dtVencimento < _self.gru.datDocto){

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning', title: 'Data de vencimento menor que data do documento'
                });
                return;
            }

            if (_self.gru.datProcmto < _self.gru.datDocto){

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning', title: 'Data de processamento menor que data do documento'
                });
                return;
            }

            if (_self.gru.datDocto > new Date()){

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning', title: 'Data de documento maior que a data atual'
                });
                return;
            }

            if (_self.gru.datProcmto > new Date()){

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning', title: 'Data de processamento maior que a data atual'
                });
                return;
            }

            gruFactory.saveGru(novoRegistro, _self.gru,
                function (result) {
                    _self.tmpRessusAbiGru = result;
                    if(result.$hasError == true){
                        return;
                    }

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'GRU salva com sucesso'
                    });

                    appViewService.removeView({active: true,
                                                name  : 'Manutenção de GRU',
                                                url   : _self.currentUrl});
            });
        }

        this.onRessusAbiImportationSelect = function(){
            if (_self.isInit){
                return;
            }
            if (angular.isUndefined(_self.gruReturnObject) ||
                _self.gruReturnObject.codAbi == 0){
                _self.gru.codAbi = "";
                _self.gru.cddRessusAbiDados = "";
            } else {
                _self.gru.codAbi = _self.gruReturnObject.codAbi;
                _self.gru.cddRessusAbiDados = _self.gruReturnObject.cddRessusAbiDados;
            }
        };

        this.onCancel = function(){
            if(_self.action == 'DETAIL'){
                appViewService.removeView({active: true,
                                           name  : 'Manutenção de GRU',
                                           url   : _self.currentUrl});
                return;
            }

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!',
                text: 'Você deseja cancelar e descartar os dados não salvos?',
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                size: 'md',
                callback: function (hasChooseYes) {
                    if (hasChooseYes != true)
                        return;

                    appViewService.removeView({active: true,
                                               name  : 'Manutenção de GRU',
                                               url   : _self.currentUrl});
                }
            });

        };

        this.onProviderSelect = function(){
            if(!_self.provider.cdnPrestdor){
                _self.gru.cdnPrestdor = 0;
                _self.gru.cdnUnidPrestdor = 0;
                return;
            }

            _self.gru.cdnPrestdor = _self.provider.cdnPrestdor.substring(4);
            _self.gru.cdnUnidPrestdor = _self.provider.cdnPrestdor.substring(0, 4);
        };

        $scope.$on('$viewContentLoaded', function(){
            _self.init();
        });
	}

	index.register.controller('hrs.gruMaintenance.Control', gruMaintenanceController);
});