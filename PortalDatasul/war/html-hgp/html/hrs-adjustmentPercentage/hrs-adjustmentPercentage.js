define(['index',
    '/dts/hgp/html/hrs-adjustmentPercentage/controller/adjustmentPercentageListController.js',
    '/dts/hgp/html/hrs-adjustmentPercentage/maintenance/controller/adjustmentPercentageMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrs-adjustmentPercentage', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrs-adjustmentPercentage.start', {
                url: '/dts/hgp/hrs-adjustmentPercentage/?showAsTable',
                params: {disclaimers: undefined},
                controller: 'hrs.adjustmentPercentageList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-adjustmentPercentage/ui/adjustmentPercentageList.html'
            })
            
            .state('dts/hgp/hrs-adjustmentPercentage.new', {
                url: '/dts/hgp/hrs-adjustmentPercentage/new',
                controller: 'hrs.adjustmentPercentageMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-adjustmentPercentage/maintenance/ui/adjustmentPercentageMaintenance.html'
            })

            .state('dts/hgp/hrs-adjustmentPercentage.edit', {
                url: '/dts/hgp/hrs-adjustmentPercentage/edit/:numMes/:numAno',
                controller: 'hrs.adjustmentPercentageMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-adjustmentPercentage/maintenance/ui/adjustmentPercentageMaintenance.html'
            })
            
            .state('dts/hgp/hrs-adjustmentPercentage.detail', {         
                url: '/dts/hgp/hrs-adjustmentPercentage/detail/:valPerc/:numMes/:numAno',
                controller: 'hrs.adjustmentPercentageMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/dts/hgp/html/hrs-adjustmentPercentage/maintenance/ui/adjustmentPercentageMaintenance.html'
            })
            
});


