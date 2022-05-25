define([
    'index',
    '/dts/kbn/js/legend.js',
    '/dts/kbn/js/enumkbn.js'
], function (index) {

    modalSupermarketStatusAdvSearch.$inject = ['$modal'];
    function modalSupermarketStatusAdvSearch($modal) {
        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/supermarketstatus/supermarketstatus.advanced.search.html',
                controller: 'ekanban.supermarketstatus.advanced.search.ctrl as controller',
                backdrop: 'static',
                keyboard: false,
                resolve: { parameters: function () { return params; } }
            });
            return instance.result;
        };
    }

    supermarketStatusAdvSearchCtrl.$inject = [
        '$modalInstance',
        '$rootScope',
        'kbn.legend',
        'parameters',
        'enumkbn'
    ];
    function supermarketStatusAdvSearchCtrl(
        $modalInstance,
        $rootScope,
        legendService,
        modalParams,
        enumkbn
    ) {
        _self = this;
        _self.options = legendService.itemType.OPTIONS;
        
        _self.init = function(){
            _self.accordionGeral = true;
        };

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
            
        _self.findItemTypeDisclaimer = function(key) {
            var found = _self.options.filter(function(obj) {
                if (key == true){
                    key = 1;
                } else if (key == false){
                    key = 0;
                }
                
                return (obj.value === key);
            });
            return found[0];
        };
        
        _self.classifierSelected = [];
        if(modalParams.length > 0) {
            var itemTypeProperty = modalParams.forEach(function(obj) {
                if(obj.property === 'kbn_item.log_expedic') {
                    _self.itemType = _self.findItemTypeDisclaimer(obj.value);
                }
                
                if(obj.property ==='classifier') {
                    _self.classifierSelected = obj.value;
                }
            });
        }

        this.apply = function() {
            var filtros = [];
            
            if(_self.itemType){
                filtros.push({
                    property: 'kbn_item.log_expedic',
                    restriction: 'EQUALS',
                    title: $rootScope.i18n('l-type') + ': ' + _self.itemType.desc,
                    value: _self.itemType.value,
                    isParam: true
                });
                filtros.forEach(function(result){
                    if(result.property == "itemType" && result.value == enumkbn.itemType.both){
                        result.hide = true;
                    }
                });
            }
            
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

    index.register.controller('ekanban.supermarketstatus.advanced.search.ctrl', supermarketStatusAdvSearchCtrl);
    index.register.service('ekanban.supermarketstatus.advanced.search.modal', modalSupermarketStatusAdvSearch);
});
