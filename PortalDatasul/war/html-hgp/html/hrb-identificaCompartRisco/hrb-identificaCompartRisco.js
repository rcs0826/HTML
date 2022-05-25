define(['index',
'/dts/hgp/html/hrb-identificaCompartRisco/controller/identificaCompartRiscoMainController.js',
'/dts/hgp/html/global/gpsScheduleTotvs.js'


], function (index) {

    index.stateProvider

            .state('dts/hgp/hrb-identificaCompartRisco', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrb-identificaCompartRisco.start', {
                url: '/dts/hgp/hrb-identificaCompartRisco',
                controller: 'hrb.identificaCompartRiscoMain.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrb-identificaCompartRisco/ui/identificaCompartRiscoMain.html'
            })

});


