define([
    'index'
], function(index){


	orderCopyCtrl.$inject = [
		'$modalInstance',
	    '$scope',
	    '$rootScope',
	    '$filter',
	    'TOTVSEvent',
		'model'];

    function orderCopyCtrl (
        $modalInstance,
        $scope,
        $rootScope,
        $filter,
        TOTVSEvent,
        model) {

        var copyCtrl = this;

        copyCtrl.acao = 1;

        copyCtrl.options = [{value: 1, label: $rootScope.i18n('l-maintenance-order')},
                            {value: 2, label: $rootScope.i18n('l-maintenance-plan')}];

        this.copy = function () {
            // dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
            model.acao = copyCtrl.acao;
            $modalInstance.close();
        }

        // ação de fechar
        this.cancel = function () {
            // dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
            $modalInstance.dismiss();
        }

        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            $modalInstance.dismiss('cancel');
        });
    }

    index.register.controller('mmi.order.CopyCtrl', orderCopyCtrl);

});