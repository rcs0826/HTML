define(['index',
'/dts/hgp/html/hrb-importCompartRiscoCsv/controller/importCompartRiscoCsvMainController.js',
'/dts/hgp/html/global/gpsScheduleTotvs.js'


], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrb-importCompartRiscoCsv', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrb-importCompartRiscoCsv.start', {
                url: '/dts/hgp/hrb-importCompartRiscoCsv',
                controller: 'hrb.importCompartRiscoCsvMain.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrb-importCompartRiscoCsv/ui/importCompartRiscoCsvMain.html'
            })                        
        
});


