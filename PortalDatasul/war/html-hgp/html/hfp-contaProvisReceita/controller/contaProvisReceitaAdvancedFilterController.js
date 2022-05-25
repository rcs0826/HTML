define(['index',    
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/hrc-periodSituation/sitPerZoomController.js'
], function (index) {

    contaProvisReceitaAdvancedFilterController.$inject = ['$rootScope', '$scope','$modalInstance','disclaimers', 'AbstractAdvancedFilterController','TOTVSEvent'];
    function contaProvisReceitaAdvancedFilterController($rootScope, $scope, $modalInstance, disclaimers, AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;
        this.model = {}; 
        
        this.disclaimers = disclaimers;

        _self.today = new Date();   

		_self.listMeses = [                
				{ 'value': 0, 'label': '00'},
				{ 'value': 1, 'label': '01'},
				{ 'value': 2, 'label': '02'},
				{ 'value': 3, 'label': '03'},
				{ 'value': 4, 'label': '04'},
				{ 'value': 5, 'label': '05'},
				{ 'value': 6, 'label': '06'},
				{ 'value': 7, 'label': '07'},
				{ 'value': 8, 'label': '08'},
				{ 'value': 9, 'label': '09'},
				{ 'value': 10, 'label': '10'},
				{ 'value': 11, 'label': '11'},
				{ 'value': 12, 'label': '12'}];
		
        this.filtersConfig = [
            {property: 'cdModalidadeInic', title: 'Modalidade Inicial', modelVar: 'cdModalidadeInic', deefaultValue: 1},
            {property: 'cdModalidadeFim', title: 'Modalidade Final', modelVar: 'cdModalidadeFim', deefaultValue: 99},
            {property: 'cdPlanoInic', title: 'Plano Inicial', modelVar: 'cdPlanoInic', deefaultValue: 1},
            {property: 'cdPlanoFim', title: 'Plano Final', modelVar: 'cdPlanoFim', deefaultValue: 99},
            {property: 'cdTipoPlanoInic', title: 'Tipo de Plano Inicial', modelVar: 'cdTipoPlanoInic', deefaultValue: 1},
            {property: 'cdTipoPlanoFim', title: 'Tipo de Plano Final', modelVar: 'cdTipoPlanoFim', deefaultValue: 99},
            {property: 'cdFormaPagtoInic', title: 'Forma de Pagto Inicial', modelVar: 'cdFormaPagtoInic', deefaultValue: 1},
            {property: 'cdFormaPagtoFim', title: 'Forma de Pagto Final', modelVar: 'cdFormaPagtoFim', deefaultValue: 99},
            {property: 'cdModuloInic', title: 'Módulo Inicial', modelVar: 'cdModuloInic', deefaultValue: 1},
            {property: 'cdModuloFim', title: 'Módulo Final', modelVar: 'cdModuloFim', deefaultValue: 999},
            {property: 'cdEventoInic', title: 'Evento Inicial', modelVar: 'cdEventoInic', deefaultValue: 1},
            {property: 'cdEventoFim', title: 'Evento Final', modelVar: 'cdEventoFim', deefaultValue: 999},
			{property: 'cdContaCtbInic', title: 'Conta Contábil Inicial', modelVar: 'cdContaCtbInic', deefaultValue: '1'},
            {property: 'cdContaCtbFim', title: 'Conta Contábil Final', modelVar: 'cdContaCtbFim', deefaultValue: '99999999999999999999'},
            {property: 'cdcCustoInic', title: 'Centro Custo Inicial', modelVar: 'cdcCustoInic', deefaultValue: '1'},
            {property: 'cdcCustoFim', title: 'Centro Custo Final', modelVar: 'cdcCustoFim', deefaultValue: '99999999999999999999'},
			{property: 'mmValInic', title: 'Validade Mês Inicial', modelVar: 'mmValInic', deefaultValue: '00'},
			{property: 'aaValInic', title: 'Validade Ano Inicial', modelVar: 'aaValInic', deefaultValue: '0000'}
        ];

        this.search = function () {

            var isValid = true;

            if (   (!angular.isUndefined(_self.model.cdModalidadeInic) && _self.model.cdModalidadeInic !=='')
                && (!angular.isUndefined(_self.model.cdModalidadeFim) && _self.model.cdModalidadeFim !=='')
                && (parseInt(_self.model.cdModalidadeInic) > parseInt(_self.model.cdModalidadeFim)) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Modalidade final deve ser maior que inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.cdPlanoInic) && _self.model.cdPlanoInic !=='')
                && (!angular.isUndefined(_self.model.cdPlanoFim) && _self.model.cdPlanoFim !=='')
                && (parseInt(_self.model.cdPlanoInic) > parseInt(_self.model.cdPlanoFim)) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Plano final deve ser maior que inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.cdTipoPlanoInic) && _self.model.cdTipoPlanoInic !=='')
                && (!angular.isUndefined(_self.model.cdTipoPlanoFim) && _self.model.cdTipoPlanoFim !=='')
                && (parseInt(_self.model.cdTipoPlanoInic) > parseInt(_self.model.cdTipoPlanoFim)) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Tipo de Plano final deve ser maior que inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.cdFormaPagtoInic) && _self.model.cdFormaPagtoInic !=='')
                && (!angular.isUndefined(_self.model.cdFormaPagtoFim) && _self.model.cdFormaPagtoFim !=='')
                && (parseInt(_self.model.cdFormaPagtoInic) > parseInt(_self.model.cdFormaPagtoFim)) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Forma de Pagamento final deve ser maior que inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.cdModuloInic) && _self.model.cdModuloInic !=='')
                && (!angular.isUndefined(_self.model.cdModuloFim) && _self.model.cdModuloFim !=='')
                && (parseInt(_self.model.cdModuloInic) > parseInt(_self.model.cdModuloFim)) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Módulo final deve ser maior que inicial'
                });
            }

            if (   (!angular.isUndefined(_self.model.cdEventoInic) && _self.model.cdEventoInic !=='')
                && (!angular.isUndefined(_self.model.cdEventoFim) && _self.model.cdEventoFim !=='')
                && (parseInt(_self.model.cdEventoInic) > parseInt(_self.model.cdEventoFim)) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Evento final deve ser maior que inicial'
                });
            }
			
            if (   (!angular.isUndefined(_self.model.cdContaCtbInic) && _self.model.cdContaCtbInic !=='')
                && (!angular.isUndefined(_self.model.cdContaCtbFim) && _self.model.cdContaCtbFim !=='')
                && (_self.model.cdContaCtbInic > _self.model.cdContaCtbFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Conta Contábil final deve ser maior que inicial'
                });
            }
			
            if (   (!angular.isUndefined(_self.model.cdcCustoInic) && _self.model.cdcCustoInic !=='')
                && (!angular.isUndefined(_self.model.cdcCustoFim) && _self.model.cdcCustoFim !=='')
                && (_self.model.cdcCustoInic > _self.model.cdcCustoFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Centro Custo final deve ser maior que inicial'
                });
            }
            
            if (   (!angular.isUndefined(_self.model.dtInic) && _self.model.dtInic !=='')
                && (!angular.isUndefined(_self.model.dtFim) && _self.model.dtFim !=='')
                && (_self.model.dtInic > _self.model.dtFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Data final deve ser maior que inicial'
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

    index.register.controller('hfp.contaProvisReceitaAdvFilter.Control', contaProvisReceitaAdvancedFilterController);
});


