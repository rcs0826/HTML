define(['index',
'/dts/hgp/html/hpp-descalcPagPrest/controller/descalcPagPrestMainController.js',
'/dts/hgp/html/global/gpsScheduleTotvs.js'


], function (index) {

    index.stateProvider 

            .state('dts/hgp/hpp-descalcPagPrest', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hpp-descalcPagPrest.start', {
                url: '/dts/hgp/hpp-descalcPagPrest',
                controller: 'hpp.descalcPagPrestMain.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hpp-descalcPagPrest/ui/descalcPagPrestMain.html'
            })                        
        
});


