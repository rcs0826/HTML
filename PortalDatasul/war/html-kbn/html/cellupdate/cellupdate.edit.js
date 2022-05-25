define(['index',
        '/dts/kbn/js/helpers.js',
        '/dts/kbn/js/factories/cellupdate-factory.js',
], function (index) {
    modalCellUpdateEdit.$inject = ['$modal'];
    function modalCellUpdateEdit($modal) {
        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/cellupdate/cellupdate.edit.html',
                controller: 'kbn.cellupdate.edit.ctrl as controller',
                backdrop: 'static',
                keyboard: true,
                size: 'lg',
                resolve: { parameters: function () { return params; } }
            });
            return instance.result;
        };
    }

    cellupdateListCtrl.$inject = [
        'parameters',
        '$modalInstance',
        '$scope',
        'TOTVSEvent',
        'kbn.cellupdate.Factory',
        'kbn.helper.Service',
        '$rootScope',
        'messageHolder',];
    function cellupdateListCtrl(
        parameters,
        $modalInstance,
        $scope,
        TOTVSEvent,
        cellUpdateFactory,
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
                case 'edit': return 'l-cell-edit';
                case 'new': return 'l-new-cell';
            }
        };

        _self.save = function (action, model) {

            var cellUpdateFields = serviceHelper.validateMissingFields($('#cellUpdateForm'));

            if(!cellUpdateFields.isValid()) {
                cellUpdateFields.showDefaultMessage();               
                return;
            };

            cellUpdateFactory.saveCellUpdate(model, function(result){
                if(!result.$hasError){
                    _self.showReturn(action);
                    $modalInstance.close(result);
                };
            });
        };
        
        _self.showReturn = function (action){
            if (action == 'new') {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type:   'info',
                    title:  $rootScope.i18n('l-new-cell'),
                    detail: $rootScope.i18n('l-success-transaction')
                });
            };
            if (action == 'edit') {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type:   'info',
                    title:  $rootScope.i18n('l-cell-edit'),
                    detail: $rootScope.i18n('l-success-transaction')
                });
            };
        };
        
        _self.init();
    }
    index.register.controller('kbn.cellupdate.edit.ctrl', cellupdateListCtrl);
    index.register.service('kbn.cellupdate.edit.modal', modalCellUpdateEdit);
});
