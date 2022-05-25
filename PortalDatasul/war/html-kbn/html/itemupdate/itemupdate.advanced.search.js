define([
    'index',
    '/dts/kbn/js/legend.js',
    '/dts/kbn/js/enumkbn.js'
], function (index) {

    modalItemUpdateAdvSearch.$inject = ['$modal'];
    function modalItemUpdateAdvSearch($modal) {
        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/itemupdate/itemupdate.advanced.search.html',
                controller: 'ekanban.itemupdate.advanced.search.ctrl as controller',
                backdrop: 'static',
                keyboard: false,
                resolve: { parameters: function () { return params; } }
            });
            return instance.result;
        };
    }

    modalItemUpdateAdvSearchCtrl.$inject = [
        '$modalInstance',
        '$rootScope',
        'kbn.legend',
        'parameters',
        'enumkbn'
    ];
    function modalItemUpdateAdvSearchCtrl(
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


        _self.findItemTypeDisclaimer = function(key) {
            var found = _self.options.filter(function(obj) {
                return (obj.value === key);
            });
            return found[0];
        };

        var itemTypeIni = 2;
        if(modalParams.length > 0) {
            var itemTypeProperty = modalParams.forEach(function(obj) {
                
                if(obj.property === 'log_expedic') {
                    if (obj.value){
                        itemTypeIni = 1;
                    }
                    else if (!obj.value){
                        itemTypeIni = 0;
                    }                    
                }
                _self.itemType = _self.findItemTypeDisclaimer(itemTypeIni);
            });
        }
        else {
            _self.itemType = _self.findItemTypeDisclaimer(itemTypeIni);
        }

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        this.apply = function() {
            var filtros = [];
            var final = true;
            if (_self.itemType.value == 0){
                final = false;
            }
            else if (_self.itemType.value == 1){
                final = true;
            }
            
            if (_self.itemType.value != 2){
                filtros.push({
                    property: 'log_expedic',
                    restriction: 'EQUALS',
                    title: $rootScope.i18n('l-type') + ': ' + _self.itemType.desc,
                    value: final
                });
            }
            filtros.forEach(function(result){
                if(result.property == "log_expedic" && result.value == enumkbn.itemType.both){
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

            $modalInstance.close({estab:_self.estabDirective, filtro: filtros});
        };
            
        _self.init();

    }

    index.register.controller('ekanban.itemupdate.advanced.search.ctrl', modalItemUpdateAdvSearchCtrl);
    index.register.service('ekanban.itemupdate.advanced.search.modal', modalItemUpdateAdvSearch);
});
