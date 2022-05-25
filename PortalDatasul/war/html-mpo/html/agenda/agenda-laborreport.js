define(['index'], function(index) {
	
	/**
	 * Controller Detail
	 */
	agendaLaborReportCtrl.$inject = [
		'$rootScope',
		'$window',
		'$scope',
		'$stateParams', 
		'$state',
		'$filter',
		'$location',
		'totvs.app-main-view.Service',
		'fchmpo.fchmpoagenda.Factory',
		'fchmip.fchmip0066.Factory',
		'helperLaborReport',
		'TOTVSEvent'
	];
	
	function agendaLaborReportCtrl($rootScope,
							   $window,
							   $scope, 
							   $stateParams, 
							   $state,
							   $filter,
							   $location,
							   appViewService,
							   fchmpoagendaFactory,
							   fchmip0066Factory,
							   helperLaborReport,
							   TOTVSEvent) {

		/**
		* Variável Controller
		*/
		controller = this;
		
		/**
		 * Variáveis
		 */
		this.model = {}; // mantem o conteudo do registro em detalhamento
		
		this.listSelectTurnoAux = [];
		
		this.params = {};
		
		this.hifen = $rootScope.i18n('l-select-shift');
		
		this.model.narrativaTarefa = "";
				
		// *************************************************************************************
		// *** Functions
		// *************************************************************************************
		
		this.getListTurno = function(input){
			controller.listSelectTurno = $filter('filter')(controller.listSelectTurnoAux, {$:input});
		}	
		
	    this.selectTurno = function(){
	    	controller.hifen = " - ";	    	
	    }	   
		
	    // calcula o periodo
	    this.calculaPeriodo = function(){
	    	if (!controller.model.lEncerraTarefa){
		    	var hraNormal = 0;
		    	var hraExtra = 0;
		    	var tempoReal = 0;
		    	var hraTerm = 0;
		    	var hraIni = 0;
		    	var hraFimAux = 0;
		    	var hraIniAux = 0;
		    		    	
		    	if (controller.model.log1){
		    		
		    		hraNormal = String(controller.model.hraNormal).replace(",",".");
	              	hraExtra =  String(controller.model.hraExtra).replace(",","."); 
	              	
		    		if (hraNormal == "undefined" || hraNormal == "")
		    			hraNormal = "0";
		    			
	    			if (hraExtra == "undefined" || hraExtra == "")
	    				hraExtra = "0";
	    				
		    	} else {

			    	controller.model.hraFinal = controller.model.hraFinal.trim();
			    	controller.model.hraInicial = controller.model.hraInicial.trim();
			    	
			    	if (controller.model.hraInicial == "")
			    		controller.model.hraInicial = "00:00";
			    	
			    	if (controller.model.hraFinal == "")
			    		controller.model.hraFinal = "00:00";
			    	    	
			    	hraFimAux = controller.model.hraFinal.split(':');
					hraIniAux = controller.model.hraInicial.split(':');
			    	
			    	hraTerm = ((parseInt(hraFimAux[0]))+(parseInt(hraFimAux[1]))/60);
			    	hraIni = ((parseInt(hraIniAux[0]))+(parseInt(hraIniAux[1]))/60);
			    		    		    	
			    	if (hraTerm > hraIni){   			
			        
		        		if (controller.model.tipoHora == 1){            	
		        			hraNormal = hraTerm-hraIni;
		                  	hraExtra = 0;
		        		} else { 
			                hraNormal = 0;
			                hraExtra = hraTerm-hraIni;
		        		}
			    	}	    		
		    	}
		    	
		    	tempoReal = parseFloat(tempoReal) + parseFloat(hraNormal) + parseFloat(hraExtra);
		    	
	    		if (controller.model.tipoTempo == 1)
	    			controller.model.percentConclusao = (controller.model.conclusao + (tempoReal / (controller.model.tempo * controller.model.nrHomens)) * 100);
				else
					controller.model.percentConclusao = (controller.model.conclusao + (tempoReal / (controller.model.tempo / controller.model.nrHomens)) * 100);
	
				if (controller.model.percentConclusao > 100) 
					controller.model.percentConclusao = 100;
				else if (controller.model.percentConclusao < 0)
					controller.model.percentConclusao = 0;
				else if (isNaN(controller.model.percentConclusao))
					controller.model.percentConclusao = 0;
				
				controller.auxConclusao = parseFloat(controller.model.percentConclusao);
				controller.model.percentConclusao = String(parseFloat(controller.model.percentConclusao).toFixed(2)).replace(".",",");

	    	}									
	    }
	    
		this.selectedEncerraTarefa = function(){	
			if (controller.model.lEncerraTarefa){
				controller.model.percentConclusao = 100;
				controller.isDisablePercent = true;
			} else
				controller.isDisablePercent = false;
		}
				
		this.changeHraNormal = function(){
			
			controller.model.hraNormal = $filter('decimal')(controller.model.hraNormal);
			var hraNormal = String(controller.model.hraNormal).replace(",",".");
			var hraExtra = String(controller.model.hraExtra).replace(",",".");
			
			if (isNaN(parseFloat(hraNormal)))
				hraNormal = "0";	
			if (isNaN(parseFloat(hraExtra)))
				hraExtra = "0";
									
			controller.model.hraTot = String(parseFloat(hraNormal) + parseFloat(hraExtra)).replace(".",",");
			controller.changeHraTot();
		}
		
		this.changeHraExtra = function(){
			
			controller.model.hraExtra = $filter('decimal')(controller.model.hraExtra);
			var hraNormal = String(controller.model.hraNormal).replace(",",".");
			var hraExtra = String(controller.model.hraExtra).replace(",",".");
			
			if (isNaN(parseFloat(hraNormal)))
				hraNormal = "0";
			if (isNaN(parseFloat(hraExtra)))
				hraExtra = "0";
			
			controller.model.hraTot = String(parseFloat(hraNormal) + parseFloat(hraExtra)).replace(".",",");
			controller.changeHraTot();
		}
		
		// calcula o periodo caso o valor da hora total mude
		this.changeHraTot = function(){
			controller.calculaPeriodo();			
		}
		
		/**
		 * Método de leitura do registro
		 */	
	    this.load = function(params) {
	        this.model = {};
	        this.cdTecnico = params.cdTecnico;

	        // chama o servico para retornar o registro	        
	        fchmpoagendaFactory.getDetailAgendaAndShift(params, function(result){

	        	angular.forEach(result.ttDetailAgenda, function (value) {
	        		controller.model = value;
	        	});

	            controller.selectedTurno = {
	        		cdTurno: controller.model.cdTurno,
	        		descTurno: controller.model.descTurno
	    		}

	            controller.hifen = " - ";

	    		controller.isDisabled = false;
		    	controller.isHraInicial = true;
	    		controller.isHraFinal = true;
	    		controller.isHraNormal = false;
	    		controller.isHraExtra = false;
	    		controller.isHraTot = false;	
	    		controller.isSave = true;	    		        	

	        	if (controller.model.log1){
	        		controller.isHraInicial = true;
	        		controller.isHraFinal = true;
	        		controller.isHraNormal = false;
	        		controller.isHraExtra = false;
	        		controller.isHraTot = false;
			    	
	        	} else {
	        		
	        		controller.model.hraInicial = params.hraInicial;
		        	controller.model.hraFinal = params.hraFinal;    
		        	
			    	if (controller.model.hraInicial == "")
			    		controller.model.hraInicial = "00:00";
			    	
			    	if(controller.model.hraFinal == "")
			    		controller.model.hraFinal = "00:00";
			    	
			    	var fHraInicial = controller.model.hraInicial.split(':');
			    	var fHraFinal = controller.model.hraFinal.split(':');
			    	
			    	if (fHraInicial.length > 2)
			    		controller.model.hraInicial = fHraInicial[0] + ':' + fHraInicial[1];
			    	
			    	if (fHraFinal.length > 2)
			    		controller.model.hraFinal = fHraFinal[0] + ':' + fHraFinal[1];
	        		
	        		controller.isHraInicial = false;
	        		controller.isHraFinal = false;
	        		controller.isHraNormal = true;
	        		controller.isHraExtra = true;
	        		controller.isHraTot = true;	        		
	        	}
	        	controller.listSelectTurno = [];
	        	if (controller.listSelectTurnoAux.length > 0){
	        		controller.listSelectTurno = controller.listSelectTurnoAux;	        		
	        	}else{
	        		
			    	angular.forEach(result.ttListTurno, function (value){                    
	                    // adicionar o item na lista de resultado
	                	 controller.listSelectTurno.push(
	                			 {cdTurno: value.cdTurno.toString(), 
	                			  descTurno: value.descTurno});                	 
	                });		    	
	                controller.listSelectTurnoAux = controller.listSelectTurno;
	        	}
	        	
                controller.calculaPeriodo();	
	        });	        
	    };
	    // executa o filtro caso a hora inicial mude
	    this.changeHraInicial = function(){
	    	this.model.hraInicial = $filter('horaFilter')(this.model.hraInicial);	    	
	    };
	    // executa o filtro caso a hora final mude
	    this.changeHraFinal = function(){
	    	this.model.hraFinal = $filter('horaFilter')(this.model.hraFinal);
	    };
	    // executa o filtro caso o percentual de conclusão mude
	    this.changePercentConclusao = function(){
	    	this.model.percentConclusao = $filter('decimal')(this.model.percentConclusao);
	    };

	    // metodo que faz o apontamento
	    this.save = function(){

	    	var params = {};

	    	controller.model.hraInicial = controller.model.hraInicial.trim();
        	controller.model.hraFinal = controller.model.hraFinal.trim();    

	    	if (controller.model.hraInicial == "")
	    		controller.model.hraInicial = "00:00";

	    	if(controller.model.hraFinal == "")
	    		controller.model.hraFinal = "00:00";

	    	params = {
    			ttPointingInformationVO : {
					taskCode : controller.model.cdTarefa,
    				specialityType : controller.model.tpEspecial,
    				technicalCode : controller.cdTecnico,
    				transactionDate : controller.model.datAgenda,
    				initialHour : controller.model.hraInicial,
    				finishHour : controller.model.hraFinal,
					normalHours : parseFloat(controller.model.hraNormal),
					extraHours : parseFloat(controller.model.hraExtra),
					percentConclusion : parseFloat(controller.auxConclusao),  
					currentStatus : 1,
					orderNumber : controller.model.nrOrdem,
					turnCode : parseInt(controller.selectedTurno.cdTurno),
					reportDate : new Date().getTime(),
					realTime : 0,
					action : "1", //reporte=1; estorno=2
					costCenter : controller.model.scCodigo,
					isFinished : controller.model.lEncerraTarefa,
					pointingDuringInterval : controller.model.lApontaIntervalo,
					isGroupTechnical : controller.model.log1,
					sequencia: 1,
					subSystemCode : ""
    			},
    			narrativaTarefa : controller.model.narrativaTarefa    		
	    	}
	    	
	    	if (controller.model.narrativaTarefa == undefined)
	    		params.narrativaTarefa = "";	    	

	    	fchmip0066Factory.setLaborReport(params, function(result){
	    		
	    		if (!result.$hasError)
        			controller.notify(result);	    	
	    		
	    	});
	    }
	    	    
	    /**
	     * Método para notificar o usuário da gravação do registro com sucesso
	     */	    
	    this.notify = function(result) {

	        // redireciona a tela para a tela de detalhar
	        controller.redirectToDetail();

	        // notifica o usuario que conseguiu salvar o registro
	        $rootScope.$broadcast(TOTVSEvent.showNotification, {
	            type: 'success',
	            title: ($rootScope.i18n('l-attention')),
	            detail: ($rootScope.i18n('msg-labor-report-success'))
	        });
	    }
	    
	    /**
	     * Método para a ação de cancelar
	     */	    
	    this.cancel = function() {
	        // solicita que o usuario confirme o cancelamento da edição/inclusão
	        $rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question',
	            text: $rootScope.i18n('l-cancel-operation'),
	            cancelLabel: 'l-no',
	            confirmLabel: 'l-yes',
	            callback: function(isPositiveResult) {
	                if (isPositiveResult) { // se confirmou, navega para a pagina anterior
	                    $window.history.back();
	                }
	            }
	        });
	    }

	    this.back = function() {
	    	$location.path('dts/mpo/agenda');
	    }
	    
	    /**
	     * Redireciona para a tela de detalhar
	     */	    	    
	    this.redirectToDetail = function() {
	    	helperLaborReport.data.isDetalhe = 'sim';
	    	helperLaborReport.data.cdTurno = controller.selectedTurno.cdTurno;
	    	helperLaborReport.data.datAgenda = controller.model.datAgenda;
	    	helperLaborReport.data.hraInicial = controller.model.hraInicial;
	    	helperLaborReport.data.hraFinal = controller.model.hraFinal;
	        $location.path('dts/mpo/agenda/laborreport/');
	    }
	     
	    
		// *********************************************************************************
	    // *** Control Initialize
	    // *********************************************************************************
	     
	    this.init = function() {

	        if (appViewService.startView($rootScope.i18n('l-agenda-technician'), 'mpo.agenda.LaborReportCtrl', controller)) {             
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
	
	index.register.controller('mpo.agenda.LaborReportCtrl', agendaLaborReportCtrl);
	
});
