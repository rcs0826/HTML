define(['index',
    '/dts/hgp/html/hrc-contingAuditPos/controller/contingAuditPosListController.js'
    /*'/dts/hgp/html/hrc-contingAuditPos/maintenance/controller/contingAuditPosMaintenanceController.js'*/
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrc-contingAuditPos', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrc-contingAuditPos.start', {
                url: '/dts/hgp/hrc-contingAuditPos/?showAsTable',
                controller: 'hrc.contingAuditPosList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-contingAuditPos/ui/contingAuditPosList.html'
            });
            
            /*.state('dts/hgp/hrc-contingAuditPos.new', {
                url: '/dts/hgp/hrc-contingAuditPos/new',
                controller: 'hrc.contingAuditPosMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-contingAuditPos/maintenance/ui/contingAuditPosMaintenance.html'
            })

            .state('dts/hgp/hrc-contingAuditPos.edit', {
                url: '/dts/hgp/hrc-contingAuditPos/edit/:cdUnidade/:cdUnidadePrestadora/:cdTransacao/:nrSerieDocOriginal/:nrDocOriginal/:nrDocSistema',
                controller: 'hrc.contingAuditPosMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-contingAuditPos/maintenance/ui/contingAuditPosMaintenance.html'
            })
            


            .state('dts/hgp/hrc-contingAuditPos.detail', {         
                url: '/dts/hgp/hrc-contingAuditPos/detail/:cdUnidade/:cdUnidadePrestadora/:cdTransacao/:nrSerieDocOriginal/:nrDocOriginal/:nrDocSistema',
                controller: 'hrc.contingAuditPosMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/dts/hgp/html/hrc-contingAuditPos/maintenance/ui/contingAuditPosMaintenance.html'
            });*/
            
});


