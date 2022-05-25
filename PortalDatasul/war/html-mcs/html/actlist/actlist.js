define(['index',
        '/dts/mcs/html/actlist/actlist.controller.js',
        '/dts/mcs/html/actlist/actlist.advancedsearch.controller.js',
        '/dts/mcs/js/api/fch/fchmcs/fchmcs0001.js',
        '/dts/mcs/js/cultures/kendo.culture.de-DE.min.js'],function(index) {

    kendo.culture("de-DE");

    index.stateProvider
    
    .state('dts/mcs/actlist', {
        abstract: true,
        template: '<ui-view/>'
    })
    
    .state('dts/mcs/actlist.start', {
        url:'/dts/mcs/actlist/:actType/:site/:date/:periodType',
        controller:'mcs.actlist.controller',
        controllerAs: 'controller',
        templateUrl:'/dts/mcs/html/actlist/actlist.html'
    });
});