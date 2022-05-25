define([
    'index',
    '/dts/kbn/js/factories/mappingErp-factories.js',
    '/dts/kbn/js/directives.js',
], function (index) {

    modalBoardAdvancedSearch.$inject = ['$modal'];
    function modalBoardAdvancedSearch($modal) {

        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/board/board.advanced.search.html',
                controller: 'ekanban.board.advanced.search.ctrl as controller',
                backdrop: 'static',
                keyboard: false,
                resolve: { parameters: function () { return params; } }
            });
            return instance.result;
        };

    }

    boardAdvancedSearchCtrl.$inject = [ 'parameters', '$modalInstance', '$rootScope', 'kbn.data.Factory' ];
    function boardAdvancedSearchCtrl( parameters, $modalInstance, $rootScope, dataFactory ) {

        _self = this;

        _self.init = function(){
            _self.classfierSelected = parameters.classfierSelected;
            _self.accordionEstab = true;
            _self.accordionClassifier = false;

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

            $modalInstance.close({classifiers: _self.classfierSelected, estab:_self.estabDirective, filtro: filtros});

        };

        _self.init();
    }

    index.register.controller('ekanban.board.advanced.search.ctrl', boardAdvancedSearchCtrl);
    index.register.service('ekanban.board.advanced.search.modal', modalBoardAdvancedSearch);
});
