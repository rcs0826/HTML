define([
    'index',
    '/dts/kbn/js/directives.js'
], function (index) {

    modalCellProgrammingAdvancedSearch.$inject = ['$modal'];
    function modalCellProgrammingAdvancedSearch($modal) {

        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/cellprogramming/cellprogramming.advanced.search.html',
                controller: 'ekanban.cellprogramming.advanced.search.ctrl as controller',
                backdrop: 'static',
                keycellProgramming: false,
                resolve: { parameters: function () { return params; } }
            });
            return instance.result;
        };

    }

    cellProgrammingAdvancedSearchCtrl.$inject = [ 'parameters', '$modalInstance', '$rootScope', 'kbn.data.Factory' ];
    function cellProgrammingAdvancedSearchCtrl( parameters, $modalInstance, $rootScope, dataFactory ) {

        _self = this;

        _self.init = function(){
            _self.classfierSelected = parameters.classfierSelected;
            _self.accordionEstab = true;
            _self.accordionClassifier = false;

            if (parameters.estab.cod_estab_erp){
                _self.establishmentChanged = parameters.estab;
            }
        };

        _self.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        _self.apply = function () {
            var filtros = [];

            if (_self.establishmentChanged) {

                _self.estabDirective = _self.establishmentChanged;

                filtros.push({
                    property: 'cod_estab_erp',
                    title: $rootScope.i18n('l-site') + ": " + _self.estabDirective.cod_estab_erp,
                    value: _self.estabDirective.cod_estab_erp,
                    fixed: true
                });

            }

            $modalInstance.close({classifiers: _self.classfierSelected, estab:_self.estabDirective, filtro: filtros});
        };

        _self.init();
    }

    index.register.controller('ekanban.cellprogramming.advanced.search.ctrl', cellProgrammingAdvancedSearchCtrl);
    index.register.service('ekanban.cellprogramming.advanced.search.modal', modalCellProgrammingAdvancedSearch);
});
