define(['index',
    '/dts/hgp/html/js/global/healthcare-main.js',
    '/dts/hgp/html/hrc-documentosExportAvisosCob/documentosExportAvisosCobFactory.js',
    '/dts/hgp/html/hrc-documentosExportAvisosCob/controller/documentosExportAvisosCobListController.js'], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrc-documentosExportAvisosCob', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrc-documentosExportAvisosCob.start', {
                url: '/dts/hgp/hrc-documentosExportAvisosCob/?showAsTable',
                controller: 'hrc.documentosExportAvisosCobList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-documentosExportAvisosCob/ui/documentosExportAvisosCob.list.html'
            })
            
});
