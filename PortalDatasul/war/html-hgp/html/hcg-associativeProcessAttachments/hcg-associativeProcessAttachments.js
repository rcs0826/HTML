define(['index',
		'/dts/hgp/html/hcg-associativeProcessAttachments/controller/associativeProcessAttachmentsListController.js',
		'/dts/hgp/html/hcg-associativeProcessAttachments/maintenance/controller/associativeProcessAttachmentsMaintenanceController.js'], function (index) {

    index.stateProvider 

            .state('dts/hgp/hcg-associativeProcessAttachments', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hcg-associativeProcessAttachments.start', {
                url: '/dts/hgp/hcg-associativeProcessAttachments/?showAsTable',
                controller: 'hcg.associativeProcessAttachmentsList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hcg-associativeProcessAttachments/ui/associativeProcessAttachmentsList.html'
            })
            
            .state('dts/hgp/hcg-associativeProcessAttachments.new', {
                url: '/dts/hgp/hcg-associativeProcessAttachments/new',
                controller: 'hcg.associativeProcessAttachmentsMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hcg-associativeProcessAttachments/maintenance/ui/associativeProcessAttachmentsMaintenance.html'
            })

            .state('dts/hgp/hcg-associativeProcessAttachments.edit', {
                url: '/dts/hgp/hcg-associativeProcessAttachments/edit/:idiGerenciaProcesAnexo',
                controller: 'hcg.associativeProcessAttachmentsMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hcg-associativeProcessAttachments/maintenance/ui/associativeProcessAttachmentsMaintenance.html'
            })
            
            .state('dts/hgp/hcg-associativeProcessAttachments.detail', {
                url: '/dts/hgp/hcg-associativeProcessAttachments/detail/:idiGerenciaProcesAnexo',
                controller: 'hcg.associativeProcessAttachmentsMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hcg-associativeProcessAttachments/maintenance/ui/associativeProcessAttachmentsDetail.html'
            });
            
});

