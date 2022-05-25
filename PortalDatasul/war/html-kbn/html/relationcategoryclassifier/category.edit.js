define(['index',
        '/dts/kbn/js/helpers.js',
        '/dts/kbn/js/factories/mappingErp-factories.js'
], function (index) {

    modalCategoryEdit.$inject = ['$modal'];
    function modalCategoryEdit($modal) {
        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/relationcategoryclassifier/category.edit.html',
                controller: 'ekanban.category.edit.ctrl as controller',
                backdrop: 'static',
                keyboard: true,
                resolve: {parameters: function () { return params; } }
            });

            return instance.result;
        };
    }

    categoryEditCtrl.$inject = ['parameters', '$modalInstance', 'kbn.mappingErp.Factory', 'kbn.helper.Service', 'messageHolder', '$rootScope'];
    function categoryEditCtrl(parameters, $modalInstance, mappingErpFactories, serviceHelper, messageHolder, $rootScope) {
        var _self = this;
        _self.myParams = angular.copy(parameters);

        _self.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        _self.getLabelByAction = function (action) {
            switch (action) {
                case 'edit': return 'l-edit-category';
                case 'new': return 'l-new-category';
            }
        };

        _self.save = function () {
            var checklistFields = serviceHelper.validateMissingFields($('#categoryForm'));
            if(!checklistFields.isValid()) {
                checklistFields.showDefaultMessage();
                return;
            }

            callback = function(result) {
                if (!result.$hasError)
                    $modalInstance.close();
            };

            if (_self.myParams.action == 'edit') {
                mappingErpFactories.UpdateKbnCateg({}, _self.myParams.model, callback);
            } else if (_self.myParams.action == 'new') {
                mappingErpFactories.CreateKbnCateg({}, _self.myParams.model, callback);
            }
        };
    }

    index.register.controller('ekanban.category.edit.ctrl', categoryEditCtrl);
    index.register.service('ekanban.category.edit.modal', modalCategoryEdit);
});
