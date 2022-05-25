define(['index',
'/dts/hgp/html/hrc-importInsumos/controller/importInsumosMainController.js',
'/dts/hgp/html/global/gpsScheduleTotvs.js'


], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrc-importInsumos', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrc-importInsumos.start', {
                url: '/dts/hgp/hrc-importInsumos',
                controller: 'hrc.importInsumosMain.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-importInsumos/ui/importInsumosMain.html'
            })                        
        
});

