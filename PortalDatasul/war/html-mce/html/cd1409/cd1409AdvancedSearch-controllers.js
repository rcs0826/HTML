define(['index'], function (index) {

    // CONTROLLER PESQUISA AVANCADA
    cd1409CtrlAdvacedSearch.$inject = [
   '$rootScope', '$scope', '$modalInstance', 'parameters', 'mce.utils.Service', '$filter', 'TOTVSEvent'
   ];



    function cd1409CtrlAdvacedSearch($rootScope, $scope, $modalInstance, parameters, mceUtils, $filter, TOTVSEvent) {

        // *********************************************************************************
        // *** Variables
        // *********************************************************************************

        var controller = this;
        this.disclaimers = undefined;
        this.ttListParameters = parameters.ttListParameters;

        this.range = {
            startDate: new Date(this.ttListParameters['dt-requis-ini']),
            endDate: new Date(this.ttListParameters['dt-requis-fim'])
        };

        // *********************************************************************************
        // *** Functions
        // ***********************************************************************************
        this.validateFields = function () {

            var cMsg = '';

            if (!this.ttListParameters['cod-estabel']) {
                cMsg = $scope.i18n('l-site') + " " + $scope.i18n('l-not-found');
            }

            if (isNaN(this.ttListParameters['dt-requis-ini']) || 
                isNaN(this.ttListParameters['dt-requis-fim']) ||
                this.ttListParameters['dt-requis-ini'] == 0   ||
                this.ttListParameters['dt-requis-fim'] == 0) {
                cMsg = $scope.i18n('l-msg-enter-correctly-date-range');
            }            


            if (cMsg != '') {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: cMsg,
                    detail: ''
                });
                return false;
            }
            return true;
        };



        /* Função....: apply
           Descrição.: Função disparada ao clicar no botõa aplicar
           Parâmetros: <não há> 
        */
        this.apply = function () {

            if (this.range) {
                this.ttListParameters['dt-requis-ini'] = new Date(this.range.startDate).valueOf();
                this.ttListParameters['dt-requis-fim'] = new Date(this.range.endDate).valueOf();
            } else {
                this.ttListParameters['dt-requis-ini'] = undefined;
                this.ttListParameters['dt-requis-fim'] = undefined;
            }


            if (!this.validateFields()) {
                return;
            }

            $modalInstance.close({
                ttListParameters: this.ttListParameters
            }); // fecha modal retornando parametro
        };

        /* Função....: apply
           Descrição.: Função disparada ao clicar no botõa cancelar
           Parâmetros: <não há> 
        */
        this.cancel = function () {
            $modalInstance.dismiss('cancel'); // fecha modal sem retornar parametros
        };


        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************

        $scope.$on('$destroy', function () {
            controller = undefined;
        });

        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            // TODO: Confirmar o fechamento caso necessário.
            $modalInstance.dismiss('cancel');
        });


    };
    index.register.controller('mce.cd1409.AdvacendSearch', cd1409CtrlAdvacedSearch);
});
