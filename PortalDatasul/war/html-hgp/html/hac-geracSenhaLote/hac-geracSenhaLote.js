define(['index',
'/dts/hgp/html/hac-geracSenhaLote/controller/geracSenhaLoteMainController.js',
'/dts/hgp/html/global/gpsScheduleTotvs.js'


], function (index) {

    index.stateProvider 

            .state('dts/hgp/hac-geracSenhaLote', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hac-geracSenhaLote.start', {
                url: '/dts/hgp/hac-geracSenhaLote',
                controller: 'hac.geracSenhaLoteMain.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hac-geracSenhaLote/ui/geracSenhaLoteMain.html'
            })                        
        
});


