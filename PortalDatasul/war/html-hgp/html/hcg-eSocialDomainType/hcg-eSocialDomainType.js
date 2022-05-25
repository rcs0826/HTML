define(['index',
    '/dts/hgp/html/hcg-eSocialDomainType/controller/eSocialDomainTypeListController.js',
    '/dts/hgp/html/hcg-eSocialDomainType/controller/eSocialDomainListController.js',
    '/dts/hgp/html/hcg-eSocialDomainType/maintenance/controller/eSocialDomainMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hcg-eSocialDomainType', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hcg-eSocialDomainType.start', {
                url: '/dts/hgp/hcg-eSocialDomainType/?showAsTable',
                controller: 'hcg.eSocialDomainTypeList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hcg-eSocialDomainType/ui/eSocialDomainTypeList.html'
            })

            .state('dts/hgp/hcg-eSocialDomainType.domainList', {
                url: '/dts/hgp/hcg-eSocialDomainType/:idiTipDomin?showAsTable',
                controller: 'hcg.eSocialDomainList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hcg-eSocialDomainType/ui/eSocialDomainList.html'
            })
            
            .state('dts/hgp/hcg-eSocialDomainType.new', {
                url: '/dts/hgp/hcg-eSocialDomainType/new/:idiTipDomin',
                controller: 'hcg.eSocialDomainMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hcg-eSocialDomainType/maintenance/ui/eSocialDomainMaintenance.html'
            })

            .state('dts/hgp/hcg-eSocialDomainType.edit', {
                url: '/dts/hgp/hcg-eSocialDomainType/edit/:idiTipDomin/:cdnDomin',
                controller: 'hcg.eSocialDomainMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hcg-eSocialDomainType/maintenance/ui/eSocialDomainMaintenance.html'
            })
            
            .state('dts/hgp/hcg-eSocialDomainType.detail', {         
                url: '/dts/hgp/hcg-eSocialDomainType/detail/:idiTipDomin/:cdnDomin',
                controller: 'hcg.eSocialDomainMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/dts/hgp/html/hcg-eSocialDomainType/maintenance/ui/eSocialDomainMaintenance.html'
            });
            
});


