define([
	'index',
	'/dts/mla/js/api/mla0009.js'
], function(index) {	
	
	// ########################################################
	// ### CONTROLLER MODAL Detalhe Pendência
	// ########################################################
	modalDetailPendingCtrl.$inject = ['$scope', '$rootScope', '$modalInstance', 'mla.mla0009.factory', 'nrTransacao'];
	function modalDetailPendingCtrl($scope, $rootScope, $modalInstance, mla0009, nrTransacao) {	
		var modalDetailPendingCtrl = this;
		
		/* 
		 * Objetivo: Buscar as informações referentes a pendência
		 * Parâmetros:
		 * Observações:
		 */
		modalDetailPendingCtrl.init = function(){
			mla0009.getDetalhePendencia({nrTransacao:nrTransacao},function(result){
				modalDetailPendingCtrl.detailPending = result['tt-detalhe-pendencia'];
				modalDetailPendingCtrl.chave = result['tt-chave'];
			});
		}

		/* 
		 * Objetivo: Cancelar e fechar a tela
		 * Parâmetros:
		 * Observações:
		 */
		modalDetailPendingCtrl.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		/* Objetivo: Iniciar a tela (executa o método inicial) */
		if($rootScope.currentuserLoaded){
			modalDetailPendingCtrl.init();
		}
	}

	index.register.controller('mla.modalDetailPendingCtrl', modalDetailPendingCtrl);
});
