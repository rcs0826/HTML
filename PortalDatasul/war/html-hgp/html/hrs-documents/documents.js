define(['index',
    '/healthcare/hrs/html/documents/controller/documentsListController.js',
    '/healthcare/hrs/html/documents/maintenance/controller/documentsMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('healthcare/hrs/documents', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hrs/documents.start', {
                url: '/healthcare/hrs/documents/?showAsTable',
                controller: 'hrs.documentsList.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrs/html/documents/ui/documentsList.html'
            })
            
            .state('healthcare/hrs/documents.new', {
                url: '/healthcare/hrs/documents/new',
                controller: 'hrs.documentsMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrs/html/documents/maintenance/ui/documentsMaintenance.html'
            })

            .state('healthcare/hrs/documents.edit', {
                url: '/healthcare/hrs/documents/edit/:idImpugdocs',
                controller: 'hrs.documentsMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrs/html/documents/maintenance/ui/documentsMaintenance.html'
            })
            


            .state('healthcare/hrs/documents.detail', {         
                url: '/healthcare/hrs/documents/detail/:idImpugdocs',
                controller: 'hrs.documentsMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/healthcare/hrs/html/documents/maintenance/ui/documentsMaintenance.html'
            });
            
});


