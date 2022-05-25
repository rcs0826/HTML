define(['index',
	'/dts/hgp/html/hvp-healthDeclarationPending/healthDeclarationPendingFactory.js',
	'/dts/hgp/html/hvp-healthDeclarationPending/controller/advancedFilterController.js',
	'/dts/hgp/html/hvp-healthDeclarationPending/controller/healthDeclarationPendingReproveMotive.js',    
	'/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
	'/dts/hgp/html/util/genericConfigController.js',	
	'/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/js/util/DateTools.js'	
	
], function (index) {
	
    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    healthDeclartionPendingController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service',
        '$modal', 'hvp.healthDeclarationPendingFactory', 'AbstractAdvancedFilterController','TOTVSEvent','global.userConfigs.Factory'];
		
    function healthDeclartionPendingController($rootScope, $scope, appViewService,
		$modal, healthDeclarationPendingFactory, AbstractAdvancedFilterController,TOTVSEvent,userConfigsFactory) {

        var totalOfhealthDeclaCount;
        var _self = this;
        $scope.StringTools = StringTools;
        _self.listOfHealthDeclarationPending = [];
 
        // *********************************************************************************
        // *** Functions
        // *********************************************************************************	

        this.openAdvancedSearch = function () {

            var advancedFilter = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hvp-healthDeclarationPending/ui/advanced-filter.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hvp.healthDeclarationPendingAdvanceFilterController as afController',
                resolve: {
                    disclaimers: function () {
                        return _self.disclaimers;
                    },
					
                    AbstractAdvancedFilterController : function(){
                        return AbstractAdvancedFilterController;
                    },
                    listOfHealthDeclarationPending: function(){
                        return _self.listOfHealthDeclarationPending;
                    }
                }
            });
            
            advancedFilter.result.then(function (filters) {                                
                _self.cdModalidade     = filters[0].cdModalidade;
                _self.nrTerAdesao      = filters[0].nrTerAdesao;                
                _self.searchInputText  = filters[0].nmUsuario;   
                _self.search(false,true);   
            });
        };
		
		
        this.openConfigWindow = function () {
          $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hvp-healthDeclarationPending/ui/healthDeclarationPendingListConfiguration.html',
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
        };
        
		        

        this.search = function (isMore,isAdvance) {
            var startAt = 0;
            _self.totalOfhealthDeclaCount = 0;

            _self.hasDoneSearch = false;

            

            if (!isAdvance) {                
                _self.cdModalidade = 0 ;
                _self.nrTerAdesao  = 0 ;
            } 
            if (isMore) {
                startAt = _self.listOfHealthDeclarationPending.length + 1;          
            } else {
                 this.listOfHealthDeclarationPending = [];
                _self.tmpRegraDeclaSaude = [];
            }
			
         

			filters = [{'cdModalidade':_self.cdModalidade,'nrTerAdesao':_self.nrTerAdesao ,'nmUsuario':_self.searchInputText}];
                                    
            healthDeclarationPendingFactory.getAllHealthDeclaPending("", startAt, 
            parseInt(_self.config.qtdRegistrosBusca),filters, 
            function (result) { 
                    _self.hasDoneSearch = true;
                    if(result.$hasError){
                       
                    } else if (result) {
                        angular.forEach(result, function (value) {
                            if (value && value.$length) {
                                _self.totalOfhealthDeclaCount = value.$length;
                            }
                            _self.listOfHealthDeclarationPending.push(value);
                        });
                    }
                });      
        };

        this.searchFromAnotherPlace = function(){
            var startAt = 0;
            _self.totalOfhealthDeclaCount = 0;

            _self.hasDoneSearch = false;

            

            _self.cdModalidade = 0 ;
            _self.nrTerAdesao  = 0 ;
            
            //_self.listOfHealthDeclarationPending = [];
            _self.listOfHealthDeclarationPending.splice(0,_self.listOfHealthDeclarationPending.length);
            _self.tmpRegraDeclaSaude = [];
            
         

			filters = [{'cdModalidade':_self.cdModalidade,'nrTerAdesao':_self.nrTerAdesao ,'nmUsuario':_self.searchInputText}];
                                    
            healthDeclarationPendingFactory.getAllHealthDeclaPending("", startAt, 
            parseInt(_self.config.qtdRegistrosBusca),filters, 
            function (result) { 
                    _self.hasDoneSearch = true;
                    if(result.$hasError){
                       
                    } else if (result) {
                        angular.forEach(result, function (value) {
                            if (value && value.$length) {
                                _self.totalOfhealthDeclaCount = value.$length;
                            }
                            _self.listOfHealthDeclarationPending.push(value);
                        });
                    }
                });  
        }
        
        $rootScope.$on('rootScope:emit', this.searchFromAnotherPlace);
        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        this.init = function () {  
            appViewService.startView("Auditoria Declaração de Saúde", 'hvp.healthDeclartionpendingController', _self);
            
			
            if(appViewService.lastAction != 'newtab'){
                return;
            }
            
            _self.cdProgramaCorrente = 'hvp.healthDeclaration';
            _self.disclaimers = [];
            _self.config = [];
            
            _self.hasDoneSearch = false;
            
            _self.listOfdocumentCount = 0;
            
            _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
            userConfigsFactory.getConfigByKey(
                    $rootScope.currentuser.login, 
                    _self.cdProgramaCorrente,
                function(result){				
                  if(angular.isUndefined(result) == true){
                        _self.config = { lgBuscarAoAbrirTela  : true,
                                         qtdRegistrosBusca    : "20",
                                         documentDetailLevel  : 2,
                                         minDoctosExecBatch   : "20"};
                                    
                        _self.search(false);            
                   }else{
                        _self.config = result.desConfig;
                        
                        if(_self.config.disclaimers){
                            _self.disclaimers = angular.copy(_self.config.disclaimers);
                        }
                        
                        if(_self.config.lgBuscarAoAbrirTela == true){
                            _self.search(false,false);
                       }
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
		
		this.approve = function(healthDeclaPending){
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!',
                text: "Deseja aprovar?",
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                size: 'md',
                callback: function (hasChooseYes) {
                    if (hasChooseYes != true) {
                      return;  
                  }else{
                        healthDeclarationPendingFactory.approve(healthDeclaPending, function (result) { 
                            if(result.$hasError){
                            }else{                                
                                for(i=0;i < _self.listOfHealthDeclarationPending.length;i++){
                                    if(_self.listOfHealthDeclarationPending[i].id == healthDeclaPending.id){
                                       _self.listOfHealthDeclarationPending.splice(i,1);
                                    }
                                }                                
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type: 'success', title: 'Beneficiario ' +  healthDeclaPending.nmBeneficiario + ' aprovado com sucesso!'
                                });
                            }   
                        });
                  }   					
				} 
			});
		}
		
		this.disapprove = function(healthDeclaPending){			
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!',
                text: "Deseja reprovar?",
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                size: 'md',
                callback: function (hasChooseYes) {
                    if (!hasChooseYes) 
                        return;
					else{
						$modal.open({
							animation: true,
							templateUrl: '/dts/hgp/html/hvp-healthDeclarationPending/ui/healthDeclaRuleReproveMotive.html',
							size: 'sm',
							backdrop: 'static',
							controller: 'hvp.healthDeclarationPendingReproveMotive as controller',
							resolve: {  
								healthDeclaPending: function () {
									return healthDeclaPending;
								},
                                listOfHealthDeclarationPending: function(){
                                    return _self.listOfHealthDeclarationPending;
                                }
							}	
						});
					}
                    					
				} 
			});
		}
		
		this.importFile = function(){
            $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hvp-healthDeclaRules/ui/importFile.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hvp.importFileController as impFileController',
                resolve: {
                }
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

    index.register.controller('hvp.healthDeclartionpendingController', healthDeclartionPendingController);

});
