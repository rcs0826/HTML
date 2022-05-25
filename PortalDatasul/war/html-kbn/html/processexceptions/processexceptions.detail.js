define([
    'index',
    '/dts/kbn/js/factories/card-factory.js'
], function (index) {

    modalItemDetailException.$inject = ['$modal'];

    function modalItemDetailException($modal) {
        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/processexceptions/processexceptions.detail.html',
                controller: 'ekanban.processexceptions.detailCtrl as controller',
                backdrop: 'static',
                keyboard: true,
                size: 'lg',
                resolve: {
                    parameters: function () {
                        return params;
                    }
                }
            });
            return instance.result;
        }
    }
    itemDetailExceptionCtrl.$inject = ['$modalInstance', 'parameters', 'kbn.cards.Factory', '$rootScope'];

    function itemDetailExceptionCtrl($modalInstance, parameters, cardsFactory, $rootScope) {
        var _self = this;

        _self.init = function(){
            _self.item = parameters.item;
            _self.doSearchDetail();
        };

        _self.doSearchDetail = function(){
            cardsFactory.getProcessExceptionsItemDetail({
                datIni: parameters.datIni,
                datFim: parameters.datFim,
                num_id_item: parameters.item.ttItemExceptionDs.num_id_item
            },parameters.param,function(result){
                _self.movtoDetail = result;
            })
        };

        _self.exceptionType = function(idException){
            var exception = {
                1: $rootScope.i18n("l-lock-queue"),
                2: $rootScope.i18n("l-blocking-in-production"),
                3: $rootScope.i18n("l-lock-on-transport"),
                4: $rootScope.i18n("l-extra-card-emission"),
                5: $rootScope.i18n("l-inventory-balance-adjust")
            };
            return exception[idException];
        };

        _self.close = function () {
            $modalInstance.close(true);
        };

        _self.init();
    }

    index.register.controller('ekanban.processexceptions.detailCtrl', itemDetailExceptionCtrl);
    index.register.service('ekanban.processexceptions.detailModal', modalItemDetailException);
});
