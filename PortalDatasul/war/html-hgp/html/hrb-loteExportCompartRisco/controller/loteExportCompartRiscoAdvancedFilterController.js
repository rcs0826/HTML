define(['index',    
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/hcg-unit/unitZoomController.js'
], function (index) {

    loteExportCompartRiscoAdvancedFilterController.$inject = ['$rootScope', '$scope','$modalInstance','disclaimers', 'AbstractAdvancedFilterController','TOTVSEvent'];
    function loteExportCompartRiscoAdvancedFilterController($rootScope, $scope, $modalInstance, disclaimers, AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;
        this.model = {}; 
        
        this.disclaimers = disclaimers;

        _self.today = new Date();        

        this.filtersConfig = [
            {property: 'cdUnidadeDestino',     title: 'Unidade Destino',            modelVar: 'cdUnidadeDestino'},
            {property: 'nrLoteExp',            title: 'Nr. do Lote',                modelVar: 'nrLoteExp'},
            {property: 'dtExportacaoLoteInic', title: 'Data de Exportação Inicial', modelVar: 'dtExportacaoLoteInic', isDate: true},
            {property: 'dtExportacaoLoteFim',  title: 'Data de Exportação Final',   modelVar: 'dtExportacaoLoteFim',  isDate: true}
        ];

        this.search = function () {

            var isValid = true;

            if (   (!angular.isUndefined(_self.model.dtExportacaoLoteInic) && _self.model.dtExportacaoLoteInic !=='')
                && (!angular.isUndefined(_self.model.dtExportacaoLoteFim) && _self.model.dtExportacaoLoteFim !=='')
                && (_self.model.dtExportacaoLoteInic > _self.model.dtExportacaoLoteFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Data de Exportação final deve ser maior que inicial'
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

    index.register.controller('hrb.loteExportCompartRiscoAdvFilter.Control', loteExportCompartRiscoAdvancedFilterController);
});


