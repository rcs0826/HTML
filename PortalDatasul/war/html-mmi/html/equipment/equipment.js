define(['index',
        '/dts/mmi/html/equipment/dashboard/dashboard-equipment.js',
       '/dts/mmi/js/zoom/equipto.js'], function(index) {

    index.stateProvider

        .state('dts/mmi/equipment', {
            abstract: true,
            template: '<ui-view/>'
        })

        .state('dts/mmi/equipment/dashboard', {
            url:'/dts/mmi/equipment/dashboard',
            controller:'mmi.equipment.dashboard.DashboardEquipmentCtrl',
            controllerAs: 'dashboardCtrl',
            templateUrl:'/dts/mmi/html/equipment/dashboard/dashboard.equipment.html'
        });

});
