define([
	'index'
], function(index) {

	commentsModal.$inject = ['$modal'];
	
	function commentsModal($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/mcc/html/purchaseorder/list/purchaseorder.comments.html',
				controller: 'mcc.purchaseorder.commentsCtrl as controller',
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

	commentsController.$inject = ['$scope', '$rootScope', '$modalInstance', 'TOTVSEvent'];
	function commentsController($scope, $rootScope, $modalInstance, TOTVSEvent) {
		var commentsControl = this;
		
		commentsControl.comments = '';

		/*
         * Objetivo: método de inicialização da tela
         * Parâmetros: 
         * Observações: 
         */
		commentsControl.init = function(){}

		/*
		 * Objetivo: Cancelar ação / Fechar modal
		 * Parâmetros:
		 */
		commentsControl.cancel = function() {
			$modalInstance.dismiss('cancel');
		}

		/*
		 * Objetivo: Retorna as informações informadas na pesquisa avançada e fecha a modal.
		 * Parâmetros:
		 */
		commentsControl.apply = function(){
			if (!commentsControl.comments && commentsControl.comments.length == 0) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-purchase-orders', [], 'dts/mcc'),
					detail: $rootScope.i18n('l-motive-uninformed', [], 'dts/mcc') + '!'
				});
				return;
			}
			$modalInstance.close(commentsControl.comments);
		}

		commentsControl.init(); // busca as informações default da tela

		$scope.$on('$destroy', function () {
			followupListControl = undefined;
		});

		$scope.$on('$stateChangeStart', function () {
			$modalInstance.dismiss('cancel');
		});
	}

	index.register.controller('mcc.purchaseorder.commentsCtrl', commentsController);
	index.register.service('mcc.purchaseorder.commentsModal',commentsModal);
});
