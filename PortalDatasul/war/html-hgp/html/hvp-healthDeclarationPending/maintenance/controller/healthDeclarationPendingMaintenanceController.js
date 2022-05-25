define(['index', 
        '/dts/hgp/html/global-provider/providerFactory.js',
        '/dts/hgp/html/enumeration/healthDeclaRulesTypeEnumeration.js',
        '/dts/hgp/html/hvp-healthDeclarationPending/healthDeclarationPendingFactory.js',
        '/dts/hgp/html/hvp-healthDeclaRules/healthDeclaRulesFactoryOld.js',
        '/dts/hgp/html/hcg-attachmentType/attachmentTypeZoomController.js',
	], function(index) {

	healthDeclarationPendingMaintenanceController.$inject = ['$rootScope', '$scope', '$stateParams', 
                                                     'totvs.app-main-view.Service', 'totvs.utils.Service',
	                             	                     '$location', 'hvp.healthDeclarationPendingFactory','hvp.healthDeclaRulesFactoryOld',
													                           '$state','$modal', '$timeout', '$window','TOTVSEvent'];

                                      
	function healthDeclarationPendingMaintenanceController($rootScope, $scope, $stateParams,
                                                		    appViewService, totvsUtilsService,
                                               			    $location, healthDeclarationPendingFactory,healthDeclaRulesFactoryOld,
												  		                          $state,$modal, $timeout, $window,TOTVSEvent) {
          var _self = this;
          var tmpPendingDeclaSaude = [];
          var anexos = [];
          var listOfHealthDeclarationPending = [];

			    appViewService.startView('Auditoria de declaração de saude', 'hvp.healthDeclarationPendingMaintenanceController', _self);
		      if(appViewService.lastAction != 'newtab'
          && _self.currentUrl == $location.$$path){
             return;
          }
													                               
                //variavel utilizada para controlar o 'creationComplete' da tela
                var isSettingData = false;
			        	_self.currentUrl = $location.$$path;


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
                          
  						filters = [];
  						searchByid = $stateParams.id;
  						 _self.hasDoneSearch = false;
             healthDeclarationPendingFactory.getHealthDeclaPending(
  						    searchByid, function (result) {
                       _self.hasDoneSearch = false;
                       if (result) {  							                     
                          _self.tmpPendingDeclaSaude = result.tmpPendingDeclaSaude[0];								   
                          _self.anexos               = result.anexos;                                          
                       }
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
                                                                                                      
                                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                            type: 'success', title: 'Beneficiario ' +  healthDeclaPending.nmBeneficiario + ' aprovado com sucesso!'
                                        });
                                        _self.onCancel();
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
                              var healthDeclaRuleReproveMotive = $modal.open({
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
                            healthDeclaRuleReproveMotive.result.then (function () {
                              _self.onCancel();
                            });
                          }
                                        
                  } 
                });
         }

         this.onCancel = function(){  
            $rootScope.$emit('rootScope:emit'); // $rootScope.$on
             _self.closeTab();                    
         };			  
  			  
         this.closeTab = function(){
                          appViewService.removeView({active: true,
                          name  : 'Auditoria de regras de auditoria',
                          url   : $location.$$path});
         };			  

        this.donwload = function(anexo){          
          $window.open("/html-declarasaude/rest/pendauditdeclarasaude/downloadAnexo?cddAnexo=" + anexo.id + "&nomAnexo=" + anexo.nome);
        };     
  	
  	   	this.init = function() {
                      //appViewService.startView('Regras da Declaração de Saúde', 'hvp.healthDeclaRulesMaintenanceController', _self);                    
                      if(appViewService.lastAction != 'newtab'
                      && _self.currentUrl == $location.$$path){
                          return;
                      }                           						
                      _self.currentUrl = $location.$$path;
      
  	   	};           

        // Realiza a importacao de aquivo no servidor
        this.uploadFile = function($files,idPessoa) {
         
         
            _self.hasDoneSearch = false;
            successCallback = function (result) {              
              $rootScope.$broadcast(TOTVSEvent.showNotification, {
                  type: 'sucess', title: 'Arquivo importado com sucesso!'
               });       

               _self.anexos.push(result[0]);
            };

            progressCallback = function (progress, event) {
  

            };

            errorCallback = function (result, status, headers, config, attachmentInstance) {
             
            };           


           files = $files;
           for (var i = 0; i < files.length; i++) {                    
                var file = files[i];
                if(this.tpDocumento == undefined){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title: 'Tipo de Anexo é obrigatório.'
                    });
                    return;
                }
                var teste  =  healthDeclarationPendingFactory.upload(file,"nome","",idPessoa,this.tpDocumento,successCallback, progressCallback,errorCallback); 

            }
        }        
        this.removeAttachment = function(anexo) {    
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                        title: 'Atenção!',
                        text: "Deseja remover o anexo?",
                        cancelLabel: 'Não',
                        confirmLabel: 'Sim',
                        size: 'md',
                        callback: function (hasChooseYes) {
                            if (hasChooseYes) {
                                 healthDeclarationPendingFactory.removeAttachment(
                                      anexo, function (result) {
                                          _self.hasDoneSearch = false;
                                          if (result) {
                                             for(i=0;i < _self.anexos.length;i++){
                                                if(_self.anexos[i].id == anexo.id){
                                                   _self.anexos.splice(i,1);
                                                }
                                              }    
                                          }
                                  });       
                          }else{
                               return ;
                          }             
                        } 
            });
        }

      $scope.$on('$viewContentLoaded', function(){
               _self.init();
       }); 
	}
	
	index.register.controller('hvp.healthDeclarationPendingMaintenanceController', healthDeclarationPendingMaintenanceController);	
});
