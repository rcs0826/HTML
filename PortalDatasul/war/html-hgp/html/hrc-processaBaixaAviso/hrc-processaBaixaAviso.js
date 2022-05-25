define(['index',
'/dts/hgp/html/hrc-processaBaixaAviso/controller/processaBaixaAvisoMainController.js',
'/dts/hgp/html/global/gpsScheduleTotvs.js'


], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrc-processaBaixaAviso', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrc-processaBaixaAviso.start', {
                url: '/dts/hgp/hrc-processaBaixaAviso',
                controller: 'hrc.processaBaixaAvisoMain.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-processaBaixaAviso/ui/processaBaixaAvisoMain.html'
            })                        
        
});


