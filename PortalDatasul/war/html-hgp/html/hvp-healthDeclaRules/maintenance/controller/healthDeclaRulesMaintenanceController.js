define(['index', 
        '/dts/hgp/html/global-provider/providerFactory.js',
        '/dts/hgp/html/enumeration/healthDeclaRulesTypeEnumeration.js',
        '/dts/hgp/html/hvp-healthDeclaRules/healthDeclaRulesFactory.js',
		'/dts/hgp/html/hvp-healthDeclaRules/healthDeclaRulesFactoryOld.js'
	], function(index) {

	healthDeclaRulesMaintenanceController.$inject = ['$rootScope', '$scope', '$stateParams', 
                                                     'totvs.app-main-view.Service', 'totvs.utils.Service',
	                             	                 '$location', 'hvp.healthDeclaRulesFactory','hvp.healthDeclaRulesFactoryOld',
													 '$state','$modal', '$timeout', '$window','TOTVSEvent'];

                                      
	function healthDeclaRulesMaintenanceController($rootScope, $scope, $stateParams,
                                                   appViewService, totvsUtilsService,
                                                   $location, healthDeclaRulesFactory,healthDeclaRulesFactoryOld,
												   $state,$modal, $timeout, $window,TOTVSEvent) {
                var _self = this;
			    appViewService.startView('Regras de declaração de saude', 'hvp.healthDeclaRulesMaintenanceController', _self);
		        if(appViewService.lastAction != 'newtab'
                    && _self.currentUrl == $location.$$path){
                        return;
                }

													   
                $scope.HEALTH_DECLA_RULES_STATUS_ENUM = HEALTH_DECLA_RULES_STATUS_ENUM;
                
                //$scope.transactionZoomController = transactionZoomController;
                var editHealthDeclaRules;
				var isDisabled = false;
                //variavel utilizada para controlar o 'creationComplete' da tela
                var isSettingData = false;
                var movementSemaphore = 2;
                var filledGuideFirst = false;
                var isContrat = false;
                _self.today = new Date();
                _self.tmpPropostDeclaSaude = [];		
                this.movementFixedFilters = {};
				this.tmpRegraDeclaSaude= {cdContratante:""};
                _self.healthDeclaRules = {};
				_self.listAnexo = {};
				_self.currentUrl = $location.$$path;                
                this.action = 'INSERT';
                _self.tmpRegraDeclaSaude.inTipMovto = 1;

                this.createObject = function(property, value){
                    var obj = {};
                    obj[property] = value;
                    
                    return obj;
                };
			
				

                this.movStyle = function(ind){
                    if(ind%2 === 0){
                        return 'background-color: aliceblue';
                    }else{
                        return '';
                    }
                }; 
				
				if (angular.isUndefined($stateParams.id) === false) {   
                        _self.action = "EDIT";                        
						filters = [];
						searchByid = $stateParams.id;
						
                        healthDeclaRulesFactory.getHealthDeclaRulesByFilter(
						    searchByid,0,20,filters,false, function (result) {
                                _self.hasDoneSearch = true;
                                if (result) {									
                                	_self.tmpRegraDeclaSaude = result.tmpRegraDeclaSaude[0];
									_self.tmpPropostDeclaSaude = result.tmpPropostDeclaSaude;
				   					_self.isGrpContrat = true;		   		
	    							_self.isContrat    = true;		   				   							

                                }
						});					
				}
                    				
		this.adicionarProposta = function(){
			if ((_self.tmpRegraDeclaSaude.cdContratante == null
			||  _self.tmpRegraDeclaSaude.cdContratante == "")
			&& (_self.tmpRegraDeclaSaude.cdGrupoContratante == null
			|| _self.tmpRegraDeclaSaude.cdGrupoContratante == ""))
			{
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error', title: 'Deve-se preencher o Contratante ou Grupo Contratante antes de adicionar propostas'                                           						
				});
				return;
			}
			
		    var modalid = document.getElementById('cdModalidade').value;
			var propost = document.getElementById('nrPropost').value;

			var object = {};
            object.cdModalidade = parseInt(modalid);
		    object.nrPropost    = parseInt(propost);	

	        for(i=0;i < _self.tmpPropostDeclaSaude.length;i++){
				if(_self.tmpPropostDeclaSaude[i].cdModalidade == object.cdModalidade
				&& _self.tmpPropostDeclaSaude[i].nrPropost    == object.nrPropost ){
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error', title: 'Já existe uma modalidade/proposta cadastrada.'                                           						
					});
					return;					
				}
		 	}		 

			healthDeclaRulesFactory.postValidatePropost(_self.tmpRegraDeclaSaude,object,
            function (result) {
                    if(result.$hasError === true){
                        return;
                    }
					_self.tmpPropostDeclaSaude.push(object);	
            });
		}
  
       this.excluirProposta = function(propost){
		 for(i=0;i < _self.tmpPropostDeclaSaude.length;i++){
				if(_self.tmpPropostDeclaSaude[i].cdModalidade == propost.cdModalidade
				&& _self.tmpPropostDeclaSaude[i].nrPropost    == propost.nrPropost ){
					_self.tmpPropostDeclaSaude.splice(i,1);
				}
		 }		 
        		 
	   };
	   this.changeContrat = function(){
	    	if (_self.tmpRegraDeclaSaude.cdContratante == null
	   		||  _self.tmpRegraDeclaSaude.cdContratante == undefined
	   		||  _self.tmpRegraDeclaSaude.cdContratante == 0){
		   		_self.isContrat = false;
	   		}else{
		   		_self.isContrat = true;		   		
		   	}
	   }
	   this.changeGrpContrat = function(){
	    	if (_self.tmpRegraDeclaSaude.cdGrupoContratante == null
	   		||  _self.tmpRegraDeclaSaude.cdGrupoContratante == undefined
	   		||  _self.tmpRegraDeclaSaude.cdGrupoContratante == ""){
		   		_self.isGrpContrat = false;
	   		}else{
		   		_self.isGrpContrat = true;		   		
		   	}
	   }	   

       this.save = function() {                     
                    _self.isSaving = true;                    
					
					if (String(_self.tmpRegraDeclaSaude.qtdBenef).length > 9){
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'error', title: 'Quantidade de beneficiarios nao pode ter mais de 9 digitos '												
						});														
						return;
					}

					if (String(_self.tmpRegraDeclaSaude.cdContratante).length > 9){
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'error', title: 'Codigo do contratante nao pode ter mais de 9 digitos '												
						});														
						return;
					}

					if (_self.tmpPropostDeclaSaude.length == 0){
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'error', title: 'Necessário incluir uma proposta vinculada!'												
						});														
						return;						
					}
					
                    if((_self.tmpRegraDeclaSaude.cdContratante       != ""
					&& _self.tmpRegraDeclaSaude.cdContratante       != null
					&& _self.tmpRegraDeclaSaude.cdContratante       > 0) 
                    || (_self.tmpRegraDeclaSaude.cdGrupoContratante  != ""
					&& _self.tmpRegraDeclaSaude.cdGrupoContratante  != null)
                    && _self.tmpRegraDeclaSaude.inTipAnexo          != ""
					&& _self.tmpRegraDeclaSaude.inTipAnexo          != null
					&& _self.tmpRegraDeclaSaude.inTipMovto          != ""
					&& _self.tmpRegraDeclaSaude.inTipMovto          != null
                    && _self.tmpRegraDeclaSaude.qtdBenef            != "" 
					&& _self.tmpRegraDeclaSaude.qtdBenef            != null
					&& _self.tmpRegraDeclaSaude.qtdBenef            > 0 ){     	
							_self.doSave();														                       
                    }
                    else {					
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
									type: 'error', title: 'Regra de declaração de saude '
												+' não foi salva. Necessário preencher todos os campos'
							});	


						 
                    }
       };
              
       this.onCancel = function(){                    
           _self.closeTab();                    
       };			  
			  
       this.closeTab = function(){
                        appViewService.removeView({active: true,
                        name  : 'Manutenção de regras de auditoria',
                        url   : $location.$$path});
       };			  
	   
      this.doSave = function(){		         
				 
				 if (_self.action == "EDIT"){
					healthDeclaRulesFactory.updateHealthDeclaRules(_self.tmpRegraDeclaSaude,_self.tmpPropostDeclaSaude,
					function (result) {
								if(result.$hasError === true){
									_self.isSaving = false;
									return;
								}								
								$rootScope.$broadcast(TOTVSEvent.showNotification, {
									type: 'success', title: 'Regra de declaração de saude '                                           
												+' alterada com sucesso'
								});
								
								appViewService.removeView({active: true,
														name  : 'Regras de Declaração de Saúde',
														url   : $location.$$path});
							});
					 
				 }else{		
					healthDeclaRulesFactory.saveHealthDeclaRules(_self.tmpRegraDeclaSaude,_self.tmpPropostDeclaSaude,
					function (result) {
								if(result.$hasError === true){
									_self.isSaving = false;
									return;
								}								
								$rootScope.$broadcast(TOTVSEvent.showNotification, {
									type: 'success', title: 'Regra de declaração de saude '                                           
												+' salvo com sucesso'
								});
								
								appViewService.removeView({active: true,
														name  : 'Regras de Declaração de Saúde',
														url   : $location.$$path});
							});
				}
       };
              
		this.init = function() {
                    //appViewService.startView('Regras da Declaração de Saúde', 'hvp.healthDeclaRulesMaintenanceController', _self);
                    
                    if(appViewService.lastAction != 'newtab'
                    && _self.currentUrl == $location.$$path){
                        return;
                    }                           	
					// Utiliza parte java antiga
					healthDeclaRulesFactoryOld.getannextypelist(function(result){						
						_self.listAnexo = result;
					});
					
                    _self.currentUrl = $location.$$path;
                    if($state.current.name === 'dts/hgp/hvp-healthDeclaRules.detail'){
                        _self.action = "DETAIL";						
						_self.isDisabled = true;
                    } 
		};            

      $scope.$on('$viewContentLoaded', function(){
               _self.init();
       }); 
	}
	
	index.register.controller('hvp.healthDeclaRulesMaintenanceController', healthDeclaRulesMaintenanceController);	
});
