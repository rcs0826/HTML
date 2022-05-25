define(['index',
        '/dts/hgp/html/util/dts-utils.js',
        '/dts/hgp/html/global/hrcGlobalFactory.js',  
        '/dts/hgp/html/hrc-document/maintenance/controller/packageMovementController.js',
        '/dts/hgp/html/hrc-document/maintenance/controller/movementRestrictionsController.js',
        '/dts/hgp/html/hrc-document/maintenance/controller/movementDetailsController.js',
        '/dts/hgp/html/hrc-document/maintenance/controller/movementMaintenanceModalController.js',
        '/dts/hgp/html/hrc-movement/movementFactory.js',
        '/dts/hgp/html/hrc-movement/movementZoomController.js',
        '/dts/hgp/html/hrs-assocvaConverMovto/assocvaConverMovtoFactory.js',
        '/dts/hgp/html/js/util/HibernateTools.js'], 
    function (index) {
    assocvaConverMovtoMaintenanceController.$inject = ['$rootScope', '$scope', '$state', '$stateParams',
                                                       'totvs.app-main-view.Service', 'hrs.assocvaConverMovto.Factory', 'TOTVSEvent', '$location', 
                                                       'dts-utils.utils.Service', 'hrc.movement.Factory', 'hrc.global.Factory', 'hrc.document.Factory'];
    function assocvaConverMovtoMaintenanceController($rootScope, $scope, $state, $stateParams, 
        appViewService, assocvaConverMovtoFactory, TOTVSEvent, $location, 
        dtsUtils, movementFactory, hrcGlobalFactory, documentFactory) {
        var _self = this;
        this.action = 'INSERT';
        _self.movementFixedFilters = {};
        _self.assocvaConverMovto = {};
        _self.assocvaConverMovto.lgEdit = false;
        _self.selectedMovement = {};
        _self.currentUrl = $location.$$path;
        _self.assocvaConverMovto.codIndicador = '1';

        this.init = function () {
            appViewService.startView('Manutenção Associativa de Procedimento SUS x GPS', 
                                        'hrs.assocvaConverMovtoMaintenance.Control', _self);
         
            if (angular.isUndefined($stateParams.cddMovtoExt)
                || angular.isUndefined($stateParams.codIndicador)) {
                _self.assocvaConverMovto = {};
                _self.assocvaConverMovto.codIndicador = '1';
                _self.movementReturnObject = undefined;
                _self.action = 'INSERT';
                _self.assocvaConverMovto.lgEdit = false;
                return;
            }
            
            var codIndicadorAux = _self.converteCodIndicador($stateParams.codIndicador);

            var disclaimers = [{ property: 'cddMovtoExt', value: $stateParams.cddMovtoExt },
                               { property: 'codIndicador', value: codIndicadorAux},
                               { property: 'cdProcedimentoCompleto', value: $stateParams.cdProcedimentoCompleto},
                               { property: 'cdTipoInsumo', value: $stateParams.cdTipoInsumo },
                               { property: 'cdInsumo', value: $stateParams.cdInsumo }];

            if ($state.current.name === 'dts/hgp/hrs-assocvaConverMovto.detail') {
                _self.action = 'DETAIL';
            } else {
                _self.action = 'EDIT';
            }

            assocvaConverMovtoFactory.getAssocvaConverMovtoByFilter('', 0, 0, false, disclaimers,
                function (result) {
                    _self.assocvaConverMovto = result[0];
                    _self.fillInsumosTypes();
                    _self.onInputTypeChange();

                    if (_self.assocvaConverMovto.codIndicador == '1') {
                        _self.movementReturnObject = {formattedCodeWithType: _self.assocvaConverMovto.cdProcedimentoCompleto};
                    } else {
                        _self.movementReturnObject =  {formattedCodeWithType: _self.assocvaConverMovto.cdInsumo};
                    }
                });
        };

        this.fillInsumosTypes = function() {
            _self.transactionInputTypes = [];
            
            if (_self.assocvaConverMovto.codIndicador == '1') {
                _self.transactionInputTypes = [{cdTipoInsumo: 0, rotulo: '0 - Procedimento ou Pacote'}];
            }

            hrcGlobalFactory.getInputTypeByFilter('', 0, 0, '', false, [{property: 'cdTransacao', value: '1'}],
                function (result) {
                if(!result || result.$hasError == true) { 
                    return;
                }

                angular.forEach(result, function(inputType) {
                    _self.transactionInputTypes.push({ 
                        cdTipoInsumo: inputType.cdTipoInsumo,
                        rotulo: inputType.cdTipoInsumo + " - " + inputType.dsTipoInsumo
                    });
                });
                _self.inputTypes = _self.transactionInputTypes;
                if (_self.assocvaConverMovto.cdTipoInsumo == ''
                    || angular.isUndefined(_self.assocvaConverMovto.cdTipoInsumo)
                    || _self.assocvaConverMovto.codIndicador == '1')
                    {
                        _self.assocvaConverMovto.cdTipoInsumo = _self.transactionInputTypes[0].cdTipoInsumo;
                    }
                _self.onInputTypeChange();
            });
        };

        this.onCancel = function () {
            appViewService.removeView({
                active: true,
                name: 'Inclusão Agrupadores Regras Coparticipação',
                url: _self.currentUrl
            });
        };

        this.onSaveNew = function () {
            _self.save(true);
        };

        this.save = function (isSaveNew) {
            _self.assocvaConverMovto.lgEdit = _self.action == 'EDIT';
            assocvaConverMovtoFactory.saveAssocvaConverMovto(_self.assocvaConverMovto,
                function (result) {
                    if (result.$hasError == true) {
                        return;
                    }

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Salvo com sucesso'
                    });

                    if (isSaveNew) {
                        _self.assocvaConverMovto = {};
                        _self.assocvaConverMovto.codIndicador = '1';
                        _self.movementReturnObject = undefined;
                        _self.action = 'INSERT';
                        $stateParams = '';
                        $state.go($state.get('dts/hgp/hrs-assocvaConverMovto.new'));
                        _self.init();
                    } else {
                        appViewService.removeView({ 
                            active: true,
                            name: 'Associativa de Procedimento SUS x GPS',
                            url: _self.currentUrl
                        });
                    }
                });
        };

        this.onInputMovementTypeChange = function() {
            _self.fillInsumosTypes();
            _self.onInputTypeChange();
        };

        this.onInputTypeChange = function(){
            _self.movementFixedFilters = {};
            if (_self.assocvaConverMovto.codIndicador == '1') {
                _self.movementFixedFilters['codProced'] = _self.assocvaConverMovto.cdProcedimentoCompleto;
                _self.addSearchOption(_self.movementFixedFilters, 'PROCEDIMENTOS');
            } else {
                _self.movementFixedFilters['cdTipoInsumo'] = _self.assocvaConverMovto.cdTipoInsumo;
                _self.addSearchOption(_self.movementFixedFilters, 'INSUMOS');
            }
        };

        this.addSearchOption = function(obj, option){
            if(angular.isUndefined(obj[HibernateTools.SEARCH_OPTION_CONSTANT]) == true){
                obj[HibernateTools.SEARCH_OPTION_CONSTANT] = option;
            } else {
                obj[HibernateTools.SEARCH_OPTION_CONSTANT] += '@@' + option;
            }                    
        };
        
        this.onMovementSelect = function(){
            if(angular.isUndefined(_self.movementReturnObject) == true
               || _self.movementReturnObject.formattedCodeWithType == '') {
                _self.selectedMovement = {};
                _self.movementReturnObject = undefined;
                return;
            }
            if (_self.assocvaConverMovto.codIndicador == '1') {
                _self.assocvaConverMovto.cdProcedimentoCompleto = _self.movementReturnObject.formattedCodeWithType;
                _self.assocvaConverMovto.cdInsumo = '';
            } else {
                _self.assocvaConverMovto.cdInsumo = _self.movementReturnObject.formattedCodeWithType;
                _self.assocvaConverMovto.cdProcedimentoCompleto = '';
            }
        };

        this.converteCodIndicador = function (codIndicadorAux) {            
            switch(codIndicadorAux){
                case '1':
                    return 'P';
                break;
                case '2':
                    return 'I';
                break;
            }                                    
        };

        $scope.$on('$viewContentLoaded', function () {
            _self.init();
        });
    }

    index.register.controller('hrs.assocvaConverMovtoMaintenance.Control', assocvaConverMovtoMaintenanceController);
});