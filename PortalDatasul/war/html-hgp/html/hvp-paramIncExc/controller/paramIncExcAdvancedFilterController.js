define(['index',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js'
], function (index) {

    paramIncExcAdvancedFilterController.$inject = ['$rootScope', '$scope','$modalInstance','disclaimers', 'AbstractAdvancedFilterController','TOTVSEvent'];
    function paramIncExcAdvancedFilterController($rootScope, $scope, $modalInstance, disclaimers, AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;
        this.model = {}; 
        
        this.disclaimers = disclaimers;

        _self.today = new Date();

        this.filtersConfig = [        
            {property: 'cddRegraInic',          title: 'Codigo Inicial',      modelVar: 'cddRegraInic'           },
            {property: 'cddRegraFim',           title: 'Codigo Final',        modelVar: 'cddRegraFim'            },
            {property: 'cdnModalidInic',        title: 'Modalidade Inicial',  modelVar: 'cdnModalidInic'         },
            {property: 'cdnModalidFim',         title: 'Modalidade Final',    modelVar: 'cdnModalidFim'          },
            {property: 'cdnPlanoInic',          title: 'Plano Inicial',       modelVar: 'cdnPlanoInic'           },
            {property: 'cdnPlanoFim',           title: 'Plano Final',         modelVar: 'cdnPlanoFim'            },
            {property: 'cdnTipPlanoInic',       title: 'Tipo Plano Inicial',  modelVar: 'cdnTipPlanoInic'        },
            {property: 'cdnTipPlanoFim',        title: 'Tipo Plano Final',    modelVar: 'cdnTipPlanoFim'         },
            {property: 'numInscrContrnteInic',  title: 'Contratante Inicial', modelVar: 'numInscrContrnteInic'   },
            {property: 'numInscrContrnteFim',   title: 'Contratante Final',   modelVar: 'numInscrContrnteFim'    },
            {property: 'numTermoAdesaoInic',     title: 'Contrato Inicial',    modelVar: 'numTermoAdesaoInic'    },
            {property: 'numTermoAdesaoFim',     title: 'Contrato Final',      modelVar: 'numTermoAdesaoFim'      },
        ];

        this.search = function () {
            var isValid = true;  

            if (   (!angular.isUndefined(_self.model.cddRegraInic) && _self.model.cddRegraInic !=='')
                && (!angular.isUndefined(_self.model.cddRegraFim) && _self.model.cddRegraFim !=='')
                && (_self.model.cddRegraInic > _self.model.cddRegraFim) ){
                
                isValid = false;
                nomeCampo="Codigo"
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: nomeCampo + ' final deve ser maior que ' + nomeCampo + ' inicial.'
                });
            }  
            if (   (!angular.isUndefined(_self.model.cdnModalidInic) && _self.model.cdnModalidInic !=='')
                && (!angular.isUndefined(_self.model.cdnModalidFim) && _self.model.cdnModalidFim !=='')
                && (_self.model.cdnModalidInic > _self.model.cdnModalidFim) ){
                
                isValid = false;
                nomeCampo="Modalidade"
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: nomeCampo + ' final deve ser maior que ' + nomeCampo + ' inicial.'
                });
            }  
            if (   (!angular.isUndefined(_self.model.cdnPlanoInic) && _self.model.cdnPlanoInic !=='')
                && (!angular.isUndefined(_self.model.cdnPlanoFim) && _self.model.cddRegraFim !=='')
                && (_self.model.cdnPlanoInic > _self.model.cdnPlanoFim) ){
                
                isValid = false;
                nomeCampo="Plano"
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: nomeCampo + ' final deve ser maior que ' + nomeCampo + ' inicial.'
                });
            }  
            if (   (!angular.isUndefined(_self.model.cdnTipPlanoInic) && _self.model.cdnTipPlanoInic !=='')
                && (!angular.isUndefined(_self.model.cdnTipPlanoFim) && _self.model.cdnTipPlanoFim !=='')
                && (_self.model.cdnTipPlanoInic > _self.model.cdnTipPlanoFim) ){
                
                isValid = false;
                nomeCampo="Tipo de Plano"
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: nomeCampo + ' final deve ser maior que ' + nomeCampo + ' inicial.'
                });
            }  
            if (   (!angular.isUndefined(_self.model.numInscrContrnteInic) && _self.model.numInscrContrnteInic !=='')
                && (!angular.isUndefined(_self.model.numInscrContrnteFim) && _self.model.numInscrContrnteFim !=='')
                && (_self.model.numInscrContrnteInic > _self.model.numInscrContrnteFim) ){
                
                isValid = false;
                nomeCampo="Contratante"
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: nomeCampo + ' final deve ser maior que ' + nomeCampo + ' inicial.'
                });
            }  
            if (   (!angular.isUndefined(_self.model.numTermoAdesaoInic) && _self.model.numTermoAdesaoInic !=='')
                && (!angular.isUndefined(_self.model.numTermoAdesaoFim) && _self.model.numTermoAdesaoFim !=='')
                && (_self.model.numTermoAdesaoInic > _self.model.numTermoAdesaoFim) ){
                
                isValid = false;
                nomeCampo="Contrato"
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: nomeCampo + ' final deve ser maior que ' + nomeCampo + ' inicial.'
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

            if (!angular.isUndefined(_self.model[observerField])) {
            }

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

    index.register.controller('hvp.paramIncExcAdvFilter.Control', paramIncExcAdvancedFilterController);
});


