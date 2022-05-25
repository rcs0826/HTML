define(['index',    
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/hcg-city/cityZoomController.js',
    '/dts/hgp/html/hcg-unit/unitZoomController.js'
], function (index) {

    associativaUnidadeAreaAcaoAdvancedFilterController.$inject = ['$rootScope', '$scope','$modalInstance','disclaimers', 'AbstractAdvancedFilterController','TOTVSEvent'];
    function associativaUnidadeAreaAcaoAdvancedFilterController($rootScope, $scope, $modalInstance, disclaimers, AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;
        this.model = {}; 
        
        this.disclaimers = disclaimers;

        _self.today = new Date();

        this.filtersConfig = [
            {property: 'cdnUnidInic',   title: 'Unidade Inicial', modelVar: 'cdnUnidInic',   deefaultValue: 1},
            {property: 'cdnUnidFim',    title: 'Unidade Final',   modelVar: 'cdnUnidFim',    deefaultValue: 9999},
            {property: 'cdnCidadeInic', title: 'Cidade Inicial',  modelVar: 'cdnCidadeInic', deefaultValue: 1},
            {property: 'cdnCidadeFim',  title: 'Cidade Final',    modelVar: 'cdnCidadeFim',  deefaultValue: 999999}
        ];

        this.search = function () {

            var isValid = true;    

            if (   (!angular.isUndefined(_self.model.cdnUnidInic) && _self.model.cdnUnidInic !=='')
                && (!angular.isUndefined(_self.model.cdnUnidFim) && _self.model.cdnUnidFim !=='')
                && (parseInt(_self.model.cdnUnidInic) > parseInt(_self.model.cdnUnidFim)) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Unidade final deve ser maior que inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.cdnCidadeInic) && _self.model.cdnCidadeInic !=='')
                && (!angular.isUndefined(_self.model.cdnCidadeFim) && _self.model.cdnCidadeFim !=='')
                && (parseInt(_self.model.cdnCidadeInic) > parseInt(_self.model.cdnCidadeFim)) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Cidade final deve ser maior que inicial'
                });
            }                                   
          
            if (isValid === true) {          

                var arrayLength = this.disclaimers.length - 1;
                for (var i = arrayLength ; i >= 0 ; i--) {
                    this.disclaimers.splice(i, 1);
                }      
                this.constructDisclaimers();
                $modalInstance.close(this.disclaimers);
            }
        };

        this.changeRange = function (sourceField,observerField) {            

            if (angular.isUndefined(_self.model[observerField]) 
            || _self.model[observerField] == ''
            || _self.model[observerField] == _self.model[sourceField]){
                _self.model[observerField] = _self.model[sourceField];        
            }
        };

        // cleanFields
        this.cleanFields = function () {
            var _self = this;
            angular.forEach(this.filtersConfig, function (conf) {
                if (angular.isUndefined(conf.defaultValue) == true) {
                    if(conf.isDate == true){
                        _self.model[conf.modelVar] = undefined;
                    }else{
                        _self.model[conf.modelVar] = '';
                    }
                } else {
                    _self.model[conf.modelVar] = conf.defaultValue;
                }
            });
        };

        this.cancel = function () {
            
            $modalInstance.dismiss('cancel');
        };

        this.init = function () {

             this.initialize();
        };
        
        $scope.$watch('$viewContentLoaded', function () {
            
            _self.init();
        });

        $.extend(this, AbstractAdvancedFilterController);
    }    

    index.register.controller('hcg.associativaUnidadeAreaAcaoAdvFilter.Control', associativaUnidadeAreaAcaoAdvancedFilterController);
});


