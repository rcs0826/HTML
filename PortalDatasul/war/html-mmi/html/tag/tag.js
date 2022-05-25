define(['index',
        '/dts/mmi/html/tag/dashboard/dashboard-tag.js',
       '/dts/mmi/js/zoom/tag.js'], function(index) {

    index.stateProvider

        .state('dts/mmi/tag', {
            abstract: true,
            template: '<ui-view/>'
        })

        .state('dts/mmi/tag/dashboard', {
            url:'/dts/mmi/tag/dashboard',
            controller:'mmi.tag.dashboard.DashboardTagCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mmi/html/tag/dashboard/dashboard.tag.html'
        });

});
