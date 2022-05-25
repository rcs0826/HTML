define(['index',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/hrc-periodSituation/sitPerZoomController.js'
], function (index) {

    adjustmentPercentageAdvancedFilterController.$inject = ['$rootScope', '$scope','$modalInstance','disclaimers', 'AbstractAdvancedFilterController','TOTVSEvent'];
    function adjustmentPercentageAdvancedFilterController($rootScope, $scope, $modalInstance, disclaimers, AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;
        this.model = {}; 
        
        this.disclaimers = disclaimers;

        _self.today = new Date();

        this.filtersConfig = [

            {property: 'numAnoIni', title: 'Ano Inicial',  modelVar: 'numAnoIni'},
            {property: 'numAnoFim', title: 'Ano Final',    modelVar: 'numAnoFim'},
            {property: 'numMesIni', title: 'Mês Inicial',  modelVar: 'numMesIni'},
            {property: 'numMesFim', title: 'Mês Final',    modelVar: 'numMesFim'},
        ];
        this.search = function () {

            var isValid = true;    

            if (   (!angular.isUndefined(_self.model.numAnoIni) && _self.model.numAnoIni !=='')
                && (!angular.isUndefined(_self.model.numAnoFim) && _self.model.numAnoFim !=='')
                && (_self.model.numAnoIni > _self.model.numAnoFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Ano Final deve ser maior que Ano Inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.numMesIni) && _self.model.numMesIni !=='')
                && (!angular.isUndefined(_self.model.numMesFim) && _self.model.numMesFim !=='')
                && (_self.model.numMesIni > _self.model.numMesFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Mês Final deve ser maior que Mês Iniial'
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

    index.register.controller('hrs.adjustmentPercentageAdvFilter.Control', adjustmentPercentageAdvancedFilterController);
});


