define(['index',    
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/hrc-periodSituation/sitPerZoomController.js'
], function (index) {

    beneficiarioCompartRiscoIntercamAdvancedFilterController.$inject = ['$rootScope', '$scope','$modalInstance','disclaimers', 'AbstractAdvancedFilterController','TOTVSEvent'];
    function beneficiarioCompartRiscoIntercamAdvancedFilterController($rootScope, $scope, $modalInstance, disclaimers, AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;
        this.model = {}; 
        
        this.disclaimers = disclaimers;

        _self.today = new Date();

        this.filtersConfig = [
            {property: 'cdUnidCartInic', title: 'Unidade Inicial', modelVar: 'cdUnidCartInic', deefaultValue: 1},
            {property: 'cdUnidCartFim', title: 'Unidade Final', modelVar: 'cdUnidCartFim', deefaultValue: 9999},
            {property: 'cdCartUsuarInic', title: 'Carteira Benef Inicial', modelVar: 'cdCartUsuarInic', deefaultValue: 1},
            {property: 'cdCartUsuarFim', title: 'Carteira Benef Final', modelVar: 'cdCartUsuarFim', deefaultValue: 9999999999999},
            {property: 'dtInicRepas', title: 'Data Inicial Repasse', modelVar: 'dtInicRepas', isDate: true},
            {property: 'dtFimRepas', title: 'Data Final Repasse', modelVar: 'dtFimRepas', isDate: true},
            {property: 'idiPlanoIncial', title: 'Plano Inicial', modelVar: 'idiPlanoIncial', deefaultValue: 1},
            {property: 'idiPlanoFim', title: 'Plano Final', modelVar: 'idiPlanoFim', deefaultValue: 999999},
            {property: 'idiTipContratacInicial', title: 'Tipo Contrat. Inicial', modelVar: 'idiTipContratacInicial', deefaultValue: 1},
            {property: 'idiTipContratacFim', title: 'Tipo Contrat. Final', modelVar: 'idiTipContratacFim', deefaultValue: 99},

        ];

        this.search = function () {

            var isValid = true;    

            if (   (!angular.isUndefined(_self.model.cdUnidCartInic) && _self.model.cdUnidCartInic !=='')
                && (!angular.isUndefined(_self.model.cdUnidCartFim) && _self.model.cdUnidCartFim !=='')
                && (_self.model.cdUnidCartInic > _self.model.cdUnidCartFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Unidade final deve ser maior que inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.cdCartUsuarInic) && _self.model.cdCartUsuarInic !=='')
                && (!angular.isUndefined(_self.model.cdCartUsuarFim) && _self.model.cdCartUsuarFim !=='')
                && (_self.model.cdCartUsuarInic > _self.model.cdCartUsuarFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Carteira benef. final deve ser maior que inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.dtInicRepas) && _self.model.dtInicRepas !=='')
                && (!angular.isUndefined(_self.model.dtFimRepas) && _self.model.dtFimRepas !=='')
                && (_self.model.dtInicRepas > _self.model.dtFimRepas) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Data final repasse deve ser maior que inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.idiPlanoIncial) && _self.model.idiPlanoIncial !=='')
                && (!angular.isUndefined(_self.model.idiPlanoFim) && _self.model.idiPlanoFim !=='')
                && (_self.model.idiPlanoIncial > _self.model.idiPlanoFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Plano final deve ser maior que inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.idiTipContratacInicial) && _self.model.idiTipContratacInicial !=='')
                && (!angular.isUndefined(_self.model.idiTipContratacFim) && _self.model.idiTipContratacFim !=='')
                && (_self.model.idiTipContratacInicial > _self.model.idiTipContratacFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Tipo contratação final deve ser maior que inicial'
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

    index.register.controller('hrb.beneficiarioCompartRiscoIntercamAdvFilter.Control', beneficiarioCompartRiscoIntercamAdvancedFilterController);
});


