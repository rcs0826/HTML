define([
	'index'
], function(index) {

	configModal.$inject = ['$modal'];
	
	function configModal($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/mla/html/approval/approval.config.modal.html',
				controller: 'mla.approval.configModalCtrl as controller',
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

	configController.$inject = ['$scope', '$modalInstance', '$totvsprofile'];
	function configController($scope, $modalInstance, $totvsprofile) {
		var configControl = this;
		
		configControl.model = {
			approveWithoutComments: false
		};

		/*
         * Objetivo: método de inicialização da tela
         * Parâmetros: 
         * Observações: 
         */
		configControl.init = function(){
			$totvsprofile.remote.get('/dts/mla/approval', 'approveWithoutComments', function(result) {
				if(result != undefined && result != null && result.length> 0 && result[0].dataValue) {
					configControl.model.approveWithoutComments = result[0].dataValue;
				}
			});
		}

		/*
		 * Objetivo: Cancelar ação / Fechar modal
		 * Parâmetros:
		 */
		configControl.cancel = function() {
			$modalInstance.dismiss('cancel');
		}

		/*
		 * Objetivo: Retorna as informações informadas na pesquisa avançada e fecha a modal.
		 * Parâmetros:
		 */
		configControl.apply = function(){
			$modalInstance.close(configControl.model);
		}

		configControl.init(); // busca as informações default da tela

		$scope.$on('$destroy', function () {
			followupListControl = undefined;
		});

		$scope.$on('$stateChangeStart', function () {
			$modalInstance.dismiss('cancel');
		});
	}

	index.register.controller('mla.approval.configModalCtrl', configController);
	index.register.service('mla.approval.configModal',configModal);
});
