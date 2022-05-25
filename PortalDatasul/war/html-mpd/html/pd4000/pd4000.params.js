/* global TOTVSEvent, angular*/
define(['index'], function (index) {

    modalParamscontroller.$inject = ['mpd.fchdis0051.Factory', 'modalParams', '$modalInstance', '$rootScope', 'dts-utils.message.Service'];

    function modalParamscontroller(fchdis0051, modalParams, $modalInstance, $rootScope, messageUtils) {

        var modalParamscontroller = this;

        this.orderParameters = angular.copy(modalParams);

        modalParamscontroller.orderParameters['tp-exp-nat-oper'] = modalParamscontroller.orderParameters['tp-exp-nat-oper'].toString()
        modalParamscontroller.orderParameters['tp-exp-local-entrega'] = modalParamscontroller.orderParameters['tp-exp-local-entrega'].toString()
        modalParamscontroller.orderParameters['tp-exp-dt-entrega'] = modalParamscontroller.orderParameters['tp-exp-dt-entrega'].toString()
        modalParamscontroller.orderParameters['tp-exp-tb-preco'] = modalParamscontroller.orderParameters['tp-exp-tb-preco'].toString()
        modalParamscontroller.orderParameters['tp-relacao-item-cli'] = modalParamscontroller.orderParameters['tp-relacao-item-cli'].toString()
        modalParamscontroller.orderParameters['int-livre-1'] = modalParamscontroller.orderParameters['int-livre-1'].toString()


        this.close = function () {
            $modalInstance.dismiss('cancel');
        }

        this.confirm = function () {

            messageUtils.question({
                title: 'Salvar parâmetros',
                text: $rootScope.i18n('Salvar os parâmetros irá atualizar o usuário comercial, confirma?'),
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                callback: function (isPositiveResult) {
                    if (isPositiveResult) {
                        $modalInstance.close(modalParamscontroller.orderParameters);

                        fchdis0051.saveParameters(modalParamscontroller.orderParameters);
                    }
                }
            });

        };
    }

    index.register.controller('salesorder.pd4000Params.Controller', modalParamscontroller);

});

