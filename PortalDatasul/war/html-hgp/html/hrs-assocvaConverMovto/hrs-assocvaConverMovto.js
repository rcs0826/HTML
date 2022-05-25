define(['index',
    '/dts/hgp/html/hrs-assocvaConverMovto/controller/assocvaConverMovtoListController.js',
    '/dts/hgp/html/hrs-assocvaConverMovto/maintenance/controller/assocvaConverMovtoMaintenanceController.js'], function (index) {

        index.stateProvider

            .state('dts/hgp/hrs-assocvaConverMovto', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrs-assocvaConverMovto.start', {
                url: '/dts/hgp/hrs-assocvaConverMovto/?showAsTable',
                controller: 'hrs.assocvaConverMovtoList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-assocvaConverMovto/ui/assocvaConverMovtoList.html'
            })

            .state('dts/hgp/hrs-assocvaConverMovto.new', {
                url: '/dts/hgp/hrs-assocvaConverMovto/new',
                controller: 'hrs.assocvaConverMovtoMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-assocvaConverMovto/maintenance/ui/assocvaConverMovtoMaintenance.html'
            })

            .state('dts/hgp/hrs-assocvaConverMovto.edit', {
                url: '/dts/hgp/hrs-assocvaConverMovto/edit/:cddMovtoExt/:codIndicador/:cdProcedimentoCompleto/:cdTipoInsumo/:cdInsumo',
                controller: 'hrs.assocvaConverMovtoMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-assocvaConverMovto/maintenance/ui/assocvaConverMovtoMaintenance.html'
            })

            .state('dts/hgp/hrs-assocvaConverMovto.detail', {
                url: '/dts/hgp/hrs-assocvaConverMovto/detail/:cddMovtoExt/:codIndicador/:cdProcedimentoCompleto/:cdTipoInsumo/:cdInsumo',
                controller: 'hrs.assocvaConverMovtoMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-assocvaConverMovto/maintenance/ui/assocvaConverMovtoMaintenance.html'
            });
    });