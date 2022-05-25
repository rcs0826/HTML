define(['index',
        '/dts/kbn/js/helpers.js',
        '/dts/kbn/js/factories/itemupdate-factory.js',
], function (index) {
    modalItemUpdateEdit.$inject = ['$modal'];
    function modalItemUpdateEdit($modal) {
        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/itemupdate/itemupdate.edit.html',
                controller: 'kbn.itemupdate.edit.ctrl as controller',
                backdrop: 'static',
                keyboard: true,
                size: 'lg',
                resolve: { parameters: function () { return params; } }
            });
            return instance.result;
        };
    }

    itemupdateListCtrl.$inject = [
        'parameters',
        '$modalInstance',
        '$scope',
        'TOTVSEvent',
        'kbn.itemupdate.Factory',
        'kbn.helper.Service',
        '$rootScope',
        'messageHolder',];
    function itemupdateListCtrl(
        parameters,
        $modalInstance,
        $scope,
        TOTVSEvent,
        itemUpdateFactory,
        serviceHelper,
        $rootScope,
        messageHolder,) {

        var _self = this;
        var aux_idi_control_kanban = 0;
        
        
        _self.init = function() {
            _self.myParams = angular.copy(parameters);
            if (_self.myParams.model !== undefined)
                _self.programa = _self.myParams.model.programa;
                aux_idi_control_kanban = _self.myParams.model.idi_control_kanban;
        };
            

        _self.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        _self.getLabelByAction = function (action) {
            switch (action) {
                case 'edit': return 'l-edit-item';
                case 'new': return 'l-new-item';
            }
        };

        _self.save = function (action, model) {

            var itemUpdateFields = serviceHelper.validateMissingFields($('#itemUpdateForm'));

            if(!itemUpdateFields.isValid()) {
                itemUpdateFields.showDefaultMessage();               
                return;
            };

            if (aux_idi_control_kanban !== model.idi_control_kanban){
                messageHolder.showQuestion($rootScope.i18n('l-item-update'), $rootScope.i18n('msg-change-control-item-kanban'),function (answer) {
                    if(answer === true){
                        itemUpdateFactory.saveItemUpdate(model, function(result){
                            if(!result.$hasError){
                                _self.showReturn(action);
                                $modalInstance.close(result);
                            };
                        });
                    };
                });
            }
            else {
                itemUpdateFactory.saveItemUpdate(model, function(result){
                    if(!result.$hasError){
                        _self.showReturn(action);
                        $modalInstance.close(result);
                    };
                });
            };
        };
        
        _self.showReturn = function (action){
            if (action == 'new') {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type:   'info',
                    title:  $rootScope.i18n('l-new-item'),
                    detail: $rootScope.i18n('l-success-transaction')
                });
            };
            if (action == 'edit') {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type:   'info',
                    title:  $rootScope.i18n('l-edit-item'),
                    detail: $rootScope.i18n('l-success-transaction')
                });
            };
        };
        
        _self.init();
    }
    index.register.controller('kbn.itemupdate.edit.ctrl', itemupdateListCtrl);
    index.register.service('kbn.itemupdate.edit.modal', modalItemUpdateEdit);
});
