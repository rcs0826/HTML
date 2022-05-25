define(['index',
    '/dts/hgp/html/hrs-documents/controller/documentsListController.js',
    '/dts/hgp/html/hrs-documents/maintenance/controller/documentsMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrs-documents', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrs-documents.start', {
                url: '/dts/hgp/hrs-documents/?showAsTable',
                controller: 'hrs.documentsList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-documents/ui/documentsList.html'
            })
            
            .state('dts/hgp/hrs-documents.new', {
                url: '/dts/hgp/hrs-documents/new',
                controller: 'hrs.documentsMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-documents/maintenance/ui/documentsMaintenance.html'
            })

            .state('dts/hgp/hrs-documents.edit', {
                url: '/dts/hgp/hrs-documents/edit/:idImpugdocs',
                controller: 'hrs.documentsMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-documents/maintenance/ui/documentsMaintenance.html'
            })
            


            .state('dts/hgp/hrs-documents.detail', {         
                url: '/dts/hgp/hrs-documents/detail/:idImpugdocs',
                controller: 'hrs.documentsMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/dts/hgp/html/hrs-documents/maintenance/ui/documentsMaintenance.html'
            });
            
});


