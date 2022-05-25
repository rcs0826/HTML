/**
 * LaborReportCtrl
 */
laborReportCtrl.$inject = [
	'$rootScope',
	'$scope',
	'$modalInstance', 
	'$filter',
    'model',
    'fchmip.fchmip0066.Factory',
    'fchmip.fchmiporder.Factory',
    'TOTVSEvent'
];

function laborReportCtrl ($rootScope,
						  $scope,						  
						  $modalInstance, 
						  $filter,
						  model,
						  fchmip0066Factory,
						  fchmiporderFactory,
						  TOTVSEvent) {

	var laborController = this;

    this.closeOther = false;
    $scope.oneAtATime = true;
    
    $scope.status = {
	    isFirstOpen: true,
	    isFirstDisabled: false
    };

	this.taskReport       	 = model;
    this.listOfTechnician 	 = [];
    this.userTechnician   	 = {};
    this.listOfTechnicianAux = [];
    this.dadosSpecialty      = [];
    this.dadosSpecialtyAux   = [];

    this.cdTecnico  = "";
    this.specialty  = "";
    this.startDate  = "";
    this.narrativa  = null;
    this.hifen		= "";

    this.hraInicial    = "00:00";
    this.hraFinal	   = "00:00";

	this.normalHours   = 0;
	this.extraHours	   = 0;
	this.hraTot        = undefined;

	this.isDisabled    = false;
	this.isHraInicial  = true;
	this.isHraFinal    = true;
	this.isHraNormal   = false;
	this.isHraExtra    = false;
	this.isHraTot 	   = false;	
	this.isSave 	   = true;	    		        	

    this.percentConclu = undefined;

    this.lEncerraTask 	  = false;
    this.lApontaIntervalo = false;
    this.lApontaPeriodo   = false;

    var today  = new Date().getTime();
	var params = {'nrOrdem': this.taskReport['nr-ord-produ'],
				  'cdTarefa': this.taskReport['cd-tarefa']};

    laborController.startDate = today;
    laborController.periodo = {startDate:today, endDate:today};

    fchmiporderFactory.getTecnicoDados(params, function(result){

        if (result) {
        	angular.forEach(result.ttListTecnico, function (value) {

        		laborController.listOfTechnician.push(value);

        		laborController.listOfTechnicianAux = laborController.listOfTechnician;
            });
        }

        /* se existe um tecnico para o usuario, filtra ele dentro da lista e posiciona no select */
    	if (result.cdTecnicoUsuario != ""){

    		laborController.cdTecnico = result.cdTecnicoUsuario;
    		laborController.hifen = " - ";
 	    	laborController.userTechnician = laborController.listOfTechnician.filter(function(e) { return e.cdTecnico == laborController.cdTecnico;});
 	    	laborController.userTechnician = {cdTecnico: laborController.userTechnician[0].cdTecnico,
 	    								      nomeCompl: laborController.userTechnician[0].nomeCompl,
 	    								      isGroup: laborController.userTechnician[0].isGroup};

			laborController.buscaDados();
		}
		
    	if (result.tpEspecialidade != ""){
    		laborController.specialty  = result.tpEspecialidade;
    	}
    	if (result.cdTurno != ""){
 	    	laborController.shift     = result.cdTurno;
    	}

        if (result.ttDetalheApont.length > 0){

        	laborController.dadosSpecialty = result.ttDetalheApont;

        	laborController.specialtyAux = laborController.specialty.toLowerCase();

			laborController.dadosSpecialtyAux = laborController.dadosSpecialty.filter(function(e) { return e.tpEspecial.toLowerCase() == laborController.specialtyAux;});

			if(laborController.dadosSpecialtyAux.length > 0){
	    		laborController.tipoTempo = laborController.dadosSpecialtyAux[0].tipoTempo;
	    		laborController.conclusao = laborController.dadosSpecialtyAux[0].conclusao;
				laborController.nrHomens  = laborController.dadosSpecialtyAux[0].nrHomens;
	    		laborController.tempo     = laborController.dadosSpecialtyAux[0].tempo;
			}

        }

    });

	this.validaCalculoPercent = function(){
		
		if  (!laborController.specialty == null) {
			laborController.regraPercentual = true;

			laborController.specialtyAux = laborController.specialty.toLowerCase();

			laborController.dadosSpecialtyAux = laborController.dadosSpecialty.filter(function(e) { return e.tpEspecial.toLowerCase() == laborController.specialtyAux;});

			if(laborController.dadosSpecialtyAux.length == 0){

				laborController.regraPercentual = false;
			}
		}
	}

    this.buscaDados = function(){

		var params = {'nrOrdem': laborController.taskReport['nr-ord-produ'],
			  	  'cdTarefa': laborController.taskReport['cd-tarefa'],
			  	  'cdTecnico': laborController.userTechnician.cdTecnico};

	    fchmiporderFactory.getDadosApontamento(params, function(result){

	    	laborController.percentConclu = "";	
	    	laborController.hifen 	  	 = " - ";
			laborController.specialty  	 = result.tpEspecialidade;
			laborController.shift      	 = result.cdTurno;
			laborController.costCenter   = result.centroCusto;

			if (result.ttDetalheApont.length > 0){

          	laborController.dadosSpecialty = result.ttDetalheApont;

          	laborController.specialtyAux = laborController.specialty.toLowerCase();

				laborController.dadosSpecialtyAux = laborController.dadosSpecialty.filter(function(e) { return e.tpEspecial.toLowerCase() == laborController.specialtyAux;});

				if(laborController.dadosSpecialtyAux.length > 0){

		 	    	laborController.tipoTempo = laborController.dadosSpecialtyAux[0].tipoTempo;
		 	    	laborController.conclusao = laborController.dadosSpecialtyAux[0].conclusao;
		 	    	laborController.nrHomens  = laborController.dadosSpecialtyAux[0].nrHomens;
		 	    	laborController.tempo     = laborController.dadosSpecialtyAux[0].tempo;
	 	    	}
	    	}

	    	laborController.validaGrupoTecnico();
	    });
    };

	this.changeHraNormal = function(){

		laborController.normalHours = $filter('decimal')(laborController.normalHours);
		var hraNormal = String(laborController.normalHours).replace(",",".");
		var hraExtra = String(laborController.extraHours).replace(",",".");
		
		if (isNaN(parseFloat(hraNormal)))
			hraNormal = "0";	
		if (isNaN(parseFloat(hraExtra)))
			hraExtra = "0";
								
		laborController.hraTot = String(parseFloat(hraNormal) + parseFloat(hraExtra)).replace(".",",");
		laborController.hraTot = laborController.hraTot.replace(",",".");
		laborController.hraTot = parseFloat(laborController.hraTot).toFixed(4);
		laborController.hraTot = laborController.hraTot.replace(".",",");
	}
	
	this.changeHraExtra = function(){
		
		laborController.extraHours = $filter('decimal')(laborController.extraHours);
		var hraNormal = String(laborController.normalHours).replace(",",".");
		var hraExtra = String(laborController.extraHours).replace(",",".");
		
		if (isNaN(parseFloat(hraNormal)))
			hraNormal = "0";
		if (isNaN(parseFloat(hraExtra)))
			hraExtra = "0";
		
		laborController.hraTot = String(parseFloat(hraNormal) + parseFloat(hraExtra)).replace(".",",");
		laborController.hraTot = laborController.hraTot.replace(",",".");
		laborController.hraTot = parseFloat(laborController.hraTot).toFixed(4);
		laborController.hraTot = laborController.hraTot.replace(".",",");
	}

    this.calculaPeriodo = function(){

    	laborController.hraInicial = laborController.hraInicial.replace(":","");
    	laborController.hraFinal   = laborController.hraFinal.replace(":","");

    	var i = laborController.hraInicial.length;

    	while(i < 4){
    		laborController.hraInicial = laborController.hraInicial + "0";
    		i++;
    	}

    	i = laborController.hraFinal.length;

    	while(i < 4){
    		laborController.hraFinal = laborController.hraFinal + "0";
    		i++;
    	}

    	laborController.hraInicial = $filter('timeMask')(laborController.hraInicial);
    	laborController.hraFinal   = $filter('timeMask')(laborController.hraFinal);

		if  (!laborController.specialty == null) {
	    	
	    	laborController.specialtyAux = laborController.specialty.toLowerCase();

			laborController.dadosSpecialtyAux = laborController.dadosSpecialty.filter(function(e) { return e.tpEspecial.toLowerCase() == laborController.specialtyAux;});
		}

		if(laborController.dadosSpecialtyAux.length > 0){

 	    	laborController.tipoTempo = laborController.dadosSpecialtyAux[0].tipoTempo;
 	    	laborController.conclusao = laborController.dadosSpecialtyAux[0].conclusao;
 	    	laborController.nrHomens  = laborController.dadosSpecialtyAux[0].nrHomens;
 	    	laborController.tempo     = laborController.dadosSpecialtyAux[0].tempo;
		}else{
			laborController.regraPercentual = false;
		}

		if(laborController.regraPercentual == true){

	    	if (!laborController.lEncerraTask){

		    	var hraNormal = 0;
		    	var hraExtra = 0;
		    	var tempoReal = 0;
		    	var hraTerm = 0;
		    	var hraIni = 0;
		    	var hraFimAux = 0; 
		    	var hraIniAux = 0;

		    	if (laborController.userTechnician.isGroup){

		    		hraNormal = String(laborController.normalHours).replace(",",".");
	              	hraExtra =  String(laborController.extraHours).replace(",","."); 
	              	
		    		if (hraNormal == "undefined" || hraNormal == "")
		    			hraNormal = "0";
		    			
	    			if (hraExtra == "undefined" || hraExtra == "")
	    				hraExtra = "0";

		    	} else {

			    	laborController.hraFinal = laborController.hraFinal.trim();
			    	laborController.hraInicial = laborController.hraInicial.trim();
			    	
			    	if (laborController.hraInicial == "")
			    		laborController.hraInicial = "00:00";
			    	
			    	if (laborController.hraFinal == "")
			    		laborController.hraFinal = "00:00";
			    	    	
			    	hraFimAux = laborController.hraFinal.split(':');
					hraIniAux = laborController.hraInicial.split(':');
			    	
			    	hraTerm = ((parseInt(hraFimAux[0]))+(parseInt(hraFimAux[1]))/60);
			    	hraIni = ((parseInt(hraIniAux[0]))+(parseInt(hraIniAux[1]))/60);

			    		    		    	
			    	if (hraTerm > hraIni){   
			        
		        		if (laborController.tipoHora == 1){            	
		        			hraNormal = hraTerm-hraIni;
		                  	hraExtra = 0;
		        		} else { 
			                hraNormal = 0;
			                hraExtra = hraTerm-hraIni;
		        		}
			    	}	    		
		    	}

		    	tempoReal = parseFloat(tempoReal) + parseFloat(hraNormal) + parseFloat(hraExtra);
		    	
	    		if (laborController.tipoTempo == 1)
	    			laborController.percentConclu = (laborController.conclusao + (tempoReal / (laborController.tempo * laborController.nrHomens)) * 100);
				else
					laborController.percentConclu = (laborController.conclusao + (tempoReal / (laborController.tempo / laborController.nrHomens)) * 100);
	
				if (laborController.percentConclu > 100) 
					laborController.percentConclu = 100;
				else if (laborController.percentConclu < 0)
					laborController.percentConclu = 100;						
				else if (isNaN(laborController.percentConclu))
					laborController.percentConclu = 100;						

				laborController.auxConclusao = parseFloat(laborController.percentConclu);
				laborController.percentConclu = String(parseFloat(laborController.percentConclu).toFixed(2)).replace(".",",");

	    	}


		}else{
			laborController.percentConclu = "100,00";
		}
    	
    }

    this.validaGrupoTecnico = function(){

		/* Faz o tratamento se o tecnico representa ou não um grupo de tecnicos */
    	if (laborController.userTechnician.isGroup == true){

    		laborController.isHraInicial = true;
    		laborController.isHraFinal = true;
    		laborController.isHraNormal = false;
    		laborController.isHraExtra = false;
    		laborController.isHraTot = false;
	    	
    	} else {
    		
	    	if (laborController.hraInicial == "")
	    		laborController.hraInicial = "00:00";
	    	
	    	if(laborController.hraFinal == "")
	    		laborController.hraFinal = "00:00";
	    	
	    	var fHraInicial = laborController.hraInicial.split(':');
	    	var fHraFinal = laborController.hraFinal.split(':');
	    	
	    	if (fHraInicial.length > 2)
	    		laborController.hraInicial = fHraInicial[0] + ':' + fHraInicial[1];
	    	
	    	if (fHraFinal.length > 2)
	    		laborController.hraFinal = fHraFinal[0] + ':' + fHraFinal[1];
    		
    		laborController.isHraInicial = false;
    		laborController.isHraFinal = false;
    		laborController.isHraNormal = true;
    		laborController.isHraExtra = true;
    		laborController.isHraTot = true;	        		
    	}

    	laborController.calculaPeriodo();
    }

    this.isInvalidForm = function() {
         
        var messages = [];
        var isInvalidForm = false;
         
        if (!this.userTechnician || this.userTechnician.length === 0) {
            isInvalidForm = true;
            messages.push('l-technician');
        }
         
        if (!this.specialty || this.specialty.length === 0) {
            isInvalidForm = true;
            messages.push('l-specialty');
        }

        if (!this.shift || this.shift.length === 0) {
            isInvalidForm = true;
            messages.push('l-shift');
        }
        
        if (this.lApontaPeriodo) {
	        if (!this.periodo || !this.periodo.startDate || !this.periodo.endDate) {
	            isInvalidForm = true;
	            messages.push('l-date');
	        }
        }
         
        if (isInvalidForm) {
            var warning = $rootScope.i18n('l-field');
            if (messages.length > 1) {
                warning = $rootScope.i18n('l-fields');
            }
            angular.forEach(messages, function(item) {
                warning = warning + ' ' + $rootScope.i18n(item) + ',';
            });
            if (messages.length > 1) {
                warning = warning + ' ' + $rootScope.i18n('l-requireds-2');
            } else {
                warning = warning + ' ' + $rootScope.i18n('l-required-mce');
            }
            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type: 'error',
                title: $rootScope.i18n('l-attention'),
                detail: warning
            });
        }
         
        return isInvalidForm;
    }

	this.posicionaTecnico = function(param){

		if (param == laborController.userTechnician.cdTecnico){
			return true;
		}
		else{
			return false;
		}
	};

	this.filterTechnician = function(input){

		laborController.listOfTechnician = $filter('filter')(laborController.listOfTechnicianAux, {$:input});
	}		

	this.timeMask = function(value, param){

		if(param == 1){
			laborController.hraInicial = $filter('timeMask')(value);
		}else{
			laborController.hraFinal = $filter('timeMask')(value);
		}
	}

	this.setPercent = function(){

		if(!laborController.percentConclu || laborController.percentConclu == "0,00"){
			laborController.percentConclu = "100,00";
		}
	}

	this.percentMask = function(value){
		laborController.percentConclu = $filter('percentMask')(value);
	}

	this.save = function(again){

        if (this.isInvalidForm()) {
            return;
        }

		var params = {};

		laborController.normalHours = String(laborController.normalHours);
		laborController.extraHours = String(laborController.extraHours);
		laborController.normalHours = laborController.normalHours.replace(',','.');
		laborController.extraHours  = laborController.extraHours.replace(',','.');

    	params = {
			ttPointingInformationVO : {
				taskCode : laborController.taskReport['cd-tarefa'],
				specialityType : laborController.specialty,
				technicalCode : laborController.userTechnician.cdTecnico,
				transactionDate : new Date(laborController.startDate).getTime(),
				initialHour : laborController.hraInicial,
				finishHour : laborController.hraFinal,
				normalHours : laborController.normalHours == undefined ? 0 : parseFloat(laborController.normalHours),
				extraHours : laborController.extraHours == undefined ? 0 : parseFloat(laborController.extraHours),
				percentConclusion : parseFloat(laborController.percentConclu),
				currentStatus : 1,
				orderNumber : laborController.taskReport['nr-ord-produ'],
				turnCode : parseInt(laborController.shift),
				reportDate : new Date().getTime(),
				action : "1", //reporte=1; estorno=2
				costCenter : laborController.costCenter,
				isFinished : laborController.lEncerraTask,
				pointingDuringInterval : laborController.lApontaIntervalo,
				isGroupTechnical : laborController.userTechnician.isGroup,
				sequencia: 1,
				subSystemCode : "",
				isPeriod : laborController.lApontaPeriodo,
				startDate : laborController.lApontaPeriodo ? laborController.periodo.startDate : undefined,
				endDate : laborController.lApontaPeriodo ? laborController.periodo.endDate : undefined		
			},
			narrativaTarefa : laborController.narrativa
		};

		params.ttPointingInformationVO.realTime = parseFloat(params.ttPointingInformationVO.normalHours) + parseFloat(params.ttPointingInformationVO.extraHours);

		if (params.ttPointingInformationVO.isGroupTechnical && params.ttPointingInformationVO.realTime <= 0) {
			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'error',
				title: ($rootScope.i18n('l-labor-report')),
				detail: ($rootScope.i18n('msg-hours-amount-zero'))
			});			
			return;
		}

 	    fchmip0066Factory.setLaborReport(params, function(result){

    		if (!result.$hasError){

				model['_']['des-estado']   = result.descEstaTaref;
				
				laborController.taskReport.estadoOrdem 	   = result.estadoOrdem;
				laborController.taskReport.descEstadoOrdem = result.descEstadoOrdem;
				laborController.taskReport.situacaoOrdem   = result.situacaoOrdem;
				laborController.taskReport.descSituacao    = result.descSituacao;
				laborController.taskReport.estadoTarefa    = result.estadoTarefa;

				if(again === false){
					laborController.close();	
				}else{
					laborController.normalHours 	 = "0";
					laborController.extraHours  	 = "0";
					laborController.hraInicial  	 = "00:00";
					laborController.hraFinal    	 = "00:00";
					laborController.hraTot      	 = "0,0000";
				}

		        // notifica o usuario que conseguiu salvar o registro
		        $rootScope.$broadcast(TOTVSEvent.showNotification, {
		            type: 'success',
		            title: ($rootScope.i18n('l-labor-report')),
		            detail: ($rootScope.i18n('msg-labor-report-success'))
		        });
    		}
 	    });
	}

    this.close = function () {
        $modalInstance.close();
    }

	$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {	 
	    $modalInstance.dismiss('cancel');
	});

}