define(['index',
        '/dts/kbn/js/factories/mappingErp-factories.js'
], function (index) {

        modalCellItemEdit.$inject = ['$modal'];
        function modalCellItemEdit($modal) {
            this.open = function (params) {
                var instance = $modal.open({
                    templateUrl: '/dts/kbn/html/flow/flow.edit.quantity.html',
                    controller: 'kbn.edit.quantity.ctrl as controller',
                    backdrop: 'static',
                    keyboard: true,
                    resolve: { parameters: function () { return params; } }
                });
                return instance.result;
            };
        }

        editQuantityCtrl.$inject = [
            'parameters',
            'TOTVSEvent',
            '$modalInstance',
            '$rootScope',
            'kbn.mappingErp.Factory'
        ];
        function editQuantityCtrl(
            parameters,
            TOTVSEvent,
            $modalInstance,
            $rootScope,
            factoryMappingErp
        ) {
            var _self = this;

            _self.init = function(){
                _self.relacItem = angular.copy(parameters);
            };

            _self.save = function(){
                factoryMappingErp.alteraQuantidadeRelac(
                    {
                        numIdRelac: _self.relacItem.numIdRelac,
                        qtdPai: _self.relacItem.qtdPai,
                        qtdFilho: _self.relacItem.qtdFilho
                    }, {}, function(result){
                        if(!result.$hasError) {
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type:   'sucess',
                                title:  $rootScope.i18n('l-edit-quantity'),
                                detail: $rootScope.i18n('l-success-transaction')
                            });

                            $modalInstance.close(result);
                        }
                    });
            };

            _self.cancel = function(){
                $modalInstance.dismiss('cancel');
            };

            _self.init();
        }
    
    index.register.controller('kbn.edit.quantity.ctrl', editQuantityCtrl);
    index.register.service('kbn.edit.quantity.modal', modalCellItemEdit);
});