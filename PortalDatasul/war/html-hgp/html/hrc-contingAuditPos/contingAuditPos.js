define(['index',
    '/healthcare/hrc/html/contingAuditPos/controller/contingAuditPosListController.js'
    /*'/healthcare/hrc/html/contingAuditPos/maintenance/controller/contingAuditPosMaintenanceController.js'*/
], function (index) {

    index.stateProvider 

            .state('healthcare/hrc/contingAuditPos', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hrc/contingAuditPos.start', {
                url: '/healthcare/hrc/contingAuditPos/?showAsTable',
                controller: 'hrc.contingAuditPosList.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrc/html/contingAuditPos/ui/contingAuditPosList.html'
            });
            
            /*.state('healthcare/hrc/contingAuditPos.new', {
                url: '/healthcare/hrc/contingAuditPos/new',
                controller: 'hrc.contingAuditPosMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrc/html/contingAuditPos/maintenance/ui/contingAuditPosMaintenance.html'
            })

            .state('healthcare/hrc/contingAuditPos.edit', {
                url: '/healthcare/hrc/contingAuditPos/edit/:cdUnidade/:cdUnidadePrestadora/:cdTransacao/:nrSerieDocOriginal/:nrDocOriginal/:nrDocSistema',
                controller: 'hrc.contingAuditPosMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrc/html/contingAuditPos/maintenance/ui/contingAuditPosMaintenance.html'
            })
            


            .state('healthcare/hrc/contingAuditPos.detail', {         
                url: '/healthcare/hrc/contingAuditPos/detail/:cdUnidade/:cdUnidadePrestadora/:cdTransacao/:nrSerieDocOriginal/:nrDocOriginal/:nrDocSistema',
                controller: 'hrc.contingAuditPosMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/healthcare/hrc/html/contingAuditPos/maintenance/ui/contingAuditPosMaintenance.html'
            });*/
            
});


