define(['index',
        '/dts/mmi/html/sprint/sprint-planning.js',
        '/dts/mmi/html/sprint/dashboard/dashboard-maintenance.js',
        '/dts/mmi/html/sprint/listaordem/lista-ordem.js',
        '/dts/mmi/html/sprint/history/ordem-history.js'], function(index) {

    index.stateProvider

        .state('dts/mmi/sprint', {
            abstract: true,
            template: '<ui-view/>'
        })

        .state('dts/mmi/sprint.start', {
            url:'/dts/mmi/sprint/',
            controller:'mmi.sprint.PlanningCtrl',
            controllerAs: 'planningCtrl',
            templateUrl:'/dts/mmi/html/sprint/sprint.planning.html'
        })

        .state('dts/mmi/sprint/dashboard', {
            url:'/dts/mmi/sprint/dashboard',
            controller:'mmi.sprint.dashboard.DashboardMaintenanceCtrl',
            controllerAs: 'dashboardCtrl',
            templateUrl:'/dts/mmi/html/sprint/dashboard/dashboard.maintenance.html'
        })
        
        .state('dts/mmi/sprint/orderlist', {
            url:'/dts/mmi/sprint/orderlist',
            controller:'mmi.sprint.listaordem.ListaOrdemCtrl',
            controllerAs: 'listaordemCtrl',
            templateUrl:'/dts/mmi/html/sprint/listaordem/lista.ordem.html'
        })
    
        .state('dts/mmi/sprint/history', {
            url:'/dts/mmi/sprint/history',
            controller:'mmi.sprint.history.HistoricoCtrl',
            controllerAs: 'historicoCtrl',
            templateUrl:'/dts/mmi/html/sprint/history/ordem.history.html'
        });

});
