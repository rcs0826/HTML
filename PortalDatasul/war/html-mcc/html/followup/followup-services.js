define([
	'index',
	'/dts/mcc/js/api/ccapi355.js'
], function(index) {

	// ########################################################
    // ### CONTROLLER MODAL FOLLOW-UP
	// ########################################################
    followupListController.$inject = ['$rootScope', '$scope', '$modalInstance', 'parameters', 'mcc.ccapi355.Factory', 'TOTVSEvent'];
    function followupListController($rootScope, $scope, $modalInstance, parameters, followupFactory, TOTVSEvent) {
        // *********************************************************************************
		// *** Variables
		// *********************************************************************************
        var followupListControl = this;
        this.listOfFollowUp = [];
        this.showBox = false;

        // *********************************************************************************
		// *** Functions
		// *********************************************************************************
		this.load = function(){
			this.loaded = false;
			followupFactory.getFollowUp(parameters, function(result) {	 // Busca as informações dos followup's da requisição ou item da requisição
				if(result){
					followupListControl.listOfFollowUp = result;					
				}
				followupListControl.loaded = true;
	        });
		}

		this.addComment = function(){ // Adicionar comentário (Exibe o textarea)
			this.showBox = true;
		}

		this.cancelComment = function(){ // Cancelar comentário (Esconde o textare e limpa o texto)
			this.showBox = false;
			if(this.model){
				this.model.comment = "";
			}
		}

		this.saveComment = function(){ // Salvar um comentário
			parameters.comment = this.model.comment;
			followupFactory.addFollowUp(parameters, function(result) {	
				if(!result['$hasError']){
					followupListControl.afterSaveComment();
				}
	        });			
		}

		this.afterSaveComment = function(){ // Após salvar um comentário
	        $rootScope.$broadcast(TOTVSEvent.showNotification, {
	            type: 'success',
	            title: $rootScope.i18n('l-followup', [], 'dts/mcc'),
	            detail: $rootScope.i18n('l-followup', [], 'dts/mcc') + ' ' + $rootScope.i18n('l-success-created', [], 'dts/mcc') + '!'
	        });
			this.showBox = false;
			this.model.comment = "";
			this.load();
		}
		
		this.cancel = function() {
			$modalInstance.dismiss('cancel');
		}
		
        // *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************
        this.load(); // Carregar os followup's       

        // *********************************************************************************
		// *** Events Listners
		// *********************************************************************************
		$scope.$on('$destroy', function () {
			followupListControl = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            $modalInstance.dismiss('cancel');
        });
    }

	index.register.controller('mcc.followup.modalFollowupCtrl', followupListController);
});
