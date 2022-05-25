define(['index',
        '/dts/mcs/html/realforecastedcost/realforecastedcost-list.controller.js',
        '/dts/mcs/html/realforecastedcost/realforecastedcost-advancedsearch.controller.js',
        '/dts/mcs/js/api/fch/fchmcs/fchmcs0002.js',
        '/dts/mcs/js/api/fch/fchmcs/fchmcs0003.js',
        '/dts/mcs/js/zoom/estabelec.js',
        '/dts/men/js/zoom/item.js',
        '/dts/mcs/js/cultures/kendo.culture.de-DE.min.js'],function(index) {

        kendo.culture("de-DE");

        // Inicializa os states da aplicacao.
        index.stateProvider

        .state('dts/mcs/realforecastedcost', {
            abstract: true,
            template: '<ui-view/>'
        })

        .state('dts/mcs/realforecastedcost.start', {
            url:'/dts/mcs/realforecastedcost/:site/:date',
            controller:'mcs.realforecastedcost-list.controller',
            controllerAs: 'controller',
            templateUrl:'/dts/mcs/html/realforecastedcost/realforecastedcost-list.html'
        });
});