/**
 * shiftController
 */
specialtyEditController.$inject = [
    '$rootScope',	         
	'$scope',
	'TOTVSEvent',
	'$modalInstance',
	'fchmab.fchmabemployee.Factory',
	'model'
];

function specialtyEditController($rootScope, 
    							 $scope,
    							 TOTVSEvent,
    							 $modalInstance,
    							 fchmabemployeeFactory,
    							 model) {

	var specialtyEditCtrl = this;
	
	// *********************************************************************************
    // *** Funções
    // *********************************************************************************
    
	specialtyEditCtrl.init = function() {
		specialtyEditCtrl.totalRecords = 0;
		specialtyEditCtrl.especialidades = [];
		specialtyEditCtrl.buscaEspecialidades(false);
    }
	
	specialtyEditCtrl.buscaEspecialidades = function(isMore) {
		if (isMore) {
			var startAt = specialtyEditCtrl.especialidades.length;
			
			for (count = startAt; count < startAt + 50; count++) {
				specialtyEditCtrl.especialidades.push(specialtyEditCtrl.resultList[count]);
				if (specialtyEditCtrl.especialidades.length === specialtyEditCtrl.totalRecords) break;
			}
			
		} else {
			fchmabemployeeFactory.buscaEspecialidades(model.id, buscaEspecialidadesCallback);
		}
	}
	
	var buscaEspecialidadesCallback = function(result) {
		if (!result) return;
		
		specialtyEditCtrl.especialidades = [];
		specialtyEditCtrl.especialidadesSelecionadas = [];
		specialtyEditCtrl.totalRecords = result.length;
		specialtyEditCtrl.resultList = result;
		
		for (count = 0; count < 50; count++) {
			specialtyEditCtrl.especialidades.push(result[count]);
			if (specialtyEditCtrl.especialidades.length === specialtyEditCtrl.totalRecords) break;
		}
		
		angular.forEach(result, function(value){
			if (value.selecionada) {
				specialtyEditCtrl.especialidadesSelecionadas.push(value);
			}
		});
	}
	
	specialtyEditCtrl.pesquisar = function() {
		if (specialtyEditCtrl.search !== "") {
			specialtyEditCtrl.especialidades = specialtyEditCtrl.resultList.filter(filtro);
			specialtyEditCtrl.totalRecords = specialtyEditCtrl.especialidades.length;
		} else {
			specialtyEditCtrl.buscaEspecialidades(false);
		}
	}
	
	var filtro = function(espec) {
		return espec['tp-especial'].toLowerCase().indexOf(specialtyEditCtrl.search) !== -1 || espec.descricao.toLowerCase().indexOf(specialtyEditCtrl.search) !== -1;  
	}
	
	specialtyEditCtrl.selecionaEspecialidade = function(value) {
		if (!value.selecionada) {
			var index = specialtyEditCtrl.especialidadesSelecionadas.indexOf(value);
			if (index > -1) {
				specialtyEditCtrl.especialidadesSelecionadas.splice(index, 1);
			}
			value.principal = false;
		} else {
			specialtyEditCtrl.especialidadesSelecionadas.push(value);
		}
	}
	
	specialtyEditCtrl.selecionaPrincipal = function(value) {
		angular.forEach(specialtyEditCtrl.especialidadesSelecionadas, function(espec) {
			if (espec['tp-especial'] === value['tp-especial']) {
				espec.principal = true;
			} else {
				espec.principal = false;
			}
		});
	}
	
	specialtyEditCtrl.save = function () {
		var params = angular.copy(model.id);
		
		params.ttEspecialidade = specialtyEditCtrl.especialidadesSelecionadas;
		fchmabemployeeFactory.salvaEspecialidades(params, salvaEspecialidadesCallback);
	}
	
	var salvaEspecialidadesCallback = function(result) {
		if (result && !result.$hasError) {
			model.especialidades = specialtyEditCtrl.especialidadesSelecionadas;
			$modalInstance.close();
		}
	}
	
	specialtyEditCtrl.cancel = function () {
		$modalInstance.dismiss();
	}
     
    if ($rootScope.currentuserLoaded) { this.init(); }    
     
    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
        controller.init();
    });
        
}