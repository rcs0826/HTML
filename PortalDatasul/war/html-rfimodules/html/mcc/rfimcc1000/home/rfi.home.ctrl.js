define([
	'index',
	(rfiBaseDir + '/mcc/js/api/fchmatfillquotations.js'),
		
], function (index) {

	homeControl.$inject = ['$rootScope','$scope','$state','$location', 'rfi.mcc.fchmatfillquotations.factory'];
	function homeControl($rootScope, $scope, $state, $location, fchmatfillquotations) {
		var ctrl = this;
		ctrl.guid = undefined;
		$rootScope.i18nContext = i18nContext;

		// # Purpose: Método executado na inicialização da tela
		// # Parameters: 
		// # Notes: Este método utiliza o token do rfi para buscar os dados da empresa e do fornecedor.
		ctrl.init = function () {
			if($location && $location.$$search.guid)
				ctrl.guid = $location.$$search.guid;

			var parameters = {
				guid: ctrl.guid
			};

			fchmatfillquotations.homeInfo(parameters,function(result){
				if(result){
					$rootScope.ttCompany = result['ttCompany'][0];
					$rootScope.ttVendor = result['ttVendor'][0];
					ctrl.company = result['ttCompany'][0];
					ctrl.vendor  = result['ttVendor'][0];
					ctrl.isValidLink = result['isValidLink'];

					if (!ctrl.isValidLink) {
						$state.go('rfi/mcc/rfimcc1000.finished');
					}
				}
			})
		};

		// # Purpose: Método executado na ação do botão responder.
		// # Parameters: 
		// # Notes:
		ctrl.onAnswer = function() {
			var param = {
				'client': ctrl.company.nome,
				'guid': ctrl.guid
			}
			$state.go('rfi/mcc/rfimcc1000.answer', param);
		};

		ctrl.init();	

		// # Purpose: Limpa variável do controller
		// # Parameters: 
		// # Notes: 
		$scope.$on('$destroy', function () {
			ctrl = undefined;
		});
	};	
	
	index.register.controller('rfi.mcc.home.ctrl', homeControl);
});
