define(['index'], function(index) {

    itemCalculationStatementSearchController.$inject = ['$modalInstance', '$rootScope', '$scope', 'model'];

    function itemCalculationStatementSearchController ($modalInstance, $rootScope, $scope, model) {

        // recebe os dados de pesquisa atuais e coloca no controller        
        controller = this;
		controller.model = JSON.parse(JSON.stringify(model));

        $scope.oneAtATime = true;

	    $scope.status = {
    	    isFirstOpen: true,
    	    isFirstDisabled: false
	    };

        // ação de pesquisar
        this.search = function () {
            // close é o fechamento positivo
            $modalInstance.close(controller.model);
        }
        
        // ação de fechar
        this.close = function () {
            // dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
            $modalInstance.dismiss();
        }

        this.init = function () {            
        }


        this.changeestseg = function () {

        }

        
       this.init();

    }

    index.register.controller('mdb.itemcalculationstatement.SearchCtrl', itemCalculationStatementSearchController);


});