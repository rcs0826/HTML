define([
    'index',
    'angularAMD',	
    '/dts/mce/js/mce-utils.js',
    '/dts/mce/js/zoom/deposito.js',
    '/dts/mpd/js/zoom/estabelec.js',
    '/dts/mce/js/zoom/localizacao.js',
    '/dts/mce/js/zoom/saldo-estoq.js'	
], function(index) {

    /*####################################################################################################
     # CONTROLLER: controllerAdvancedSearch
     * REGISTRO..: mce.ce0830.AdvancedSearchController
     # DESCRICAO.: Controle da Pesquisa Avançada
     ####################################################################################################*/
   // CONTROLLER PESQUISA AVANCADA
   controllerAdvancedSearch.$inject = [
   '$rootScope', '$scope', '$modalInstance', 'parameters', 'mce.utils.Service', 'TOTVSEvent'
   ];

   function controllerAdvancedSearch($rootScope, $scope, $modalInstance, parameters, mceUtils, TOTVSEvent){

   		// *********************************************************************************
    	// *** Variables
    	// *********************************************************************************
		var _controllerAdvancedSearch = this;
		this.mceUtils = mceUtils;
		this.model = {};
		this.param = {};
        this.itemCode = parameters.itemCode;
        _controllerAdvancedSearch.model.balanceDate = Date.parse(parameters.balanceDate);
       
        // *********************************************************************************
		// *** Functions
		// ***********************************************************************************
		
        /* Função....: apply
           Descrição.: aplica a busca avançada
           Parâmetros: 
        */
        this.apply = function() {
			
            if (_controllerAdvancedSearch.isInvalidForm()) {
               return;
            }            
            
             _controllerAdvancedSearch.param = {pItem: _controllerAdvancedSearch.itemCode,  
                           pbalanceDate: _controllerAdvancedSearch.model.balanceDate,
                           pSite: _controllerAdvancedSearch.model.site,
                           pWarehouse: _controllerAdvancedSearch.model.warehouse,
                           pLocation: _controllerAdvancedSearch.model.location,
                           pLote: _controllerAdvancedSearch.model.lot,
                           pBalanceReset: _controllerAdvancedSearch.model.noBalance                         
                          };
            
            this.parseModelToDisclaimers();          
			
            $modalInstance.close({disclaimers: _controllerAdvancedSearch.disclaimers,
                                  parametros: _controllerAdvancedSearch.param}); // fecha modal retornando parametro
		}		
        
        /* Função....: isInvalidForm
           Descrição.: responsável por validar o formulário
           Parâmetros: <não há> 
        */
        this.isInvalidForm = function() {
            
            var messages      = [];
            var warning       = '';
            var isInvalidForm = false;

            // Data Saldo Obrigatório
            if (_controllerAdvancedSearch.model.balanceDate == undefined) {
                isInvalidForm = true;
                warning = $rootScope.i18n('l-field') + ": " + $rootScope.i18n('l-balance-date') + " " + $rootScope.i18n('l-required-2') + '. ';
                
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type  : 'error',
                    title : $rootScope.i18n('l-attention'),
                    detail: warning
                });                
            }
            return isInvalidForm;
        }
        
        /* Função....: cancel
           Descrição.: cancela e fecha a busca avançada
           Parâmetros: 
        */
		this.cancel = function() {
			$modalInstance.dismiss('cancel'); // fecha modal sem retornar parametros
		}

        /* Função....: parseModelToDisclaimers
           Descrição.: transforma os disclaimers recebidos da tela em filtros da tela
           Parâmetros: <não há> 
        */  
		this.parseModelToDisclaimers = function() {	
			_controllerAdvancedSearch.disclaimers = [];

			for (key in _controllerAdvancedSearch.model) {
				var model = _controllerAdvancedSearch.model[key];
                
                if(model == undefined)
					continue;

				switch(key) {
					case 'balanceDate':
						_controllerAdvancedSearch.disclaimers.push(
							this.mceUtils.parseTypeToDisclaimer('date', key, model, $scope.i18n('l-balance-date'), true, '')
						);
					break;
					case 'site':
						_controllerAdvancedSearch.disclaimers.push(
							this.mceUtils.parseTypeToDisclaimer('char', key, model, $scope.i18n('l-site'), false, '')
						);
					break;
					case 'warehouse':
						_controllerAdvancedSearch.disclaimers.push(
							this.mceUtils.parseTypeToDisclaimer('char', key, model, $scope.i18n('l-warehouse'), false, '')
						);
					break;
					case 'location':
						_controllerAdvancedSearch.disclaimers.push(
							this.mceUtils.parseTypeToDisclaimer('char', key, model, $scope.i18n('l-localization'), false, '')
						);
					break;
					case 'lot':
						_controllerAdvancedSearch.disclaimers.push(
							this.mceUtils.parseTypeToDisclaimer('char', key, model, $scope.i18n('l-lot-serial'), false, '')
						);
					break;
					case 'noBalance':
						_controllerAdvancedSearch.disclaimers.push(
							this.mceUtils.parseTypeToDisclaimer('boolean', key, model, $scope.i18n('l-no-balance'), true, '')
						);
					break;
				}				
			};
		}

        /* Função....: parseDisclaimersToModel
           Descrição.: transforma os disclaimers recebidos da tela em valores do model
           Parâmetros: <não há> 
        */  
		this.parseDisclaimersToModel = function() {
            _controllerAdvancedSearch.mceUtils.parseDisclaimersToModel(parameters.disclaimers,
                                              function(model, disclaimers) {
                
                _controllerAdvancedSearch.model       = model;
				_controllerAdvancedSearch.disclaimers = disclaimers;
			});
		}
		
		/* Função....: init
           Descrição.: responsável por inicializar a pesquisa avançada
           Parâmetros: <não há> 
        */    
        this.init = function() {
            _controllerAdvancedSearch.parseDisclaimersToModel();  // Transforma os disclaimers no objeto model
        }
        
        if ($rootScope.currentuserLoaded) {
            this.init();            
        }
       
		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			_controllerAdvancedSearch = undefined;
		});

        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {  
             $modalInstance.dismiss('cancel');
        });
       
   };

   index.register.controller('mce.ce0830.AdvancedSearchController', controllerAdvancedSearch);	

});