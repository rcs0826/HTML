define(['index',
    '/dts/hgp/html/hvp-healthDeclaRules/healthDeclaRulesFactory.js',
    '/dts/hgp/html/enumeration/healthDeclaRulesTypeEnumeration.js',
    '/dts/hgp/html/hvp-healthDeclaRules/controller/advancedFilterController.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/js/util/DateTools.js',
    '/dts/hgp/html/util/genericConfigController.js',
	'/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/hvp-healthDeclaRules/controller/importFileController.js'

], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************
    healthDeclaRulesListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service',
        'hvp.healthDeclaRulesFactory', '$modal', 'AbstractAdvancedFilterController',
        'global.userConfigs.Factory', 'TOTVSEvent'];

    function healthDeclaRulesListController($rootScope, $scope, appViewService, healthDeclaRulesFactory, 
            $modal, AbstractAdvancedFilterController, userConfigsFactory,TOTVSEvent) {

        var _self = this;
        $scope.StringTools = StringTools;
        $scope.HEALTH_DECLA_RULES_STATUS_ENUM = HEALTH_DECLA_RULES_STATUS_ENUM;
        _self.isSearch = false;
		_self.searchInputText = "";
		
        // *********************************************************************************
        // *** Functions
        // *********************************************************************************	
		
        this.openAdvancedSearch = function () {

            var advancedFilter = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hvp-healthDeclaRules/ui/advanced-filter.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hvp.healthDeclaRulesAdvanceFilterController as afController',
                resolve: {
                    disclaimers: function () {
                        return _self.disclaimers;
                    },
                    AbstractAdvancedFilterController : function(){
                        return AbstractAdvancedFilterController;
                    }
                }
            });
            
            advancedFilter.result.then(function (dis) {

                _self.search(false,false);
            });
        };
        
        this.openConfigWindow = function () {
            var configWindow = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hvp-healthDeclaRules/ui/healthDeclaRulesListConfiguration.html',
                size: 'sm',
                backdrop: 'static',
                controller: 'global.genericConfigController as controller',
                resolve: {
					
                    config: function () {
                        return angular.copy(_self.config);
                    },
                    programName: function(){
                        return _self.cdProgramaCorrente;
                    },
                    extensionFunctions: function(){
                        var funcs = {};
                        funcs.setCurrentFilterAsDefault = function(){
                            this.config.disclaimers = angular.copy(_self.disclaimers);                            
                        };                        

                        return funcs;
                    }
                }
            });
            configWindow.result.then(function (config) {                
                _self.config = angular.copy(config);                
            });            
        };
        

        this.search = function (isMore,isAdvancedFilter) {             
            var searchByid = 0;               
            if (isAdvancedFilter){        
			   _self.disclaimers = [];
               _self.disclaimers.push({property:'cdContratanteIni',title:'Contratante Inicial',value:_self.searchInputText});
            }

			var filters = [];
            var startAt = 0;
            this.totalOfhealthDeclaCount = 0;            
            _self.hasDoneSearch = false;

            if (isMore) {
                startAt = _self.tmpRegraDeclaSaude.length + 1;			
            } else {
                this.listOfHealthDecla = [];
                _self.tmpRegraDeclaSaude = [];
            }
            filters = _self.disclaimers.slice();            
              
            healthDeclaRulesFactory.getHealthDeclaRulesByFilter(searchByid,startAt,
                    parseInt(_self.config.qtdRegistrosBusca),filters,isAdvancedFilter, function (result) {			
                    _self.hasDoneSearch = true;
                    if (result) {
						//_self.tmpRegraDeclaSaude = result.tmpRegraDeclaSaude;		
                        angular.forEach(result.tmpUtils	, function (value) { 
                             _self.totalOfhealthDeclaCount = value.numRegister;                              
                        });	
                        angular.forEach(result.tmpRegraDeclaSaude, function (value) {		
                            // Sem tempo para criar a variavel de rotulo                           
                            if (value.cdContratante == 0){
                                value.cdContratante = '0 - Todos';
                            }
                            _self.tmpRegraDeclaSaude.push(value);
                        });
                        if (isMore === false) {
                            $('.page-wrapper').scrollTop(0);
                        }
                    }
                });        
        };

        this.removeDisclaimer = function (disclaimer) {

            for (var i = _self.disclaimers.length - 1; i >= 0; i--) {
                if (_self.disclaimers[i].property === disclaimer.property) {
                    _self.disclaimers.splice(i, 1);
                }
            }
			
		/*	_self.disclaimers = _self.disclaimers.filter(disclaimersAux => disclaimersAux.property !== disclaimer.property)*/					

            _self.search(false);
        };

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

         this.init = function () {  
		
            appViewService.startView("Regras da Declaração de Saude", 'hvp.healthDeclaRulesListController', _self);
            

            if(appViewService.lastAction != 'newtab'){
                return;
            }
            
            _self.cdProgramaCorrente = 'hvp.healthDeclaRulesList';
            _self.disclaimers = [];
            _self.config = [];
            
			_self.tmpRegraDeclaSaude = [];
            _self.hasDoneSearch = false;
            _self.listOfHealthDecla = [];
            _self.totalOfhealthDeclaCount = 0;
            
            _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";

            userConfigsFactory.getConfigByKey(
                    $rootScope.currentuser.login, 
                    _self.cdProgramaCorrente,
                function(result){
                   if(result == null
                   || angular.isUndefined(result) == true){
                       result = {
                           cdUserid: $rootScope.currentuser.login,
                           cdPrograma: _self.cdProgramaCorrente,
                           desConfig: {
                               lgBuscarAoAbrirTela  : true,
                               qtdRegistrosBusca    : "20"
                           }
                       };
                   }                   
                   _self.config = result.desConfig;				   				   							
                   if(_self.config.lgBuscarAoAbrirTela == true){
                        _self.search(true,false);
                   }
                   
                });            
        };

        if ($rootScope.currentuserLoaded) {
            this.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }
		this.removeDeclaSaude = function(healthDeclaSaude){		
			healthDeclaRulesFactory.removeDeclaSaude(
	        healthDeclaSaude.id, function (result) {
		        if (result.hasError){
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'success', title: 'Regra de declaração de saude '                                           
                                +' possui dependencias'
                    });
				}
				else{
			        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error', title: 'Regra de declaração de saude '                                           
                                +' removida com sucesso'
                    });
					for(i=0;i < _self.tmpRegraDeclaSaude.length;i++){
						if(_self.tmpRegraDeclaSaude[i].id == healthDeclaSaude.id){
							_self.tmpRegraDeclaSaude.splice(i,1);
						}	
					}					
				}
			});				
		}		 
					

        this.importFile = function(){
            var importFile = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hvp-healthDeclaRules/ui/importFile.html',
                size: 'md',
                backdrop: 'static',
                controller: 'hvp.importFileController as impFileController',
                resolve: {
                    isSearch: function () {
                        return _self.isSearch;
                    },                    
                }
            });
            importFile.result.then(function (isSearch) {

                _self.search(false,true);
            });            
        }
       
	// *********************************************************************************
	// *** Events Listners
	// *********************************************************************************
		
//	$scope.$watch('$viewContentLoaded', function(){             
//          $('#navBar').bind("resize",function(){
//              $('#pageContent').css("padding-top",$('#navBar').outerHeight() + 'px');
//          });
//	});		
    }

    index.register.controller('hvp.healthDeclaRulesListController', healthDeclaRulesListController);

});
