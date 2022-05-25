define(['index'], function(index) {

	omsLiberadasOpCtrl.$inject = [	                              
		'$rootScope',	         
		'$scope',
		'$modalInstance',
		'TOTVSEvent',
		'model',
		'$filter',
		'fchmip.programacao.Factory',
		'$timeout',
		'$modal'
	];
	
	function omsLiberadasOpCtrl($rootScope, 
							 $scope,
							 $modalInstance,
							 TOTVSEvent,
							 model,
							 $filter,
							 programacaoFactory,
							 $timeout,
							 $modal) {
	
		var omsLiberadasOpCtrl = this;
		omsLiberadasOpCtrl.listaSelecionados = [];
	
		// *********************************************************************************
	    // *** Funções
	    // *********************************************************************************
	
		omsLiberadasOpCtrl.init = function() {
			omsLiberadasOpCtrl.model = model;
			omsLiberadasOpCtrl.listaOrdens = model.ttOrdem;
			omsLiberadasOpCtrl.listaOrdensTemp = [];
			omsLiberadasOpCtrl.titulo = model.titulo;
			setDefault();

		}

		var setDefault = function() {
			omsLiberadasOpCtrl.paramTela = [];
			omsLiberadasOpCtrl.paramTela.horaInicioOp = "" + new Date().getHours() + (new Date().getMinutes() < 10 ? ""+0+new Date().getMinutes(): new Date().getMinutes());
			omsLiberadasOpCtrl.paramTela.horaTerminoOp = omsLiberadasOpCtrl.paramTela.horaInicioOp
			omsLiberadasOpCtrl.paramTela.dataInicioOp = omsLiberadasOpCtrl.model.dtIniPeriodo;
			omsLiberadasOpCtrl.paramTela.dataTerminoOp = omsLiberadasOpCtrl.model.dtIniPeriodo;
			setFocus();
		};

		omsLiberadasOpCtrl.changeDatepicker = function() {
			if(omsLiberadasOpCtrl.paramTela.dataInicioOp > omsLiberadasOpCtrl.paramTela.dataTerminoOp || !omsLiberadasOpCtrl.paramTela.dataTerminoOp)
				omsLiberadasOpCtrl.paramTela.dataTerminoOp = omsLiberadasOpCtrl.paramTela.dataInicioOp;
		};

		omsLiberadasOpCtrl.changeHour = function() {
			if(Number(omsLiberadasOpCtrl.paramTela.horaTerminoOp.replace(':','')) === 0) 
				omsLiberadasOpCtrl.paramTela.horaTerminoOp = 2359;
		};

		omsLiberadasOpCtrl.atualizaLiberacoes = function() {
			omsLiberadasOpCtrl.ordensSelecionadas();

			if (omsLiberadasOpCtrl.listaOrdensTemp.length > 0) {
				programacaoFactory.liberarOrdemManut(omsLiberadasOpCtrl.listaOrdensTemp, function(result){
					if (!result.hasError) {
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-release-operation'),
							detail: $rootScope.i18n('msg-success-release')
						});

						angular.forEach(omsLiberadasOpCtrl.myGrid._data, function(value){
							if(value.$selected){
							   value.observacaoOp = omsLiberadasOpCtrl.paramTela['des-obs'];
							}
						});
						setDefault();
					}
				});
			} else {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'warning',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-no-selected-order')
				});
			}
		};

		omsLiberadasOpCtrl.ordensSelecionadas = function(){
			omsLiberadasOpCtrl.listaOrdensTemp = [];
			var ordem = {};

			angular.forEach(omsLiberadasOpCtrl.listaOrdens, function(value){
				if(value.$selected) {
					ordem.nrOrdProdu = value.nrOrdProdu;
					ordem.dtIniPeriodo = omsLiberadasOpCtrl.model.dtIniPeriodo;
					ordem.dtFimPeriodo = omsLiberadasOpCtrl.model.dtFimPeriodo;
					ordem.dataInicioOp = omsLiberadasOpCtrl.paramTela.dataInicioOp;
					ordem.dataTerminoOp = omsLiberadasOpCtrl.paramTela.dataTerminoOp;
					ordem.horaInicioOp = omsLiberadasOpCtrl.paramTela.horaInicioOp;
					ordem.horaTerminoOp = omsLiberadasOpCtrl.paramTela.horaTerminoOp;
					ordem['des-obs'] = omsLiberadasOpCtrl.paramTela['des-obs'];
					omsLiberadasOpCtrl.listaOrdensTemp.push(ordem);
					ordem = {};
				}
			});
		};

		omsLiberadasOpCtrl.retiraLiberacoes = function() {
			omsLiberadasOpCtrl.ordensSelecionadas();

			if (omsLiberadasOpCtrl.listaOrdensTemp.length === 0) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'warning',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-no-selected-order')
				});

				return;
			}

			programacaoFactory.retiraLiberacaoOm(omsLiberadasOpCtrl.listaOrdensTemp,function(){
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-release-operation'),
					detail: $rootScope.i18n('msg-success-release')
				});

				angular.forEach(omsLiberadasOpCtrl.myGrid._data, function(value){
					if(value.$selected){
					   value.observacaoOp = undefined;
					}
				});
			});
		};

		omsLiberadasOpCtrl.selecionaTodos = function(){
			
			angular.forEach(omsLiberadasOpCtrl.listaOrdens, function(value){
				value.$selected = omsLiberadasOpCtrl.seleciona;
			});

			angular.forEach(omsLiberadasOpCtrl.myGrid._data, function(value){
				value.$selected = omsLiberadasOpCtrl.seleciona;
			});
		}

		var setFocus = function() {
	    	$timeout(function() {
	    		$('#dataInicioOp').find('*').filter(':input:visible:first').focus();
	        },500);
		}

		var desmarcaTodos = function(){
			angular.forEach(omsLiberadasOpCtrl.listaOrdens, function(value){
				value.$selected = false;
			})
			
			angular.forEach(omsLiberadasOpCtrl.myGrid._data, function(value){
				value.$selected = false;
			})
		};

		omsLiberadasOpCtrl.detalheLiberacao = function(value) {

			if(value.observacaoOp){
				omsLiberadasOpCtrl.textoLiberacao = value.observacaoOp;
			}else{
				omsLiberadasOpCtrl.textoLiberacao = omsLiberadasOpCtrl.paramTela['des-obs'];
			}


			$scope.modalInstance = $modal.open({
				templateUrl: '/dts/mmi/html/sprint/sprint-planning-liberacao-obs.html',
				scope: $scope,
				size: 'md'
			});
		};

		omsLiberadasOpCtrl.fechar = function () {
			$modalInstance.close();
		}
		
		omsLiberadasOpCtrl.fecharObs = function () {
			$scope.modalInstance.close('cancel');
	    }

		$scope.$on('$destroy', function () {
			desmarcaTodos();
			omsLiberadasOpCtrl = undefined;
		});
		
		if ($rootScope.currentuserLoaded) { 
			omsLiberadasOpCtrl.init(); 
		}
	    
	    $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {		 
		    $modalInstance.dismiss('cancel');
		});
	     
	    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
	    	omsLiberadasOpCtrl.init();
	    });
	}
	
    index.register.controller("mmi.sprint.omsLiberadasOpCtrl", omsLiberadasOpCtrl);
});