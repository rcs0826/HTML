define(['index',
        '/dts/kbn/js/helpers.js',
        '/dts/kbn/js/factories/mappingErp-factories.js'
], function (index) {

    modalChecklistEdit.$inject = ['$modal'];
    function modalChecklistEdit($modal) {
        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/checklist/checklist.edit.html',
                controller: 'ekanban.checklist.edit.ctrl as controller',
                backdrop: 'static',
                keyboard: true,
                resolve: {parameters: function () { return params; } }
            });

            return instance.result;
        };
    }

    checklistEditCtrl.$inject = [
        'parameters', 
        '$modalInstance', 
        'kbn.helper.Service', 
        'messageHolder', 
        '$rootScope',
        'kbn.mappingErp.Factory'
    ];
    
    function checklistEditCtrl(
        parameters, 
        $modalInstance, 
        serviceHelper, 
        messageHolder, 
        $rootScope,
        factorymappingErp
    ) {
            
        var _self = this;
        _self.myParams = angular.copy(parameters);

        _self.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        _self.getLabelByAction = function (action) {
            switch (action) {
                case 'edit': return 'l-edit-checklist';
                case 'new': return 'l-new-checklist';
            }
        };

        _self.saveCallback = function (result) {
            if (result.hasOwnProperty('success')){
                if (!result.sucess){
                    messageHolder.showNotify({
                        type: 'error',
                        title: $rootScope.i18n('l-errors-found'),
                        detail: result.msg
                    });
                }
            }else{
                $modalInstance.close(result);
            }
        };

        _self.save = function (action, model) {
            var checklistFields = serviceHelper.validateMissingFields($('#checklistForm'));
            if(!checklistFields.isValid()) {
                checklistFields.showDefaultMessage();
                return;
            }

            factorymappingErp.checklistSaveRecord(model, function(result) {
                if(!result.$hasError){
                    $modalInstance.close(result);
                }
            });
            
        };
    }

    index.register.controller('ekanban.checklist.edit.ctrl', checklistEditCtrl);
    index.register.service('ekanban.checklist.edit.modal', modalChecklistEdit);
});
