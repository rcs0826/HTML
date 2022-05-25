define(['index',    
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/hrc-periodSituation/sitPerZoomController.js'
], function (index) {

    beneficiarioCompartRiscoAdvancedFilterController.$inject = ['$rootScope', '$scope','$modalInstance','disclaimers', 'AbstractAdvancedFilterController','TOTVSEvent'];
    function beneficiarioCompartRiscoAdvancedFilterController($rootScope, $scope, $modalInstance, disclaimers, AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;
        this.model = {}; 
        
        this.disclaimers = disclaimers;

        _self.today = new Date();

        _self.listStatus = [                
            { 'value': 9, 'label': 'Pendente Envio' },
            { 'value': 1, 'label': 'Aguardando Retorno' },
            { 'value': 2, 'label': 'Confirmado' },
            { 'value': 3, 'label': 'Pendente Reenvio' }];        

        this.filtersConfig = [
            {property: 'cdUnidadeInic', title: 'Unidade Inicial', modelVar: 'cdUnidadeInic', deefaultValue: 1},
            {property: 'cdUnidadeFim', title: 'Unidade Final', modelVar: 'cdUnidadeFim', deefaultValue: 9999},
            {property: 'cdModalidadeInic', title: 'Modalidade Inicial', modelVar: 'cdModalidadeInic', deefaultValue: 1},
            {property: 'cdModalidadeFim', title: 'Modalidade Final', modelVar: 'cdModalidadeFim', deefaultValue: 99},
            {property: 'cdContratoInic', title: 'Contrato Inicial', modelVar: 'cdContratoInic', deefaultValue: 1},
            {property: 'cdContratoFim', title: 'Contrato Final', modelVar: 'cdContratoFim', deefaultValue: 999999},
            {property: 'cdBeneficiarioInic', title: 'Beneficiario Inicial', modelVar: 'cdBeneficiarioInic', deefaultValue: 1},
            {property: 'cdBeneficiarioFim', title: 'Beneficiario Final', modelVar: 'cdBeneficiarioFim', deefaultValue: 999999},
            {property: 'dtInclusaoInic', title: 'Data Inclusao Inicial', modelVar: 'dtInclusaoInic', isDate: true},
            {property: 'dtInclusaoFim', title: 'Data Inclusao Final', modelVar: 'dtInclusaoFim', isDate: true},
            {property: 'dtExclusaoInic', title: 'Data Exclusao Inicial', modelVar: 'dtExclusaoInic', isDate: true},
            {property: 'dtExclusaoFim', title: 'Data Exclusao Final', modelVar: 'dtExclusaoFim', isDate: true},
            
        ];

        this.search = function () {

            var isValid = true;    

            if (   (!angular.isUndefined(_self.model.cdUnidadeInic) && _self.model.cdUnidadeInic !=='')
                && (!angular.isUndefined(_self.model.cdUnidadeFim) && _self.model.cdUnidadeFim !=='')
                && (parseInt(_self.model.cdUnidadeInic) > parseInt(_self.model.cdUnidadeFim)) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Unidade final deve ser maior que inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.cdModalidadeInic) && _self.model.cdModalidadeInic !=='')
                && (!angular.isUndefined(_self.model.cdModalidadeFim) && _self.model.cdModalidadeFim !=='')
                && (parseInt(_self.model.cdModalidadeInic) > parseInt(_self.model.cdModalidadeFim)) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Modalidade final deve ser maior que inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.cdContratoInic) && _self.model.cdContratoInic !=='')
                && (!angular.isUndefined(_self.model.cdContratoFim) && _self.model.cdContratoFim !=='')
                && (parseInt(_self.model.cdContratoInic) > parseInt(_self.model.cdContratoFim)) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Contrato final deve ser maior que inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.cdBeneficiarioInic) && _self.model.cdBeneficiarioInic !=='')
                && (!angular.isUndefined(_self.model.cdBeneficiarioFim) && _self.model.cdBeneficiarioFim !=='')
                && (parseInt(_self.model.cdBeneficiarioInic) > parseInt(_self.model.cdBeneficiarioFim)) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Beneficiário final deve ser maior que inicial'
                });
            }
            
           if (   (!angular.isUndefined(_self.model.dtInclusaoInic)&&_self.model.dtInclusaoInic)
                && (!angular.isUndefined(_self.model.dtInclusaoFim)&&_self.model.dtInclusaoFim)
                && (_self.model.dtInclusaoInic > _self.model.dtInclusaoFim) ){
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Data final de inclusão deve ser maior que inicial'
                });
            }
            
            if (   (!angular.isUndefined(_self.model.dtExclusaoInic)&&_self.model.dtExclusaoInic)
                 && (!angular.isUndefined(_self.model.dtExclusaoFim)&&_self.model.dtExclusaoFim)
                 && (_self.model.dtExclusaoInic > _self.model.dtExclusaoFim) ){
                 isValid = false;
                 $rootScope.$broadcast(TOTVSEvent.showNotification, {
                     type: 'error', title: 'Data final de exclusão deve ser maior que inicial'
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

    index.register.controller('hrb.beneficiarioCompartRiscoAdvFilter.Control', beneficiarioCompartRiscoAdvancedFilterController);
});


