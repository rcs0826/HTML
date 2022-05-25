define(['index',
'/healthcare/hrc/html/processaBaixaAviso/controller/processaBaixaAvisoMainController.js',
'/healthcare/shared/html/global/gpsScheduleTotvs.js'


], function (index) {

    index.stateProvider 

            .state('healthcare/hrc/processaBaixaAviso', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hrc/processaBaixaAviso.start', {
                url: '/healthcare/hrc/processaBaixaAviso',
                controller: 'hrc.processaBaixaAvisoMain.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrc/html/processaBaixaAviso/ui/processaBaixaAvisoMain.html'
            })                        
        
});


