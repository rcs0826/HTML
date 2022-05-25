define(['index',
'/healthcare/hrb/html/identificaCompartRisco/controller/identificaCompartRiscoMainController.js',
'/healthcare/shared/html/global/gpsScheduleTotvs.js'


], function (index) {

    index.stateProvider

            .state('healthcare/hrb/identificaCompartRisco', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hrb/identificaCompartRisco.start', {
                url: '/healthcare/hrb/identificaCompartRisco',
                controller: 'hrb.identificaCompartRiscoMain.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrb/html/identificaCompartRisco/ui/identificaCompartRiscoMain.html'
            })

});


