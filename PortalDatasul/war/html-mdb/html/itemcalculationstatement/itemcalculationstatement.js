define(['index',
        '/dts/mdb/html/itemcalculationstatement/itemcalculationstatement-list.controller.js',
        '/dts/mdb/html/itemcalculationstatement/itemcalculationstatement.detail.controller.js',
        '/dts/mdb/html/itemcalculationstatement/itemcalculationstatement.services.js',
        '/dts/mdb/html/itemcalculationstatement/itemcalculationstatement.search.controller.js',
        '/dts/mdb/html/itemcalculationstatement/itemcalculationstatement.parameters.controller.js',
        '/dts/mdb/js/api/fch/fchmdb/fchmdb0001.js',
        '/dts/mdb/js/cultures/kendo.culture.de-DE.min.js'],function(index) {

        kendo.culture("de-DE");

        // Inicializa os states da aplica��o.
        index.stateProvider

        .state('dts/mdb/itemcalculationstatement', {
            abstract: true,
            template: '<ui-view/>'
        })
     
        .state('dts/mdb/itemcalculationstatement.start', {
            url:'/dts/mdb/itemcalculationstatement/:scenario/:simulation/',
            controller:'mdb.itemcalculationstatement-list.controller',
            controllerAs: 'controller',
            templateUrl:'/dts/mdb/html/itemcalculationstatement/itemcalculationstatement-list.html'
        })

        .state('dts/mdb/itemcalculationstatement.detail', {
            url: '/dts/mdb/itemcalculationstatement/detail/:scenario/:logPerda/:item/:refer/:simulation',
            controller: 'mdb.itemcalculationstatement.detail.controller',
            controllerAs: 'controller',
            templateUrl: '/dts/mdb/html/itemcalculationstatement/itemcalculationstatement.detail.html'
        });
});