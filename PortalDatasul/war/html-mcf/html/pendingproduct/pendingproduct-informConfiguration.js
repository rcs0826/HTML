define(['index',
        '/dts/mcf/js/zoom/cot-est-mast.js',
		'/dts/mcf/js/dbo/bomf067.js',
		'/dts/mcf/js/api/cfp/cfapi004.js'],function (index) { 
	
	modalInformConfiguration.$inject = ['$modal'];
    
    function modalInformConfiguration($modal) {
        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/mcf/html/pendingproduct/pendingproduct.informConfiguration.html',
                controller: 'mcf.pendingproduct.informConfiguration.ctrl as controller',
                backdrop: 'static',
                keyboard: false,
                resolve: { parameters: function () { return params; } }
            });
            return instance.result;
        }
    } 

    informConfigurationCtrl.$inject = ['parameters', 
                                       '$modalInstance', 
									   '$rootScope',
									   'cfapi004.Factory', /*Api de integracao com o produto*/
									   'mcf.pendingproduct.NewConfiguration.modal'
									   ];
    
    function informConfigurationCtrl(parameters, $modalInstance, $rootScope, cfapi004, modalNewCFG) {
    	
    	self = this;
    	
    	self.config            = angular.copy(parameters);
    	self.config.tipo       = "1"
    	self.config.observacao = self.config.sequencia + '/' + self.config.nrPedido + '/' + self.config.nomeAbrev
			
    	this.close = function () { 	        
 	        $modalInstance.dismiss();
 	    }
    	
    	this.confirm = function (){
    				
			switch (self.config.tipo) {
				case "1": // Configurar Agora

					cfapi004.confirmConfiguration(self.config, function(result) {
						if (!result.$hasError){    
							
    						modalNewCFG.open({pItemCotacao:self.config.itemCotacao, pNumCFG:result[0].nrEstrut, pTpProcess:"Leon-New"}).then(function(result){
    							self.config.nrEstrut = result;
    							cfapi004.createCotRelat(self.config, function(result){
    								$modalInstance.close(self.config);
    							});    								    						
							});
	    				}	    				
					});

					break;
					
				case "2": // Deixar pendente - vai criar cot-pend
					
					cfapi004.confirmConfiguration(self.config, function(result){
						if (!result.$hasError){    
								self.config.nrEstrut = result[0].nrEstrut
								$modalInstance.close(self.config);
						}
					});
						
					break;
	    			
				case "3": // Nao deixar pendente - selecionar uma configuracao que ja existe
					
					// Verifica se nao informada existe
					cfapi004.validConfiguration(self.config, function(result){
						if (!result.$hasError){    
							$modalInstance.close(self.config);
						}
					});
					
					break;
			}    			
    	}
    }

    index.register.controller('mcf.pendingproduct.informConfiguration.ctrl', informConfigurationCtrl);
    index.register.service('mcf.pendingproduct.informConfiguration.modal', modalInformConfiguration);    
});