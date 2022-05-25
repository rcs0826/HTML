/**
 * shiftController
 */
trainingEditController.$inject = [
    '$rootScope',	         
	'$scope',
	'TOTVSEvent',
    '$modalInstance',
    'fchmab.fchmabemployee.Factory',
    '$stateParams'
];

function trainingEditController($rootScope, 
    							$scope,
    							TOTVSEvent,
                                $modalInstance,
                                fchmabemployeeFactory,
                                $stateParams) {

    var trainingEditCtrl = this;
    
    trainingEditCtrl.treinamentos = [];
    trainingEditCtrl.id           = {"epCodigo": $stateParams.epCodigo,
                                     "codEstabel": $stateParams.codEstabel,
                                     "codMatr": $stateParams.codMatr};
	
	// *********************************************************************************
    // *** Funções
    // *********************************************************************************
    
	trainingEditCtrl.init = function() {
		trainingEditCtrl.totalRecords = 0;
		trainingEditCtrl.treinamentos = [];
		trainingEditCtrl.buscaTreinamentos(false);
    }
	
	trainingEditCtrl.buscaTreinamentos = function(isMore) {
		if (isMore) {
			var startAt = trainingEditCtrl.treinamentos.length;

			for (count = startAt; count < startAt + 50; count++) {
				trainingEditCtrl.treinamentos.push(trainingEditCtrl.resultList[count]);
				if (trainingEditCtrl.treinamentos.length === trainingEditCtrl.totalRecords) break;
			}			
		} else {
			fchmabemployeeFactory.buscaTreinamentos(trainingEditCtrl.id, buscaTreinamentosCallBack);
		}
	}

    var buscaTreinamentosCallBack = function(result){
    	if (!result) return;
    	
    	trainingEditCtrl.treinamentos = [];
		trainingEditCtrl.resultList = result;
		trainingEditCtrl.totalRecords = result.length;
		
		for (count = 0; count < 50; count++) {
			trainingEditCtrl.treinamentos.push(result[count]);
			if (trainingEditCtrl.treinamentos.length === trainingEditCtrl.totalRecords) break;
		}
    }
    
    trainingEditCtrl.pesquisar = function() {
		if (trainingEditCtrl.search !== "") {
			trainingEditCtrl.treinamentos = trainingEditCtrl.resultList.filter(filtro);
			trainingEditCtrl.totalRecords = trainingEditCtrl.treinamentos.length;
		} else {
			trainingEditCtrl.buscaTreinamentos(false);
		}
	}
	
	var filtro = function(treinamento) {
		return treinamento['cdn-curso'].toString().indexOf(trainingEditCtrl.search) !== -1 || treinamento.descricao.toLowerCase().indexOf(trainingEditCtrl.search) !== -1;  
	}

    trainingEditCtrl.save = function(){

        var params = {};

        params = angular.copy(trainingEditCtrl.id);
        params.ttTreinamentos = [];

        angular.forEach(trainingEditCtrl.treinamentos, function(value){
            if (value.selecionada){
                params.ttTreinamentos.push({
                    "cdn-curso": value['cdn-curso'],
                    "dt-validade": value['dt-validade'],
                    "selecionada": true
                });
            }
        });

        fchmabemployeeFactory.salvaTreinamentos(params, salvaTreinamentosCallBack);
    }

    var salvaTreinamentosCallBack = function(result){
        if (result) {
			$modalInstance.close();
		}
        
    }
    
	trainingEditCtrl.cancel = function () {
		$modalInstance.dismiss();
	}
     
    if ($rootScope.currentuserLoaded) { this.init(); }    
     
    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
        controller.init();
    });
        
}