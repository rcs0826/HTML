define([
	'index',
	'/dts/mcc/js/api/fchmatpricetable.js',
	'/dts/mcc/js/mcc-legend-service.js'
], function(index) {

	advancedSearchModal.$inject = ['$modal'];
	
	function advancedSearchModal($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/mcc/html/purchaseorder/list/purchaseorder.advanced.search.html',
				controller: 'mcc.purchaseorder.advancedSearchCtrl as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { 
					parameters: function () { return params; } 
				}
			});
			return instance.result;
		}
	}

	advancedSearchController.$inject = ['$rootScope','$scope', '$modalInstance', 'parameters'];
	function advancedSearchController($rootScope, $scope, $modalInstance, parameters) {
		var advancedSearchControl = this;
		advancedSearchControl.priceTableList = [];

		/*
         * Objetivo: método de inicialização da tela
         * Parâmetros: 
         * Observações: 
         */
		advancedSearchControl.init = function(){
			if(advancedSearchControl.model == undefined)
				advancedSearchControl.model = {};
				
			advancedSearchControl.model = parameters;
			advancedSearchControl.model.purchaseDate = {
				start: null,
				end: null
			};

			if (parameters.purchaseDateIni) 
				advancedSearchControl.model.purchaseDate.start = parameters.purchaseDateIni.getTime();

			if (parameters.purchaseDateEnd) 
				advancedSearchControl.model.purchaseDate.end = parameters.purchaseDateEnd.getTime();

		}

		/*
		 * Objetivo: Cancelar ação / Fechar modal
		 * Parâmetros:
		 */
		advancedSearchControl.cancel = function() {
			$modalInstance.dismiss('cancel');
		}

		/*
		 * Objetivo: Retorna as informações informadas na pesquisa avançada e fecha a modal.
		 * Parâmetros:
		 */
		advancedSearchControl.apply = function(){
			
			//Atualizando a data com a data selecionada no range.
			if (advancedSearchControl.model.purchaseDate.start != null)
				advancedSearchControl.model.purchaseDateIni = new Date(advancedSearchControl.model.purchaseDate.start);
			else
				advancedSearchControl.model.purchaseDateIni = '';

			if (advancedSearchControl.model.purchaseDate.end != null)
				advancedSearchControl.model.purchaseDateEnd = new Date(advancedSearchControl.model.purchaseDate.end);
			else
				advancedSearchControl.model.purchaseDateEnd = '';
			
			$modalInstance.close(advancedSearchControl.model);
		}

		advancedSearchControl.init(); // busca as informações default da tela

		$scope.$on('$destroy', function () {
			followupListControl = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			$modalInstance.dismiss('cancel');
		});
	}

	index.register.controller('mcc.purchaseorder.advancedSearchCtrl', advancedSearchController);
	index.register.service('mcc.purchaseorder.advancedSearchModal',advancedSearchModal);
});
