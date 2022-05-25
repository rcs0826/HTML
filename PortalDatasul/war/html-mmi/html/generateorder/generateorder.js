define(['index',
        '/dts/mmi/html/generateorder/generateorder.list.js',
        '/dts/mmi/js/utils/mmi-utils.js'
    ], function(index) {

    index.stateProvider

        .state('dts/mmi/generateorder', {
            abstract: true,
            template: '<ui-view/>'
        })

        .state('dts/mmi/generateorder.start', {
            url:'/dts/mmi/generateorder/',
            controller:'mmi.generateorder.ListCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mmi/html/generateorder/generateorder.list.html'
        });
});
