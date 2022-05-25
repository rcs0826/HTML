define(['index',
    '/healthcare/hpr/html/kinshipDegree/controller/kinshipDegreeListController.js',
    '/healthcare/hpr/html/kinshipDegree/maintenance/controller/kinshipDegreeMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('healthcare/hpr/kinshipDegree', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hpr/kinshipDegree.start', {
                url: '/healthcare/hpr/kinshipDegree/?showAsTable',
                controller: 'hpr.kinshipDegreeList.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hpr/html/kinshipDegree/ui/kinshipDegreeList.html'
            })

            .state('healthcare/hpr/kinshipDegree.new', {
                url: '/healthcare/hpr/kinshipDegree/new',
                controller: 'hpr.kinshipDegreeMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hpr/html/kinshipDegree/maintenance/ui/kinshipDegreeMaintenance.html'
            })

            .state('healthcare/hpr/kinshipDegree.edit', {
                url: '/healthcare/hpr/kinshipDegree/edit/:cdGrauParentesco',
                controller: 'hpr.kinshipDegreeMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hpr/html/kinshipDegree/maintenance/ui/kinshipDegreeMaintenance.html'
            })

            .state('healthcare/hpr/kinshipDegree.detail', {         
                url: '/healthcare/hpr/kinshipDegree/detail/:cdGrauParentesco',
                controller: 'hpr.kinshipDegreeMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/healthcare/hpr/html/kinshipDegree/maintenance/ui/kinshipDegreeMaintenance.html'
            });            

});