define([
    'index',
    '/dts/kbn/js/factories/ctupdate-factory.js'
], function (index) {

    modalCtEdit.$inject = ['$modal'];
    function modalCtEdit($modal) {
        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/ctupdate/ctupdate.edit.modal.html',
                controller: 'ekanban.ctupdate.edit.ctrl as controller',
                backdrop: 'static',
                keyboard: false,
                resolve: { parameters: function () { return params; } }
            });
            return instance.result;
        };
    }

    modalCtEditCtrl.$inject = [
        '$modalInstance',
        '$rootScope',
        'parameters',
        'kbn.ctupdate.Factory',
        'TOTVSEvent'
    ];
    function modalCtEditCtrl(
        $modalInstance,
        $rootScope,
        modalParams,
        ctUpdateFactory,
        TOTVSEvent
    ) {
        _self = this;
        
        _self.init = function(){
            _self.accordionGeral = true;
            _self.myParams = angular.copy(modalParams);
        };

        _self.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        _self.save = function() {
            ctUpdateFactory.editWorkCenter(_self.myParams, function(result){
                if(!result.$hasError) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type:   'info',
                        title:  $rootScope.i18n('l-ct-edit'),
                        detail: $rootScope.i18n('l-success-transaction')
                    });
                    $modalInstance.close(result);
                }
            });
        };
        _self.init();
    }

    index.register.controller('ekanban.ctupdate.edit.ctrl', modalCtEditCtrl);
    index.register.service('ekanban.ctupdate.edit.modal', modalCtEdit);
});
