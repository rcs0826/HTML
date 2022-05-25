define(['index',
'/dts/hgp/html/hpp-sinistrosLiquidar/controller/sinistrosLiquidarMainController.js',
'/dts/hgp/html/global/gpsScheduleTotvs.js'


], function (index) {

    index.stateProvider 

            .state('dts/hgp/hpp-sinistrosLiquidar', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hpp-sinistrosLiquidar.start', {
                url: '/dts/hgp/hpp-sinistrosLiquidar',
                controller: 'hpp.sinistrosLiquidarMain.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hpp-sinistrosLiquidar/ui/sinistrosLiquidarMain.html'
            })                        
        
});


