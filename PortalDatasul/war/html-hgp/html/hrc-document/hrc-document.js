define(['index',
    '/dts/hgp/html/js/global/healthcare-main.js',
    '/dts/hgp/html/hrc-document/documentFactory.js',
    '/dts/hgp/html/hrc-document/controller/documentListController.js',
    '/dts/hgp/html/hrc-document/maintenance/controller/documentMaintenanceController.js',
    '/dts/hgp/html/hrc-document/controller/linkMultipleDocumentsController.js'], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrc-document', {
                abstract: true,
                template: '<ui-view/>'
            })

            /* Definido para abrir a tela de Vincular documentos */
            .state('dts/hgp/hrc-linkDocuments', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrc-document.start', {
                url: '/dts/hgp/hrc-document/?showAsTable',
                controller: 'hrc.documentList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-document/ui/document.list.html'
            })
            
            .state('dts/hgp/hrc-document.new', {
                url: '/dts/hgp/hrc-document/new',
                controller: 'hrc.documentMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-document/maintenance/ui/document.maintenance.html'
            })

            .state('dts/hgp/hrc-document.edit', {
                url: '/dts/hgp/hrc-document/edit/:cdUnidade/:cdUnidadePrestadora/:cdTransacao/:nrSerieDocOriginal/:nrDocOriginal/:nrDocSistema',
                controller: 'hrc.documentMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-document/maintenance/ui/document.maintenance.html'
            })
            
            .state('dts/hgp/hrc-document.detail', {
                url: '/dts/hgp/hrc-document/detail/:cdUnidade/:cdUnidadePrestadora/:cdTransacao/:nrSerieDocOriginal/:nrDocOriginal/:nrDocSistema',
                controller: 'hrc.documentMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-document/maintenance/ui/document.maintenance.html'
            })

            .state('dts/hgp/hrc-document.detailEventNotice', {
                url: '/dts/hgp/hrc-document/detailEventNotice/:idSeqHistorDocrecon/:idSeqAvisoCob',
                controller: 'hrc.documentMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-document/maintenance/ui/document.maintenance.html'
            })


            .state('dts/hgp/hrc-linkDocuments.edit', {
                params: {disclaimers: undefined,
                         config: undefined,
                         tmpUnselectedDocuments: undefined},
                url: '/dts/hgp/hrc-document/linkDocuments/',
                controller: 'hrc.linkMultipleDocuments.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-document/ui/linkMultipleDocuments.html',
            });
});
