define(['index',
        'filter-i18n'], function (index) {

    parametersController.$inject = ['$rootScope', 
                                    '$scope', 
                                    '$modalInstance', 
                                    'i18nFilter', 
                                    'model' ];

    function parametersController($rootScope, 
                                  $scope, 
                                  $modalInstance, 
                                  i18n, 
                                  model) {
        var self = this;

        $scope.status = {
            isFirstOpen: true,
            open: true
        };
                
        self.model = JSON.parse(JSON.stringify(model));

        self.options = {
            priceType: [{
                value: 1,
                label: i18n('l-batch', [], 'dts/mcs')
            },{
                value: 2,
                label: i18n('l-online', [], 'dts/mcs')
            },{
                value: 3,
                label: i18n('l-managerial', [] , 'dts/mcs')
            },{
                value: 4,
                label: i18n('l-base', [], 'dts/mcs')
            },{
                value: 5,
                label: i18n('l-replacement', [], 'dts/mcs')
            },{
                value: 6,
                label: i18n('l-last-receipt', [], 'dts/mcs')
            }],
            orderStatus: [{
                value: 1,
                label: i18n('l-all', [], 'dts/mcs')
            },{
                value: 2,
                label: i18n('l-started', [], 'dts/mcs')
            },{
                value: 3,
                label: i18n('l-done', [], 'dts/mcs')
            },{
                value: 4,
                label: i18n('l-finished', [], 'dts/mcs')
            }],
            operationCost: [{
                value: 1,
                label: i18n('l-total', [], 'dts/mcs')
            },{
                value: 2,
                label: i18n('l-forecasted', [], 'dts/mcs')
            },{
                value: 3,
                label: i18n('l-forecasted', [], 'dts/mcs') + " 2"
            },{
                value: 4,
                label: i18n('l-managerial', [], 'dts/mcs')
            }]
        };

        if (!self.model.ssp_fech_gerencial_active){
            self.options.priceType.splice(2,1);
            self.options.operationCost.splice(3,1);
        }

        self.setManagerialPrice = function () {
            if (this.model.selectedPriceType == 3) {
                self.model.selectedOperationCost = 4;
            } else {
                if (this.model.selectedOperationCost == 4){
                    self.model.selectedOperationCost = 1;
                }
            }
        }

        self.setManagerialOperation = function () {
            if (this.model.selectedOperationCost == 4) {
                self.model.selectedPriceType = 3
            } else {
                if (this.model.selectedPriceType == 3){
                    self.model.selectedPriceType = 1;
                }
            }
        }
        
        self.apply = function () {
            self.model.orderRange.start = (self.model.orderRange.start || "0").split('.').join("");

            self.model.orderRange.end = (self.model.orderRange.end || "0").split('.').join("");

            $modalInstance.close(self.model);
        }
        
        self.cancel = function () {
            $modalInstance.dismiss('cancel');
        }

        self.init = function () {
            
        }

        self.init();
        
        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
             $modalInstance.dismiss('cancel');
        });
    };

    index.register.controller('mcs.comparativeRealStandard.parameters.controller', parametersController);
});