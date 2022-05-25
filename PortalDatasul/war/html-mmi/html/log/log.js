define(['index',
        '/dts/mmi/html/log/log-list.js',
        '/dts/mmi/html/log/log-edit.js'], function(index) {

    index.stateProvider

        .state('dts/mmi/log', {
            abstract: true,
            template: '<ui-view/>'
        })

        .state('dts/mmi/log.start', {
            url:'/dts/mmi/log/',
            controller:'mmi.log.ListCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mmi/html/log/log.list.html'
        });

});
