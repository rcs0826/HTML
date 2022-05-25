define(['index',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/hcg-hrs-nature/natureFactory.js',
    '/dts/hgp/html/hcg-hrs-reason/reasonFactory.js',
], function (index) {

    justificationAdvancedFilterController.$inject = ['$rootScope', '$scope','$modalInstance','disclaimers', 'AbstractAdvancedFilterController','TOTVSEvent', 
                                                     'hrs.nature.Factory',
                                                     'hrs.reason.Factory'];
    function justificationAdvancedFilterController($rootScope, $scope, $modalInstance, disclaimers, AbstractAdvancedFilterController,TOTVSEvent, 
                                                   $natureFactory,
                                                   $reasonFactory) {

        var _self = this;
        this.model = {}; 
        this.natures = []; 
        this.reasons = []; 
        
        this.disclaimers = disclaimers;

        _self.today = new Date();

        this.filtersConfig = [
            {property: 'idJustificativaRange',        title: 'Código',  modelVar: 'idJustificativa'      },            
            {property: 'idNatureza',                  title: 'Natureza',        modelVar: 'idNatureza'        },
            {property: 'idMotivo',                    title: 'Motivo',          modelVar: 'idMotivo'        },
        ];

        this.search = function () {

            var isValid = true;    

            if (   (!angular.isUndefined(_self.model.idJustificativa.start) && _self.model.idJustificativa.start !=='')
                && (!angular.isUndefined(_self.model.idJustificativa.end) && _self.model.idJustificativa.end !=='')
                && (_self.model.idJustificativa.start > _self.model.idJustificativa.end) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Código Final deve ser maior que Código Inicial'
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

        this.cancel = function () {
            
            $modalInstance.dismiss('cancel');
        };

        this.init = function () {

            this.initialize();

            _self.model.idNatureza = 0;
            _self.model.idMotivo = 0;

            $natureFactory.getNatureByFilter('', 0, 20, true, [], function (result) {
                //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                _self.natures.push({value: 0,
                                    label: ""});
                if (result) {
                    angular.forEach(result, function (item) {
                        _self.natures.push({value: item.idNatureza,
                                            label: item.dsNatureza})
                    });
                }
            });
            $reasonFactory.getReasonByFilter('', 0, 20, true, [], function (result) {
                //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                _self.reasons.push({value: 0,
                                    label: ""});
                if (result) {
                    angular.forEach(result, function (item) {
                        _self.reasons.push({value: item.idMotivo,
                                            label: item.dsMotivo})
                    });
                }
            });
        };

        $scope.$watch('$viewContentLoaded', function () {
            _self.init();
        });

        $.extend(this, AbstractAdvancedFilterController);
    }

    index.register.controller('hrs.justificationAdvFilter.Control', justificationAdvancedFilterController);
});


