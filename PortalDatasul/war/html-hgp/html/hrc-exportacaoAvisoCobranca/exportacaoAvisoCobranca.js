define(['index',
'/healthcare/hrc/html/exportacaoAvisoCobranca/controller/exportacaoAvisoCobrancaMainController.js',
'/healthcare/shared/html/global/gpsScheduleTotvs.js'


], function (index) {

    index.stateProvider

            .state('healthcare/hrc/exportacaoAvisoCobranca', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hrc/exportacaoAvisoCobranca.start', {
                url: '/healthcare/hrc/exportacaoAvisoCobranca',
                controller: 'hrc.exportacaoAvisoCobrancaMain.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrc/html/exportacaoAvisoCobranca/ui/exportacaoAvisoCobrancaMain.html'
            })

});


