define(['index'], function(index) {
	
	/**
	 * Controller Modal Necessidades
	 */
	
	SetSiteCtrl.$inject = ['$modalInstance',
	                       '$rootScope',
	                       'model',
		                   'fchman.fchmanproductionplan.Factory',
		                   'TOTVSEvent'];
    
    function SetSiteCtrl ($modalInstance,
                          $rootScope,
                          model,
                          fchmanproductionplanFactory,
                          TOTVSEvent) {
        
        var controller = this;
    	
        // recebe os dados de pesquisa atuais e coloca no controller
        this.model = model;
        this.isOpen = true;
        
        this.planCode = controller.model.planCode;
        this.planDescription = controller.model.planDescription;
        
        this.listOfSites = [];
        
        /* Função....: getSites
           Descrição.: ação de clicar no botão salvar
           Parâmetros:  */
        this.getSites = function () {
            fchmanproductionplanFactory.getProductionPlanSites(controller.planCode, function(result) {
                if (result) {
                    // para cada item do result
                    angular.forEach(result, function (value) {
                        // adicionar o item na lista de resultado
                        controller.listOfSites.push({'$selected': value.isSelectedSite,
                                                     'isSelectedSite': value.isSelectedSite,
                                                     'siteCode': value.siteCode,
                                                     'siteDescription': value.siteDescription});
                    });
                }
            });
        };
        
        // Inicializa a lista de estabelecimentos
        controller.getSites();
        
        /* Função....: save
           Descrição.: ação de clicar no botão salvar
           Parâmetros:  */
        this.save = function () {
            // Atualiza o campo isSelectedSite com o que foi selecionado na tela
            angular.forEach(controller.listOfSites, function (value) {
                var index = controller.listOfSites.indexOf(value);
                
                controller.listOfSites[index] = {'isSelectedSite': value.$selected,
                                                 'siteCode': value.siteCode,
                                                 'siteDescription': value.siteDescription};
            });
            
            var parameters = {
                ttProductionPlanSitesVO: controller.listOfSites,
                planCode: controller.planCode
            };
            
            fchmanproductionplanFactory.setProductionPlanSites(parameters, function(result) {
                if (result) {
                    if (!result['$hasError']) {
                        // notifica o usuario os estabelecimentos foram atualizados
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'success', // tipo de notificação
                            title: $rootScope.i18n('msg-site-updated'), // titulo da notificação
                            detail: $rootScope.i18n('msg-success-updated-site') // detalhe da notificação
                        });
                        
                        // fecha a janela
                        $modalInstance.close();
                    }
                }
            });
        };
        
        /* Função....: close
           Descrição.: ação de clicar no botão fechar
           Parâmetros:  */
        this.close = function () {
            // dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
            $modalInstance.dismiss();
        };
    };
    
    index.register.controller('mpl.productionplanitem.SetSiteCtrl', SetSiteCtrl);
});