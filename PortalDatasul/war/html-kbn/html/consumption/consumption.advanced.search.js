define([
    'index',
    '/dts/kbn/js/directives.js'
], function (index) {

    modalConsumptionAdvancedSearch.$inject = ['$modal'];
    function modalConsumptionAdvancedSearch($modal) {

        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/consumption/consumption.advanced.search.html',
                controller: 'ekanban.consumption.advanced.search.ctrl as controller',
                backdrop: 'static',
                keycellProgramming: false,
                resolve: { parameters: function () { return params; } }
            });
            return instance.result;
        };

    }

    consumptionAdvancedSearchCtrl.$inject = [
        'parameters',
        '$modalInstance',
        '$rootScope',
        'kbn.data.Factory'
    ];
    function consumptionAdvancedSearchCtrl(
        parameters,
        $modalInstance,
        $rootScope,
        dataFactory
    ) {
        _self = this;

        _self.init = function(){
            _self.accordionEstab = true;

            if (parameters.estab.cod_estab_erp){
                _self.establishmentChanged = parameters.estab;
            }
        };

        _self.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        _self.apply = function () {
            $modalInstance.close({ estab:_self.establishmentChanged });
        };

        _self.init();
    }

    index.register.controller('ekanban.consumption.advanced.search.ctrl', consumptionAdvancedSearchCtrl);
    index.register.service('ekanban.consumption.advanced.search.modal', modalConsumptionAdvancedSearch);
});
