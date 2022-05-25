define([
    "index",
    "/dts/kbn/js/factories/mappingErp-factories.js"
],
function(index) {
    modalQueueLockService.$inject = [ "$modal" ];
    function modalQueueLockService($modal) {
        this.open = function(params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/board/board.queueLock.modal.html',
                controller: 'kbn.board.queueLock.controller as controller',
                backdrop: 'static',
                keyboard: true,
                size: 'md',
                resolve: { parameters: function () { return params; } }
            });

            return instance.result;
        };
    }

    modalQueueLockController.$inject = ['$filter', '$modalInstance', 'parameters', "kbn.helper.Service", "kbn.mappingErp.Factory", "messageHolder", "$rootScope"];
    function modalQueueLockController($filter, $modalInstance, parameters, kbnHelper, mappingErpFactory, messageHolder, $rootScope) {
        var _self = this;

        _self.items = [];
        _self.justification = {};

        var init = function() {
            _self.items = parameters.items;

            var category = 1; //Bloqueio Cartao

            _self.listJustification = parameters.justificatives;
        };

        _self.close = function() {
        	_self.items = [];
            $modalInstance.close(false);
        };

        _self.lock = function(){

            if(typeof _self.justification == "undefined" || typeof _self.justification.num_id_justif == "undefined"){
                _self.invalidJustificative = true;
                return;
            }else{
                _self.invalidJustificative = false;
            }

            mappingErpFactory.bloquearCartao({justificative:_self.justification.num_id_justif}, _self.items, function(){

                messageHolder.showNotify({
                    type: 'info',
                    title: $rootScope.i18n('l-lock-cards-success')
                });

                $modalInstance.close(true);

            });

        }

        init();
    }

    index.register.service('kbn.board.queueLock.service', modalQueueLockService);
    index.register.controller('kbn.board.queueLock.controller', modalQueueLockController);
});
