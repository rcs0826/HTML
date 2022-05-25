define(['index',
    '/healthcare/hvp/html/healthCondVsProcAssoc/controller/healthCondVsProcAssocListController.js',
    '/healthcare/hvp/html/healthCondVsProcAssoc/maintenance/controller/healthCondVsProcAssocMaintenanceController.js'], function (index) {

    index.stateProvider 

            .state('healthcare/hvp/healthCondVsProcAssoc', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hvp/healthCondVsProcAssoc.start', {
                url: '/healthcare/hvp/healthCondVsProcAssoc/?showAsTable',
                controller: 'hvp.healthCondVsProcAssocList.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hvp/html/healthCondVsProcAssoc/ui/healthCondVsProcAssocList.html'
            })
            
            .state('healthcare/hvp/healthCondVsProcAssoc.new', {
                url: '/healthcare/hvp/healthCondVsProcAssoc/new',
                controller: 'hvp.healthCondVsProcAssocMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hvp/html/healthCondVsProcAssoc/maintenance/ui/healthCondVsProcAssocMaintenance.html'
            })

            .state('healthcare/hvp/healthCondVsProcAssoc.edit', {
                url: '/healthcare/hvp/healthCondVsProcAssoc/edit/:cdCondicaoSaude/:cdProcedimento/:dtLimite',
                controller: 'hvp.healthCondVsProcAssocMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hvp/html/healthCondVsProcAssoc/maintenance/ui/healthCondVsProcAssocMaintenance.html'
            })
            
            .state('healthcare/hvp/healthCondVsProcAssoc.detail', {
                url: '/healthcare/hvp/healthCondVsProcAssoc/detail/:cdCondicaoSaude/:cdProcedimento/:dtLimite',
                controller: 'hvp.healthCondVsProcAssocMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hvp/html/healthCondVsProcAssoc/maintenance/ui/healthCondVsProcAssocDetail.html'
            });            
});

