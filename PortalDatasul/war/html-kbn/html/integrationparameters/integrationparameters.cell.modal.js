    define(['index',
            '/dts/kbn/js/helpers.js',
            '/dts/kbn/js/factories/mappingErp-factories.js',
            '/dts/kbn/js/factories/integration-params-factory.js'
], function (index) {

    modalCell.$inject = ['$modal'];

    function modalCell($modal) {
        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/integrationparameters/integrationparameters.cell.modal.html',
                controller: 'ekanban.cell.modal.ctrl as controller',
                backdrop: 'static',
                resolve: {parameters: function(){ return params; }},
                size: 'lg'
            });
            return instance.result;
        }
    }
    CellModalCtrl.$inject = [
        '$modalInstance',
        '$rootScope',
        'kbn.mappingErp.Factory',
        'parameters',
        'TOTVSEvent',
        'kbn.integrationparams.Factory',
        'kbn.helper.Service',
        'messageHolder'
    ];

    function CellModalCtrl(
         $modalInstance,
         $rootScope,
         mappingErpFactory,
         parameters,
         TOTVSEvent,
         integrationparamsFactory,
         serviceHelper,
         messageHolder) {

        var _self = this;

        _self.init = function(){
            _self.logCellDefault = parameters[0];
            _self.celulaPadrao = parameters[1];
            _self.descCelPadrao = parameters[2];
            _self.ctPadrao = parameters[3];
            _self.descCtPadrao = parameters[4];
        };

        _self.cancel = function () {
            $modalInstance.close('cancel');
        };
        _self.save = function () {
            var cellUpdateFields = serviceHelper.validateMissingFields($('#celulaPadraoForm'));
            if(!cellUpdateFields.isValid()) {
                cellUpdateFields.showDefaultMessage();               
                return;
            };
            integrationparamsFactory.saveCellParameters({},{logCellDefault: _self.logCellDefault,
                                                            celulaPadrao: _self.celulaPadrao,
                                                            descCelPadrao: _self.descCelPadrao,
                                                            ctPadrao: _self.ctPadrao,
                                                            descCtPadrao: _self.descCtPadrao},function(result){
                if(!result.$hasError) {
                    $modalInstance.close(true);

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type:   'sucess',
                        title:  $rootScope.i18n('l-default-cell-editing'),
                        detail: $rootScope.i18n('l-success-transaction'),
                    });
                }
            });
        };

        _self.init();
    }

    index.register.controller('ekanban.cell.modal.ctrl', CellModalCtrl);
    index.register.service('ekanban.cell.modal', modalCell);
});

