define(['index',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/hrc-periodSituation/sitPerZoomController.js'
], function (index) {

    periodAdvFilterController.$inject = ['$rootScope', '$scope','$modalInstance','disclaimers', 'AbstractAdvancedFilterController', 'TOTVSEvent'];
    function periodAdvFilterController($rootScope, $scope, $modalInstance, disclaimers, AbstractAdvancedFilterController, TOTVSEvent) {

        var _self = this;
        this.model = {}; 
        
        this.disclaimers = disclaimers;

        _self.today = new Date();

        this.filtersConfig = [

            {property: 'cdnRegraDescFaturInic',  title: 'Código Inicial',      modelVar: 'cdnRegraDescFaturInic'        },
            {property: 'cdnRegraDescFaturFim',   title: 'Código Final',        modelVar: 'cdnRegraDescFaturFim'         },
            {property: 'cdnModalidInic',         title: 'Modalidade Inicial',  modelVar: 'cdnModalidInic'               },
            {property: 'cdnModalidFim',          title: 'Modalidade Final',    modelVar: 'cdnModalidFim'                },
            {property: 'cdnContratInic',         title: 'Contrato Inicial',    modelVar: 'cdnContratInic'               },
            {property: 'cdnContratFim',          title: 'Contrato Final',      modelVar: 'cdnContratFim'                },
            {property: 'cdnContrnteInic',        title: 'Contratante Inicial', modelVar: 'cdnContrnteInic'              },
            {property: 'cdnContrnteFim',         title: 'Contratante Final',   modelVar: 'cdnContrnteFim'               },
            {property: 'datInicVigenc',          title: 'Vigência Inicial',    modelVar: 'datInicVigenc',   isDate: true},
            {property: 'datFimVigenc ',          title: 'Vigência  Final',     modelVar: 'datFimVigenc',    isDate: true},
        ];

        this.search = function () {

            var isValid = true;    

            if (   (!angular.isUndefined(_self.model.cdnRegraDescFaturInic) && _self.model.cdnRegraDescFaturInic !=='')
                && (!angular.isUndefined(_self.model.cdnRegraDescFaturFim) && _self.model.cdnRegraDescFaturFim !=='')
                && (_self.model.cdnRegraDescFaturInic > _self.model.cdnRegraDescFaturFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Código Final deve ser maior que Código Inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.cdnModalidInic) && _self.model.cdnModalidInic !=='')
                && (!angular.isUndefined(_self.model.cdnModalidFim) && _self.model.cdnModalidFim !=='')
                && (_self.model.cdnModalidInic > _self.model.cdnModalidFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Modalidade Final deve ser maior que Modalidade Inicial'
                });
            }
            if (   (!angular.isUndefined(_self.model.cdnContratInic) && _self.model.cdnContratInic !=='')
                && (!angular.isUndefined(_self.model.cdnContratFim) && _self.model.cdnContratFim !=='')
                && (_self.model.cdnContratInic > _self.model.cdnContratFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Contrato Final deve ser maior que o Contrato Inicial'
                });
            }
            if (   (!angular.isUndefined(_self.model.cdnContrnteInic) && _self.model.cdnContrnteInic !==null)
                && (!angular.isUndefined(_self.model.cdnContrnteFim) && _self.model.cdnContrnteFim !==null)
                && (_self.model.cdnContrnteInic > _self.model.cdnContrnteFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Contratante Final deve ser maior que a Contratante Inicial'
                });
            }
            if (   (!angular.isUndefined(_self.model.datInicVigenc) && _self.model.datInicVigenc !==null)
                && (!angular.isUndefined(_self.model.datFimVigenc) && _self.model.datFimVigenc !==null)
                && (_self.model.datInicVigenc > _self.model.datFimVigenc) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Vigência Final deve ser maior que a Vigência Inicial'
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

    index.register.controller('hvp.beneficiaryLotationAdvFilter.Control', periodAdvFilterController);
});


