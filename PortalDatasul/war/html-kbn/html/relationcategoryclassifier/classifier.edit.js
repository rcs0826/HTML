define(['index',
        '/dts/kbn/js/helpers.js',
        '/dts/kbn/js/factories/mappingErp-factories.js'
], function (index) {

    modalClassifierEdit.$inject = ['$modal'];
    function modalClassifierEdit($modal) {
        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/relationcategoryclassifier/classifier.edit.html',
                controller: 'ekanban.classifier.edit.ctrl as controller',
                backdrop: 'static',
                keyboard: true,
                resolve: {parameters: function () { return params; } }
            });

            return instance.result;
        };
    }

    classifierEditCtrl.$inject = ['parameters', '$modalInstance', 'kbn.mappingErp.Factory', 'kbn.helper.Service', 'messageHolder', '$rootScope'];
    function classifierEditCtrl(parameters, $modalInstance, mappingErpFactories, serviceHelper, messageHolder, $rootScope) {
        var _self = this;
        _self.myParams = angular.copy(parameters);

        _self.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        _self.getLabelByAction = function (action) {
            switch (action) {
                case 'edit': return 'l-edit-classifier';
                case 'new': return 'l-new-classifier';
            }
        };

        _self.save = function () {
            var checklistFields = serviceHelper.validateMissingFields($('#classifierForm'));
            if(!checklistFields.isValid()) {
                checklistFields.showDefaultMessage();
                return;
            }

            callback = function(result) {
                if (!result.$hasError)
                    $modalInstance.close();
            };

            if (_self.myParams.action == 'edit') {
                mappingErpFactories.UpdateKbnClassif({}, _self.myParams.model, callback);
            } else if (_self.myParams.action == 'new') {
                mappingErpFactories.CreateKbnClassif({}, _self.myParams.model, callback);
            }
        };
    }

    index.register.controller('ekanban.classifier.edit.ctrl', classifierEditCtrl);
    index.register.service('ekanban.classifier.edit.modal', modalClassifierEdit);
});
