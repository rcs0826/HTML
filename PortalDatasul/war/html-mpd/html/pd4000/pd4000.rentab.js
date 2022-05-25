/* global TOTVSEvent, angular*/
define(['index'], function(index) {
    
    modalRentabController.$inject = ['$modalInstance', 'modalParams', '$filter'];
    function modalRentabController($modalInstance, modalParams, $filter) {

        var modalRentabController = this;

        var i18n = $filter('i18n');

        modalRentabController.ttOrderRentability = modalParams.ttOrderRentability;
        modalRentabController.ttOrderRentabilityItems = modalParams.ttOrderRentabilityItems;
        modalRentabController.idiCalcRentab = modalParams.idiCalcRentab;

        var colors = {};
        colors[i18n('Aprovado')] = 'approved';
        colors[i18n('Aprovado Parcial')] = 'approved';
        colors[i18n('Suspenso')] = 'suspended';
        colors[i18n('Não Avaliado')] = 'suspended';
        colors[i18n('Reprovado')] = 'cancelled';

        for (var index = 0; index < modalRentabController.ttOrderRentabilityItems.length; index++) {
            var element = modalRentabController.ttOrderRentabilityItems[index];
            element.color = colors[element.sitpreco];
        }

        this.close = function() {
            $modalInstance.dismiss('cancel');
        };

    }
    index.register.controller('salesorder.pd4000Rentab.Controller', modalRentabController);
    

});

