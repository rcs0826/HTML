define(['index',
'/dts/hgp/html/hfp-saldosProvisaoReceita/controller/saldosProvisaoReceitaMainController.js',
'/dts/hgp/html/global/gpsScheduleTotvs.js'


], function (index) {

    index.stateProvider 

            .state('dts/hgp/hfp-saldosProvisaoReceita', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hfp-saldosProvisaoReceita.start', {
                url: '/dts/hgp/hfp-saldosProvisaoReceita',
                controller: 'hfp.saldosProvisaoReceitaMain.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hfp-saldosProvisaoReceita/ui/saldosProvisaoReceitaMain.html'
            })                        
        
});


