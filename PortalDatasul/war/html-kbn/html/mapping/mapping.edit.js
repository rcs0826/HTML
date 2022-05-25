define([
    'index',
    '/dts/kbn/js/helpers.js',
    '/dts/kbn/js/filters.js',
    '/dts/kbn/js/factories/mappingErp-factories.js'
], function (index) {

    modalMappingEdit.$inject = ['$modal'];
    function modalMappingEdit($modal) {

        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/mapping/mapping.edit.html',
                controller: 'ekanban.mapping.edit.ctrl as controller',
                backdrop: 'static',
                keyboard: true,
                resolve: { parameters: function () { return params; } }
            });
            return instance.result;
        };

    }

    mappingEditCtrl.$inject = [
        'parameters',
        '$modalInstance',
        'kbn.helper.Service',
        '$rootScope',
        'messageHolder',
        'kbn.mappingErp.Factory',
        '$location',
        'TOTVSEvent'];
    function mappingEditCtrl(
        parameters,
        $modalInstance,
        serviceHelper,
        $rootScope,
        messageHolder,
        mappingErpFactory,
        $location,
        TOTVSEvent
    ) {
        this.init = function() {
            this.myParams = angular.copy(parameters);

            this.listselect = [{
                id: 1,name:$rootScope.i18n('l-only-copy')
            }, {
                id:2,name:$rootScope.i18n('l-copy-verify-structure')
            }];

            if (this.myParams.action == "clone") {
                this.selected = this.listselect[0];
                this.datebackup = this.myParams.model.limitDate;
            }else{
                this.selected = this.listselect[1];
            }

            if (this.myParams.action == "new") {

                if (this.myParams.model === undefined){
                    this.myParams.model = { establishmentErpCode: undefined };
                }
            }
        };

        this.selectCloneType = function(){

            if(this.selected.id == 1){
                this.myParams.model.limitDate = this.datebackup;
            }
        };

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        this.getLabelByAction = function (action) {
            var stringTranslation;
            switch (action) {
            case 'clone':
                stringTranslation = 'l-clone-mapping';
                break;
            case 'edit':
                stringTranslation = 'l-edit-mapping';
                break;
            case 'new':
                stringTranslation = 'l-new-mapping';
                break;
            }
            return $rootScope.i18n(stringTranslation);
        };

        this.setFormScope = function (scope) {
            this.formScope = scope;
        };

        this.saveClone = function(model){
            if(this.selected.id==1){
                mappingErpFactory.cloneByCopy({
                    fatherMapId: model.num_id_mapeamento,
                    descMap: model.des_mapeamento
                }, {}, function(result) {
                    if(!result.$hasError) {
                        $modalInstance.close(result);
                    }
                });
            } else {
                mappingErpFactory.cloneByStructure({
                    fatherMapId: model.num_id_mapeamento,
                    cutOffDate: model.dat_corte,
                    'c-descMap': model.des_mapeamento
                }, {}, function(result) {
                    if(!result.$hasError  || result.mappingId !== undefined){
                        $modalInstance.close(result);
                    }
                });
            }
        };

        this.saveEdit = function(model){
            mappingErpFactory.saveMapping({ttMapping: [model]}, function(result) {
                $modalInstance.close(result);
            });
        };

        this.saveNew = function(model){
            model.published = false;
            delete model.$length;

            mappingErpFactory.createMapping({
                descMap: model.des_mapeamento,
                cutOffDate: model.dat_corte,
                siteCode: model.establishmentErpCode
             },
            function (result) {
                if(!result.$hasError) {
                    $modalInstance.close(result);
                }
            });
        };

        this.save = function (action, model) {
            var objValid = serviceHelper.validateMissingFields($('#mappingForm'));

            if(objValid.isValid()) {
                if(action == 'clone') {
                    this.saveClone(model);
                } else if(action == 'edit') {
                    this.saveEdit(model);
                } else {
                    this.saveNew(model);
                }
            } else {
                objValid.showDefaultMessage();
            }
        };

        this.callbackNoEstablishment = function() {
            var messageToShow = {};
            messageToShow.title = $rootScope.i18n('l-creation-validations');
            messageToShow.help = $rootScope.i18n("l-validation-nonexistent-establishments");
            messageToShow.size = 'md';

            $rootScope.$broadcast(TOTVSEvent.showMessage, messageToShow);

            $location.path("/dts/kbn/integrationparameters");

            $modalInstance.dismiss('cancel');
        };

        this.init();
    }

    index.register.controller('ekanban.mapping.edit.ctrl', mappingEditCtrl);
    index.register.service('ekanban.mapping.edit.modal', modalMappingEdit);
});
