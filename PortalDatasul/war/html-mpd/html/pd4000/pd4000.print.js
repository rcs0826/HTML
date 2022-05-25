/* global TOTVSEvent, angular*/
define(['index'], function(index) {
    
    modalPrintController.$inject = ['$modalInstance', 'orderstatus'];
    function modalPrintController($modalInstance, orderstatus) {

        var printController = this;

        printController.printFullDescription = false;
        printController.detailDeliveries = false;
        printController.detailItemComposition = false;
        printController.measureUnit = "0";
        printController.orderstatus = orderstatus;

        printController.recalculateOrder = 
            printController.orderstatus.cancalculate && 
            !printController.orderstatus.iscompleted;

        this.close = function() {
            $modalInstance.dismiss('cancel');
        };

        this.confirm = function() {
            $modalInstance.close(printController);
        };
    }
    index.register.controller('salesorder.pd4000Print.Controller', modalPrintController);
    

});

