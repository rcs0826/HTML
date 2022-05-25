define(['index',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/enumeration/abiStatusEnumeration.js',
], function (index) {

    ressusAbiImportationAdvancedFilterController.$inject = ['$rootScope', '$scope','$modalInstance','disclaimers', 'AbstractAdvancedFilterController','TOTVSEvent'];
    function ressusAbiImportationAdvancedFilterController($rootScope, $scope, $modalInstance, disclaimers, AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;
        this.model = {};
        
        this.disclaimers = disclaimers;
        $scope.ABI_STATUS_ENUM = ABI_STATUS_ENUM;

        _self.today = new Date();

        this.filtersConfig = [
            {property: 'codProcessoIni',    title: 'Protocolo Inicial',         modelVar: 'codProcessoIni'              },
            {property: 'codProcessoFim',    title: 'Protocolo Final',           modelVar: 'codProcessoFim'              },
            {property: 'codAbiIni',         title: 'Abi Inicial',               modelVar: 'codAbiIni'                   },
            {property: 'codAbiFim',         title: 'Abi Final',                 modelVar: 'codAbiFim'                   },
            {property: 'codOficioIni',      title: 'Número Ofício Inicial',     modelVar: 'codOficioIni'                },
            {property: 'codOficioFim',      title: 'Número Ofício Final',       modelVar: 'codOficioFim'                },
            {property: 'datRecebtoIni',     title: 'Data Recebimento Inicial',  modelVar: 'datRecebtoIni',  isDate: true},
            {property: 'datRecebtoFim',     title: 'Data Recebimento Final',    modelVar: 'datRecebtoFim',  isDate: true},
            {property: 'idiStatus',         title: 'Status',                    modelVar: 'idiStatus'                   }
        ];

        this.search = function () {

            var isValid = true;
           
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
            || _self.model[observerField] === ''
            || _self.model[observerField] === _self.model[sourceField]){
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

    index.register.controller('hrs.ressusAbiImportationAdvFilter.Control', ressusAbiImportationAdvancedFilterController);
});