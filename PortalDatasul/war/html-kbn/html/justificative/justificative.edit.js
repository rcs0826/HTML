define(['index',
        '/dts/kbn/js/helpers.js',
        '/dts/kbn/js/legend.js',
        '/dts/kbn/js/factories/mappingErp-factories.js'
], function (index) {

    modalJustificativeEdit.$inject = ['$modal'];
    function modalJustificativeEdit($modal) {
        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/justificative/justificative.edit.html',
                controller: 'ekanban.justificative.edit.ctrl as controller',
                backdrop: 'static',
                keyboard: true,
                resolve: { parameters: function () { return params; } }
            });
            return instance.result;
        };
    }

    justificativeEditCtrl.$inject = ['parameters', '$modalInstance', 'kbn.mappingErp.Factory', 'kbn.helper.Service', '$rootScope', 'kbn.legend', 'messageHolder'];
    function justificativeEditCtrl(parameters, $modalInstance, mappingErpFactory, serviceHelper, $rootScope, legend, messageHolder) {
        var _self = this;

        _self.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        _self.getLabelByAction = function (action) {
            switch (action) {
                case 'edit': return 'l-edit-justificative';
                case 'new': return 'l-new-justificative';
            }
        };

        _self.justCategoryDesc = {
            4: 'l-extra-card-emission',
            3: 'l-balance-adjust',
            2: 'l-card-reorder',
            1: 'l-card-lock'
        };

        _self.getCategoryDesc = function (CategoryInt) {
            for (var indice in _self.justCategoryDesc) {
                if (indice == CategoryInt) {
                    return $rootScope.i18n(_self.justCategoryDesc[indice]);
                }
            }
        };

        _self.save = function (action, model) {
            var justificativeFields = serviceHelper.validateMissingFields($('#justificativeForm'));

            if(!justificativeFields.isValid()) {
                justificativeFields.showDefaultMessage();
                return;
            }

            model.num_id_categ = model.num_id_categ.num_id;

            mappingErpFactory.saveJustificatives(model, function(result){
                if(!result.$hasError){
                    $modalInstance.close(result);
                }else{
                    _self.getMotive(model.num_id_categ);
                }
            });

        };

        _self.motives = [
            {num_id: 1, nom_category: legend.motive.NAME(1)},
            /*{num_id: 2, nom_category: legend.motive.NAME(2)},*/
            {num_id: 3, nom_category: legend.motive.NAME(3)},
            {num_id: 4, nom_category: legend.motive.NAME(4)}
        ];

        _self.getMotive = function(id){

            _self.motives.forEach(function(motive) {
                
                if (motive.num_id === id) {
                    _self.myParams.model.num_id_categ = motive;
                }
            });

        }

        _self.init = function() {
            _self.myParams = angular.copy(parameters);
            
            if (_self.myParams.model)
                _self.getMotive(_self.myParams.model.num_id_categ);
        };

        _self.init();

    }

    index.register.controller('ekanban.justificative.edit.ctrl', justificativeEditCtrl);
    index.register.service('ekanban.justificative.edit.modal', modalJustificativeEdit);
});
