define(['index',
'/dts/hgp/html/hrc-avisoCobranca/controller/avisoCobrancaMainController.js',
'/dts/hgp/html/global/gpsScheduleTotvs.js'


], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrc-avisoCobranca', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrc-avisoCobranca.start', {
                url: '/dts/hgp/hrc-avisoCobranca',
                controller: 'hrc.avisoCobrancaMain.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-avisoCobranca/ui/avisoCobrancaMain.html'
            })                        
        
});


