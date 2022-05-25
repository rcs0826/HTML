/**
/**
 * Controller de Detalhe da Tarefa
 */
taskDetailCtrl.$inject = [
    '$rootScope',	                          
    '$modalInstance',
    'model',
	'$stateParams',
	'$scope',
	'TOTVSEvent'];

function taskDetailCtrl ($rootScope,
		 				 $modalInstance,
						 model,
						 $stateParams,
						 $scope,
						 TOTVSEvent) {

	var taskDetailController = this;

	this.showLubrication = false;

	this.showPredictive = false;

	this.showCalibration = false;
	
	this.showAgglutination = false;

	this.showNarrative = false;

	this.showAcceptObservation = false;

	this.task = model;
  	
	this.closeOthers = false;
	
	var transaction = "";
	
	taskDetailController.showLaborReport = true;
	
	// *********************************************************************************
    // *** Function
    // *********************************************************************************

	/**
	 * Método de leitura do registro
	 */
	this.load = function() {
		taskDetailController.downloadUrl = '/dts/datasul-rest/resources/api/fch/fchmip/fchmiporder/downloadFile?filename=' + taskDetailController.task["cod-docto-anexo"];
		taskDetailController.downloadUrl = taskDetailController.downloadUrl.split("+").join("%2B");
		taskDetailController.downloadUrl = taskDetailController.downloadUrl.split("#").join("%23");
		taskDetailController.downloadUrl = taskDetailController.downloadUrl.split("&").join("%26");
	}

    // ação de fechar
    this.close = function () {
        $modalInstance.dismiss();
    }

    /**
     * Mostra os campos de lubrificação
     */
    this.openLubrication = function() {
    	taskDetailController.showLubrication = !taskDetailController.showLubrication;
    }

    /**
     * Mostra os campos de preditiva
     */
    this.openPredictive = function() {
    	taskDetailController.showPredictive = !taskDetailController.showPredictive;
    }

    /**
     * Mostra os campos de calibração
     */
    this.openCalibration = function() {
    	taskDetailController.showCalibration = !taskDetailController.showCalibration;
    }
    
    /**
     * Mostra os campos de aglutinação
     */
    this.openAgglutination = function() {
    	taskDetailController.showAgglutination = !taskDetailController.showAgglutination;
    }

    /**
     * Mostra narrativa
     */
    this.openNarrative = function() {
    	taskDetailController.showNarrative = !taskDetailController.showNarrative;
	}

    /**
     * Mostra Observação do Aceite
     */
    this.openAcceptObservation = function() {
    	taskDetailController.showAcceptObservation = !taskDetailController.showAcceptObservation;
	}
	

	// *********************************************************************************
	// *** Control Initialize
	// *********************************************************************************
		
	this.init = function() {
		taskDetailController.load();
	}
		
	// se o contexto da aplicação já carregou, inicializa a tela.
	if ($rootScope.currentuserLoaded) { taskDetailController.init(); }    
		
	// *********************************************************************************
	// *** Events Listners
	// *********************************************************************************
		
	// cria um listerner de evento para inicializar o taskEditControl somente depois de inicializar o contexto da aplicação.
	$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
		controller.init();
	});
}