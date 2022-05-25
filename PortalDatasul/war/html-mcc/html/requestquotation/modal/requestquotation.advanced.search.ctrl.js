define(['index',
	], function(index){

		advancedSearchController.$inject = ['$scope', '$modalInstance', 'parameters'];		
		function advancedSearchController($scope, $modalInstance, parameters){
            
            // *********************************************************************************
            // *** Variables
            // *********************************************************************************
            var ctrl = this;
            ctrl.disclaimers = [];
            ctrl.parameters = [];
            ctrl.model = {};   

            // *********************************************************************************
            // *** Functions
            // *********************************************************************************

            // # Purpose: Inicia a tela
            // # Parameters: 
            // # Notes: 
            ctrl.init = function(){
                ctrl.parseDisclaimerToModel();
                
                //Seta default do validateShowType
                if(ctrl.model.validateShowType == undefined)
                    ctrl.model.validateShowType = false;
            }

            
            // # Purpose: Transforma os disclaimers recebidos em parâmetros para a modal (setar os campos da pesquisa avançada)
            // # Parameters: 
            // # Notes: 
            ctrl.parseDisclaimerToModel = function(){
                // Transforma os disclaimers em parâmetros para a api
                angular.forEach(ctrl.disclaimers, function(disclaimer) {
                    
                    if(typeof disclaimer.value == "string" && disclaimer.value.indexOf("&nbsp;") > -1){ /* Ranges */    
                        parameter = ctrl.getParameterFromDisclaimer(disclaimer.property);
                        if(parameter){                      
                            if(disclaimer.property.match(/Date*/)){ // Se for do tipo date converte para integer                            
                                ctrl.model[disclaimer.property] = {start: (parameter[0])?parseInt(parameter[0],10):undefined, end: (parameter[1])?parseInt(parameter[1],10):undefined};
                            }else{
                                ctrl.model[disclaimer.property] = {};                           
                                if(parameter[0]) ctrl.model[disclaimer.property].start = parameter[0];
                                if(parameter[1]) ctrl.model[disclaimer.property].end = parameter[1];
                            }                       
                        }
                    }else { /* Campos normais */
                        ctrl.model[disclaimer.property] = disclaimer.value;                 
                    }
                });    
            }

            // # Purpose: Retorna um objeto da lista de disclaimers recebidos de acordo com o nome da propriedade
            // # Parameters: 
            // #            property: propriedade utlizada para criar o disclaimer
            // # Notes: 
            ctrl.getParameterFromDisclaimer = function(property){
                var value = undefined;
                $.grep(ctrl.disclaimers, function(e){
                    if(e.property === property){
                        value = e.value.split("&nbsp;");
                        return;
                    }
                });         
                if(value[0] == 'undefined') value[0] = undefined;
                if(value[1] == 'undefined') value[1] = undefined;
                return value;
            };

            // # Purpose: Aplica os filtros definidos em tela
            // # Parameters: 
            // # Notes: 
            ctrl.apply = function() {           
                $modalInstance.close(ctrl.model);
            }
            
            // # Purpose: Cancela a tela de filtro avançado
            // # Parameters: 
            // # Notes:
            ctrl.cancel = function() {
                $modalInstance.dismiss('cancel');
            }
            
            // *********************************************************************************
            // *** Control Initialize
            // *********************************************************************************        
            ctrl.disclaimers = parameters.disclaimers;

            ctrl.init();        
            // *********************************************************************************
            // *** Events Listners
            // *********************************************************************************
            $scope.$on('$destroy', function () {
                ctrl = undefined;
            });

            $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {         
                $modalInstance.dismiss('cancel');
            });
        }
        
        // *************************************************************************************
        // *** SERVICE MODAL ADVANCED SEARCH
        // *************************************************************************************
        modalAdvancedSearch.$inject = ['$modal'];
        function modalAdvancedSearch($modal) {
            this.open = function (params) {         
                var instance = $modal.open({
                    templateUrl: '/dts/mcc/html/requestquotation/modal/requestquotation.advanced.search.html',
                    controller: 'mcc.requestquotation.modal.AdvancedSearchCtrl as controller',
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: { 
                        parameters: function () { return params; } 
                    }
                });
                return instance.result;
            }
        };

		index.register.controller('mcc.requestquotation.modal.AdvancedSearchCtrl', advancedSearchController);
        index.register.service('mcc.requestquotation.modal.ModalAdvancedSearch', modalAdvancedSearch);
	});