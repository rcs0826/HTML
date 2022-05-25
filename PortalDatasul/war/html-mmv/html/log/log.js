define(['index',
        '/dts/mmi/html/log/log-list.js',
        '/dts/mmi/html/log/log-edit.js'], function(index) {

    index.stateProvider

        .state('dts/mmv/log', {
            abstract: true,
            template: '<ui-view/>'
        })

        .state('dts/mmv/log.start', {
            url:'/dts/mmv/log/',
            controller:'mmi.log.ListCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mmi/html/log/log.list.html'
        });

});
