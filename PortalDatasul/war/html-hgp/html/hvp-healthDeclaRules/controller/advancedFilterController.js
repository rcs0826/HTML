define(['index',
    '/dts/hgp/html/enumeration/healthDeclaRulesTypeEnumeration.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER 
    // *************************************************************************************
    advancedFilterController.$inject = ['$rootScope', '$scope', '$modalInstance','disclaimers','AbstractAdvancedFilterController','TOTVSEvent'];
    function advancedFilterController($rootScope, $scope, $modalInstance, disclaimers, AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;
        this.model = {};

        this.disclaimers = disclaimers;
        /*$scope.HEALTH_DECLA_RULES_STATUS_ENUM  = HEALTH_DECLA_RULES_STATUS_ENUM ;*/
        _self.today = new Date();

        /*Metodo para buscar o label do status que foi selecionado na busca avancada*/
        /*this.getLabelStatusByKey = function(value){
            return HEALTH_DECLA_RULES_STATUS_ENUM.getLabelByKey(value);
        };*/

        this.filtersConfig = [
            {property: 'cdContratanteIni', title: 'Contratante Inicial', modelVar: 'cdContratanteIni'},
            {property: 'cdContratanteFim', title: 'Contratante Final'  , modelVar: 'cdContratanteFim'},
			{property: 'cdGrupoContratanteIni', title: 'Grupo Contratante Inicial' , modelVar: 'cdGrupoContratanteIni'},
			{property: 'cdGrupoContratanteFim', title: 'Grupo Contratante Final'   , modelVar: 'cdGrupoContratanteFim'},
			{property: 'cdGrupoContratante',    title: 'Grupo Contratante'   ,       modelVar: 'cdGrupoContratante'},
			{property: 'log_busca_nome', title: 'log_busca_nome', modelVar: 'log_busca_nome'}
        ];

        this.onChangeCheckBox = function () {
             if (_self.model.log_busca_nome) {
                 _self.model.cdGrupoContratante = "";
             } else {
                 _self.model.cdGrupoContratanteIni = "";
                 _self.model.cdGrupoContratanteFim = "";
             };

        };

        this.search = function () {
            var isValid = true;    

            if ((!angular.isUndefined(_self.model.cdContratanteIni) && _self.model.cdContratanteIni !== '')
            && (angular.isUndefined(_self.model.cdContratanteFim)    && _self.model.cdContratanteFim   !== '')){
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'O contratante deve estar preenchido!'
                });
            };
            if (parseInt(_self.model.cdContratanteFim) < parseInt(_self.model.cdContratanteIni)){
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'O contratante inicial deve ser menor que o contratante final!'
                });
            };
			
			if (_self.model.log_busca_nome){
				if ((!angular.isUndefined(_self.model.cdGrupoContratanteIni) && _self.model.cdGrupoContratanteIni !== '')
                && (angular.isUndefined(_self.model.cdGrupoContratanteFim)    && _self.model.cdGrupoContratanteFim   !== '')){
                    isValid = false;
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title: 'O grupo de contratante deve estar preenchido!'
                    });
                };
				
		    if ((_self.model.cdGrupoContratanteFim) < (_self.model.cdGrupoContratanteIni)){
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'O grupo contratante inicial deve ser menor que o grupo contratante final!'
                });
            };
				
			if (_self.model.cdGrupoContratanteIni.length < 3) {
					isValid = false;
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title: 'O grupo de contratante inicial deve ter no minimo 3 caracteres!'
                    });
			    }
				
			if (_self.model.cdGrupoContratanteFim.length < 3) {
					isValid = false;
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title: 'O grupo de contratante final deve ter no minimo 3 caracteres!'
                    });
			    }     
				           
				
			}
			

            if (isValid === true) {                
                this.constructDisclaimers();                
                $modalInstance.close(this.disclaimers);
            }

        };

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        this.init = function () {
            this.initialize();

            /*_self.model.documentStatus = 0;
            _self.model.invoiceType = 0;*/
        };

        $scope.$watch('$viewContentLoaded', function () {
            
            _self.init();
        });


        $.extend(this, AbstractAdvancedFilterController);
        
    }
    index.register.controller('hvp.healthDeclaRulesAdvanceFilterController', advancedFilterController);
});