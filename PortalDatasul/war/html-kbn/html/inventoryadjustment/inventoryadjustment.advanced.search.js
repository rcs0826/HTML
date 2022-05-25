define([
    'index',
    '/dts/kbn/js/factories/mappingErp-factories.js',
    '/dts/kbn/js/directives.js',
], function (index) {

    modalInventoryadjustmentAdvancedSearch.$inject = ['$modal'];
    function modalInventoryadjustmentAdvancedSearch($modal) {

        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/inventoryadjustment/inventoryadjustment.advanced.search.html',
                controller: 'ekanban.inventoryadjustment.advanced.search.ctrl as controller',
                backdrop: 'static',
                resolve: { parameters: function () { return params; } }
            });
            return instance.result;
        };

    }

    inventoryadjustmentAdvancedSearchCtrl.$inject = [ 'parameters', '$modalInstance', '$rootScope', 'kbn.data.Factory' ];
    function inventoryadjustmentAdvancedSearchCtrl( parameters, $modalInstance, $rootScope, dataFactory ) {

        _self = this;

        _self.init = function(){
            _self.accordionEstab = true;

            if (parameters.estab && parameters.estab.cod_estab_erp){
                _self.establishmentErpCode = parameters.estab;
            }
        };

        _self.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        _self.apply = function() {
            var filtros = [];

            if (_self.establishmentErpCode) {

                _self.estabDirective = _self.establishmentErpCode;

                filtros.push({
                    property: 'cod_estab_erp',
                    title: $rootScope.i18n('l-site') + ": " + _self.estabDirective.cod_estab_erp,
                    value: _self.estabDirective.cod_estab_erp,
                    fixed: true
                });

            }

            $modalInstance.close({estab:_self.estabDirective, filtro: filtros});

        };

        _self.init();
    }

    index.register.controller('ekanban.inventoryadjustment.advanced.search.ctrl', inventoryadjustmentAdvancedSearchCtrl);
    index.register.service('ekanban.inventoryadjustment.advanced.search.modal', modalInventoryadjustmentAdvancedSearch);
});
