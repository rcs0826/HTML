define(['index',
'/dts/hgp/html/hrc-exportacaoAvisoCobranca/controller/exportacaoAvisoCobrancaMainController.js',
'/dts/hgp/html/global/gpsScheduleTotvs.js'


], function (index) {

    index.stateProvider

            .state('dts/hgp/hrc-exportacaoAvisoCobranca', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrc-exportacaoAvisoCobranca.start', {
                url: '/dts/hgp/hrc-exportacaoAvisoCobranca',
                controller: 'hrc.exportacaoAvisoCobrancaMain.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-exportacaoAvisoCobranca/ui/exportacaoAvisoCobrancaMain.html'
            })

});


