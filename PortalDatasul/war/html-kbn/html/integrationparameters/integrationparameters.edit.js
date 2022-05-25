define([
    'index',
    '/dts/kbn/js/factories/mappingErp-factories.js',
    '/dts/kbn/html/integrationparameters/integrationparameters.modal.js',
    '/dts/kbn/html/integrationparameters/integrationparameters.formula.modal.js',
    '/dts/kbn/html/integrationparameters/integrationparameters.cell.modal.js',
    '/dts/kbn/js/factories/integration-params-factory.js',
    '/dts/kbn/js/helpers.js'
], function(index){

    controllerIntegrationParameters.$inject = [
        '$filter',
        '$scope',
        'totvs.app-main-view.Service',
        '$rootScope',
        'kbn.mappingErp.Factory',
        'TOTVSEvent',
        'messageHolder',
        'ekanban.integrationparameters.modal.modal',
        'ekanban.formula.modal',
        'kbn.integrationparams.Factory',
        'kbn.helper.Service',
        'ekanban.cell.modal'
    ];

    function controllerIntegrationParameters(
        $filter,
        $scope,
        appViewService,
        $rootScope,
        mappingErpFactories,
        TOTVSEvent,
        messageHolder,
        modalURLConfig,
        modalFormulaEdit,
        integrationparamsFactory,
        kbnHelper,
        modalCellEdit
     ){

        var _self= this;

        _self.init = function(){
            createTab = appViewService.startView($rootScope.i18n('l-integration-parameters-ekanban'), 'ekanban.integrationparameters.EditCtrl', controllerIntegrationParameters);
            _self.integrationErps = kbnHelper.integrationErps();

            mappingErpFactories.getIntegratedDatasul({},{},function(result){
                if (result.integratedDatasul) _self.erpSelected = 1;
                else if (result.integratedDatasul != null) _self.erpSelected = parseInt(result.erpIntegrated);
            });
            integrationparamsFactory.getDefaultParameters({},{},function(result){
                _self.diretorioFormula = result[0].diretorioFormulas;
            });
            integrationparamsFactory.getCellParameters({},{},function(result){
                _self.logCellDefault = result[0].logCellDefault;
                _self.celulaPadrao   = result[0].celulaPadrao;
                _self.descCelPadrao  = result[0].descCelPadrao;
                _self.ctPadrao       = result[0].ctPadrao;
                _self.descCtPadrao   = result[0].descCtPadrao;
            })
        };

        _self.showVerificationMessage = function(callback){

            if(_self.erpSelected === null || _self.erpSelected === undefined)
                callback(true);
            else
                messageHolder.showQuestion( $rootScope.i18n('l-change-erp-integrated'), $rootScope.i18n('l-change-erp-integrated-confirmation'), _self.onlyCallWhenTrue(callback));

        };

        _self.onlyCallWhenTrue = function(callback) {
            return function(answer) {
                if (answer) callback();
                else _self.init();
            };
        };

        _self.setParametersIntegration = function(){

            _self.showVerificationMessage(_self.saveIntegrationType());

        };

        _self.saveIntegrationType = function(){
            return function() {
                mappingErpFactories.saveIntegratedDatasul({
                    integratedDatasul: _self.erpSelected === 1 ? true : false,
                    erpIntegrated: _self.erpSelected
                },{},function(result){
                    if(!result.$hasError){
                        if(!result.$hasError){
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type:   'sucess',
                                title:  $rootScope.i18n('l-integrated-erp-edition'),
                                detail: $rootScope.i18n('l-success-transaction'),
                            });
                        }
                        _self.erpSelected = _self.erpSelected;
                    }
                });
            };
        };

        _self.configureURL = function(){
            modalURLConfig.open();
        };

        _self.generateEstablishment = function(){
            mappingErpFactories.generateEstablishment({},{},function(result){
                if(!result.$hasError){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type:   'sucess',
                        title:  $rootScope.i18n('l-new-establishments'),
                        detail: $rootScope.i18n('l-success-transaction'),
                    });
                }
            });
        };

        _self.editarDiretorio = function(){
            modalFormulaEdit.open(_self.diretorioFormula).then(function(){
                _self.init();
            });
        }

        _self.editarCelulaPadrao = function(){
            if (_self.logCellDefault){
                defaultParams = [_self.logCellDefault,_self.celulaPadrao,_self.descCelPadrao,_self.ctPadrao,_self.descCtPadrao];

                modalCellEdit.open(defaultParams).then(function(result){
                    _self.init();
                });
            }
            else {
                integrationparamsFactory.saveCellParameters({},{logCellDefault: false,
                                                                celulaPadrao: "",
                                                                descCelPadrao: "",
                                                                ctPadrao: "",
                                                                descCtPadrao: ""},function(result){})
            }
        }

        _self.init();
    }

    index.register.controller('ekanban.integrationparameters.EditCtrl', controllerIntegrationParameters);
});
