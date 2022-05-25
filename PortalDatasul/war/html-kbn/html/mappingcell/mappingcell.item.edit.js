define(['index',
        '/dts/kbn/js/factories/item-zoom.js'
], function (index) {

        modalItemEdit.$inject = ['$modal'];
        function modalItemEdit($modal) {
            this.open = function (params) {
                var instance = $modal.open({
                    templateUrl: '/dts/kbn/html/mappingcell/mappingcell.item.edit.html',
                    controller: 'kbn.item.edit.ctrl as controller',
                    backdrop: 'static',
                    keyboard: true,
                    size: 'lg',
                    resolve: { parameters: function () { return params; } }
                });
                return instance.result;
            };
        }

        itemEditCtrl.$inject = [
            'parameters',
            '$modalInstance',
            'kbn.item-zoom.Factory'
        ];
        function itemEditCtrl(
            parameters,
            $modalInstance,
            factoryZoomItem
        ) {

            var _self = this;

            _self.init = function(){
                _self.mapping = parameters.mapping;
                _self.cell = parameters.cell;
                _self.items = parameters.itemsToInclud;
                $modalInstance.close(true);
            };

            _self.cancel = function(){
                $modalInstance.dismiss('cancel');
            };

            _self.confirm = function(){
                factoryZoomItem.addItensToCell({num_id_cel: _self.cell.num_id_cel}, _self.items, function(result){
                    if(!result.$hasError) $modalInstance.close(true);
                })
            }

            _self.init();
        }

        index.register.controller('kbn.item.edit.ctrl', itemEditCtrl);
        index.register.service('kbn.item.edit.modal', modalItemEdit);

    }
);
