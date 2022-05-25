define(['index'], function(index) {

	/**
	 * Controller Detail
	 */
	prioridadeOmCtrl.$inject = [
		'$rootScope',
		'$scope',
		'TOTVSEvent',
        '$modalInstance',
		'model',
		'fchmip.programacao.Factory'
	];

	function prioridadeOmCtrl($rootScope,
                            $scope,
                            TOTVSEvent,
                            $modalInstance,
							model,
							programacaoFactory) {
		
		var prioridadeOmCtrl = this;
		
		prioridadeOmCtrl.init = function() {			
			prioridadeOmCtrl.model = model;	
			prioridadeOmCtrl.prioridadeInformada = 0;		
			prioridadeOmCtrl.listaOrdens = prioridadeOmCtrl.model.ttOrdem;
			prioridadeOmCtrl.titulo = model.titulo;			
			prioridadeOmCtrl.ordenaLista(prioridadeOmCtrl.listaOrdens);
		}

		prioridadeOmCtrl.selecionaTodos = function(){
			angular.forEach(prioridadeOmCtrl.myGrid.options.dataSource._data, function(value){
				value.$selected = prioridadeOmCtrl.seleciona;
			});
		}
		
		prioridadeOmCtrl.ordenaLista = function(value){

			var orderDtManut = function(a, b) {
				return a['dtManut'] - b['dtManut'];
			};

			var orderNrOrdProdu = function(a, b) {
				return a['nrOrdProdu'] - b['nrOrdProdu'];
			};
			
			var orderAll = function(a, b) {
				if (orderDtManut(a, b) != 0) return orderDtManut(a, b);
				return orderNrOrdProdu(a, b);
			};
			
			prioridadeOmCtrl.listaOrdens.sort(orderAll);
		}

		prioridadeOmCtrl.atualizaPrioridade = function(){
			prioridadeOmCtrl.ordensSelecionadas = [];

			angular.forEach(prioridadeOmCtrl.myGrid.options.dataSource._data, function(value){
				if(value.$selected){
					if(prioridadeOmCtrl.prioridadeInformada != undefined){
						value.prioridade = prioridadeOmCtrl.prioridadeInformada;
					}
					prioridadeOmCtrl.ordensSelecionadas.push({'prioridade':prioridadeOmCtrl.prioridadeInformada, 'numIdOrd': value.numIdOrd});
					
				}
			})
			if (validaTela() === false){
				programacaoFactory.atualizaPrioridade(prioridadeOmCtrl.ordensSelecionadas, atualizaPrioridadeCallback);
			}
		}
		
		var validaTela = function() {
			var messages = [];
			var campoInvalido = false;

			if (prioridadeOmCtrl.prioridadeInformada === undefined) {
				campoInvalido = true;
				messages.push('l-priority');
			}
			if (campoInvalido) {
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
					warning = warning + ' ' + $rootScope.i18n('l-required-2');
				}
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: warning
				});
			}
			
			if (prioridadeOmCtrl.ordensSelecionadas.length === 0) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					 type: 'warning',
					 title: $rootScope.i18n('l-attention'),
					 detail: $rootScope.i18n('l-no-selected-record-txt')
				});
				return;
			}
			return campoInvalido;
		}

		var atualizaPrioridadeCallback = function(result) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-priority-attendance'),
					detail: $rootScope.i18n('l-success-update-priority')
				});
				prioridadeOmCtrl.seleciona = false;
				prioridadeOmCtrl.prioridadeInformada = 0;
				desmarcaTodos();
		}

		var desmarcaTodos = function(){
			angular.forEach(prioridadeOmCtrl.listaOrdens, function(value){
				value.$selected = false;
				prioridadeOmCtrl.seleciona = false;
			})        
			
			angular.forEach(prioridadeOmCtrl.myGrid.options.dataSource._data, function(value){
				value.$selected = false;
			})
		};

		if ($rootScope.currentuserLoaded) {
				prioridadeOmCtrl.init();
		}

		prioridadeOmCtrl.fechar = function(){
			desmarcaTodos();
			$modalInstance.close();
		}

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {		 
		    $modalInstance.close('cancel');
		});
				
	    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
	        prioridadeOmCtrl.init();
	    });
	}

	index.register.controller("mmi.sprint.PrioridadeOmCtrl", prioridadeOmCtrl);
});
