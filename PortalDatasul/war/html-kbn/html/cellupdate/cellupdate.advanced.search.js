define([
    'index',
    '/dts/kbn/js/legend.js',
    '/dts/kbn/js/enumkbn.js'
], function (index) {

    modalCellUpdateAdvSearch.$inject = ['$modal'];
    function modalCellUpdateAdvSearch($modal) {
        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/cellupdate/cellupdate.advanced.search.html',
                controller: 'ekanban.cellupdate.advanced.search.ctrl as controller',
                backdrop: 'static',
                keyboard: false,
                resolve: { parameters: function () { return params; } }
            });
            return instance.result;
        };
    }

    modalCellUpdateAdvSearchCtrl.$inject = [
        '$modalInstance',
        '$rootScope',
        'kbn.legend',
        'parameters',
        'enumkbn'
    ];
    function modalCellUpdateAdvSearchCtrl(
        $modalInstance,
        $rootScope,
        legendService,
        modalParams,
        enumkbn
    ) {
        _self = this;
        
        _self.init = function(){
            _self.accordionGeral = true;
        };

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        this.apply = function() {
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
            $modalInstance.close({estab:_self.estabDirective, filtro: filtros});
        };            
        _self.init();
    }

    index.register.controller('ekanban.cellupdate.advanced.search.ctrl', modalCellUpdateAdvSearchCtrl);
    index.register.service('ekanban.cellupdate.advanced.search.modal', modalCellUpdateAdvSearch);
});
