define(['index',  
		'/dts/hgp/html/hcg-associativeProcessAttachments/associativeProcessAttachmentsFactory.js',
    ], function(index) {

	associativeProcessAttachmentsMaintenanceController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service', 'hcg.associativeProcessAttachments.Factory', 'TOTVSEvent'];
	function associativeProcessAttachmentsMaintenanceController($rootScope, $scope, $state, $stateParams, appViewService, associativeProcessAttachmentsFactory,TOTVSEvent) {

		var _self = this;
		
				this.action = "INSERT"; 
				_self.associativeProcessAttachments = {};
				
                this.init = function(){
					
					_self.action = "INSERT";
					
					_self.availableProcesses = [1,2,4,9,11,14,100];
					
					//seta os valores do combo
					_self.TipGravacao = [{id:1,label:'1 - Banco de Dados'},
										 {id:2,label:'2 – File System'},
										 {id:3,label:'3 – Fluig (ECM)'}];
										
					$(' .restrictionDiv').slideToggle();
					
					if($state.current.name === 'dts/hgp/hcg-associativeProcessAttachments.detail'){
						_self.action = "DETAIL";
					}
						
					if($state.current.name === 'dts/hgp/hcg-associativeProcessAttachments.edit'){
						_self.action = "EDIT";
					}
					
                    appViewService.startView("Manutenção Associativa Processos x Anexos HTML", 'hcg.associativeProcessAttachmentsList.Control', _self);

                    if(appViewService.lastAction != 'newtab' 
            		&& _self.currentUrl == $location.$$path){
               			 return;
            		} 
									
					var disclaimers = [{property: 'idiGerenciaProcesAnexo', value: $stateParams.idiGerenciaProcesAnexo}];
	
					//Chama a factory-progress Detalhar
					associativeProcessAttachmentsFactory.getAssociativeProcessAttachmentsByFilter('', 0, 0, false, disclaimers,
						function(result){
							
							_self.associativeProcessAttachments = result[0];
							 
							//recebe o valor do progress e seta no combo box 
							_self.cdnTipGravac = _self.TipGravacao[_self.associativeProcessAttachments.cdnTipGravac - 1];
												
						});

					_self.restriction = {};
					_self.restrictionsList = {};
					_self.manualRestriction = {};

					_self.restriction.idiGerenciaProcesAnexo = $stateParams.idiGerenciaProcesAnexo;

					//Chama a factory-progress
					associativeProcessAttachmentsFactory.tipAnexoAssociativeProcessAttachments(_self.restriction,
						function (result) {
							if(result.$hasError == true){
								return;
							}
							_self.restrictionsList = result;
							
					});

						
				};

				this.checkAvailableProcesses = function(){
					if(this.availableProcesses.indexOf(this.associativeProcessAttachments.idiGerenciaProcesAnexo) !== -1) {
						return true;
					}
					return false;
				
				}
				// cancela edição - volta para a lista
		        this.onCancel = function () {  
		            appViewService.removeView({active: true,
		                                       name  : 'Manutenção Associativa Processos x Anexos',
		                                       url   : _self.currentUrl}); 
		        };


		        // salva os parametros alterados e novo 
		        this.onSaveNew = function () {

					if (angular.isUndefined(_self.cdnTipGravac) === true){
						_self.associativeProcessAttachments.cdnTipGravac = 0
					} 
					else {
						_self.associativeProcessAttachments.cdnTipGravac = _self.cdnTipGravac.id;
					} 

		            //Chama a factory-progress Salvar
					associativeProcessAttachmentsFactory.saveAssociativeProcessAttachments(_self.associativeProcessAttachments, _self.restrictionsList,
						function (result) {
							if(result.$hasError == true){
								return;
							}
				
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success', title: 'Salvo com sucesso'
							});
		                        
				            if(result.$hasError != true){                            
				            	_self.associativeProcessAttachments = {};
								_self.action = "INSERT";
				                //_self.init();
				               
				            }
				                                
				    }); 
				};

		        			
				// salva os parametros alterados 
				this.save = function () { 

					if (angular.isUndefined(_self.cdnTipGravac) === true){
						_self.associativeProcessAttachments.cdnTipGravac = 0
					} 
					else {
						_self.associativeProcessAttachments.cdnTipGravac = _self.cdnTipGravac.id;
					} 

					//Chama a factory-progress Salvar
					associativeProcessAttachmentsFactory.saveAssociativeProcessAttachments(_self.associativeProcessAttachments, _self.restrictionsList,
						function (result) {
							if(result.$hasError == true){
								return;
							}
		
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success', title: 'Salvo com sucesso'
							}); 
		
							$scope.$emit('atualizaGrid', '');
		
							appViewService.removeView({active: true,
													name  : 'Manutenção Associativa Processos x Anexos',
													url   : _self.currentUrl});                                  
						});               
				};

				//Tipos Anexo
				this.btTiposAnexos = function () {

					_self.restriction = {};
					_self.restrictionsList = {};
					_self.manualRestriction = {};
		
					$(' .restrictionDiv').css({
							'margin-top': '40px',
							'visibility': 'visible',
							'width'     : '700px'});
					$(' .divBody').css({
							'height': '210px',
							'width' : '650px'}); 
		
					$(' .restrictionDiv').slideToggle();

					_self.restriction.idiGerenciaProcesAnexo = _self.associativeProcessAttachments.idiGerenciaProcesAnexo;

					//Chama a factory-progress
					associativeProcessAttachmentsFactory.tipAnexoAssociativeProcessAttachments(_self.restriction,
						function (result) {
							if(result.$hasError == true){
								return;
							}
							_self.restrictionsList = result;
							
					});
				};

				$scope.$on('$viewContentLoaded', function(){
                    _self.init();
                });

                this.closeTipoAnexo = function () {
                	
		            $(' .restrictionDiv').slideToggle(); 
		        };

		        this.setTipoAnexo = function () {
		        	 $(' .restrictionDiv').slideToggle();
		        	
		        };

		        this.logAnexo = function () { 

		        	_self.cdnTipGravac = '';

		        };
		        
	}
	
	index.register.controller('hcg.associativeProcessAttachmentsMaintenance.Control', associativeProcessAttachmentsMaintenanceController);	
});