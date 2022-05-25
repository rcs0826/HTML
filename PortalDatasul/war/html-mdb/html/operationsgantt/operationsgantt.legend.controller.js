define(['index',
        'css!/dts/mdb/html/operationsgantt/legend-style.css'], function (index) {

    legendController.$inject = ['$rootScope', 
                                '$scope', 
                                '$modalInstance', 
                                'i18nFilter'];

    function legendController($rootScope, 
                              $scope, 
                              $modalInstance, 
                              i18n) {
        var controller = this;
        
        controller.cancel = function () {
            $modalInstance.dismiss('cancel');
        }

    };
    
    index.register.controller('mdb.operationsgantt.legend.controller', legendController);

});