define(['index',
    '/dts/hgp/html/hvp-healthCondVsProcAssoc/controller/healthCondVsProcAssocListController.js',
    '/dts/hgp/html/hvp-healthCondVsProcAssoc/maintenance/controller/healthCondVsProcAssocMaintenanceController.js'], function (index) {

    index.stateProvider 

            .state('dts/hgp/hvp-healthCondVsProcAssoc', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hvp-healthCondVsProcAssoc.start', {
                url: '/dts/hgp/hvp-healthCondVsProcAssoc/?showAsTable',
                controller: 'hvp.healthCondVsProcAssocList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hvp-healthCondVsProcAssoc/ui/healthCondVsProcAssocList.html'
            })
            
            .state('dts/hgp/hvp-healthCondVsProcAssoc.new', {
                url: '/dts/hgp/hvp-healthCondVsProcAssoc/new',
                controller: 'hvp.healthCondVsProcAssocMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hvp-healthCondVsProcAssoc/maintenance/ui/healthCondVsProcAssocMaintenance.html'
            })

            .state('dts/hgp/hvp-healthCondVsProcAssoc.edit', {
                url: '/dts/hgp/hvp-healthCondVsProcAssoc/edit/:cdCondicaoSaude/:cdProcedimento/:dtLimite',
                controller: 'hvp.healthCondVsProcAssocMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hvp-healthCondVsProcAssoc/maintenance/ui/healthCondVsProcAssocMaintenance.html'
            })
            
            .state('dts/hgp/hvp-healthCondVsProcAssoc.detail', {
                url: '/dts/hgp/hvp-healthCondVsProcAssoc/detail/:cdCondicaoSaude/:cdProcedimento/:dtLimite',
                controller: 'hvp.healthCondVsProcAssocMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hvp-healthCondVsProcAssoc/maintenance/ui/healthCondVsProcAssocDetail.html'
            });            
});

