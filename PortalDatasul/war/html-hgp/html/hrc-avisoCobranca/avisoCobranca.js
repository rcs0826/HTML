define(['index',
'/healthcare/hrc/html/avisoCobranca/controller/avisoCobrancaMainController.js',
'/healthcare/shared/html/global/gpsScheduleTotvs.js'


], function (index) {

    index.stateProvider 

            .state('healthcare/hrc/avisoCobranca', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hrc/avisoCobranca.start', {
                url: '/healthcare/hrc/avisoCobranca',
                controller: 'hrc.avisoCobrancaMain.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrc/html/avisoCobranca/ui/avisoCobrancaMain.html'
            })                        
        
});


