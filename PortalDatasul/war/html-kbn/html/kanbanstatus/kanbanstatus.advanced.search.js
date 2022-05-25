define([
    'index',
    '/dts/kbn/js/legend.js',
    '/dts/kbn/js/enumkbn.js'
], function (index) {

    modalKanbanStatusAdvSearch.$inject = ['$modal'];
    function modalKanbanStatusAdvSearch($modal) {
        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/kanbanstatus/kanbanstatus.advanced.search.html',
                controller: 'ekanban.kanbanstatus.advanced.search.ctrl as controller',
                backdrop: 'static',
                keyboard: false,
                resolve: { parameters: function () { return params; } }
            });
            return instance.result;
        };
    }

    kanbanStatusAdvSeearchCtrl.$inject = [
        '$modalInstance',
        '$rootScope',
        'kbn.legend',
        'parameters',
        'enumkbn'
    ];
    function kanbanStatusAdvSeearchCtrl(
        $modalInstance,
        $rootScope,
        legendService,
        modalParams,
        enumkbn
    ) {
        _self = this;
        _self.options = legendService.itemType.OPTIONS;
        
        _self.init = function(){
            _self.classifierSelected = [];
            modalParams.forEach(function(obj) {
                if(obj.property === 'classifier') {
                    _self.classifierSelected = obj.value;
                }
            });
            _self.accordionGeral = true;
            _self.accordionClassifier = false;
        };

        _self.findItemTypeDisclaimer = function(key) {
            var found = _self.options.filter(function(obj) {
                return (obj.value === key);
            });
            return found[0];
        };

        if(modalParams.length > 0) {
            var itemTypeProperty = modalParams.forEach(function(obj) {
                if(obj.property === 'itemType') {
                    _self.itemType = _self.findItemTypeDisclaimer(obj.value);
                }
            });
        }

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        this.apply = function() {
            var filtros = [];

            filtros.push({
                property: 'itemType',
                restriction: 'EQUALS',
                title: $rootScope.i18n('l-type') + ': ' + _self.itemType.desc,
                value: _self.itemType.value
            });
            filtros.forEach(function(result){
                if(result.property == "itemType" && result.value == enumkbn.itemType.both){
                    result.hide = true;
                }
            });
            
            if (_self.establishmentChanged) {

                _self.estabDirective = _self.establishmentChanged;

                filtros.push({
                    property: 'cod_estab_erp',
                    title: $rootScope.i18n('l-site') + ": " + _self.estabDirective.cod_estab_erp,
                    value: _self.estabDirective.cod_estab_erp,
                    fixed: true
                });

            }

            $modalInstance.close({classifiers: _self.classifierSelected,estab:_self.estabDirective, filtro: filtros});
        };
            
        _self.init();

    }

    index.register.controller('ekanban.kanbanstatus.advanced.search.ctrl', kanbanStatusAdvSeearchCtrl);
    index.register.service('ekanban.kanbanstatus.advanced.search.modal', modalKanbanStatusAdvSearch);
});
