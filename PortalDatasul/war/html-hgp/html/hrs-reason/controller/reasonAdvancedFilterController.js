define(['index',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/hcg-hrs-nature/natureFactory.js',
], function (index) {

    reasonAdvancedFilterController.$inject = ['$rootScope', '$scope','$modalInstance','disclaimers', 'AbstractAdvancedFilterController','TOTVSEvent'
                                             , 'hrs.nature.Factory'];
    function reasonAdvancedFilterController($rootScope, $scope, $modalInstance, disclaimers, AbstractAdvancedFilterController,TOTVSEvent, natureFactory) {

        var _self = this;
        this.model = {}; 
        this.natures = []; 
        
        this.disclaimers = disclaimers;

        _self.today = new Date();

        this.filtersConfig = [
            {property: 'idMotivoRange',          title: 'Código',  modelVar: 'idMotivo'      },
            {property: 'idNatureza',            title: 'Natureza',        modelVar: 'idNatureza'        },
        ];

        this.search = function () {

            var isValid = true;    

            if (   (!angular.isUndefined(_self.model.idMotivoIni) && _self.model.idMotivoIni !=='')
                && (!angular.isUndefined(_self.model.idMotivoFim) && _self.model.idMotivoFim !=='')
                && (_self.model.idMotivoIni > _self.model.idMotivoFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Código Final deve ser maior que Código Inicial'
                });
            }
            
            if (_self.natures.value == 0)
            {
                _self.natures = undefined;
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

            natureFactory.getNatureByFilter('', 0, 20, true, [], function (result) {
                //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                
                _self.natures.push({value: 0,
                                    label: ""})
                if (result) {
                    angular.forEach(result, function (item) {
                        _self.natures.push({value: item.idNatureza,
                                            label: item.dsNatureza})
                    });
                }
                _self.model.idNatureza = 0;
            });
        };

        $scope.$watch('$viewContentLoaded', function () {
            
            _self.init();
        });

        $.extend(this, AbstractAdvancedFilterController);
    }

    index.register.controller('hrs.reasonAdvFilter.Control', reasonAdvancedFilterController);
});


