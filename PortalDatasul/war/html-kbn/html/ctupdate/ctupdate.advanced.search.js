define([
    'index',
    '/dts/kbn/js/legend.js',
    '/dts/kbn/js/enumkbn.js'
], function (index) {

    modalCtUpdateAdvSearch.$inject = ['$modal'];
    function modalCtUpdateAdvSearch($modal) {
        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/ctupdate/ctupdate.advanced.search.html',
                controller: 'ekanban.ctupdate.advanced.search.ctrl as controller',
                backdrop: 'static',
                keyboard: false,
                resolve: { parameters: function () { return params; } }
            });
            return instance.result;
        };
    }

    modalCtUpdateAdvSearchCtrl.$inject = [
        '$modalInstance',
        '$rootScope',
        'kbn.legend',
        'parameters',
        'enumkbn'
    ];
    function modalCtUpdateAdvSearchCtrl(
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
                    property: 'num_id_estab',
                    title: $rootScope.i18n('l-site') + ": " + _self.estabDirective.cod_estab_erp,
                    value: _self.estabDirective.num_id_estab,
                    fixed: true                    
                });
            }
            $modalInstance.close({estab:_self.estabDirective, filtro: filtros});
        };            
        _self.init();
    }

    index.register.controller('ekanban.ctupdate.advanced.search.ctrl', modalCtUpdateAdvSearchCtrl);
    index.register.service('ekanban.ctupdate.advanced.search.modal', modalCtUpdateAdvSearch);
});
