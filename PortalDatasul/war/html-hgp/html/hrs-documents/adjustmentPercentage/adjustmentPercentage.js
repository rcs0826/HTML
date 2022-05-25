define(['index',
    '/dts/hgp/html/util/dts-utils.js',
    '/dts/hgp/html/hcg-hrs-adjustmentPercentage/controller/adjustmentPercentageListController.js',
    '/dts/hgp/html/hcg-hrs-adjustmentPercentage/maintenance/controller/adjustmentPercentageMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('healthcare/hrs/adjustmentPercentage', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hrs/adjustmentPercentage.start', {
                url: 'dtshrs/adjustmentPercentage/?showAsTable',
                controller: 'hrs.adjustmentPercentageList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hcg-hrs-adjustmentPercentage/ui/adjustmentPercentageList.html'
            })
            
            .state('healthcare/hrs/adjustmentPercentage.new', {
                url: 'dtshrs/adjustmentPercentage/new',
                controller: 'hrs.adjustmentPercentageMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hcg-hrs-adjustmentPercentage/maintenance/ui/adjustmentPercentageMaintenance.html'
            })

            .state('healthcare/hrs/adjustmentPercentage.edit', {
                url: 'dtshrs/adjustmentPercentage/edit/:numAno/:numMes',
                controller: 'hrs.adjustmentPercentageMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hcg-hrs-adjustmentPercentage/maintenance/ui/adjustmentPercentageMaintenance.html'
            })
            
            .state('healthcare/hrs/adjustmentPercentage.detail', {         
                url: 'dtshrs/adjustmentPercentage/detail/:valPerc/:numMes/:numAno',
                controller: 'hrs.adjustmentPercentageMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/dts/hgp/html/hcg-hrs-adjustmentPercentage/maintenance/ui/adjustmentPercentageMaintenance.html'
            });
            
});


