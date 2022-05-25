define(['index',
'/healthcare/hrb/html/importCompartRiscoCsv/controller/importCompartRiscoCsvMainController.js',
'/healthcare/shared/html/global/gpsScheduleTotvs.js'


], function (index) {

    index.stateProvider 

            .state('healthcare/hrb/importCompartRiscoCsv', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hrb/importCompartRiscoCsv.start', {
                url: '/healthcare/hrb/importCompartRiscoCsv',
                controller: 'hrb.importCompartRiscoCsvMain.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrb/html/importCompartRiscoCsv/ui/importCompartRiscoCsvMain.html'
            })                        
        
});


