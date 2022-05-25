define(['index',
'/dts/hgp/html/hfp-conferenciaProvisaoReceita/controller/conferenciaProvisaoReceitaMainController.js',
'/dts/hgp/html/global/gpsScheduleTotvs.js'


], function (index) {

    index.stateProvider

            .state('dts/hgp/hfp-conferenciaProvisaoReceita', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hfp-conferenciaProvisaoReceita.start', {
                url: '/dts/hgp/hfp-conferenciaProvisaoReceita', 
                controller: 'hfp.conferenciaProvisaoReceitaMain.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hfp-conferenciaProvisaoReceita/ui/conferenciaProvisaoReceitaMain.html'
            })

});


