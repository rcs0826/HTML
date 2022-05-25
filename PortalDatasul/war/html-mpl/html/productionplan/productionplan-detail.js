define(['index'], function(index) {
	
	/**
	 * Controller Detail
	 */
	productionplanDetailCtrl.$inject = [
		'$rootScope', 
		'$scope',
		'$stateParams', 
		'$state',
		'totvs.app-main-view.Service',
		'mpl.boin318.Service',
		'fchman.fchmanproductionplan.Factory',
		'TOTVSEvent'
	];
	
	function productionplanDetailCtrl($rootScope, 
							   $scope, 
							   $stateParams, 
							   $state,
							   appViewService,
							   boin318Service,
							   fchmanproductionplanFactory,
							   TOTVSEvent) {

		/**
		* Variável Controller
		*/
		controller = this;
		
		/**
		 * Variáveis
		 */
		this.model = {}; // mantem o conteudo do registro em detalhamento
				
		// *************************************************************************************
		// *** Functions
		// *************************************************************************************
		
	    this.getRepressionDemandLegend = function(demand){
	    	
	        switch(demand){
	        	case '1' : 
	        		return $rootScope.i18n('l-yes');
	        	break;
	        	case '2' :
	        		return $rootScope.i18n('l-no');
	    		break;
	        	case '3' :
	        		return $rootScope.i18n('l-item');
	    		break;
	        }
	    }
	    
	    this.getReprogrammingLegend = function(reprog){
	    	
	    	switch(reprog){
	    		case 1 : 
	    			return $rootScope.i18n('l-anticipates-extending');
	    		break;
	    		case 2 :
	    			return $rootScope.i18n('l-extending');
	    		break;
	    		case 3 :
   	        		return $rootScope.i18n('l-anticipates');
   	        	break;
	    		case 4 :
	    			return $rootScope.i18n('l-not-reprograms');
				break;
	    	}
	    }
		
	    this.getPlanHorizFixLegend = function(plan){
	    	
	    	switch(plan){
	    		case '1' :
    				return $rootScope.i18n('l-planned');
				break;
	    		case '2' :
	                return $rootScope.i18n('l-no-plan-fixed-horizon');
                break;
	    		case '3' :
	                return $rootScope.i18n('l-not-planned-horizon-release');
                break;
	    	}
	    }
	    
    	this.getTypePlanLegend = function(type){
			switch(type){
				case '1' :
					return "PV";
				break;
				case '2' :
					return "PP";
				break;
			}
    	}
	    
	    
	    /**
	     * Método para a ação de remover
	     */		
	    this.onRemove = function() {
	        // envia um evento para perguntar ao usuário
	        $rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question', // titlo da mensagem
	            text: $rootScope.i18n('l-confirm-delete-operation'), // texto da mensagem
	            cancelLabel: 'l-no', // label do botão cancelar
	            confirmLabel: 'l-yes', // label do botão confirmar
	            callback: function(isPositiveResult) { // função de retorno
	                if (isPositiveResult) { // se foi clicado o botão confirmar
	                     
	                	var ttProductionPlanSummary = [];
	                	
	                    // chama o metodo de remover registro do service
	                	fchmanproductionplanFactory.getProductionPlanPortletSummary(controller.model.planCode, function(result){
	                        if (result) {
	                        	ttProductionPlanSummary = result[0];
	                        	console.log(ttProductionPlanSummary);
	                			ttProductionPlanSummary.isSelected = true;
	                			fchmanproductionplanFactory.removeProductionPlan(ttProductionPlanSummary, function(result){	    	                    	
	    	                    	if (result) {
			                            // notifica o usuario que o registro foi removido
			                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
			                                type: 'success', // tipo de notificação
			                                title: $rootScope.i18n('msg-item-deleted'), // titulo da notificação
			                                detail: $rootScope.i18n('msg-success-deleted') // detalhe da notificação
			                            });
			                            // muda o state da tela para o state inicial, que é a lista
			                            $state.go('dts/mpl/productionplan.start');
	    	                    	}
	                			});
	                        }
	                    });
	                }
	            }
	        });
	    }
		
		/**
		 * Método de leitura do registro
		 */		
	    this.load = function(id) {
	        this.model = {};
	        // chama o servico para retornar o registro
	        
	        //boin318Service.getRecord(id, function(record){
	        fchmanproductionplanFactory.getProductionPlanDetail(id, function(record){
	            if (record) { // se houve retorno, carrega no model
	                controller.model = record[0];
	            }              
	        });	        
	    }
	    
		this.traduzLog = function(inputLog){
			if (inputLog)
				return $rootScope.i18n('l-yes');
			else
				return $rootScope.i18n('l-no');
		}
		
		this.getGlypLog = function(value){
			var item = $(this);
			if (value)
				return "text-success glyphicon glyphicon-ok"
			else
				return "text-danger glyphicon glyphicon-remove"
		}
	    
	    this.getDia = function(tipo){
	    	switch (tipo){
	    		case 3 :
	    			return "7";
	    		case 2 :
	    			return "15";
	    		case 1 :
	    			return "30";	    	
	    	}	    	
	    	return "";
	    }
	    
	    this.getPlanoAtivo = function(plEstado) {
	    	if (plEstado == 1)
	    		return $rootScope.i18n('l-yes');
    		else 
    			return $rootScope.i18n('l-no');
	    	
	    }
	    
		// *********************************************************************************
	    // *** Control Initialize
	    // *********************************************************************************
	     
	    this.init = function() {
	     
	        if (appViewService.startView($rootScope.i18n('l-production-plan'), 'mpl.productionplan.DetailCtrl', controller)) {             
	            // se é a abertura da tab, implementar aqui inicialização do controller
	        }
	        // se houver parametros na URL
	        if ($stateParams && $stateParams.id) {
	            // realiza a busca de dados inicial
	            this.load($stateParams.id);
	        }
	    }
	     
	    // se o contexto da aplicação já carregou, inicializa a tela.
	    if ($rootScope.currentuserLoaded) { this.init(); }
	     
	    // *********************************************************************************
	    // *** Events Listeners
	    // *********************************************************************************
	     
	    // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
	    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
	        controller.init();
	    });
								
	}
	
	index.register.controller('mpl.productionplan.DetailCtrl', productionplanDetailCtrl);
	
});
