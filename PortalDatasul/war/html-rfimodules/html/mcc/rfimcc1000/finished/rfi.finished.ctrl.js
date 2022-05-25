define([
	'index',
	(rfiBaseDir + '/mcc/js/api/fchmatfillquotations.js')
], function (index) {

	finishedControl.$inject = ['$rootScope', '$scope', '$state', 'rfi.mcc.fchmatfillquotations.factory'];
	
	function finishedControl($rootScope, $scope, $state, fchmatfillquotations) {
		var ctrl = this;
		ctrl.param = undefined;
		$rootScope.i18nContext = i18nContext;
		
		// # Purpose: Método executado na inicialização do controller.
		// # Parameters: 
		// # Notes:
		ctrl.init = function () {
			ctrl.param = $state.params;

			var parameters = {
				guid: ctrl.param.guid,
			};
			//Invalida o link do RFI

			//Novo frame (mantidas lógicas distintas enquanto equipe do frame estuda forma para o novo Frame)
			if (window.location.href.indexOf('datasul-rfi') <= 0) {
				fchmatfillquotations.invalidateRfiLink(parameters, {},function(result){});
			} else {
				$.ajax({
					type: 'POST',
					url: '/datasul-rfi/LogoutServlet?guid=' + ctrl.param.guid,
					contentType: 'text',
					data: parameters,
					success: function(response) {}
				});	
			}	
		};

		ctrl.init();

		$scope.$on('$destroy', function () {
			ctrl = undefined;
		});
	};	
	
	index.register.controller('rfi.mcc.finished.ctrl', finishedControl);
});
