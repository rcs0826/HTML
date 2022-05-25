define(['index',
    '/dts/hgp/html/hpr-kinshipDegree/controller/kinshipDegreeListController.js',
    '/dts/hgp/html/hpr-kinshipDegree/maintenance/controller/kinshipDegreeMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hpr-kinshipDegree', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hpr-kinshipDegree.start', {
                url: '/dts/hgp/hpr-kinshipDegree/?showAsTable',
                controller: 'hpr.kinshipDegreeList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hpr-kinshipDegree/ui/kinshipDegreeList.html'
            })

            .state('dts/hgp/hpr-kinshipDegree.new', {
                url: '/dts/hgp/hpr-kinshipDegree/new',
                controller: 'hpr.kinshipDegreeMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hpr-kinshipDegree/maintenance/ui/kinshipDegreeMaintenance.html'
            })

            .state('dts/hgp/hpr-kinshipDegree.edit', {
                url: '/dts/hgp/hpr-kinshipDegree/edit/:cdGrauParentesco',
                controller: 'hpr.kinshipDegreeMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hpr-kinshipDegree/maintenance/ui/kinshipDegreeMaintenance.html'
            })

            .state('dts/hgp/hpr-kinshipDegree.detail', {         
                url: '/dts/hgp/hpr-kinshipDegree/detail/:cdGrauParentesco',
                controller: 'hpr.kinshipDegreeMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/dts/hgp/html/hpr-kinshipDegree/maintenance/ui/kinshipDegreeMaintenance.html'
            });            

});