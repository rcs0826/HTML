define(['index',
'/dts/hgp/html/hpp-relatPeona/controller/relatPeonaMainController.js',
'/dts/hgp/html/global/gpsScheduleTotvs.js'


], function (index) {

    index.stateProvider 

            .state('dts/hgp/hpp-relatPeona', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hpp-relatPeona.start', {
                url: '/dts/hgp/hpp-relatPeona',
                controller: 'hpp.relatPeonaMain.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hpp-relatPeona/ui/relatPeonaMain.html'
            })                        
        
});


