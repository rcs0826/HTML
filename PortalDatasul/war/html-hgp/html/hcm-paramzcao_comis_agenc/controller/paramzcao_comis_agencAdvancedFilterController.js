define(['index',
    
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/hrc-periodSituation/sitPerZoomController.js'
], function (index) {

    paramzcao_comis_agencAdvancedFilterController.$inject = ['$rootScope', '$scope','$modalInstance','disclaimers', 'AbstractAdvancedFilterController','TOTVSEvent'];
    function paramzcao_comis_agencAdvancedFilterController($rootScope, $scope, $modalInstance, disclaimers, AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;
        this.model = {}; 
        
        this.disclaimers = disclaimers;

        _self.today = new Date();

        _self.listConsidParamzcaoAgenc = [{'value': 1, 'label': 'Vidas Novas'}
                                         ,{'value': 2, 'label': 'Vidas Existentes'}
                                         ,{'value': 3, 'label': 'Vidas Titular Novo'}
                                         ,{'value': 4, 'label': 'Vidas Totais'}];
                                         
        _self.listConsidParamzcaoBenefPagto = [{'value': 1, 'label': 'Vidas Novas'}
                                              ,{'value': 2, 'label': 'Vidas Existentes'}
                                              ,{'value': 3, 'label': 'Vidas Titular Novo'}
		                                      ,{'value': 4, 'label': 'Vidas Totais'}];

        _self.listContagComisAgenc = [{'value': 1, 'label': 'Grupo contratante'}
        ,{'value': 2, 'label': 'Contratante'}
        ,{'value': 3, 'label': 'Termo'}
		,{'value': 3, 'label': 'Termo/Evento'}];

        this.filtersConfig = [

            {property: 'idRegraInic',  title: 'Id Inicial',      modelVar: 'idRegraInic'        },
            {property: 'idRegraFim',   title: 'Id Final',        modelVar: 'idRegraFim'         },
            {property: 'considParamzcaoAgenc',      title: 'Considera para contagem', modelVar: 'considParamzcaoAgenc'},
            {property: 'idiConsidParamzcaoBenefPagto', title: 'Considera para pagar',    modelVar: 'idiConsidParamzcaoBenefPagto'},
            {property: 'contagComisAgenc',      title: 'Contagem por',   modelVar: 'contagComisAgenc'         },
            {property: 'dtInicial',                 title: 'Período Inicial',    modelVar: 'dtInicial',    isDate: true},
            {property: 'dtFinal ',                  title: 'Período Final',      modelVar: 'dtFinal',      isDate: true},
        ];

        this.search = function () {

            var isValid = true;    

            if (   (!angular.isUndefined(_self.model.idRegraInic) && _self.model.idRegraInic !=='')
                && (!angular.isUndefined(_self.model.idRegraFim) && _self.model.idRegraFim !=='')
                && (_self.model.idRegraInic > _self.model.idRegraFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Id Final deve ser maior que Id Inicial'
                });
            }      
            
            if (   (!angular.isUndefined(_self.model.dtInicial) && _self.model.dtInicial !==null)
                && (!angular.isUndefined(_self.model.dtFinal) && _self.model.dtFinal !==null)
                && (_self.model.dtInicial > _self.model.dtFinal) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Período Final deve ser maior que o Período Inicial'
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

        $scope.$watch('$viewContentLoaded', function () {
            
            _self.init();
        });

        $.extend(this, AbstractAdvancedFilterController);
    }    

    index.register.controller('hcm.paramzcao_comis_agencAdvFilter.Control', paramzcao_comis_agencAdvancedFilterController);
});


