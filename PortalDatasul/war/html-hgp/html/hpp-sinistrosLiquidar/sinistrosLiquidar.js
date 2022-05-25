define(['index',
'/healthcare/hpp/html/sinistrosLiquidar/controller/sinistrosLiquidarMainController.js',
'/healthcare/shared/html/global/gpsScheduleTotvs.js'


], function (index) {

    index.stateProvider 

            .state('healthcare/hpp/sinistrosLiquidar', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hpp/sinistrosLiquidar.start', {
                url: '/healthcare/hpp/sinistrosLiquidar',
                controller: 'hpp.sinistrosLiquidarMain.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hpp/html/sinistrosLiquidar/ui/sinistrosLiquidarMain.html'
            })                        
        
});


