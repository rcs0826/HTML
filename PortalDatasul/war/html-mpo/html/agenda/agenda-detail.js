define(['index'], function(index) {
	
	/**
	 * Controller Detail
	 */
	agendaDetailCtrl.$inject = [
		'$rootScope', 
		'$scope',
		'$stateParams', 
		'$state',
		'$location',
		'$modal',
		'totvs.app-main-view.Service',
		'fchmpo.fchmpoagenda.Factory',
		'helperLaborReport',
		'TOTVSEvent'
	];
	
	function agendaDetailCtrl($rootScope, 
							   $scope, 
							   $stateParams, 
							   $state,
							   $location,
							   $modal,
							   appViewService,
							   fchmpoagendaFactory,
							   helperLaborReport,
							   TOTVSEvent) {

		/**
		* Variável Controller
		*/
		controller = this;
		
		controller.paramDetailLaborReport = {};	// objeto usado para armazenar parâmetros da tela de consulta dos apontamentos
		
		/**
		 * Variáveis
		 */
		this.model = {}; // mantem o conteudo do registro em detalhamento
				
		// *************************************************************************************
		// *** Functions
		// *************************************************************************************
	    
		/**
		 * Método de leitura do registro
		 */		
	    this.load = function(params) {
	        this.model = {};
	        this.cdTecnico = params.cdTecnico;

	        // chama o servico para retornar o registro	        
	        fchmpoagendaFactory.getDetailAgenda(params, function(result){

	          	angular.forEach(result, function (value) {
	        		controller.model = value;
	        	});
	          	
	        	switch(controller.model.situacao){
	        		case 1 :
	        			controller.model.situacao = $rootScope.i18n("l-in-day");
        			break;
	        		case 2 :
	        			controller.model.situacao = $rootScope.i18n("l-late");
        			break;
	        		case 3 :
	        			controller.model.situacao = $rootScope.i18n("l-finished");
        			break;        	
	        	}     	
	        	controller.model.datAgenda = params.datAgenda;
	        	controller.model.hraFinal = params.hraFinal;
		    	controller.model.hraInicial = params.hraInicial;	 

		    	if (controller.model.hraInicial == "")
		    		controller.model.hraInicial = "00:00";

		    	if (controller.model.hraFinal == "")
		    		controller.model.hraFinal = "00:00";

		    	var fHraInicial = controller.model.hraInicial.split(':');
		    	var fHraFinal = controller.model.hraFinal.split(':');

		    	if (fHraInicial.length > 2)
		    		controller.model.hraInicial = fHraInicial[0] + ':' + fHraInicial[1];

		    	if (fHraFinal.length > 2)
		    		controller.model.hraFinal = fHraFinal[0] + ':' + fHraFinal[1];
		    	
	        });	     
	        
	    }	  
	    
	    /**
		 * Abertura da tela de consulta do Apontamento
		 */
	    this.openDetailLaborReport = function() {
	    	
	    	controller.paramDetailLaborReport = {
	    			nrOrdManut: helperLaborReport.data.nrOrdem,
	    			initialTask : helperLaborReport.data.cdTarefa,
    				finalTask : helperLaborReport.data.cdTarefa,        
    				initialSpeciality : helperLaborReport.data.tpEspecial,        
    				finalSpeciality : helperLaborReport.data.tpEspecial,                  
    				initialPointingCostCenter : helperLaborReport.data.scCodigo,   
    				finalPointingCostCenter : helperLaborReport.data.scCodigo,                    
    				showNotStartedTasks : true,            
    				showStartedTasks : true,                 
    				showStoppedTasks : true,                 
    				showFinishedTasks : true,                
    				showClusteredTasks : true,
    				showClosedTasks : true    			    
	    	}
	    	
    		var modalInstance = $modal.open({
	        	templateUrl: '/dts/mpo/html/agenda/agenda.detail.laborreport.html',
	        	controller: 'mpo.agenda.DetailLaborReportCtrl as controller',
	        	size: 'lg',
	        	resolve: {
	        		model: function () {
	        			//passa o objeto com os dados da pesquisa avançada para o modal	  
	        			
	        			return controller.paramDetailLaborReport;
	        			
	        		}	        	        	
	        	}
	        });	        	       
	        
	        // quando o usuario clicar em pesquisar:
	        modalInstance.result.then(function () {	        	
	            // e chama o busca dos dados
	        });
	    }

		this.setParamAponta = function(){	
			$location.path('dts/mpo/agenda/laborreport/');			
		}
		
		// Valida se o usuario corrente é tecnico, planejador ou gerente
		this.isAponta = function(pTecnico, pSituacao){
			
			if (pSituacao == 3)
				return false;
			
			if (helperLaborReport.data.isPlanejador == false){
				if (helperLaborReport.data.infoCdTecnico != ""){
					if (pTecnico == helperLaborReport.data.infoCdTecnico)
						return true; 
				}
				return false;
			}			
			return true;
		}
	    
		// *********************************************************************************
	    // *** Control Initialize
	    // *********************************************************************************
	     
	    this.init = function() {
	     
	        if (appViewService.startView($rootScope.i18n('l-agenda-technician'), 'mpo.agenda.DetailCtrl', controller)) {             
	            // se é a abertura da tab, implementar aqui inicialização do controller
	        }

	        // se houver parametros na URL
	        if (helperLaborReport) { 	
	            // realiza a busca de dados inicial	        	
	            this.load(helperLaborReport.data);
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
	
	index.register.controller('mpo.agenda.DetailCtrl', agendaDetailCtrl);
	
});
