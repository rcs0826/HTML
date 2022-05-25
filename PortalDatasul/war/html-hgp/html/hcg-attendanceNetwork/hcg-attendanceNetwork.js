define(['index',
    '/dts/hgp/html/hcg-attendanceNetwork/controller/attendanceNetworkListController.js',
    '/dts/hgp/html/hcg-attendanceNetwork/maintenance/controller/attendanceNetworkMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hcg-attendanceNetwork', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hcg-attendanceNetwork.start', {
                url: '/dts/hgp/hcg-attendanceNetwork/?showAsTable',
                controller: 'hcg.attendanceNetworkList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hcg-attendanceNetwork/ui/attendanceNetworkList.html'
            })
            
            .state('dts/hgp/hcg-attendanceNetwork.new', {
                url: '/dts/hgp/hcg-attendanceNetwork/new',
                controller: 'hcg.attendanceNetworkMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hcg-attendanceNetwork/maintenance/ui/attendanceNetworkMaintenance.html'
            })

            .state('dts/hgp/hcg-attendanceNetwork.edit', {
                url: '/dts/hgp/hcg-attendanceNetwork/edit/:cdnRede',
                controller: 'hcg.attendanceNetworkMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hcg-attendanceNetwork/maintenance/ui/attendanceNetworkMaintenance.html'
            })

            .state('dts/hgp/hcg-attendanceNetwork.detail', {         
                url: '/dts/hgp/hcg-attendanceNetwork/detail/:cdnRede',
                controller: 'hcg.attendanceNetworkMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/dts/hgp/html/hcg-attendanceNetwork/maintenance/ui/attendanceNetworkMaintenance.html'
            });
            
});


