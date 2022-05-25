define(['index',
        '/dts/kbn/js/helpers.js',
        '/dts/kbn/js/legend.js',
        '/dts/kbn/js/factories/formula-factory.js',
        '/dts/kbn/js/factories/integration-params-factory.js',
        '/dts/kbn/html/integrationparameters/integrationparameters.formula.modal.js'
], function (index) {

    modalFormulaEdit.$inject = ['$modal'];
    function modalFormulaEdit($modal) {
        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/formula/formula.edit.html',
                controller: 'ekanban.formula.edit.ctrl as controller',
                backdrop: 'static',
                keyboard: true,
                size: 'lg',
                resolve: { parameters: function () { return params; } }
            });
            return instance.result;
        };
    }

    formulaEditCtrl.$inject = [
        'parameters',
        '$modalInstance',
        '$scope',
        '$rootScope',
        'TOTVSEvent',
        'kbn.formula.Factory',
        'kbn.helper.Service',
        '$rootScope',
        'kbn.legend',
        'messageHolder',
        'kbn.integrationparams.Factory',
        'ekanban.formula.modal'];
    function formulaEditCtrl(
        parameters,
        $modalInstance,
        $scope,
        $rootScope,
        TOTVSEvent,
        formulaFactory,
        serviceHelper,
        $rootScope,
        legend,
        messageHolder,
        paramsFactory,
        modalFormulaEdit) {
        var _self = this;
        
        
        _self.init = function() {
            _self.myParams = angular.copy(parameters);
            if (_self.myParams.model !== undefined)
                _self.programa = _self.myParams.model.programa;
            
            _self.diretorioFormulas();
        };
            
        _self.diretorioFormulas = function(){
            paramsFactory.getDiretorioFormulas({},{},function(result){
                _self.diretorioFormula = result.diretorioFormulas;
            });
        };
            
        _self.editarDiretorio = function(){
            modalFormulaEdit.open(_self.diretorioFormula).then(function(){
                _self.init();
            });
        };

        _self.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        _self.getLabelByAction = function (action) {
            switch (action) {
                case 'edit': return 'l-edit-formula';
                case 'new': return 'l-new-formula';
            }
        };

        _self.save = function (action, model) {
            var formulaFields = serviceHelper.validateMissingFields($('#formulaForm'));

            if(!formulaFields.isValid()) {
                formulaFields.showDefaultMessage();               
                return;
            };            
            
            model.programa = _self.programa;
            
            formulaFactory.saveFormulas(model, function(result){
                if(!result.$hasError){
                    _self.showReturn(action);
                    $modalInstance.close(result);
                }
            });
        };
        
        _self.showReturn = function (action){
            if (action == 'new') {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type:   'info',
                    title:  $rootScope.i18n('l-new-formula'),
                    detail: $rootScope.i18n('l-success-transaction')
                });
            };
            if (action == 'edit') {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {                
                    type:   'info',                
                    title:  $rootScope.i18n('l-edit-formula'),
                    detail: $rootScope.i18n('l-success-transaction')
                });
            };
        };
        
        _self.selectFile = function($files){
            
            if ($files.length < 1) {
                _self.programa = undefined;
                return;
            }
            
            _self.programa = $files[0].name;
        }


        _self.init();

    }

    index.register.controller('ekanban.formula.edit.ctrl', formulaEditCtrl);
    index.register.service('ekanban.formula.edit.modal', modalFormulaEdit);
});
