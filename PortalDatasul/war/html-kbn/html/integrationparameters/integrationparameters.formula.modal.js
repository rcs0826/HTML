    define(['index',
            '/dts/kbn/js/factories/mappingErp-factories.js',
            '/dts/kbn/js/factories/integration-params-factory.js'
], function (index) {

    modalFormula.$inject = ['$modal'];

    function modalFormula($modal) {
        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/integrationparameters/integrationparameters.formula.modal.html',
                controller: 'ekanban.formula.modal.ctrl as controller',
                backdrop: 'static',
                resolve: {parameters: function(){ return params; }},
                size: 'lg'
            });
            return instance.result;
        }
    }
    FormulaModalCtrl.$inject = [
        '$modalInstance',
        '$rootScope',
        'kbn.mappingErp.Factory',
        'parameters',
        'TOTVSEvent',
        'kbn.integrationparams.Factory'
    ];

    function FormulaModalCtrl(
         $modalInstance,
         $rootScope,
         mappingErpFactory,
         parameters,
         TOTVSEvent,
         integrationparamsFactory) {

        var _self = this;

        _self.init = function(){
            _self.diretorioFormula = parameters;
        };

        _self.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        _self.save = function () {
            integrationparamsFactory.saveDefaultParameters({},{key_param: 'directory_formula', value_param: _self.diretorioFormula},function(result){
                if(!result.$hasError) {
                    $modalInstance.close();

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type:   'sucess',
                        title:  $rootScope.i18n('l-derectory-formula-editing'),
                        detail: $rootScope.i18n('l-success-transaction'),
                    });
                }
            });
        };

        _self.init();
    }

    index.register.controller('ekanban.formula.modal.ctrl', FormulaModalCtrl);
    index.register.service('ekanban.formula.modal', modalFormula);
});
